'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PaperCard from '@/components/PaperCard';
import Stepper from '@/components/Stepper';
import HintLadder from '@/components/HintLadder';
import ApproachCard from '@/components/ApproachCard';
import ComplexityBadges from '@/components/ComplexityBadges';
import TradeoffTable from '@/components/TradeoffTable';
import TutorChat from '@/components/TutorChat';
import UserNotepad from '@/components/UserNotepad';
import { getProblemById } from '@/lib/problems';
import { getWalkthrough } from '@/lib/mockSolutions';
import {
  defaultSession,
  loadSession,
  saveSession,
  markProblemComplete,
} from '@/lib/storage';
import { askTutor, buildQAPair } from '@/lib/ai';
import type { SessionState } from '@/types';

const STEPS = [
  'Understand Problem',
  'Think it Through',
  'Approach + Code',
  'Complexity',
  'Tradeoffs',
  'Mentor Q&A',
];

export default function SolvePage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) ?? '';
  const problem = getProblemById(id);
  const walkthrough = useMemo(() => getWalkthrough(id), [id]);

  const [session, setSession] = useState<SessionState>(() =>
    defaultSession(id)
  );
  const [hydrated, setHydrated] = useState(false);
  const [tutorLoading, setTutorLoading] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existing = loadSession(id);
    if (existing) setSession(existing);
    setHydrated(true);
    if (id) {
      try {
        localStorage.setItem('codeguide_last_problem', id);
      } catch {
        // ignore
      }
    }
  }, [id]);

  useEffect(() => {
    if (hydrated) saveSession(session);
  }, [session, hydrated]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const typing =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        advance();
      } else if (
        (e.key === 'h' || e.key === 'H') &&
        !typing &&
        !e.metaKey &&
        !e.ctrlKey
      ) {
        revealHint();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  function revealHint() {
    setSession((s) => ({
      ...s,
      hintsRevealed: Math.min(s.hintsRevealed + 1, walkthrough.socratic_hints.length),
      currentStep: Math.max(s.currentStep, 1),
    }));
  }

  function advance() {
    setSession((s) => ({
      ...s,
      currentStep: Math.min(s.currentStep + 1, STEPS.length - 1),
    }));
    requestAnimationFrame(() => {
      mainRef.current
        ?.querySelector(`[data-step="${Math.min(session.currentStep + 1, 5)}"]`)
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  const handleAsk = useCallback(
    async (q: string) => {
      setTutorLoading(true);
      try {
        const a = await askTutor(q, {
          problemTitle: walkthrough.title,
          pattern: problem?.pattern ?? 'Guided Reasoning',
        });
        setSession((s) => ({
          ...s,
          qaThread: [...s.qaThread, buildQAPair(q, a)],
        }));
      } finally {
        setTutorLoading(false);
      }
    },
    [walkthrough.title, problem?.pattern]
  );

  function handleComplete() {
    markProblemComplete(id);
    setSession((s) => ({ ...s, isCompleted: true }));
    router.push(`/summary/${id}`);
  }

  if (!problem) {
    return (
      <div className="min-h-screen bg-[#12151c]">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p className="font-mono text-sm text-[#e06c75]">
            [404] unknown problem id: {id}
          </p>
          <Link
            href="/#problems"
            className="inline-block mt-4 font-mono text-sm px-4 py-2 rounded-sm bg-[#38bdf8] text-[#0a131f] font-semibold hover:bg-[#7dd3fc] transition-colors"
          >
            Back to Problem Library
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#12151c]">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-6 grid gap-5 lg:grid-cols-[300px_1fr]">
        {/* LEFT RAIL */}
        <aside className="lg:sticky lg:top-[68px] self-start bg-[#191e28] border border-[#2a303c] rounded-sm p-4 space-y-4">
          <div>
            <Link
              href="/#problems"
              className="font-mono text-xs text-[#a3abbb] hover:text-[#38bdf8]"
            >
              Back to Problem Library
            </Link>
            <h1 className="font-serif font-semibold text-lg text-[#f3f1eb] mt-2 leading-snug">
              {problem.title}
            </h1>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="font-mono text-[11px] text-[#38bdf8] bg-[#0c2338] border border-[#38bdf8] rounded-sm px-1.5 py-0.5">
                {problem.difficulty}
              </span>
              <span className="font-mono text-[11px] text-[#a673a8] bg-[#281d2a] border border-[#2a303c] rounded-sm px-1.5 py-0.5">
                {problem.pattern}
              </span>
            </div>
          </div>
          <div className="border-t border-[#2a303c] pt-3">
            <Stepper
              steps={STEPS}
              currentStep={session.currentStep}
              onStepClick={(i) =>
                setSession((s) => ({ ...s, currentStep: i }))
              }
            />
          </div>
          <div className="border-t border-[#2a303c] pt-3">
            <UserNotepad
              value={session.userNotes}
              onChange={(v) => setSession((s) => ({ ...s, userNotes: v }))}
            />
          </div>
          <p className="font-mono text-[11px] text-[#6e7687]">
            shortcuts: H hint · Cmd+Enter advance · Esc close
          </p>
        </aside>

        {/* MAIN STAGE */}
        <div ref={mainRef} className="space-y-4 min-w-0">
          <div data-step="0">
            <PaperCard
              title={walkthrough.title}
              summary={walkthrough.summary}
              constraints={walkthrough.constraints}
            />
          </div>

          <div data-step="1">
            <HintLadder
              hints={walkthrough.socratic_hints}
              revealedCount={session.hintsRevealed}
              onReveal={revealHint}
            />
          </div>

          <div data-step="2">
            {session.currentStep < 2 ? (
              <div className="bg-[#191e28] border border-dashed border-[#2a303c] rounded-sm p-4 text-center">
                <p className="font-mono text-xs text-[#a3abbb]">
                  Optimal Approach &amp; Code is hidden until you think through invariants.
                </p>
                <button
                  onClick={() => setSession((s) => ({ ...s, currentStep: 2 }))}
                  className="mt-1.5 font-mono text-xs text-[#38bdf8] hover:underline"
                >
                  Reveal Approach &amp; Code
                </button>
              </div>
            ) : (
              <ApproachCard approach={walkthrough.approach} />
            )}
          </div>

          <div data-step="3">
            {session.currentStep < 3 ? (
              <div className="bg-[#191e28] border border-dashed border-[#2a303c] rounded-sm p-4 text-center">
                <p className="font-mono text-xs text-[#6e7687]">
                  Asymptotic Complexity unlocks at Step 4.
                </p>
                <button
                  onClick={() => setSession((s) => ({ ...s, currentStep: 3 }))}
                  className="mt-1 font-mono text-xs text-[#38bdf8] hover:underline"
                >
                  Reveal Complexity Analysis
                </button>
              </div>
            ) : (
              <ComplexityBadges
                time={walkthrough.complexity.time}
                space={walkthrough.complexity.space}
                explanation={walkthrough.complexity.explanation}
              />
            )}
          </div>

          <div data-step="4">
            {session.currentStep < 4 ? (
              <div className="bg-[#191e28] border border-dashed border-[#2a303c] rounded-sm p-4 text-center">
                <p className="font-mono text-xs text-[#6e7687]">
                  Alternatives &amp; Tradeoffs matrix unlocks at Step 5.
                </p>
                <button
                  onClick={() => setSession((s) => ({ ...s, currentStep: 4 }))}
                  className="mt-1 font-mono text-xs text-[#38bdf8] hover:underline"
                >
                  Reveal Tradeoff Matrix
                </button>
              </div>
            ) : (
              <TradeoffTable alternatives={walkthrough.alternatives} />
            )}
          </div>

          <div data-step="5" className="space-y-4">
            <TutorChat
              thread={session.qaThread}
              onAsk={handleAsk}
              isLoading={tutorLoading}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pb-8 pt-2">
            {session.currentStep < STEPS.length - 1 ? (
              <button
                onClick={advance}
                className="font-mono text-sm font-semibold px-4 py-2.5 rounded-sm bg-[#38bdf8] text-[#0a131f] hover:bg-[#7dd3fc] transition-colors"
              >
                {session.currentStep === 0
                  ? "I Understand the Problem — Let's Think"
                  : session.currentStep === 1
                  ? 'Reveal Optimal Approach'
                  : session.currentStep === 2
                  ? 'Analyze Complexity'
                  : session.currentStep === 3
                  ? 'Compare Tradeoffs'
                  : 'Ask Mentor & Finish'}
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="font-mono text-sm font-semibold px-4 py-2.5 rounded-sm bg-[#59a89c] text-[#12151c] hover:bg-[#6bbcae] transition-colors"
              >
                Complete Problem &amp; View Mastery Sheet
              </button>
            )}
            <Link
              href={`/summary/${id}`}
              className="font-mono text-sm px-4 py-2.5 rounded-sm border border-[#3b4455] text-[#a3abbb] bg-[#191e28] hover:text-[#f3f1eb] hover:border-[#38bdf8] transition-colors"
            >
              Skip to Solution Recap
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
