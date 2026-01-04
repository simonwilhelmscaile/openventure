import * as fs from 'fs';
import * as path from 'path';
import type { LandingPageContent } from '@/types';
import { demoLandingContent } from '@/lib/demo-content';

// Content directories to check
const CONTENT_DIRS = ['./content', './output'];

export interface VentureConfig {
  name: string;
  tagline: string;
  domain: string;
  business?: {
    industry?: string;
    category?: string;
    target_audience?: string;
    pain_points?: string[];
    value_proposition?: string;
    unique_selling_points?: string[];
  };
  brand: {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
  };
  blog?: {
    author?: {
      name: string;
      role: string;
      company: string;
    };
    seo?: {
      primary_keyword?: string;
      secondary_keywords?: string[];
      keyword_density?: number;
    };
  };
}

/**
 * Get the content directory path
 * Checks content/ first, then output/
 */
function getContentDirectory(): string | null {
  // Only run on server
  if (typeof window !== 'undefined') {
    return null;
  }

  for (const dir of CONTENT_DIRS) {
    const fullPath = path.resolve(process.cwd(), dir);
    if (fs.existsSync(fullPath)) {
      // Check if there's actual content (landing/content.json or config.json)
      const landingPath = path.join(fullPath, 'landing', 'content.json');
      const configPath = path.join(fullPath, 'config.json');

      if (fs.existsSync(landingPath) || fs.existsSync(configPath)) {
        return fullPath;
      }
    }
  }

  return null;
}

/**
 * Load venture config from content directory
 */
export function loadVentureConfig(): VentureConfig | null {
  if (typeof window !== 'undefined') {
    return null;
  }

  try {
    // First try content directory
    const contentDir = getContentDirectory();
    if (contentDir) {
      const configPath = path.join(contentDir, 'config.json');
      if (fs.existsSync(configPath)) {
        const content = fs.readFileSync(configPath, 'utf-8');
        return JSON.parse(content);
      }
    }

    // Fall back to root venture.config.json
    const rootConfigPath = path.resolve(process.cwd(), 'venture.config.json');
    if (fs.existsSync(rootConfigPath)) {
      const content = fs.readFileSync(rootConfigPath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Failed to load venture config:', error);
  }

  return null;
}

/**
 * Load landing page content
 * Priority: 1. Generated content 2. Demo content
 */
export function loadLandingContent(): LandingPageContent {
  if (typeof window !== 'undefined') {
    return demoLandingContent;
  }

  try {
    const contentDir = getContentDirectory();
    if (contentDir) {
      const landingPath = path.join(contentDir, 'landing', 'content.json');
      if (fs.existsSync(landingPath)) {
        const content = fs.readFileSync(landingPath, 'utf-8');
        const parsed = JSON.parse(content);
        return parsed as LandingPageContent;
      }
    }
  } catch (error) {
    console.error('Failed to load landing content:', error);
  }

  // Fall back to demo content
  return demoLandingContent;
}

/**
 * Check if we're using generated content or demo content
 */
export function isUsingGeneratedContent(): boolean {
  if (typeof window !== 'undefined') {
    return false;
  }

  const contentDir = getContentDirectory();
  if (!contentDir) return false;

  const landingPath = path.join(contentDir, 'landing', 'content.json');
  return fs.existsSync(landingPath);
}

/**
 * Get theme colors from config
 */
export function getThemeColors(): Record<string, string> {
  const config = loadVentureConfig();

  if (config?.brand?.colors) {
    return {
      '--color-primary': config.brand.colors.primary,
      '--color-secondary': config.brand.colors.secondary,
      '--color-accent': config.brand.colors.accent,
      '--color-background': config.brand.colors.background,
      '--color-text': config.brand.colors.text,
    };
  }

  // Default colors from SUPERHUMAN_STYLE.md
  return {
    '--color-primary': '#000000',
    '--color-secondary': '#1B1B1B',
    '--color-accent': '#D4C7FF',
    '--color-background': '#FFFFFF',
    '--color-text': '#000000',
  };
}

/**
 * Get venture metadata
 */
export function getVentureMetadata(): { name: string; tagline: string; domain: string } {
  const config = loadVentureConfig();

  if (config) {
    return {
      name: config.name,
      tagline: config.tagline,
      domain: config.domain,
    };
  }

  return {
    name: 'Your Venture',
    tagline: 'Configure your venture in venture.config.json',
    domain: 'yourventure.vercel.app',
  };
}

/**
 * Get venture details for component rendering
 */
export function getVentureDetails(): { industry: string; primaryColor: string } {
  const config = loadVentureConfig();

  if (config) {
    return {
      industry: config.business?.industry || 'technology',
      primaryColor: config.brand?.colors?.primary || '#6366f1',
    };
  }

  return {
    industry: 'technology',
    primaryColor: '#6366f1',
  };
}

/**
 * Article preview for landing page showcase
 */
export interface ArticlePreview {
  title: string;
  category?: string;
  date: string;
}

/**
 * Load article previews for landing page showcase
 */
export function loadArticlePreviews(): ArticlePreview[] {
  if (typeof window !== 'undefined') {
    return [];
  }

  try {
    const contentDir = getContentDirectory();
    if (contentDir) {
      const manifestPath = path.join(contentDir, 'blog', 'manifest.json');
      if (fs.existsSync(manifestPath)) {
        const content = fs.readFileSync(manifestPath, 'utf-8');
        const manifest = JSON.parse(content);

        if (manifest.articles && Array.isArray(manifest.articles)) {
          return manifest.articles.slice(0, 6).map((article: { headline?: string; title?: string; category?: string; generated_at?: string }) => ({
            title: article.headline || article.title || 'Untitled',
            category: article.category || 'Article',
            date: article.generated_at
              ? new Date(article.generated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : 'Recent',
          }));
        }
      }
    }
  } catch (error) {
    console.error('Failed to load article previews:', error);
  }

  return [];
}
