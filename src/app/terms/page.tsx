import { StaticPage } from '@/components/layout/StaticPage';
import { generateStaticPageMeta } from '@/lib/seo';
import { getVentureMetadata } from '@/lib/content/loader';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return generateStaticPageMeta('terms');
}

export default function TermsPage() {
  const venture = getVentureMetadata();

  return (
    <StaticPage title="Terms of Service">
      <p className="text-[var(--text-tertiary)]">Last updated: December 2024</p>

      <p>
        Welcome to {venture.name}. By using our service, you agree to be bound by these Terms of Service.
        Please read them carefully.
      </p>

      <h2 className="mt-8 text-2xl font-bold text-[var(--text-primary)]">1. Acceptance of Terms</h2>
      <p>
        By accessing or using {venture.name}, you agree to these Terms and our Privacy Policy. If you don&apos;t
        agree to these terms, please don&apos;t use our service.
      </p>

      <h2 className="mt-8 text-2xl font-bold text-[var(--text-primary)]">2. Description of Service</h2>
      <p>
        {venture.name} is an AI-powered platform that generates websites and blog content based on your business
        configuration. We provide tools to create, customize, and deploy your generated content.
      </p>

      <h2 className="mt-8 text-2xl font-bold text-[var(--text-primary)]">3. User Responsibilities</h2>
      <p>
        You are responsible for:
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-6">
        <li>Providing accurate business information</li>
        <li>Ensuring generated content complies with applicable laws</li>
        <li>Reviewing and editing AI-generated content before publication</li>
        <li>Maintaining the security of your account</li>
      </ul>

      <h2 className="mt-8 text-2xl font-bold text-[var(--text-primary)]">4. Intellectual Property</h2>
      <p>
        Content generated using {venture.name} belongs to you. You grant us a license to use your configurations
        to improve our service. Our platform, including all software and design, remains our intellectual property.
      </p>

      <h2 className="mt-8 text-2xl font-bold text-[var(--text-primary)]">5. Limitations</h2>
      <p>
        {venture.name} is provided &quot;as is&quot; without warranties of any kind. We are not liable for any damages
        arising from your use of the service or generated content.
      </p>

      <h2 className="mt-8 text-2xl font-bold text-[var(--text-primary)]">6. Modifications</h2>
      <p>
        We may modify these Terms at any time. Continued use of the service after changes constitutes
        acceptance of the new Terms.
      </p>

      <h2 className="mt-8 text-2xl font-bold text-[var(--text-primary)]">7. Contact</h2>
      <p>
        Questions about these Terms? Contact us at legal@{venture.domain}.
      </p>
    </StaticPage>
  );
}
