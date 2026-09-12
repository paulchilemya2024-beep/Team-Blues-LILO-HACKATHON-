'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CustomProblemModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');

  if (!open) return null;

  function handleStart() {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          'codeguide_custom_problem',
          JSON.stringify({
            title: title.trim() || 'Custom Problem',
            prompt: body.trim(),
            savedAt: new Date().toISOString(),
          })
        );
      }
    } catch {
      // ignore
    }
    onClose();
    router.push('/solve/custom');
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: 0.7 }}
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-[#191e28] border border-[#2a303c] rounded-sm p-5 sm:p-6">
        <p className="font-mono text-xs text-[#38bdf8]">
          &gt;_ custom_problem.paste()
        </p>
        <h2 className="font-serif font-semibold text-xl text-[#f3f1eb] mt-1">
          Paste a custom question
        </h2>
        <p className="text-[#a3abbb] text-sm mt-1">
          Runs fully offline with the guided Socratic template. Press Esc to
          close.
        </p>
        <div className="mt-4 space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional, e.g. Meeting Rooms III)"
            className="w-full bg-[#12151c] border border-[#2a303c] rounded-sm px-3 py-2.5 text-sm text-[#f3f1eb] placeholder:text-[#6e7687] focus:outline-none focus:border-[#38bdf8]"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={6}
            placeholder="Paste the full interview question here…"
            className="w-full bg-[#12151c] border border-[#2a303c] rounded-sm px-3 py-2.5 text-sm text-[#f3f1eb] placeholder:text-[#6e7687] focus:outline-none focus:border-[#38bdf8] resize-y"
          />
        </div>
        <div className="mt-4 flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="font-mono text-[13px] px-3 py-2 rounded-sm border border-[#2a303c] text-[#a3abbb] hover:text-[#f3f1eb] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleStart}
            disabled={!body.trim()}
            className="font-mono text-[13px] font-semibold px-3 py-2 rounded-sm bg-[#38bdf8] text-[#0a131f] hover:bg-[#7dd3fc] disabled:opacity-50 transition-colors"
          >
            Start Guided Session
          </button>
        </div>
      </div>
    </div>
  );
}
