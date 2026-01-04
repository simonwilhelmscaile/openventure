#!/usr/bin/env npx tsx

/**
 * Comprehensive Link Validation Script
 *
 * Validates ALL links in generated content:
 * - Internal links (pages and anchors)
 * - External links (HTTP validation)
 *
 * Usage:
 *   npm run validate-links           # Validate and report
 *   npm run validate-links --fix     # Auto-fix issues
 *   npm run validate-links --strict  # Fail on any removed links
 */

import * as fs from 'fs';
import * as path from 'path';
import {
  extractLinks,
  categorizeUrl,
  validateInternalLink,
  validateExternalLink,
  fixInternalLinksInJson,
  formatReport,
  validationPassed,
  type ValidationReport,
  type LinkValidationResult,
} from '../src/lib/validation/link-validator';

const CONTENT_DIR = path.join(process.cwd(), 'content');
const BLOG_DIR = path.join(CONTENT_DIR, 'blog');
const REPORT_DIR = path.join(process.cwd(), 'test-results');

interface FileValidation {
  file: string;
  links: LinkValidationResult[];
}

/**
 * Get all article slugs from manifest
 */
function getExistingSlugs(): string[] {
  const manifestPath = path.join(BLOG_DIR, 'manifest.json');
  if (!fs.existsSync(manifestPath)) {
    return [];
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    if (manifest.articles && Array.isArray(manifest.articles)) {
      return manifest.articles.map((a: { slug?: string }) => a.slug).filter(Boolean);
    }
  } catch {
    console.error('Failed to parse manifest.json');
  }

  return [];
}

/**
 * Extract all text content from a JSON object
 */
function extractTextContent(obj: unknown, texts: string[] = []): string[] {
  if (typeof obj === 'string') {
    texts.push(obj);
  } else if (Array.isArray(obj)) {
    obj.forEach((item) => extractTextContent(item, texts));
  } else if (obj && typeof obj === 'object') {
    Object.values(obj).forEach((value) => extractTextContent(value, texts));
  }
  return texts;
}

/**
 * Validate a single JSON file
 */
async function validateFile(
  filePath: string,
  existingSlugs: string[],
  validateExternal: boolean
): Promise<FileValidation> {
  const results: LinkValidationResult[] = [];

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);

    // Extract all text content
    const texts = extractTextContent(data);
    const allText = texts.join('\n');

    // Extract links
    const links = extractLinks(allText);

    // Validate internal links
    for (const link of links) {
      if (categorizeUrl(link.url) === 'internal') {
        const result = validateInternalLink(link.url, existingSlugs);
        results.push(result);
      }
    }

    // Validate external links
    if (validateExternal) {
      const externalLinks = links.filter((l) => categorizeUrl(l.url) === 'external');
      for (const link of externalLinks) {
        const result = await validateExternalLink(link.url);
        results.push(result);
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error);
  }

  return {
    file: path.relative(process.cwd(), filePath),
    links: results,
  };
}

/**
 * Fix links in a JSON file
 */
function fixFile(filePath: string): number {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    const fixed = fixInternalLinksInJson(data);
    const fixedContent = JSON.stringify(fixed, null, 2);

    if (content !== fixedContent) {
      fs.writeFileSync(filePath, fixedContent, 'utf-8');
      return 1;
    }
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error);
  }
  return 0;
}

/**
 * Main validation function
 */
