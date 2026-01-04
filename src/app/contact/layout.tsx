import { generateStaticPageMeta } from '@/lib/seo';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  return generateStaticPageMeta('contact');
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
