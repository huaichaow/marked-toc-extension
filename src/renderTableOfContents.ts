import {
  Heading,
  Headings,
  HeadingWithChapterNumber,
  RenderTableOfContentsOptions,
} from './types';
import { fixHeadingDepthFactory } from './fixHeadingDepthFactory';

const TOC_LIST_CLASS = 'list';
const TOC_ITEM_CLASS = 'item';
const SPACE = ' ';

function fixHeadingDepth(headings: Headings): Headings {
  const fixHeadingDepth = fixHeadingDepthFactory();
  headings.forEach((heading) => fixHeadingDepth(heading));
  return headings;
}

function createHeadingIdFactory(options: RenderTableOfContentsOptions) {
  const { generateHeaderId, headerIdPrefix, slugger } = options;

  return generateHeaderId && slugger
    ? (heading: Heading) => headerIdPrefix + slugger.slug(heading.text)
    : () => null;
}

function renderTreeStructureHeadings(
  headings: Headings,
  options: RenderTableOfContentsOptions,
): string {
  const { className, classNamePrefix = 'toc-' } = options;

  const tocListClass = `${classNamePrefix}${TOC_LIST_CLASS}`;
  const tocItemClass = `${classNamePrefix}${TOC_ITEM_CLASS}`;
  const tokens: Array<string> = [];

  let outermost = true;

  const createHeadingId = createHeadingIdFactory(options);

  function addTocItem(heading: Heading) {
    const chapterNumber = (heading as HeadingWithChapterNumber).chapterNumberTOC;
    const headingId = createHeadingId(heading);
    const text = chapterNumber === undefined
      ? heading.text
      : `${chapterNumber}${heading.text}`;

    tokens.push(...createItem(text, headingId));
  }

  function createItem(text: string, headingId: string | null) {
    const components: Array<string> = [];
    components.push(`<li class="${tocItemClass}">`);
    components.push(headingId ? `<a href="#${headingId}">${text}</a>` : text);
    components.push(`</li>`);
    return components;
  }

  function openLevel() {
    const classNames = [tocListClass];

    if (outermost && className) {
      outermost = false;
      classNames.push(className);
    }

    tokens.push(`<ul class="${classNames.join(SPACE)}">`);
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
