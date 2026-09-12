import Link from 'next/link';
import AuthForm from '@/components/AuthForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#12151c]">
      <header className="border-b border-[#2a303c]">
        <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
          <span className="font-mono font-semibold text-[#f3f1eb]">
            <span className="text-[#38bdf8]">&gt;_</span> CodeGuide
          </span>
          <Link
            href="/"
            className="font-mono text-[13px] text-[#a3abbb] hover:text-[#38bdf8] transition-colors"
          >
            Back to Explorer
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-12 flex justify-center">
        <AuthForm mode="signup" />
      </main>
    </div>
  );
}
