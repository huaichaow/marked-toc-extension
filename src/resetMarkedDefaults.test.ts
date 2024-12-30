import { marked } from '@huaichao.wang/marked';
import savedDefaults = marked.defaults;
import { resetMarkedDefaults } from './resetMarkedDefaults';

describe('marked-toc-extension', () => {
  test('should work normally without toc', () => {
    marked.use({
      hooks: {
        preprocess(markdown) {
          return markdown;
        },
        postprocess(html) {
          return html;
        }
      },
    });

    expect(marked.defaults).not.toEqual(savedDefaults);

    resetMarkedDefaults();

    expect(marked.defaults).toEqual(savedDefaults);
  });
});
