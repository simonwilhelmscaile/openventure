import { getVentureMetadata } from '@/lib/content/loader';
import { ContactForm } from '@/components/contact/ContactForm';

export default function ContactPage() {
  const venture = getVentureMetadata();

  return <ContactForm ventureName={venture.name} ventureDomain={venture.domain} />;
}
