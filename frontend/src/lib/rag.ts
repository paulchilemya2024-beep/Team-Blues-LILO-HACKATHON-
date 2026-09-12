import { readFileSync } from "node:fs";
import { join } from "node:path";

export type KnowledgeItem = {
  id: string;
  title: string;
  topic: string;
  pattern: string;
  difficulty: string;
  prompt: string;
  keywords: string[];
};

const knowledgeBase = JSON.parse(
  readFileSync(join(process.cwd(), "..", "rag.json"), "utf8"),
) as KnowledgeItem[];

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "be", "by", "for", "from", "given", "how",
  "in", "is", "of", "on", "or", "the", "to", "with",
]);

function tokenize(value: string) {
  return new Set(
    value.toLowerCase().replace(/[^a-z0-9]+/g, " ").split(" ")
      .filter((token) => token.length > 1 && !STOP_WORDS.has(token)),
  );
}

function itemText(item: KnowledgeItem) {
  return [item.title, item.topic, item.pattern, item.prompt, ...item.keywords].join(" ");
}

export function retrieveKnowledge(query: string, limit = 4) {
  const queryTokens = tokenize(query);
  return knowledgeBase
    .map((item) => {
      const itemTokens = tokenize(itemText(item));
      const score = [...queryTokens].reduce(
        (total, token) => total + (itemTokens.has(token) ? 1 : 0), 0,
      );
      return { item, score };
    })
    .filter(({ score }) => score > 0)
    .sort((left, right) => right.score - left.score)
    .slice(0, limit)
    .map(({ item, score }) => ({
      id: item.id, score, title: item.title, topic: item.topic,
      pattern: item.pattern, difficulty: item.difficulty,
      prompt: item.prompt, keywords: item.keywords,
    }));
}

export function formatKnowledgeContext(items: ReturnType<typeof retrieveKnowledge>) {
  if (!items.length) return "No closely matching problem was found in the local knowledge base.";
  return items.map((item) =>
    `- ${item.title} | Topic: ${item.topic} | Pattern: ${item.pattern} | Difficulty: ${item.difficulty}\n  Problem: ${item.prompt}\n  Keywords: ${item.keywords.join(", ")}`,
  ).join("\n");
}