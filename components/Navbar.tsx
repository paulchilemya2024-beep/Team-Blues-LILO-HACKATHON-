'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getCurrentUser, setCurrentUser } from '@/lib/storage';
import type { UserProfile } from '@/types';

export default function Navbar({ activeTab }: { activeTab?: string }) {
  const pathname = usePathname();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setUser(getCurrentUser());
  }, [pathname]);

  const isActive = (href: string) =>
    activeTab === href || pathname === href || pathname?.startsWith(href + '/');

  const handleSignOut = () => {
    setCurrentUser(null);
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="sticky top-0 z-40 bg-[#12151c] border-b border-[#2a303c]">
      <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="font-mono font-bold text-[#38bdf8] text-lg">
            &gt;_
          </span>
          <span className="font-mono font-semibold text-[#f3f1eb] text-base tracking-tight">
            CodeGuide
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2 text-sm">
          <Link
            href="/#tracks"
            className={`font-mono text-[13px] px-2.5 py-1.5 rounded-sm border transition-colors ${
              isActive('/#tracks') || isActive('/#problems')
                ? 'text-[#38bdf8] border-[#2a303c] bg-[#191e28]'
                : 'text-[#a3abbb] border-transparent hover:text-[#f3f1eb] hover:bg-[#191e28]'
            }`}
          >
            Problem Library
          </Link>
          <Link
            href="/#how-it-works"
            className="hidden sm:inline-block font-mono text-[13px] px-2.5 py-1.5 rounded-sm border border-transparent text-[#a3abbb] hover:text-[#f3f1eb] hover:bg-[#191e28] transition-colors"
          >
            How it Works
          </Link>
          {user && !user.isGuest ? (
            <div className="flex items-center gap-2">
              <span className="font-mono text-[12px] text-[#38bdf8] bg-[#0c2338] border border-[#2a303c] px-2 py-1 rounded-sm hidden sm:inline-block max-w-[150px] truncate">
                {user.email || 'developer'}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="font-mono text-[13px] px-2.5 py-1.5 rounded-sm text-[#a3abbb] hover:text-[#e06c75] transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : user?.isGuest ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="font-mono text-[13px] px-2.5 py-1.5 rounded-sm text-[#a3abbb] hover:text-[#f3f1eb] transition-colors"
              >
                Sign In
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="font-mono text-[13px] px-2.5 py-1.5 rounded-sm text-[#a3abbb] hover:text-[#e06c75] transition-colors"
              >
                Exit
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="font-mono text-[13px] px-2.5 py-1.5 rounded-sm text-[#a3abbb] hover:text-[#f3f1eb] transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="font-mono text-[13px] px-3 py-1.5 rounded-sm bg-[#38bdf8] text-[#0a131f] font-semibold hover:bg-[#7dd3fc] transition-colors"
              >
                Start
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
