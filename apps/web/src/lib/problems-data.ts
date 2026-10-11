import { DSA_150_PROBLEMS } from "./dsa-150-database";
import { BASIC_PRACTICE_PROBLEMS } from "./basic-problems-database";

export interface TestCase {
  input: string; // raw display string
  output: string; // expected output string
  args: any[]; // parsed arguments for direct execution
  expected: any; // parsed expected return value
}

export interface ProblemDefinition {
  id: string;
  slug: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  topics: { name: string }[];
  description: string;
  constraints: string[];
  methodName: string;
  supportedLanguages: ("javascript" | "python" | "cpp" | "java")[];
  starterCode: {
    javascript: string;
    python: string;
    cpp: string;
    java: string;
  };
  publicTestCases: TestCase[];
  hiddenTestCases: TestCase[];
}

export const PROBLEMS_DATABASE: Record<string, ProblemDefinition> = {
  ...BASIC_PRACTICE_PROBLEMS,
  ...DSA_150_PROBLEMS,
};

const CUSTOM_PROBLEMS_KEY = "customProblems";
const QUESTION_ORDER_KEY = "codearena_custom_question_order";
const DELETED_PROBLEMS_KEY = "codearena_deleted_problem_slugs";

export function getDeletedProblemSlugs(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(DELETED_PROBLEMS_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr);
    }
  } catch (e) {
    console.error("Failed to read deleted problem slugs:", e);
  }
  return new Set();
}

export function restoreAllProblems(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(DELETED_PROBLEMS_KEY);
    resetQuestionOrder();
    fetch("/api/admin/questions?restoreAll=true", { method: "DELETE" }).catch(() => {});
    window.dispatchEvent(new CustomEvent("codearena_problems_updated", { detail: { restoredAll: true } }));
  } catch (e) {
    console.error("Failed to restore all problems:", e);
  }
}

let isSyncingProblems = false;

export async function syncProblemsWithServer(): Promise<ProblemDefinition[]> {
  if (typeof window === "undefined" || isSyncingProblems) return getAllProblems();
  isSyncingProblems = true;
  try {
    const res = await fetch("/api/admin/questions", { cache: "no-store" });
    const json = await res.json().catch(() => null);
    let changed = false;

    // 1. Sync custom problems
    if (json?.success && Array.isArray(json?.customItems)) {
      const current = getCustomProblems();
      for (const p of json.customItems) {
        if (!p.slug) continue;
        if (!current[p.slug] || JSON.stringify(current[p.slug]) !== JSON.stringify(p)) {
          current[p.slug] = p;
          changed = true;
        }
      }
      if (changed) {
        localStorage.setItem(CUSTOM_PROBLEMS_KEY, JSON.stringify(current));
      }
    }

    // 2. Sync deleted slugs from server
    if (json?.success && Array.isArray(json?.deletedSlugs)) {
      const deleted = getDeletedProblemSlugs();
      let delChanged = false;
      for (const s of json.deletedSlugs) {
        if (!deleted.has(s)) {
          deleted.add(s);
          delChanged = true;
        }
      }
      if (delChanged) {
        localStorage.setItem(DELETED_PROBLEMS_KEY, JSON.stringify(Array.from(deleted)));
        changed = true;
      }
    }

    if (changed) {
      window.dispatchEvent(new CustomEvent("codearena_problems_updated", { detail: { synced: true } }));
    }
  } catch (err) {
    console.warn("Problem background sync:", err);
  } finally {
    isSyncingProblems = false;
  }
  return getAllProblems();
}

export function getCustomProblems(): Record<string, ProblemDefinition> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(CUSTOM_PROBLEMS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "object" && parsed !== null) return parsed;
    }
  } catch (e) {
    console.error("Failed to read customProblems:", e);
  }
  return {};
}

export function saveCustomProblem(problem: ProblemDefinition): void {
  if (typeof window === "undefined") return;
  try {
    const current = getCustomProblems();
    current[problem.slug] = problem;
    localStorage.setItem(CUSTOM_PROBLEMS_KEY, JSON.stringify(current));

    // If it was previously marked deleted, un-delete it
    const deleted = getDeletedProblemSlugs();
    if (deleted.has(problem.slug)) {
      deleted.delete(problem.slug);
      localStorage.setItem(DELETED_PROBLEMS_KEY, JSON.stringify(Array.from(deleted)));
    }

    window.dispatchEvent(new CustomEvent("codearena_problems_updated", { detail: problem }));
  } catch (e) {
    console.error("Failed to save custom problem:", e);
  }
}

export function deleteCustomProblem(slug: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const normSlug = slug.toLowerCase().trim().replace(/_/g, "-");

    // 1. Delete from custom problems if present
    const current = getCustomProblems();
    if (current[normSlug] || current[slug]) {
      delete current[normSlug];
      delete current[slug];
      localStorage.setItem(CUSTOM_PROBLEMS_KEY, JSON.stringify(current));
    }

    // 2. Add to deleted slugs set so even built-in questions can be deleted by Admin
    const deleted = getDeletedProblemSlugs();
    deleted.add(normSlug);
    deleted.add(slug);
    localStorage.setItem(DELETED_PROBLEMS_KEY, JSON.stringify(Array.from(deleted)));

    // 3. Remove from custom question order if present
    const order = getQuestionOrder();
    if (order) {
      saveQuestionOrder(order.filter(s => s !== slug && s !== normSlug));
    }

    window.dispatchEvent(new CustomEvent("codearena_problems_updated", { detail: { slug, deleted: true } }));
    return true;
  } catch (e) {
    console.error("Failed to delete problem:", e);
  }
  return false;
}

