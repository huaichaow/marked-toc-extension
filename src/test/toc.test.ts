import { marked } from 'marked';

import markedToc from '..';
import { testMarkedOutput } from '../testHelper';

marked.use(markedToc({ generateHeaderId: true }));

describe('marked-toc-extension', () => {
  test('should work normally without toc', () => {
    const md = `
      # toc
      # h1
      ## h2
      ### h3
      `;

    const expectedHtml = `
      <h1 id="toc">toc</h1>
      <h1 id="h1">h1</h1>
      <h2 id="h2">h2</h2>
      <h3 id="h3">h3</h3>
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
      <h1 id="toc">toc</h1>
      <nav class="undefined">
        <ul class="toc-list">
          <li class="toc-item"><a href="#toc">toc</a></li>
          <li class="toc-item"><a href="#h1">h1</a></li>
          <ul class="toc-list">
            <li class="toc-item"><a href="#h2">h2</a></li>
            <ul class="toc-list">
                <li class="toc-item"><a href="#h3">h3</a></li>
            </ul>
          </ul>
        </ul>
      </nav>
      <h1 id="h1">h1</h1>
      <h2 id="h2">h2</h2>
      <h3 id="h3">h3</h3>
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
      <nav class="undefined">
        <ul class="toc-list">
          <li class="toc-item"><a href="#a">a</a></li>
          <li class="toc-item"><a href="#b">b</a></li>
          <li class="toc-item"><a href="#c">c</a></li>
        </ul>
      </nav>
      <h1 id="a">a</h1>
      <h1 id="b">b</h1>
      <h1 id="c">c</h1>
      `;

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
      <nav class="undefined">
        <ul class="toc-list">
          <li class="toc-item"><a href="#l2">l2</a></li>
          <ul class="toc-list">
            <li class="toc-item"><a href="#l3">l3</a></li>
          </ul>
          <li class="toc-item"><a href="#l1">l1</a></li>
        </ul>
      </nav>
      <h1 id="l2">l2</h1>
      <h2 id="l3">l3</h2>
      <h1 id="l1">l1</h1>
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
      <h1 id="l2">l2</h1>
      <nav class="undefined">
        <ul class="toc-list">
          <li class="toc-item"><a href="#l2">l2</a></li>
          <ul class="toc-list">
            <li class="toc-item"><a href="#l3">l3</a></li>
          </ul>
          <li class="toc-item"><a href="#l1">l1</a></li>
        </ul>
      </nav>
      <h2 id="l3">l3</h2>
      <nav class="undefined">
        <ul class="toc-list">
          <li class="toc-item"><a href="#l2">l2</a></li>
          <ul class="toc-list">
            <li class="toc-item"><a href="#l3">l3</a></li>
          </ul>
          <li class="toc-item"><a href="#l1">l1</a></li>
        </ul>
      </nav>
      <h1 id="l1">l1</h1>
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
      <h1 id="l2">l2</h1>
      <h2 id="l3">l3</h2>
      <h1 id="l1">l1</h1>
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
      <h1 id="l2">l2</h1>
      <h2 id="l3">l3</h2>
      <h1 id="l1">l1</h1>
      `;

    testMarkedOutput(md, expectedHtml);
    testMarkedOutput(md, expectedHtml);
  });
});
