'use client';

import { useState } from 'react';
import type { HypothesisResult } from '@/types';
import { evaluateHypothesis } from '@/lib/ai';

interface HypothesisLabProps {
  problemTitle: string;
  pattern: string;
  expectedApproach?: string;
  initialResult?: HypothesisResult;
  onSaveHypothesis: (result: HypothesisResult) => void;
  onUnlockApproach: () => void;
}

const INSPIRATION_CHIPS = [
  'Single-pass Hash Map lookup',
  'Sort + Two Pointers sweep',
  'Min-Heap priority queue',
  'DFS recursion with visited set',
  'Dynamic programming memoization',
];

export default function HypothesisLab({
  problemTitle,
  pattern,
  expectedApproach,
  initialResult,
  onSaveHypothesis,
  onUnlockApproach,
}: HypothesisLabProps) {
  const [text, setText] = useState(initialResult?.hypothesis || '');
  const [result, setResult] = useState<HypothesisResult | null>(initialResult || null);
  const [evaluating, setEvaluating] = useState(false);

  async function handleEvaluate() {
    if (!text.trim() || evaluating) return;
    setEvaluating(true);
    try {
      const res = await evaluateHypothesis(text.trim(), {
        problemTitle,
        pattern,
        expectedApproach,
      });
      const finalResult: HypothesisResult = {
        hypothesis: text.trim(),
        verdict: res.verdict,
        feedback: res.feedback,
        evaluatedAt: new Date().toISOString(),
      };
      setResult(finalResult);
      onSaveHypothesis(finalResult);
    } finally {
      setEvaluating(false);
    }
  }

  function handleChipClick(chip: string) {
    setText((prev) => (prev ? `${prev} - I would consider ${chip}` : `I would consider ${chip}`));
  }

  const verdictColor =
    result?.verdict === 'Key Insight Identified'
      ? 'text-[#59a89c] border-[#59a89c] bg-[#182a27]'
      : result?.verdict === 'Sub-optimal Bottleneck'
      ? 'text-[#e06c75] border-[#e06c75] bg-[#2b171a]'
      : 'text-[#e3a448] border-[#e3a448] bg-[#2f2516]';

  return (
    <div className="bg-[#191e28] border border-[#2a303c] rounded-sm p-4 sm:p-5 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2a303c] pb-3">
        <div>
          <p className="font-mono text-xs text-[#e3a448]">
            &gt;_ Step 2 Checkpoint: Take a Shot
          </p>
          <h2 className="font-serif text-base font-semibold text-[#f3f1eb] mt-0.5">
            Formulate Your Hypothesis
          </h2>
        </div>
        <span className="font-mono text-[11px] text-[#a673a8] bg-[#281d2a] border border-[#2a303c] rounded-sm px-2 py-0.5">
          [Active Recall Mode]
        </span>
      </div>

      <p className="text-sm text-[#a3abbb] leading-relaxed">
        Before unlocking the canonical code, test your algorithmic intuition.
        What data structure, boundary condition, or invariant do you hypothesize will solve this within optimal bounds?
      </p>

      {/* Suggested Starting Angles */}
      <div className="space-y-1.5">
        <span className="font-mono text-[11px] text-[#6e7687]">
          Quick Inspiration Chips:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {INSPIRATION_CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => handleChipClick(chip)}
              className="font-mono text-[11px] text-[#a3abbb] hover:text-[#f3f1eb] bg-[#12151c] hover:bg-[#222936] border border-[#2a303c] hover:border-[#38bdf8] rounded-sm px-2 py-1 transition-colors"
            >
              [{chip}]
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="space-y-2">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
              e.preventDefault();
              handleEvaluate();
            }
          }}
          rows={3}
          placeholder="e.g. I would use a hash map to track each complement (target - nums[i]) as we iterate in a single pass, giving O(1) lookup and O(n) total time..."
          className="w-full font-mono text-xs text-[#f3f1eb] bg-[#12151c] border border-[#2a303c] focus:border-[#e3a448] focus:outline-none rounded-sm p-3 placeholder-[#55524a] leading-relaxed resize-y"
        />

        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="font-mono text-[11px] text-[#6e7687]">
            Press Cmd+Enter to test hypothesis
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={evaluating || !text.trim()}
              onClick={handleEvaluate}
              className="font-mono text-xs font-semibold px-3 py-2 rounded-sm bg-[#e3a448] text-[#12151c] hover:bg-[#f0b45b] disabled:opacity-50 transition-colors"
            >
              {evaluating ? '>_ Evaluating...' : '>_ Evaluate Hypothesis'}
            </button>
          </div>
        </div>
      </div>

      {/* Evaluation Feedback Panel */}
      {result && (
        <div className="border border-[#2a303c] rounded-sm bg-[#12151c] p-4 space-y-3 transition-all duration-200">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2a303c] pb-2">
            <span className={`font-mono text-xs font-semibold px-2 py-0.5 border rounded-sm ${verdictColor}`}>
              [{result.verdict}]
            </span>
            <span className="font-mono text-[11px] text-[#6e7687]">
              Evaluated against {pattern}
            </span>
          </div>

          <div className="space-y-1.5">
            <p className="font-mono text-[11px] text-[#a3abbb]">
              &gt;_ Socratic Assessment:
            </p>
            <p className="text-sm text-[#f3f1eb] leading-relaxed">
              {result.feedback}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#2a303c]">
            <span className="font-mono text-[11px] text-[#59a89c]">
              ✓ Hypothesis recorded in your mastery sheet
            </span>
            <button
              type="button"
              onClick={onUnlockApproach}
              className="font-mono text-xs font-semibold px-3 py-1.5 rounded-sm bg-[#38bdf8] text-[#0a131f] hover:bg-[#7dd3fc] transition-colors"
            >
              Unlock Approach &amp; Code
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
