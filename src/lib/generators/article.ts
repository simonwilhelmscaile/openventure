import { nanoid } from 'nanoid';
import type { VentureConfig, BlogArticle, BlogTopic, BlogManifest } from '@/types';
import { getGeminiClient, parseGeminiJSON } from '@/lib/gemini/client';
import { createTopicsPrompt, createArticlePrompt, createSEOMetaPrompt } from '@/lib/gemini/prompts';

interface GeneratorOptions {
  model?: string;
  temperature?: number;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[äöüß]/g, (match) => ({ 'ä': 'ae', 'ö': 'oe', 'ü': 'ue', 'ß': 'ss' }[match] ?? match))
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(word => word.length > 0).length;
}

function calculateReadTime(wordCount: number): number {
  return Math.ceil(wordCount / 200);
}

export class ArticleGenerator {
  private config: VentureConfig;
  private client: ReturnType<typeof getGeminiClient>;

  constructor(config: VentureConfig, options?: GeneratorOptions) {
    this.config = config;
    this.client = getGeminiClient({
      model: options?.model ?? config.advanced.gemini_model,
      temperature: options?.temperature ?? config.advanced.temperature,
      maxRetries: config.advanced.max_retries,
      retryDelayMs: config.advanced.rate_limit_delay_ms,
    });
  }

  async generateTopics(): Promise<BlogTopic[]> {
    const count = this.config.blog.article_count;
    const prompt = createTopicsPrompt(this.config, count);
    const response = await this.client.generate(prompt);
    const data = parseGeminiJSON<{ topics: BlogTopic[] }>(response);

    return data.topics.map((topic, i) => ({
      ...topic,
      id: topic.id || `topic-${i + 1}`,
      slug: topic.slug || slugify(topic.title),
      priority: topic.priority || i + 1,
    }));
  }

  async generateArticle(topic: BlogTopic): Promise<BlogArticle> {
    console.log(`Generating article: ${topic.title}`);

    const articlePrompt = createArticlePrompt(this.config, topic);
    const articleResponse = await this.client.generate(articlePrompt);
    const articleData = parseGeminiJSON<Partial<BlogArticle>>(articleResponse);

    const seoPrompt = createSEOMetaPrompt(this.config, topic);
    const seoResponse = await this.client.generate(seoPrompt);
    const seoData = parseGeminiJSON<{ meta_title: string; meta_description: string; keywords: string[] }>(seoResponse);

    const sections = (articleData.sections || []).map((s, i) => ({
      ...s,
      id: s.id || `section-${i + 1}`,
      order: s.order ?? i,
    }));

    const totalContent = [
      articleData.teaser || '',
      articleData.tldr || '',
      ...sections.map(s => s.content),
      ...(articleData.faq_items || []).map(f => f.answer),
    ].join(' ');

    const wordCount = countWords(totalContent);

    const article: BlogArticle = {
      id: nanoid(),
      slug: topic.slug,
      meta_title: seoData.meta_title || topic.meta_title,
      meta_description: seoData.meta_description || topic.meta_description,
      headline: articleData.headline || topic.title,
      subtitle: articleData.subtitle || '',
      teaser: articleData.teaser || '',
      tldr: articleData.tldr || '',
      key_takeaways: (articleData.key_takeaways || []).map((kt, i) => ({
        id: kt.id || `kt-${i + 1}`,
        text: kt.text,
        order: kt.order ?? i,
      })),
      sections,
      faq_items: (articleData.faq_items || []).map((f, i) => ({
        id: f.id || `faq-${i + 1}`,
        question: f.question,
        answer: f.answer,
      })),
      tables: (articleData.tables || []).map((t, i) => ({
        id: t.id || `table-${i + 1}`,
        title: t.title,
        headers: t.headers,
        rows: t.rows,
        caption: t.caption,
      })),
      sources: [],
      author: {
        name: this.config.blog.author.name || 'Editorial Team',
        role: this.config.blog.author.role || 'Content Team',
        company: this.config.blog.author.company || this.config.name,
        image_url: this.config.blog.author.image_url,
      },
      publication_date: new Date().toISOString().split('T')[0],
      read_time: calculateReadTime(wordCount),
      word_count: wordCount,
      related_articles: [],
      internal_links: [],
      seo: {
        primary_keyword: topic.primary_keyword,
        secondary_keywords: topic.secondary_keywords,
        keyword_density: 1.5,
      },
    };

    return article;
  }

  async generate(): Promise<BlogManifest> {
    console.log('Generating blog topics...');
    const topics = await this.generateTopics();

    console.log(`Generating ${topics.length} articles...`);
    const articles: BlogArticle[] = [];

    for (const topic of topics) {
      try {
        const article = await this.generateArticle(topic);
        articles.push(article);

        if (this.config.advanced.rate_limit_delay_ms > 0) {
          await new Promise(resolve => setTimeout(resolve, this.config.advanced.rate_limit_delay_ms));
        }
      } catch (error) {
        console.error(`Failed to generate article for topic "${topic.title}":`, error);
      }
    }

    for (let i = 0; i < articles.length; i++) {
      const relatedArticles = articles
        .filter((_, j) => j !== i)
        .slice(0, 3)
        .map(a => ({
          slug: a.slug,
          title: a.headline,
          teaser: a.teaser.slice(0, 150) + '...',
        }));

      articles[i].related_articles = relatedArticles;
    }

    return {
      venture_id: nanoid(),
      venture_name: this.config.name,
      generated_at: new Date().toISOString(),
      locale: this.config.blog.locale,
      articles,
      topics,
    };
  }
}

export async function generateBlogContent(config: VentureConfig): Promise<BlogManifest> {
  const generator = new ArticleGenerator(config);
  return generator.generate();
}
