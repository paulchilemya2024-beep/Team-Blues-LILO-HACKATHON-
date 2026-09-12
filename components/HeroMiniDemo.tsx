'use client';

import { useState } from 'react';
import Link from 'next/link';

const HINTS = [
  'What mathematical pairing must exist for any nums[i]? Think complement = target - nums[i].',
  'Which structure answers "have I seen X before?" in O(1) expected time?',
  'Single-pass invariant: the map holds all earlier values. Why does that guarantee the pair is found?',
];

export default function HeroMiniDemo() {
  const [revealed, setRevealed] = useState(1);

  return (
    <div className="bg-[#191e28] border border-[#2a303c] rounded-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#2a303c] bg-[#12151c]">
        <span className="font-mono text-xs text-[#a3abbb]">
          <span className="text-[#38bdf8]">&gt;_</span> live_demo: two_sum
        </span>
        <span className="font-mono text-[11px] text-[#59a89c] bg-[#182a27] border border-[#2a303c] rounded-sm px-1.5 py-0.5">
          Step {Math.min(revealed + 1, 5)}/5: Thinking it Through
        </span>
      </div>
      <div className="p-4 sm:p-5">
        <div className="bg-[#f6f3ec] border border-[#e2ddce] rounded-sm p-4">
          <p className="font-serif text-[#201f1a] font-semibold text-base leading-snug">
            Two Sum
          </p>
          <p className="text-[#55524a] text-sm mt-1 leading-relaxed">
            Given an array of integers and a target, find the two indices that
            add up to the target. Assume exactly one valid pair exists.
          </p>
        </div>
        <div className="mt-3 space-y-2">
          {HINTS.slice(0, revealed).map((h, i) => (
            <div
              key={i}
              className="border border-[#2a303c] rounded-sm bg-[#12151c] px-3 py-2.5"
            >
              <span className="font-mono text-[11px] text-[#a673a8] bg-[#281d2a] border border-[#2a303c] rounded-sm px-1.5 py-0.5">
                HINT {i + 1}
              </span>
              <p className="text-[#f3f1eb] text-sm mt-1.5 leading-relaxed">
                {h}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {revealed < HINTS.length ? (
            <button
              onClick={() => setRevealed((r) => Math.min(r + 1, HINTS.length))}
              className="font-mono text-[13px] font-semibold px-3 py-2 rounded-sm bg-[#38bdf8] text-[#0a131f] hover:bg-[#7dd3fc] transition-colors"
            >
              &gt;_ Reveal Hint {revealed + 1}
            </button>
          ) : (
            <Link
              href="/solve/two_sum"
              className="font-mono text-[13px] font-semibold px-3 py-2 rounded-sm bg-[#59a89c] text-[#12151c] hover:bg-[#6bbcae] transition-colors"
            >
              Start Full Walkthrough
            </Link>
          )}
          <span className="font-mono text-xs text-[#6e7687]">
            {revealed}/{HINTS.length} hints revealed
          </span>
        </div>
      </div>
    </div>
  );
}
