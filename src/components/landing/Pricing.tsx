'use client';

import { useState } from 'react';
import type { PricingContent, PricingTier } from '@/types';

interface PricingProps {
  content: PricingContent;
}

function PricingCard({ tier, isYearly }: { tier: PricingTier; isYearly: boolean }) {
  const price = isYearly && tier.price.yearly ? tier.price.yearly / 12 : tier.price.monthly;

  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 ${
        tier.highlighted
          ? 'border-[var(--color-primary)] bg-[var(--bg-secondary)] shadow-xl'
          : 'border-[var(--border-default)] bg-[var(--bg-primary)]'
      }`}
    >
      {tier.badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[var(--color-primary)] px-4 py-1 text-sm font-medium text-[var(--bg-primary)]">
          {tier.badge}
        </span>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold text-[var(--text-primary)]">{tier.name}</h3>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">{tier.description}</p>
      </div>

      <div className="mb-6">
        <div className="flex items-baseline">
          <span className="text-4xl font-bold text-[var(--text-primary)]">
            {tier.currency === 'EUR' ? '€' : '$'}{Math.round(price)}
          </span>
          <span className="ml-2 text-[var(--text-tertiary)]">
            {tier.billing_text}
          </span>
        </div>
        {isYearly && tier.price.yearly && (
          <p className="mt-1 text-sm text-[var(--color-primary)]">
            Billed {tier.currency === 'EUR' ? '€' : '$'}{tier.price.yearly}/year
          </p>
        )}
      </div>

      <ul className="mb-8 flex-1 space-y-3">
        {tier.features.map((feature, index) => (
          <li
            key={index}
            className={`flex items-start gap-3 text-sm ${
              feature.included ? 'text-[var(--text-secondary)]' : 'text-[var(--text-tertiary)] line-through'
            }`}
          >
            {feature.included ? (
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            <span className={feature.highlight ? 'font-medium' : ''}>{feature.text}</span>
          </li>
        ))}
      </ul>

      <a
        href={tier.cta.href}
        className={tier.highlighted ? 'btn-primary w-full' : 'btn-secondary w-full'}
      >
        {tier.cta.text}
      </a>
    </div>
  );
}

export function Pricing({ content }: PricingProps) {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
            {content.headline}
          </h2>
          {content.subheadline && (
            <p className="mt-4 text-lg text-[var(--text-secondary)]">
              {content.subheadline}
            </p>
          )}

          {content.billing_toggle && (
            <div className="mt-8 flex items-center justify-center gap-4">
              <span className={`text-sm ${!isYearly ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative h-6 w-12 rounded-full transition-colors ${
                  isYearly ? 'bg-[var(--color-primary)]' : 'bg-[var(--border-default)]'
                }`}
              >
                <span
                  className={`absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                    isYearly ? 'translate-x-6' : ''
                  }`}
                />
              </button>
              <span className={`text-sm ${isYearly ? 'font-medium text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}`}>
                Yearly
                <span className="ml-1 text-[var(--color-primary)]">(Save 17%)</span>
              </span>
            </div>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {content.tiers.map((tier) => (
            <PricingCard key={tier.id} tier={tier} isYearly={isYearly} />
          ))}
        </div>
      </div>
    </section>
  );
}
