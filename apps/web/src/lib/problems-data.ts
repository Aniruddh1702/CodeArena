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
  "two-sum": {
    id: "1",
    slug: "two-sum",
    title: "Two Sum",
    difficulty: "EASY",
    topics: [{ name: "Arrays" }, { name: "Hash Table" }],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    methodName: "twoSum",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    
};`,
      python: `class Solution:
    def twoSum(self, nums: list[int], target: int) -> list[int]:
        pass`,
      cpp: `#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        
    }
};`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        return new int[]{};
    }
}`
    },
    publicTestCases: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        args: [[2, 7, 11, 15], 9],
        expected: [0, 1]
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
        args: [[3, 2, 4], 6],
        expected: [1, 2]
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
        args: [[3, 3], 6],
        expected: [0, 1]
      }
    ],
    hiddenTestCases: [
      {
        input: "nums = [1,3,7,11,19], target = 20",
        output: "[0,4]",
        args: [[1, 3, 7, 11, 19], 20],
        expected: [0, 4]
      },
      {
        input: "nums = [-1,-2,-3,-4,-5], target = -8",
        output: "[2,4]",
        args: [[-1, -2, -3, -4, -5], -8],
        expected: [2, 4]
      }
    ]
  },

  "reverse-linked-list": {
    id: "2",
    slug: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "EASY",
    topics: [{ name: "Linked List" }, { name: "Recursion" }],
    description: `Given the \`head\` of a singly linked list, reverse the list, and return the reversed list.`,
    constraints: [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 <= Node.val <= 5000"
    ],
    methodName: "reverseList",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {number[]} head
 * @return {number[]}
 */
var reverseList = function(head) {
    
};`,
      python: `class Solution:
    def reverseList(self, head: list[int]) -> list[int]:
        pass`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> reverseList(vector<int>& head) {
        
    }
};`,
      java: `class Solution {
    public int[] reverseList(int[] head) {
        return new int[]{};
    }
}`
    },
    publicTestCases: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
        args: [[1, 2, 3, 4, 5]],
        expected: [5, 4, 3, 2, 1]
      },
      {
        input: "head = [1,2]",
        output: "[2,1]",
        args: [[1, 2]],
        expected: [2, 1]
      },
      {
        input: "head = []",
        output: "[]",
        args: [[]],
        expected: []
      }
    ],
    hiddenTestCases: [
      {
        input: "head = [42]",
        output: "[42]",
        args: [[42]],
        expected: [42]
      },
      {
        input: "head = [9,8,7,6]",
        output: "[6,7,8,9]",
        args: [[9, 8, 7, 6]],
        expected: [6, 7, 8, 9]
      }
    ]
  },

  "maximum-subarray": {
    id: "3",
    slug: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "MEDIUM",
    topics: [{ name: "Arrays" }, { name: "Dynamic Programming" }],
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.`,
    constraints: [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    methodName: "maxSubArray",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @return {number}
 */
var maxSubArray = function(nums) {
    
};`,
      python: `class Solution:
    def maxSubArray(self, nums: list[int]) -> int:
        pass`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        
    }
};`,
      java: `class Solution {
    public int maxSubArray(int[] nums) {
        return 0;
    }
}`
    },
    publicTestCases: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        args: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]],
        expected: 6
      },
      {
        input: "nums = [1]",
        output: "1",
        args: [[1]],
        expected: 1
      },
      {
        input: "nums = [5,4,-1,7,8]",
        output: "23",
        args: [[5, 4, -1, 7, 8]],
        expected: 23
      }
    ],
    hiddenTestCases: [
      {
        input: "nums = [-1]",
        output: "-1",
        args: [[-1]],
        expected: -1
      },
      {
        input: "nums = [-2,-1]",
        output: "-1",
        args: [[-2, -1]],
        expected: -1
      }
    ]
  },

  "valid-parentheses": {
    id: "7",
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "EASY",
    topics: [{ name: "Strings" }, { name: "Stack" }],
    description: `Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ],
    methodName: "isValid",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    
};`,
      python: `class Solution:
    def isValid(self, s: str) -> bool:
        pass`,
      cpp: `#include <string>
#include <stack>
using namespace std;

