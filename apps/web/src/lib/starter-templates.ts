import type { ProblemDefinition, TestCase } from "./problems-data";

export type { ProblemDefinition, TestCase };

export type SupportedLanguage = "javascript" | "python" | "cpp" | "java";

interface TypeInfo {
  cpp: string;
  java: string;
  py: string;
  js: string;
}

/**
 * Infer strongly-typed language representations from runtime values / test cases.
 */
function inferType(val: any, isParam = false): TypeInfo {
  if (val === null || val === undefined) {
    return {
      cpp: isParam ? "auto" : "void",
      java: isParam ? "Object" : "void",
      py: isParam ? "Any" : "None",
      js: "any",
    };
  }

  if (typeof val === "boolean") {
    return { cpp: "bool", java: "boolean", py: "bool", js: "boolean" };
  }

  if (typeof val === "number") {
    if (Number.isInteger(val)) {
      return { cpp: "int", java: "int", py: "int", js: "number" };
    }
    return { cpp: "double", java: "double", py: "float", js: "number" };
  }

  if (typeof val === "string") {
    if (val.length === 1 && !isParam) {
      return { cpp: "char", java: "char", py: "str", js: "string" };
    }
    return {
      cpp: isParam ? "string&" : "string",
      java: "String",
      py: "str",
      js: "string",
    };
  }

  if (Array.isArray(val)) {
    if (val.length === 0) {
      return {
        cpp: isParam ? "vector<int>&" : "vector<int>",
        java: "int[]",
        py: "List[int]",
        js: "number[]",
      };
    }

    const first = val[0];

    if (typeof first === "number") {
      if (Number.isInteger(first)) {
        return {
          cpp: isParam ? "vector<int>&" : "vector<int>",
          java: "int[]",
          py: "List[int]",
          js: "number[]",
        };
      }
      return {
        cpp: isParam ? "vector<double>&" : "vector<double>",
        java: "double[]",
        py: "List[float]",
        js: "number[]",
      };
    }

    if (typeof first === "boolean") {
      return {
        cpp: isParam ? "vector<bool>&" : "vector<bool>",
        java: "boolean[]",
        py: "List[bool]",
        js: "boolean[]",
      };
    }

    if (typeof first === "string") {
      if (first.length === 1 && val.every((s) => typeof s === "string" && s.length <= 1)) {
        return {
          cpp: isParam ? "vector<char>&" : "vector<char>",
          java: "char[]",
          py: "List[str]",
          js: "string[]",
        };
      }
      return {
        cpp: isParam ? "vector<string>&" : "vector<string>",
        java: "String[]",
        py: "List[str]",
        js: "string[]",
      };
    }

    if (Array.isArray(first)) {
      if (first.length > 0 && typeof first[0] === "string" && first[0].length === 1) {
        return {
          cpp: isParam ? "vector<vector<char>>&" : "vector<vector<char>>",
          java: "char[][]",
          py: "List[List[str]]",
          js: "string[][]",
        };
      }
      return {
        cpp: isParam ? "vector<vector<int>>&" : "vector<vector<int>>",
        java: "int[][]",
        py: "List[List[int]]",
        js: "number[][]",
      };
    }
  }

  return { cpp: "int", java: "int", py: "int", js: "number" };
}

/**
 * Extract parameter names from existing starterCode or sample testcase input string.
 */
function extractParameterNames(problem: ProblemDefinition, sampleTc?: TestCase): string[] {
  // 1. Try JavaScript starterCode
  const js = problem.starterCode?.javascript;
  if (js) {
    const fnMatch = js.match(/(?:function\s*\(([^)]*)\)|var\s+[a-zA-Z0-9_$]+\s*=\s*function\s*\(([^)]*)\))/);
    const raw = fnMatch ? fnMatch[1] || fnMatch[2] : "";
    if (raw) {
      const parts = raw.split(",").map((s) => s.trim().replace(/^[\.\s]+/, "")).filter(Boolean);
      if (parts.length > 0) return parts;
    }
  }

  // 2. Try Python starterCode
  const py = problem.starterCode?.python;
  if (py) {
    const pyMatch = py.match(/def\s+[a-zA-Z0-9_]+\s*\(([^)]*)\)/);
    if (pyMatch && pyMatch[1]) {
      const parts = pyMatch[1]
        .split(",")
        .map((p) => p.trim().split(":")[0].trim())
        .filter((p) => p && p !== "self");
      if (parts.length > 0) return parts;
    }
  }

  // 3. Try parsing from input string (e.g. "nums = [2,7,11,15], target = 9")
  if (sampleTc?.input) {
    const matches = Array.from(sampleTc.input.matchAll(/([a-zA-Z0-9_$]+)\s*=/g)).map((m) => m[1]);
    if (matches.length > 0) return matches;
  }

  // 4. Fallback based on argument count
  const argCount = sampleTc?.args?.length || 1;
  if (argCount === 1) return ["input"];
  return Array.from({ length: argCount }, (_, i) => `arg${i + 1}`);
}

