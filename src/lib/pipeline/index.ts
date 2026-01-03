import * as fs from 'fs/promises';
import * as path from 'path';
import type { VentureConfig, LandingPageContent, BlogManifest } from '@/types';
import { VentureConfigSchema } from '@/lib/schemas';
import { generateLandingPage } from '@/lib/generators/landing';
import { generateBlogContent } from '@/lib/generators/article';

export interface PipelineOutput {
  venture_id: string;
  venture_name: string;
  generated_at: string;
  landing_page: LandingPageContent;
  blog: BlogManifest;
  output_directory: string;
}

export interface PipelineOptions {
  skipLandingPage?: boolean;
  skipBlog?: boolean;
  outputDirectory?: string;
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

export async function loadVentureConfig(configPath: string): Promise<VentureConfig> {
  const content = await fs.readFile(configPath, 'utf-8');
  const config = JSON.parse(content);
  return VentureConfigSchema.parse(config);
}

export async function runPipeline(
  config: VentureConfig,
  options: PipelineOptions = {}
): Promise<PipelineOutput> {
  console.log(`Starting OpenVenture pipeline for: ${config.name}`);

  // Output directly to content/ directory (not content/venture-name/)
  // This matches what the content loader expects
  const outputDir = options.outputDirectory || config.output.directory;

  await ensureDirectory(outputDir);
  await ensureDirectory(path.join(outputDir, 'landing'));
  await ensureDirectory(path.join(outputDir, 'blog'));
  await ensureDirectory(path.join(outputDir, 'images'));

  // Also save a copy of the config for the loader to use
  await writeJSON(path.join(outputDir, 'config.json'), config);

  const ventureDir = outputDir;

  let landingPage: LandingPageContent | null = null;
  if (!options.skipLandingPage && config.landing_page.enabled) {
    console.log('Generating landing page content...');
    landingPage = await generateLandingPage(config);
    await writeJSON(path.join(ventureDir, 'landing', 'content.json'), landingPage);
    console.log('Landing page content saved.');
  }

  let blog: BlogManifest | null = null;
  if (!options.skipBlog && config.blog.enabled) {
    console.log('Generating blog content...');
    blog = await generateBlogContent(config);
    await writeJSON(path.join(ventureDir, 'blog', 'manifest.json'), blog);

    for (const article of blog.articles) {
      await writeJSON(
        path.join(ventureDir, 'blog', `${article.slug}.json`),
        article
      );
    }
    console.log(`Blog content saved. ${blog.articles.length} articles generated.`);
  }

  const manifest = {
    venture_id: landingPage?.venture_id || blog?.venture_id || config.name,
    venture_name: config.name,
    generated_at: new Date().toISOString(),
    config_hash: Buffer.from(JSON.stringify(config)).toString('base64').slice(0, 32),
    outputs: {
      landing_page: landingPage ? 'landing/content.json' : null,
      blog: blog ? 'blog/manifest.json' : null,
    },
    stats: {
      landing_sections: landingPage ? Object.keys(landingPage).length : 0,
      blog_articles: blog?.articles.length || 0,
      total_words: blog?.articles.reduce((sum, a) => sum + a.word_count, 0) || 0,
    },
  };

  await writeJSON(path.join(ventureDir, 'manifest.json'), manifest);

  console.log('Pipeline complete!');
  console.log(`Output directory: ${ventureDir}`);

  return {
    venture_id: manifest.venture_id,
    venture_name: config.name,
    generated_at: manifest.generated_at,
    landing_page: landingPage!,
    blog: blog!,
    output_directory: ventureDir,
  };
}

export async function runPipelineFromConfig(
  configPath: string,
  options: PipelineOptions = {}
): Promise<PipelineOutput> {
  const config = await loadVentureConfig(configPath);
  return runPipeline(config, options);
}
