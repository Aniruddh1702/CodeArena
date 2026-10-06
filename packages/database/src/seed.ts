// ============================================
// CodeArena — Development Seed Data
// ============================================
// Creates demo accounts and DSA questions for local development.
// NEVER use these credentials in production.
// ============================================

import { PrismaClient, UserRole, UserStatus, QuestionDifficulty, QuestionStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// ── DSA Topics ───────────────────────────────
const topics = [
  { name: 'Arrays', slug: 'arrays', icon: '📊', order: 1, description: 'Learn array manipulation, traversal, and optimization techniques.' },
  { name: 'Strings', slug: 'strings', icon: '🔤', order: 2, description: 'Master string manipulation, pattern matching, and parsing.' },
  { name: 'Linked List', slug: 'linked-list', icon: '🔗', order: 3, description: 'Understand linked list operations, reversal, and cycle detection.' },
  { name: 'Stack', slug: 'stack', icon: '📚', order: 4, description: 'Explore stack-based algorithms and expression evaluation.' },
  { name: 'Queue', slug: 'queue', icon: '🚶', order: 5, description: 'Learn queue operations, BFS, and priority queues.' },
  { name: 'Hashing', slug: 'hashing', icon: '🗝️', order: 6, description: 'Master hash maps, sets, and collision handling.' },
  { name: 'Recursion', slug: 'recursion', icon: '🔄', order: 7, description: 'Build recursive thinking and understand call stacks.' },
  { name: 'Backtracking', slug: 'backtracking', icon: '↩️', order: 8, description: 'Solve constraint satisfaction and combinatorial problems.' },
  { name: 'Trees', slug: 'trees', icon: '🌳', order: 9, description: 'Learn tree traversals, construction, and balancing.' },
  { name: 'Binary Search Tree', slug: 'bst', icon: '🌲', order: 10, description: 'Master BST operations, validation, and self-balancing trees.' },
  { name: 'Heap', slug: 'heap', icon: '⛰️', order: 11, description: 'Understand heap operations and priority queue applications.' },
  { name: 'Graphs', slug: 'graphs', icon: '🕸️', order: 12, description: 'Explore graph traversals, shortest paths, and connectivity.' },
  { name: 'Greedy', slug: 'greedy', icon: '🎯', order: 13, description: 'Learn greedy algorithm design and proof of correctness.' },
  { name: 'Dynamic Programming', slug: 'dynamic-programming', icon: '🧩', order: 14, description: 'Master DP patterns, memoization, and tabulation.' },
  { name: 'Searching', slug: 'searching', icon: '🔍', order: 15, description: 'Understand binary search and its variations.' },
  { name: 'Sorting', slug: 'sorting', icon: '📈', order: 16, description: 'Learn sorting algorithms and their trade-offs.' },
  { name: 'Bit Manipulation', slug: 'bit-manipulation', icon: '💡', order: 17, description: 'Master bitwise operations and optimization tricks.' },
  { name: 'Advanced Algorithms', slug: 'advanced-algorithms', icon: '🚀', order: 18, description: 'Explore advanced topics: segment trees, tries, and more.' },
];

// ── Sample Questions ─────────────────────────
const questions = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return the indices of the two numbers that add up to \`target\`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.`,
    inputFormat: 'First line: space-separated integers (the array)\nSecond line: an integer (the target)',
    outputFormat: 'Space-separated indices of the two numbers',
    constraints: '2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9\n-10^9 <= target <= 10^9',
    difficulty: QuestionDifficulty.EASY,
    topics: ['arrays', 'hashing'],
    hints: ['Try using a hash map to store values you\'ve seen.', 'For each number, check if target - number exists in the map.'],
    editorial: 'Use a hash map to store each number\'s index. For each element, check if the complement (target - current) exists in the map.',
    examples: [
      { input: '2 7 11 15\n9', output: '0 1', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: '3 2 4\n6', output: '1 2', explanation: 'nums[1] + nums[2] = 2 + 4 = 6' },
    ],
    testCases: [
      { input: '2 7 11 15\n9', output: '0 1', isPublic: true },
      { input: '3 2 4\n6', output: '1 2', isPublic: true },
      { input: '3 3\n6', output: '0 1', isPublic: false },
      { input: '1 5 3 7 2\n9', output: '1 3', isPublic: false },
      { input: '-1 -2 -3 -4 -5\n-8', output: '2 4', isPublic: false },
    ],
    starterCode: {
      python: 'def two_sum(nums, target):\n    # Your code here\n    pass',
      javascript: 'function twoSum(nums, target) {\n  // Your code here\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n  // Your code here\n}',
      java: 'class Solution {\n  public int[] twoSum(int[] nums, int target) {\n    // Your code here\n  }\n}',
    },
  },
  {
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    description: `Given the head of a singly linked list, reverse the list, and return the reversed list.`,
    inputFormat: 'Space-separated integers representing the linked list nodes',
    outputFormat: 'Space-separated integers of the reversed list',
    constraints: 'The number of nodes in the list is in the range [0, 5000].\n-5000 <= Node.val <= 5000',
    difficulty: QuestionDifficulty.EASY,
    topics: ['linked-list'],
    hints: ['Use three pointers: prev, current, and next.', 'Iterate through the list, reversing each pointer.'],
    editorial: 'Iterative: Use prev, curr, next pointers. Recursive: Reverse the rest, then point the next node back.',
    examples: [
      { input: '1 2 3 4 5', output: '5 4 3 2 1', explanation: 'The reversed list is [5,4,3,2,1]' },
      { input: '1 2', output: '2 1', explanation: 'The reversed list is [2,1]' },
    ],
    testCases: [
      { input: '1 2 3 4 5', output: '5 4 3 2 1', isPublic: true },
      { input: '1 2', output: '2 1', isPublic: true },
      { input: '1', output: '1', isPublic: false },
      { input: '1 2 3', output: '3 2 1', isPublic: false },
    ],
    starterCode: {
      python: 'class ListNode:\n    def __init__(self, val=0, next=None):\n        self.val = val\n        self.next = next\n\ndef reverse_list(head):\n    # Your code here\n    pass',
      javascript: 'function reverseList(head) {\n  // Your code here\n}',
      cpp: 'struct ListNode {\n  int val;\n  ListNode *next;\n  ListNode(int x) : val(x), next(nullptr) {}\n};\n\nListNode* reverseList(ListNode* head) {\n  // Your code here\n}',
      java: 'class Solution {\n  public ListNode reverseList(ListNode head) {\n    // Your code here\n  }\n}',
    },
  },
  {
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    description: `Given a string \`s\` containing just the characters \`(\`, \`)\`, \`{\`, \`}\`, \`[\` and \`]\`, determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.`,
    inputFormat: 'A single string containing brackets',
    outputFormat: 'true or false',
    constraints: '1 <= s.length <= 10^4\ns consists of parentheses only \'()[]{}\'',
    difficulty: QuestionDifficulty.EASY,
    topics: ['stack', 'strings'],
    hints: ['Use a stack to keep track of opening brackets.', 'When you encounter a closing bracket, check if it matches the top of the stack.'],
    editorial: 'Push opening brackets onto a stack. For each closing bracket, check if it matches the top. Return true if the stack is empty at the end.',
    examples: [
      { input: '()', output: 'true', explanation: 'Single pair of matching parentheses' },
      { input: '()[]{}', output: 'true', explanation: 'All brackets are properly matched' },
      { input: '(]', output: 'false', explanation: 'Mismatched bracket types' },
    ],
    testCases: [
      { input: '()', output: 'true', isPublic: true },
      { input: '()[]{}', output: 'true', isPublic: true },
      { input: '(]', output: 'false', isPublic: true },
      { input: '([)]', output: 'false', isPublic: false },
      { input: '{[]}', output: 'true', isPublic: false },
      { input: '', output: 'true', isPublic: false },
    ],
    starterCode: {
      python: 'def is_valid(s):\n    # Your code here\n    pass',
      javascript: 'function isValid(s) {\n  // Your code here\n}',
      cpp: '#include <string>\nusing namespace std;\n\nbool isValid(string s) {\n  // Your code here\n}',
      java: 'class Solution {\n  public boolean isValid(String s) {\n    // Your code here\n  }\n}',
    },
  },
  {
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.`,
    inputFormat: 'Space-separated integers',
    outputFormat: 'A single integer (the maximum sum)',
    constraints: '1 <= nums.length <= 10^5\n-10^4 <= nums[i] <= 10^4',
    difficulty: QuestionDifficulty.MEDIUM,
    topics: ['arrays', 'dynamic-programming'],
    hints: ['Think about Kadane\'s algorithm.', 'At each position, decide whether to extend the current subarray or start a new one.'],
    editorial: 'Kadane\'s Algorithm: Track the maximum sum ending at each position. maxCurrent = max(nums[i], maxCurrent + nums[i]).',
    examples: [
      { input: '-2 1 -3 4 -1 2 1 -5 4', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: '1', output: '1', explanation: 'Single element array.' },
      { input: '5 4 -1 7 8', output: '23', explanation: 'The entire array is the maximum subarray.' },
    ],
    testCases: [
      { input: '-2 1 -3 4 -1 2 1 -5 4', output: '6', isPublic: true },
      { input: '1', output: '1', isPublic: true },
      { input: '5 4 -1 7 8', output: '23', isPublic: false },
      { input: '-1', output: '-1', isPublic: false },
      { input: '-2 -1', output: '-1', isPublic: false },
    ],
    starterCode: {
      python: 'def max_subarray(nums):\n    # Your code here\n    pass',
      javascript: 'function maxSubArray(nums) {\n  // Your code here\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n  // Your code here\n}',
      java: 'class Solution {\n  public int maxSubArray(int[] nums) {\n    // Your code here\n  }\n}',
    },
  },
  {
    title: 'Binary Tree Level Order Traversal',
    slug: 'binary-tree-level-order-traversal',
    description: `Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).`,
    inputFormat: 'Space-separated integers representing level-order insertion (use -1 for null)',
    outputFormat: 'Each level on a new line, space-separated values',
    constraints: 'The number of nodes is in the range [0, 2000].\n-1000 <= Node.val <= 1000',
    difficulty: QuestionDifficulty.MEDIUM,
    topics: ['trees', 'bst'],
    hints: ['Use a queue (BFS).', 'Process all nodes at the current level before moving to the next.'],
    editorial: 'Use BFS with a queue. For each level, dequeue all nodes, record their values, and enqueue their children.',
    examples: [
      { input: '3 9 20 -1 -1 15 7', output: '3\n9 20\n15 7', explanation: 'Level 0: [3], Level 1: [9,20], Level 2: [15,7]' },
    ],
    testCases: [
      { input: '3 9 20 -1 -1 15 7', output: '3\n9 20\n15 7', isPublic: true },
      { input: '1', output: '1', isPublic: true },
      { input: '1 2 3 4 5', output: '1\n2 3\n4 5', isPublic: false },
    ],
    starterCode: {
      python: 'def level_order(root):\n    # Your code here\n    pass',
      javascript: 'function levelOrder(root) {\n  // Your code here\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nstruct TreeNode {\n  int val;\n  TreeNode *left;\n  TreeNode *right;\n};\n\nvector<vector<int>> levelOrder(TreeNode* root) {\n  // Your code here\n}',
      java: 'class Solution {\n  public List<List<Integer>> levelOrder(TreeNode root) {\n    // Your code here\n  }\n}',
    },
  },
  {
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    inputFormat: 'A single integer n',
    outputFormat: 'A single integer (number of ways)',
    constraints: '1 <= n <= 45',
    difficulty: QuestionDifficulty.EASY,
    topics: ['dynamic-programming', 'recursion'],
    hints: ['This is the Fibonacci sequence!', 'dp[i] = dp[i-1] + dp[i-2]'],
    editorial: 'Classic DP. dp[1]=1, dp[2]=2, dp[n]=dp[n-1]+dp[n-2]. This is the Fibonacci sequence.',
    examples: [
      { input: '2', output: '2', explanation: '1+1, 2' },
      { input: '3', output: '3', explanation: '1+1+1, 1+2, 2+1' },
    ],
    testCases: [
      { input: '2', output: '2', isPublic: true },
      { input: '3', output: '3', isPublic: true },
      { input: '1', output: '1', isPublic: false },
      { input: '5', output: '8', isPublic: false },
      { input: '10', output: '89', isPublic: false },
    ],
    starterCode: {
      python: 'def climb_stairs(n):\n    # Your code here\n    pass',
      javascript: 'function climbStairs(n) {\n  // Your code here\n}',
      cpp: 'int climbStairs(int n) {\n  // Your code here\n}',
      java: 'class Solution {\n  public int climbStairs(int n) {\n    // Your code here\n  }\n}',
    },
  },
  {
    title: 'Merge Two Sorted Lists',
    slug: 'merge-two-sorted-lists',
    description: `You are given the heads of two sorted linked lists \`list1\` and \`list2\`.\n\nMerge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.`,
    inputFormat: 'Two lines, each containing space-separated integers',
    outputFormat: 'Space-separated integers of the merged sorted list',
    constraints: 'The number of nodes in both lists is in the range [0, 50].\n-100 <= Node.val <= 100',
    difficulty: QuestionDifficulty.EASY,
    topics: ['linked-list'],
    hints: ['Use a dummy head node.', 'Compare nodes from both lists and append the smaller one.'],
    editorial: 'Create a dummy head. Compare l1 and l2, append the smaller value, advance that pointer. Append the remaining list.',
    examples: [
      { input: '1 2 4\n1 3 4', output: '1 1 2 3 4 4', explanation: 'Merged: [1,1,2,3,4,4]' },
    ],
    testCases: [
      { input: '1 2 4\n1 3 4', output: '1 1 2 3 4 4', isPublic: true },
      { input: '\n0', output: '0', isPublic: false },
      { input: '1\n2', output: '1 2', isPublic: false },
    ],
    starterCode: {
      python: 'def merge_two_lists(l1, l2):\n    # Your code here\n    pass',
      javascript: 'function mergeTwoLists(l1, l2) {\n  // Your code here\n}',
      cpp: 'ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {\n  // Your code here\n}',
      java: 'class Solution {\n  public ListNode mergeTwoLists(ListNode l1, ListNode l2) {\n    // Your code here\n  }\n}',
    },
  },
  {
    title: 'Longest Common Subsequence',
    slug: 'longest-common-subsequence',
    description: `Given two strings \`text1\` and \`text2\`, return the length of their longest common subsequence. If there is no common subsequence, return 0.\n\nA subsequence of a string is a new string generated from the original string with some characters (can be none) deleted without changing the relative order of the remaining characters.`,
    inputFormat: 'Two strings, one per line',
    outputFormat: 'A single integer',
    constraints: '1 <= text1.length, text2.length <= 1000\ntext1 and text2 consist of only lowercase English characters.',
    difficulty: QuestionDifficulty.MEDIUM,
    topics: ['dynamic-programming', 'strings'],
    hints: ['Use a 2D DP table.', 'If characters match, dp[i][j] = dp[i-1][j-1] + 1. Otherwise, dp[i][j] = max(dp[i-1][j], dp[i][j-1]).'],
    editorial: 'Classic 2D DP. Build a table where dp[i][j] represents the LCS of text1[0..i-1] and text2[0..j-1].',
    examples: [
      { input: 'abcde\nace', output: '3', explanation: 'LCS is "ace", length 3' },
      { input: 'abc\nabc', output: '3', explanation: 'LCS is "abc", length 3' },
      { input: 'abc\ndef', output: '0', explanation: 'No common subsequence' },
    ],
    testCases: [
      { input: 'abcde\nace', output: '3', isPublic: true },
      { input: 'abc\nabc', output: '3', isPublic: true },
      { input: 'abc\ndef', output: '0', isPublic: false },
      { input: 'oxcpqrsvwf\nshmtulqrypy', output: '2', isPublic: false },
    ],
    starterCode: {
      python: 'def longest_common_subsequence(text1, text2):\n    # Your code here\n    pass',
      javascript: 'function longestCommonSubsequence(text1, text2) {\n  // Your code here\n}',
      cpp: '#include <string>\nusing namespace std;\n\nint longestCommonSubsequence(string text1, string text2) {\n  // Your code here\n}',
      java: 'class Solution {\n  public int longestCommonSubsequence(String text1, String text2) {\n    // Your code here\n  }\n}',
    },
  },
  {
    title: 'Number of Islands',
    slug: 'number-of-islands',
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of \`1\`s (land) and \`0\`s (water), return the number of islands.\n\nAn island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    inputFormat: 'First line: m n\nNext m lines: space-separated 0s and 1s',
    outputFormat: 'A single integer',
    constraints: 'm == grid.length\nn == grid[i].length\n1 <= m, n <= 300\ngrid[i][j] is \'0\' or \'1\'',
    difficulty: QuestionDifficulty.MEDIUM,
    topics: ['graphs', 'recursion'],
    hints: ['Use DFS or BFS.', 'When you find a \'1\', increment the count and mark all connected lands as visited.'],
    editorial: 'DFS/BFS flood fill. Iterate through the grid. When a \'1\' is found, run DFS/BFS to mark all connected land, increment island count.',
    examples: [
      { input: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0', output: '1', explanation: 'One island' },
      { input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', output: '3', explanation: 'Three islands' },
    ],
    testCases: [
      { input: '4 5\n1 1 1 1 0\n1 1 0 1 0\n1 1 0 0 0\n0 0 0 0 0', output: '1', isPublic: true },
      { input: '4 5\n1 1 0 0 0\n1 1 0 0 0\n0 0 1 0 0\n0 0 0 1 1', output: '3', isPublic: true },
      { input: '1 1\n1', output: '1', isPublic: false },
      { input: '1 1\n0', output: '0', isPublic: false },
    ],
    starterCode: {
      python: 'def num_islands(grid):\n    # Your code here\n    pass',
      javascript: 'function numIslands(grid) {\n  // Your code here\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nint numIslands(vector<vector<char>>& grid) {\n  // Your code here\n}',
      java: 'class Solution {\n  public int numIslands(char[][] grid) {\n    // Your code here\n  }\n}',
    },
  },
  {
    title: 'Coin Change',
    slug: 'coin-change',
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.\n\nReturn the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.\n\nYou may assume that you have an infinite number of each kind of coin.`,
    inputFormat: 'First line: space-separated coin denominations\nSecond line: the target amount',
    outputFormat: 'A single integer',
    constraints: '1 <= coins.length <= 12\n1 <= coins[i] <= 2^31 - 1\n0 <= amount <= 10^4',
    difficulty: QuestionDifficulty.MEDIUM,
    topics: ['dynamic-programming', 'greedy'],
    hints: ['Use bottom-up DP.', 'dp[i] = minimum coins to make amount i. dp[0] = 0.'],
    editorial: 'Bottom-up DP. dp[0]=0, dp[i]=min(dp[i], dp[i-coin]+1) for each coin. Return dp[amount] or -1 if impossible.',
    examples: [
      { input: '1 5 11\n11', output: '1', explanation: '11 = 11' },
      { input: '2\n3', output: '-1', explanation: 'Cannot make 3 with only 2-coins' },
      { input: '1\n0', output: '0', explanation: 'Amount 0 requires 0 coins' },
    ],
    testCases: [
      { input: '1 5 11\n11', output: '1', isPublic: true },
      { input: '2\n3', output: '-1', isPublic: true },
      { input: '1\n0', output: '0', isPublic: false },
      { input: '1 2 5\n11', output: '3', isPublic: false },
      { input: '186 419 83 408\n6249', output: '20', isPublic: false },
    ],
    starterCode: {
      python: 'def coin_change(coins, amount):\n    # Your code here\n    pass',
      javascript: 'function coinChange(coins, amount) {\n  // Your code here\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nint coinChange(vector<int>& coins, int amount) {\n  // Your code here\n}',
      java: 'class Solution {\n  public int coinChange(int[] coins, int amount) {\n    // Your code here\n  }\n}',
    },
  },
];

