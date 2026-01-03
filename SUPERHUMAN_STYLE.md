# Superhuman Design System Reference

> Extracted from superhuman.com analysis - December 2024

## Overview

Superhuman's design philosophy centers on **speed, precision, and premium feel**. Every element is positioned on a sub-pixel grid. The interface eliminates friction through keyboard-first interactions and carefully crafted micro-animations.

---

## Color System

### Brand Colors (Official from Brandfetch)
```css
--color-black: #000000;
--color-white: #FFFFFF;
--color-fog: #D4C7FF;        /* Primary accent - soft purple */
--color-eden: #0D4243;       /* Brand teal-green */
--color-cocoa: #421D24;      /* Brand dark burgundy */
```

### UI Grays (5-Level System for Dark Theme)
```css
/* Surface hierarchy: closer to user = lighter */
--gray-100: #1A1A1A;  /* Distant surfaces, backgrounds */
--gray-200: #252525;  /* Secondary backgrounds */
--gray-300: #333333;  /* Cards, containers */
--gray-400: #444444;  /* Elevated surfaces */
--gray-500: #555555;  /* Modals, floating elements */
```

### Light Theme
```css
--bg-primary: #FFFFFF;
--bg-secondary: #F9FAFB;
--bg-tertiary: #F3F4F6;
--text-primary: #171717;
--text-secondary: #37394A;
--text-tertiary: #666D80;
--border-default: #EBEFF3;
--accent-primary: #6219FF;   /* Superhuman Purple */
--accent-secondary: #8B5CF6;
```

### Dark Theme
```css
--bg-primary: #010101;       /* Avoid pure black */
--bg-secondary: #0A0A0A;
--bg-tertiary: #141414;
--text-primary: rgba(255, 255, 255, 0.90);  /* Never pure white */
--text-secondary: rgba(255, 255, 255, 0.65);
--text-tertiary: rgba(255, 255, 255, 0.45);
--border-default: rgba(255, 255, 255, 0.08);
--accent-primary: #8B5CF6;   /* Adjusted for dark - less saturated */
```

