import { Heading } from './types';
import { fixHeadingDepthFactory } from './fixHeadingDepthFactory';
import { createHeadings } from './testHelper';

let fixHeadingDepth: (heading: Heading) => void;

describe('fixHeadingDepthFactory', () => {
  beforeEach(() => {
    fixHeadingDepth = fixHeadingDepthFactory();
  });

  test.each([
    {
      // should work with correct headings
      receivedDepths: [1, 2, 3],
      expectedDepths: [1, 2, 3],
    },
    {
      // should fix headings to start with 1 (1)
      receivedDepths: [2, 3, 4],
      expectedDepths: [1, 2, 3],
    },
    {
      // should fix headings to start with 1 (2)
      receivedDepths: [4, 5, 6],
      expectedDepths: [1, 2, 3],
    },
    {
      // should ground first and minimal headings to 1
      receivedDepths: [3, 4, 2],
      expectedDepths: [1, 2, 1],
    },
    {
      receivedDepths: [2, 3, 4, 1, 2, 3],
      expectedDepths: [1, 2, 3, 1, 2, 3],
    },
    {
      receivedDepths: [2, 5, 3, 4],
      expectedDepths: [1, 2, 2, 3],
    },
  ])('should fix $receivedDepths =to=> $expectedDepth', ({ receivedDepths, expectedDepths }) => {
    const headings = createHeadings(receivedDepths);

    headings.forEach((heading) => fixHeadingDepth(heading));

    expectedDepths.forEach((expectedDepth, i) => {
      expect(headings[i].depth).toBe(expectedDepth);
    });
  });
});
