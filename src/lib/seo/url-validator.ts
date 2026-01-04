/**
 * URL Validator for SEO Link Checking
 * Validates internal and external URLs before build
 */

interface ValidationResult {
  url: string;
  status: 'valid' | 'invalid' | 'error';
  statusCode?: number;
  message?: string;
  responseTime?: number;
}

interface ValidationReport {
  timestamp: string;
  totalUrls: number;
  validUrls: number;
  invalidUrls: number;
  errorUrls: number;
  results: ValidationResult[];
}

/**
 * Extract all URLs from HTML content
 */
export function extractUrls(html: string): string[] {
  const urlPattern = /href=["']([^"']+)["']/g;
  const urls: string[] = [];
  let match;

  while ((match = urlPattern.exec(html)) !== null) {
    const url = match[1];
    // Skip anchors, mailto, tel, and javascript links
    if (
      !url.startsWith('#') &&
      !url.startsWith('mailto:') &&
      !url.startsWith('tel:') &&
      !url.startsWith('javascript:')
    ) {
      urls.push(url);
    }
  }

  return [...new Set(urls)]; // Remove duplicates
}

/**
 * Categorize URL as internal or external
 */
export function categorizeUrl(
  url: string,
  baseUrl: string
): 'internal' | 'external' {
  if (url.startsWith('/') || url.startsWith(baseUrl)) {
    return 'internal';
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return 'external';
  }
  return 'internal'; // Relative URLs are internal
}

/**
 * Validate a single URL
 */
export async function validateUrl(
  url: string,
  baseUrl: string,
  timeout = 10000
): Promise<ValidationResult> {
  const fullUrl = url.startsWith('/') ? `${baseUrl}${url}` : url;
  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(fullUrl, {
      method: 'HEAD',
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeoutId);
    const responseTime = Date.now() - startTime;

    if (response.ok) {
      return {
        url,
        status: 'valid',
        statusCode: response.status,
        responseTime,
      };
    } else {
      return {
        url,
        status: 'invalid',
        statusCode: response.status,
        message: `HTTP ${response.status}`,
        responseTime,
      };
    }
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const message =
      error instanceof Error ? error.message : 'Unknown error';

    return {
      url,
      status: 'error',
      message,
      responseTime,
    };
  }
}

/**
 * Validate multiple URLs with concurrency control
 */
export async function validateUrls(
  urls: string[],
  baseUrl: string,
  options: {
    concurrency?: number;
    timeout?: number;
    onProgress?: (completed: number, total: number) => void;
  } = {}
): Promise<ValidationReport> {
  const { concurrency = 5, timeout = 10000, onProgress } = options;
  const results: ValidationResult[] = [];
  let completed = 0;

  // Process URLs in batches
  for (let i = 0; i < urls.length; i += concurrency) {
    const batch = urls.slice(i, i + concurrency);
    const batchResults = await Promise.all(
      batch.map((url) => validateUrl(url, baseUrl, timeout))
    );

    results.push(...batchResults);
    completed += batch.length;

    if (onProgress) {
      onProgress(completed, urls.length);
    }
  }

  const validUrls = results.filter((r) => r.status === 'valid').length;
  const invalidUrls = results.filter((r) => r.status === 'invalid').length;
  const errorUrls = results.filter((r) => r.status === 'error').length;

  return {
    timestamp: new Date().toISOString(),
    totalUrls: urls.length,
    validUrls,
    invalidUrls,
    errorUrls,
    results,
  };
}

/**
 * Generate a human-readable validation report
 */
export function formatReport(report: ValidationReport): string {
  const lines: string[] = [
    '# URL Validation Report',
    '',
    `**Generated:** ${report.timestamp}`,
    '',
    '## Summary',
    '',
    `- Total URLs: ${report.totalUrls}`,
    `- Valid: ${report.validUrls} ✅`,
    `- Invalid: ${report.invalidUrls} ❌`,
    `- Errors: ${report.errorUrls} ⚠️`,
    '',
  ];

  const invalidResults = report.results.filter(
    (r) => r.status === 'invalid' || r.status === 'error'
  );

  if (invalidResults.length > 0) {
    lines.push('## Issues Found', '');

    for (const result of invalidResults) {
      const icon = result.status === 'invalid' ? '❌' : '⚠️';
      lines.push(`${icon} \`${result.url}\``);
      lines.push(`   - Status: ${result.statusCode || 'N/A'}`);
      lines.push(`   - Message: ${result.message || 'N/A'}`);
      lines.push('');
    }
  } else {
    lines.push('## All URLs Valid! ✅', '');
  }

  return lines.join('\n');
}

/**
 * Check if validation passed (no invalid URLs)
 */
export function validationPassed(
  report: ValidationReport,
  options: {
    allowErrors?: boolean;
    maxInvalidUrls?: number;
  } = {}
): boolean {
  const { allowErrors = true, maxInvalidUrls = 0 } = options;

  if (report.invalidUrls > maxInvalidUrls) {
    return false;
  }

  if (!allowErrors && report.errorUrls > 0) {
    return false;
  }

  return true;
}
