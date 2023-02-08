export type Heading = {
	text: string;
	depth: number;
}

export type HeadingWithChapterNumber = Heading & {
	chapterNumberTOC: string;
	chapterNumberHeading: string;
}

export type Headings = Array<Heading>;

export type RenderChapterNumberFn = (numbers: Array<number>) => string;

export type MarkedTableOfContentsExtensionOptions = {
	renderChapterNumberTOC?: RenderChapterNumberFn;
  renderChapterNumberHeading?: RenderChapterNumberFn;
};
