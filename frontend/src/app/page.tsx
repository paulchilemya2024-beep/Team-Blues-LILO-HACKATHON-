"use client";

import { FormEvent, useState } from "react";

type Walkthrough = {
  title: string;
  summary: string;
  constraints: string[];
  hints: string[];
  approach: { name: string; explanation: string; why_this_works: string; code: string };
  complexity: { time: string; space: string; explanation: string };
};

const examples = [
  "Given an array of integers and a target, return the indices of the two numbers that add up to the target.",
  "Given a string, find the length of the longest substring without repeating characters.",
  "Given a grid of 1s and 0s, count the number of islands.",
];

async function askTutor(prompt: string, context = "", mode = "walkthrough") {
  const response = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, context, mode }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "The tutor could not respond.");
  return data as { answer: string; matches: { title: string; pattern: string }[] };
}

export default function Home() {
  const [problem, setProblem] = useState("");
  const [walkthrough, setWalkthrough] = useState<Walkthrough | null>(null);
  const [revealed, setRevealed] = useState(0);
  const [followup, setFollowup] = useState("");
  const [answers, setAnswers] = useState<{ question: string; answer: string }[]>([]);
  const [matches, setMatches] = useState<{ title: string; pattern: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function start(event: FormEvent) {
    event.preventDefault();
    if (!problem.trim()) return;
    setLoading(true); setError(""); setWalkthrough(null); setAnswers([]); setRevealed(0);
    try {
      const data = await askTutor(problem);
      const clean = data.answer.replace(/^```json\s*|\s*```$/g, "");
      setWalkthrough(JSON.parse(clean)); setMatches(data.matches);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Something went wrong.");
    } finally { setLoading(false); }
  }

  async function askFollowup(event: FormEvent) {
    event.preventDefault();
    if (!followup.trim() || !walkthrough) return;
    const question = followup.trim(); setFollowup(""); setLoading(true); setError("");
    try {
      const data = await askTutor(question, `${walkthrough.title}: ${walkthrough.summary}\nApproach: ${walkthrough.approach.name}`, "followup");
      setAnswers((current) => [...current, { question, answer: data.answer }]);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Something went wrong."); }
    finally { setLoading(false); }
  }

  return (
    <main className="shell">
      <aside className="sidebar">
        <div><p className="eyebrow">INTERVIEW CODE</p><h1>Think clearly.<br /><em>Code confidently.</em></h1><p className="tagline">A grounded tutor that helps you discover the pattern before it hands you the answer.</p></div>
        <form onSubmit={start} className="problem-form"><label htmlFor="problem">PASTE A PROBLEM</label><textarea id="problem" value={problem} onChange={(event) => setProblem(event.target.value)} placeholder="e.g. Given an array of integers..." /><button className="primary" disabled={loading || !problem.trim()}>{loading ? "Thinking..." : "Start walkthrough"}</button></form>
        <div><label>TRY AN EXAMPLE</label><div className="examples">{examples.map((example) => <button type="button" key={example} onClick={() => setProblem(example)}>{example}</button>)}</div></div>
        <p className="index-note"><span /> Local RAG index connected · {matches.length ? `${matches.length} matches used` : "ready"}</p>
      </aside>
      <section className="content">
        {!walkthrough && !loading && !error && <div className="welcome"><span className="line" /><p className="eyebrow">YOUR NEXT BREAKTHROUGH</p><h2>Let&apos;s break down<br />a problem together.</h2><p>Choose an example or bring your own interview question. Your tutor will guide the reasoning in small, useful steps.</p></div>}
        {loading && <div className="status">Reading the problem and mapping the right pattern<span>...</span></div>}
        {error && <div className="error">{error}</div>}
        {walkthrough && <article className="walkthrough">
          <div className="match-row"><span>RETRIEVED PATTERNS</span>{matches.map((match) => <b key={match.title}>{match.title} · {match.pattern}</b>)}</div>
          <p className="eyebrow">WALKTHROUGH</p><h2>{walkthrough.title}</h2><p className="summary">{walkthrough.summary}</p>
          {walkthrough.constraints?.length > 0 && <div className="constraints"><span>WATCH FOR</span>{walkthrough.constraints.map((constraint) => <p key={constraint}>{constraint}</p>)}</div>}
          <section className="hints"><div className="section-heading"><span>01</span><h3>Think it through</h3></div>{walkthrough.hints.map((hint, index) => index < revealed && <div className="hint" key={hint}><span>HINT {index + 1}</span><p>{hint}</p></div>)}{revealed < walkthrough.hints.length && <button className="secondary" onClick={() => setRevealed((count) => count + 1)}>Reveal hint {revealed + 1} of {walkthrough.hints.length}</button>}</section>
          {revealed === walkthrough.hints.length && <section className="approach"><div className="section-heading"><span>02</span><h3>{walkthrough.approach.name}</h3></div><p>{walkthrough.approach.explanation}</p><div className="why"><span>WHY IT WORKS</span>{walkthrough.approach.why_this_works}</div><pre>{walkthrough.approach.code}</pre><div className="complexity"><b>TIME {walkthrough.complexity.time}</b><b>SPACE {walkthrough.complexity.space}</b><p>{walkthrough.complexity.explanation}</p></div></section>}
          {revealed === walkthrough.hints.length && <section className="followup"><div className="section-heading"><span>03</span><h3>Keep exploring</h3></div>{answers.map((item) => <div className="qa" key={item.question}><b>{item.question}</b><p>{item.answer}</p></div>)}<form onSubmit={askFollowup} className="followup-form"><input value={followup} onChange={(event) => setFollowup(event.target.value)} placeholder="Ask about the approach or a trade-off..." /><button className="secondary" disabled={loading}>Ask</button></form></section>}
        </article>}
      </section>
    </main>
  );
}
