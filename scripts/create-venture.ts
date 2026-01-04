#!/usr/bin/env npx tsx

/**
 * OpenVenture - Create Venture from Description
 *
 * Takes a natural language description of your business and generates
 * a complete venture.config.json using Gemini AI.
 *
 * Usage:
 *   npx tsx scripts/create-venture.ts --prompt="Your business description..."
 *   npx tsx scripts/create-venture.ts --file=./my-idea.txt
 *   npx tsx scripts/create-venture.ts --interactive
 *
 * Examples:
 *   npx tsx scripts/create-venture.ts --prompt="We're building an AI tool that detects corrosion in industrial equipment from photos"
 *   npx tsx scripts/create-venture.ts --file=./business-description.txt --output=./my-venture.config.json
 */

import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';
import { spawn } from 'child_process';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createVentureConfigPrompt } from '../src/lib/gemini/prompts/generate-venture-config';

// Load environment variables from .env file
function loadEnv(): void {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    for (const line of envContent.split('\n')) {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        if (!process.env[key.trim()]) {
          process.env[key.trim()] = value;
        }
      }
    }
  }
}

interface Args {
  prompt?: string;
  file?: string;
  output?: string;
  interactive?: boolean;
  apiKey?: string;
}

function parseArgs(): Args {
  const args: Args = {};

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--prompt=')) {
      args.prompt = arg.replace('--prompt=', '');
    } else if (arg.startsWith('--file=')) {
      args.file = arg.replace('--file=', '');
    } else if (arg.startsWith('--output=')) {
      args.output = arg.replace('--output=', '');
    } else if (arg.startsWith('--api-key=')) {
      args.apiKey = arg.replace('--api-key=', '');
    } else if (arg === '--interactive' || arg === '-i') {
      args.interactive = true;
    }
  }

  return args;
}

async function getInteractiveInput(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('');
  console.log('╔══════════════════════════════════════════════════════════════════════╗');
  console.log('║                    OpenVenture - Create Your Venture                 ║');
  console.log('╚══════════════════════════════════════════════════════════════════════╝');
  console.log('');
  console.log('Describe your business idea. Include:');
  console.log('  - What problem you solve');
  console.log('  - Who your customers are');
  console.log('  - What makes you unique');
  console.log('  - Your company name (if you have one)');
  console.log('');
  console.log('Type your description and press Enter twice when done:');
  console.log('');

  return new Promise((resolve) => {
    let input = '';
    let emptyLineCount = 0;

    rl.on('line', (line) => {
      if (line === '') {
        emptyLineCount++;
        if (emptyLineCount >= 1 && input.trim().length > 0) {
          rl.close();
          resolve(input.trim());
        }
      } else {
        emptyLineCount = 0;
        input += (input ? '\n' : '') + line;
      }
    });
  });
}

