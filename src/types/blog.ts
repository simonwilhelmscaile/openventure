/**
 * Blog Article Types
 * Generated content structure for blog articles
 */

export interface ArticleSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface ArticleTable {
  id: string;
  title: string;
  headers: string[];
  rows: string[][];
  caption?: string;
}

export interface ArticleFAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ArticleSource {
  id: string;
  title: string;
  url: string;
  accessed_date: string;
}

export interface KeyTakeaway {
  id: string;
  text: string;
  order: number;
}

export interface ArticleAuthor {
  name: string;
  role: string;
  company: string;
  image_url?: string;
  bio?: string;
}

export interface ArticleMeta {
  title: string;
  description: string;
  keywords: string[];
  og_image?: string;
  canonical_url?: string;
}

export interface RelatedArticle {
  slug: string;
  title: string;
  teaser: string;
}

export interface BlogArticle {
  id: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  headline: string;
  subtitle: string;
  teaser: string;
  tldr: string;
  key_takeaways: KeyTakeaway[];
  sections: ArticleSection[];
  faq_items: ArticleFAQItem[];
  tables: ArticleTable[];
  sources: ArticleSource[];
  author: ArticleAuthor;
  publication_date: string;
  updated_date?: string;
  read_time: number;
  word_count: number;
  featured_image?: string;
  related_articles: RelatedArticle[];
  internal_links: { text: string; href: string; target_slug: string }[];
  seo: {
    primary_keyword: string;
    secondary_keywords: string[];
    keyword_density: number;
  };
}

export interface BlogTopic {
  id: string;
  title: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  primary_keyword: string;
  secondary_keywords: string[];
  search_intent: 'informational' | 'navigational' | 'transactional' | 'commercial';
  priority: number;
  outline: string[];
}

export interface BlogManifest {
  venture_id: string;
  venture_name: string;
  generated_at: string;
  locale: string;
  articles: BlogArticle[];
  topics: BlogTopic[];
}
