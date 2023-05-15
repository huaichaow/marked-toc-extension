import { Headings } from './types';
import { marked } from 'marked';

export function createHeadings(depths: Array<number>): Headings {
  return depths.map((depth) => ({ text: `heading ${depth}`, depth }));
}

export function fixMarkdownText(md: string) {
  return md.replace(/^\s+/gm, '');
}

export function compactHtml(html: string) {
  return html.replace(/\n+\s*/g, '');
}

export function testMarkedOutput(md: string, received: string) {
  expect(compactHtml(marked.parse(fixMarkdownText(md))))
    .toEqual(compactHtml(received));
}
