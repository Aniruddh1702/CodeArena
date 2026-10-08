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
    window.dispatchEvent(new CustomEvent("codearena_problems_updated", { detail: problem }));
  } catch (e) {
    console.error("Failed to save custom problem:", e);
  }
}

export function deleteCustomProblem(slug: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    const current = getCustomProblems();
    if (current[slug]) {
      delete current[slug];
      localStorage.setItem(CUSTOM_PROBLEMS_KEY, JSON.stringify(current));
      
      // Also remove from custom question order if present
      const order = getQuestionOrder();
      if (order) {
        saveQuestionOrder(order.filter(s => s !== slug));
      }

      window.dispatchEvent(new CustomEvent("codearena_problems_updated", { detail: { slug, deleted: true } }));
      return true;
    }
  } catch (e) {
    console.error("Failed to delete custom problem:", e);
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
    window.dispatchEvent(new CustomEvent("codearena_problems_updated", { detail: { resetOrder: true } }));
  } catch (e) {
    console.error("Failed to reset question order:", e);
  }
}

export function getProblem(slug: string): ProblemDefinition | null {
  if (!slug) return null;
  const normSlug = slug.toLowerCase().trim().replace(/_/g, "-");
  
  // Check custom problems first
  const custom = getCustomProblems();
  if (custom[normSlug]) {
    const custProb = custom[normSlug];
    // If the custom problem has valid testcases, return it
    if (Array.isArray(custProb.publicTestCases) && custProb.publicTestCases.length > 0) {
      return custProb;
    }
  }

  // Check alias for bar entry
  if (normSlug === "check-bar-entry-status" || normSlug === "check-bar-entry" || normSlug === "bar-entry") {
    return BASIC_PRACTICE_PROBLEMS["check-bar-entry-status"];
  }

  return PROBLEMS_DATABASE[normSlug] || PROBLEMS_DATABASE[slug] || null;
}

export function getAllProblems(): ProblemDefinition[] {
  const builtIn = Object.values(PROBLEMS_DATABASE);
  const custom = Object.values(getCustomProblems());
  const map = new Map<string, ProblemDefinition>();

  for (const p of builtIn) {
    // Skip duplicate alias from listing
    if (p.slug === "check-bar-entry") continue;
    map.set(p.slug, p);
  }
  for (const p of custom) {
    if (p.slug === "check-bar-entry") continue;
    map.set(p.slug, p);
  }

  const allList = Array.from(map.values());
  const customOrder = getQuestionOrder();

  if (customOrder && Array.isArray(customOrder) && customOrder.length > 0) {
    const orderMap = new Map<string, number>();
    customOrder.forEach((slug, idx) => orderMap.set(slug, idx));

    return [...allList].sort((a, b) => {
      const idxA = orderMap.has(a.slug) ? orderMap.get(a.slug)! : 9999;
      const idxB = orderMap.has(b.slug) ? orderMap.get(b.slug)! : 9999;
      if (idxA !== idxB) return idxA - idxB;

      // Fallback to standard difficulty tiering
      const diffScore: Record<string, number> = { EASY: 1, MEDIUM: 2, HARD: 3 };
      return (diffScore[a.difficulty] || 2) - (diffScore[b.difficulty] || 2);
    });
  }

  // Default clean order
  return allList;
}

