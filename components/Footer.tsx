export default function Footer() {
  return (
    <footer className="border-t border-[#2a303c] bg-[#12151c] mt-16">
      <div className="mx-auto max-w-6xl px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono font-bold text-[#38bdf8] text-base">
            &gt;_
          </span>
          <span className="font-mono font-semibold text-[#f3f1eb] text-sm tracking-tight">
            CodeGuide
          </span>
          <span className="text-[#6e7687] text-xs font-mono ml-2 hidden sm:inline">
            · Socratic interview prep
          </span>
        </div>
        <p className="font-mono text-xs text-[#6e7687]">
          &copy; 2026 CodeGuide. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
