'use client';

interface WorkflowPreviewProps {
  ventureName?: string;
  primaryColor?: string;
}

export function WorkflowPreview({
  ventureName = 'Platform',
  primaryColor = '#6366f1'
}: WorkflowPreviewProps) {
  const steps = [
    { id: 1, label: 'Input', icon: '📥', status: 'complete' },
    { id: 2, label: 'Process', icon: '⚙️', status: 'active' },
    { id: 3, label: 'Analyze', icon: '🔍', status: 'pending' },
    { id: 4, label: 'Output', icon: '📤', status: 'pending' },
  ];

  return (
    <div className="h-full w-full bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm"
            style={{ backgroundColor: primaryColor }}
          >
            {ventureName.charAt(0)}
          </div>
          <div>
            <h3 className="text-xs font-semibold text-slate-900">Workflow Builder</h3>
            <p className="text-[8px] text-slate-500">Design your automation</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[8px] text-emerald-600 font-medium">Running</span>
        </div>
      </div>

      {/* Workflow Canvas */}
      <div className="relative bg-white rounded-xl border border-slate-200 p-4 shadow-inner" style={{ minHeight: '160px' }}>
        {/* Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle, #000 1px, transparent 1px)`,
            backgroundSize: '16px 16px',
          }}
        />

        {/* Workflow Steps */}
        <div className="relative flex items-center justify-between">
          {steps.map((step, i) => (
            <div key={step.id} className="flex items-center">
              {/* Node */}
              <div className="relative">
                <div
                  className={`
                    w-14 h-14 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all
                    ${step.status === 'complete' ? 'bg-emerald-50 border-2 border-emerald-500' : ''}
                    ${step.status === 'active' ? 'bg-white border-2 shadow-lg scale-110' : ''}
                    ${step.status === 'pending' ? 'bg-slate-50 border border-slate-200' : ''}
                  `}
                  style={step.status === 'active' ? { borderColor: primaryColor } : {}}
                >
                  <span className="text-lg">{step.icon}</span>
                  <span
                    className={`text-[7px] font-medium ${
                      step.status === 'complete' ? 'text-emerald-700' :
                      step.status === 'active' ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {step.status === 'complete' && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                {step.status === 'active' && (
                  <div
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center animate-pulse"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  </div>
                )}
              </div>

              {/* Connector */}
              {i < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-1 relative min-w-8">
                  <div
                    className={`absolute inset-0 ${
                      step.status === 'complete' ? 'bg-emerald-500' : 'bg-slate-200'
                    }`}
                  />
                  {step.status === 'complete' && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 right-0 w-0 h-0"
                      style={{
                        borderTop: '4px solid transparent',
                        borderBottom: '4px solid transparent',
                        borderLeft: '6px solid #10b981',
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Activity Log */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center gap-2 text-[8px] text-slate-500">
            <span className="w-1 h-1 rounded-full bg-emerald-500" />
            <span className="font-mono">14:32:01</span>
            <span>Input received and validated</span>
          </div>
          <div className="flex items-center gap-2 text-[8px]" style={{ color: primaryColor }}>
            <span className="w-1 h-1 rounded-full animate-pulse" style={{ backgroundColor: primaryColor }} />
            <span className="font-mono">14:32:05</span>
            <span>Processing data with AI model...</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-3 grid grid-cols-3 gap-2">
        {[
          { label: 'Processed', value: '1,247', trend: '+12%' },
          { label: 'Success Rate', value: '99.2%', trend: '+0.5%' },
          { label: 'Avg Time', value: '1.2s', trend: '-8%' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg p-2 border border-slate-200 text-center">
            <p className="text-[7px] text-slate-500">{stat.label}</p>
            <p className="text-sm font-bold text-slate-900">{stat.value}</p>
            <p className="text-[7px] text-emerald-600">{stat.trend}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
