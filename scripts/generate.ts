#!/usr/bin/env npx ts-node

/**
 * OpenVenture CLI Generator
 *
 * Usage:
 *   npx ts-node scripts/generate.ts --config=./venture.config.json
 *   npm run generate -- --config=./venture.config.json
 */

import * as fs from 'fs/promises';
import * as path from 'path';

interface VentureConfig {
  $schema?: string;
  idea: string;
  name: string;
  tagline: string;
  domain: string;
  business: {
    industry: string;
    category: string;
    target_audience: string;
    pain_points: string[];
    value_proposition: string;
    unique_selling_points: string[];
  };
  competitors: {
    urls: string[];
    analyze_design: boolean;
    analyze_copy: boolean;
    analyze_pricing: boolean;
  };
  brand: {
    tone: 'professional' | 'playful' | 'technical' | 'friendly';
    personality: string[];
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
  };
  landing_page: {
    enabled: boolean;
    sections: Record<string, unknown>;
  };
  blog: {
    enabled: boolean;
    article_count: number;
    locale: string;
    seo: {
      primary_keyword: string;
      secondary_keywords: string[];
      keyword_density: number;
    };
    content: Record<string, unknown>;
    author: {
      name: string;
      role: string;
      company: string;
      image_url: string;
    };
  };
  images: Record<string, unknown>;
  deployment: Record<string, unknown>;
  output: {
    directory: string;
    formats: Record<string, string>;
  };
  advanced: {
    gemini_model: string;
    temperature: number;
    max_retries: number;
    rate_limit_delay_ms: number;
    enable_competitor_analysis: boolean;
    enable_seo_optimization: boolean;
  };
}

function parseArgs(): { configPath: string; skipLanding: boolean; skipBlog: boolean } {
  const args = process.argv.slice(2);
  let configPath = '';
  let skipLanding = false;
  let skipBlog = false;

  for (const arg of args) {
    if (arg.startsWith('--config=')) {
      configPath = arg.replace('--config=', '');
    } else if (arg === '--skip-landing') {
      skipLanding = true;
    } else if (arg === '--skip-blog') {
      skipBlog = true;
    }
  }

  if (!configPath) {
    console.error('Error: --config argument is required');
    console.error('Usage: npx ts-node scripts/generate.ts --config=./venture.config.json');
    process.exit(1);
  }

  return { configPath, skipLanding, skipBlog };
}

async function loadConfig(configPath: string): Promise<VentureConfig> {
  const absolutePath = path.resolve(process.cwd(), configPath);
  const content = await fs.readFile(absolutePath, 'utf-8');
  return JSON.parse(content);
}

async function ensureDirectory(dir: string): Promise<void> {
  try {
    await fs.access(dir);
  } catch {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function writeJSON(filepath: string, data: unknown): Promise<void> {
  await fs.writeFile(filepath, JSON.stringify(data, null, 2), 'utf-8');
}

async function main() {
  const { configPath, skipLanding, skipBlog } = parseArgs();

  console.log('OpenVenture Generator');
  console.log('=====================');
  console.log(`Config: ${configPath}`);

  const config = await loadConfig(configPath);

  if (!config.idea || !config.name) {
    console.error('Error: Config must have "idea" and "name" fields');
    process.exit(1);
  }

  console.log(`Venture: ${config.name}`);
  console.log(`Idea: ${config.idea.slice(0, 100)}...`);

  // Use content/ as the output directory (matches what the loader expects)
  const outputDir = config.output?.directory || './content';

  await ensureDirectory(outputDir);
  await ensureDirectory(path.join(outputDir, 'landing'));
  await ensureDirectory(path.join(outputDir, 'blog'));
  await ensureDirectory(path.join(outputDir, 'images'));

  console.log(`Output directory: ${outputDir}`);

  if (!process.env.GEMINI_API_KEY) {
    console.warn('Warning: GEMINI_API_KEY not set. Generating mock content...');

    const mockManifest = {
      venture_id: `${config.name}-${Date.now()}`,
      venture_name: config.name,
      generated_at: new Date().toISOString(),
      config_hash: Buffer.from(JSON.stringify(config)).toString('base64').slice(0, 32),
      outputs: {
        landing_page: skipLanding ? null : 'landing/content.json',
        blog: skipBlog ? null : 'blog/manifest.json',
      },
      stats: {
        landing_sections: 0,
        blog_articles: 0,
        total_words: 0,
      },
      note: 'Mock generation - set GEMINI_API_KEY to generate real content',
    };

    // Save config for the loader
    await writeJSON(path.join(outputDir, 'config.json'), config);
    await writeJSON(path.join(outputDir, 'manifest.json'), mockManifest);

    console.log('Mock manifest created.');
    console.log('To generate real content, set GEMINI_API_KEY environment variable.');
  } else {
    console.log('GEMINI_API_KEY found. Starting content generation...');

    const { runPipeline } = await import('../src/lib/pipeline');

    try {
      const result = await runPipeline(config as never, {
        skipLandingPage: skipLanding,
        skipBlog: skipBlog,
        outputDirectory: outputDir,
      });

      console.log('\n=== Generation Complete ===');
      console.log(`Venture ID: ${result.venture_id}`);
      console.log(`Output: ${result.output_directory}`);

      if (result.landing_page) {
        console.log('Landing page: Generated');
      }

      if (result.blog) {
        console.log(`Blog articles: ${result.blog.articles.length}`);
      }
    } catch (error) {
      console.error('Generation failed:', error);
      process.exit(1);
    }
  }

  console.log('\nDone!');
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});
