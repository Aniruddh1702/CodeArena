// ============================================
// CodeArena — Shared Type Definitions
// ============================================

// ── Auth Types ───────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  user: SafeUser;
  accessToken: string;
}

export interface SafeUser {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl: string | null;
  bio: string | null;
  isPublicProfile: boolean;
  emailVerified: boolean;
  createdAt: string;
}

export type UserRole = 'STUDENT' | 'TEACHER' | 'ORGANIZATION_ADMIN' | 'SUPER_ADMIN';
export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'PENDING_VERIFICATION';

// ── Question Types ───────────────────────────

export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type QuestionStatus = 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';

export interface QuestionSummary {
  id: string;
  title: string;
  slug: string;
  difficulty: QuestionDifficulty;
  status: QuestionStatus;
  topics: string[];
  tags: string[];
  solveCount: number;
  attemptCount: number;
  solved?: boolean; // for authenticated users
}

export interface QuestionDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  inputFormat: string | null;
  outputFormat: string | null;
  constraints: string | null;
  difficulty: QuestionDifficulty;
  timeLimit: number;
  memoryLimit: number;
  supportedLanguages: string[];
  starterCode: Record<string, string>;
  examples: QuestionExample[];
  hints: string[];
  topics: { id: string; name: string; slug: string }[];
  tags: { id: string; name: string; slug: string }[];
  solveCount: number;
  attemptCount: number;
}

export interface QuestionExample {
  input: string;
  output: string;
  explanation?: string;
}

// ── Submission Types ─────────────────────────

export type SubmissionStatus =
  | 'QUEUED'
  | 'RUNNING'
  | 'ACCEPTED'
  | 'WRONG_ANSWER'
  | 'TIME_LIMIT'
  | 'MEMORY_LIMIT'
  | 'COMPILE_ERROR'
  | 'RUNTIME_ERROR'
  | 'SYSTEM_ERROR';

export interface SubmissionRequest {
  questionId: string;
  language: string;
  code: string;
  testAttemptId?: string;
}

export interface RunCodeRequest {
  questionId: string;
  language: string;
  code: string;
  customInput?: string;
}

export interface SubmissionResult {
  id: string;
  status: SubmissionStatus;
  runtime: number | null;
  memory: number | null;
  testCasesPassed: number;
  testCasesTotal: number;
  errorMessage: string | null;
  results?: TestCaseResult[];
}

export interface TestCaseResult {
  passed: boolean;
  runtime: number | null;
  memory: number | null;
  output: string | null;
  expected: string | null;
  error: string | null;
}

// ── Test/Assessment Types ────────────────────

export type TestStatus = 'DRAFT' | 'SCHEDULED' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
export type TestType = 'SELF_ASSESSMENT' | 'OFFICIAL' | 'COMPANY_ASSESSMENT' | 'PRACTICE';
export type AttemptStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'SUBMITTED' | 'TIMED_OUT' | 'EVALUATED';

export interface TestSummary {
  id: string;
  title: string;
  description: string | null;
  type: TestType;
  status: TestStatus;
  duration: number;
  startTime: string | null;
  endTime: string | null;
  questionCount: number;
  maxAttempts: number;
}

export interface TestAttemptResult {
  id: string;
  score: number | null;
  totalPoints: number | null;
  accuracy: number | null;
  timeTaken: number | null;
  status: AttemptStatus;
  questionsAttempted: number;
  questionsSolved: number;
}

// ── Analytics Types ──────────────────────────

export interface StudentDashboard {
  greeting: string;
  dsaRating: number;
  problemsSolved: number;
  accuracy: number;
  currentStreak: number;
  recentActivity: ActivityItem[];
  topicProgress: TopicProgress[];
  weakTopics: string[];
  upcomingTests: TestSummary[];
  recentAssessments: TestAttemptResult[];
  recommendedProblems: QuestionSummary[];
}

export interface TopicProgress {
  topicName: string;
  topicSlug: string;
  solved: number;
  total: number;
  percentage: number;
}

export interface ActivityItem {
  type: string;
  title: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

// ── Leaderboard Types ────────────────────────

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  score: number;
  problemsSolved: number;
}

// ── Notification Types ───────────────────────

export type NotificationType =
  | 'TEST_ASSIGNED'
  | 'TEST_REMINDER'
  | 'TEST_RESULT'
  | 'ACHIEVEMENT_UNLOCKED'
  | 'BATTLE_INVITATION'
  | 'TEACHER_ANNOUNCEMENT'
  | 'SYSTEM';

// ── API Response Types ───────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationQuery {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ── Integrity Types ──────────────────────────

export type IntegrityRiskLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface IntegrityEvent {
  eventType: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
}

export interface IntegrityReport {
  score: number;
  riskLevel: IntegrityRiskLevel;
  summary: {
    tabSwitches: number;
    windowBlurs: number;
    fullscreenExits: number;
    copyEvents: number;
    pasteEvents: number;
    cutEvents: number;
  };
}

// ── Battle Types ─────────────────────────────

export type BattleStatus = 'WAITING' | 'MATCHED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface BattleState {
  id: string;
  status: BattleStatus;
  questionId: string | null;
  participants: BattleParticipantState[];
  duration: number;
  startedAt: string | null;
  timeRemaining: number;
}

export interface BattleParticipantState {
  userId: string;
  username: string;
  solved: boolean;
  runtime: number | null;
}

// ── WebSocket Event Types ────────────────────

export enum WsEvent {
  // Test monitoring
  TEST_STATUS_UPDATE = 'test:status_update',
  TEST_STUDENT_UPDATE = 'test:student_update',
  
  // Battle
  BATTLE_MATCH = 'battle:match',
  BATTLE_START = 'battle:start',
  BATTLE_SUBMIT = 'battle:submit',
  BATTLE_END = 'battle:end',
  
  // Notifications
  NOTIFICATION = 'notification',
  
  // Submission
  SUBMISSION_STATUS = 'submission:status',
  
  // Integrity
  INTEGRITY_EVENT = 'integrity:event',
}
