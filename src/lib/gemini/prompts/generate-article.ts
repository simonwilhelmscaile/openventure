import type { VentureConfig, BlogTopic } from '@/types';

export function createTopicsPrompt(config: VentureConfig, count: number): string {
  return `
You are an SEO expert creating blog topics for a ${config.business.industry} company.

CONTEXT:
- Company: ${config.name}
- Business Idea: ${config.idea}
- Target Audience: ${config.business.target_audience}
- Industry: ${config.business.industry}
- Primary Keyword: ${config.blog.seo.primary_keyword}
- Secondary Keywords: ${config.blog.seo.secondary_keywords.join(', ')}
- Locale: ${config.blog.locale}

TASK:
Generate ${count} SEO-optimized blog topics that will drive organic traffic.

REQUIREMENTS:
For each topic:
- Title: Compelling, includes primary or secondary keyword
- Slug: URL-friendly, lowercase, hyphens only
- Meta Title: 50-60 characters, includes keyword
- Meta Description: 150-160 characters, compelling, includes keyword
- Primary Keyword: Main search term to target
- Secondary Keywords: 3-5 related terms
- Search Intent: One of (informational, navigational, transactional, commercial)
- Priority: 1-10 (1 = highest priority)
- Outline: 7-9 H2 section titles

Focus on:
- How-to guides
- Comparison articles
- Industry insights
- Problem-solving content
- Best practices

OUTPUT FORMAT:
Return ONLY valid JSON:
{
  "topics": [
    {
      "id": "topic-1",
      "title": "...",
      "slug": "topic-slug-here",
      "meta_title": "...",
      "meta_description": "...",
      "primary_keyword": "...",
      "secondary_keywords": ["kw1", "kw2", "kw3"],
      "search_intent": "informational",
      "priority": 1,
      "outline": ["Section 1", "Section 2", ...]
    }
  ]
}
`.trim();
}

export function createArticlePrompt(config: VentureConfig, topic: BlogTopic): string {
  const locale = config.blog.locale;
  const language = locale.startsWith('de') ? 'German' : 'English';

  return `
You are an expert content writer creating a comprehensive blog article in ${language}.

CONTEXT:
- Company: ${config.name}
- Industry: ${config.business.industry}
- Target Audience: ${config.business.target_audience}
- Locale: ${locale}

ARTICLE TOPIC:
- Title: ${topic.title}
- Primary Keyword: ${topic.primary_keyword}
- Secondary Keywords: ${topic.secondary_keywords.join(', ')}
- Search Intent: ${topic.search_intent}
- Outline: ${topic.outline.join(' | ')}

TASK:
Generate a complete, comprehensive blog article.

REQUIREMENTS:
1. Word Count: ${config.blog.content.min_word_count}-${config.blog.content.max_word_count} words
2. Headline: Compelling, unique, includes primary keyword
3. Subtitle: 15-25 words expanding on headline
4. Teaser: 100-150 words introducing the topic (hook the reader)
5. TLDR: 40-60 words summarizing key points
6. Key Takeaways: 4-6 bullet points with main insights
7. Sections: ${config.blog.content.sections_per_article} sections following the outline
   - Each section: 400-600 words
   - Include practical examples
   - Use ${language} naturally
8. FAQ: 5-7 questions addressing common queries
9. Tables: 1-2 comparison or data tables if relevant

CONTENT GUIDELINES:
- Write in ${language}
- Use active voice
- Include specific examples and data
- Address the reader directly (you/Sie)
- Be authoritative but accessible
- Naturally include keywords (1-2% density)

OUTPUT FORMAT:
Return ONLY valid JSON:
{
  "headline": "...",
  "subtitle": "...",
  "teaser": "...",
  "tldr": "...",
  "key_takeaways": [
    {"id": "kt-1", "text": "...", "order": 0}
  ],
  "sections": [
    {
      "id": "section-1",
      "title": "...",
      "content": "Full section content here with multiple paragraphs...",
      "order": 0
    }
  ],
  "faq_items": [
    {"id": "faq-1", "question": "...", "answer": "..."}
  ],
  "tables": [
    {
      "id": "table-1",
      "title": "...",
      "headers": ["Column 1", "Column 2", "Column 3"],
      "rows": [
        ["Row 1 Col 1", "Row 1 Col 2", "Row 1 Col 3"]
      ],
      "caption": "..."
    }
  ]
}
`.trim();
}

export function createSEOMetaPrompt(config: VentureConfig, topic: BlogTopic): string {
  return `
You are an SEO expert optimizing metadata for a blog article.

CONTEXT:
- Company: ${config.name}
- Article Title: ${topic.title}
- Primary Keyword: ${topic.primary_keyword}
- Locale: ${config.blog.locale}

TASK:
Generate optimized SEO metadata.

REQUIREMENTS:
- Meta Title: 50-60 characters, includes primary keyword, compelling
- Meta Description: 150-160 characters, includes keyword, has CTA
- Keywords: 5-10 relevant keywords for the article

OUTPUT FORMAT:
Return ONLY valid JSON:
{
  "meta_title": "...",
  "meta_description": "...",
  "keywords": ["kw1", "kw2", ...]
}
`.trim();
}
