import { marked } from 'marked';

import markedToc from '..';
import { testMarkedOutput } from '../testHelper';

marked.use(markedToc({ renderChapterNumber: true }));

describe('marked-toc-extension', () => {
  test('should work normally without toc', () => {
    const md = `
      # toc
      # h1
      ## h2
      ### h3
      `;

    const expectedHtml = `
      <h1 id="toc">1 toc</h1>
      <h1 id="h1">2 h1</h1>
      <h2 id="h2">2.1 h2</h2>
      <h3 id="h3">2.1.1 h3</h3>
      `;

    testMarkedOutput(md, expectedHtml);
  });

  test('should render toc', () => {
    const md = `
      # toc
      [TOC]
      # h1
      ## h2
      ### h3
      `;

    const expectedHtml = `
      <h1 id="toc">1 toc</h1>
      <ul class="toc-list">
        <li class="toc-item"><a href="#toc">1 toc</a></li>
        <li class="toc-item"><a href="#h1">2 h1</a></li>
        <ul class="toc-list">
          <li class="toc-item"><a href="#h2">2.1 h2</a></li>
          <ul class="toc-list">
            <li class="toc-item"><a href="#h3">2.1.1 h3</a></li>
          </ul>
        </ul>
      </ul>
      <h1 id="h1">2 h1</h1>
      <h2 id="h2">2.1 h2</h2>
      <h3 id="h3">2.1.1 h3</h3>
      `;

    testMarkedOutput(md, expectedHtml);
  });

  test('should render the same result when called multiple times', () => {
    const md = `
      [TOC]
      # a
      # b
      # c
      `;

    const expectedHtml = `
      <ul class="toc-list">
        <li class="toc-item"><a href="#a">1 a</a></li>
        <li class="toc-item"><a href="#b">2 b</a></li>
        <li class="toc-item"><a href="#c">3 c</a></li>
      </ul>
      <h1 id="a">1 a</h1>
      <h1 id="b">2 b</h1>
      <h1 id="c">3 c</h1>
      `;

    // compile twice
    testMarkedOutput(md, expectedHtml);
    testMarkedOutput(md, expectedHtml);
  });

  test('should auto fix heading depth', () => {
    const md = `
      [TOC]
      ## l2
      ### l3
      # l1
      `;

    const expectedHtml = `
      <ul class="toc-list">
        <li class="toc-item"><a href="#l2">1 l2</a></li>
        <ul class="toc-list">
            <li class="toc-item"><a href="#l3">1.1 l3</a></li>
        </ul>
        <li class="toc-item"><a href="#l1">2 l1</a></li>
      </ul>
      <h1 id="l2">1 l2</h1>
      <h2 id="l3">1.1 l3</h2>
      <h1 id="l1">2 l1</h1>
      `;

    testMarkedOutput(md, expectedHtml);
  });

  test('should be able to render toc in multiple places', () => {
    const md = `
      ## l2
      [TOC]
      ### l3
      [TOC]
      # l1
      `;

    const expectedHtml = `
      <h1 id="l2">1 l2</h1>
      <ul class="toc-list">
        <li class="toc-item"><a href="#l2">1 l2</a></li>
        <ul class="toc-list">
            <li class="toc-item"><a href="#l3">1.1 l3</a></li>
        </ul>
        <li class="toc-item"><a href="#l1">2 l1</a></li>
      </ul>
      <h2 id="l3">1.1 l3</h2>
      <ul class="toc-list">
        <li class="toc-item"><a href="#l2">1 l2</a></li>
        <ul class="toc-list">
            <li class="toc-item"><a href="#l3">1.1 l3</a></li>
        </ul>
        <li class="toc-item"><a href="#l1">2 l1</a></li>
      </ul>
      <h1 id="l1">2 l1</h1>
      `;

    testMarkedOutput(md, expectedHtml);
  });

  test('should generate chapter number without toc', () => {
    const md = `
      ## l2
      ### l3
      # l1
      `;

    const expectedHtml = `
      <h1 id="l2">1 l2</h1>
      <h2 id="l3">1.1 l3</h2>
      <h1 id="l1">2 l1</h1>
      `;

    testMarkedOutput(md, expectedHtml);
  });

  test('should generate the same chapter number without toc when call multiple times', () => {
    const md = `
      ## l2
      ### l3
      # l1
      `;

    const expectedHtml = `
      <h1 id="l2">1 l2</h1>
      <h2 id="l3">1.1 l3</h2>
      <h1 id="l1">2 l1</h1>
      `;

    testMarkedOutput(md, expectedHtml);
    testMarkedOutput(md, expectedHtml);
    testMarkedOutput(md, expectedHtml);
  });
});
