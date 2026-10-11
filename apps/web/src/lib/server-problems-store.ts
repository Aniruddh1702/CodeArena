import fs from "fs";
import path from "path";
import { ProblemDefinition } from "./problems-data";

const FILE_PATH = path.join(process.cwd(), ".data_custom_problems.json");

interface ServerProblemStoreData {
  problems: Record<string, ProblemDefinition>;
  deletedSlugs: string[];
}

function readStore(): ServerProblemStoreData {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const data = fs.readFileSync(FILE_PATH, "utf-8");
      const parsed = JSON.parse(data);
      if (typeof parsed === "object" && parsed !== null) {
        // Support legacy flat format
        if (!parsed.problems && !parsed.deletedSlugs) {
          return { problems: parsed, deletedSlugs: [] };
        }
        return {
          problems: parsed.problems || {},
          deletedSlugs: Array.isArray(parsed.deletedSlugs) ? parsed.deletedSlugs : [],
        };
      }
    }
  } catch (e) {
    console.error("Error reading server custom problems:", e);
  }
  return { problems: {}, deletedSlugs: [] };
}

function writeStore(store: ServerProblemStoreData): void {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(store, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing server custom problems:", e);
  }
}

export function getServerCustomProblems(): Record<string, ProblemDefinition> {
  return readStore().problems;
}

export function getServerDeletedProblemSlugs(): string[] {
  return readStore().deletedSlugs;
}

export function saveCustomProblemServer(problem: ProblemDefinition): void {
  try {
    const store = readStore();
    store.problems[problem.slug] = problem;
    const normSlug = problem.slug.toLowerCase().trim().replace(/_/g, "-");
    store.deletedSlugs = store.deletedSlugs.filter((s) => s !== problem.slug && s !== normSlug);
    writeStore(store);
  } catch (e) {
    console.error("Error saving server custom problem:", e);
  }
}

export function deleteCustomProblemServer(slug: string): boolean {
  try {
    const store = readStore();
    const normSlug = slug.toLowerCase().trim().replace(/_/g, "-");
    if (store.problems[slug]) delete store.problems[slug];
    if (store.problems[normSlug]) delete store.problems[normSlug];
    if (!store.deletedSlugs.includes(normSlug)) store.deletedSlugs.push(normSlug);
    if (!store.deletedSlugs.includes(slug)) store.deletedSlugs.push(slug);
    writeStore(store);
    return true;
  } catch (e) {
    console.error("Error deleting server custom problem:", e);
  }
  return false;
}

export function restoreAllServerProblems(): boolean {
  try {
    const store = readStore();
    store.deletedSlugs = [];
    writeStore(store);
    return true;
  } catch (e) {
    console.error("Error restoring server problems:", e);
  }
  return false;
}

export function clearAllCustomProblemsServer(): boolean {
  try {
    writeStore({ problems: {}, deletedSlugs: [] });
    return true;
  } catch (e) {
    console.error("Error clearing server custom problems:", e);
  }
  return false;
}