async function main() {
  const args = process.argv.slice(2);
  const shouldFix = args.includes('--fix');
  const strictMode = args.includes('--strict');
  const skipExternal = args.includes('--skip-external');

  console.log('');
  console.log('╔══════════════════════════════════════════════════════════╗');
  console.log('║           OpenVenture Link Validation                     ║');
  console.log('╚══════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`Mode: ${shouldFix ? 'FIX' : 'VALIDATE'}`);
  console.log(`Strict: ${strictMode ? 'YES' : 'NO'}`);
  console.log(`External Links: ${skipExternal ? 'SKIP' : 'VALIDATE'}`);
  console.log('');

  // Check content directory exists
  if (!fs.existsSync(CONTENT_DIR)) {
    console.log('❌ Content directory not found. Run npm run generate first.');
    process.exit(1);
  }

  // Get existing slugs for blog link validation
  const existingSlugs = getExistingSlugs();
  console.log(`Found ${existingSlugs.length} existing blog articles`);

  // Find all JSON files
  const jsonFiles: string[] = [];

  // Landing content
  const landingPath = path.join(CONTENT_DIR, 'landing', 'content.json');
  if (fs.existsSync(landingPath)) {
    jsonFiles.push(landingPath);
  }

  // Blog articles
  if (fs.existsSync(BLOG_DIR)) {
    const blogFiles = fs.readdirSync(BLOG_DIR)
      .filter((f) => f.endsWith('.json') && f !== 'manifest.json')
      .map((f) => path.join(BLOG_DIR, f));
    jsonFiles.push(...blogFiles);
  }

  console.log(`Found ${jsonFiles.length} content files to validate`);
  console.log('');

  // Fix mode
  if (shouldFix) {
    console.log('🔧 Fixing internal links...');
    let fixedCount = 0;
    for (const file of jsonFiles) {
      const fixed = fixFile(file);
      if (fixed > 0) {
        console.log(`  ✓ Fixed: ${path.relative(process.cwd(), file)}`);
        fixedCount++;
      }
    }
    console.log(`\nFixed ${fixedCount} files`);
    console.log('');
  }

  // Validate
  console.log('🔍 Validating links...');
  console.log('');

  const allResults: FileValidation[] = [];
  let totalLinks = 0;
  let validLinks = 0;
  let fixedLinks = 0;
  let removedLinks = 0;
  let invalidLinks = 0;

  for (let i = 0; i < jsonFiles.length; i++) {
    const file = jsonFiles[i];
    const relativePath = path.relative(process.cwd(), file);
    process.stdout.write(`  [${i + 1}/${jsonFiles.length}] ${relativePath}...`);

    const validation = await validateFile(file, existingSlugs, !skipExternal);
    allResults.push(validation);

    const valid = validation.links.filter((l) => l.status === 'valid').length;
    const fixed = validation.links.filter((l) => l.status === 'fixed').length;
    const removed = validation.links.filter((l) => l.status === 'removed').length;
    const invalid = validation.links.filter((l) => l.status === 'invalid').length;

    totalLinks += validation.links.length;
    validLinks += valid;
    fixedLinks += fixed;
    removedLinks += removed;
    invalidLinks += invalid;

    if (removed > 0 || invalid > 0) {
      console.log(` ⚠️  ${removed + invalid} issues`);
    } else {
      console.log(' ✅');
    }
  }

  // Generate report
  const report: ValidationReport = {
    timestamp: new Date().toISOString(),
    totalLinks,
    validLinks,
    fixedLinks,
    removedLinks,
    invalidLinks,
    details: allResults.flatMap((f) => f.links),
  };

  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('                        SUMMARY');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  console.log(`  Total Links:     ${totalLinks}`);
  console.log(`  Valid:           ${validLinks} ✅`);
  console.log(`  Fixed:           ${fixedLinks} 🔧`);
  console.log(`  Removed:         ${removedLinks} 🗑️`);
  console.log(`  Invalid:         ${invalidLinks} ❌`);
  console.log('');

  // Show issues
  const issues = report.details.filter(
    (r) => r.status === 'removed' || r.status === 'invalid'
  );

  if (issues.length > 0) {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('                    ISSUES FOUND');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');

    for (const issue of issues.slice(0, 20)) {
      const icon = issue.status === 'invalid' ? '❌' : '🗑️';
      console.log(`  ${icon} ${issue.url}`);
      console.log(`     Type: ${issue.type}`);
      console.log(`     Reason: ${issue.errorMessage || 'N/A'}`);
      if (issue.httpStatus) {
        console.log(`     HTTP Status: ${issue.httpStatus}`);
      }
      console.log('');
    }

    if (issues.length > 20) {
      console.log(`  ... and ${issues.length - 20} more issues`);
      console.log('');
    }
  }

  // Save report
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const reportPath = path.join(REPORT_DIR, 'link-validation-report.md');
  fs.writeFileSync(reportPath, formatReport(report));
  console.log(`📄 Report saved to: ${reportPath}`);
  console.log('');

  // Exit code
  if (strictMode && (removedLinks > 0 || invalidLinks > 0)) {
    console.log('❌ VALIDATION FAILED (strict mode)');
    console.log('');
    console.log('Run with --fix to auto-fix internal link issues.');
    console.log('External link issues must be fixed in the source prompts.');
    process.exit(1);
  }

  if (!validationPassed(report)) {
    console.log('⚠️  VALIDATION WARNINGS');
    console.log('   Some links were removed or need attention.');
    console.log('');
    process.exit(strictMode ? 1 : 0);
  }

  console.log('✅ VALIDATION PASSED');
  console.log('');
}

main().catch((error) => {
  console.error('Validation script error:', error);
  process.exit(1);
});
