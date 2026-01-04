'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
}

interface NavigationProps {
  brandName?: string;
  ctaText?: string;
  ctaHref?: string;
}

const navItems: NavItem[] = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Blog', href: '/blog' },
];

export function Navigation({
  brandName = 'YourBrand',
  ctaText = 'Get Started',
  ctaHref = '#pricing'
}: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setIsMobileMenuOpen(false);
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border-default)]'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <Link
            href="/"
            className="text-lg font-semibold text-[var(--text-primary)] hover:opacity-80 transition-opacity h-[44px] flex items-center"
          >
            {brandName}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-0">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors px-4 h-[44px] flex items-center justify-center"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <a
              href={ctaHref}
              onClick={(e) => handleNavClick(e, ctaHref)}
              className="inline-flex items-center justify-center rounded-lg bg-[var(--color-primary)] px-4 h-[44px] text-sm font-medium text-[var(--bg-primary)] transition-all hover:opacity-90"
            >
              {ctaText}
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-[44px] h-[44px] flex items-center justify-center text-[var(--text-primary)]"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-5 relative flex flex-col justify-between">
              <span
                className={`block h-0.5 w-full bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-current transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-96 border-b border-[var(--border-default)]' : 'max-h-0'
        }`}
      >
        <div className="bg-[var(--bg-primary)] px-6 py-4 space-y-0">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="flex items-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors h-[44px]"
            >
              {item.label}
            </a>
          ))}
          <a
            href={ctaHref}
            onClick={(e) => handleNavClick(e, ctaHref)}
            className="flex items-center justify-center w-full rounded-lg bg-[var(--color-primary)] px-4 text-sm font-medium text-[var(--bg-primary)] h-[44px] mt-2"
          >
            {ctaText}
          </a>
        </div>
      </div>
    </nav>
  );
}
