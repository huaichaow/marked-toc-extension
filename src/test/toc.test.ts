import { marked } from 'marked';

import markedToc from '..';

marked.use(markedToc());

function removeLeadingSpaces(html: string) {
	return html
    .replace(/\n +/g, '\n')
    .replace(/^\s+/, '');
}

describe('marked-toc-extension', () => {
	test('should render toc', () => {
		const md = removeLeadingSpaces(`
      # toc
      [TOC]
      # h1
      ## h2
      ### h3
      `);

		const expectedHtml = removeLeadingSpaces(`
      <h1 id="toc">1 toc</h1>
      <ul><li>1 toc</li><li>2 h1</li><ul><li>2.1 h2</li><ul><li>2.1.1 h3</li></ul></ul></ul>
      <h1 id="h1">2 h1</h1>
      <h2 id="h2">2.1 h2</h2>
      <h3 id="h3">2.1.1 h3</h3>
      `);

		expect(marked.parse(md)).toEqual(expectedHtml);
	});

  test('should auto fix heading depth', () => {
		const md = removeLeadingSpaces(`
      [TOC]
      ## l2
      ### l3
      # l1
      `);

		const expectedHtml = removeLeadingSpaces(`
      <ul><li>1 l2</li><ul><li>1.1 l3</li></ul><li>2 l1</li></ul>
      <h1 id="l2">1 l2</h1>
      <h2 id="l3">1.1 l3</h2>
      <h1 id="l1">2 l1</h1>
      `);

		expect(marked.parse(md)).toEqual(expectedHtml);
	});
});
