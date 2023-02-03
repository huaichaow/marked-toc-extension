type Heading = {
  text: string;
  depth: number;
}

type Headings = Array<Heading>;

function fixHeadingDepth(headings: Headings): Headings {
  const stack: Array<Heading> = [headings[0]];
  const newDepths: Array<number> = [1];

  headings.reduce((prev, next, index) => {
    if (next.depth > prev.depth) {
      stack.push(next);
    } else {
      // pop headings with depth >= current depth (next.depth)
      for (let i = stack.length - 1; i >= 0; i--) {
        if (next.depth <= stack[i].depth) {
          stack.pop();
        } else {
          break;
        }
      }
      stack.push(next);
    }
    // save new depth for updating depth later
    newDepths[index] = stack.length;
    return next;
  });

  return newDepths.map((newDepth, index) => ({
    ...headings[index],
    depth: newDepth,
  }));
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
  const headingsWithFixedDepth = fixHeadingDepth(headings);

  headings.forEach((heading, i) => heading.depth = headingsWithFixedDepth[i].depth);
  
  return renderTreeStructureHeadings(headingsWithFixedDepth);
}
