import { Heading, HeadingWithChapterNumber } from './types';
import { numberingHeadingFactory } from './numberingHeadingFactory';
import { createHeadings } from './testHelper';

let numberingHeading: (heading: Heading) => void;

const testDataSet = [
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
];

describe('numberingHeadingFactory', () => {
  beforeEach(() => {
    numberingHeading = numberingHeadingFactory();
  });

  test.each(testDataSet)(
    'should generate correct chapter numbers for $receivedDepths',
    ({ receivedDepths, chapterNumbers }) => {
      const headings = createHeadings(receivedDepths);

      headings.forEach((heading) => numberingHeading(heading));

      chapterNumbers.forEach((expectedDepth, i) => {
        expect((headings[i] as HeadingWithChapterNumber).chapterNumberTOC).toBe(expectedDepth);
        expect((headings[i] as HeadingWithChapterNumber).chapterNumberHeading).toBe(expectedDepth);
      });
    },
  );

  test.each(testDataSet)(
    'should generate chapter number with render functions for $receivedDepths',
    ({ receivedDepths, chapterNumbers }) => {
      const headings = createHeadings(receivedDepths);

      numberingHeading = numberingHeadingFactory(
        (numbers: Array<number>) => numbers.join("-"),
        (numbers: Array<number>) => numbers.join("|"),
      );

      headings.forEach((heading) => numberingHeading(heading));

      chapterNumbers.forEach((expectedDepth, i) => {
        expect((headings[i] as HeadingWithChapterNumber).chapterNumberTOC)
          .toBe(expectedDepth.replace(/\./g, '-'));
        expect((headings[i] as HeadingWithChapterNumber).chapterNumberHeading)
          .toBe(expectedDepth.replace(/\./g, '|'));
      });
    },
  );
});