async function askYesNo(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`${question} (Y/n): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() !== 'n');
    });
  });
}

async function runCommand(command: string, args: string[], description: string): Promise<boolean> {
  console.log(`\n${description}...\n`);

  return new Promise((resolve) => {
    const proc = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: process.cwd(),
    });

    proc.on('close', (code) => {
      resolve(code === 0);
    });

    proc.on('error', (err) => {
      console.error(`Error running ${command}:`, err);
      resolve(false);
    });
  });
}

async function runFullGeneration(configPath: string): Promise<void> {
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('                    Generating Your Venture');
  console.log('═══════════════════════════════════════════════════════════════════════');

  // Step 1: Generate content
  const generateSuccess = await runCommand(
    'npm',
    ['run', 'generate', '--', `--config=${configPath}`],
    '📝 Step 1/3: Generating landing page and blog articles'
  );

  if (!generateSuccess) {
    console.error('\n❌ Generation failed. Please check the errors above.');
    console.log('\nYou can retry with:');
    console.log(`   npm run generate -- --config=${configPath}`);
    return;
  }

  // Step 2: Build
  const buildSuccess = await runCommand(
    'npm',
    ['run', 'build'],
    '🔨 Step 2/3: Building production site'
  );

  if (!buildSuccess) {
    console.error('\n❌ Build failed. Please check the errors above.');
    return;
  }

  // Step 3: Start dev server
  console.log('');
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('                    🎉 Your Venture is Ready!');
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('');
  console.log('  Starting preview server...');
  console.log('');
  console.log('  📍 Open in browser: http://localhost:3000');
  console.log('');
  console.log('  Press Ctrl+C to stop the server');
  console.log('');
  console.log('  When ready to deploy:');
  console.log('     npx vercel --prod');
  console.log('');

  // Start the server (this will keep running)
  await runCommand('npm', ['run', 'start'], '🚀 Step 3/3: Starting server');
}

async function promptForApiKey(): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    console.log('');
    console.log('🔑 Gemini API Key Required');
    console.log('');
    console.log('   Get your free API key at: https://makersuite.google.com/app/apikey');
    console.log('');
    rl.question('   Enter your Gemini API key: ', async (key) => {
      const trimmedKey = key.trim();

      // Ask if they want to save it
      rl.question('   Save to .env file for future use? (Y/n): ', (answer) => {
        rl.close();

        if (answer.toLowerCase() !== 'n') {
          const envPath = path.join(process.cwd(), '.env');
          fs.writeFileSync(envPath, `GEMINI_API_KEY=${trimmedKey}\n`);
          console.log('');
          console.log('   ✓ Saved to .env file');
        }

        resolve(trimmedKey);
      });
    });
  });
}

async function generateVentureConfig(description: string, providedApiKey?: string): Promise<object> {
  let apiKey = providedApiKey || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    apiKey = await promptForApiKey();
  }

  if (!apiKey) {
    throw new Error('API key is required');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

  const prompt = createVentureConfigPrompt(description);

  console.log('');
  console.log('🤖 Analyzing your business description with Gemini...');
  console.log('');

  const result = await model.generateContent(prompt);
  const response = result.response.text();

  // Extract JSON from response
  let jsonStr = response;

  // Try to extract JSON if wrapped in markdown
  const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  }

  // Try to find JSON object
  const objectMatch = jsonStr.match(/\{[\s\S]*\}/);
  if (objectMatch) {
    jsonStr = objectMatch[0];
  }

  try {
    const config = JSON.parse(jsonStr);

    // Add schema reference
    config.$schema = './venture.schema.json';

    return config;
  } catch (error) {
    console.error('Failed to parse Gemini response as JSON');
    console.error('Raw response:', response.substring(0, 500));
    throw new Error('Invalid JSON response from Gemini');
  }
}

function displayConfig(config: Record<string, unknown>): void {
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('                      Generated Venture Configuration');
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('');

  const business = config.business as Record<string, unknown>;
  const brand = config.brand as Record<string, unknown>;
  const colors = brand?.colors as Record<string, string>;
  const blog = config.blog as Record<string, unknown>;
  const seo = blog?.seo as Record<string, unknown>;

  console.log(`  📛 Name:          ${config.name}`);
  console.log(`  💡 Idea:          ${config.idea}`);
  console.log(`  ✨ Tagline:       ${config.tagline}`);
  console.log(`  🌐 Domain:        ${config.domain}`);
  console.log('');
  console.log(`  🏭 Industry:      ${business?.industry}`);
  console.log(`  📁 Category:      ${business?.category}`);
  console.log('');
  console.log('  🎯 Target Audience:');
  console.log(`     ${business?.target_audience}`);
  console.log('');
  console.log('  😤 Pain Points:');
  const painPoints = business?.pain_points as string[];
  painPoints?.forEach((point, i) => {
    console.log(`     ${i + 1}. ${point}`);
  });
  console.log('');
  console.log('  💎 Unique Selling Points:');
  const usps = business?.unique_selling_points as string[];
  usps?.forEach((usp, i) => {
    console.log(`     ${i + 1}. ${usp}`);
  });
  console.log('');
  console.log('  🎨 Brand Colors:');
  console.log(`     Primary:   ${colors?.primary}`);
  console.log(`     Secondary: ${colors?.secondary}`);
  console.log(`     Accent:    ${colors?.accent}`);
  console.log('');
  console.log('  🔍 SEO Keywords:');
  console.log(`     Primary:   ${seo?.primary_keyword}`);
  const secondaryKw = seo?.secondary_keywords as string[];
  console.log(`     Secondary: ${secondaryKw?.join(', ')}`);
  console.log('');
}

async function main(): Promise<void> {
  loadEnv();

  const args = parseArgs();
  let description: string;

  // Get description from args, file, or interactive input
  if (args.prompt) {
    description = args.prompt;
  } else if (args.file) {
    const filePath = path.resolve(process.cwd(), args.file);
    if (!fs.existsSync(filePath)) {
      console.error(`Error: File not found: ${args.file}`);
      process.exit(1);
    }
    description = fs.readFileSync(filePath, 'utf-8');
  } else if (args.interactive || process.argv.length === 2) {
    description = await getInteractiveInput();
  } else {
    console.log('');
    console.log('Usage:');
    console.log('  npx tsx scripts/create-venture.ts --prompt="Your business description"');
    console.log('  npx tsx scripts/create-venture.ts --file=./description.txt');
    console.log('  npx tsx scripts/create-venture.ts --interactive');
    console.log('  npx tsx scripts/create-venture.ts  (defaults to interactive mode)');
    console.log('');
    console.log('Options:');
    console.log('  --prompt="..."   Provide description directly');
    console.log('  --file=path      Read description from file');
    console.log('  --output=path    Output config to specific file (default: venture.config.json)');
    console.log('  --api-key=KEY    Gemini API key (or will prompt if not set)');
    console.log('  --interactive    Interactive mode with prompts');
    console.log('');
    console.log('If no API key is provided, you will be prompted to enter one.');
    console.log('Get your free key at: https://makersuite.google.com/app/apikey');
    console.log('');
    process.exit(0);
  }

  if (!description || description.trim().length < 20) {
    console.error('Error: Please provide a meaningful business description (at least 20 characters)');
    process.exit(1);
  }

  try {
    // Generate config using Gemini
    const config = await generateVentureConfig(description, args.apiKey);

    // Display the generated config
    displayConfig(config as Record<string, unknown>);

    // Determine output path
    const outputPath = args.output
      ? path.resolve(process.cwd(), args.output)
      : path.join(process.cwd(), 'venture.config.json');

    // Check if file exists
    if (fs.existsSync(outputPath) && !args.output) {
      const backupPath = outputPath.replace('.json', '.backup.json');
      fs.copyFileSync(outputPath, backupPath);
      console.log(`📦 Backed up existing config to: ${path.basename(backupPath)}`);
    }

    // Save config
    fs.writeFileSync(outputPath, JSON.stringify(config, null, 2));
    console.log(`✅ Config saved to: ${path.relative(process.cwd(), outputPath)}`);
    console.log('');

    // Ask if user wants to generate now
    const shouldGenerate = await askYesNo('Generate your venture now? (landing page + blog articles)');

    if (shouldGenerate) {
      await runFullGeneration(outputPath);
    } else {
      console.log('');
      console.log('═══════════════════════════════════════════════════════════════════════');
      console.log('                              Next Steps');
      console.log('═══════════════════════════════════════════════════════════════════════');
      console.log('');
      console.log('  1. Review the generated config and adjust if needed');
      console.log('');
      console.log('  2. Generate your venture:');
      console.log(`     npm run generate -- --config=${path.relative(process.cwd(), outputPath)}`);
      console.log('');
      console.log('  3. Preview locally:');
      console.log('     npm run build && npm run start');
      console.log('');
      console.log('  4. Deploy to Vercel:');
      console.log('     npx vercel --prod');
      console.log('');
    }
  } catch (error) {
    console.error('');
    console.error('❌ Error generating venture config:', error);
    process.exit(1);
  }
}

main();