// ── Tags ─────────────────────────────────────
const tags = [
  { name: 'Array', slug: 'array', type: 'concept' },
  { name: 'Hash Table', slug: 'hash-table', type: 'concept' },
  { name: 'Two Pointers', slug: 'two-pointers', type: 'concept' },
  { name: 'Sliding Window', slug: 'sliding-window', type: 'concept' },
  { name: 'Binary Search', slug: 'binary-search', type: 'concept' },
  { name: 'DFS', slug: 'dfs', type: 'concept' },
  { name: 'BFS', slug: 'bfs', type: 'concept' },
  { name: 'Dynamic Programming', slug: 'dp', type: 'concept' },
  { name: 'Greedy', slug: 'greedy', type: 'concept' },
  { name: 'Stack', slug: 'stack', type: 'concept' },
  { name: 'Google', slug: 'google', type: 'company' },
  { name: 'Amazon', slug: 'amazon', type: 'company' },
  { name: 'Microsoft', slug: 'microsoft', type: 'company' },
  { name: 'Meta', slug: 'meta', type: 'company' },
  { name: 'Apple', slug: 'apple', type: 'company' },
];

// ── Achievements ─────────────────────────────
const achievements = [
  { name: 'First Blood', description: 'Solve your first problem', icon: '🎯', xpReward: 10, criteria: { type: 'problems_solved', count: 1 } },
  { name: 'Getting Started', description: 'Solve 5 problems', icon: '🌱', xpReward: 25, criteria: { type: 'problems_solved', count: 5 } },
  { name: 'Problem Solver', description: 'Solve 25 problems', icon: '⚡', xpReward: 50, criteria: { type: 'problems_solved', count: 25 } },
  { name: 'Centurion', description: 'Solve 100 problems', icon: '💯', xpReward: 200, criteria: { type: 'problems_solved', count: 100 } },
  { name: 'Streak Starter', description: 'Maintain a 7-day streak', icon: '🔥', xpReward: 30, criteria: { type: 'streak', count: 7 } },
  { name: 'Streak Master', description: 'Maintain a 30-day streak', icon: '🏆', xpReward: 100, criteria: { type: 'streak', count: 30 } },
  { name: 'Speed Demon', description: 'Solve a problem in under 5 minutes', icon: '⚡', xpReward: 15, criteria: { type: 'speed_solve', seconds: 300 } },
  { name: 'Array Expert', description: 'Solve 20 array problems', icon: '📊', xpReward: 50, criteria: { type: 'topic_solved', topic: 'arrays', count: 20 } },
  { name: 'DP Warrior', description: 'Solve 10 DP problems', icon: '🧩', xpReward: 75, criteria: { type: 'topic_solved', topic: 'dynamic-programming', count: 10 } },
  { name: 'Graph Navigator', description: 'Solve 10 graph problems', icon: '🕸️', xpReward: 75, criteria: { type: 'topic_solved', topic: 'graphs', count: 10 } },
];

