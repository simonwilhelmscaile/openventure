'use client';

interface AppInterfacePreviewProps {
  ventureName?: string;
  industry?: string;
  primaryColor?: string;
}

export function AppInterfacePreview({
  ventureName = 'App',
  industry = 'technology',
  primaryColor = '#6366f1'
}: AppInterfacePreviewProps) {
  // Generate contextual content based on industry
  const getContent = () => {
    const industries: Record<string, {
      heading: string;
      items: { icon: string; title: string; subtitle: string }[];
      actionLabel: string;
    }> = {
      'pet-tech': {
        heading: 'Your Pets',
        items: [
          { icon: '🐕', title: 'Max', subtitle: 'Golden Retriever • 3 years' },
          { icon: '🐈', title: 'Luna', subtitle: 'Persian Cat • 2 years' },
          { icon: '➕', title: 'Add Pet', subtitle: 'Register a new companion' },
        ],
        actionLabel: 'View Health Report'
      },
      'fintech': {
        heading: 'Accounts',
        items: [
          { icon: '💳', title: 'Main Account', subtitle: '$12,450.00 • ↑2.3%' },
          { icon: '📈', title: 'Investments', subtitle: '$45,230.00 • ↑8.1%' },
          { icon: '🎯', title: 'Savings Goal', subtitle: '$8,000 / $10,000' },
        ],
        actionLabel: 'Transfer Money'
      },
      'health': {
        heading: 'Today',
        items: [
          { icon: '❤️', title: 'Heart Rate', subtitle: '72 bpm • Normal' },
          { icon: '🚶', title: 'Steps', subtitle: '8,432 / 10,000' },
          { icon: '😴', title: 'Sleep', subtitle: '7h 23m • Good' },
        ],
        actionLabel: 'Start Workout'
      },
      'saas': {
        heading: 'Workspaces',
        items: [
          { icon: '📁', title: 'Marketing Team', subtitle: '12 members • 3 active' },
          { icon: '📁', title: 'Engineering', subtitle: '8 members • 6 active' },
          { icon: '📁', title: 'Design', subtitle: '5 members • 2 active' },
        ],
        actionLabel: 'New Project'
      },
      'ecommerce': {
        heading: 'Your Orders',
        items: [
          { icon: '📦', title: 'Order #4521', subtitle: 'Shipped • Arrives Dec 28' },
          { icon: '📦', title: 'Order #4518', subtitle: 'Delivered • Dec 24' },
          { icon: '🛒', title: 'Your Cart', subtitle: '3 items • $124.00' },
        ],
        actionLabel: 'Track Order'
      },
      'technology': {
        heading: 'Overview',
        items: [
          { icon: '⚡', title: 'Quick Actions', subtitle: 'Get started in seconds' },
          { icon: '📊', title: 'Analytics', subtitle: 'View your insights' },
          { icon: '🔧', title: 'Settings', subtitle: 'Customize your experience' },
        ],
        actionLabel: 'Get Started'
      }
    };
    return industries[industry] || industries['technology'];
  };

  const content = getContent();

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 flex items-center justify-center">
      {/* Phone Frame */}
      <div className="w-48 bg-white rounded-[20px] shadow-2xl overflow-hidden" style={{ aspectRatio: '9/16' }}>
        {/* Status Bar */}
        <div className="h-5 bg-slate-50 flex items-center justify-between px-4">
          <span className="text-[8px] font-medium text-slate-900">9:41</span>
          <div className="flex items-center gap-0.5">
            <div className="w-3 h-2 border border-slate-400 rounded-sm relative">
              <div className="absolute inset-0.5 bg-slate-400 rounded-sm" style={{ width: '80%' }} />
            </div>
          </div>
        </div>

        {/* App Header */}
        <div className="px-3 py-2 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[10px] font-bold"
                style={{ backgroundColor: primaryColor }}
              >
                {ventureName.charAt(0)}
              </div>
              <span className="text-[10px] font-semibold text-slate-900">{ventureName}</span>
            </div>
            <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="p-3 flex-1">
          <h3 className="text-xs font-semibold text-slate-900 mb-2">{content.heading}</h3>

          <div className="space-y-2">
            {content.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <span className="text-base">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-medium text-slate-900">{item.title}</p>
                  <p className="text-[7px] text-slate-500 truncate">{item.subtitle}</p>
                </div>
                <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <button
            className="w-full mt-3 py-2 rounded-lg text-white text-[9px] font-medium transition-opacity hover:opacity-90"
            style={{ backgroundColor: primaryColor }}
          >
            {content.actionLabel}
          </button>
        </div>

        {/* Bottom Navigation */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-white border-t border-slate-100 flex items-center justify-around px-2">
          {[
            <svg key="home" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>,
            <svg key="search" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>,
            <svg key="plus" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>,
            <svg key="user" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ].map((icon, i) => (
            <div
              key={i}
              className={`p-1.5 rounded-lg ${i === 0 ? 'bg-slate-100' : ''}`}
              style={{ color: i === 0 ? primaryColor : '#94a3b8' }}
            >
              {icon}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
