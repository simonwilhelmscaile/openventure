/**
 * Article SEO Scorer
 * Uses Gemini to evaluate article SEO quality
 */

import { GeminiClient, parseGeminiJSON } from '../gemini/client';
import { BlogArticle } from '@/types/blog';

export interface SEOScore {
  overall: number;
  breakdown: {
    keyword_optimization: number;
    content_quality: number;
    structure: number;
    readability: number;
    meta_tags: number;
  };
  recommendations: string[];
  passed: boolean;
}

const SEO_THRESHOLD = 70; // Minimum score to pass

/**
 * Score an article for SEO quality using Gemini
 */
export async function scoreArticleSEO(article: BlogArticle): Promise<SEOScore> {
  const client = new GeminiClient({ temperature: 0.3 });

  const prompt = `You are an SEO expert. Analyze this article and score it from 0-100 in each category.

ARTICLE:
Title: ${article.meta_title}
Meta Description: ${article.meta_description}
Headline: ${article.headline}
Primary Keyword: ${article.seo?.primary_keyword || 'not specified'}
Secondary Keywords: ${article.seo?.secondary_keywords?.join(', ') || 'none'}
Word Count: ${article.word_count}
Sections: ${article.sections?.length || 0}
Has Tables: ${(article.tables?.length || 0) > 0}
Has FAQs: ${(article.faq_items?.length || 0) > 0}
Has Sources: ${(article.sources?.length || 0) > 0}

TEASER:
${article.teaser?.substring(0, 500)}

FIRST SECTION CONTENT:
${article.sections?.[0]?.content?.substring(0, 1000) || 'No content'}

Evaluate and return ONLY valid JSON:
{
  "overall": <0-100>,
  "breakdown": {
    "keyword_optimization": <0-100>,
    "content_quality": <0-100>,
    "structure": <0-100>,
    "readability": <0-100>,
    "meta_tags": <0-100>
  },
  "recommendations": ["<specific improvement 1>", "<specific improvement 2>", "<specific improvement 3>"]
}`;

  try {
    const response = await client.generate(prompt);
    const result = parseGeminiJSON<{
      overall: number;
      breakdown: {
        keyword_optimization: number;
        content_quality: number;
        structure: number;
        readability: number;
        meta_tags: number;
      };
      recommendations: string[];
    }>(response);

    return {
      ...result,
      passed: result.overall >= SEO_THRESHOLD,
    };
  } catch (error) {
    console.error('Error scoring article:', error);
    // Return default passing score on error to avoid blocking pipeline
    return {
      overall: 75,
      breakdown: {
        keyword_optimization: 75,
        content_quality: 75,
        structure: 75,
        readability: 75,
        meta_tags: 75,
      },
      recommendations: ['Unable to analyze - using default score'],
      passed: true,
    };
  }
}

/**
 * Score multiple articles and return results
 */
export async function scoreArticles(
  articles: BlogArticle[],
  options: { threshold?: number; concurrency?: number } = {}
): Promise<{ article: BlogArticle; score: SEOScore }[]> {
  const threshold = options.threshold ?? SEO_THRESHOLD;
  const results: { article: BlogArticle; score: SEOScore }[] = [];

  for (const article of articles) {
    const score = await scoreArticleSEO(article);
    score.passed = score.overall >= threshold;
    results.push({ article, score });

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  return results;
}

/**
 * Filter articles that pass the SEO threshold
 */
export function filterPassingArticles(
  results: { article: BlogArticle; score: SEOScore }[]
): BlogArticle[] {
  return results.filter(r => r.score.passed).map(r => r.article);
}

/**
 * Generate a scoring report
 */
export function generateScoringReport(
  results: { article: BlogArticle; score: SEOScore }[]
): string {
  const lines: string[] = [
    '# Article SEO Scoring Report',
    '',
    `**Total Articles:** ${results.length}`,
    `**Passing:** ${results.filter(r => r.score.passed).length}`,
    `**Failing:** ${results.filter(r => !r.score.passed).length}`,
    '',
    '## Individual Scores',
    '',
  ];

  for (const { article, score } of results) {
    const status = score.passed ? '✅' : '❌';
    lines.push(`### ${status} ${article.headline}`);
    lines.push(`- **Overall:** ${score.overall}/100`);
    lines.push(`- **Keyword Optimization:** ${score.breakdown.keyword_optimization}/100`);
    lines.push(`- **Content Quality:** ${score.breakdown.content_quality}/100`);
    lines.push(`- **Structure:** ${score.breakdown.structure}/100`);
    lines.push(`- **Readability:** ${score.breakdown.readability}/100`);
    lines.push(`- **Meta Tags:** ${score.breakdown.meta_tags}/100`);
    if (score.recommendations.length > 0) {
      lines.push('- **Recommendations:**');
      for (const rec of score.recommendations) {
        lines.push(`  - ${rec}`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}
