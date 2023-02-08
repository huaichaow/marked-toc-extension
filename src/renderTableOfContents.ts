import { Heading, Headings, HeadingWithChapterNumber } from './types';
import { fixHeadingDepthFactory } from './fixHeadingDepthFactory';

function fixHeadingDepth(headings: Headings): Headings {
  const fixHeadingDepth = fixHeadingDepthFactory();
  headings.forEach((heading) => fixHeadingDepth(heading));
  return headings;
}

function renderTreeStructureHeadings(headings: Headings, className?: string): string {
  let outermost = true;
  const tokens: Array<string> = [];

  function addTocItem(heading: Heading) {
    const chapterNumber = (heading as HeadingWithChapterNumber).chapterNumberTOC;
    tokens.push(`<li>${chapterNumber} ${heading.text}</li>`);
  }

  function openLevel() {
    if (outermost && className) {
      outermost = false;
      tokens.push(`<ul class="${className}">`);
    } else {
      tokens.push(`<ul>`);
    }
  }

  function closeLevel(count: number) {
    Array(count)
      .fill(0)
      .forEach(() => {
        tokens.push(`</ul>`);
      });
  }

  headings.reduce((prev, next) => {
    const diff = next.depth - prev.depth;
    if (diff === 0) {
      addTocItem(next);
    } else if (diff > 0) {
      openLevel();
      addTocItem(next);
    } else {
      closeLevel(-diff);
      addTocItem(next);
    }
    return next;
  }, { text: '', depth: 0 });

  closeLevel(headings[headings.length - 1].depth);

  return tokens.join('');
}

export function renderTableOfContent(headings: Headings, className?: string) {
  return renderTreeStructureHeadings(fixHeadingDepth(headings), className);
}
