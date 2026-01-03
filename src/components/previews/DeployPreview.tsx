'use client';

interface DeployPreviewProps {
  ventureName?: string;
  domain?: string;
}

export function DeployPreview({ ventureName = 'openventure', domain = 'openventure.vercel.app' }: DeployPreviewProps) {
  const steps = [
    { label: 'Building', status: 'complete' },
    { label: 'Deploying', status: 'complete' },
    { label: 'Assigning Domain', status: 'complete' },
    { label: 'SSL Certificate', status: 'complete' },
  ];

  return (
    <div className="h-full w-full bg-black p-4 font-mono">
      {/* Vercel-style Header */}
      <div className="mb-4 flex items-center justify-between border-b border-gray-800 pb-3">
        <div className="flex items-center gap-2">
          <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L2 22h20L12 2z" />
          </svg>
          <span className="text-xs text-white">Vercel</span>
        </div>
        <span className="flex items-center gap-1 rounded bg-green-900/50 px-2 py-0.5 text-[10px] text-green-400">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
          Production
        </span>
      </div>

      {/* Deployment Steps */}
      <div className="mb-4 space-y-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2 text-[10px]">
            <svg className="h-3 w-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-gray-300">{step.label}</span>
            <span className="ml-auto text-gray-600">Done</span>
          </div>
        ))}
      </div>

      {/* Domain Card */}
      <div className="rounded-lg border border-gray-800 bg-gray-900/50 p-3">
        <div className="mb-2 text-[10px] text-gray-400">Production Deployment</div>
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-white">{domain}</span>
          <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
        <div className="mt-2 text-[9px] text-gray-500">
          Deployed {ventureName} to production
        </div>
      </div>

      {/* Stats */}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded bg-gray-900 p-2">
          <div className="text-sm font-bold text-white">1.2s</div>
          <div className="text-[8px] text-gray-500">Build Time</div>
        </div>
        <div className="rounded bg-gray-900 p-2">
          <div className="text-sm font-bold text-white">90</div>
          <div className="text-[8px] text-gray-500">Lighthouse</div>
        </div>
        <div className="rounded bg-gray-900 p-2">
          <div className="text-sm font-bold text-green-400">Live</div>
          <div className="text-[8px] text-gray-500">Status</div>
        </div>
      </div>
    </div>
  );
}
