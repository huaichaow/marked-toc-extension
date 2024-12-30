import { marked } from '@huaichao.wang/marked';

const defaults = marked.defaults;

export function resetMarkedDefaults(): void {
  marked.setOptions(defaults);
}
