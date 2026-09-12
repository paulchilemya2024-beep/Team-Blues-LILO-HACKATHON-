'use client';

const DEFAULT_STEPS = [
  'Understand Problem',
  'Think it Through',
  'Approach + Code',
  'Complexity',
  'Tradeoffs',
  'Recap',
];

export default function Stepper({
  steps = DEFAULT_STEPS,
  currentStep,
  onStepClick,
}: {
  steps?: string[];
  currentStep: number;
  onStepClick: (i: number) => void;
}) {
  return (
    <ol className="space-y-1">
      {steps.map((label, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        const box = done
          ? 'bg-[#59a89c] text-[#12151c] border-[#59a89c]'
          : active
            ? 'bg-transparent text-[#38bdf8] border-[#38bdf8]'
            : 'bg-transparent text-[#6e7687] border-[#2a303c]';
        const mark = done ? '✓' : active ? '●' : ' ';
        return (
          <li key={label}>
            <button
              onClick={() => onStepClick(i)}
              className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-sm border text-left transition-colors ${
                active
                  ? 'border-[#38bdf8] bg-[#222936]'
                  : 'border-transparent hover:bg-[#222936]'
              }`}
            >
              <span
                className={`shrink-0 w-6 h-6 flex items-center justify-center font-mono text-xs font-bold border rounded-sm ${box}`}
              >
                {mark}
                <span className="sr-only">{mark}</span>
              </span>
              <span
                className={`text-[13px] ${
                  active
                    ? 'text-[#f3f1eb] font-semibold'
                    : done
                      ? 'text-[#a3abbb]'
                      : 'text-[#6e7687]'
                }`}
              >
                <span className="font-mono text-[11px] mr-1.5 opacity-70">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {label}
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}
