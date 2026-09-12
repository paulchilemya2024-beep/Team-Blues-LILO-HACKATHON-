'use client';

import { useState } from 'react';
import type { QAPair } from '@/types';
import { SUGGESTED_QUESTIONS } from '@/lib/ai';

export default function TutorChat({
  thread,
  onAsk,
  isLoading,
}: {
  thread: QAPair[];
  onAsk: (q: string) => void;
  isLoading: boolean;
}) {
  const [draft, setDraft] = useState('');

  function submit(q: string) {
    const trimmed = q.trim();
    if (!trimmed || isLoading) return;
    onAsk(trimmed);
    setDraft('');
  }

  return (
    <section className="bg-[#191e28] border border-[#2a303c] rounded-sm p-4 sm:p-5">
      <p className="font-mono text-xs text-[#38bdf8]">
        &gt;_ Mentor Q&amp;A
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {SUGGESTED_QUESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => submit(s)}
            className="font-mono text-[11px] px-2 py-1 rounded-sm border border-[#2a303c] text-[#a3abbb] bg-[#12151c] hover:text-[#38bdf8] hover:border-[#38bdf8] transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
      <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto scrollbar-thin">
        {thread.length === 0 && (
          <p className="font-mono text-xs text-[#6e7687]">
            $ ask a follow-up — answers stay dense, no fluff.
          </p>
        )}
        {thread.map((qa, i) => (
          <div key={i} className="space-y-1.5">
            <p className="font-mono text-[13px] text-[#38bdf8]">Q: {qa.q}</p>
            <div className="border border-[#2a303c] rounded-sm bg-[#12151c] px-3 py-2">
              <p className="text-[#f3f1eb] text-sm leading-relaxed">
                <span className="font-mono text-[#59a89c]">A: </span>
                {qa.a}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <p className="font-mono text-xs text-[#59a89c]">
            $ tutor thinking…
          </p>
        )}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') submit(draft);
            else if (e.key === 'Enter') submit(draft);
          }}
          placeholder="Type a follow-up question… (Cmd+Enter to send)"
          className="flex-1 bg-[#12151c] border border-[#2a303c] rounded-sm px-3 py-2 text-sm text-[#f3f1eb] placeholder:text-[#6e7687] focus:outline-none focus:border-[#38bdf8]"
        />
        <button
          onClick={() => submit(draft)}
          disabled={isLoading || !draft.trim()}
          className="shrink-0 font-mono text-[13px] font-semibold px-3 py-2 rounded-sm bg-[#38bdf8] text-[#0a131f] hover:bg-[#7dd3fc] disabled:opacity-50 transition-colors"
        >
          Ask
        </button>
      </div>
    </section>
  );
}