export function getQuestionOrder(): string[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(QUESTION_ORDER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Failed to read question order:", e);
    return null;
  }
}

export function saveQuestionOrder(slugs: string[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(QUESTION_ORDER_KEY, JSON.stringify(slugs));
    window.dispatchEvent(new CustomEvent("codearena_problems_updated", { detail: { reordered: true, slugs } }));
  } catch (e) {
    console.error("Failed to save question order:", e);
  }
}

export function resetQuestionOrder(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(QUESTION_ORDER_KEY);
    localStorage.removeItem(DELETED_PROBLEMS_KEY);
    window.dispatchEvent(new CustomEvent("codearena_problems_updated", { detail: { resetOrder: true } }));
  } catch (e) {
    console.error("Failed to reset question order:", e);
  }
}

export function getProblem(slug: string): ProblemDefinition | null {
  if (!slug) return null;
  const normSlug = slug.toLowerCase().trim().replace(/_/g, "-");

  const deleted = getDeletedProblemSlugs();
  if (deleted.has(normSlug) || deleted.has(slug)) {
    return null;
  }

  // Check custom problems first
  const custom = getCustomProblems();
  if (custom[normSlug]) {
    return custom[normSlug];
  }
  if (custom[slug]) {
    return custom[slug];
  }

  // Check alias for bar entry
  if (normSlug === "check-bar-entry-status" || normSlug === "check-bar-entry" || normSlug === "bar-entry") {
    return BASIC_PRACTICE_PROBLEMS["check-bar-entry-status"];
  }

  return PROBLEMS_DATABASE[normSlug] || PROBLEMS_DATABASE[slug] || null;
}

const BASIC_SLUGS_ORDER = [
  "check-bar-entry-status",
  "area-of-square",
  "area-of-triangle",
  "area-of-circle",
  "area-of-rectangle",
  "even-or-odd",
  "max-of-two-numbers",
  "check-voting-eligibility",
  "grade-calculator",
  "check-number-sign"
];

export function getAllProblems(): ProblemDefinition[] {
  const basic = Object.values(BASIC_PRACTICE_PROBLEMS);
  const dsa = Object.values(DSA_150_PROBLEMS);
  const custom = Object.values(getCustomProblems());
  const map = new Map<string, ProblemDefinition>();
  const deleted = getDeletedProblemSlugs();

  // 1. Insert basic problems first (EASY)
  for (const p of basic) {
    if (p.slug === "check-bar-entry") continue;
    if (deleted.has(p.slug)) continue;
    map.set(p.slug, p);
  }

  // 2. Insert DSA 150 problems
  for (const p of dsa) {
    if (deleted.has(p.slug)) continue;
    if (!map.has(p.slug)) {
      map.set(p.slug, p);
    }
  }

  // 3. Insert / override with custom problems
  for (const p of custom) {
    if (p.slug === "check-bar-entry") continue;
    if (deleted.has(p.slug)) continue;
    map.set(p.slug, p);
  }

  const allList = Array.from(map.values());
  const customOrder = getQuestionOrder();

  const diffScore: Record<string, number> = { EASY: 1, MEDIUM: 2, HARD: 3 };

  const getSubOrder = (prob: ProblemDefinition, orderMap: Map<string, number> | null): number => {
    // If it's one of the basic beginner problems, order them first in Easy
    const basicIdx = BASIC_SLUGS_ORDER.indexOf(prob.slug);
    if (basicIdx !== -1) {
      return basicIdx - 1000;
    }
    if (orderMap && orderMap.has(prob.slug)) {
      return orderMap.get(prob.slug)!;
    }
    return 500;
  };

  const orderMap = customOrder && Array.isArray(customOrder) && customOrder.length > 0
    ? new Map<string, number>(customOrder.map((slug, idx) => [slug, idx]))
    : null;

  return [...allList].sort((a, b) => {
    // If an explicit custom order was established by Admin, prioritize it
    if (orderMap) {
      const idxA = orderMap.has(a.slug) ? orderMap.get(a.slug)! : 9999;
      const idxB = orderMap.has(b.slug) ? orderMap.get(b.slug)! : 9999;
      if (idxA !== idxB) {
        return idxA - idxB;
      }
    }

    const diffA = diffScore[a.difficulty] || 2;
    const diffB = diffScore[b.difficulty] || 2;

    // Default Primary Sort: Difficulty (EASY -> MEDIUM -> HARD)
    if (diffA !== diffB) {
      return diffA - diffB;
    }

    // Secondary Sort within same difficulty (Basic beginner problems first)
    const basicA = BASIC_SLUGS_ORDER.indexOf(a.slug);
    const basicB = BASIC_SLUGS_ORDER.indexOf(b.slug);
    if (basicA !== -1 || basicB !== -1) {
      const scoreA = basicA !== -1 ? basicA : 999;
      const scoreB = basicB !== -1 ? basicB : 999;
      if (scoreA !== scoreB) return scoreA - scoreB;
    }

    return a.title.localeCompare(b.title);
  });
}


