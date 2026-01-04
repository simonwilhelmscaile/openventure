'use client';

interface ConfigPreviewProps {
  ventureName?: string;
  tagline?: string;
}

export function ConfigPreview({ ventureName = 'YourVenture', tagline = 'Your tagline here' }: ConfigPreviewProps) {
  // Use shorter tagline for display
  const displayTagline = tagline.length > 25 ? tagline.slice(0, 22) + '...' : tagline;

  const configJSON = `{
  "name": "${ventureName}",
  "tagline": "${displayTagline}",
  "business": {
    "industry": "Technology",
    "target_audience": "Your audience"
  },
  "brand": {
    "colors": { "primary": "#000" }
  },
  "landing_page": { "enabled": true },
  "blog": { "article_count": 10 }
}`;

  return (
    <div className="h-full w-full bg-[#1a1a1a] p-4 font-mono text-sm">
      {/* VS Code Style Header */}
      <div className="mb-3 flex items-center justify-between border-b border-[#333] pb-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-[#FF5F56]" />
            <div className="h-3 w-3 rounded-full bg-[#FFBD2E]" />
            <div className="h-3 w-3 rounded-full bg-[#27C93F]" />
          </div>
          <span className="ml-2 text-xs text-gray-400">venture.config.json</span>
        </div>
        <span className="rounded bg-green-900/30 px-2 py-0.5 text-[9px] text-green-400">valid</span>
      </div>

      {/* Code Content */}
      <pre className="text-[10px] leading-relaxed text-gray-300 md:text-[11px]">
        {configJSON.split('\n').map((line, i) => (
          <div key={i} className="flex hover:bg-white/5">
            <span className="mr-3 w-4 select-none text-right text-gray-600">{i + 1}</span>
            <span className="whitespace-pre">
              {formatJSONLine(line)}
            </span>
          </div>
        ))}
      </pre>

      {/* Status bar */}
      <div className="mt-3 flex items-center justify-between border-t border-[#333] pt-2 text-[9px] text-gray-500">
        <span>JSON</span>
        <span>UTF-8</span>
      </div>
    </div>
  );
}

function formatJSONLine(line: string): React.ReactNode {
  // Simple JSON syntax highlighting
  const parts: React.ReactNode[] = [];
  const remaining = line;
  let key = 0;

  // Match strings
  const stringRegex = /"([^"]*)"/g;
  let lastIndex = 0;
  let match;

  while ((match = stringRegex.exec(remaining)) !== null) {
    // Add text before match
    if (match.index > lastIndex) {
      parts.push(<span key={key++} className="text-gray-300">{remaining.slice(lastIndex, match.index)}</span>);
    }

    // Check if it's a key (followed by :) or value
    const afterMatch = remaining.slice(match.index + match[0].length);
    if (afterMatch.startsWith(':')) {
      // It's a key
      parts.push(<span key={key++} className="text-[#9CDCFE]">{match[0]}</span>);
    } else {
      // It's a value
      parts.push(<span key={key++} className="text-[#CE9178]">{match[0]}</span>);
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < remaining.length) {
    const rest = remaining.slice(lastIndex);
    // Highlight booleans and numbers
    const highlighted = rest
      .replace(/\btrue\b/g, '<BOOL>true</BOOL>')
      .replace(/\bfalse\b/g, '<BOOL>false</BOOL>')
      .replace(/\b(\d+)\b/g, '<NUM>$1</NUM>');

    if (highlighted.includes('<BOOL>') || highlighted.includes('<NUM>')) {
      const tokens = highlighted.split(/(<BOOL>|<\/BOOL>|<NUM>|<\/NUM>)/);
      let inBool = false;
      let inNum = false;

      tokens.forEach((token) => {
        if (token === '<BOOL>') inBool = true;
        else if (token === '</BOOL>') inBool = false;
        else if (token === '<NUM>') inNum = true;
        else if (token === '</NUM>') inNum = false;
        else if (inBool) parts.push(<span key={key++} className="text-[#569CD6]">{token}</span>);
        else if (inNum) parts.push(<span key={key++} className="text-[#B5CEA8]">{token}</span>);
        else parts.push(<span key={key++} className="text-gray-300">{token}</span>);
      });
    } else {
      parts.push(<span key={key++} className="text-gray-300">{rest}</span>);
    }
  }

  return parts;
}
