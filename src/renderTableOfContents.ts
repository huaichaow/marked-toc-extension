import { Heading, Headings } from './types';
import { fixHeadingDepthFactory } from './fixHeadingDepthFactory';

function fixHeadingDepth(headings: Headings): Headings {
  const fixHeadingDepth = fixHeadingDepthFactory();
  headings.forEach((heading) => fixHeadingDepth(heading));
  return headings;
}

function renderTreeStructureHeadings(headings: Headings): string {
  const tokens: Array<string> = [];

  function newItem(heading: Heading) {
    tokens.push(`<li>${heading.text}</li>`);
  }

  function openLevel(heading: Heading) {
    tokens.push(`<ul>`);
    newItem(heading);
  }

  function closeLevel() {
    tokens.push(`</ul>`);
  }

  headings.reduce((prev, next) => {
    const diff = next.depth - prev.depth;
    if (diff === 0) {
      newItem(next);
    } else if (diff > 0) {
      openLevel(next);
    } else {
      Array(-diff).fill(0).forEach(closeLevel);
      newItem(next);
    }
    return next;
  }, { text: '', depth: 0 });

  Array(headings[headings.length - 1].depth).fill(0).forEach(closeLevel);

  return tokens.join('');
}

export function renderTableOfContent(headings: Headings) {
  return renderTreeStructureHeadings(fixHeadingDepth(headings));
}
