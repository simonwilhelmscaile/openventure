/**
 * Comprehensive Link Validator for OpenVenture
 *
 * Validates all internal and external links in generated content.
 * - Internal links: Checks against known routes, auto-fixes format
 * - External links: HTTP validation, removes broken links
 */

export interface LinkValidationResult {
  url: string;
  type: 'internal' | 'external';
  status: 'valid' | 'invalid' | 'fixed' | 'removed';
  originalUrl?: string;
  fixedUrl?: string;
  httpStatus?: number;
  errorMessage?: string;
}

export interface ValidationReport {
  timestamp: string;
  totalLinks: number;
  validLinks: number;
  fixedLinks: number;
  removedLinks: number;
  invalidLinks: number;
  details: LinkValidationResult[];
}

export interface ContentWithLinks {
  content: string;
  links: ExtractedLink[];
}

export interface ExtractedLink {
  url: string;
  anchorText: string;
  fullMatch: string;
  position: number;
}

// Known valid internal routes
const VALID_PAGES = ['/', '/about', '/blog', '/contact', '/careers', '/privacy', '/terms'];

// Valid anchor sections on homepage
const VALID_ANCHORS = ['/#features', '/#pricing', '/#faq', '/#testimonials', '/#showcase'];

// Pages that should be anchor links (common mistake)
const ANCHOR_ONLY_SECTIONS = ['/features', '/pricing', '/faq', '/testimonials'];

/**
 * Extract all markdown links from content
 */
export function extractLinks(content: string): ExtractedLink[] {
  const links: ExtractedLink[] = [];
  const markdownLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = markdownLinkPattern.exec(content)) !== null) {
    links.push({
      anchorText: match[1],
      url: match[2],
      fullMatch: match[0],
      position: match.index,
    });
  }

  return links;
}

/**
 * Categorize a URL as internal or external
 */
export function categorizeUrl(url: string): 'internal' | 'external' {
  if (url.startsWith('/') || url.startsWith('#')) {
    return 'internal';
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return 'external';
  }
  return 'internal'; // Relative URLs are internal
}

/**
 * Validate an internal link
 */
export function validateInternalLink(url: string, existingSlugs?: string[]): LinkValidationResult {
  // Check if it's a section that should be an anchor
  if (ANCHOR_ONLY_SECTIONS.includes(url)) {
    const fixedUrl = '/#' + url.slice(1); // Convert /pricing to /#pricing
    return {
      url,
      type: 'internal',
      status: 'fixed',
      originalUrl: url,
      fixedUrl,
      errorMessage: `Section links must use anchor format (${url} → ${fixedUrl})`,
    };
  }

  // Check valid pages
  if (VALID_PAGES.includes(url)) {
    return { url, type: 'internal', status: 'valid' };
  }

  // Check valid anchors
  if (VALID_ANCHORS.includes(url) || url.startsWith('/#')) {
    return { url, type: 'internal', status: 'valid' };
  }

  // Check blog article links
  if (url.startsWith('/blog/')) {
    const slug = url.replace('/blog/', '');
    if (existingSlugs && existingSlugs.includes(slug)) {
      return { url, type: 'internal', status: 'valid' };
    }
    // If we don't have slugs list, accept any /blog/xxx format
    if (!existingSlugs) {
      return { url, type: 'internal', status: 'valid' };
    }
    return {
      url,
      type: 'internal',
      status: 'removed',
      errorMessage: `Blog article not found: ${slug}`,
    };
  }

  // Check pure anchor links
  if (url.startsWith('#')) {
    return { url, type: 'internal', status: 'valid' };
  }

  // Unknown internal link - remove it
  return {
    url,
    type: 'internal',
    status: 'removed',
    errorMessage: `Unknown internal route: ${url}`,
  };
}

/**
 * Validate an external link via HTTP request
 */
export async function validateExternalLink(
  url: string,
  timeout = 10000
): Promise<LinkValidationResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; OpenVenture/1.0; Link Validator)',
      },
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      return {
        url,
        type: 'external',
        status: 'valid',
        httpStatus: response.status,
      };
    }

    // Some sites block HEAD requests, try GET
    if (response.status === 405 || response.status === 403) {
      const getResponse = await fetch(url, {
        method: 'GET',
        signal: controller.signal,
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; OpenVenture/1.0; Link Validator)',
        },
      });

      if (getResponse.ok) {
        return {
          url,
          type: 'external',
          status: 'valid',
          httpStatus: getResponse.status,
        };
      }
    }

    return {
      url,
      type: 'external',
      status: 'removed',
      httpStatus: response.status,
      errorMessage: `HTTP ${response.status}`,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      url,
      type: 'external',
      status: 'removed',
      errorMessage: message,
    };
  }
}

/**
 * Validate all links in content and return fixed content
 */
