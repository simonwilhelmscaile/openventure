import Image from 'next/image';
import type { TestimonialsContent, Testimonial } from '@/types';

interface TestimonialsProps {
  content: TestimonialsContent;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" role="img" aria-label={`Rating: ${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`h-5 w-5 ${star <= rating ? 'text-yellow-400' : 'text-[var(--border-default)]'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="card flex flex-col">
      {testimonial.rating && (
        <div className="mb-4">
          <StarRating rating={testimonial.rating} />
        </div>
      )}

      <blockquote className="flex-1 text-[var(--text-secondary)]" style={{ lineHeight: 1.7 }}>
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      <div className="mt-6 flex items-center gap-4">
        {testimonial.author.image_url ? (
          <Image
            src={testimonial.author.image_url}
            alt={testimonial.author.name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-accent)] text-lg font-semibold text-[var(--color-primary)]">
            {testimonial.author.name.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-semibold text-[var(--text-primary)]">
            {testimonial.author.name}
          </p>
          <p className="text-sm text-[var(--text-tertiary)]">
            {testimonial.author.title}, {testimonial.author.company}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Testimonials({ content }: TestimonialsProps) {
  return (
    <section className="bg-[var(--bg-secondary)] py-24 md:py-32">
      <div className="mx-auto max-w-[1200px] px-6">
        {content.headline && (
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] md:text-4xl">
              {content.headline}
            </h2>
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {content.testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
