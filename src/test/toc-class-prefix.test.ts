import { marked } from 'marked';
import markedToc from '..';
import { testMarkedOutput } from '../testHelper';

marked.use(markedToc({
  className: 'toc',
  classNamePrefix: 'x-',
  renderChapterNumber: (numbers, kind) => numbers.join(kind === 'toc' ? '--' : '++'),
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
      <ul class="x-list toc">
        <li class="x-item"><a href="#a">1 a</a></li>
        <ul class="x-list">
            <li class="x-item"><a href="#b">1--1 b</a></li>
            <ul class="x-list">
                <li class="x-item"><a href="#c">1--1--1 c</a></li>
            </ul>
        </ul>
      </ul>
      `;

    testMarkedOutput(md, expectedHtml);
  });
});
