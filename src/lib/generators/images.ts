/**
 * Image Generation Pipeline
 * Generates images using Gemini API for venture websites
 */

import type { VentureConfig } from '@/types';

/**
 * Image types that can be generated
 */
export type ImageType =
  | 'hero' // Landing page hero image
  | 'feature' // Feature section icons/images
  | 'article-hero' // Blog article hero images
  | 'author-avatar' // Author profile images
  | 'og-image' // Open Graph social sharing image
  | 'logo'; // Company logo

/**
 * Generated image metadata
 */
export interface GeneratedImage {
  type: ImageType;
  path: string;
  altText: string;
  width: number;
  height: number;
  format: 'png' | 'jpg' | 'webp';
  generatedAt: string;
}

/**
 * Image generation options
 */
export interface ImageGenerationOptions {
  type: ImageType;
  prompt?: string;
  width?: number;
  height?: number;
  style?: 'photorealistic' | 'illustration' | 'minimal' | 'abstract';
}

/**
 * Image manifest containing all generated images
 */
export interface ImageManifest {
  venture: string;
  generatedAt: string;
  images: GeneratedImage[];
}

/**
 * Default image dimensions by type
 */
const DEFAULT_DIMENSIONS: Record<ImageType, { width: number; height: number }> = {
  hero: { width: 1200, height: 675 },
  feature: { width: 400, height: 300 },
  'article-hero': { width: 1200, height: 630 },
  'author-avatar': { width: 200, height: 200 },
  'og-image': { width: 1200, height: 630 },
  logo: { width: 512, height: 512 },
};

/**
 * Generate prompt for image based on type and venture context
 */
export function generateImagePrompt(
  type: ImageType,
  config: VentureConfig
): string {
  const { name, tagline, business } = config;
  const industry = business?.industry || 'technology';
  const audience = business?.target_audience || 'professionals';

  const prompts: Record<ImageType, string> = {
    hero: `Professional hero image for ${name}, a ${industry} company.
           ${tagline}. Modern, clean design with subtle gradients.
           Target audience: ${audience}.
           Style: Minimalist, premium, Superhuman-inspired.`,

    feature: `Clean icon or illustration representing a feature for ${name}.
              ${industry} industry. Simple, modern design with brand colors.
              Style: Flat design, minimal, professional.`,

    'article-hero': `Blog article header image for ${name} blog.
                     ${industry} industry, professional content.
                     Abstract or conceptual, not literal.
                     Style: Modern, editorial, clean.`,

    'author-avatar': `Professional headshot placeholder for ${name} team member.
                      Generic, diverse, professional appearance.
                      Style: Clean background, natural lighting.`,

    'og-image': `Social sharing preview image for ${name}.
                 Include company name and tagline: "${tagline}".
                 ${industry} industry. Eye-catching but professional.
                 Style: Bold, clear text, brand colors.`,

    logo: `Minimal, modern logo for ${name}.
           ${industry} industry. Simple geometric or lettermark design.
           Style: Clean, scalable, works on dark and light backgrounds.`,
  };

  return prompts[type];
}

/**
 * Generate a single image (placeholder - requires Gemini API implementation)
 */
export async function generateImage(
  options: ImageGenerationOptions,
  config: VentureConfig
): Promise<GeneratedImage | null> {
  const dimensions = DEFAULT_DIMENSIONS[options.type];
  const width = options.width || dimensions.width;
  const height = options.height || dimensions.height;

  // TODO: Implement actual Gemini image generation
  // For now, return null to indicate image generation is not yet available
  console.log(`[ImageGenerator] Would generate ${options.type} image (${width}x${height})`);
  console.log(`[ImageGenerator] Prompt: ${generateImagePrompt(options.type, config)}`);

  return null;
}

/**
 * Generate all required images for a venture
 */
export async function generateAllImages(
  config: VentureConfig,
  articleSlugs: string[] = []
): Promise<ImageManifest> {
  const images: GeneratedImage[] = [];

  // Image types to generate
  const imageTypes: ImageType[] = [
    'hero',
    'og-image',
    'logo',
    'author-avatar',
  ];

  // Add feature images (6 for feature sections)
  for (let i = 0; i < 6; i++) {
    const image = await generateImage({ type: 'feature' }, config);
    if (image) {
      images.push({ ...image, path: `content/images/feature-${i + 1}.png` });
    }
  }

  // Generate base images
  for (const type of imageTypes) {
    const image = await generateImage({ type }, config);
    if (image) {
      images.push(image);
    }
  }

  // Generate article hero images
  for (const slug of articleSlugs) {
    const image = await generateImage({ type: 'article-hero' }, config);
    if (image) {
      images.push({ ...image, path: `content/images/articles/${slug}-hero.png` });
    }
  }

  return {
    venture: config.name,
    generatedAt: new Date().toISOString(),
    images,
  };
}

/**
 * Save image manifest to file
 */
export function saveImageManifest(manifest: ImageManifest, outputPath: string): void {
  // TODO: Implement file writing
  console.log(`[ImageGenerator] Would save manifest to ${outputPath}`);
  console.log(`[ImageGenerator] Images: ${manifest.images.length}`);
}

/**
 * Get placeholder image URL for development
 */
export function getPlaceholderUrl(type: ImageType): string {
  const dimensions = DEFAULT_DIMENSIONS[type];
  return `https://placehold.co/${dimensions.width}x${dimensions.height}/1a1a1a/666666?text=${type}`;
}
