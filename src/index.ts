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

  let headings: Array<{ text: string; depth: number }> | null = null;
  let fixHeadingDepth: ((heading: Heading) => void) | null = null;
  let numberingHeading: ((heading: Heading) => void) | null = null;
  // save for use in `rendererHeadingWithChapterNumber`
  let chapterNumbers: Array<string> = [];
  let tocCache: string;

  let slug: ((value: string) => string) | null;

  const walkTokens = (token: Token) => {
    const { type } = token;
    if (type === 'heading') {
      // todo: add PR to `marked` and add hooks to use here for initializing and clean up,
      //  e.g., `beforeParse`, `beforeWalkTokens`
      if (!headings) {
        headings = [];
        chapterNumbers = [];
      }
      if (!slug) {
        // fixme: this may break in the future as marked might accept customize Slugger in the future
        const slugger = new Slugger();
        slug = slugger.slug.bind(slugger);
      }
      if (!fixHeadingDepth) {
        fixHeadingDepth = fixHeadingDepthFactory();
      }
      if (!numberingHeading) {
        numberingHeading = numberingHeadingFactory(renderChapterNumber);
      }
      fixHeadingDepth(token);
      numberingHeading(token);
      chapterNumbers.push((token as unknown as HeadingWithChapterNumber).chapterNumberHeading);
      headings.push(token);
    }
  };

  function renderToc(markedOption: MarkedOptions) {
    if (headings) {
      const { headerPrefix, headerIds } = markedOption;
      tocCache = renderTableOfContent(headings, {
        className,
        headerIds,
        headerPrefix,
        slug: slug || undefined,
      }) + '\n';
      // clear headings for next run, to prevent headings cumulating and memory leak
      headings = null;
      fixHeadingDepth = null;
      numberingHeading = null;
      slug = null;
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
        const token = {
          type: 'toc',
          raw: match[0],
        };
        return token;
      }
    },
    renderer(this: { parser: Parser }) {
      renderToc(this.parser.options);
      return tocCache;
    }
  };

  const rendererHeadingWithChapterNumber = {
    heading(this: Renderer, text: string, level: number, raw: string, slugger: Slugger) {
      // fixme: this is to ensure clean of 'headings' when `[toc]' not present in markdown input
      renderToc(this.options);

      const chapterNumber = chapterNumbers.shift();

      const id = this.options.headerIds
        // todo: use the global 'slug' defined in this file to align with
        //  the usage in renderTableOfContent
        ? this.options.headerPrefix + slugger.slug(text)
        : null;

      const idAttr = id ? ` id="${id}"` : '';

      return `<h${level}${idAttr}>${chapterNumber} ${text}</h${level}>\n`;
    }
  };

  return {
    extensions: [tableOfContentsExtension],
    walkTokens,
    renderer: rendererHeadingWithChapterNumber,
  };
}
