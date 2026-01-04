'use client';

interface DashboardPreviewProps {
  ventureName?: string;
  industry?: string;
  primaryColor?: string;
}

export function DashboardPreview({
  ventureName = 'Dashboard',
  industry = 'technology',
  primaryColor = '#6366f1'
}: DashboardPreviewProps) {
  // Generate contextual labels based on industry
  const getLabels = () => {
    const industries: Record<string, { metrics: string[]; nav: string[] }> = {
      'pet-tech': {
        metrics: ['Health Score', 'Activities', 'Appointments', 'Alerts'],
        nav: ['Pets', 'Health', 'Schedule', 'Insights']
      },
      'fintech': {
        metrics: ['Balance', 'Transactions', 'Investments', 'Goals'],
        nav: ['Accounts', 'Payments', 'Analytics', 'Settings']
      },
      'health': {
        metrics: ['Wellness', 'Workouts', 'Nutrition', 'Sleep'],
        nav: ['Overview', 'Activity', 'Diet', 'Reports']
      },
      'saas': {
        metrics: ['Users', 'Revenue', 'Growth', 'Churn'],
        nav: ['Dashboard', 'Customers', 'Billing', 'Reports']
      },
      'ecommerce': {
        metrics: ['Orders', 'Revenue', 'Products', 'Customers'],
        nav: ['Store', 'Orders', 'Inventory', 'Analytics']
      },
      'technology': {
        metrics: ['Active', 'Growth', 'Engagement', 'Performance'],
        nav: ['Home', 'Analytics', 'Settings', 'Help']
      }
    };
    return industries[industry] || industries['technology'];
  };

  const labels = getLabels();
  const metricValues = ['94%', '12.4K', '8', '2'];

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      {/* Figma-style frame */}
      <div className="h-full flex">
        {/* Sidebar */}
        <div className="w-14 bg-white border-r border-slate-200 flex flex-col items-center py-3 gap-3">
          {/* Logo */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: primaryColor }}
          >
            {ventureName.charAt(0)}
          </div>

          {/* Nav items */}
          {labels.nav.map((item, i) => (
            <div
              key={item}
              className={`w-9 h-9 rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                i === 0 ? 'bg-slate-100' : 'hover:bg-slate-50'
              }`}
              title={item}
            >
              <NavIcon index={i} active={i === 0} primaryColor={primaryColor} />
            </div>
          ))}
        </div>

        {/* Main content */}
        <div className="flex-1 p-4 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">{ventureName}</h2>
              <p className="text-[10px] text-slate-500">Welcome back, here&apos;s your overview</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-7 px-2 rounded-md bg-white border border-slate-200 flex items-center gap-1 text-[10px] text-slate-500">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search...
              </div>
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-700 to-slate-800" />
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {labels.metrics.map((label, i) => (
              <div key={label} className="bg-white rounded-lg p-2 border border-slate-200 shadow-sm">
                <p className="text-[8px] text-slate-500 mb-1">{label}</p>
                <p className="text-lg font-bold" style={{ color: i === 0 ? primaryColor : '#1e293b' }}>
                  {metricValues[i]}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[8px] text-emerald-600">↑ 12%</span>
                  <span className="text-[7px] text-slate-400">vs last week</span>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-3 gap-2">
            {/* Main Chart */}
            <div className="col-span-2 bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-medium text-slate-700">Performance Overview</p>
                <div className="flex gap-1">
                  {['7D', '1M', '1Y'].map((period, i) => (
                    <button
                      key={period}
                      className={`px-1.5 py-0.5 rounded text-[8px] ${
                        i === 1 ? 'bg-slate-900 text-white' : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              {/* Chart visualization */}
              <div className="h-20 flex items-end gap-1 pt-2">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 95, 80].map((height, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t transition-all hover:opacity-80"
                    style={{
                      height: `${height}%`,
                      backgroundColor: i >= 10 ? primaryColor : `${primaryColor}40`
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-lg p-3 border border-slate-200 shadow-sm">
              <p className="text-[10px] font-medium text-slate-700 mb-2">Recent Activity</p>
              <div className="space-y-2">
                {[
                  { text: 'New user signed up', time: '2m ago', color: 'bg-emerald-500' },
                  { text: 'Payment processed', time: '15m ago', color: 'bg-blue-500' },
                  { text: 'Task completed', time: '1h ago', color: 'bg-purple-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[8px] text-slate-700 truncate">{item.text}</p>
                      <p className="text-[7px] text-slate-400">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavIcon({ index, active, primaryColor }: { index: number; active: boolean; primaryColor: string }) {
  const color = active ? primaryColor : '#94a3b8';
  const icons = [
    <svg key="home" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>,
    <svg key="chart" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>,
    <svg key="cog" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>,
    <svg key="help" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ];
  return icons[index] || icons[0];
}
