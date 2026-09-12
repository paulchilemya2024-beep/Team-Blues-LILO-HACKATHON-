'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
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
import { getWalkthrough } from '@/lib/mockSolutions';
import { askTutor, buildQAPair } from '@/lib/ai';
import type { QAPair } from '@/types';

const STEPS = [
  'Understand Problem',
  'Think it Through',
  'Approach + Code',
  'Complexity',
  'Tradeoffs',
  'Mentor Q&A',
];

export default function CustomSolvePage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [customTitle, setCustomTitle] = useState('Custom Problem');
  const [customPrompt, setCustomPrompt] = useState('');
  const [hintsRevealed, setHintsRevealed] = useState(0);
  const [notes, setNotes] = useState('');
  const [thread, setThread] = useState<QAPair[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('codeguide_custom_problem');
      if (raw) {
        const parsed = JSON.parse(raw) as { title?: string; prompt?: string };
        if (parsed.title) setCustomTitle(parsed.title);
        if (parsed.prompt) setCustomPrompt(parsed.prompt);
      }
    } catch {
      // ignore
    }
  }, []);

  const walkthrough = useMemo(
    () => getWalkthrough('__custom__'),
    []
  );

  async function handleAsk(q: string) {
    setLoading(true);
    try {
      const a = await askTutor(q, {
        problemTitle: customTitle,
        pattern: 'Guided Reasoning',
      });
      setThread((t) => [...t, buildQAPair(q, a)]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#12151c]">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-6 grid gap-5 lg:grid-cols-[300px_1fr]">
        <aside className="lg:sticky lg:top-[68px] self-start bg-[#191e28] border border-[#2a303c] rounded-sm p-4 space-y-4">
          <div>
            <Link
              href="/#problems"
              className="font-mono text-xs text-[#a3abbb] hover:text-[#38bdf8]"
            >
              Back to Problem Library
            </Link>
            <h1 className="font-serif font-semibold text-lg text-[#f3f1eb] mt-2 leading-snug">
              {customTitle}
            </h1>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="font-mono text-[11px] text-[#a673a8] bg-[#281d2a] border border-[#2a303c] rounded-sm px-1.5 py-0.5">
                Custom
              </span>
              <span className="font-mono text-[11px] text-[#59a89c] bg-[#182a27] border border-[#2a303c] rounded-sm px-1.5 py-0.5">
                Guided Reasoning
              </span>
            </div>
          </div>
          <div className="border-t border-[#2a303c] pt-3">
            <Stepper
              steps={STEPS}
              currentStep={currentStep}
              onStepClick={setCurrentStep}
            />
          </div>
          <div className="border-t border-[#2a303c] pt-3">
            <UserNotepad value={notes} onChange={setNotes} />
          </div>
        </aside>

        <div className="space-y-4 min-w-0">
          <div data-step="0">
            <PaperCard
              title={customTitle}
              summary={
                customPrompt ||
                'No custom question pasted yet — paste one from the landing page to work it here with the full Socratic template.'
              }
              constraints={walkthrough.constraints}
            />
          </div>

          <div data-step="1">
            <HintLadder
              hints={walkthrough.socratic_hints}
              revealedCount={hintsRevealed}
              onReveal={() =>
                setHintsRevealed((r) =>
                  Math.min(r + 1, walkthrough.socratic_hints.length)
                )
              }
            />
          </div>

          <div data-step="2">
            {currentStep < 2 ? (
              <div className="bg-[#191e28] border border-dashed border-[#2a303c] rounded-sm p-4 text-center">
                <p className="font-mono text-xs text-[#a3abbb]">
                  Optimal Approach &amp; Code is hidden until you think through invariants.
                </p>
                <button
                  onClick={() => setCurrentStep(2)}
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
            {currentStep < 3 ? (
              <div className="bg-[#191e28] border border-dashed border-[#2a303c] rounded-sm p-4 text-center">
                <p className="font-mono text-xs text-[#6e7687]">
                  Asymptotic Complexity unlocks at Step 4.
                </p>
                <button
                  onClick={() => setCurrentStep(3)}
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
            {currentStep < 4 ? (
              <div className="bg-[#191e28] border border-dashed border-[#2a303c] rounded-sm p-4 text-center">
                <p className="font-mono text-xs text-[#6e7687]">
                  Alternatives &amp; Tradeoffs matrix unlocks at Step 5.
                </p>
                <button
                  onClick={() => setCurrentStep(4)}
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
            <TutorChat thread={thread} onAsk={handleAsk} isLoading={loading} />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pb-8 pt-2">
            {currentStep < STEPS.length - 1 ? (
              <button
                onClick={() => setCurrentStep((s) => Math.min(s + 1, STEPS.length - 1))}
                className="font-mono text-sm font-semibold px-4 py-2.5 rounded-sm bg-[#38bdf8] text-[#0a131f] hover:bg-[#7dd3fc] transition-colors"
              >
                {currentStep === 0
                  ? "I Understand the Problem — Let's Think"
                  : currentStep === 1
                  ? 'Reveal Optimal Approach'
                  : currentStep === 2
                  ? 'Analyze Complexity'
                  : currentStep === 3
                  ? 'Compare Tradeoffs'
                  : 'Ask Mentor & Finish'}
              </button>
            ) : (
              <Link
                href="/#problems"
                className="font-mono text-sm font-semibold px-4 py-2.5 rounded-sm bg-[#59a89c] text-[#12151c] hover:bg-[#6bbcae] transition-colors"
              >
                Complete Session — Back to Problem Library
              </Link>
            )}
            <Link
              href="/#problems"
              className="font-mono text-sm px-4 py-2.5 rounded-sm border border-[#3b4455] text-[#a3abbb] bg-[#191e28] hover:text-[#f3f1eb] hover:border-[#38bdf8] transition-colors"
            >
              Back to Library
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
