import type { LandingPageContent } from '@/types';

export const demoLandingContent: LandingPageContent = {
  venture_id: 'demo-venture',
  venture_name: 'OpenVenture',
  generated_at: new Date().toISOString(),
  hero: {
    badge: 'NEW',
    headline: 'Launch Your Business in Minutes, Not Months',
    subheadline: 'Generate production-ready websites and SEO-optimized blog content from a single business idea. Powered by AI, built for entrepreneurs.',
    primary_cta: {
      text: 'Get Started Free',
      href: '#pricing',
    },
    secondary_cta: {
      text: 'See How It Works',
      href: '#showcase',
    },
  },
  social_proof: {
    headline: 'Trusted by innovative startups worldwide',
    logos: [
      { name: 'TechCrunch', alt: 'TechCrunch logo' },
      { name: 'ProductHunt', alt: 'ProductHunt logo' },
      { name: 'Forbes', alt: 'Forbes logo' },
      { name: 'Wired', alt: 'Wired logo' },
      { name: 'FastCompany', alt: 'FastCompany logo' },
      { name: 'Inc', alt: 'Inc logo' },
    ],
  },
  features: {
    headline: 'Everything you need to launch faster',
    subheadline: 'From idea to live website in under an hour',
    features: [
      {
        id: 'feature-1',
        icon: 'zap',
        title: 'Lightning Fast Generation',
        description: 'Generate complete landing pages and blog content in minutes, not weeks. Our AI understands your business and creates tailored content.',
        features: ['10x faster than traditional development', 'No coding required', 'Production-ready output'],
      },
      {
        id: 'feature-2',
        icon: 'chart',
        title: 'SEO-Optimized Content',
        description: 'Every piece of content is optimized for search engines from day one. Drive organic traffic with keyword-rich articles.',
        features: ['Keyword research included', 'Meta tags auto-generated', 'Internal linking strategy'],
      },
      {
        id: 'feature-3',
        icon: 'globe',
        title: 'Multi-Language Support',
        description: 'Launch in any market with automatic translations and locale-specific content optimization.',
        features: ['German & English support', 'Cultural adaptation', 'Local SEO optimization'],
      },
      {
        id: 'feature-4',
        icon: 'shield',
        title: 'Enterprise Security',
        description: 'Your data is protected with industry-leading security practices and compliance standards.',
        features: ['SOC 2 compliant', 'GDPR ready', 'Encrypted at rest'],
      },
      {
        id: 'feature-5',
        icon: 'users',
        title: 'Team Collaboration',
        description: 'Work together seamlessly with your team. Share projects, review content, and deploy together.',
        features: ['Unlimited team members', 'Role-based access', 'Comment & feedback'],
      },
      {
        id: 'feature-6',
        icon: 'clock',
        title: '24/7 Support',
        description: 'Our team is always here to help. Get answers to your questions anytime, anywhere.',
        features: ['Live chat support', 'Email within 1 hour', 'Dedicated success manager'],
      },
    ],
  },
  feature_showcase: {
    showcases: [
      {
        id: 'showcase-1',
        headline: 'One Config, Complete Website',
        subheadline: 'Define your business once, get everything generated',
        description: 'Simply fill out your venture.config.json with your business idea, target audience, and brand preferences. Our AI handles the rest, generating a complete landing page with hero section, features, pricing, testimonials, and more.',
        bullets: [
          'Smart competitor analysis',
          'Industry-specific copy',
          'Responsive design included',
          'Dark mode support',
          'Accessibility compliant',
        ],
        cta: {
          text: 'See Examples',
          href: '#examples',
        },
        image_position: 'left',
      },
      {
        id: 'showcase-2',
        headline: '10 SEO Articles, Zero Effort',
        subheadline: 'Content that ranks and converts',
        description: 'Every venture comes with 10 professionally written, SEO-optimized blog articles. Each article includes TLDR, key takeaways, FAQ sections, and comparison tables to maximize engagement and search visibility.',
        bullets: [
          '2,000+ words per article',
          'Keyword-optimized headings',
          'Internal linking strategy',
          'Schema markup included',
          'Featured snippets optimized',
        ],
        cta: {
          text: 'View Sample Article',
          href: '#blog',
        },
        image_position: 'right',
      },
      {
        id: 'showcase-3',
        headline: 'Deploy Anywhere, Instantly',
        subheadline: 'One-click deployment to Vercel, Netlify, or any platform',
        description: 'Your generated website is production-ready from the start. Deploy to Vercel with a single command, set up your custom domain, and start collecting leads immediately. No DevOps knowledge required.',
        bullets: [
          'GitHub Actions included',
          'Preview deployments',
          'Custom domains',
          'SSL certificates',
          'Global CDN',
        ],
        cta: {
          text: 'Start Deploying',
          href: '#deploy',
        },
        image_position: 'left',
      },
    ],
  },
  pricing: {
    headline: 'Simple, transparent pricing',
    subheadline: 'Start free, scale when you need',
    tiers: [
      {
        id: 'tier-1',
        name: 'Starter',
        description: 'Perfect for side projects and MVPs',
        price: {
          monthly: 0,
          yearly: 0,
        },
        currency: 'EUR',
        billing_text: 'Free forever',
        features: [
          { text: '1 venture project', included: true },
          { text: '5 blog articles', included: true },
          { text: 'Basic landing page', included: true },
          { text: 'Community support', included: true },
          { text: 'Competitor analysis', included: false },
          { text: 'Custom domains', included: false },
          { text: 'Priority support', included: false },
        ],
        cta: {
          text: 'Get Started',
          href: '#signup',
        },
        highlighted: false,
      },
      {
        id: 'tier-2',
        name: 'Professional',
        description: 'For serious entrepreneurs and startups',
        price: {
          monthly: 49,
          yearly: 490,
        },
        currency: 'EUR',
        billing_text: 'per month',
        features: [
          { text: 'Unlimited ventures', included: true, highlight: true },
          { text: '10 blog articles per venture', included: true },
          { text: 'Premium landing pages', included: true },
          { text: 'Priority support', included: true },
          { text: 'Competitor analysis', included: true },
          { text: 'Custom domains', included: true },
          { text: 'API access', included: false },
        ],
        cta: {
          text: 'Start Free Trial',
          href: '#signup',
        },
        highlighted: true,
        badge: 'Most Popular',
      },
      {
        id: 'tier-3',
        name: 'Enterprise',
        description: 'For agencies and large teams',
        price: {
          monthly: 199,
          yearly: 1990,
        },
        currency: 'EUR',
        billing_text: 'per month',
        features: [
          { text: 'Everything in Professional', included: true },
          { text: 'Unlimited blog articles', included: true, highlight: true },
          { text: 'White-label solution', included: true },
          { text: 'Dedicated success manager', included: true },
          { text: 'Custom integrations', included: true },
          { text: 'API access', included: true },
          { text: 'SLA guarantee', included: true },
        ],
        cta: {
          text: 'Contact Sales',
          href: '#contact',
        },
        highlighted: false,
      },
    ],
    billing_toggle: true,
  },
  testimonials: {
    headline: 'Loved by entrepreneurs worldwide',
    testimonials: [
      {
        id: 'testimonial-1',
        quote: 'OpenVenture saved us months of development time. We launched our SaaS landing page and blog in a single afternoon. The quality of the generated content exceeded our expectations.',
        author: {
          name: 'Sarah Chen',
          title: 'Founder',
          company: 'DataFlow AI',
        },
        rating: 5,
      },
      {
        id: 'testimonial-2',
        quote: 'As a non-technical founder, I was amazed at how easy it was to get a professional website up and running. The SEO articles are already ranking on the first page of Google.',
        author: {
          name: 'Marcus Weber',
          title: 'CEO',
          company: 'GreenTech Solutions',
        },
        rating: 5,
      },
      {
        id: 'testimonial-3',
        quote: 'We use OpenVenture for all our client projects now. The consistency and quality of the output has transformed our agency\'s delivery speed and client satisfaction.',
        author: {
          name: 'Elena Rodriguez',
          title: 'Creative Director',
          company: 'Pixel Perfect Agency',
        },
        rating: 5,
      },
    ],
  },
  faq: {
    headline: 'Frequently Asked Questions',
    subheadline: 'Everything you need to know about OpenVenture',
    items: [
      {
        id: 'faq-1',
        question: 'How does OpenVenture generate content?',
        answer: 'OpenVenture uses advanced AI models (Gemini 2.0 Flash) to analyze your business idea and generate tailored content. You provide a configuration file with your business details, and our system creates a complete landing page and SEO-optimized blog articles.',
      },
      {
        id: 'faq-2',
        question: 'Can I customize the generated content?',
        answer: 'Absolutely! All generated content is provided as editable code (React/Next.js) and JSON. You have full control to modify, extend, or completely redesign any part of your website.',
      },
      {
        id: 'faq-3',
        question: 'What languages are supported?',
        answer: 'Currently, OpenVenture supports English and German content generation. We configure the locale in your venture.config.json, and all content is generated in your chosen language with proper SEO optimization.',
      },
      {
        id: 'faq-4',
        question: 'How do I deploy my generated website?',
        answer: 'Your website is automatically set up with GitHub Actions for CI/CD. Simply push to GitHub, and it deploys to Vercel automatically. Custom domains and SSL certificates are handled for you.',
      },
      {
        id: 'faq-5',
        question: 'Is there a free trial?',
        answer: 'Yes! Our Starter plan is completely free and includes one venture project with 5 blog articles. Upgrade to Professional when you need more capacity or advanced features.',
      },
      {
        id: 'faq-6',
        question: 'What kind of support do you offer?',
        answer: 'Starter users get community support through our Discord. Professional and Enterprise customers receive priority email support with guaranteed response times and access to our success team.',
      },
      {
        id: 'faq-7',
        question: 'Can I use OpenVenture for client projects?',
        answer: 'Yes! Our Enterprise plan includes white-label capabilities, allowing agencies to use OpenVenture for client work without any OpenVenture branding on the generated sites.',
      },
      {
        id: 'faq-8',
        question: 'What happens to my data?',
        answer: 'Your data is encrypted at rest and in transit. We never share your business information with third parties. You can export or delete your data at any time through your dashboard.',
      },
    ],
  },
  cta: {
    headline: 'Ready to launch your venture?',
    subheadline: 'Join thousands of entrepreneurs who have already transformed their ideas into reality. Start your journey today.',
    primary_cta: {
      text: 'Get Started Free',
      href: '#signup',
    },
    secondary_cta: {
      text: 'Schedule Demo',
      href: '#demo',
    },
    background_style: 'gradient',
  },
  footer: {
    columns: [
      {
        title: 'Product',
        links: [
          { text: 'Features', href: '#features' },
          { text: 'Pricing', href: '#pricing' },
          { text: 'Examples', href: '#examples' },
          { text: 'Changelog', href: '/changelog' },
        ],
      },
      {
        title: 'Company',
        links: [
          { text: 'About', href: '/about' },
          { text: 'Blog', href: '/blog' },
          { text: 'Careers', href: '/careers' },
          { text: 'Contact', href: '/contact' },
        ],
      },
      {
        title: 'Resources',
        links: [
          { text: 'Documentation', href: '/docs' },
          { text: 'API Reference', href: '/api' },
          { text: 'Help Center', href: '/help' },
          { text: 'Community', href: '/community' },
        ],
      },
      {
        title: 'Legal',
        links: [
          { text: 'Privacy', href: '/privacy' },
          { text: 'Terms', href: '/terms' },
          { text: 'Cookies', href: '/cookies' },
          { text: 'Licenses', href: '/licenses' },
        ],
      },
    ],
    social_links: [
      { platform: 'twitter', href: 'https://twitter.com/openventure' },
      { platform: 'linkedin', href: 'https://linkedin.com/company/openventure' },
      { platform: 'github', href: 'https://github.com/openventure' },
    ],
    copyright: '© 2024 OpenVenture. All rights reserved.',
    bottom_links: [
      { text: 'Privacy Policy', href: '/privacy' },
      { text: 'Terms of Service', href: '/terms' },
      { text: 'Cookie Settings', href: '#cookies' },
    ],
  },
  meta: {
    title: 'OpenVenture - Launch Your Business in Minutes',
    description: 'Generate production-ready websites and SEO-optimized blog content from a single business idea. Powered by AI, built for entrepreneurs.',
    keywords: ['website generator', 'AI content', 'SEO blog', 'startup', 'landing page'],
  },
};
