import { Heading, HeadingWithChapterNumber, RenderChapterNumberFn } from './types';

/**
 * It assumes that the depth of tokens feed into the returned `numberingHeading` function
 * has been fixed. Otherwise, the behavior of the function is not predictable, and
 * it makes no sense to numbering these headings.
 */

export function numberingHeadingFactory(
  renderChapterNumberTOC?: RenderChapterNumberFn,
  renderChapterNumberHeading?: RenderChapterNumberFn,
) {
  const chapterNumbers: Array<number> = [];
  let prevDepth = 0;

  function increaseChapterNumber() {
    chapterNumbers[chapterNumbers.length - 1]++;
  }

  function addSubChapterNumber() {
    chapterNumbers.push(0);
  }

  function removeSubChapterNumber(count: number) {
    for (let i = 0; i < count; i++) {
      chapterNumbers.pop();
    }
  }

  function getChapterNumber() {
    return chapterNumbers.join('.');
  }

  return function numberingHeading(heading: Heading) {
    const { depth } = heading;

    if (depth < prevDepth) {
      removeSubChapterNumber(prevDepth - depth);
    } else if (depth > prevDepth) {
      addSubChapterNumber();
    }

    increaseChapterNumber();

    prevDepth = depth;

    // append chapter number to token
    (heading as unknown as HeadingWithChapterNumber).chapterNumberTOC =
      renderChapterNumberTOC
        ? renderChapterNumberTOC([...chapterNumbers])
        : getChapterNumber();

    (heading as unknown as HeadingWithChapterNumber).chapterNumberHeading =
      renderChapterNumberHeading
        ? renderChapterNumberHeading([...chapterNumbers])
        : getChapterNumber();
  };
}
