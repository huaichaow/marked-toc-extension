import { Headings } from './types';

export function createHeadings(depths: Array<number>): Headings {
  return depths.map((depth) => ({ text: `heading ${depth}`, depth }));
}
