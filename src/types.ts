export type Heading = {
  text: string;
  depth: number;
}

export type HeadingWithChapterNumber = Heading & {
  chapterNumber: string; // dot separated string, e.g., `1.2.3`
}

export type Headings = Array<Heading>;
