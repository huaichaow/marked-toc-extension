import { Heading, HeadingWithChapterNumber } from './types';
import { numberingHeadingFactory } from './numberingHeadingFactory';
import { createHeadings } from './testHelper';

let numberingHeading: (heading: Heading) => void;

describe('numberingHeadingFactory', () => {
  beforeEach(() => {
    numberingHeading = numberingHeadingFactory();
  });

  test.each([
    {
      receivedDepths: [1, 2, 3],
      chapterNumbers: ['1', '1.1', '1.1.1'],
    },
    {
      receivedDepths: [1, 1, 1],
      chapterNumbers: ['1', '2', '3'],
    },
    {
      receivedDepths: [1, 2, 2],
      chapterNumbers: ['1', '1.1', '1.2'],
    },
    {
      receivedDepths: [1, 2, 3, 1, 2, 3],
      chapterNumbers: ['1', '1.1', '1.1.1', '2', '2.1', '2.1.1'],
    },
    {
      receivedDepths: [1, 2, 3, 2, 1],
      chapterNumbers: ['1', '1.1', '1.1.1', '1.2', '2'],
    },
  ])('should set correct chapter numbers for $receivedDepths', ({ receivedDepths, chapterNumbers }) => {
    const headings = createHeadings(receivedDepths);

    headings.forEach((heading) => numberingHeading(heading));

    chapterNumbers.forEach((expectedDepth, i) => {
      expect((headings[i] as HeadingWithChapterNumber).chapterNumber).toBe(expectedDepth);
    });
  });
});
