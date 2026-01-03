import { z } from 'zod';

export const ArticleSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
  order: z.number().min(0),
});

export const ArticleTableSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  headers: z.array(z.string()),
  rows: z.array(z.array(z.string())),
  caption: z.string().optional(),
});

export const ArticleFAQItemSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  answer: z.string().min(1),
});

export const ArticleSourceSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  url: z.string().url(),
  accessed_date: z.string().min(1),
});

export const KeyTakeawaySchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
  order: z.number().min(0),
});

export const ArticleAuthorSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  company: z.string().min(1),
  image_url: z.string().optional(),
  bio: z.string().optional(),
});

export const RelatedArticleSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  teaser: z.string().min(1),
});

export const BlogArticleSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  meta_title: z.string().min(30).max(70),
  meta_description: z.string().min(100).max(170),
  headline: z.string().min(1),
  subtitle: z.string().min(1),
  teaser: z.string().min(50).max(300),
  tldr: z.string().min(30).max(100),
  key_takeaways: z.array(KeyTakeawaySchema).min(3).max(7),
  sections: z.array(ArticleSectionSchema).min(5).max(12),
  faq_items: z.array(ArticleFAQItemSchema).min(3).max(10),
  tables: z.array(ArticleTableSchema).max(5),
  sources: z.array(ArticleSourceSchema).max(15),
  author: ArticleAuthorSchema,
  publication_date: z.string().min(1),
  updated_date: z.string().optional(),
  read_time: z.number().min(1).max(60),
  word_count: z.number().min(500).max(10000),
  featured_image: z.string().optional(),
  related_articles: z.array(RelatedArticleSchema).max(5),
  internal_links: z.array(z.object({
    text: z.string().min(1),
    href: z.string().min(1),
    target_slug: z.string().min(1),
  })),
  seo: z.object({
    primary_keyword: z.string().min(1),
    secondary_keywords: z.array(z.string()),
    keyword_density: z.number().min(0).max(5),
  }),
});

export const BlogTopicSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug format'),
  meta_title: z.string().min(30).max(70),
  meta_description: z.string().min(100).max(170),
  primary_keyword: z.string().min(1),
  secondary_keywords: z.array(z.string()),
  search_intent: z.enum(['informational', 'navigational', 'transactional', 'commercial']),
  priority: z.number().min(1).max(10),
  outline: z.array(z.string()),
});

export const BlogManifestSchema = z.object({
  venture_id: z.string().min(1),
  venture_name: z.string().min(1),
  generated_at: z.string().min(1),
  locale: z.string().min(2),
  articles: z.array(BlogArticleSchema),
  topics: z.array(BlogTopicSchema),
});

export type BlogArticleInput = z.infer<typeof BlogArticleSchema>;
export type BlogTopicInput = z.infer<typeof BlogTopicSchema>;
export type BlogManifestInput = z.infer<typeof BlogManifestSchema>;
