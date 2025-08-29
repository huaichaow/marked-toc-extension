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
  /**
   * class to add to TOC wrapper element
   */
  className?: string;

  /**
   * prefix to add to predefined class names for TOC elements
   */
  classNamePrefix?: string;

  /**
   * whether to numbering headings, that is, to prepend sequence number to each heading text.
   * e.g., if enabled,
   * ```
   * # aaa
   * # bbb
   * ```
   * will be compiled to
   * ```
   * <h1>1. aaa</h1>
   * <h1>2. bbb</h1>
   * ```
   */
  renderChapterNumber?: RenderChapterNumberFn | true;

  /**
   * whether to generate 'id' attribute for Headings,
   * e.g., `<h2 id='...'`
   */
  generateHeaderId?: boolean;

  /**
   * the prefix to add to heading ids, used to avoid id collision with other ids already on pages.
   */
  headerIdPrefix?: string;

  /**
   * the title to add to the TOC
   */
  tocTitle?: string;
};

type Slugger = {
  slug(value: string): string;
};

export type RenderTableOfContentsOptions = {
  classNamePrefix?: string;
  generateHeaderId?: boolean;
  headerIdPrefix?: string;
  slugger?: Slugger;
};
