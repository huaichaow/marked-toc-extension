import {
  Heading,
  Headings,
  HeadingWithChapterNumber,
  RenderTableOfContentsOptions,
} from './types';
import { fixHeadingDepthFactory } from './fixHeadingDepthFactory';

function fixHeadingDepth(headings: Headings): Headings {
  const fixHeadingDepth = fixHeadingDepthFactory();
  headings.forEach((heading) => fixHeadingDepth(heading));
  return headings;
}

function createHeadingIdFactory(options: RenderTableOfContentsOptions) {
  const { headerPrefix, headerIds, slug } = options;

  return headerIds && slug
    // fixme: align with heading rendering implementation in marked
    ? (heading: Heading) => headerPrefix + slug(heading.text)
    : () => null;
}

function renderTreeStructureHeadings(
  headings: Headings,
  options: RenderTableOfContentsOptions,
): string {
  const { className } = options;
  let outermost = true;
  const tokens: Array<string> = [];

  const createHeadingId = createHeadingIdFactory(options);

  function addTocItem(heading: Heading) {
    const chapterNumber = (heading as HeadingWithChapterNumber).chapterNumberTOC;
    const headingId = createHeadingId(heading);
    const text = `${chapterNumber} ${heading.text}`;
    if (headingId) {
      tokens.push(`<li><a href="#${headingId}">${text}</a></li>`);
    } else {
      tokens.push(`<li>${text}</li>`);
    }
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

export function renderTableOfContent(
  headings: Headings,
  options: RenderTableOfContentsOptions,
): string {
  return renderTreeStructureHeadings(fixHeadingDepth(headings), options);
}
