import { marked } from 'marked';
import Token = marked.Token;
import { Heading } from './types';
import { renderTableOfContent } from './renderTableOfContents';
import { fixHeadingDepthFactory } from './fixHeadingDepthFactory';

export default function markedTableOfContentsExtension() {
  let headings: Array<{ text: string; depth: number }> | null = null;
  let fixHeadingDepth: ((heading: Heading) => void) | null = null;
  let tocCache: string;

  const walkTokens = (token: Token) => {
    const { type } = token;
    if (type === 'heading') {
      if (!headings) {
        headings = [];
      }
      if (!fixHeadingDepth) {
        fixHeadingDepth = fixHeadingDepthFactory();
      }
      fixHeadingDepth(token);
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
        tocCache = renderTableOfContent(headings) + '\n';
        // clear headings for next run, to prevent headings cumulating and memory leak
        headings = null;
        fixHeadingDepth = null;
      }
      return tocCache;
    }
  };

  return { extensions: [tableOfContentsExtension], walkTokens };
}