class Solution {
public:
    bool isValid(string s) {
        
    }
};`,
      java: `class Solution {
    public boolean isValid(String s) {
        return false;
    }
}`
    },
    publicTestCases: [
      {
        input: 's = "()"',
        output: "true",
        args: ["()"],
        expected: true
      },
      {
        input: 's = "()[]{}"',
        output: "true",
        args: ["()[]{}"],
        expected: true
      },
      {
        input: 's = "(]"',
        output: "false",
        args: ["(]"],
        expected: false
      }
    ],
    hiddenTestCases: [
      {
        input: 's = "([)]"',
        output: "false",
        args: ["([)]"],
        expected: false
      },
      {
        input: 's = "{[]}"',
        output: "true",
        args: ["{[]}"],
        expected: true
      }
    ]
  },

  "climbing-stairs": {
    id: "15",
    slug: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "EASY",
    topics: [{ name: "Dynamic Programming" }, { name: "Math" }],
    description: `You are climbing a staircase. It takes \`n\` steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?`,
    constraints: [
      "1 <= n <= 45"
    ],
    methodName: "climbStairs",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {number} n
 * @return {number}
 */
var climbStairs = function(n) {
    
};`,
      python: `class Solution:
    def climbStairs(self, n: int) -> int:
        pass`,
      cpp: `class Solution {
public:
    int climbStairs(int n) {
        
    }
};`,
      java: `class Solution {
    public int climbStairs(int n) {
        return 0;
    }
}`
    },
    publicTestCases: [
      {
        input: "n = 2",
        output: "2",
        args: [2],
        expected: 2
      },
      {
        input: "n = 3",
        output: "3",
        args: [3],
        expected: 3
      },
      {
        input: "n = 4",
        output: "5",
        args: [4],
        expected: 5
      }
    ],
    hiddenTestCases: [
      {
        input: "n = 5",
        output: "8",
        args: [5],
        expected: 8
      },
      {
        input: "n = 1",
        output: "1",
        args: [1],
        expected: 1
      }
    ]
  },

  "longest-substring-without-repeating-characters": {
    id: "6",
    slug: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "MEDIUM",
    topics: [{ name: "Strings" }, { name: "Sliding Window" }],
    description: `Given a string \`s\`, find the length of the longest substring without repeating characters.`,
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ],
    methodName: "lengthOfLongestSubstring",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {string} s
 * @return {number}
 */
var lengthOfLongestSubstring = function(s) {
    
};`,
      python: `class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        pass`,
      cpp: `#include <string>
#include <unordered_set>
using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        
    }
};`,
      java: `class Solution {
    public int lengthOfLongestSubstring(String s) {
        return 0;
    }
}`
    },
    publicTestCases: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        args: ["abcabcbb"],
        expected: 3
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        args: ["bbbbb"],
        expected: 1
      },
      {
        input: 's = "pwwkew"',
        output: "3",
        args: ["pwwkew"],
        expected: 3
      }
    ],
    hiddenTestCases: [
      {
        input: 's = ""',
        output: "0",
        args: [""],
        expected: 0
      },
      {
        input: 's = "au"',
        output: "2",
        args: ["au"],
        expected: 2
      }
    ]
  },

  "search-in-rotated-sorted-array": {
    id: "13",
    slug: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    difficulty: "MEDIUM",
    topics: [{ name: "Binary Search" }, { name: "Arrays" }],
    description: `There is an integer array \`nums\` sorted in ascending order (with distinct values).

Prior to being passed to your function, \`nums\` is possibly rotated at an unknown pivot index.

Given the array \`nums\` after the possible rotation and an integer \`target\`, return the index of \`target\` if it is in \`nums\`, or \`-1\` if it is not in \`nums\`.

You must write an algorithm with O(log n) runtime complexity.`,
    constraints: [
      "1 <= nums.length <= 5000",
      "-10^4 <= nums[i] <= 10^4",
      "All values of nums are unique."
    ],
    methodName: "search",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number}
 */
