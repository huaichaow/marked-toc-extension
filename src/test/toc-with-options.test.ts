/**
 * todo: marked does not support reset defaults, so need to create a separate
 * test module to test the extension with different options.
 */

import { marked } from 'marked';
import markedToc from '..';

marked.use(markedToc({
  className: 'toc',
  renderChapterNumber: (numbers, kind) => numbers.join(kind === 'toc' ? '--' : '++'),
}));

function removeLeadingSpaces(html: string) {
	return html
    .replace(/\n +/g, '\n')
    .replace(/^\s+/, '');
}

describe('marked-toc-extension with options', () => {
  test('should render custom chapter numbers', () => {
    const md = removeLeadingSpaces(`
      # a
      ## b
      ### c
      [TOC]
      `);

    const expectedHtml = removeLeadingSpaces(`
      <h1 id="a">1 a</h1>
      <h2 id="b">1++1 b</h2>
      <h3 id="c">1++1++1 c</h3>
      <ul class="toc"><li><a href="#a">1 a</a></li><ul><li><a href="#b">1--1 b</a></li><ul><li><a href="#c">1--1--1 c</a></li></ul></ul></ul>
      `);

    expect(marked.parse(md)).toEqual(expectedHtml);
  });
});
