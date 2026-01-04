export interface Article {
  slug: string;
  Headline: string;
  Subtitle: string;
  Teaser: string;
  TLDR: string;
  publication_date: string;
  read_time: number;
  word_count: number;
  category?: string;
  hero_image?: string;
  hero_image_alt?: string;
  thumbnail?: string;
  key_takeaway_01?: string;
  key_takeaway_02?: string;
  key_takeaway_03?: string;
  key_takeaway_04?: string;
  key_takeaway_05?: string;
  section_01_title?: string;
  section_01_content?: string;
  section_02_title?: string;
  section_02_content?: string;
  section_03_title?: string;
  section_03_content?: string;
  section_04_title?: string;
  section_04_content?: string;
  section_05_title?: string;
  section_05_content?: string;
  section_06_title?: string;
  section_06_content?: string;
  section_07_title?: string;
  section_07_content?: string;
  section_08_title?: string;
  section_08_content?: string;
  section_09_title?: string;
  section_09_content?: string;
  tables?: ArticleTable[];
  faq_items?: FAQItem[];
}

export interface ArticleTable {
  title: string;
  headers: string[];
  rows: string[][];
  after_section?: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BlogConfig {
  name: string;
  tagline: string;
  description: string;
  author: {
    name: string;
    title: string;
    avatar_url: string;
  };
}

export interface ArticleSection {
  title: string;
  content: string;
  id: string;
}
