import Link from 'next/link';

interface BreadcrumbItem {
  name: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  includeSchema?: boolean;
  baseUrl?: string;
}

/**
 * Generate BreadcrumbList schema
 */
function generateBreadcrumbSchema(
  items: BreadcrumbItem[],
  baseUrl: string
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.path && index < items.length - 1
        ? { item: `${baseUrl}${item.path}` }
        : {}),
    })),
  };
}

export function Breadcrumbs({ items, includeSchema = true, baseUrl = '' }: BreadcrumbsProps) {
  // For client components, we can get the base URL from window.location
  const resolvedBaseUrl = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');

  return (
    <>
      {/* JSON-LD Schema - only if we have a base URL */}
      {includeSchema && resolvedBaseUrl && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateBreadcrumbSchema(items, resolvedBaseUrl)) }}
        />
      )}

      {/* Visual Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="mb-4 text-sm">
        <ol className="flex items-center gap-2 text-[var(--text-tertiary)]">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={item.path || item.name} className="flex items-center gap-2">
                {index > 0 && (
                  <span className="select-none" aria-hidden="true">
                    /
                  </span>
                )}
                {isLast || !item.path ? (
                  <span
                    className={isLast ? 'text-[var(--text-primary)] font-medium' : ''}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.path}
                    className="transition-colors hover:text-[var(--text-primary)]"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