// ── Missions ─────────────────────────────────
const missions = [
  { title: 'Daily Solve', description: 'Solve 1 problem today', type: 'DAILY' as const, targetCount: 1, xpReward: 10 },
  { title: 'Daily Trio', description: 'Solve 3 problems today', type: 'DAILY' as const, targetCount: 3, xpReward: 25 },
  { title: 'Weekly Warrior', description: 'Solve 10 problems this week', type: 'WEEKLY' as const, targetCount: 10, xpReward: 50, duration: 7 },
  { title: '7-Day Array Challenge', description: 'Solve 7 array problems in 7 days', type: 'TOPIC_CHALLENGE' as const, targetCount: 7, xpReward: 75, duration: 7 },
  { title: 'Graph Mastery', description: 'Solve 10 graph problems in 14 days', type: 'TOPIC_CHALLENGE' as const, targetCount: 10, xpReward: 100, duration: 14 },
  { title: '30-Day Interview Prep', description: 'Solve 30 curated interview problems', type: 'INTERVIEW_PREP' as const, targetCount: 30, xpReward: 300, duration: 30 },
];

async function main() {
  console.log('🌱 Seeding CodeArena database...\n');

  // ── Create Topics ──
  console.log('📚 Creating topics...');
  const createdTopics: Record<string, string> = {};
  for (const topic of topics) {
    const t = await prisma.topic.upsert({
      where: { slug: topic.slug },
      update: {},
      create: topic,
    });
    createdTopics[topic.slug] = t.id;
  }
  console.log(`   ✓ ${topics.length} topics created\n`);

  // ── Create Tags ──
  console.log('🏷️  Creating tags...');
  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: {},
      create: tag,
    });
  }
  console.log(`   ✓ ${tags.length} tags created\n`);

  // ── Create Admin ──
  console.log('👑 Creating admin user...');
  const adminPassword = await hashPassword(process.env.ADMIN_PASSWORD || 'Admin@123!');
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || 'admin@codearena.dev' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || 'admin@codearena.dev',
      username: 'admin',
      passwordHash: adminPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });
  console.log(`   ✓ Admin: ${admin.email}\n`);

  // ── Create Demo Teacher ──
  console.log('👩‍🏫 Creating demo teacher...');
  const teacherPassword = await hashPassword('Teacher@123!');
  const teacher = await prisma.user.upsert({
    where: { email: 'teacher@codearena.dev' },
    update: {},
    create: {
      email: 'teacher@codearena.dev',
      username: 'demo_teacher',
      passwordHash: teacherPassword,
      firstName: 'Demo',
      lastName: 'Teacher',
      role: 'TEACHER',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });
  console.log(`   ✓ Teacher: ${teacher.email}\n`);

  // ── Create Demo Student ──
  console.log('🎓 Creating demo student...');
  const studentPassword = await hashPassword('Student@123!');
  const student = await prisma.user.upsert({
    where: { email: 'student@codearena.dev' },
    update: {},
    create: {
      email: 'student@codearena.dev',
      username: 'demo_student',
      passwordHash: studentPassword,
      firstName: 'Demo',
      lastName: 'Student',
      role: 'STUDENT',
      status: 'ACTIVE',
      emailVerified: true,
    },
  });
  console.log(`   ✓ Student: ${student.email}\n`);

  // ── Create Rating for Student ──
  await prisma.rating.upsert({
    where: { userId: student.id },
    update: {},
    create: {
      userId: student.id,
      dsaRating: 1200,
      contestRating: 1200,
      problemsSolved: 0,
      accuracy: 0,
    },
  });

  // ── Create Demo Organization ──
  console.log('🏫 Creating demo organization...');
  const org = await prisma.organization.upsert({
    where: { slug: 'demo-college' },
    update: {},
    create: {
      name: 'Demo College of Engineering',
      slug: 'demo-college',
      description: 'A demo organization for development testing',
      type: 'college',
    },
  });

  // Add teacher and student as members
  await prisma.organizationMember.upsert({
    where: { userId_organizationId: { userId: teacher.id, organizationId: org.id } },
    update: {},
    create: {
      userId: teacher.id,
      organizationId: org.id,
      role: 'TEACHER',
    },
  });

  await prisma.organizationMember.upsert({
    where: { userId_organizationId: { userId: student.id, organizationId: org.id } },
    update: {},
    create: {
      userId: student.id,
      organizationId: org.id,
      role: 'STUDENT',
    },
  });

  // Create a batch
  const batch = await prisma.batch.upsert({
    where: { id: 'demo-batch-cse-2024' },
    update: {},
    create: {
      id: 'demo-batch-cse-2024',
      name: 'CSE 2024',
      description: 'Computer Science 2024 Batch',
      organizationId: org.id,
      year: 2024,
      department: 'CSE',
    },
  });

  await prisma.batchStudent.upsert({
    where: { batchId_userId: { batchId: batch.id, userId: student.id } },
    update: {},
    create: {
      batchId: batch.id,
      userId: student.id,
    },
  });

  console.log(`   ✓ Organization: ${org.name}\n`);

  // ── Create Questions ──
  console.log('❓ Creating questions...');
  for (const q of questions) {
    const existing = await prisma.question.findUnique({ where: { slug: q.slug } });
    if (existing) {
      console.log(`   ⏩ Skipping existing: ${q.title}`);
      continue;
    }

    const question = await prisma.question.create({
      data: {
        title: q.title,
        slug: q.slug,
        description: q.description,
        inputFormat: q.inputFormat,
        outputFormat: q.outputFormat,
        constraints: q.constraints,
        difficulty: q.difficulty,
        status: QuestionStatus.PUBLISHED,
        hints: q.hints,
        editorial: q.editorial,
        starterCode: q.starterCode as any,
        creatorId: teacher.id,
        examples: {
          create: q.examples.map((ex, i) => ({
            input: ex.input,
            output: ex.output,
            explanation: ex.explanation,
            order: i,
          })),
        },
        testCases: {
          create: q.testCases.map((tc, i) => ({
            input: tc.input,
            output: tc.output,
            isPublic: tc.isPublic,
            order: i,
          })),
        },
      },
    });

    // Link topics
    for (const topicSlug of q.topics) {
      if (createdTopics[topicSlug]) {
        await prisma.questionTopic.create({
          data: {
            questionId: question.id,
            topicId: createdTopics[topicSlug],
          },
        });
      }
    }

    console.log(`   ✓ ${q.title} (${q.difficulty})`);
  }
  console.log(`   ✓ ${questions.length} questions created\n`);

  // ── Create Achievements ──
  console.log('🏅 Creating achievements...');
  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: { name: a.name },
      update: {},
      create: {
        name: a.name,
        description: a.description,
        icon: a.icon,
        xpReward: a.xpReward,
        criteria: a.criteria as any,
      },
    });
  }
  console.log(`   ✓ ${achievements.length} achievements created\n`);

  // ── Create Missions ──
  console.log('🎯 Creating missions...');
  for (const m of missions) {
    const existing = await prisma.mission.findFirst({ where: { title: m.title } });
    if (!existing) {
      await prisma.mission.create({ data: m });
    }
  }
  console.log(`   ✓ ${missions.length} missions created\n`);

  console.log('═══════════════════════════════════════════');
  console.log('✅ Seed completed successfully!');
  console.log('═══════════════════════════════════════════');
  console.log('\nDemo accounts:');
  console.log('  Admin:   admin@codearena.dev / Admin@123!');
  console.log('  Teacher: teacher@codearena.dev / Teacher@123!');
  console.log('  Student: student@codearena.dev / Student@123!');
  console.log('\n⚠️  NEVER use these credentials in production!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
