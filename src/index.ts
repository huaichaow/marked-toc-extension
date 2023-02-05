import { marked } from 'marked';
import Token = marked.Token;
import { renderTableOfContent } from './renderTableOfContents';

export default function markedTableOfContentsExtension() {
  let headings: Array<{ text: string; depth: number }> | null = null;
  let cache: string;

  const walkTokens = (token: Token) => {
    const { type } = token;
    if (type === 'heading') {
      if (!headings) {
        headings = [];
      }
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
        cache = renderTableOfContent(headings) + '\n';
        // clear headings for next run, to prevent headings cumulating and memory leak
        headings = null;
      }
      return cache;
    }
  };

  return { extensions: [tableOfContentsExtension], walkTokens };
}
