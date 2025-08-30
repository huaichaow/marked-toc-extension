import { Headings } from './types';
import { Marked, marked } from 'marked';

export function createHeadings(depths: Array<number>): Headings {
  return depths.map((depth) => ({ text: `heading ${depth}`, depth }));
}

export function fixMarkdownText(md: string) {
  return md.replace(/^\s+/gm, '');
}

export function compactHtml(html: string) {
  return html.replace(/\n+\s*/g, '');
}

export function testMarkedOutput(
  md: string,
  received: string,
  markedInstance?: Marked
) {
  const mdInstance = markedInstance || marked;
  expect(
    compactHtml(mdInstance.parse(fixMarkdownText(md), { async: false }))
  ).toEqual(compactHtml(received));
}
