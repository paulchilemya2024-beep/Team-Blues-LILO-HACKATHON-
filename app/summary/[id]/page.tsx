'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CodeBlock from '@/components/CodeBlock';
import { getProblemById, getNextProblem } from '@/lib/problems';
import { getWalkthrough } from '@/lib/mockSolutions';
import { loadSession } from '@/lib/storage';
import type { SessionState } from '@/types';

export default function SummaryPage() {
  const params = useParams();
  const id = (params?.id as string) ?? '';
  const problem = getProblemById(id);
  const nextProblem = useMemo(() => getNextProblem(id), [id]);
  const walkthrough = useMemo(() => getWalkthrough(id), [id]);
  const [session, setSession] = useState<SessionState | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setSession(loadSession(id));
  }, [id]);

  const markdown = useMemo(() => {
    return [
      `# ${walkthrough.title} — CodeGuide Recap`,
      '',
      `Pattern: ${problem?.pattern ?? 'Guided Reasoning'} | Difficulty: ${problem?.difficulty ?? 'Custom'}`,
      '',
      '## Problem',
      walkthrough.summary,
      '',
      '## Constraints',
      ...walkthrough.constraints.map((c) => `- ${c}`),
      '',
      '## Hints used',
      `${session?.hintsRevealed ?? 0}/${walkthrough.socratic_hints.length}`,
      '',
      '## Approach',
      `${walkthrough.approach.name}: ${walkthrough.approach.explanation}`,
      '',
      `Why this works: ${walkthrough.approach.why_this_works}`,
      '',
      '```python',
      walkthrough.approach.code,
      '```',
      '',
      `Complexity: TIME ${walkthrough.complexity.time} | SPACE ${walkthrough.complexity.space}`,
      walkthrough.complexity.explanation,
      '',
      '## Alternatives',
      ...walkthrough.alternatives.map(
        (a) => `- ${a.name} (${a.time} / ${a.space}): ${a.tradeoff}`
      ),
      '',
      '## My Notes',
      session?.userNotes?.trim() ? session.userNotes : '_No notes captured._',
      '',
      ...(session?.hypothesis
        ? [
            '## Initial Hypothesis',
            `Hypothesis: "${session.hypothesis.hypothesis}"`,
            `Verdict: [${session.hypothesis.verdict}]`,
            `Mentor Feedback: ${session.hypothesis.feedback}`,
          ]
        : []),
    ]
      .filter(Boolean)
      .join('\n');
  }, [walkthrough, problem, session]);

  function handleCopy() {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(markdown);
    } else {
      const ta = document.createElement('textarea');
      ta.value = markdown;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#12151c]">
      <Navbar />
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link
          href={problem ? `/solve/${id}` : '/'}
          className="font-mono text-xs text-[#a3abbb] hover:text-[#38bdf8]"
        >
          Back to Workspace
        </Link>
        <div className="mt-3 bg-[#f6f3ec] border border-[#e2ddce] rounded-sm p-5 sm:p-7">
          <div className="flex items-center gap-2 mb-2">
            {session?.isCompleted ? (
              <span className="font-mono text-[11px] font-semibold text-[#59a89c] bg-[#182a27] border border-[#59a89c] rounded-sm px-2 py-0.5">
                ✓ Solved &amp; Mastered
              </span>
            ) : (
              <span className="font-mono text-[11px] font-semibold text-[#a67c3d] bg-[#2a1d0f] border border-[#a67c3d] rounded-sm px-2 py-0.5">
                ○ Not Yet Completed
              </span>
            )}
            <span className="font-mono text-[11px] text-[#7c776c]">
              SOLUTION RECAP
            </span>
          </div>
          <h1 className="font-serif font-semibold text-[#201f1a] text-2xl sm:text-3xl mt-1">
            {walkthrough.title}
          </h1>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="font-mono text-[11px] text-[#59a89c] bg-[#182a27] border border-[#59a89c] rounded-sm px-1.5 py-0.5">
              TIME: {walkthrough.complexity.time}
            </span>
            <span className="font-mono text-[11px] text-[#38bdf8] bg-[#0c2338] border border-[#38bdf8] rounded-sm px-1.5 py-0.5">
              SPACE: {walkthrough.complexity.space}
            </span>
            <span className="font-mono text-[11px] text-[#55524a] bg-[#f6f3ec] border border-[#e2ddce] rounded-sm px-1.5 py-0.5">
              Hints: {session?.hintsRevealed ?? 0}/
              {walkthrough.socratic_hints.length} used
            </span>
          </div>
          <p className="text-[#201f1a] text-[15px] leading-relaxed mt-3">
            {walkthrough.summary}
          </p>
          <div className="mt-4 border-t border-[#e2ddce] pt-3">
            <p className="font-mono text-[11px] text-[#7c776c]">
              KEY LEARNING
            </p>
            <p className="text-[#55524a] text-sm leading-relaxed mt-1">
              {walkthrough.approach.why_this_works}
            </p>
          </div>
          {session?.hypothesis && (
            <div className="mt-4 border-t border-[#e2ddce] pt-3">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[11px] text-[#7c776c]">
                  YOUR INITIAL HYPOTHESIS
                </p>
                <span className="font-mono text-[11px] font-semibold px-2 py-0.5 border border-[#2a303c] rounded-sm bg-[#12151c] text-[#38bdf8]">
                  [{session.hypothesis.verdict}]
                </span>
              </div>
              <p className="font-mono text-xs text-[#201f1a] bg-[#ebe6d8] border border-[#dcd6c5] p-2.5 rounded-sm mt-1.5 leading-relaxed">
                &ldquo;{session.hypothesis.hypothesis}&rdquo;
              </p>
              <p className="text-[#55524a] text-xs leading-relaxed mt-1.5">
                <strong className="text-[#201f1a]">Mentor Critique:</strong>{' '}
                {session.hypothesis.feedback}
              </p>
            </div>
          )}
          {session?.userNotes?.trim() && (
            <div className="mt-4 border-t border-[#e2ddce] pt-3">
              <p className="font-mono text-[11px] text-[#7c776c]">
                MY NOTES
              </p>
              <p className="text-[#201f1a] text-sm leading-relaxed mt-1 whitespace-pre-wrap">
                {session.userNotes}
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 bg-[#191e28] border border-[#2a303c] rounded-sm p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="font-mono text-xs text-[#38bdf8]">
              &gt;_ export.markdown()
            </p>
            <button
              onClick={handleCopy}
              className="font-mono text-xs px-2.5 py-1.5 rounded-sm border border-[#38bdf8] text-[#38bdf8] hover:bg-[#38bdf8] hover:text-[#0a131f] transition-colors"
            >
              {copied ? 'Copied!' : 'Copy Markdown'}
            </button>
          </div>
          <div className="mt-3">
            <CodeBlock code={markdown} language="markdown" />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2.5 pb-10">
          {nextProblem && nextProblem.id !== id ? (
            <Link
              href={`/solve/${nextProblem.id}`}
              className="font-mono text-sm font-semibold px-4 py-2.5 rounded-sm bg-[#38bdf8] text-[#0a131f] hover:bg-[#7dd3fc] transition-colors"
            >
              Next Problem: {nextProblem.title}
            </Link>
          ) : (
            <Link
              href="/#problems"
              className="font-mono text-sm font-semibold px-4 py-2.5 rounded-sm bg-[#38bdf8] text-[#0a131f] hover:bg-[#7dd3fc] transition-colors"
            >
              Problem Library
            </Link>
          )}
          <Link
            href="/#problems"
            className="font-mono text-sm px-4 py-2.5 rounded-sm border border-[#3b4455] text-[#f3f1eb] bg-[#191e28] hover:border-[#38bdf8] transition-colors"
          >
            All Problems
          </Link>
          {problem && (
            <Link
              href={`/solve/${id}`}
              className="font-mono text-sm px-4 py-2.5 rounded-sm border border-[#3b4455] text-[#a3abbb] bg-[#191e28] hover:text-[#f3f1eb] hover:border-[#a3abbb] transition-colors"
            >
              Revisit Workspace
            </Link>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
