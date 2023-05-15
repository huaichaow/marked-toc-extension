import { Slugger } from 'marked';

export type Heading = {
  text: string;
  depth: number;
}

export type HeadingWithChapterNumber = Heading & {
  chapterNumberTOC: string;
  chapterNumberHeading: string;
}

export type Headings = Array<Heading>;

export type RenderChapterNumberFn = (numbers: Array<number>, kind: 'toc' | 'heading') => string;

export type MarkedTableOfContentsExtensionOptions = {
  // outermost class name
  className?: string;
  // prefix to add to class names of TOC lists(<ul>) and items(<li>), to resolve conflicts.
  classNamePrefix?: string;
  renderChapterNumber?: RenderChapterNumberFn | true;
};

export type RenderTableOfContentsOptions = {
  className?: string;
  classNamePrefix?: string;
  headerIds?: boolean;
  headerPrefix?: string;
  slugger?: Slugger;
};
