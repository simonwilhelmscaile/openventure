'use client';

interface DeployPreviewProps {
  ventureName?: string;
  domain?: string;
}

export function DeployPreview({ ventureName = 'yourventure', domain = 'yourventure.vercel.app' }: DeployPreviewProps) {
  // Extract display domain
  const displayDomain = domain || `${ventureName.toLowerCase().replace(/\s+/g, '')}.vercel.app`;

  const steps = [
    { label: 'Installing dependencies', time: '2.1s' },
    { label: 'Building application', time: '8.3s' },
    { label: 'Running optimizations', time: '1.2s' },
    { label: 'Deploying to edge', time: '0.8s' },
  ];

  return (
    <div className="h-full w-full bg-[#0a0a0a] p-4 font-mono">
      {/* Vercel-style Header */}
      <div className="mb-4 flex items-center justify-between border-b border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2L2 22h20L12 2z" />
          </svg>
          <span className="text-xs font-medium text-white">Vercel</span>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-[10px] font-medium text-green-400">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-400" />
          Production
        </span>
      </div>

      {/* Deployment Steps */}
      <div className="mb-4 space-y-1.5">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2 rounded px-2 py-1.5 text-[10px] hover:bg-white/5">
            <svg className="h-3 w-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-300">{step.label}</span>
            <span className="ml-auto font-mono text-gray-600">{step.time}</span>
          </div>
        ))}
      </div>

      {/* Domain Card */}
      <div className="rounded-lg border border-gray-800 bg-gradient-to-b from-gray-900/80 to-gray-900/40 p-3">
        <div className="mb-1 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-400" />
          <span className="text-[10px] font-medium text-green-400">Ready</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-white">{displayDomain}</span>
          <svg className="h-3 w-3 text-gray-500 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg bg-gray-900/50 p-2">
          <div className="text-sm font-bold text-white">12.4s</div>
          <div className="text-[8px] text-gray-500">Build</div>
        </div>
        <div className="rounded-lg bg-gray-900/50 p-2">
          <div className="text-sm font-bold text-emerald-400">92</div>
          <div className="text-[8px] text-gray-500">Perf</div>
        </div>
        <div className="rounded-lg bg-gray-900/50 p-2">
          <div className="text-sm font-bold text-blue-400">A+</div>
          <div className="text-[8px] text-gray-500">SSL</div>
        </div>
      </div>
    </div>
  );
}
