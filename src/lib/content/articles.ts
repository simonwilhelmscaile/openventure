import * as fs from 'fs';
import * as path from 'path';
import { Article, ArticleSection, BlogConfig } from './types';

// Check for dynamically generated articles first
function loadGeneratedArticles(): Article[] | null {
  try {
    // Look for generated articles in content directory first, then output
    const contentDirs = ['./content', './output'];
    let manifestPath = '';

    for (const dir of contentDirs) {
      const potentialPath = path.join(dir, 'blog', 'manifest.json');
      if (typeof window === 'undefined' && fs.existsSync(potentialPath)) {
        manifestPath = potentialPath;
        break;
      }
    }

    if (!manifestPath) {
      return null;
    }

    const manifestContent = fs.readFileSync(manifestPath, 'utf-8');
    const manifest = JSON.parse(manifestContent);

    const articles: Article[] = [];
    for (const article of manifest.articles || []) {
      // Convert from BlogArticle format to Article format
      articles.push(convertBlogArticleToArticle(article));
    }

    if (articles.length > 0) {
      return articles;
    }
  } catch {
    // Fall back to demo articles if loading fails
  }
  return null;
}

// Convert from the generator's BlogArticle format to our Article format
function convertBlogArticleToArticle(blogArticle: Record<string, unknown>): Article {
  const article: Article = {
    slug: blogArticle.slug as string,
    Headline: (blogArticle.headline as string) || '',
    Subtitle: (blogArticle.subtitle as string) || '',
    Teaser: (blogArticle.teaser as string) || '',
    TLDR: (blogArticle.tldr as string) || '',
    publication_date: (blogArticle.publication_date as string) || new Date().toISOString().split('T')[0],
    read_time: (blogArticle.read_time as number) || 5,
    word_count: (blogArticle.word_count as number) || 1500,
    category: undefined,
  };

  // Convert sections
  const sections = blogArticle.sections as Array<{ title: string; content: string; order: number }> | undefined;
  if (sections && Array.isArray(sections)) {
    sections.forEach((section, index) => {
      const num = String(index + 1).padStart(2, '0');
      const titleKey = `section_${num}_title` as keyof Article;
      const contentKey = `section_${num}_content` as keyof Article;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (article as any)[titleKey] = section.title;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (article as any)[contentKey] = section.content;
    });
  }

  // Convert key takeaways
  const keyTakeaways = blogArticle.key_takeaways as Array<{ text: string }> | undefined;
  if (keyTakeaways && Array.isArray(keyTakeaways)) {
    keyTakeaways.forEach((kt, index) => {
      if (index < 5) {
        const num = String(index + 1).padStart(2, '0');
        const key = `key_takeaway_${num}` as keyof Article;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (article as any)[key] = kt.text;
      }
    });
  }

  // Convert tables
  const tables = blogArticle.tables as Array<{ title: string; headers: string[]; rows: string[][] }> | undefined;
  if (tables && Array.isArray(tables)) {
    article.tables = tables.map(t => ({
      title: t.title,
      headers: t.headers,
      rows: t.rows,
    }));
  }

  // Convert FAQ items
  const faqItems = blogArticle.faq_items as Array<{ question: string; answer: string }> | undefined;
  if (faqItems && Array.isArray(faqItems)) {
    article.faq_items = faqItems;
  }

  return article;
}

