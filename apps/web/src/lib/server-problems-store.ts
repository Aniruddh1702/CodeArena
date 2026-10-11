import fs from "fs";
import path from "path";
import os from "os";
import { ProblemDefinition } from "./problems-data";

const FILE_PATH = path.join(os.tmpdir(), "codearena_custom_problems.json");

export function getServerCustomProblems(): Record<string, ProblemDefinition> {
  try {
    if (fs.existsSync(FILE_PATH)) {
      const data = fs.readFileSync(FILE_PATH, "utf-8");
      const parsed = JSON.parse(data);
      if (typeof parsed === "object" && parsed !== null) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading server custom problems:", e);
  }
  return {};
}

export function saveCustomProblemServer(problem: ProblemDefinition): void {
  try {
    const current = getServerCustomProblems();
    current[problem.slug] = problem;
    fs.writeFileSync(FILE_PATH, JSON.stringify(current, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving server custom problem:", e);
  }
}
