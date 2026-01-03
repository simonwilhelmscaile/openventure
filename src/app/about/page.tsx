import { StaticPage } from '@/components/layout/StaticPage';

export const metadata = {
  title: 'About | OpenVenture',
  description: 'Learn about OpenVenture and our mission to help entrepreneurs launch faster.',
};

export default function AboutPage() {
  return (
    <StaticPage title="About OpenVenture">
      <p>
        OpenVenture is an AI-powered platform that helps entrepreneurs launch their businesses faster than ever before.
        We believe that great ideas shouldn&apos;t be held back by technical barriers or lengthy development cycles.
      </p>

      <h2 className="mt-8 text-2xl font-bold text-[var(--text-primary)]">Our Mission</h2>
      <p>
        Our mission is to democratize startup creation. By combining cutting-edge AI with modern web technologies,
        we enable anyone with a business idea to have a production-ready website and SEO-optimized content in hours, not months.
      </p>

      <h2 className="mt-8 text-2xl font-bold text-[var(--text-primary)]">How It Works</h2>
      <p>
        Simply fill out a configuration file describing your business idea, target audience, and brand preferences.
        Our AI analyzes your inputs and generates a complete landing page, pricing section, testimonials, and up to 10
        SEO-optimized blog articles tailored to your industry.
      </p>

      <h2 className="mt-8 text-2xl font-bold text-[var(--text-primary)]">The Team</h2>
      <p>
        OpenVenture was built by a team of engineers and entrepreneurs who experienced firsthand the challenges of
        launching startups. We&apos;ve combined our expertise in AI, web development, and growth marketing to create
        a tool we wish we had when starting our own ventures.
      </p>

      <h2 className="mt-8 text-2xl font-bold text-[var(--text-primary)]">Get Started</h2>
      <p>
        Ready to launch your venture? Our Starter plan is completely free and includes everything you need to
        validate your business idea. Upgrade to Professional when you&apos;re ready to scale.
      </p>
    </StaticPage>
  );
}
