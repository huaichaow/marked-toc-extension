import { marked, Renderer, Slugger } from 'marked';
import Token = marked.Token;
import {
	Heading,
	HeadingWithChapterNumber,
	MarkedTableOfContentsExtensionOptions,
} from './types';
import { renderTableOfContent } from './renderTableOfContents';
import { fixHeadingDepthFactory } from './fixHeadingDepthFactory';
import { numberingHeadingFactory } from './numberingHeadingFactory';

export default function markedTableOfContentsExtension(
	options?: MarkedTableOfContentsExtensionOptions,
) {
	const { className, renderChapterNumberHeading, renderChapterNumberTOC } = options || {};

  let headings: Array<{ text: string; depth: number }> | null = null;
  let fixHeadingDepth: ((heading: Heading) => void) | null = null;
  let numberingHeading: ((heading: Heading) => void) | null = null;
  // save for use in `rendererHeadingWithChapterNumber`
  let chapterNumbers: Array<string> = [];
  let tocCache: string;

  const walkTokens = (token: Token) => {
    const { type } = token;
    if (type === 'heading') {
      // todo: add PR to `marked` and add hooks to use here for initializing and clean up,
      //  e.g., `beforeParse`, `beforeWalkTokens`
      if (!headings) {
        headings = [];
        chapterNumbers = [];
      }
      if (!fixHeadingDepth) {
        fixHeadingDepth = fixHeadingDepthFactory();
      }
      if (!numberingHeading) {
        numberingHeading = numberingHeadingFactory(
          renderChapterNumberTOC,
          renderChapterNumberHeading,
        );
      }
      fixHeadingDepth(token);
      numberingHeading(token);
      chapterNumbers.push((token as unknown as HeadingWithChapterNumber).chapterNumberHeading);
      headings.push(token);
    }
  };

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
    renderer() {
      if (headings) {
        tocCache = renderTableOfContent(headings, className) + '\n';
        // clear headings for next run, to prevent headings cumulating and memory leak
        headings = null;
        fixHeadingDepth = null;
        numberingHeading = null;
      }
      return tocCache;
    }
  };

  const rendererHeadingWithChapterNumber = {
    heading(this: Renderer, text: string, level: number, raw: string, slugger: Slugger) {
      const chapterNumber = chapterNumbers.shift();

      const id = this.options.headerIds
        ? this.options.headerPrefix + slugger.slug(raw)
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
