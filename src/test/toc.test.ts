import { marked } from 'marked';

import markedToc from '..';

marked.use(markedToc());

function removeLeadingSpaces(html: string) {
	return html
    .replace(/\n +/g, '\n')
    .replace(/^\s+/, '');
}

describe('marked-toc-extension', () => {
  test('should work normally without toc', () => {
    const md = removeLeadingSpaces(`
      # toc
      # h1
      ## h2
      ### h3
      `);

    const expectedHtml = removeLeadingSpaces(`
      <h1 id="toc">toc</h1>
      <h1 id="h1">h1</h1>
      <h2 id="h2">h2</h2>
      <h3 id="h3">h3</h3>
      `);

    expect(marked.parse(md)).toEqual(expectedHtml);
  });

	test('should render toc', () => {
		const md = removeLeadingSpaces(`
      # toc
      [TOC]
      # h1
      ## h2
      ### h3
      `);

		const expectedHtml = removeLeadingSpaces(`
      <h1 id="toc">toc</h1>
      <ul><li><a href="#toc">toc</a></li><li><a href="#h1">h1</a></li><ul><li><a href="#h2">h2</a></li><ul><li><a href="#h3">h3</a></li></ul></ul></ul>
      <h1 id="h1">h1</h1>
      <h2 id="h2">h2</h2>
      <h3 id="h3">h3</h3>
      `);

		expect(marked.parse(md)).toEqual(expectedHtml);
	});

	test('should render the same result when called multiple times', () => {
		const md = removeLeadingSpaces(`
      [TOC]
      # a
      # b
      # c
      `);

		const expectedHtml = removeLeadingSpaces(`
      <ul><li><a href="#a">a</a></li><li><a href="#b">b</a></li><li><a href="#c">c</a></li></ul>
      <h1 id="a">a</h1>
      <h1 id="b">b</h1>
      <h1 id="c">c</h1>
      `);

		// compile twice
		marked.parse(md);
		const result = marked.parse(md);

		expect(result).toEqual(expectedHtml);
	});

  test('should auto fix heading depth', () => {
    const md = removeLeadingSpaces(`
      [TOC]
      ## l2
      ### l3
      # l1
      `);

    const expectedHtml = removeLeadingSpaces(`
      <ul><li><a href="#l2">l2</a></li><ul><li><a href="#l3">l3</a></li></ul><li><a href="#l1">l1</a></li></ul>
      <h1 id="l2">l2</h1>
      <h2 id="l3">l3</h2>
      <h1 id="l1">l1</h1>
      `);

    expect(marked.parse(md)).toEqual(expectedHtml);
  });

  test('should be able to render toc in multiple places', () => {
    const md = removeLeadingSpaces(`
      ## l2
      [TOC]
      ### l3
      [TOC]
      # l1
      `);

    const expectedHtml = removeLeadingSpaces(`
      <h1 id="l2">l2</h1>
      <ul><li><a href="#l2">l2</a></li><ul><li><a href="#l3">l3</a></li></ul><li><a href="#l1">l1</a></li></ul>
      <h2 id="l3">l3</h2>
      <ul><li><a href="#l2">l2</a></li><ul><li><a href="#l3">l3</a></li></ul><li><a href="#l1">l1</a></li></ul>
      <h1 id="l1">l1</h1>
      `);

    expect(marked.parse(md)).toEqual(expectedHtml);
  });

  test('should generate chapter number without toc', () => {
    const md = removeLeadingSpaces(`
      ## l2
      ### l3
      # l1
      `);

    const expectedHtml = removeLeadingSpaces(`
      <h1 id="l2">l2</h1>
      <h2 id="l3">l3</h2>
      <h1 id="l1">l1</h1>
      `);

    expect(marked.parse(md)).toEqual(expectedHtml);
  });

  test('should generate the same chapter number without toc when call multiple times', () => {
    const md = removeLeadingSpaces(`
      ## l2
      ### l3
      # l1
      `);

    const expectedHtml = removeLeadingSpaces(`
      <h1 id="l2">l2</h1>
      <h2 id="l3">l3</h2>
      <h1 id="l1">l1</h1>
      `);

    expect(marked.parse(md)).toEqual(expectedHtml);
    expect(marked.parse(md)).toEqual(expectedHtml);
  });
});
