export default function PaperCard({
  title,
  summary,
  constraints,
}: {
  title: string;
  summary: string;
  constraints: string[];
}) {
  return (
    <section className="bg-[#f6f3ec] border border-[#e2ddce] rounded-sm p-5 sm:p-6">
      <p className="font-mono text-[11px] text-[#7c776c] tracking-wide">
        PROBLEM STATEMENT
      </p>
      <h2 className="font-serif font-semibold text-[#201f1a] text-xl sm:text-2xl mt-1 leading-tight">
        {title}
      </h2>
      <p className="text-[#201f1a] text-[15px] leading-relaxed mt-2">
        {summary}
      </p>
      {constraints.length > 0 && (
        <div className="mt-4 border-t border-[#e2ddce] pt-3">
          <p className="font-mono text-[11px] text-[#7c776c]">CONSTRAINTS</p>
          <ul className="mt-2 space-y-1.5">
            {constraints.map((c, i) => (
              <li
                key={i}
                className="flex gap-2 text-[#55524a] text-sm leading-relaxed"
              >
                <span className="font-mono text-[#38bdf8] shrink-0">▪</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
