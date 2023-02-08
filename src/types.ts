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
  className?: string;
	renderChapterNumber?: RenderChapterNumberFn;
};

export type RenderTableOfContentsOptions = {
  className?: string;
  headerIds?: boolean;
  headerPrefix?: string;
  slug?: (value: string) => string;
};
