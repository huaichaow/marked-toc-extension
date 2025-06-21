import { marked } from 'marked';
import markedToc from '..';
import { testMarkedOutput } from '../testHelper';

marked.use(markedToc({
  className: 'toc',
  renderChapterNumber: (numbers, kind) => `${numbers.join(kind === 'toc' ? '--' : '++')} `,
  generateHeaderId: true,
}));

describe('marked-toc-extension with options', () => {
  test('should render custom chapter numbers', () => {
    const md = `
      # a
      ## b
      ### c
      [TOC]
      `;

    const expectedHtml = `
      <h1 id="a">1 a</h1>
      <h2 id="b">1++1 b</h2>
      <h3 id="c">1++1++1 c</h3>
      <ul class="toc-list toc">
        <li class="toc-item"><a href="#a">1 a</a></li>
        <ul class="toc-list">
            <li class="toc-item"><a href="#b">1--1 b</a></li>
            <ul class="toc-list">
                <li class="toc-item"><a href="#c">1--1--1 c</a></li>
            </ul>
        </ul>
      </ul>
      `;

    testMarkedOutput(md, expectedHtml);
  });
});
