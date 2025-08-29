import { marked } from 'marked';

import markedToc from '..';
import { testMarkedOutput } from '../testHelper';

marked.use(markedToc({ generateHeaderId: true }));

describe('marked-toc-extension', () => {
  test('should render the same result when called multiple times', () => {
    const md = `
      [TOC]
      # a \`b\` **c** *d*
      `;

    const expectedHtml = `
      <nav class="undefined">
        <ul class="toc-list">
          <li class="toc-item"><a href="#a-codebcode-strongcstrong-emdem">a <code>b</code> <strong>c</strong> <em>d</em></a></li>
        </ul>
      </nav>
      <h1 id="a-codebcode-strongcstrong-emdem">a <code>b</code> <strong>c</strong> <em>d</em></h1>
      `;

    testMarkedOutput(md, expectedHtml);
  });
});
