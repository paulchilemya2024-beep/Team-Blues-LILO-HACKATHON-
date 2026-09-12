import CodeBlock from '@/components/CodeBlock';
import type { ApproachData } from '@/types';

export default function ApproachCard({
  approach,
}: {
  approach: ApproachData;
}) {
  return (
    <section className="bg-[#191e28] border border-[#2a303c] rounded-sm p-4 sm:p-5">
      <p className="font-mono text-xs text-[#38bdf8]">
        &gt;_ Recommended Approach
      </p>
      <h3 className="font-serif font-semibold text-[#f3f1eb] text-lg mt-1">
        {approach.name}
      </h3>
      <p className="text-[#a3abbb] text-sm leading-relaxed mt-2">
        {approach.explanation}
      </p>
      <div className="mt-3 border-l-2 border-[#38bdf8] bg-[#12151c] rounded-sm px-3 py-2.5">
        <p className="font-mono text-[11px] text-[#38bdf8]">
          Why this works
        </p>
        <p className="text-[#f3f1eb] text-sm leading-relaxed mt-1">
          {approach.why_this_works}
        </p>
      </div>
      <div className="mt-3">
        <CodeBlock
          code={approach.code}
          language={approach.language ?? 'python'}
        />
      </div>
    </section>
  );
}
