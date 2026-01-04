import { StaticPage } from '@/components/layout/StaticPage';
import { generateStaticPageMeta } from '@/lib/seo';
import { getVentureMetadata } from '@/lib/content/loader';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return generateStaticPageMeta('privacy');
}

export default function PrivacyPage() {
  const venture = getVentureMetadata();

  return (
    <StaticPage title="Privacy Policy">
      <p className="text-[var(--text-tertiary)]">Last updated: December 2024</p>

      <p>
        At {venture.name}, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose,
        and safeguard your information when you use our service.
      </p>

      <h2 className="mt-8 text-2xl font-bold text-[var(--text-primary)]">Information We Collect</h2>
      <p>
        We collect information you provide directly to us, including:
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-6">
        <li>Account information (email, name)</li>
        <li>Business configuration data you provide to generate content</li>
        <li>Payment information (processed securely by our payment provider)</li>
        <li>Communications you send to us</li>
      </ul>

      <h2 className="mt-8 text-2xl font-bold text-[var(--text-primary)]">How We Use Your Information</h2>
      <p>
        We use the information we collect to:
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-6">
        <li>Provide, maintain, and improve our services</li>
        <li>Generate personalized content based on your business configuration</li>
        <li>Process transactions and send related information</li>
        <li>Send technical notices, updates, and support messages</li>
        <li>Respond to your comments and questions</li>
      </ul>

      <h2 className="mt-8 text-2xl font-bold text-[var(--text-primary)]">Data Security</h2>
      <p>
        We implement appropriate technical and organizational measures to protect your personal data against
        unauthorized or unlawful processing, accidental loss, destruction, or damage. All data is encrypted
        at rest and in transit.
      </p>

      <h2 className="mt-8 text-2xl font-bold text-[var(--text-primary)]">Your Rights</h2>
      <p>
        You have the right to access, correct, or delete your personal data at any time. You can do this
        through your account settings or by contacting us directly.
      </p>

      <h2 className="mt-8 text-2xl font-bold text-[var(--text-primary)]">Contact Us</h2>
      <p>
        If you have questions about this Privacy Policy, please contact us at privacy@{venture.domain}.
      </p>
    </StaticPage>
  );
}
