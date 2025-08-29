import { Parser, Renderer, Token, Tokens } from 'marked';
import GithubSlugger from 'github-slugger';
import {
  Heading,
  HeadingWithChapterNumber,
  MarkedTableOfContentsExtensionOptions,
} from './types';
import { renderTableOfContent } from './renderTableOfContents';
import { fixHeadingDepthFactory } from './fixHeadingDepthFactory';
import { numberingHeadingFactory } from './numberingHeadingFactory';

export default function markedTableOfContentsExtension(
  options?: MarkedTableOfContentsExtensionOptions
) {
  const {
    className,
    renderChapterNumber,
    classNamePrefix,
    generateHeaderId,
    headerIdPrefix = '',
    tocTitle,
  } = options || {};
  const slugger = new GithubSlugger();

  let headings: Tokens.Heading[] = [];
  let fixHeadingDepth: ((heading: Heading) => void) | null = null;
  let numberingHeading: ((heading: Heading) => void) | null = null;
  // save for use in `rendererHeadingWithChapterNumber`
  let chapterNumbers: Array<string> = [];
  let tocCache: string | null = null;

  const walkTokens = (token: Token) => {
    const { type } = token;
    if (type === 'heading' && 'depth' in token && 'text' in token) {
      fixHeadingDepth?.(token as Tokens.Heading);
      numberingHeading?.(token as Tokens.Heading);
      chapterNumbers.push(
        (token as unknown as HeadingWithChapterNumber).chapterNumberHeading
      );
      headings.push(token as Tokens.Heading);
    }
  };

  function renderToc(parser: Parser) {
    if (headings.length && !tocCache) {
      headings.forEach((heading) => {
        heading.text = parser.parseInline(heading.tokens);
      });
      tocCache =
        renderTableOfContent(headings, {
          classNamePrefix,
          generateHeaderId,
          headerIdPrefix,
          /**
           * use a new slugger as GithubSlugger remembers the tokens processed
           * when rendering headings in the custom renderer function 'heading',
           * and a number is appended to remove duplication which is not wanted.
           */
          slugger: new GithubSlugger(),
        }) + '\n';
    }
  }

  const tableOfContentsExtension = {
    name: 'toc',
    level: 'block' as const,
    start(src: string) {
      return src.match(/^\[TOC]\s*(\n|$)/i)?.index;
    },
    tokenizer(src: string) {
      const match = /^\[TOC]\s*(\n|$)/i.exec(src);
      if (match) {
        return {
          type: 'toc',
          raw: match[0],
        };
      }
    },
    renderer(this: { parser: Parser }) {
      renderToc(this.parser);
      const title = tocTitle ? `<h2 class="toc-title">${tocTitle}</h2>` : '';
      return `<nav class="${className}">${title}${tocCache}</nav>`;
    },
  };

  const rendererHeadingWithChapterNumber = {
    heading(this: Renderer, { tokens, depth }: Tokens.Heading) {
      const text = this.parser.parseInline(tokens);

      const chapterNumber = renderChapterNumber ? chapterNumbers.shift() : null;
      const id = generateHeaderId
        ? `${headerIdPrefix}${slugger.slug(text)}`
        : null;

      const idAttr = id ? ` id="${id}"` : '';
      const chapterNumberText = chapterNumber ? `${chapterNumber}` : '';

      return `<h${depth}${idAttr}>${chapterNumberText}${text}</h${depth}>\n`;
    },
  };

  function init() {
    slugger.reset();

    if (!fixHeadingDepth) {
      fixHeadingDepth = fixHeadingDepthFactory();
    }

    if (!numberingHeading && renderChapterNumber) {
      numberingHeading = numberingHeadingFactory(
        renderChapterNumber === true ? undefined : renderChapterNumber
      );
    }
  }

  function cleanUp() {
    headings = [];
    chapterNumbers = [];
    fixHeadingDepth = null;
    numberingHeading = null;
    tocCache = null;
  }

  const hooks = {
    preprocess: (markdown: string) => {
      init();
      return markdown;
    },
    postprocess: (html: string) => {
      cleanUp();
      return html;
    },
  };

  return {
    hooks,
    extensions: [tableOfContentsExtension],
    walkTokens,
    renderer:
      renderChapterNumber || generateHeaderId
        ? rendererHeadingWithChapterNumber
        : undefined,
  };
}
