'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import HeroMiniDemo from '@/components/HeroMiniDemo';
import ProblemCard from '@/components/ProblemCard';
import CustomProblemModal from '@/components/CustomProblemModal';
import Footer from '@/components/Footer';
import {
  filterProblems,
  getAllProblems,
  getProblemById,
  getAllCompanies,
  getAllTracks,
} from '@/lib/problems';
import { getCompletedProblems } from '@/lib/storage';
import type { Problem } from '@/types';

export default function LandingPage() {
  const [query, setQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('All');
  const [difficulty, setDifficulty] = useState('All');
  const [company, setCompany] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unsolved' | 'solved'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [lastProblem, setLastProblem] = useState<Problem | null>(null);
  const [expandedTracks, setExpandedTracks] = useState<Record<string, boolean>>({
    arrays_and_hashing: true,
  });

  const allProblems = useMemo(() => getAllProblems(), []);
  const tracks = useMemo(() => getAllTracks(), []);
  const companies = useMemo(() => ['All', ...getAllCompanies()], []);

  useEffect(() => {
    const completed = getCompletedProblems();
    setCompletedIds(completed);
    try {
      const lastId = localStorage.getItem('codeguide_last_problem');
      if (lastId) {
        const p = getProblemById(lastId);
        if (p) setLastProblem(p);
      }
    } catch {
      // ignore
    }
  }, []);

  const results = useMemo(() => {
    // Base filter by query, difficulty, company
    const filtered = filterProblems(query, 'All', difficulty, company);

    // Track filter
    let trackFiltered = filtered;
    if (selectedTrack !== 'All') {
      const targetTrack = tracks.find((t) => t.id === selectedTrack);
      if (targetTrack) {
        trackFiltered = filtered.filter((p) => targetTrack.problemIds.includes(p.id));
      }
    }

    // Status filter
    if (statusFilter === 'solved') {
      return trackFiltered.filter((p) => completedIds.includes(p.id));
    }
    if (statusFilter === 'unsolved') {
      return trackFiltered.filter((p) => !completedIds.includes(p.id));
    }
    return trackFiltered;
  }, [query, selectedTrack, difficulty, company, statusFilter, completedIds, tracks]);

  const isFiltering =
    query.trim() !== '' ||
    selectedTrack !== 'All' ||
    difficulty !== 'All' ||
    company !== 'All' ||
    statusFilter !== 'all';

  // Automatically expand tracks with matching problems during active filter/search
  const effectiveExpanded = useMemo(() => {
    if (!isFiltering) return expandedTracks;
    const map: Record<string, boolean> = { ...expandedTracks };
    for (const track of tracks) {
      const hasMatches = results.some((p) => track.problemIds.includes(p.id));
      if (hasMatches) {
        map[track.id] = true;
      }
    }
    return map;
  }, [isFiltering, expandedTracks, tracks, results]);

  const allExpanded = useMemo(() => {
    return tracks.every((t) => effectiveExpanded[t.id]);
  }, [tracks, effectiveExpanded]);

  const toggleTrack = (trackId: string) => {
    setExpandedTracks((prev) => ({
      ...prev,
      [trackId]: !prev[trackId],
    }));
  };

  const toggleAllTracks = () => {
    const nextState = !allExpanded;
    const updated: Record<string, boolean> = {};
    for (const t of tracks) {
      updated[t.id] = nextState;
    }
    setExpandedTracks(updated);
  };

  return (
    <div className="min-h-screen bg-[#12151c]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 pb-16">
        {/* HERO */}
        <section className="pt-10 sm:pt-14 grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <h1 className="font-serif font-semibold text-[#f3f1eb] text-3xl sm:text-[44px] leading-[1.1]">
              Stop memorizing solutions.
              <span className="block text-[#38bdf8] mt-1">Master the invariant.</span>
            </h1>
            <p className="text-[#a3abbb] text-base sm:text-lg leading-relaxed mt-4">
              A guided Socratic workspace that mentors you through technical
              problems one question at a time. Master patterns, prove invariants,
              and defend tradeoffs under real interview pressure.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {lastProblem ? (
                <Link
                  href={`/solve/${lastProblem.id}`}
                  className="font-mono text-sm font-semibold px-4 py-2.5 rounded-sm bg-[#59a89c] text-[#12151c] hover:bg-[#6bbcae] transition-colors"
                >
                  Resume: {lastProblem.title}
                </Link>
              ) : (
                <a
                  href="#tracks"
                  className="font-mono text-sm font-semibold px-4 py-2.5 rounded-sm bg-[#38bdf8] text-[#0a131f] hover:bg-[#7dd3fc] transition-colors"
                >
                  Explore 50+ Problems
                </a>
              )}
              <button
                onClick={() => setModalOpen(true)}
                className="font-mono text-sm font-semibold px-4 py-2.5 rounded-sm border border-[#3b4455] text-[#f3f1eb] bg-[#191e28] hover:border-[#38bdf8] transition-colors"
              >
                Paste Custom Question
              </button>
            </div>
          </div>
          <HeroMiniDemo />
        </section>

        {/* FEATURES */}
        <section id="how-it-works" className="mt-14 sm:mt-20">
          <span className="font-mono text-xs text-[#38bdf8]">[METHODOLOGY]</span>
          <h2 className="font-serif font-semibold text-2xl sm:text-3xl text-[#f3f1eb] mt-1">
            Why Socratic reasoning beats memorization
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="bg-[#191e28] border border-[#2a303c] rounded-sm p-5">
              <p className="font-mono text-xs text-[#38bdf8]">
                01 · PROGRESSIVE DISCLOSURE
              </p>
              <h3 className="font-semibold text-[#f3f1eb] mt-2">
                Never get spoiled prematurely
              </h3>
              <p className="text-[#a3abbb] text-sm mt-1.5 leading-relaxed">
                Staged Socratic nudges reveal one insight at a time. Test your
                intuition before revealing hints to build real problem-solving
                muscle.
              </p>
            </div>
            <div className="bg-[#191e28] border border-[#2a303c] rounded-sm p-5">
              <p className="font-mono text-xs text-[#59a89c]">
                02 · INVARIANT PROOFS
              </p>
              <h3 className="font-semibold text-[#f3f1eb] mt-2">
                Understand why the algorithm holds
              </h3>
              <p className="text-[#a3abbb] text-sm mt-1.5 leading-relaxed">
                Every approach ships with an explicit inductive invariant—the exact
                mathematical guarantee that eliminates edge case panic during live
                interviews.
              </p>
            </div>
            <div className="bg-[#191e28] border border-[#2a303c] rounded-sm p-5">
              <p className="font-mono text-xs text-[#a673a8]">
                03 · REAL-WORLD TRADEOFFS
              </p>
              <h3 className="font-semibold text-[#f3f1eb] mt-2">
                Defend complexity bounds
              </h3>
              <p className="text-[#a3abbb] text-sm mt-1.5 leading-relaxed">
                Compare brute force against optimal space-time tradeoffs.
                Articulate precisely why your data structure choice wins at production scale.
              </p>
            </div>
          </div>
        </section>

        {/* PATTERN TRACKS & MASTERY */}
        <div id="problems" className="scroll-mt-20" />
        <section id="tracks" className="mt-14 sm:mt-20">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="font-mono text-xs text-[#38bdf8]">[CURRICULUM]</span>
              <h2 className="font-serif font-semibold text-2xl sm:text-3xl text-[#f3f1eb] mt-1">
                Curated Pattern Tracks
              </h2>
              <p className="font-mono text-xs text-[#6e7687] mt-1.5">
                {results.length} problems matching across 7 structured tracks · {completedIds.length} of {allProblems.length} mastered
              </p>
            </div>
            {/* Status quick filters */}
            <div className="flex items-center gap-1.5 font-mono text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1.5 rounded-sm border transition-colors ${
                  statusFilter === 'all'
                    ? 'text-[#38bdf8] border-[#38bdf8] bg-[#0c2338]'
                    : 'text-[#a3abbb] border-[#2a303c] bg-[#191e28] hover:text-[#f3f1eb]'
                }`}
              >
                All ({allProblems.length})
              </button>
              <button
                onClick={() => setStatusFilter('unsolved')}
                className={`px-2.5 py-1.5 rounded-sm border transition-colors ${
                  statusFilter === 'unsolved'
                    ? 'text-[#38bdf8] border-[#38bdf8] bg-[#0c2338]'
                    : 'text-[#a3abbb] border-[#2a303c] bg-[#191e28] hover:text-[#f3f1eb]'
                }`}
              >
                Unsolved ({Math.max(0, allProblems.length - completedIds.length)})
              </button>
              <button
                onClick={() => setStatusFilter('solved')}
                className={`px-2.5 py-1.5 rounded-sm border transition-colors ${
                  statusFilter === 'solved'
                    ? 'text-[#59a89c] border-[#59a89c] bg-[#182a27]'
                    : 'text-[#a3abbb] border-[#2a303c] bg-[#191e28] hover:text-[#f3f1eb]'
                }`}
              >
                Solved ({completedIds.length})
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
            <div className="bg-[#191e28] border border-[#2a303c] rounded-sm p-3">
              <span className="text-[#6e7687] block">CURATED PROBLEMS</span>
              <span className="text-[#f3f1eb] font-semibold text-base mt-1 block">54 Problems</span>
            </div>
            <div className="bg-[#191e28] border border-[#2a303c] rounded-sm p-3">
              <span className="text-[#6e7687] block">PATTERN TRACKS</span>
              <span className="text-[#38bdf8] font-semibold text-base mt-1 block">7 Tracks</span>
            </div>
            <div className="bg-[#191e28] border border-[#2a303c] rounded-sm p-3">
              <span className="text-[#6e7687] block">MASTERY RATIO</span>
              <span className="text-[#59a89c] font-semibold text-base mt-1 block">
                {completedIds.length} / {allProblems.length} ({Math.round((completedIds.length / (allProblems.length || 1)) * 100)}%)
              </span>
            </div>
            <div className="bg-[#191e28] border border-[#2a303c] rounded-sm p-3">
              <span className="text-[#6e7687] block">COVERAGE</span>
              <span className="text-[#a673a8] font-semibold text-base mt-1 block">FAANG + Tier-1</span>
            </div>
          </div>

          {/* Mastery Progress Bar */}
          <div className="mt-3 bg-[#191e28] border border-[#2a303c] rounded-sm p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
              <span className="text-[#f3f1eb]">
                Pattern Mastery:{' '}
                <span className="text-[#38bdf8] font-semibold">
                  {completedIds.length}
                </span>{' '}
                / {allProblems.length} completed
              </span>
              <span className="text-[#a3abbb]">
                {Math.round((completedIds.length / (allProblems.length || 1)) * 100)}%
              </span>
            </div>
            <div className="w-full bg-[#12151c] border border-[#2a303c] rounded-sm h-2 mt-2.5 overflow-hidden">
              <div
                className="bg-[#38bdf8] h-full transition-all duration-300"
                style={{
                  width: `${Math.min(
                    100,
                    Math.round((completedIds.length / (allProblems.length || 1)) * 100)
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Filter Bar */}
          <div className="mt-4 bg-[#191e28] border border-[#2a303c] rounded-sm p-3.5 sm:p-4 space-y-3">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search Arrays, Graphs, Dynamic Programming, Companies…"
              className="w-full bg-[#12151c] border border-[#2a303c] rounded-sm px-3.5 py-2.5 text-sm text-[#f3f1eb] placeholder:text-[#6e7687] focus:outline-none focus:border-[#38bdf8] font-mono"
            />
            <div className="flex flex-wrap items-center gap-2 justify-between">
              <div className="flex flex-wrap gap-2">
                <select
                  value={selectedTrack}
                  onChange={(e) => setSelectedTrack(e.target.value)}
                  className="font-mono text-xs bg-[#12151c] border border-[#2a303c] rounded-sm px-3 py-2 text-[#f3f1eb] focus:outline-none focus:border-[#38bdf8] hover:border-[#3b4455] transition-colors cursor-pointer"
                  aria-label="Filter by pattern track"
                >
                  <option value="All">All Pattern Tracks</option>
                  {tracks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="font-mono text-xs bg-[#12151c] border border-[#2a303c] rounded-sm px-3 py-2 text-[#f3f1eb] focus:outline-none focus:border-[#38bdf8] hover:border-[#3b4455] transition-colors cursor-pointer"
                  aria-label="Filter by difficulty"
                >
                  {['All', 'Easy', 'Medium', 'Hard'].map((d) => (
                    <option key={d} value={d}>
                      {d === 'All' ? 'All Levels' : d}
                    </option>
                  ))}
                </select>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="font-mono text-xs bg-[#12151c] border border-[#2a303c] rounded-sm px-3 py-2 text-[#f3f1eb] focus:outline-none focus:border-[#38bdf8] hover:border-[#3b4455] transition-colors cursor-pointer"
                  aria-label="Filter by company"
                >
                  {companies.map((c) => (
                    <option key={c} value={c}>
                      {c === 'All' ? 'All Companies' : c}
                    </option>
                  ))}
                </select>
                {isFiltering && (
                  <button
                    onClick={() => {
                      setQuery('');
                      setSelectedTrack('All');
                      setDifficulty('All');
                      setCompany('All');
                      setStatusFilter('all');
                    }}
                    className="font-mono text-xs px-3 py-2 rounded-sm border border-[#2a303c] text-[#a3abbb] hover:text-[#38bdf8] hover:border-[#38bdf8] bg-[#12151c] transition-colors"
                  >
                    Clear filters
                  </button>
                )}
              </div>
              <button
                onClick={toggleAllTracks}
                className="font-mono text-xs px-3 py-2 rounded-sm border border-[#38bdf8] text-[#38bdf8] bg-[#0c2338] hover:bg-[#12304d] transition-colors font-semibold"
              >
                {allExpanded ? 'Collapse All Tracks' : 'Expand All Tracks'}
              </button>
            </div>
          </div>

          {/* Collapsible Pattern Tracks List */}
          {results.length === 0 ? (
            <p className="mt-6 font-mono text-sm text-[#6e7687] border border-dashed border-[#3b4455] rounded-sm p-6 text-center">
              $ no matches — try a broader query or reset filters.
            </p>
          ) : (
            <div className="mt-5 space-y-4">
              {tracks.map((track, index) => {
                const trackProblems = allProblems.filter((p) =>
                  track.problemIds.includes(p.id)
                );
                const matchingTrackProblems = results.filter((p) =>
                  track.problemIds.includes(p.id)
                );
                const trackCompletedCount = trackProblems.filter((p) =>
                  completedIds.includes(p.id)
                ).length;
                const easyCount = trackProblems.filter((p) => p.difficulty === 'Easy').length;
                const medCount = trackProblems.filter((p) => p.difficulty === 'Medium').length;
                const hardCount = trackProblems.filter((p) => p.difficulty === 'Hard').length;
                const isOpen = !!effectiveExpanded[track.id];

                // When filtering, hide tracks that have zero matches
                if (isFiltering && matchingTrackProblems.length === 0) {
                  return null;
                }

                return (
                  <div
                    key={track.id}
                    className={`bg-[#191e28] border rounded-sm overflow-hidden transition-colors ${
                      isOpen
                        ? 'border-[#38bdf8]/50'
                        : 'border-[#2a303c] hover:border-[#3b4455]'
                    }`}
                  >
                    {/* Track Header / Toggle Button */}
                    <button
                      type="button"
                      onClick={() => toggleTrack(track.id)}
                      className="w-full text-left p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3.5 hover:bg-[#1f2533] transition-colors focus:outline-none"
                    >
                      {/* Left: Track Number + Title + Subtitle Tagline + Difficulty distribution */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded-sm bg-[#12151c] text-[#38bdf8] border border-[#2a303c]">
                            [TRACK 0{index + 1}]
                          </span>
                          <h3 className="font-serif font-semibold text-lg sm:text-xl text-[#f3f1eb]">
                            {track.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <p className="text-xs text-[#8e98a8] font-mono">
                            {track.tagline}
                          </p>
                          <span className="font-mono text-[11px] text-[#6e7687] bg-[#12151c] border border-[#2a303c] px-1.5 py-0.5 rounded-sm">
                            [{[
                              easyCount > 0 ? `${easyCount} Easy` : null,
                              medCount > 0 ? `${medCount} Med` : null,
                              hardCount > 0 ? `${hardCount} Hard` : null,
                            ]
                              .filter(Boolean)
                              .join(' · ')}]
                          </span>
                        </div>
                      </div>

                      {/* Right: Solved Progress + Problem Count + Expand/Collapse Button */}
                      <div className="flex items-center gap-2 font-mono text-xs shrink-0 self-start md:self-auto">
                        <span
                          className={`px-2.5 py-1 rounded-sm border ${
                            trackCompletedCount === trackProblems.length &&
                            trackProblems.length > 0
                              ? 'text-[#59a89c] bg-[#182a27] border-[#59a89c]'
                              : trackCompletedCount > 0
                              ? 'text-[#38bdf8] bg-[#0c2338] border-[#38bdf8]'
                              : 'text-[#8e98a8] bg-[#12151c] border-[#2a303c]'
                          }`}
                        >
                          [{trackCompletedCount} / {trackProblems.length} Solved]
                        </span>
                        <span className="text-[#a3abbb] bg-[#12151c] border border-[#2a303c] px-2.5 py-1 rounded-sm">
                          [{matchingTrackProblems.length}{' '}
                          {matchingTrackProblems.length === 1
                            ? 'Problem'
                            : 'Problems'}
                          ]
                        </span>
                        <span className="text-[#38bdf8] border border-[#38bdf8] bg-[#0c2338] px-2.5 py-1 rounded-sm font-semibold hover:bg-[#12304d] transition-colors">
                          {isOpen ? '[-] Collapse' : '[+] Expand'}
                        </span>
                      </div>
                    </button>

                    {/* Track Body */}
                    {isOpen && (
                      <div className="border-t border-[#2a303c] p-4 sm:p-5 bg-[#141822]">
                        {/* Core Invariant Callout */}
                        <div className="bg-[#12151c] border-l-2 border-[#e3a448] border-y border-r border-[#2a303c] p-4 rounded-sm text-xs text-[#a3abbb] mb-4">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="font-mono text-[#e3a448] font-semibold text-[11px] bg-[#2a1d0f] border border-[#e3a448]/40 px-1.5 py-0.5 rounded-sm">
                              &gt;_ INVARIANT PROOF
                            </span>
                            <span className="font-mono text-[11px] text-[#6e7687]">
                              Guaranteed correctness condition
                            </span>
                          </div>
                          <p className="text-[#d8d5cd] text-[13px] leading-relaxed">
                            {track.invariant}
                          </p>
                        </div>

                        {/* Problems Grid for this Track */}
                        {matchingTrackProblems.length === 0 ? (
                          <p className="font-mono text-xs text-[#6e7687] border border-dashed border-[#2a303c] rounded-sm p-4 text-center">
                            $ 0 matching problems in this track for current filters.
                          </p>
                        ) : (
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {matchingTrackProblems.map((p) => (
                              <ProblemCard
                                key={p.id}
                                problem={p}
                                isCompleted={completedIds.includes(p.id)}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <Footer />
      <CustomProblemModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
