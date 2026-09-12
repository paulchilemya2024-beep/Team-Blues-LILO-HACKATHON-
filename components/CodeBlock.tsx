'use client';

import { useState } from 'react';

export default function CodeBlock({
  code,
  language = 'python',
}: {
  code: string;
  language?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const lines = code.split('\n');

  return (
    <div className="bg-[#0d1016] border border-[#2a303c] rounded-sm overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[#2a303c]">
        <span className="font-mono text-[11px] text-[#6e7687]">
          {language}
        </span>
        <button
          onClick={handleCopy}
          className="font-mono text-[11px] px-2 py-1 rounded-sm border border-[#2a303c] text-[#a3abbb] hover:text-[#38bdf8] hover:border-[#38bdf8] transition-colors"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-3 text-[13px] leading-6">
        <code className="font-mono text-[#f3f1eb]">
          {lines.map((line, i) => (
            <span key={i} className="flex">
              <span className="w-8 shrink-0 select-none text-right pr-3 text-[#3b4455]">
                {i + 1}
              </span>
              <span className="whitespace-pre">{line || ' '}</span>
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