export async function validateAndFixContent(
  content: string,
  options: {
    existingSlugs?: string[];
    validateExternal?: boolean;
    concurrency?: number;
  } = {}
): Promise<{ content: string; report: ValidationReport }> {
  const {
    existingSlugs,
    validateExternal = true,
    concurrency = 5,
  } = options;

  const links = extractLinks(content);
  const results: LinkValidationResult[] = [];
  let fixedContent = content;

  // Validate internal links
  for (const link of links) {
    if (categorizeUrl(link.url) === 'internal') {
      const result = validateInternalLink(link.url, existingSlugs);
      results.push(result);

      if (result.status === 'fixed' && result.fixedUrl) {
        // Replace in content
        const fixedMatch = `[${link.anchorText}](${result.fixedUrl})`;
        fixedContent = fixedContent.replace(link.fullMatch, fixedMatch);
      } else if (result.status === 'removed') {
        // Remove the link, keep the anchor text
        fixedContent = fixedContent.replace(link.fullMatch, link.anchorText);
      }
    }
  }

  // Validate external links
  if (validateExternal) {
    const externalLinks = links.filter((l) => categorizeUrl(l.url) === 'external');

    // Process in batches
    for (let i = 0; i < externalLinks.length; i += concurrency) {
      const batch = externalLinks.slice(i, i + concurrency);
      const batchResults = await Promise.all(
        batch.map((link) => validateExternalLink(link.url))
      );

      for (let j = 0; j < batch.length; j++) {
        const link = batch[j];
        const result = batchResults[j];
        results.push(result);

        if (result.status === 'removed') {
          // Remove broken external link, keep anchor text
          fixedContent = fixedContent.replace(link.fullMatch, link.anchorText);
        }
      }
    }
  }

  const report: ValidationReport = {
    timestamp: new Date().toISOString(),
    totalLinks: results.length,
    validLinks: results.filter((r) => r.status === 'valid').length,
    fixedLinks: results.filter((r) => r.status === 'fixed').length,
    removedLinks: results.filter((r) => r.status === 'removed').length,
    invalidLinks: results.filter((r) => r.status === 'invalid').length,
    details: results,
  };

  return { content: fixedContent, report };
}

/**
 * Validate content without modifying it (for reporting only)
 */
export async function validateContentOnly(
  content: string,
  options: {
    existingSlugs?: string[];
    validateExternal?: boolean;
  } = {}
): Promise<ValidationReport> {
  const result = await validateAndFixContent(content, {
    ...options,
    validateExternal: options.validateExternal ?? true,
  });
  return result.report;
}

/**
 * Fix internal links in JSON content (handles nested objects)
 */
export function fixInternalLinksInJson(obj: unknown): unknown {
  if (typeof obj === 'string') {
    // Fix markdown links in strings
    let fixed = obj;

    for (const section of ANCHOR_ONLY_SECTIONS) {
      // Match [text](/pricing) and fix to [text](/#pricing)
      const pattern = new RegExp(`\\[([^\\]]+)\\]\\(${section}\\)`, 'g');
      const replacement = `[$1](/#${section.slice(1)})`;
      fixed = fixed.replace(pattern, replacement);
    }

    return fixed;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => fixInternalLinksInJson(item));
  }

  if (obj && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = fixInternalLinksInJson(value);
    }
    return result;
  }

  return obj;
}

/**
 * Generate a human-readable report
 */
export function formatReport(report: ValidationReport): string {
  const lines: string[] = [
    '# Link Validation Report',
    '',
    `**Generated:** ${report.timestamp}`,
    '',
    '## Summary',
    '',
    `| Metric | Count |`,
    `|--------|-------|`,
    `| Total Links | ${report.totalLinks} |`,
    `| Valid ✅ | ${report.validLinks} |`,
    `| Fixed 🔧 | ${report.fixedLinks} |`,
    `| Removed 🗑️ | ${report.removedLinks} |`,
    `| Invalid ❌ | ${report.invalidLinks} |`,
    '',
  ];

  const fixed = report.details.filter((r) => r.status === 'fixed');
  if (fixed.length > 0) {
    lines.push('## Fixed Links', '');
    for (const result of fixed) {
      lines.push(`- \`${result.originalUrl}\` → \`${result.fixedUrl}\``);
    }
    lines.push('');
  }

  const removed = report.details.filter((r) => r.status === 'removed');
  if (removed.length > 0) {
    lines.push('## Removed Links', '');
    for (const result of removed) {
      lines.push(`- \`${result.url}\``);
      lines.push(`  - Type: ${result.type}`);
      lines.push(`  - Reason: ${result.errorMessage || 'N/A'}`);
      if (result.httpStatus) {
        lines.push(`  - HTTP Status: ${result.httpStatus}`);
      }
    }
    lines.push('');
  }

  const invalid = report.details.filter((r) => r.status === 'invalid');
  if (invalid.length > 0) {
    lines.push('## Invalid Links (Require Manual Fix)', '');
    for (const result of invalid) {
      lines.push(`- ❌ \`${result.url}\``);
      lines.push(`  - Error: ${result.errorMessage}`);
    }
    lines.push('');
  }

  if (removed.length === 0 && fixed.length === 0 && invalid.length === 0) {
    lines.push('## All Links Valid! ✅', '');
  }

  return lines.join('\n');
}

/**
 * Check if validation passed (no critical errors)
 */
export function validationPassed(report: ValidationReport): boolean {
  // No invalid links allowed
  return report.invalidLinks === 0;
}