/**
 * Check if a code snippet is a placeholder stub, empty, or missing the function signature.
 */
export function isStarterCodeStubOrEmpty(code: string | undefined | null, language: SupportedLanguage): boolean {
  if (!code) return true;
  const trimmed = code.trim();
  if (trimmed.length === 0) return true;

  // Generic comments with no code
  if (/^\/\/\s*(?:Implement|Write your code here|Your solution)/i.test(trimmed) && !trimmed.includes("{")) {
    return true;
  }
  if (/^\/\/\s*Write your code here in/i.test(trimmed)) {
    return true;
  }

  // In C++: detect empty Solution class with just a comment
  if (language === "cpp") {
    // e.g. class Solution { public: // Implement twoSum };
    if (/class\s+Solution\s*\{[\s\S]*?\/\/\s*Implement[\s\S]*?\};?$/i.test(trimmed)) {
      // Check if there is an actual function signature inside
      const hasFunction = /(?:int|bool|void|double|string|vector|auto)\s+[a-zA-Z0-9_]+\s*\(/i.test(trimmed);
      if (!hasFunction) return true;
    }
  }

  // In Java: detect empty Solution class with just a comment
  if (language === "java") {
    if (/class\s+Solution\s*\{[\s\S]*?\/\/\s*Implement[\s\S]*?\}?$/i.test(trimmed)) {
      const hasFunction = /(?:public|protected|private|static)?\s+(?:int|boolean|void|double|String|int\[\]|Object)\s+[a-zA-Z0-9_]+\s*\(/i.test(trimmed);
      if (!hasFunction) return true;
    }
  }

  // In Python: detect empty Solution with no def
  if (language === "python") {
    if (!trimmed.includes("def ")) return true;
  }

  // In JS: detect lack of function
  if (language === "javascript") {
    if (!trimmed.includes("function") && !trimmed.includes("=>")) return true;
  }

  return false;
}

/**
 * Generates an idiomatic, clean starter code template for a given problem and language.
 */
export function generateLanguageStarterCode(problem: ProblemDefinition, language: SupportedLanguage): string {
  const method = problem.methodName || "solution";
  const sampleTc: TestCase | undefined =
    problem.publicTestCases?.[0] || problem.hiddenTestCases?.[0];

  const args = sampleTc?.args || [];
  let paramNames = extractParameterNames(problem, sampleTc);
  if (args.length > 0) {
    if (paramNames.length > args.length) {
      paramNames = paramNames.slice(0, args.length);
    } else if (paramNames.length < args.length) {
      for (let i = paramNames.length; i < args.length; i++) {
        paramNames.push(`arg${i + 1}`);
      }
    }
  }
  const expected = sampleTc?.expected;

  const returnType = inferType(expected, false);

  if (language === "javascript") {
    const jsDocParams = paramNames
      .map((name, i) => ` * @param {${inferType(args[i], true).js}} ${name}`)
      .join("\n");
    return `/**
${jsDocParams}
 * @return {${returnType.js}}
 */
var ${method} = function(${paramNames.join(", ")}) {
    // Write your code here
    
};`;
  }

  if (language === "python") {
    const pyParams = paramNames
      .map((name, i) => `${name}: ${inferType(args[i], true).py}`)
      .join(", ");
    const pyReturn = returnType.py;
    return `class Solution:
    def ${method}(self, ${pyParams}) -> ${pyReturn}:
        # Write your code here
        pass`;
  }

  if (language === "cpp") {
    const cppParams = paramNames
      .map((name, i) => `${inferType(args[i], true).cpp} ${name}`)
      .join(", ");
    const cppReturn = returnType.cpp;
    return `#include <vector>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <algorithm>
using namespace std;

class Solution {
public:
    ${cppReturn} ${method}(${cppParams}) {
        // Write your code here
        
    }
};`;
  }

  if (language === "java") {
    const javaParams = paramNames
      .map((name, i) => `${inferType(args[i], true).java} ${name}`)
      .join(", ");
    const javaReturn = returnType.java;
    return `import java.util.*;

class Solution {
    public ${javaReturn} ${method}(${javaParams}) {
        // Write your code here
        
    }
}`;
  }

  return "";
}

/**
 * Returns a guaranteed valid, non-stub starter code template for a problem and language.
 */
export function getStarterCode(problem: ProblemDefinition, language: SupportedLanguage): string {
  if (!problem) return "";
  const existing = problem.starterCode?.[language];

  if (!isStarterCodeStubOrEmpty(existing, language)) {
    return existing!;
  }

  return generateLanguageStarterCode(problem, language);
}

/**
 * Normalizes a problem definition so that starterCode is 100% complete for all 4 languages.
 */
export function ensureProblemStarterCode(problem: ProblemDefinition): ProblemDefinition {
  if (!problem) return problem;

  const starterCode = {
    javascript: getStarterCode(problem, "javascript"),
    python: getStarterCode(problem, "python"),
    cpp: getStarterCode(problem, "cpp"),
    java: getStarterCode(problem, "java"),
  };

  return {
    ...problem,
    starterCode,
  };
}
