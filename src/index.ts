import { marked, Parser, Renderer, Slugger } from 'marked';
import Token = marked.Token;
import {
  Heading,
  HeadingWithChapterNumber,
  MarkedTableOfContentsExtensionOptions,
} from './types';
import { renderTableOfContent } from './renderTableOfContents';
import { fixHeadingDepthFactory } from './fixHeadingDepthFactory';
import { numberingHeadingFactory } from './numberingHeadingFactory';
import MarkedOptions = marked.MarkedOptions;

export default function markedTableOfContentsExtension(
  options?: MarkedTableOfContentsExtensionOptions,
) {
  const { className, renderChapterNumber } = options || {};

  let headings: Array<{ text: string; depth: number }> = [];
  let fixHeadingDepth: ((heading: Heading) => void) | null = null;
  let numberingHeading: ((heading: Heading) => void) | null = null;
  // save for use in `rendererHeadingWithChapterNumber`
  let chapterNumbers: Array<string> = [];
  let tocCache: string | null = null;

  const walkTokens = (token: Token) => {
    const { type } = token;
    if (type === 'heading') {
      fixHeadingDepth?.(token);
      numberingHeading?.(token);
      chapterNumbers.push((token as unknown as HeadingWithChapterNumber).chapterNumberHeading);
      headings.push(token);
    }
  };

  function renderToc(markedOption: MarkedOptions) {
    if (headings.length && !tocCache) {
      const { headerPrefix, headerIds } = markedOption;
      tocCache = renderTableOfContent(headings, {
        className,
        headerIds,
        headerPrefix,
        slugger: new Slugger(),
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
      renderToc(this.parser.options);
      return tocCache;
    }
  };

  const rendererHeadingWithChapterNumber = {
    heading(this: Renderer, text: string, level: number, raw: string, slugger: Slugger) {
      const chapterNumber = chapterNumbers.shift();

      const id = this.options.headerIds
        ? this.options.headerPrefix + slugger.slug(text)
        : null;

      const idAttr = id ? ` id="${id}"` : '';

      return `<h${level}${idAttr}>${chapterNumber} ${text}</h${level}>\n`;
    }
  };

  function init() {
    if (!fixHeadingDepth) {
      fixHeadingDepth = fixHeadingDepthFactory();
    }
    if (!numberingHeading) {
      numberingHeading = numberingHeadingFactory(renderChapterNumber);
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
    renderer: rendererHeadingWithChapterNumber,
  };
}
