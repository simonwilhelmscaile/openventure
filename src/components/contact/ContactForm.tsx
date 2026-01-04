'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';

interface ContactFormProps {
  ventureName: string;
  ventureDomain: string;
}

export function ContactForm({ ventureName, ventureDomain }: ContactFormProps) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-default)] bg-[var(--bg-primary)]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6">
          <Link href="/" className="text-xl font-bold text-[var(--text-primary)] py-2 min-h-[44px] flex items-center">
            {ventureName}
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/"
              className="text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] px-3 py-3 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              Home
            </Link>
            <Link
              href="/blog"
              className="text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text-primary)] px-3 py-3 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              Blog
            </Link>
          </nav>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-3xl px-6 py-16">
        <Breadcrumbs
          items={[
            { name: 'Home', path: '/' },
            { name: 'Contact Us' },
          ]}
        />

        <h1 className="mt-4 text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
          Contact Us
        </h1>

        <p className="mt-4 text-[var(--text-secondary)]">
          Have questions about {ventureName}? We&apos;d love to hear from you. Fill out the form below
          and we&apos;ll get back to you as soon as possible.
        </p>

        {submitted ? (
          <div className="mt-8 rounded-lg bg-green-50 p-6 text-center">
            <div className="mb-2 text-2xl">✓</div>
            <h2 className="text-lg font-semibold text-green-800">Message Sent!</h2>
            <p className="mt-2 text-green-700">
              Thank you for reaching out. We&apos;ll respond within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--text-primary)]">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="mt-2 w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--text-primary)]"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--text-primary)]">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="mt-2 w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--text-primary)]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-[var(--text-primary)]">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                className="mt-2 w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-3 text-[var(--text-primary)] focus:border-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--text-primary)]"
              >
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="sales">Sales Question</option>
                <option value="partnership">Partnership Opportunity</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-[var(--text-primary)]">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                className="mt-2 w-full rounded-lg border border-[var(--border-default)] bg-[var(--bg-primary)] px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)] focus:border-[var(--text-primary)] focus:outline-none focus:ring-1 focus:ring-[var(--text-primary)]"
                placeholder="How can we help?"
              />
            </div>

            <button type="submit" className="btn-primary w-full">
              Send Message
            </button>
          </form>
        )}

        <div className="mt-12 rounded-lg border border-[var(--border-default)] p-6">
          <h2 className="text-lg font-semibold text-[var(--text-primary)]">Other Ways to Reach Us</h2>
          <div className="mt-4 space-y-3 text-[var(--text-secondary)]">
            <p>
              <strong>Email:</strong> hello@{ventureDomain}
            </p>
            <p>
              <strong>Support:</strong> support@{ventureDomain}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[var(--border-default)] py-8">
        <div className="mx-auto max-w-[1200px] px-6 text-center text-sm text-[var(--text-tertiary)]">
          <p>&copy; {new Date().getFullYear()} {ventureName}. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
