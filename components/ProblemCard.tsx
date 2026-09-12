'use client';

import Link from 'next/link';
import type { Problem } from '@/types';

function difficultyStyle(d: string): string {
  if (d === 'Easy')
    return 'text-[#59a89c] bg-[#182a27] border-[#59a89c]';
  if (d === 'Hard')
    return 'text-[#e06c75] bg-[#2b171a] border-[#e06c75]';
  return 'text-[#38bdf8] bg-[#0c2338] border-[#38bdf8]';
}

export default function ProblemCard({
  problem,
  isCompleted = false,
}: {
  problem: Problem;
  isCompleted?: boolean;
}) {
  return (
    <div
      className={`bg-[#191e28] border rounded-sm p-4 flex flex-col gap-3 transition-colors ${
        isCompleted
          ? 'border-[#2d4a43] hover:border-[#59a89c]'
          : 'border-[#2a303c] hover:border-[#38bdf8]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-serif font-semibold text-[#f3f1eb] text-[17px] leading-snug">
          {problem.title}
        </h3>
        <div className="flex items-center gap-1.5 shrink-0">
          {isCompleted && (
            <span className="font-mono text-[11px] text-[#59a89c] bg-[#182a27] border border-[#59a89c] rounded-sm px-1.5 py-0.5">
              ✓ Solved
            </span>
          )}
          <span
            className={`font-mono text-[11px] border rounded-sm px-1.5 py-0.5 ${difficultyStyle(
              problem.difficulty
            )}`}
          >
            {problem.difficulty}
          </span>
        </div>
      </div>
      <p className="text-[#a3abbb] text-sm leading-relaxed line-clamp-2">
        {problem.prompt}
      </p>
      <div className="flex flex-wrap gap-1.5">
        <span className="font-mono text-[11px] text-[#a673a8] bg-[#281d2a] border border-[#2a303c] rounded-sm px-1.5 py-0.5">
          {problem.pattern}
        </span>
        {problem.companies.slice(0, 2).map((c) => (
          <span
            key={c}
            className="font-mono text-[11px] text-[#a3abbb] bg-[#12151c] border border-[#2a303c] rounded-sm px-1.5 py-0.5"
          >
            {c}
          </span>
        ))}
      </div>
      <div className="mt-auto pt-1">
        <Link
          href={`/solve/${problem.id}`}
          className={`inline-block font-mono text-[13px] font-semibold border rounded-sm px-3 py-1.5 transition-colors ${
            isCompleted
              ? 'text-[#59a89c] border-[#59a89c] hover:bg-[#59a89c] hover:text-[#12151c]'
              : 'text-[#38bdf8] border-[#38bdf8] hover:bg-[#38bdf8] hover:text-[#0a131f]'
          }`}
        >
          {isCompleted ? 'Review Solution' : 'Start Walkthrough'}
        </Link>
      </div>
    </div>
  );
}