### Design Principles for Colors
1. **Never use pure black (#000)** - causes OLED smearing and harsh contrast
2. **Never use pure white (#FFF) for text** - causes halation, especially for astigmatic users (~50% population)
3. **Text opacity**: 90% white in dark mode, 65% for secondary text
4. **Preserve hue, reduce lightness, increase saturation** when adapting colors for dark mode

---

## Typography

### Custom Font Stack
```css
/* Primary - Super Sans (Custom) */
font-family: 'Super Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Serif Accent - Super Serif (Custom) */
font-family: 'Super Serif', Georgia, 'Times New Roman', serif;

/* Monospace - Super Sans Mono (Custom) */
font-family: 'Super Sans Mono', 'SF Mono', 'Monaco', monospace;

/* Blog uses Avenir LT Std as fallback */
font-family: 'Avenir LT Std', 'Inter', sans-serif;
```

### Font Weights
```css
--font-regular: 400;
--font-medium: 500;
--font-semibold: 580;  /* Custom weight for Super Serif */
--font-bold: 700;
```

### Type Scale
```css
/* Headlines */
--text-hero: 72px;      /* Hero sections */
--text-display: 56px;   /* Page titles */
--text-h1: 48px;        /* Section headers */
--text-h2: 36px;        /* Subsection headers */
--text-h3: 28px;        /* Card titles */
--text-h4: 22px;        /* List headers */

/* Body */
--text-large: 20px;     /* Blog body, desktop */
--text-base: 16px;      /* Standard body */
--text-small: 14px;     /* Meta, captions */
--text-xs: 12px;        /* Labels, badges */

/* Line Heights */
--leading-tight: 1.1;   /* Headlines */
--leading-snug: 1.25;   /* Subheadlines */
--leading-normal: 1.5;  /* Body text */
--leading-relaxed: 1.75; /* Blog content */
```

### Letter Spacing
```css
--tracking-tight: -0.02em;   /* Headlines */
--tracking-normal: 0;        /* Body */
--tracking-wide: 0.05em;     /* Uppercase labels */
```

### Font Features
```css
font-feature-settings: "kern" 1, "dlig" 1;
/* Enables kerning and discretionary ligatures */
```

---

## Spacing System

### Base Grid (8px)
```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
--space-32: 128px;
```

### Section Spacing
```css
--section-padding-y: 120px;  /* Vertical rhythm between sections */
--section-padding-x: 24px;   /* Mobile horizontal padding */
--content-max-width: 1200px; /* Container max width */
--text-max-width: 720px;     /* Optimal reading width */
```

---

## Layout Patterns

### Container Widths
```css
--container-sm: 640px;   /* Blog content */
--container-md: 768px;   /* Feature cards */
--container-lg: 1024px;  /* Standard content */
--container-xl: 1280px;  /* Full-width sections */
--container-2xl: 1440px; /* Max site width */
```

### Grid System
```css
/* 12-column grid */
display: grid;
grid-template-columns: repeat(12, 1fr);
gap: 24px;

/* Responsive breakpoints */
@media (max-width: 1024px) { gap: 16px; }
@media (max-width: 768px) { grid-template-columns: 1fr; }
```

### Surface Hierarchy (Dark Theme)
```
Background (distant)    <- darkest
  Container
    Card
      Elevated Card
        Modal/Popover   <- lightest
```

---

## Component Patterns

### Buttons
```css
/* Primary CTA */
.btn-primary {
  background: linear-gradient(135deg, #6219FF 0%, #8B5CF6 100%);
  color: #FFFFFF;
  padding: 16px 32px;
  border-radius: 12px;
  font-weight: 500;
  font-size: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(98, 25, 255, 0.4);
}

/* Secondary */
.btn-secondary {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #FFFFFF;
  padding: 16px 32px;
  border-radius: 12px;
}
```

### Cards
```css
.card {
  background: var(--bg-secondary);
  border: 1px solid var(--border-default);
  border-radius: 16px;
  padding: 24px;
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}
.card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}
```

### Navigation (Sticky Header)
```css
.header {
  position: sticky;
  top: 0;
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.8);
  border-bottom: 1px solid var(--border-default);
  z-index: 100;
}
```

### Pricing Cards
```
3-Tier Structure:
1. Starter ($25/user/month) - Core features
2. Business ($33/user/month) - Team features
3. Enterprise (Custom) - Premium security + support

Visual hierarchy: Middle tier slightly elevated/highlighted
```

---

## Animation & Motion

### Timing Functions
```css
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);      /* Primary easing */
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);  /* Page transitions */
--spring: cubic-bezier(0.34, 1.56, 0.64, 1);    /* Playful bounces */
```

### Durations
```css
--duration-instant: 100ms;   /* Micro-interactions */
--duration-fast: 200ms;      /* Buttons, hovers */
--duration-normal: 300ms;    /* Cards, modals */
--duration-slow: 500ms;      /* Page transitions */
```

### Common Animations
```css
/* Fade In Up */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Scale In */
@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}

/* Hover lift */
.hoverable:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}
```

### Video Embeds
- Autoplay, muted, looping for feature demos
- Lazy load with intersection observer
- Rounded corners (16px)
- Subtle shadow

---

## Hero Section Pattern

### Structure
```
[Badge/Category Tag]       <- Small uppercase label
[Headline]                 <- 48-72px, bold, tight leading
[Subheadline]              <- 18-24px, regular weight
[CTA Buttons]              <- Primary + Secondary
[Product Screenshot/Demo]  <- Below fold, with animation
```

### Hero Example
```html
<section class="hero">
  <span class="badge">NEW</span>
  <h1>Superpowers, everywhere you work</h1>
  <p>Mail, Docs, and AI that works in every app and tab</p>
  <div class="cta-group">
    <button class="btn-primary">Get Superhuman</button>
    <button class="btn-secondary">Watch Demo</button>
  </div>
</section>
```

---

## Feature Section Patterns

### Pattern 1: Alternating Layout
```
[Image] [Content]
[Content] [Image]
[Image] [Content]
```

### Pattern 2: Grid Cards
```
[Card 1] [Card 2] [Card 3]
[Card 4] [Card 5] [Card 6]
```

### Feature Card Structure
```html
<div class="feature-card">
  <div class="icon"><!-- SVG --></div>
  <h3>Feature Name</h3>
  <p>Description text explaining the benefit...</p>
  <ul class="feature-list">
    <li>Benefit one</li>
    <li>Benefit two</li>
    <li>Benefit three</li>
  </ul>
  <a href="#" class="link">Learn more &rarr;</a>
</div>
```

---

## Social Proof Patterns

### Logo Bar
```html
<section class="social-proof">
  <p>Trusted by the most innovative companies</p>
  <div class="logo-grid">
    <!-- Grayscale logos, hover to color -->
    <img src="openai.svg" alt="OpenAI" />
    <img src="figma.svg" alt="Figma" />
    <img src="hubspot.svg" alt="HubSpot" />
  </div>
</section>
```

### Testimonial Card
```html
<div class="testimonial">
  <blockquote>"Quote text here..."</blockquote>
  <div class="author">
    <img src="avatar.jpg" alt="Name" />
    <div>
      <strong>Name</strong>
      <span>Title, Company</span>
    </div>
  </div>
</div>
```

---

## Footer Pattern

### 4-Column Structure
```
Products     |  Company      |  Legal        |  Connect
- Go         |  - Contact    |  - Terms      |  - LinkedIn
- Grammarly  |  - Help       |  - Privacy    |  - Twitter
- Coda       |  - Careers    |  - Trust      |  - Instagram
- Mail       |  - Partners   |  - Cookies    |  - TikTok
```

---

## Responsive Breakpoints

```css
/* Mobile First */
@media (min-width: 640px)  { /* sm - Tablet portrait */ }
@media (min-width: 768px)  { /* md - Tablet landscape */ }
@media (min-width: 1024px) { /* lg - Laptop */ }
@media (min-width: 1280px) { /* xl - Desktop */ }
@media (min-width: 1440px) { /* 2xl - Large desktop */ }
```

---

## Key Design Principles

### 1. Sub-Pixel Perfection
Everything on an 8px grid. Internal tools verify alignment with Command+K baseline toggle.

### 2. Speed as Design
- Keyboard-first interactions
- Instant transitions (< 100ms for feedback)
- Progressive loading with skeleton states

### 3. Perceptual Contrast
Adjust for how things *appear*, not just what numbers say. Example: 65% opacity white in dark mode instead of 60%.

### 4. Game Design, Not Gamification
- Create flow state (5x productivity boost)
- Reward progression naturally
- No artificial points or badges

### 5. Accessibility
- WCAG AA contrast ratios minimum
- Full keyboard navigation
- Screen reader support
- Reduced motion support

---

## Implementation Notes for OpenVenture

### Must-Haves
1. **Custom font loading** with `font-display: swap`
2. **Dark theme support** via CSS custom properties
3. **Sticky navigation** with backdrop blur
4. **Smooth animations** using CSS transforms
5. **Responsive grid** with 12-column system
6. **Video embeds** for feature demonstrations

### Avoid
1. Pure black/white colors
2. Harsh shadows
3. Gamification (badges, points)
4. Slow animations (> 500ms)
5. Layout shifts during load

### Priority Components
1. Hero section with headline + subheadline + CTAs
2. Feature cards with icons + bullet lists
3. Pricing comparison table
4. Social proof logo bar
5. Testimonial cards
6. Footer with sitemap

---

## Sources

- [Superhuman Brand Assets - Brandfetch](https://brandfetch.com/superhuman.com)
- [How to Design Delightful Dark Themes - Superhuman Blog](https://blog.superhuman.com/how-to-design-delightful-dark-themes/)
- [Superhuman Landing Page - Lapa Ninja](https://www.lapa.ninja/post/superhuman/)
- [Superhuman Design Articles](https://blog.superhuman.com/tag/design/)
