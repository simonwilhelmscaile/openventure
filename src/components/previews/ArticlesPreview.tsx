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
  { title: 'How AI is Revolutionizing Startup Launches', category: 'Strategy', date: 'Dec 30' },
  { title: 'The Complete SEO Guide for New Websites', category: 'SEO', date: 'Dec 29' },
  { title: 'Mastering AI Content Generation', category: 'Content', date: 'Dec 28' },
  { title: 'High-Converting Landing Page Design', category: 'Design', date: 'Dec 27' },
  { title: 'Proven Growth Strategies for Startups', category: 'Growth', date: 'Dec 26' },
  { title: 'How to Conduct Competitor Analysis', category: 'Strategy', date: 'Dec 25' },
];

export function ArticlesPreview({ articles = defaultArticles }: ArticlesPreviewProps) {
  return (
    <div className="h-full w-full bg-[#FAFBFC] p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-black" />
          <span className="text-xs font-semibold text-gray-900">Blog</span>
        </div>
        <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] text-gray-600">
          {articles.length} Articles
        </span>
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {articles.slice(0, 6).map((article, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-white p-2 transition-shadow hover:shadow-sm"
          >
            {/* Thumbnail placeholder */}
            <div className="mb-2 flex h-10 items-center justify-center rounded bg-[#1B1B1B] px-1">
              <span className="line-clamp-2 text-center text-[8px] font-medium text-white/80">
                {article.title.split(' ').slice(0, 4).join(' ')}...
              </span>
            </div>
            {/* Category */}
            {article.category && (
              <span className="mb-1 inline-block rounded-full bg-gray-100 px-1.5 py-0.5 text-[7px] font-medium uppercase text-gray-600">
                {article.category}
              </span>
            )}
            {/* Title */}
            <h4 className="line-clamp-2 text-[8px] font-semibold leading-tight text-gray-900">
              {article.title}
            </h4>
            {/* Date */}
            <p className="mt-1 text-[7px] text-gray-500">{article.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
