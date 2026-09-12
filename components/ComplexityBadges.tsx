export default function ComplexityBadges({
  time,
  space,
  explanation,
}: {
  time: string;
  space: string;
  explanation: string;
}) {
  return (
    <section className="bg-[#191e28] border border-[#2a303c] rounded-sm p-4 sm:p-5">
      <p className="font-mono text-xs text-[#38bdf8]">
        &gt;_ Complexity &amp; Invariant Bounds
      </p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        <span className="font-mono text-xs font-semibold text-[#59a89c] bg-[#182a27] border border-[#59a89c] rounded-sm px-2.5 py-1">
          TIME: {time}
        </span>
        <span className="font-mono text-xs font-semibold text-[#818cf8] bg-[#1a1c38] border border-[#818cf8] rounded-sm px-2.5 py-1">
          SPACE: {space}
        </span>
      </div>
      <p className="text-[#a3abbb] text-sm leading-relaxed mt-3">
        {explanation}
      </p>
    </section>
  );
}
