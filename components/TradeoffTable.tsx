import type { AlternativeApproach } from '@/types';

export default function TradeoffTable({
  alternatives,
}: {
  alternatives: AlternativeApproach[];
}) {
  return (
    <section className="bg-[#191e28] border border-[#2a303c] rounded-sm p-4 sm:p-5 overflow-hidden">
      <p className="font-mono text-xs text-[#38bdf8]">
        &gt;_ Tradeoff Matrix
      </p>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[560px]">
          <thead>
            <tr className="border-b border-[#2a303c]">
              <th className="text-left font-mono text-[11px] text-[#6e7687] font-medium py-2 pr-3">
                APPROACH
              </th>
              <th className="text-left font-mono text-[11px] text-[#6e7687] font-medium py-2 pr-3">
                TIME
              </th>
              <th className="text-left font-mono text-[11px] text-[#6e7687] font-medium py-2 pr-3">
                SPACE
              </th>
              <th className="text-left font-mono text-[11px] text-[#6e7687] font-medium py-2">
                TRADEOFF
              </th>
            </tr>
          </thead>
          <tbody>
            {alternatives.map((alt) => (
              <tr
                key={alt.name}
                className="border-b border-[#2a303c] last:border-b-0"
              >
                <td className="py-2.5 pr-3 font-semibold text-[#f3f1eb] align-top whitespace-nowrap">
                  {alt.name}
                </td>
                <td className="py-2.5 pr-3 font-mono text-[13px] text-[#59a89c] align-top whitespace-nowrap">
                  {alt.time}
                </td>
                <td className="py-2.5 pr-3 font-mono text-[13px] text-[#38bdf8] align-top whitespace-nowrap">
                  {alt.space}
                </td>
                <td className="py-2.5 text-[#a3abbb] text-[13px] leading-relaxed align-top">
                  {alt.tradeoff}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
