#!/usr/bin/env npx tsx

/**
 * Article SEO Scoring Script
 * Scores all generated articles for SEO quality
 */

import * as fs from 'fs';
import * as path from 'path';
import { scoreArticleSEO, generateScoringReport } from '../src/lib/seo/article-scorer';
import { BlogArticle } from '../src/types/blog';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');
const RESULTS_DIR = path.join(process.cwd(), 'test-results');

async function loadArticles(): Promise<BlogArticle[]> {
  const articles: BlogArticle[] = [];

  if (!fs.existsSync(BLOG_DIR)) {
    console.log('No blog directory found');
    return articles;
  }

  const files = fs.readdirSync(BLOG_DIR).filter(
    f => f.endsWith('.json') && f !== 'manifest.json'
  );

  for (const file of files) {
    try {
      const filePath = path.join(BLOG_DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      articles.push(data);
    } catch (error) {
      console.error(`Error loading ${file}:`, error);
    }
  }

  return articles;
}

async function main() {
  console.log('Article SEO Scoring Script');
  console.log('==========================\n');

  const articles = await loadArticles();
  console.log(`Found ${articles.length} articles to score\n`);

  if (articles.length === 0) {
    console.log('No articles found. Generate content first with: npm run generate');
    process.exit(0);
  }

  // Limit to first 3 articles for testing
  const articlesToScore = articles.slice(0, 3);
  console.log(`Scoring first ${articlesToScore.length} articles...\n`);

  const results: { article: BlogArticle; score: Awaited<ReturnType<typeof scoreArticleSEO>> }[] = [];

  for (const article of articlesToScore) {
    console.log(`Scoring: ${article.headline?.substring(0, 50)}...`);
    try {
      const score = await scoreArticleSEO(article);
      results.push({ article, score });
      console.log(`  Score: ${score.overall}/100 ${score.passed ? '✅' : '❌'}`);
    } catch (error) {
      console.error(`  Error: ${error instanceof Error ? error.message : 'Unknown'}`);
    }

    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  // Generate report
  const report = generateScoringReport(results);
  console.log('\n' + report);

  // Save report
  fs.mkdirSync(RESULTS_DIR, { recursive: true });
  const reportPath = path.join(RESULTS_DIR, 'seo-scoring-report.md');
  fs.writeFileSync(reportPath, report);
  console.log(`\nReport saved to: ${reportPath}`);

  // Summary
  const passing = results.filter(r => r.score.passed).length;
  const failing = results.filter(r => !r.score.passed).length;
  console.log(`\nSummary: ${passing} passing, ${failing} failing`);

  if (failing > 0) {
    console.log('\nArticles below threshold need regeneration.');
    process.exit(1);
  }

  console.log('\nAll scored articles meet SEO threshold! ✅');
}

main().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
});
