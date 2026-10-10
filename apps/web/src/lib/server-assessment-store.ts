import fs from "fs";
import path from "path";

export interface AssessmentStudentResult {
  id: string;
  testId: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  score: number; // 0-100
  timeTaken: string; // e.g. "45m"
  timeTakenMinutes: number;
  status: "Evaluated" | "Submitted" | "Disqualified (Proctoring)";
  submittedAt: string;
  language?: string;
  code?: string;
  passedTestCases?: number;
  totalTestCases?: number;
}

export interface AssessmentQuestion {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
}

export interface AssessmentTest {
  id: string;
  title: string;
  type: "EXAM" | "COMPETITION" | "PRACTICE";
  status: "ACTIVE" | "SCHEDULED" | "COMPLETED";
  durationMinutes: number;
  batchesAssigned: number;
  questionCount: number;
  questions: AssessmentQuestion[];
  startTime: string;
}

export interface AssessmentReport {
  testId: string;
  testName: string;
  date: string;
  metrics: {
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    completionRate: number;
  };
  students: AssessmentStudentResult[];
}

declare global {
  var __codearena_server_assessments_initialized: boolean | undefined;
  var __codearena_server_assessments: AssessmentTest[] | undefined;
  var __codearena_server_assessment_students: Record<string, AssessmentStudentResult[]> | undefined;
}

const DEFAULT_ASSESSMENTS: AssessmentTest[] = [
  {
    id: "t1",
    title: "Data Structures Mid-term",
    type: "EXAM",
    status: "ACTIVE",
    durationMinutes: 120,
    batchesAssigned: 3,
    questionCount: 1,
    startTime: new Date(Date.now() - 3600000).toISOString(),
    questions: [
      {
        id: "q1",
        slug: "merge-k-sorted-lists",
        title: "Merge k Sorted Lists",
        description: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order.\n\nMerge all the linked-lists into one sorted linked-list and return it.",
        difficulty: "HARD"
      }
    ]
  },
  {
    id: "t2",
    title: "Weekly Coding Challenge",
    type: "COMPETITION",
    status: "ACTIVE",
    durationMinutes: 90,
    batchesAssigned: 12,
    questionCount: 1,
    startTime: new Date().toISOString(),
    questions: [
      {
        id: "q1",
        slug: "longest-palindromic-substring",
        title: "Longest Palindromic Substring",
        description: "Given a string `s`, return the longest palindromic substring in `s`.\n\nA string is palindromic if it reads the same forward and backward.",
        difficulty: "MEDIUM"
      }
    ]
  },
  {
    id: "t3",
    title: "Arrays Basic Assessment",
    type: "PRACTICE",
    status: "COMPLETED",
    durationMinutes: 60,
    batchesAssigned: 1,
    questionCount: 1,
    startTime: new Date(Date.now() - 604800000).toISOString(),
    questions: [
      {
        id: "q1",
        slug: "two-sum",
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        difficulty: "EASY"
      }
    ]
  }
];

const DEFAULT_INITIAL_STUDENTS: Record<string, AssessmentStudentResult[]> = {
  t1: [
    {
      id: "res_mock_1",
      testId: "t1",
      studentId: "std_mock_1",
      studentName: "John Doe",
      studentEmail: "john.doe@university.edu",
      score: 85,
      timeTaken: "45m",
      timeTakenMinutes: 45,
      status: "Evaluated",
      submittedAt: new Date(Date.now() - 7200000).toISOString(),
      language: "javascript",
      passedTestCases: 5,
      totalTestCases: 6
    },
    {
      id: "res_mock_2",
      testId: "t1",
      studentId: "std_mock_2",
      studentName: "Alice Smith",
      studentEmail: "alice.smith@university.edu",
      score: 98,
      timeTaken: "38m",
      timeTakenMinutes: 38,
      status: "Evaluated",
      submittedAt: new Date(Date.now() - 5400000).toISOString(),
      language: "python",
      passedTestCases: 6,
      totalTestCases: 6
    },
    {
      id: "res_mock_3",
      testId: "t1",
      studentId: "std_mock_3",
      studentName: "Bob Williams",
      studentEmail: "bob.w@university.edu",
      score: 65,
      timeTaken: "58m",
      timeTakenMinutes: 58,
      status: "Evaluated",
      submittedAt: new Date(Date.now() - 3600000).toISOString(),
      language: "cpp",
      passedTestCases: 4,
      totalTestCases: 6
    },
    {
      id: "res_mock_4",
      testId: "t1",
      studentId: "std_mock_4",
      studentName: "Eve Hacker",
      studentEmail: "eve.h@university.edu",
      score: 0,
      timeTaken: "-",
      timeTakenMinutes: 0,
      status: "Disqualified (Proctoring)",
      submittedAt: new Date(Date.now() - 1800000).toISOString(),
      language: "javascript"
    }
  ]
};