var search = function(nums, target) {
    
};`,
      python: `class Solution:
    def search(self, nums: list[int], target: int) -> int:
        pass`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        
    }
};`,
      java: `class Solution {
    public int search(int[] nums, int target) {
        return -1;
    }
}`
    },
    publicTestCases: [
      {
        input: "nums = [4,5,6,7,0,1,2], target = 0",
        output: "4",
        args: [[4, 5, 6, 7, 0, 1, 2], 0],
        expected: 4
      },
      {
        input: "nums = [4,5,6,7,0,1,2], target = 3",
        output: "-1",
        args: [[4, 5, 6, 7, 0, 1, 2], 3],
        expected: -1
      },
      {
        input: "nums = [1], target = 0",
        output: "-1",
        args: [[1], 0],
        expected: -1
      }
    ],
    hiddenTestCases: [
      {
        input: "nums = [1,3], target = 3",
        output: "1",
        args: [[1, 3], 3],
        expected: 1
      }
    ]
  },

  "merge-intervals": {
    id: "8",
    slug: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "MEDIUM",
    topics: [{ name: "Arrays" }, { name: "Sorting" }],
    description: `Given an array of \`intervals\` where \`intervals[i] = [starti, endi]\`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.`,
    constraints: [
      "1 <= intervals.length <= 10^4",
      "intervals[i].length == 2",
      "0 <= starti <= endi <= 10^4"
    ],
    methodName: "merge",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {number[][]} intervals
 * @return {number[][]}
 */
var merge = function(intervals) {
    
};`,
      python: `class Solution:
    def merge(self, intervals: list[list[int]]) -> list[list[int]]:
        pass`,
      cpp: `#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        
    }
};`,
      java: `class Solution {
    public int[][] merge(int[][] intervals) {
        return new int[][]{};
    }
}`
    },
    publicTestCases: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        args: [[[1, 3], [2, 6], [8, 10], [15, 18]]],
        expected: [[1, 6], [8, 10], [15, 18]]
      },
      {
        input: "intervals = [[1,4],[4,5]]",
        output: "[[1,5]]",
        args: [[[1, 4], [4, 5]]],
        expected: [[1, 5]]
      }
    ],
    hiddenTestCases: [
      {
        input: "intervals = [[1,4],[0,4]]",
        output: "[[0,4]]",
        args: [[[1, 4], [0, 4]]],
        expected: [[0, 4]]
      }
    ]
  },

  "coin-change": {
    id: "11",
    slug: "coin-change",
    title: "Coin Change",
    difficulty: "MEDIUM",
    topics: [{ name: "Dynamic Programming" }, { name: "Breadth-First Search" }],
    description: `You are given an integer array \`coins\` representing coins of different denominations and an integer \`amount\` representing a total amount of money.

Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return \`-1\`.

You may assume that you have an infinite number of each kind of coin.`,
    constraints: [
      "1 <= coins.length <= 12",
      "1 <= coins[i] <= 2^31 - 1",
      "0 <= amount <= 10^4"
    ],
    methodName: "coinChange",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {number[]} coins
 * @param {number} amount
 * @return {number}
 */
