'use client';

export default function HintLadder({
  hints,
  revealedCount,
  onReveal,
}: {
  hints: string[];
  revealedCount: number;
  onReveal: () => void;
}) {
  const revealed = hints.slice(0, revealedCount);
  const remaining = hints.length - revealedCount;

  return (
    <section className="bg-[#191e28] border border-[#2a303c] rounded-sm p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="font-mono text-xs text-[#38bdf8]">
          &gt;_ Socratic Hint Ladder
        </p>
        <span className="font-mono text-[11px] text-[#a3abbb] border border-[#2a303c] rounded-sm px-1.5 py-0.5 bg-[#12151c]">
          Hints: {revealedCount}/{hints.length} revealed
        </span>
      </div>
      <div className="mt-3 space-y-2">
        {revealed.length === 0 && (
          <p className="text-[#6e7687] text-sm font-mono">
            $ no hints revealed yet — request only what you need.
          </p>
        )}
        {revealed.map((h, i) => (
          <div
            key={i}
            className="border border-[#2a303c] rounded-sm bg-[#12151c] px-3 py-2.5 transition-all duration-200"
          >
            <span className="font-mono text-[11px] text-[#a673a8] bg-[#281d2a] border border-[#2a303c] rounded-sm px-1.5 py-0.5">
              HINT {i + 1}
            </span>
            <p className="text-[#f3f1eb] text-sm mt-1.5 leading-relaxed">
              {h.replace(/^HINT \d+ —\s*/, '')}
            </p>
          </div>
        ))}
        {remaining > 0 && (
          <div className="border border-dashed border-[#3b4455] rounded-sm px-3 py-2.5">
            <p className="font-mono text-xs text-[#6e7687]">
              {remaining} hint{remaining > 1 ? 's' : ''} locked
            </p>
          </div>
        )}
      </div>
      {remaining > 0 ? (
        <button
          onClick={onReveal}
          className="mt-3 font-mono text-[13px] font-semibold px-3 py-2 rounded-sm bg-[#38bdf8] text-[#0a131f] hover:bg-[#7dd3fc] transition-colors"
        >
          &gt;_ Reveal Next Hint ({revealedCount + 1}/{hints.length})
        </button>
      ) : (
        <p className="mt-3 font-mono text-xs text-[#59a89c]">
          ✓ full ladder revealed — proceed to approach.
        </p>
      )}
    </section>
  );
}
