import { GoogleGenerativeAI, GenerativeModel, GenerationConfig } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('Warning: GEMINI_API_KEY not set. API calls will fail.');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

interface GeminiClientOptions {
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  maxRetries?: number;
  retryDelayMs?: number;
}

const DEFAULT_OPTIONS: Required<GeminiClientOptions> = {
  model: 'gemini-2.0-flash-exp',
  temperature: 0.7,
  maxOutputTokens: 8192,
  maxRetries: 3,
  retryDelayMs: 1000,
};

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export class GeminiClient {
  private model: GenerativeModel | null;
  private options: Required<GeminiClientOptions>;

  constructor(options: GeminiClientOptions = {}) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.model = genAI?.getGenerativeModel({ model: this.options.model }) ?? null;
  }

  private getGenerationConfig(): GenerationConfig {
    return {
      temperature: this.options.temperature,
      maxOutputTokens: this.options.maxOutputTokens,
    };
  }

  async generate(prompt: string): Promise<string> {
    if (!this.model) {
      throw new Error('Gemini API key not configured');
    }

    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.options.maxRetries; attempt++) {
      try {
        const result = await this.model.generateContent({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: this.getGenerationConfig(),
        });

        const response = result.response;
        const text = response.text();

        if (!text) {
          throw new Error('Empty response from Gemini');
        }

        return text;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        const isRateLimitError = lastError.message.includes('429') ||
                                  lastError.message.includes('RESOURCE_EXHAUSTED');

        if (isRateLimitError || attempt < this.options.maxRetries - 1) {
          const delay = this.options.retryDelayMs * Math.pow(2, attempt);
          console.warn(`Gemini API error (attempt ${attempt + 1}/${this.options.maxRetries}): ${lastError.message}. Retrying in ${delay}ms...`);
          await sleep(delay);
        }
      }
    }

    throw lastError ?? new Error('Failed to generate content after retries');
  }

  async generateJSON<T>(prompt: string, parseResponse: (text: string) => T): Promise<T> {
    const response = await this.generate(prompt);
    return parseResponse(response);
  }
}

let defaultClient: GeminiClient | null = null;

export function getGeminiClient(options?: GeminiClientOptions): GeminiClient {
  if (!options && defaultClient) {
    return defaultClient;
  }

  const client = new GeminiClient(options);

  if (!options) {
    defaultClient = client;
  }

  return client;
}

export function extractJSON(text: string): string {
  const jsonCodeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (jsonCodeBlockMatch) {
    return jsonCodeBlockMatch[1].trim();
  }

  const jsonObjectMatch = text.match(/\{[\s\S]*\}/);
  if (jsonObjectMatch) {
    return jsonObjectMatch[0];
  }

  const jsonArrayMatch = text.match(/\[[\s\S]*\]/);
  if (jsonArrayMatch) {
    return jsonArrayMatch[0];
  }

  throw new Error('No JSON found in response');
}

/**
 * Sanitize JSON string to fix common issues from LLM outputs
 * - Fix bad escape sequences (e.g., unescaped control characters)
 * - Handle newlines within strings
 * - Fix unterminated strings
 */
function sanitizeJSON(json: string): string {
  const result = json;

  // First, handle the most common issue: unescaped newlines within strings
  // We need to process character by character to properly identify string boundaries
  const chars: string[] = [];
  let inString = false;
  let escapeNext = false;

  for (let i = 0; i < result.length; i++) {
    const char = result[i];

    if (escapeNext) {
      // Check if this is a valid escape character
      if (!'"\\/bfnrtu'.includes(char)) {
        // Invalid escape - double the backslash
        chars.push('\\');
      }
      chars.push(char);
      escapeNext = false;
      continue;
    }

    if (char === '\\' && inString) {
      escapeNext = true;
      chars.push(char);
      continue;
    }

    if (char === '"' && !escapeNext) {
      inString = !inString;
      chars.push(char);
      continue;
    }

    if (inString) {
      // Escape raw control characters within strings
      if (char === '\n') {
        chars.push('\\n');
        continue;
      }
      if (char === '\r') {
        chars.push('\\r');
        continue;
      }
      if (char === '\t') {
        chars.push('\\t');
        continue;
      }
    }

    chars.push(char);
  }

  // If we ended inside a string, close it
  if (inString) {
    chars.push('"');
  }

  return chars.join('');
}

export function parseGeminiJSON<T>(text: string): T {
  const jsonString = extractJSON(text);

  // First try parsing as-is
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    // If that fails, try sanitizing the JSON
    const sanitized = sanitizeJSON(jsonString);
    try {
      return JSON.parse(sanitized) as T;
    } catch (sanitizeError) {
      // If sanitization also fails, throw original error with context
      throw new Error(`Failed to parse JSON from Gemini response: ${sanitizeError instanceof Error ? sanitizeError.message : 'Unknown error'}`);
    }
  }
}
