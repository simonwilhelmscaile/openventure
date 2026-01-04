'use client';

interface ArticlePreviewItem {
  title: string;
  category?: string;
  date: string;
}

interface ArticlesPreviewProps {
  articles?: ArticlePreviewItem[];
}

const defaultArticles: ArticlePreviewItem[] = [
  { title: 'Getting Started with Your New Platform', category: 'Guide', date: 'Today' },
  { title: 'Best Practices for Maximum Results', category: 'Tips', date: 'Yesterday' },
  { title: 'Understanding the Core Features', category: 'Tutorial', date: 'Dec 28' },
  { title: 'Advanced Strategies for Growth', category: 'Strategy', date: 'Dec 27' },
  { title: 'Common Questions Answered', category: 'FAQ', date: 'Dec 26' },
  { title: 'Industry Insights and Trends', category: 'Insights', date: 'Dec 25' },
];

// Generate consistent colors for categories
const categoryColors: Record<string, { bg: string; text: string }> = {
  Guide: { bg: 'bg-blue-100', text: 'text-blue-700' },
  Tips: { bg: 'bg-green-100', text: 'text-green-700' },
  Tutorial: { bg: 'bg-purple-100', text: 'text-purple-700' },
  Strategy: { bg: 'bg-orange-100', text: 'text-orange-700' },
  FAQ: { bg: 'bg-gray-100', text: 'text-gray-700' },
  Insights: { bg: 'bg-indigo-100', text: 'text-indigo-700' },
  SEO: { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  Content: { bg: 'bg-pink-100', text: 'text-pink-700' },
  Design: { bg: 'bg-cyan-100', text: 'text-cyan-700' },
  Growth: { bg: 'bg-amber-100', text: 'text-amber-700' },
  Article: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

export function ArticlesPreview({ articles = defaultArticles }: ArticlesPreviewProps) {
  const displayArticles = articles.length > 0 ? articles : defaultArticles;

  return (
    <div className="h-full w-full bg-gradient-to-br from-gray-50 to-white p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-gray-800 to-black">
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
          </div>
          <span className="text-xs font-semibold text-gray-900">Blog</span>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700">
          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
          {displayArticles.length} Ready
        </span>
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {displayArticles.slice(0, 6).map((article, i) => {
          const colors = categoryColors[article.category || 'Article'] || categoryColors.Article;
          return (
            <div
              key={i}
              className="group rounded-lg border border-gray-200 bg-white p-2 transition-all hover:border-gray-300 hover:shadow-sm"
            >
              {/* Thumbnail with gradient */}
              <div className="relative mb-2 flex h-12 items-center justify-center overflow-hidden rounded-md bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-2">
                {/* Grid pattern */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: `linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)`,
                    backgroundSize: '8px 8px',
                  }}
                />
                <span className="relative line-clamp-2 text-center text-[7px] font-medium leading-tight text-white/90">
                  {article.title}
                </span>
              </div>
              {/* Category */}
              {article.category && (
                <span className={`mb-1 inline-block rounded-full px-1.5 py-0.5 text-[6px] font-semibold uppercase tracking-wide ${colors.bg} ${colors.text}`}>
                  {article.category}
                </span>
              )}
              {/* Title */}
              <h4 className="line-clamp-2 text-[8px] font-semibold leading-tight text-gray-900 group-hover:text-gray-700">
                {article.title}
              </h4>
              {/* Date */}
              <p className="mt-1 text-[7px] text-gray-400">{article.date}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
