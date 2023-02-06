import { Heading } from './types';

export function fixHeadingDepthFactory() {
  const stack: Array<number> = [];

  return function fixHeadingDepth(heading: Heading): void {
    const { depth } = heading;

    // pop headings whose depth >= current one
    for (let i = stack.length - 1; i >= 0; i--) {
      if (stack[i] >= depth) {
        stack.pop();
      } else {
        break;
      }
    }

    // save the original depth for later comparison
    stack.push(depth);

    // update marked token's depth
    heading.depth = stack.length;
  };
}