// Demo articles for OpenVenture
const demoArticles: Article[] = [
  {
    slug: '01-launch-your-business-faster',
    Headline: 'How AI is Revolutionizing Startup Launches in 2024',
    Subtitle: 'Discover how modern entrepreneurs are using AI to go from idea to market in days, not months',
    Teaser: 'The startup landscape has fundamentally changed. What once took teams of developers months to build can now be generated in hours. This comprehensive guide explores how AI-powered tools are transforming the way entrepreneurs launch their businesses.',
    TLDR: 'AI tools now enable entrepreneurs to launch complete websites with SEO-optimized content in hours instead of months. This shift democratizes startup creation and levels the playing field for solo founders.',
    publication_date: '2024-12-30',
    read_time: 8,
    word_count: 2400,
    category: 'Startup Strategy',
    key_takeaway_01: 'AI can generate production-ready websites 10x faster than traditional development',
    key_takeaway_02: 'SEO-optimized content is now accessible to non-technical founders',
    key_takeaway_03: 'The cost of launching has dropped from $50k+ to under $500',
    section_01_title: 'The Traditional Startup Launch Problem',
    section_01_content: '<p>Launching a startup has traditionally required a significant investment of time, money, and expertise. Founders needed to hire developers, designers, and content writers before they could even validate their ideas. This created a barrier that prevented many great ideas from ever reaching the market.</p><p>The average tech startup spent between $50,000 and $150,000 just on their initial website and marketing materials. For solo founders or bootstrapped teams, this was often an insurmountable obstacle.</p>',
    section_02_title: 'How AI Changes Everything',
    section_02_content: '<p>Artificial intelligence has fundamentally disrupted this paradigm. Modern AI tools can now generate complete landing pages, write compelling copy, and create SEO-optimized blog content in a fraction of the time and cost.</p><p>These tools understand context, industry best practices, and user psychology. They can produce output that rivals or exceeds what many agencies deliver, at a fraction of the cost.</p>',
    section_03_title: 'The New Startup Playbook',
    section_03_content: '<p>Today\'s most successful founders follow a radically different playbook. They start with a simple configuration file describing their business idea, and within hours have a fully functional website with professional content.</p><p>This approach allows for rapid iteration and testing. Instead of spending months building before launch, founders can get real market feedback within days.</p>',
    section_04_title: 'Case Study: From Idea to Launch in 48 Hours',
    section_04_content: '<p>Consider the story of a SaaS founder who used AI-powered tools to launch their project management platform. Starting on Monday morning with just a business idea, they had a complete landing page, 6 SEO-optimized blog articles, and were live on Vercel by Wednesday afternoon.</p><p>Their first paying customer came within the first week, validating the approach before significant investment was made.</p>',
    section_05_title: 'The Technology Stack Behind AI Launches',
    section_05_content: '<p>Modern AI launch platforms typically combine several technologies: Large Language Models for content generation, modern frontend frameworks like Next.js for the website, and deployment platforms like Vercel for instant global distribution.</p><p>This stack provides enterprise-grade performance and reliability at a fraction of the traditional cost.</p>',
    section_06_title: 'SEO Benefits of AI-Generated Content',
    section_06_content: '<p>One of the most significant advantages of AI-powered launches is the quality of SEO-optimized content. AI tools can analyze successful content patterns and generate articles that rank well from day one.</p><p>This includes proper keyword density, internal linking strategies, and content structures that search engines favor.</p>',
    section_07_title: 'Common Mistakes to Avoid',
    section_07_content: '<p>While AI tools are powerful, there are pitfalls to avoid. The most common mistake is treating AI-generated content as final without review. Always edit and personalize the output to match your brand voice.</p><p>Another mistake is over-relying on templates. The best results come from customizing the generated content to your specific audience and value proposition.</p>',
    tables: [
      {
        title: 'Traditional vs AI-Powered Launch Comparison',
        headers: ['Aspect', 'Traditional Launch', 'AI-Powered Launch'],
        rows: [
          ['Time to Launch', '3-6 months', '1-3 days'],
          ['Initial Cost', '$50,000+', 'Under $500'],
          ['Team Required', '5-10 people', '1 person'],
          ['Content Volume', '5-10 pages', '20+ pages'],
          ['SEO Optimization', 'Requires expert', 'Built-in']
        ],
        after_section: 2
      }
    ],
    faq_items: [
      { question: 'Can AI really replace human developers?', answer: 'AI doesn\'t replace developers but augments them. It handles repetitive tasks so founders can focus on strategy and customization.' },
      { question: 'Is AI-generated content good for SEO?', answer: 'Yes, when properly configured. AI tools can follow SEO best practices consistently and generate content optimized for search engines.' },
      { question: 'How much does an AI-powered launch cost?', answer: 'Most AI launch tools cost between $100-500 for a complete website with content, compared to $50,000+ for traditional development.' },
      { question: 'Can I customize AI-generated content?', answer: 'Absolutely. AI-generated content should be treated as a first draft that you personalize to match your brand voice.' },
      { question: 'What technical skills do I need?', answer: 'Most AI launch platforms require minimal technical skills. If you can fill out a form and edit text, you can launch a website.' }
    ]
  },
  {
    slug: '02-seo-optimization-guide',
    Headline: 'The Complete SEO Guide for New Websites in 2024',
    Subtitle: 'Everything you need to know to rank your new website on Google from day one',
    Teaser: 'Search engine optimization remains the most cost-effective way to drive organic traffic to your website. This comprehensive guide covers everything from technical SEO to content strategy for new websites.',
    TLDR: 'New websites can compete in search rankings by focusing on technical SEO fundamentals, high-quality content, and strategic keyword targeting. AI tools have made SEO accessible to non-experts.',
    publication_date: '2024-12-29',
    read_time: 10,
    word_count: 3000,
    category: 'SEO',
    key_takeaway_01: 'Technical SEO is the foundation - get Core Web Vitals right first',
    key_takeaway_02: 'Content quality matters more than quantity for new sites',
    key_takeaway_03: 'AI tools can generate SEO-optimized content at scale',
    section_01_title: 'Why SEO Matters for New Websites',
    section_01_content: '<p>Search engine optimization is the process of improving your website to increase its visibility in search results. For new websites, SEO is often the most cost-effective marketing channel available.</p><p>Unlike paid advertising, SEO traffic is sustainable and grows over time. A well-optimized website can generate thousands of visitors monthly without ongoing advertising costs.</p>',
    section_02_title: 'Technical SEO Fundamentals',
    section_02_content: '<p>Before focusing on content, ensure your technical SEO is solid. This includes page speed optimization, mobile responsiveness, and proper HTML structure.</p><p>Google\'s Core Web Vitals are now a ranking factor. Ensure your Largest Contentful Paint (LCP) is under 2.5 seconds, First Input Delay (FID) is under 100ms, and Cumulative Layout Shift (CLS) is under 0.1.</p>',
    section_03_title: 'Keyword Research Strategy',
    section_03_content: '<p>Effective keyword research is the foundation of successful SEO. Start by identifying the terms your target audience uses when searching for solutions like yours.</p><p>For new websites, focus on long-tail keywords with lower competition. These terms may have less search volume but are easier to rank for and often convert better.</p>',
    section_04_title: 'Content Creation Best Practices',
    section_04_content: '<p>Content remains king in SEO. Create comprehensive, helpful content that answers your audience\'s questions thoroughly. Aim for depth over breadth initially.</p><p>Each piece of content should target specific keywords while providing genuine value. Avoid thin content or keyword stuffing, which can trigger penalties.</p>',
    section_05_title: 'On-Page SEO Optimization',
    section_05_content: '<p>On-page SEO involves optimizing individual pages to rank higher. This includes meta titles, descriptions, header tags, and internal linking.</p><p>Ensure each page has a unique, keyword-rich title under 60 characters and a compelling meta description under 160 characters.</p>',
    section_06_title: 'Building Quality Backlinks',
    section_06_content: '<p>Backlinks from reputable websites signal to Google that your content is valuable. Focus on earning links through quality content rather than buying them.</p><p>Guest posting, creating linkable assets like research or tools, and building relationships in your industry are effective link-building strategies.</p>',
    tables: [
      {
        title: 'SEO Priority Matrix for New Websites',
        headers: ['Priority', 'Task', 'Impact', 'Effort'],
        rows: [
          ['1', 'Technical SEO Audit', 'High', 'Medium'],
          ['2', 'Keyword Research', 'High', 'Low'],
          ['3', 'Content Creation', 'High', 'High'],
          ['4', 'On-Page Optimization', 'Medium', 'Low'],
          ['5', 'Link Building', 'Medium', 'High']
        ],
        after_section: 3
      }
    ],
    faq_items: [
      { question: 'How long does SEO take to show results?', answer: 'Typically 3-6 months for new websites, though some results may appear sooner for low-competition keywords.' },
      { question: 'Should I focus on SEO or paid ads first?', answer: 'Start with SEO fundamentals while using paid ads for immediate traffic. SEO provides long-term sustainable growth.' },
      { question: 'How many keywords should I target?', answer: 'Start with 5-10 primary keywords and expand as you gain authority. Each page should focus on one primary keyword.' },
      { question: 'Is AI-generated content bad for SEO?', answer: 'Google focuses on content quality, not origin. Well-edited AI content that provides value can rank well.' }
    ]
  },
  {
    slug: '03-ai-content-generation',
    Headline: 'Mastering AI Content Generation for Business Growth',
    Subtitle: 'How to leverage AI tools to create high-quality content at scale without sacrificing authenticity',
    Teaser: 'AI content generation has evolved from a novelty to a necessity for competitive businesses. Learn how to use these tools effectively while maintaining your brand\'s unique voice.',
    TLDR: 'AI content tools can dramatically increase content output while maintaining quality. Success requires strategic prompting, human oversight, and brand voice integration.',
    publication_date: '2024-12-28',
    read_time: 7,
    word_count: 2100,
    category: 'Content Strategy',
    key_takeaway_01: 'AI is a tool that amplifies human creativity, not replaces it',
    key_takeaway_02: 'Prompt engineering is the key skill for AI content success',
    key_takeaway_03: 'Always add human review and brand voice customization',
    section_01_title: 'The Evolution of AI Content Tools',
    section_01_content: '<p>AI content generation has progressed rapidly from basic text spinners to sophisticated language models that can produce nuanced, contextual content. Today\'s tools understand industry terminology, writing styles, and audience preferences.</p><p>This evolution means that AI-generated content can now serve as a foundation for high-quality marketing materials, blog posts, and website copy.</p>',
    section_02_title: 'Strategic Content Planning with AI',
    section_02_content: '<p>Effective AI content generation starts with strategy. Define your content pillars, target keywords, and audience personas before generating any content.</p><p>Use AI to brainstorm topics, create content calendars, and identify gaps in your existing content library.</p>',
    section_03_title: 'Prompt Engineering Fundamentals',
    section_03_content: '<p>The quality of AI output depends heavily on input quality. Learn to write detailed prompts that include context, desired tone, target audience, and specific requirements.</p><p>Include examples of your brand voice and specify any industry terminology or concepts that should be incorporated.</p>',
    section_04_title: 'Maintaining Brand Voice Consistency',
    section_04_content: '<p>One challenge with AI content is maintaining consistent brand voice. Develop a style guide that AI can follow, and always edit output to align with your brand personality.</p><p>Create a library of approved phrases, terminology, and tone examples that can be referenced in prompts.</p>',
    section_05_title: 'Quality Control and Editing',
    section_05_content: '<p>AI-generated content should always undergo human review. Check for accuracy, brand alignment, and potential issues before publishing.</p><p>Develop an editing checklist that covers fact-checking, tone verification, and SEO optimization.</p>',
    tables: [
      {
        title: 'AI Content Tool Comparison',
        headers: ['Tool Type', 'Best For', 'Limitations'],
        rows: [
          ['LLM APIs', 'Custom applications', 'Requires development'],
          ['AI Writers', 'Blog content', 'May lack depth'],
          ['All-in-One Platforms', 'Complete websites', 'Higher cost']
        ],
        after_section: 1
      }
    ],
    faq_items: [
      { question: 'Will Google penalize AI content?', answer: 'Google evaluates content quality, not origin. High-quality, helpful AI content that serves users can rank well.' },
      { question: 'How do I maintain authenticity with AI?', answer: 'Use AI as a starting point and add personal insights, examples, and brand voice through editing.' },
      { question: 'What\'s the best AI content tool?', answer: 'The best tool depends on your needs. Platforms like OpenVenture combine content generation with website building for comprehensive solutions.' }
    ]
  },
  {
    slug: '04-landing-page-best-practices',
    Headline: 'High-Converting Landing Page Design: A Complete Guide',
    Subtitle: 'The psychology and design principles behind landing pages that convert visitors into customers',
    Teaser: 'Your landing page is often the first impression potential customers have of your business. Learn the proven strategies that turn visitors into leads and customers.',
    TLDR: 'Effective landing pages combine clear value propositions, social proof, and strategic CTAs. Design should remove friction and guide visitors toward conversion.',
    publication_date: '2024-12-27',
    read_time: 9,
    word_count: 2700,
    category: 'Conversion Optimization',
    key_takeaway_01: 'Clear value proposition above the fold is essential',
    key_takeaway_02: 'Social proof significantly increases conversion rates',
    key_takeaway_03: 'Reduce friction by limiting form fields and options',
    section_01_title: 'The Anatomy of a High-Converting Landing Page',
    section_01_content: '<p>Successful landing pages share common elements: a compelling headline, clear value proposition, supporting visuals, social proof, and a prominent call-to-action.</p><p>Each element should work together to move visitors toward conversion while addressing potential objections.</p>',
    section_02_title: 'Crafting Compelling Headlines',
    section_02_content: '<p>Your headline is the most important element on your landing page. It should immediately communicate your primary benefit and capture attention.</p><p>Effective headlines are specific, benefit-focused, and speak directly to your target audience\'s pain points or desires.</p>',
    section_03_title: 'The Power of Social Proof',
    section_03_content: '<p>Social proof reduces perceived risk and builds trust. Include testimonials, logos of clients, case study metrics, and user counts when available.</p><p>The most effective social proof is specific and includes measurable results.</p>',
    section_04_title: 'Optimizing Call-to-Action Buttons',
    section_04_content: '<p>Your CTA should stand out visually and use action-oriented language. Test different colors, sizes, and text to find what converts best.</p><p>Consider the stage of your funnel when crafting CTA text. Early-stage visitors may prefer low-commitment options like "Learn More."</p>',
    section_05_title: 'Mobile Optimization Essentials',
    section_05_content: '<p>Over 50% of web traffic comes from mobile devices. Ensure your landing page loads fast and is easy to navigate on smaller screens.</p><p>Test your CTAs are easily tappable and forms are simple to complete on mobile.</p>',
    tables: [
      {
        title: 'Landing Page Element Impact on Conversion',
        headers: ['Element', 'Average Impact', 'Priority'],
        rows: [
          ['Headline', '+30-50%', 'Critical'],
          ['Social Proof', '+15-25%', 'High'],
          ['CTA Design', '+10-20%', 'High'],
          ['Page Speed', '+5-15%', 'Medium']
        ],
        after_section: 1
      }
    ],
    faq_items: [
      { question: 'How long should a landing page be?', answer: 'Length depends on offer complexity. Simple offers need short pages; expensive or complex products benefit from longer pages.' },
      { question: 'Should I use video on landing pages?', answer: 'Video can increase conversions but may slow load times. Test to see if video improves your specific metrics.' },
      { question: 'How many CTAs should I include?', answer: 'Include one primary CTA repeated throughout the page. Avoid competing CTAs that could confuse visitors.' }
    ]
  },
  {
    slug: '05-startup-growth-strategies',
    Headline: 'Proven Growth Strategies for Early-Stage Startups',
    Subtitle: 'From zero to traction: the playbook successful founders use to scale quickly',
    Teaser: 'Growing a startup requires different strategies than established businesses. This guide covers the tactics that work specifically for early-stage companies with limited resources.',
    TLDR: 'Early-stage growth focuses on finding product-market fit, building distribution channels, and creating viral loops. Start with strategies that don\'t scale, then systematize.',
    publication_date: '2024-12-26',
    read_time: 11,
    word_count: 3300,
    category: 'Growth',
    key_takeaway_01: 'Product-market fit is the prerequisite for sustainable growth',
    key_takeaway_02: 'Do things that don\'t scale to learn before automating',
    key_takeaway_03: 'Build distribution into your product when possible',
    section_01_title: 'Understanding Startup Growth Dynamics',
    section_01_content: '<p>Startup growth differs fundamentally from traditional business growth. Startups need to achieve escape velocity before running out of runway, requiring aggressive but sustainable growth tactics.</p><p>The key is finding repeatable, scalable acquisition channels that can grow with your company.</p>',
    section_02_title: 'Finding Product-Market Fit First',
    section_02_content: '<p>Before focusing on growth, ensure you have product-market fit. Signs include organic word-of-mouth, high retention, and users being upset when they can\'t use your product.</p><p>Premature scaling is a leading cause of startup failure. Validate demand before investing in growth.</p>',
    section_03_title: 'The Power of Content Marketing',
    section_03_content: '<p>Content marketing is one of the most effective channels for startups with limited budgets. Create valuable content that attracts your target audience organically.</p><p>Focus on topics where you have unique expertise or perspective. Consistency matters more than volume initially.</p>',
    section_04_title: 'Building Viral Loops',
    section_04_content: '<p>The most successful startups build virality into their product. This could be through referral programs, collaborative features, or shareworthy output.</p><p>Identify moments of value creation where users are naturally inclined to share, and make sharing effortless.</p>',
    section_05_title: 'Community-Led Growth',
    section_05_content: '<p>Building a community around your product creates sustainable competitive advantages. Communities generate word-of-mouth, provide feedback, and create content.</p><p>Start small with direct engagement before trying to scale community efforts.</p>',
    tables: [
      {
        title: 'Growth Channel Comparison for Startups',
        headers: ['Channel', 'Cost', 'Time to Results', 'Scalability'],
        rows: [
          ['Content/SEO', 'Low', 'Slow', 'High'],
          ['Paid Ads', 'High', 'Fast', 'Medium'],
          ['Virality', 'Low', 'Variable', 'Very High'],
          ['Community', 'Medium', 'Slow', 'High']
        ],
        after_section: 3
      }
    ],
    faq_items: [
      { question: 'When should I start focusing on growth?', answer: 'After achieving product-market fit, typically indicated by strong retention and organic referrals.' },
      { question: 'How much should I spend on marketing?', answer: 'Early stage, focus on zero or low-cost channels. Paid acquisition should come after proving unit economics.' },
      { question: 'Should I focus on one channel or diversify?', answer: 'Master one channel before expanding. Most successful startups have one dominant acquisition channel.' }
    ]
  },
  {
    slug: '06-competitor-analysis-howto',
    Headline: 'How to Conduct Competitor Analysis That Drives Strategy',
    Subtitle: 'Transform competitor intelligence into actionable insights for your business',
    Teaser: 'Understanding your competition is essential for strategic planning. Learn how to analyze competitors effectively and use insights to improve your own positioning.',
    TLDR: 'Effective competitor analysis examines positioning, features, pricing, and marketing strategies. Use insights to differentiate, not imitate. Focus on underserved customer needs.',
    publication_date: '2024-12-25',
    read_time: 8,
    word_count: 2400,
    category: 'Strategy',
    key_takeaway_01: 'Analyze competitors to differentiate, not to copy',
    key_takeaway_02: 'Look for underserved customer segments and needs',
    key_takeaway_03: 'Monitor competitors ongoing, not just once',
    section_01_title: 'Why Competitor Analysis Matters',
    section_01_content: '<p>Competitor analysis helps you understand the competitive landscape, identify opportunities, and refine your positioning. It\'s not about copying but about finding your unique angle.</p><p>Regular analysis keeps you informed about market changes and helps anticipate competitive moves.</p>',
    section_02_title: 'Identifying Your True Competitors',
    section_02_content: '<p>Start by identifying direct competitors (similar products for similar audiences) and indirect competitors (different products solving similar problems).</p><p>Don\'t forget to consider future competitors - companies that could enter your market.</p>',
    section_03_title: 'Analyzing Competitor Positioning',
    section_03_content: '<p>Examine how competitors position themselves in the market. What audiences do they target? What benefits do they emphasize? What\'s their brand personality?</p><p>Map competitors on a positioning matrix to visualize gaps and opportunities.</p>',
    section_04_title: 'Feature and Pricing Analysis',
    section_04_content: '<p>Create detailed comparisons of features and pricing across competitors. Identify must-have features vs. differentiators.</p><p>Look for pricing gaps that could represent positioning opportunities.</p>',
    section_05_title: 'Monitoring Competitor Marketing',
    section_05_content: '<p>Track competitor marketing activities including content, ads, social media, and email campaigns. Note what resonates with audiences.</p><p>Use tools to monitor competitor keywords, backlinks, and traffic estimates.</p>',
    tables: [
      {
        title: 'Competitor Analysis Framework',
        headers: ['Dimension', 'What to Analyze', 'Tools to Use'],
        rows: [
          ['Positioning', 'Messaging, target audience', 'Website review, surveys'],
          ['Product', 'Features, UX, integrations', 'Free trials, reviews'],
          ['Pricing', 'Plans, discounts, value', 'Pricing pages, sales calls'],
          ['Marketing', 'Channels, content, ads', 'SEMrush, SimilarWeb']
        ],
        after_section: 4
      }
    ],
    faq_items: [
      { question: 'How often should I analyze competitors?', answer: 'Do deep analysis quarterly and maintain ongoing monitoring of key competitors monthly.' },
      { question: 'Should I talk to competitor customers?', answer: 'Yes, understanding why they chose competitors provides valuable insights for your positioning.' },
      { question: 'What if I don\'t have direct competitors?', answer: 'Analyze adjacent solutions or how your target audience currently solves the problem you address.' }
    ]
  }
];

