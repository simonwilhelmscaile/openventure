#!/usr/bin/env npx ts-node

/**
 * URL Validation Script
 * Validates all URLs in generated content before deployment
 *
 * Usage:
 *   npx ts-node scripts/validate-urls.ts
 *   npx ts-node scripts/validate-urls.ts --base-url https://example.com
 */

import * as fs from 'fs';
import * as path from 'path';

// Import validation functions
import {
  categorizeUrl,
  validateUrls,
  formatReport,
  validationPassed,
} from '../src/lib/seo/url-validator';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const BLOG_DIR = path.join(CONTENT_DIR, 'blog');

interface ArticleData {
  slug: string;
  content: string;
  urls: string[];
}

/**
 * Read all article JSON files and extract URLs
 */
function extractArticleUrls(): ArticleData[] {
  const articles: ArticleData[] = [];

  if (!fs.existsSync(BLOG_DIR)) {
    console.log('No blog directory found at:', BLOG_DIR);
    return articles;
  }

  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.json') && f !== 'manifest.json');

  for (const file of files) {
    try {
      const filePath = path.join(BLOG_DIR, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      // Collect all text content that might contain URLs
      const textFields: string[] = [];

      // Add top-level text fields
      if (data.teaser) textFields.push(data.teaser);
      if (data.tldr) textFields.push(data.tldr);

      // Add section content (new format with sections array)
      if (data.sections && Array.isArray(data.sections)) {
        for (const section of data.sections) {
          if (section.content) {
            textFields.push(section.content);
          }
        }
      }

      // Legacy format with section_XX_content
      for (let i = 1; i <= 9; i++) {
        const key = `section_0${i}_content`;
        if (data[key]) {
          textFields.push(data[key]);
        }
      }

      const allText = textFields.join(' ');

      // Extract URLs from markdown links [text](url)
      const markdownUrlPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
      const urls: string[] = [];
      let match;

      while ((match = markdownUrlPattern.exec(allText)) !== null) {
        const url = match[2];
        if (url.startsWith('http://') || url.startsWith('https://')) {
          urls.push(url);
        }
      }

      // Also extract from sources array if present
      if (data.sources && Array.isArray(data.sources)) {
        for (const source of data.sources) {
          if (source.url) {
            urls.push(source.url);
          }
        }
      }

      if (urls.length > 0) {
        articles.push({
          slug: data.slug || file.replace('.json', ''),
          content: allText,
          urls: [...new Set(urls)], // Deduplicate
        });
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error);
    }
  }

  return articles;
}

/**
 * Main validation function
 */
async function main() {
  const args = process.argv.slice(2);
  const baseUrlArg = args.find(a => a.startsWith('--base-url='));
  const baseUrl = baseUrlArg?.split('=')[1] || 'https://openventure.vercel.app';
  const skipExternal = args.includes('--skip-external');
  const failOnError = args.includes('--fail-on-error');

  console.log('URL Validation Script');
  console.log('=====================');
  console.log(`Base URL: ${baseUrl}`);
  console.log(`Skip External: ${skipExternal}`);
  console.log('');

  // Extract URLs from articles
  const articles = extractArticleUrls();

  if (articles.length === 0) {
    console.log('No articles with URLs found.');
    console.log('This is normal if content has not been generated yet.');
    process.exit(0);
  }

  console.log(`Found ${articles.length} articles with URLs`);

  // Collect all unique external URLs
  const allUrls: string[] = [];
  for (const article of articles) {
    console.log(`  - ${article.slug}: ${article.urls.length} URLs`);
    allUrls.push(...article.urls);
  }

  const uniqueUrls = [...new Set(allUrls)];
  const externalUrls = uniqueUrls.filter(url =>
    categorizeUrl(url, baseUrl) === 'external'
  );

  console.log('');
  console.log(`Total unique URLs: ${uniqueUrls.length}`);
  console.log(`External URLs: ${externalUrls.length}`);
  console.log('');

  if (skipExternal) {
    console.log('Skipping external URL validation (--skip-external)');
    process.exit(0);
  }

  if (externalUrls.length === 0) {
    console.log('No external URLs to validate.');
    process.exit(0);
  }

  // Validate external URLs
  console.log('Validating external URLs...');
  console.log('');

  const report = await validateUrls(externalUrls, baseUrl, {
    concurrency: 3,
    timeout: 15000,
    onProgress: (completed, total) => {
      process.stdout.write(`\rProgress: ${completed}/${total}`);
    },
  });

  console.log('\n');
  console.log(formatReport(report));

  // Save report to file
  const reportPath = path.join(process.cwd(), 'test-results', 'url-validation-report.md');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, formatReport(report));
  console.log(`Report saved to: ${reportPath}`);

  // Exit with error if validation failed
  if (!validationPassed(report, { allowErrors: !failOnError })) {
    console.log('');
    console.log('URL validation FAILED');
    process.exit(1);
  }

  console.log('');
  console.log('URL validation PASSED');
}

main().catch(error => {
  console.error('Validation script error:', error);
  process.exit(1);
});
