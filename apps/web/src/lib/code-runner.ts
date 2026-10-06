import { TestCase, ProblemDefinition } from "./problems-data";

export interface TestResult {
  caseIndex: number;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  stdout: string;
  error?: string;
  diffExplanation?: string;
  runtimeMs?: number;
}

export interface ExecutionSummary {
  status: "Accepted" | "Wrong Answer" | "Runtime Error" | "Compilation Error" | "Time Limit Exceeded";
  statusColor: string;
  runtime: string;
  memory: string;
  totalTestCases: number;
  passedTestCases: number;
  failedTestCaseIndex: number;
  testResults: TestResult[];
  errorDetails?: string;
  errorLine?: number;
  errorType?: string;
}

// Deep equality check between actual and expected results
export function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;

  if (typeof a === "number" && typeof b === "number") {
    // Handle floating point tolerances
    return Math.abs(a - b) < 1e-5;
  }

  if (a === null || b === null || typeof a !== "object" || typeof b !== "object") {
    return false;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (const key of keysA) {
    if (!keysB.includes(key) || !deepEqual(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

// Formatter for values to LeetCode-style display
export function formatValue(val: any): string {
  if (val === undefined) return "undefined";
  if (val === null) return "null";
  if (typeof val === "boolean") return val ? "true" : "false";
  if (typeof val === "number") return val.toString();
  if (typeof val === "string") return `"${val}"`;
  try {
    return JSON.stringify(val);
  } catch {
    return String(val);
  }
}

// Generate realistic mismatch explanation and diff
export function explainMismatch(expected: any, actual: any, inputStr?: string): { errorMsg: string; diffExplanation: string } {
  if (actual === undefined) {
    return {
      errorMsg: `TypeError [ERR_NO_RETURN]: Function returned undefined. Expected: ${formatValue(expected)}`,
      diffExplanation: `Function returned undefined. No value was returned. Ensure your solution has an explicit 'return' statement in all execution paths.`
    };
  }

  if (actual === null && expected !== null) {
    return {
      errorMsg: `AssertionError [ERR_ASSERTION]: Expected ${formatValue(expected)}, but received null`,
      diffExplanation: `Received null instead of expected value: ${formatValue(expected)}.`
    };
  }

  const expFormatted = formatValue(expected);
  const actFormatted = formatValue(actual);

  // Array comparison
  if (Array.isArray(expected) && Array.isArray(actual)) {
    if (expected.length !== actual.length) {
      return {
        errorMsg: `AssertionError [ERR_ASSERTION]: Array length mismatch. Expected length ${expected.length}, but received length ${actual.length}`,
        diffExplanation: `Expected array of length ${expected.length} (${expFormatted}), but received array of length ${actual.length} (${actFormatted}).`
      };
    }
    for (let i = 0; i < expected.length; i++) {
      if (!deepEqual(expected[i], actual[i])) {
        return {
          errorMsg: `AssertionError [ERR_ASSERTION]: Values differ at index ${i}. Expected ${formatValue(expected[i])}, but received ${formatValue(actual[i])}`,
          diffExplanation: `At index [${i}]: expected ${formatValue(expected[i])}, but received ${formatValue(actual[i])}.\nExpected: ${expFormatted}\nReceived: ${actFormatted}`
        };
      }
    }
  }

  // Type mismatch
  if (typeof expected !== typeof actual) {
    return {
      errorMsg: `AssertionError [ERR_ASSERTION]: Type mismatch. Expected type '${typeof expected}', but received '${typeof actual}' (${actFormatted})`,
      diffExplanation: `Expected output of type '${typeof expected}', but received '${typeof actual}'.\nExpected: ${expFormatted}\nReceived: ${actFormatted}`
    };
  }

  return {
    errorMsg: `AssertionError [ERR_ASSERTION]: Expected ${expFormatted}, but received ${actFormatted}`,
    diffExplanation: `Output does not match expected result.\nExpected: ${expFormatted}\nReceived: ${actFormatted}`
  };
}

// Extract exact line number from JS error stack
function extractJsErrorLine(err: any, userCode: string): number | undefined {
  if (!err) return undefined;

  const stack = err.stack || "";
  const totalUserLines = userCode.split("\n").length;

  const anonMatch = stack.match(/<anonymous>:(\d+):(\d+)/);
  if (anonMatch) {
    const anonLine = parseInt(anonMatch[1], 10);
    const userLine = anonLine - 3;
    if (userLine >= 1 && userLine <= totalUserLines) {
      return userLine;
    }
  }

  const lineMatch = stack.match(/line\s+(\d+)/i) || (err.message && err.message.match(/line\s+(\d+)/i));
  if (lineMatch) {
    const lineNum = parseInt(lineMatch[1], 10);
    if (lineNum >= 1 && lineNum <= totalUserLines) {
      return lineNum;
    }
  }

  return undefined;
}

// Locate relevant code line for user guidance
function findRelevantCodeLine(userCode: string, methodName: string): number {
  const lines = userCode.split("\n");
  for (let i = lines.length - 1; i >= 0; i--) {
    if (/\breturn\b/.test(lines[i])) {
      return i + 1;
    }
  }
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(methodName) || lines[i].includes("function") || lines[i].includes("class")) {
      return i + 1;
    }
  }
  return 1;
}

// Client-side JavaScript Evaluation Engine
export function evaluateJavaScript(
  code: string,
  problem: ProblemDefinition,
  testCases: TestCase[]
): ExecutionSummary {
  const startTime = performance.now();
  const testResults: TestResult[] = [];
  let passedCount = 0;
  let firstFailIndex = -1;
  let globalStatus: ExecutionSummary["status"] = "Accepted";
  let globalErrorDetails: string | undefined;
  let globalErrorLine: number | undefined;
  let globalErrorType: string | undefined;

  // Intercept console.log
  const capturedLogs: string[] = [];
  const customConsole = {
    log: (...args: any[]) => {
      capturedLogs.push(args.map(formatValue).join(" "));
    },
    error: (...args: any[]) => {
      capturedLogs.push("[error] " + args.map(formatValue).join(" "));
    },
    warn: (...args: any[]) => {
      capturedLogs.push("[warn] " + args.map(formatValue).join(" "));
    }
  };

  // Compile user code in a function constructor sandbox
  let userFn: any;
  try {
    const wrappedCode = `
      "use strict";
      ${code}
      if (typeof ${problem.methodName} === 'function') {
        return ${problem.methodName};
      }
      if (typeof Solution !== 'undefined' && typeof (new Solution())[ '${problem.methodName}' ] === 'function') {
        const sol = new Solution();
        return sol[ '${problem.methodName}' ].bind(sol);
      }
      throw new Error("Function '${problem.methodName}' not found. Please do not change the function name.");
    `;

    const factory = new Function("console", wrappedCode);
    userFn = factory(customConsole);
  } catch (err: any) {
    const isSyntax = err.name === "SyntaxError";
    const errLine = extractJsErrorLine(err, code) || 1;
    const formattedError = `${err.name}: ${err.message}${errLine ? ` (at line ${errLine})` : ""}`;
    return {
      status: isSyntax ? "Compilation Error" : "Runtime Error",
      statusColor: isSyntax ? "text-red-500" : "text-amber-500",
      runtime: "0ms",
      memory: "38.2MB",
      totalTestCases: testCases.length,
      passedTestCases: 0,
      failedTestCaseIndex: 0,
      testResults: testCases.map((tc, idx) => ({
        caseIndex: idx,
        passed: false,
        input: tc.input,
        expectedOutput: tc.output,
        actualOutput: "",
        stdout: "",
        error: formattedError
      })),
      errorDetails: `${err.name}: ${err.message}\nLine ${errLine}: check syntax, parentheses, braces, or missing variable declarations.`,
      errorLine: errLine,
      errorType: err.name
    };
  }

  // Execute each test case
  for (let i = 0; i < testCases.length; i++) {
    const tc = testCases[i];
    capturedLogs.length = 0;
    const caseStartTime = performance.now();

    try {
      // Deep clone arguments so user modifications don't leak between cases
      const clonedArgs = JSON.parse(JSON.stringify(tc.args));
      
      const result = userFn(...clonedArgs);
      const caseElapsed = Math.round(performance.now() - caseStartTime);

      // Compare actual vs expected
      let isCorrect = deepEqual(result, tc.expected);
      if (!isCorrect && problem.slug === "two-sum" && Array.isArray(result) && Array.isArray(tc.expected)) {
        if (result.length === 2 && tc.expected.length === 2) {
          isCorrect = (result[0] === tc.expected[1] && result[1] === tc.expected[0]);
        }
      }

      const formattedActual = formatValue(result);

      if (isCorrect) {
        passedCount++;
        testResults.push({
          caseIndex: i,
          passed: true,
          input: tc.input,
          expectedOutput: tc.output,
          actualOutput: formattedActual,
          stdout: capturedLogs.join("\n"),
          runtimeMs: caseElapsed
        });
      } else {
        const mismatch = explainMismatch(tc.expected, result, tc.input);
        const errorLineCandidate = findRelevantCodeLine(code, problem.methodName);

        if (firstFailIndex === -1) {
          firstFailIndex = i;
          globalStatus = "Wrong Answer";
          globalErrorType = result === undefined ? "TypeError [ERR_NO_RETURN]" : "AssertionError [ERR_ASSERTION]";
          globalErrorLine = errorLineCandidate;
          globalErrorDetails = `${mismatch.errorMsg}\n\nInput:    ${tc.input}\nExpected: ${tc.output}\nReceived: ${formattedActual}\n\n${mismatch.diffExplanation}`;
        }
        testResults.push({
          caseIndex: i,
          passed: false,
          input: tc.input,
          expectedOutput: tc.output,
          actualOutput: formattedActual,
          stdout: capturedLogs.join("\n"),
          error: mismatch.errorMsg,
          diffExplanation: mismatch.diffExplanation,
          runtimeMs: caseElapsed
        });
      }
    } catch (err: any) {
      const errLine = extractJsErrorLine(err, code) || findRelevantCodeLine(code, problem.methodName);
      const errMsg = `${err.name}: ${err.message}`;

      if (firstFailIndex === -1) {
        firstFailIndex = i;
        globalStatus = "Runtime Error";
        globalErrorType = err.name;
        globalErrorLine = errLine;
        globalErrorDetails = `Runtime Error [${err.name}]: ${err.message}\nOccurred on Test Case ${i + 1}\nInput: ${tc.input}\nLine ${errLine}: ${err.message}`;
      }
      testResults.push({
        caseIndex: i,
        passed: false,
        input: tc.input,
        expectedOutput: tc.output,
        actualOutput: "",
        stdout: capturedLogs.join("\n"),
        error: errMsg,
        diffExplanation: `Runtime exception thrown during execution: ${errMsg} (Line ${errLine})`,
        runtimeMs: Math.round(performance.now() - caseStartTime)
      });
    }
  }

  const totalElapsed = Math.max(1, Math.round(performance.now() - startTime));

  const statusColorMap = {
    "Accepted": "text-green-500",
    "Wrong Answer": "text-rose-500",
    "Runtime Error": "text-amber-500",
    "Compilation Error": "text-red-500",
    "Time Limit Exceeded": "text-orange-500"
  };

  return {
    status: globalStatus,
    statusColor: statusColorMap[globalStatus],
    runtime: `${totalElapsed}ms`,
    memory: `${(Math.random() * 5 + 38).toFixed(1)}MB`,
    totalTestCases: testCases.length,
    passedTestCases: passedCount,
    failedTestCaseIndex: firstFailIndex === -1 ? 0 : firstFailIndex,
    testResults,
    errorDetails: globalErrorDetails,
    errorLine: globalErrorLine,
    errorType: globalErrorType
  };
}
