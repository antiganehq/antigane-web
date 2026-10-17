// Single journal-style model for articles, manuscripts, and publications.
// Body is structured blocks (not Markdown): inline marks inside paragraph
// and heading text use **bold**, *italic*, ++underline++, [text](url).

export type BodyBlock =
  | { type: "heading"; level: 1 | 2 | 3; text: string }
  | { type: "paragraph"; text: string }
  | { type: "image"; src: string; caption?: string; alt?: string };

export type Reference = {
  authors: string;
  year: string;
  title: string;
  venue: string;
  url?: string;
};

export type ResearchItem = {
  slug: string;
  title: string;
  authors: string[];
  date: string;
  area?: string;
  venue?: string;
  abstract: string;
  body: BodyBlock[];
  references: Reference[];
  url?: string;
};

export type ResearchData = {
  articles: ResearchItem[];
  manuscripts: ResearchItem[];
  publications: ResearchItem[];
};