const STORAGE_FILE = path.join(process.cwd(), ".data_assessments.json");

function readFromFile(): { tests: AssessmentTest[]; students: Record<string, AssessmentStudentResult[]> } | null {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const raw = fs.readFileSync(STORAGE_FILE, "utf-8");
      return JSON.parse(raw);
    }
  } catch (e) {}
  return null;
}

function writeToFile(tests: AssessmentTest[], students: Record<string, AssessmentStudentResult[]>) {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify({ tests, students }), "utf-8");
  } catch (e) {}
}

function ensureInitialized() {
  if (!global.__codearena_server_assessments_initialized) {
    const fromFile = readFromFile();
    if (fromFile && fromFile.tests && fromFile.students) {
      global.__codearena_server_assessments = fromFile.tests;
      global.__codearena_server_assessment_students = fromFile.students;
    } else {
      global.__codearena_server_assessments = [...DEFAULT_ASSESSMENTS];
      global.__codearena_server_assessment_students = { ...DEFAULT_INITIAL_STUDENTS };
      writeToFile(global.__codearena_server_assessments, global.__codearena_server_assessment_students);
    }
    global.__codearena_server_assessments_initialized = true;
  }
}

export function getAllAssessments(): AssessmentTest[] {
  ensureInitialized();
  return global.__codearena_server_assessments || DEFAULT_ASSESSMENTS;
}

export function getAssessmentById(id: string): AssessmentTest | undefined {
  const tests = getAllAssessments();
  return tests.find((t) => t.id === id);
}

export function getAssessmentStudents(testId: string): AssessmentStudentResult[] {
  ensureInitialized();
  const studentsMap = global.__codearena_server_assessment_students || {};
  return studentsMap[testId] || [];
}

export function recordAssessmentStudentResult(result: AssessmentStudentResult): AssessmentStudentResult {
  ensureInitialized();
  if (!global.__codearena_server_assessment_students) {
    global.__codearena_server_assessment_students = { ...DEFAULT_INITIAL_STUDENTS };
  }
  const testId = result.testId;
  const currentList = global.__codearena_server_assessment_students[testId] || [];
  
  // Replace if student already has a record for this test, or prepend
  const existingIdx = currentList.findIndex(
    (s) => s.studentId === result.studentId || (result.studentEmail && s.studentEmail === result.studentEmail)
  );
  if (existingIdx >= 0) {
    currentList[existingIdx] = result;
  } else {
    currentList.unshift(result);
  }

  global.__codearena_server_assessment_students[testId] = currentList;
  writeToFile(global.__codearena_server_assessments || DEFAULT_ASSESSMENTS, global.__codearena_server_assessment_students);
  return result;
}

export function getAssessmentReport(testId: string): AssessmentReport {
  const test = getAssessmentById(testId) || {
    id: testId,
    title: "Assessment Test",
    type: "EXAM",
    status: "COMPLETED",
    durationMinutes: 120,
    batchesAssigned: 1,
    questionCount: 1,
    questions: [],
    startTime: new Date().toISOString()
  };

  const students = getAssessmentStudents(testId);
  const evaluatedStudents = students.filter((s) => s.status !== "Disqualified (Proctoring)");
  
  let averageScore = 0;
  let highestScore = 0;
  let lowestScore = 0;

  if (evaluatedStudents.length > 0) {
    const scores = evaluatedStudents.map((s) => s.score);
    averageScore = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
    highestScore = Math.max(...scores);
    lowestScore = Math.min(...scores);
  }

  const completionRate = students.length > 0
    ? Math.round((evaluatedStudents.length / students.length) * 100)
    : 100;

  return {
    testId,
    testName: test.title,
    date: new Date(test.startTime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    metrics: {
      averageScore,
      highestScore,
      lowestScore,
      completionRate
    },
    students
  };
}
