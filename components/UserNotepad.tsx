'use client';

export default function UserNotepad({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <section className="bg-[#191e28] border border-[#2a303c] rounded-sm p-4">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs text-[#38bdf8]">
          &gt;_ Scratchpad
        </p>
        <span className="font-mono text-[11px] text-[#6e7687]">
          {value.length} chars
        </span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder="Jot hypotheses, invariants, edge cases… (auto-saved locally)"
        className="mt-2 w-full bg-[#12151c] border border-[#2a303c] rounded-sm px-3 py-2 text-sm text-[#f3f1eb] placeholder:text-[#6e7687] focus:outline-none focus:border-[#38bdf8] resize-y"
      />
    </section>
  );
}