var coinChange = function(coins, amount) {
    
};`,
      python: `class Solution:
    def coinChange(self, coins: list[int], amount: int) -> int:
        pass`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        
    }
};`,
      java: `class Solution {
    public int coinChange(int[] coins, int amount) {
        return -1;
    }
}`
    },
    publicTestCases: [
      {
        input: "coins = [1,2,5], amount = 11",
        output: "3",
        args: [[1, 2, 5], 11],
        expected: 3
      },
      {
        input: "coins = [2], amount = 3",
        output: "-1",
        args: [[2], 3],
        expected: -1
      },
      {
        input: "coins = [1], amount = 0",
        output: "0",
        args: [[1], 0],
        expected: 0
      }
    ],
    hiddenTestCases: [
      {
        input: "coins = [1], amount = 2",
        output: "2",
        args: [[1], 2],
        expected: 2
      }
    ]
  },

  "number-of-islands": {
    id: "4",
    slug: "number-of-islands",
    title: "Number of Islands",
    difficulty: "MEDIUM",
    topics: [{ name: "Graphs" }, { name: "Breadth-First Search" }],
    description: `Given an \`m x n\` 2D binary grid \`grid\` which represents a map of '1's (land) and '0's (water), return the number of islands.

An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.`,
    constraints: [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300",
      "grid[i][j] is '0' or '1'."
    ],
    methodName: "numIslands",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {character[][]} grid
 * @return {number}
 */
var numIslands = function(grid) {
    
};`,
      python: `class Solution:
    def numIslands(self, grid: list[list[str]]) -> int:
        pass`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        
    }
};`,
      java: `class Solution {
    public int numIslands(char[][] grid) {
        return 0;
    }
}`
    },
    publicTestCases: [
      {
        input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        output: "1",
        args: [[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]],
        expected: 1
      },
      {
        input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        output: "3",
        args: [[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]],
        expected: 3
      }
    ],
    hiddenTestCases: [
      {
        input: 'grid = [["1"]]',
        output: "1",
        args: [[["1"]]],
        expected: 1
      }
    ]
  },

  "median-of-two-sorted-arrays": {
    id: "5",
    slug: "median-of-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "HARD",
    topics: [{ name: "Binary Search" }, { name: "Arrays" }],
    description: `Given two sorted arrays \`nums1\` and \`nums2\` of size \`m\` and \`n\` respectively, return the median of the two sorted arrays.
The overall run time complexity should be \`O(log (m+n))\`.`,
    constraints: [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m <= 1000",
      "0 <= n <= 1000",
      "1 <= m + n <= 2000"
    ],
    methodName: "findMedianSortedArrays",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {number[]} nums1
 * @param {number[]} nums2
 * @return {number}
 */
var findMedianSortedArrays = function(nums1, nums2) {
    
};`,
      python: `class Solution:
    def findMedianSortedArrays(self, nums1: list[int], nums2: list[int]) -> float:
        pass`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        
    }
};`,
      java: `class Solution {
    public double findMedianSortedArrays(int[] nums1, int[] nums2) {
        return 0.0;
    }
}`
    },
    publicTestCases: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.0",
        args: [[1, 3], [2]],
        expected: 2.0
      },
      {
        input: "nums1 = [1,2], nums2 = [3,4]",
        output: "2.5",
        args: [[1, 2], [3, 4]],
        expected: 2.5
      }
    ],
    hiddenTestCases: [
      {
        input: "nums1 = [0,0], nums2 = [0,0]",
        output: "0.0",
        args: [[0, 0], [0, 0]],
        expected: 0.0
      },
      {
        input: "nums1 = [], nums2 = [1]",
        output: "1.0",
        args: [[], [1]],
        expected: 1.0
      }
    ]
  },

  "trapping-rain-water": {
    id: "9",
    slug: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "HARD",
    topics: [{ name: "Arrays" }, { name: "Two Pointers" }, { name: "Dynamic Programming" }],
    description: `Given \`n\` non-negative integers representing an elevation map where the width of each bar is \`1\`, compute how much water it can trap after raining.`,
    constraints: [
      "n == height.length",
      "1 <= n <= 2 * 10^4",
      "0 <= height[i] <= 10^5"
    ],
    methodName: "trap",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {number[]} height
 * @return {number}
 */
var trap = function(height) {
    
};`,
      python: `class Solution:
    def trap(self, height: list[int]) -> int:
        pass`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    int trap(vector<int>& height) {
        
    }
};`,
      java: `class Solution {
    public int trap(int[] height) {
        return 0;
    }
}`
    },
    publicTestCases: [
      {
        input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        output: "6",
        args: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]],
        expected: 6
      },
      {
        input: "height = [4,2,0,3,2,5]",
        output: "9",
        args: [[4, 2, 0, 3, 2, 5]],
        expected: 9
      }
    ],
    hiddenTestCases: [
      {
        input: "height = [3,0,2,0,4]",
        output: "7",
        args: [[3, 0, 2, 0, 4]],
        expected: 7
      }
    ]
  },

  "word-search": {
    id: "10",
    slug: "word-search",
    title: "Word Search",
    difficulty: "MEDIUM",
    topics: [{ name: "Arrays" }, { name: "Backtracking" }, { name: "Matrix" }],
    description: `Given an \`m x n\` grid of characters \`board\` and a string \`word\`, return \`true\` if \`word\` exists in the grid.
The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.`,
    constraints: [
      "m == board.length",
      "n = board[i].length",
      "1 <= m, n <= 6",
      "1 <= word.length <= 15"
    ],
    methodName: "exist",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {character[][]} board
 * @param {string} word
 * @return {boolean}
 */
var exist = function(board, word) {
    
};`,
      python: `class Solution:
    def exist(self, board: list[list[str]], word: str) -> bool:
        pass`,
      cpp: `#include <vector>
#include <string>
using namespace std;

class Solution {
public:
    bool exist(vector<vector<char>>& board, string word) {
        
    }
};`,
      java: `class Solution {
    public boolean exist(char[][] board, String word) {
        return false;
    }
}`
    },
    publicTestCases: [
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
        output: "true",
        args: [[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"],
        expected: true
      },
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"',
        output: "true",
        args: [[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "SEE"],
        expected: true
      },
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"',
        output: "false",
        args: [[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCB"],
        expected: false
      }
    ],
    hiddenTestCases: [
      {
        input: 'board = [["a"]], word = "a"',
        output: "true",
        args: [[["a"]], "a"],
        expected: true
      }
    ]
  },

  "binary-tree-level-order-traversal": {
    id: "12",
    slug: "binary-tree-level-order-traversal",
    title: "Binary Tree Level Order Traversal",
    difficulty: "MEDIUM",
    topics: [{ name: "Trees" }, { name: "Breadth-First Search" }],
    description: `Given the root of a binary tree represented as an array of values in level-order, return the level order traversal of its nodes' values.`,
    constraints: [
      "The number of nodes in the tree is in the range [0, 2000].",
      "-1000 <= Node.val <= 1000"
    ],
    methodName: "levelOrder",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {number[]} root
 * @return {number[][]}
 */
var levelOrder = function(root) {
    
};`,
      python: `class Solution:
    def levelOrder(self, root: list[int]) -> list[list[int]]:
        pass`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> levelOrder(vector<int>& root) {
        
    }
};`,
      java: `class Solution {
    public List<List<Integer>> levelOrder(int[] root) {
        return new ArrayList<>();
    }
}`
    },
    publicTestCases: [
      {
        input: "root = [3,9,20,15,7]",
        output: "[[3],[9,20],[15,7]]",
        args: [[3, 9, 20, 15, 7]],
        expected: [[3], [9, 20], [15, 7]]
      },
      {
        input: "root = [1]",
        output: "[[1]]",
        args: [[1]],
        expected: [[1]]
      },
      {
        input: "root = []",
        output: "[]",
        args: [[]],
        expected: []
      }
    ],
    hiddenTestCases: [
      {
        input: "root = [1,2,3]",
        output: "[[1],[2,3]]",
        args: [[1, 2, 3]],
        expected: [[1], [2, 3]]
      }
    ]
  },

  "course-schedule": {
    id: "14",
    slug: "course-schedule",
    title: "Course Schedule",
    difficulty: "MEDIUM",
    topics: [{ name: "Graphs" }, { name: "Topological Sort" }],
    description: `There are a total of \`numCourses\` courses you have to take, labeled from \`0\` to \`numCourses - 1\`. You are given an array \`prerequisites\` where \`prerequisites[i] = [ai, bi]\` indicates that you must take \`bi\` first if you want to take \`ai\`.
Return \`true\` if you can finish all courses. Otherwise, return \`false\`.`,
    constraints: [
      "1 <= numCourses <= 2000",
      "0 <= prerequisites.length <= 5000",
      "prerequisites[i].length == 2",
      "0 <= ai, bi < numCourses"
    ],
    methodName: "canFinish",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
var canFinish = function(numCourses, prerequisites) {
    
};`,
      python: `class Solution:
    def canFinish(self, numCourses: int, prerequisites: list[list[int]]) -> bool:
        pass`,
      cpp: `#include <vector>
using namespace std;

class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        
    }
};`,
      java: `class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        return true;
    }
}`
    },
    publicTestCases: [
      {
        input: "numCourses = 2, prerequisites = [[1,0]]",
        output: "true",
        args: [2, [[1, 0]]],
        expected: true
      },
      {
        input: "numCourses = 2, prerequisites = [[1,0],[0,1]]",
        output: "false",
        args: [2, [[1, 0], [0, 1]]],
        expected: false
      }
    ],
    hiddenTestCases: [
      {
        input: "numCourses = 3, prerequisites = [[1,0],[2,1]]",
        output: "true",
        args: [3, [[1, 0], [2, 1]]],
        expected: true
      }
    ]
  }
};

export function getProblem(slug: string): ProblemDefinition {
  if (typeof window !== "undefined") {
    try {
      const customStore = localStorage.getItem("customProblems");
      if (customStore) {
        const parsed = JSON.parse(customStore);
        if (parsed[slug]) return parsed[slug];
      }
    } catch {}
  }
  if (PROBLEMS_DATABASE[slug]) {
    return PROBLEMS_DATABASE[slug];
  }
  // Default fallback if unknown slug
  return PROBLEMS_DATABASE["two-sum"];
}

export function getCustomProblems(): Record<string, ProblemDefinition> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("customProblems");
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
    localStorage.setItem("customProblems", JSON.stringify(current));
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
      localStorage.setItem("customProblems", JSON.stringify(current));
      window.dispatchEvent(new CustomEvent("codearena_problems_updated", { detail: { slug, deleted: true } }));
      return true;
    }
  } catch (e) {
    console.error("Failed to delete custom problem:", e);
  }
  return false;
}

export function getAllProblems(): ProblemDefinition[] {
  const builtIn = Object.values(PROBLEMS_DATABASE);
  const custom = Object.values(getCustomProblems());
  const map = new Map<string, ProblemDefinition>();
  for (const p of builtIn) {
    map.set(p.slug, p);
  }
  for (const p of custom) {
    map.set(p.slug, p);
  }
  return Array.from(map.values());
}