export const blogConfig: BlogConfig = {
  name: 'OpenVenture',
  tagline: 'Stay ahead in the age of AI startups',
  description: 'Insights, strategies, and guides for launching and growing your venture with AI-powered tools',
  author: {
    name: 'OpenVenture Team',
    title: 'AI & Startup Experts',
    avatar_url: '/images/authors/default-avatar.png'
  }
};

// Cache for loaded articles
let cachedArticles: Article[] | null = null;

function getArticles(): Article[] {
  if (cachedArticles) return cachedArticles;

  // Try to load generated articles first
  const generatedArticles = loadGeneratedArticles();
  if (generatedArticles) {
    cachedArticles = generatedArticles;
    return cachedArticles;
  }

  // Fall back to demo articles
  cachedArticles = demoArticles;
  return cachedArticles;
}

export function getAllArticles(): Article[] {
  return getArticles().sort((a, b) =>
    new Date(b.publication_date).getTime() - new Date(a.publication_date).getTime()
  );
}

export function getArticleBySlug(slug: string): Article | undefined {
  return getArticles().find(article => article.slug === slug);
}

export function getArticleCount(): number {
  return getArticles().length;
}

export function getArticleSections(article: Article): ArticleSection[] {
  const sections: ArticleSection[] = [];

  for (let i = 1; i <= 9; i++) {
    const titleKey = `section_0${i}_title` as keyof Article;
    const contentKey = `section_0${i}_content` as keyof Article;

    const title = article[titleKey] as string | undefined;
    const content = article[contentKey] as string | undefined;

    if (title && content) {
      sections.push({
        id: `section-${i}`,
        title,
        content
      });
    }
  }

  return sections;
}

export function getKeyTakeaways(article: Article): string[] {
  const takeaways: string[] = [];

  for (let i = 1; i <= 5; i++) {
    const key = `key_takeaway_0${i}` as keyof Article;
    const value = article[key] as string | undefined;
    if (value) takeaways.push(value);
  }

  return takeaways;
}

export function getNextArticle(currentSlug: string): Article | undefined {
  const articles = getAllArticles();
  const currentIndex = articles.findIndex(a => a.slug === currentSlug);

  if (currentIndex >= 0 && currentIndex < articles.length - 1) {
    return articles[currentIndex + 1];
  }

  return undefined;
}

export function getPreviousArticle(currentSlug: string): Article | undefined {
  const articles = getAllArticles();
  const currentIndex = articles.findIndex(a => a.slug === currentSlug);

  if (currentIndex > 0) {
    return articles[currentIndex - 1];
  }

  return undefined;
}

export function getArticleIndex(slug: string): number {
  const articles = getAllArticles();
  return articles.findIndex(a => a.slug === slug) + 1;
}
