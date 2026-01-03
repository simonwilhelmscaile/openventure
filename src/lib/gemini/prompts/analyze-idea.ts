import type { VentureConfig } from '@/types';

export function createAnalyzeIdeaPrompt(config: VentureConfig): string {
  return `
You are a business strategist and marketing expert. Analyze the following business idea and provide strategic insights.

BUSINESS IDEA:
${config.idea}

COMPANY NAME: ${config.name}
TAGLINE: ${config.tagline}
INDUSTRY: ${config.business.industry}
TARGET AUDIENCE: ${config.business.target_audience}

TASK:
Analyze this business idea and generate:
1. 5-7 key pain points this product solves
2. A clear value proposition (1-2 sentences)
3. 3-5 unique selling points
4. Suggested brand personality traits
5. Key competitor categories to research

OUTPUT FORMAT:
Return ONLY valid JSON with this structure:
{
  "pain_points": ["pain point 1", "pain point 2", ...],
  "value_proposition": "...",
  "unique_selling_points": ["usp 1", "usp 2", ...],
  "personality_traits": ["trait 1", "trait 2", ...],
  "competitor_categories": ["category 1", "category 2", ...]
}
`.trim();
}

export interface IdeaAnalysis {
  pain_points: string[];
  value_proposition: string;
  unique_selling_points: string[];
  personality_traits: string[];
  competitor_categories: string[];
}
