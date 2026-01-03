'use client';

import { useState } from 'react';
import type { FAQContent, FAQItem } from '@/types';

interface FAQProps {
  content: FAQContent;
}

function FAQAccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-[var(--border-default)]">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-6 text-left"
      >
        <span className="text-lg font-medium text-[var(--text-primary)]">
          {item.question}
        </span>
        <svg
          className={`h-5 w-5 flex-shrink-0 text-[var(--text-tertiary)] transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'}`}
      >
        <p className="text-[var(--text-secondary)]" style={{ lineHeight: 1.7 }}>
          {item.answer}
        </p>
      </div>
    </div>
  );
}

export function FAQ({ content }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 md:py-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
            {content.headline}
          </h2>
          {content.subheadline && (
            <p className="mt-4 text-lg text-[var(--text-secondary)]">
              {content.subheadline}
            </p>
          )}
        </div>

        <div className="divide-y divide-[var(--border-default)] border-t border-[var(--border-default)]">
          {content.items.map((item, index) => (
            <FAQAccordionItem
              key={item.id}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
