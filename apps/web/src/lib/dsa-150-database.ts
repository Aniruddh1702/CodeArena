import { ProblemDefinition } from "./problems-data";

export const DSA_150_PROBLEMS: Record<string, ProblemDefinition> = {
  "two-sum": {
    "id": "1",
    "slug": "two-sum",
    "title": "Two Sum",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Hash Table"
      }
    ],
    "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
    "constraints": [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9"
    ],
    "methodName": "twoSum",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums, target\n * @return {any}\n */\nvar twoSum = function(nums, target) {\n    \n};",
      "python": "class Solution:\n    def twoSum(self, nums, target):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement twoSum\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement twoSum\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [2,7,11,15], target = 9",
        "output": "[0,1]",
        "args": [
          [
            2,
            7,
            11,
            15
          ],
          9
        ],
        "expected": [
          0,
          1
        ]
      },
      {
        "input": "nums = [3,2,4], target = 6",
        "output": "[1,2]",
        "args": [
          [
            3,
            2,
            4
          ],
          6
        ],
        "expected": [
          1,
          2
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [3,3], target = 6",
        "output": "[0,1]",
        "args": [
          [
            3,
            3
          ],
          6
        ],
        "expected": [
          0,
          1
        ]
      },
      {
        "input": "nums = [1,5,8,3], target = 11",
        "output": "[2,3]",
        "args": [
          [
            1,
            5,
            8,
            3
          ],
          11
        ],
        "expected": [
          2,
          3
        ]
      }
    ]
  },
  "valid-parentheses": {
    "id": "2",
    "slug": "valid-parentheses",
    "title": "Valid Parentheses",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Strings"
      },
      {
        "name": "Stack"
      }
    ],
    "description": "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    "constraints": [
      "1 <= s.length <= 10^4"
    ],
    "methodName": "isValid",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s\n * @return {any}\n */\nvar isValid = function(s) {\n    \n};",
      "python": "class Solution:\n    def isValid(self, s):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement isValid\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement isValid\n}"
    },
    "publicTestCases": [
      {
        "input": "s = \"()\"",
        "output": "true",
        "args": [
          "()"
        ],
        "expected": true
      },
      {
        "input": "s = \"()[]{}\"",
        "output": "true",
        "args": [
          "()[]{}"
        ],
        "expected": true
      },
      {
        "input": "s = \"(]\"",
        "output": "false",
        "args": [
          "(]"
        ],
        "expected": false
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s = \"{[]}\"",
        "output": "true",
        "args": [
          "{[]}"
        ],
        "expected": true
      },
      {
        "input": "s = \"([)]\"",
        "output": "false",
        "args": [
          "([)]"
        ],
        "expected": false
      },
      {
        "input": "s = \"((\"",
        "output": "false",
        "args": [
          "(("
        ],
        "expected": false
      }
    ]
  },
  "merge-sorted-array": {
    "id": "3",
    "slug": "merge-sorted-array",
    "title": "Merge Sorted Array",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Two Pointers"
      },
      {
        "name": "Sorting"
      }
    ],
    "description": "You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`. Merge `nums2` into `nums1` as one sorted array.",
    "constraints": [
      "nums1.length == m + n",
      "0 <= m, n <= 200"
    ],
    "methodName": "merge",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums1, m, nums2, n\n * @return {any}\n */\nvar merge = function(nums1, m, nums2, n) {\n    \n};",
      "python": "class Solution:\n    def merge(self, nums1, m, nums2, n):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement merge\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement merge\n}"
    },
    "publicTestCases": [
      {
        "input": "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
        "output": "[1,2,2,3,5,6]",
        "args": [
          [
            1,
            2,
            3,
            0,
            0,
            0
          ],
          3,
          [
            2,
            5,
            6
          ],
          3
        ],
        "expected": [
          1,
          2,
          2,
          3,
          5,
          6
        ]
      },
      {
        "input": "nums1 = [1], m = 1, nums2 = [], n = 0",
        "output": "[1]",
        "args": [
          [
            1
          ],
          1,
          [],
          0
        ],
        "expected": [
          1
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums1 = [0], m = 0, nums2 = [1], n = 1",
        "output": "[1]",
        "args": [
          [
            0
          ],
          0,
          [
            1
          ],
          1
        ],
        "expected": [
          1
        ]
      },
      {
        "input": "nums1 = [4,5,6,0,0,0], m = 3, nums2 = [1,2,3], n = 3",
        "output": "[1,2,3,4,5,6]",
        "args": [
          [
            4,
            5,
            6,
            0,
            0,
            0
          ],
          3,
          [
            1,
            2,
            3
          ],
          3
        ],
        "expected": [
          1,
          2,
          3,
          4,
          5,
          6
        ]
      }
    ]
  },
  "best-time-to-buy-and-sell-stock": {
    "id": "4",
    "slug": "best-time-to-buy-and-sell-stock",
    "title": "Best Time to Buy and Sell Stock",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Dynamic Programming"
      }
    ],
    "description": "You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve.",
    "constraints": [
      "1 <= prices.length <= 10^5",
      "0 <= prices[i] <= 10^4"
    ],
    "methodName": "maxProfit",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} prices\n * @return {any}\n */\nvar maxProfit = function(prices) {\n    \n};",
      "python": "class Solution:\n    def maxProfit(self, prices):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement maxProfit\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement maxProfit\n}"
    },
    "publicTestCases": [
      {
        "input": "prices = [7,1,5,3,6,4]",
        "output": "5",
        "args": [
          [
            7,
            1,
            5,
            3,
            6,
            4
          ]
        ],
        "expected": 5
      },
      {
        "input": "prices = [7,6,4,3,1]",
        "output": "0",
        "args": [
          [
            7,
            6,
            4,
            3,
            1
          ]
        ],
        "expected": 0
      }
    ],
    "hiddenTestCases": [
      {
        "input": "prices = [2,4,1]",
        "output": "2",
        "args": [
          [
            2,
            4,
            1
          ]
        ],
        "expected": 2
      },
      {
        "input": "prices = [1,2,3,4,5]",
        "output": "4",
        "args": [
          [
            1,
            2,
            3,
            4,
            5
          ]
        ],
        "expected": 4
      }
    ]
  },
  "valid-palindrome": {
    "id": "5",
    "slug": "valid-palindrome",
    "title": "Valid Palindrome",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Strings"
      },
      {
        "name": "Two Pointers"
      }
    ],
    "description": "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
    "constraints": [
      "1 <= s.length <= 2 * 10^5"
    ],
    "methodName": "isPalindrome",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s\n * @return {any}\n */\nvar isPalindrome = function(s) {\n    \n};",
      "python": "class Solution:\n    def isPalindrome(self, s):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement isPalindrome\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement isPalindrome\n}"
    },
    "publicTestCases": [
      {
        "input": "s = \"A man, a plan, a canal: Panama\"",
        "output": "true",
        "args": [
          "A man, a plan, a canal: Panama"
        ],
        "expected": true
      },
      {
        "input": "s = \"race a car\"",
        "output": "false",
        "args": [
          "race a car"
        ],
        "expected": false
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s = \" \"",
        "output": "true",
        "args": [
          " "
        ],
        "expected": true
      },
      {
        "input": "s = \"ab_a\"",
        "output": "true",
        "args": [
          "ab_a"
        ],
        "expected": true
      }
    ]
  },
  "climbing-stairs": {
    "id": "6",
    "slug": "climbing-stairs",
    "title": "Climbing Stairs",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Math"
      },
      {
        "name": "Dynamic Programming"
      }
    ],
    "description": "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    "constraints": [
      "1 <= n <= 45"
    ],
    "methodName": "climbStairs",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} n\n * @return {any}\n */\nvar climbStairs = function(n) {\n    \n};",
      "python": "class Solution:\n    def climbStairs(self, n):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement climbStairs\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement climbStairs\n}"
    },
    "publicTestCases": [
      {
        "input": "n = 2",
        "output": "2",
        "args": [
          2
        ],
        "expected": 2
      },
      {
        "input": "n = 3",
        "output": "3",
        "args": [
          3
        ],
        "expected": 3
      }
    ],
    "hiddenTestCases": [
      {
        "input": "n = 4",
        "output": "5",
        "args": [
          4
        ],
        "expected": 5
      },
      {
        "input": "n = 5",
        "output": "8",
        "args": [
          5
        ],
        "expected": 8
      },
      {
        "input": "n = 6",
        "output": "13",
        "args": [
          6
        ],
        "expected": 13
      }
    ]
  },
  "single-number": {
    "id": "7",
    "slug": "single-number",
    "title": "Single Number",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Bit Manipulation"
      }
    ],
    "description": "Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one.",
    "constraints": [
      "1 <= nums.length <= 3 * 10^4",
      "-3 * 10^4 <= nums[i] <= 3 * 10^4"
    ],
    "methodName": "singleNumber",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar singleNumber = function(nums) {\n    \n};",
      "python": "class Solution:\n    def singleNumber(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement singleNumber\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement singleNumber\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [2,2,1]",
        "output": "1",
        "args": [
          [
            2,
            2,
            1
          ]
        ],
        "expected": 1
      },
      {
        "input": "nums = [4,1,2,1,2]",
        "output": "4",
        "args": [
          [
            4,
            1,
            2,
            1,
            2
          ]
        ],
        "expected": 4
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [1]",
        "output": "1",
        "args": [
          [
            1
          ]
        ],
        "expected": 1
      },
      {
        "input": "nums = [9,3,9,5,3]",
        "output": "5",
        "args": [
          [
            9,
            3,
            9,
            5,
            3
          ]
        ],
        "expected": 5
      }
    ]
  },
  "contains-duplicate": {
    "id": "8",
    "slug": "contains-duplicate",
    "title": "Contains Duplicate",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Hash Table"
      }
    ],
    "description": "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
    "constraints": [
      "1 <= nums.length <= 10^5"
    ],
    "methodName": "containsDuplicate",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar containsDuplicate = function(nums) {\n    \n};",
      "python": "class Solution:\n    def containsDuplicate(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement containsDuplicate\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement containsDuplicate\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [1,2,3,1]",
        "output": "true",
        "args": [
          [
            1,
            2,
            3,
            1
          ]
        ],
        "expected": true
      },
      {
        "input": "nums = [1,2,3,4]",
        "output": "false",
        "args": [
          [
            1,
            2,
            3,
            4
          ]
        ],
        "expected": false
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [1,1,1,3,3,4,3,2,4,2]",
        "output": "true",
        "args": [
          [
            1,
            1,
            1,
            3,
            3,
            4,
            3,
            2,
            4,
            2
          ]
        ],
        "expected": true
      },
      {
        "input": "nums = [5]",
        "output": "false",
        "args": [
          [
            5
          ]
        ],
        "expected": false
      }
    ]
  },
  "missing-number": {
    "id": "9",
    "slug": "missing-number",
    "title": "Missing Number",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Math"
      },
      {
        "name": "Bit Manipulation"
      }
    ],
    "description": "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.",
    "constraints": [
      "n == nums.length",
      "1 <= n <= 10^4"
    ],
    "methodName": "missingNumber",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar missingNumber = function(nums) {\n    \n};",
      "python": "class Solution:\n    def missingNumber(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement missingNumber\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement missingNumber\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [3,0,1]",
        "output": "2",
        "args": [
          [
            3,
            0,
            1
          ]
        ],
        "expected": 2
      },
      {
        "input": "nums = [0,1]",
        "output": "2",
        "args": [
          [
            0,
            1
          ]
        ],
        "expected": 2
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [9,6,4,2,3,5,7,0,1]",
        "output": "8",
        "args": [
          [
            9,
            6,
            4,
            2,
            3,
            5,
            7,
            0,
            1
          ]
        ],
        "expected": 8
      },
      {
        "input": "nums = [0]",
        "output": "1",
        "args": [
          [
            0
          ]
        ],
        "expected": 1
      }
    ]
  },
  "reverse-string": {
    "id": "10",
    "slug": "reverse-string",
    "title": "Reverse String",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Strings"
      },
      {
        "name": "Two Pointers"
      }
    ],
    "description": "Write a function that reverses an array of characters in-place.",
    "constraints": [
      "1 <= s.length <= 10^5"
    ],
    "methodName": "reverseString",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s\n * @return {any}\n */\nvar reverseString = function(s) {\n    \n};",
      "python": "class Solution:\n    def reverseString(self, s):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement reverseString\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement reverseString\n}"
    },
    "publicTestCases": [
      {
        "input": "s = [\"h\",\"e\",\"l\",\"l\",\"o\"]",
        "output": "[\"o\",\"l\",\"l\",\"e\",\"h\"]",
        "args": [
          [
            "h",
            "e",
            "l",
            "l",
            "o"
          ]
        ],
        "expected": [
          "o",
          "l",
          "l",
          "e",
          "h"
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s = [\"H\",\"a\",\"n\",\"n\",\"a\",\"h\"]",
        "output": "[\"h\",\"a\",\"n\",\"n\",\"a\",\"H\"]",
        "args": [
          [
            "H",
            "a",
            "n",
            "n",
            "a",
            "h"
          ]
        ],
        "expected": [
          "h",
          "a",
          "n",
          "n",
          "a",
          "H"
        ]
      },
      {
        "input": "s = [\"a\"]",
        "output": "[\"a\"]",
        "args": [
          [
            "a"
          ]
        ],
        "expected": [
          "a"
        ]
      }
    ]
  },
  "valid-anagram": {
    "id": "11",
    "slug": "valid-anagram",
    "title": "Valid Anagram",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Hash Table"
      },
      {
        "name": "Strings"
      }
    ],
    "description": "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.",
    "constraints": [
      "1 <= s.length, t.length <= 5 * 10^4"
    ],
    "methodName": "isAnagram",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s, t\n * @return {any}\n */\nvar isAnagram = function(s, t) {\n    \n};",
      "python": "class Solution:\n    def isAnagram(self, s, t):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement isAnagram\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement isAnagram\n}"
    },
    "publicTestCases": [
      {
        "input": "s = \"anagram\", t = \"nagaram\"",
        "output": "true",
        "args": [
          "anagram",
          "nagaram"
        ],
        "expected": true
      },
      {
        "input": "s = \"rat\", t = \"car\"",
        "output": "false",
        "args": [
          "rat",
          "car"
        ],
        "expected": false
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s = \"a\", t = \"ab\"",
        "output": "false",
        "args": [
          "a",
          "ab"
        ],
        "expected": false
      },
      {
        "input": "s = \"listen\", t = \"silent\"",
        "output": "true",
        "args": [
          "listen",
          "silent"
        ],
        "expected": true
      }
    ]
  },
  "binary-search": {
    "id": "12",
    "slug": "binary-search",
    "title": "Binary Search",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Binary Search"
      }
    ],
    "description": "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.",
    "constraints": [
      "1 <= nums.length <= 10^4",
      "-10^4 < nums[i], target < 10^4"
    ],
    "methodName": "search",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums, target\n * @return {any}\n */\nvar search = function(nums, target) {\n    \n};",
      "python": "class Solution:\n    def search(self, nums, target):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement search\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement search\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [-1,0,3,5,9,12], target = 9",
        "output": "4",
        "args": [
          [
            -1,
            0,
            3,
            5,
            9,
            12
          ],
          9
        ],
        "expected": 4
      },
      {
        "input": "nums = [-1,0,3,5,9,12], target = 2",
        "output": "-1",
        "args": [
          [
            -1,
            0,
            3,
            5,
            9,
            12
          ],
          2
        ],
        "expected": -1
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [5], target = 5",
        "output": "0",
        "args": [
          [
            5
          ],
          5
        ],
        "expected": 0
      },
      {
        "input": "nums = [1,3,5,7,9], target = 1",
        "output": "0",
        "args": [
          [
            1,
            3,
            5,
            7,
            9
          ],
          1
        ],
        "expected": 0
      }
    ]
  },
  "maximum-subarray": {
    "id": "13",
    "slug": "maximum-subarray",
    "title": "Maximum Subarray",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Divide and Conquer"
      },
      {
        "name": "Dynamic Programming"
      }
    ],
    "description": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    "methodName": "maxSubArray",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar maxSubArray = function(nums) {\n    \n};",
      "python": "class Solution:\n    def maxSubArray(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement maxSubArray\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement maxSubArray\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        "output": "6",
        "args": [
          [
            -2,
            1,
            -3,
            4,
            -1,
            2,
            1,
            -5,
            4
          ]
        ],
        "expected": 6
      },
      {
        "input": "nums = [1]",
        "output": "1",
        "args": [
          [
            1
          ]
        ],
        "expected": 1
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [5,4,-1,7,8]",
        "output": "23",
        "args": [
          [
            5,
            4,
            -1,
            7,
            8
          ]
        ],
        "expected": 23
      },
      {
        "input": "nums = [-1,-2]",
        "output": "-1",
        "args": [
          [
            -1,
            -2
          ]
        ],
        "expected": -1
      }
    ]
  },
  "move-zeroes": {
    "id": "14",
    "slug": "move-zeroes",
    "title": "Move Zeroes",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Two Pointers"
      }
    ],
    "description": "Given an integer array `nums`, move all `0`'s to the end of it while maintaining the relative order of the non-zero elements in-place.",
    "constraints": [
      "1 <= nums.length <= 10^4"
    ],
    "methodName": "moveZeroes",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar moveZeroes = function(nums) {\n    \n};",
      "python": "class Solution:\n    def moveZeroes(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement moveZeroes\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement moveZeroes\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [0,1,0,3,12]",
        "output": "[1,3,12,0,0]",
        "args": [
          [
            0,
            1,
            0,
            3,
            12
          ]
        ],
        "expected": [
          1,
          3,
          12,
          0,
          0
        ]
      },
      {
        "input": "nums = [0]",
        "output": "[0]",
        "args": [
          [
            0
          ]
        ],
        "expected": [
          0
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [1,2,3]",
        "output": "[1,2,3]",
        "args": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": [
          1,
          2,
          3
        ]
      },
      {
        "input": "nums = [0,0,1]",
        "output": "[1,0,0]",
        "args": [
          [
            0,
            0,
            1
          ]
        ],
        "expected": [
          1,
          0,
          0
        ]
      }
    ]
  },
  "plus-one": {
    "id": "15",
    "slug": "plus-one",
    "title": "Plus One",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Math"
      }
    ],
    "description": "You are given a large integer represented as an integer array `digits`. Increment the large integer by one and return the resulting array of digits.",
    "constraints": [
      "1 <= digits.length <= 100"
    ],
    "methodName": "plusOne",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} digits\n * @return {any}\n */\nvar plusOne = function(digits) {\n    \n};",
      "python": "class Solution:\n    def plusOne(self, digits):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement plusOne\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement plusOne\n}"
    },
    "publicTestCases": [
      {
        "input": "digits = [1,2,3]",
        "output": "[1,2,4]",
        "args": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": [
          1,
          2,
          4
        ]
      },
      {
        "input": "digits = [4,3,2,1]",
        "output": "[4,3,2,2]",
        "args": [
          [
            4,
            3,
            2,
            1
          ]
        ],
        "expected": [
          4,
          3,
          2,
          2
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "digits = [9]",
        "output": "[1,0]",
        "args": [
          [
            9
          ]
        ],
        "expected": [
          1,
          0
        ]
      },
      {
        "input": "digits = [9,9,9]",
        "output": "[1,0,0,0]",
        "args": [
          [
            9,
            9,
            9
          ]
        ],
        "expected": [
          1,
          0,
          0,
          0
        ]
      }
    ]
  },
  "sqrt-x": {
    "id": "16",
    "slug": "sqrt-x",
    "title": "Sqrt(x)",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Math"
      },
      {
        "name": "Binary Search"
      }
    ],
    "description": "Given a non-negative integer `x`, return the square root of `x` rounded down to the nearest integer.",
    "constraints": [
      "0 <= x <= 2^31 - 1"
    ],
    "methodName": "mySqrt",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} x\n * @return {any}\n */\nvar mySqrt = function(x) {\n    \n};",
      "python": "class Solution:\n    def mySqrt(self, x):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement mySqrt\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement mySqrt\n}"
    },
    "publicTestCases": [
      {
        "input": "x = 4",
        "output": "2",
        "args": [
          4
        ],
        "expected": 2
      },
      {
        "input": "x = 8",
        "output": "2",
        "args": [
          8
        ],
        "expected": 2
      }
    ],
    "hiddenTestCases": [
      {
        "input": "x = 0",
        "output": "0",
        "args": [
          0
        ],
        "expected": 0
      },
      {
        "input": "x = 1",
        "output": "1",
        "args": [
          1
        ],
        "expected": 1
      },
      {
        "input": "x = 16",
        "output": "4",
        "args": [
          16
        ],
        "expected": 4
      },
      {
        "input": "x = 25",
        "output": "5",
        "args": [
          25
        ],
        "expected": 5
      }
    ]
  },
  "first-unique-character-in-a-string": {
    "id": "17",
    "slug": "first-unique-character-in-a-string",
    "title": "First Unique Character in a String",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Hash Table"
      },
      {
        "name": "Strings"
      }
    ],
    "description": "Given a string `s`, find the first non-repeating character in it and return its index. If it does not exist, return `-1`.",
    "constraints": [
      "1 <= s.length <= 10^5"
    ],
    "methodName": "firstUniqChar",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s\n * @return {any}\n */\nvar firstUniqChar = function(s) {\n    \n};",
      "python": "class Solution:\n    def firstUniqChar(self, s):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement firstUniqChar\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement firstUniqChar\n}"
    },
    "publicTestCases": [
      {
        "input": "s = \"leetcode\"",
        "output": "0",
        "args": [
          "leetcode"
        ],
        "expected": 0
      },
      {
        "input": "s = \"loveleetcode\"",
        "output": "2",
        "args": [
          "loveleetcode"
        ],
        "expected": 2
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s = \"aabb\"",
        "output": "-1",
        "args": [
          "aabb"
        ],
        "expected": -1
      },
      {
        "input": "s = \"z\"",
        "output": "0",
        "args": [
          "z"
        ],
        "expected": 0
      }
    ]
  },
  "pascals-triangle": {
    "id": "18",
    "slug": "pascals-triangle",
    "title": "Pascal's Triangle",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Dynamic Programming"
      }
    ],
    "description": "Given an integer `numRows`, return the first numRows of Pascal's triangle.",
    "constraints": [
      "1 <= numRows <= 30"
    ],
    "methodName": "generate",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} numRows\n * @return {any}\n */\nvar generate = function(numRows) {\n    \n};",
      "python": "class Solution:\n    def generate(self, numRows):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement generate\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement generate\n}"
    },
    "publicTestCases": [
      {
        "input": "numRows = 5",
        "output": "[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]",
        "args": [
          5
        ],
        "expected": [
          [
            1
          ],
          [
            1,
            1
          ],
          [
            1,
            2,
            1
          ],
          [
            1,
            3,
            3,
            1
          ],
          [
            1,
            4,
            6,
            4,
            1
          ]
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "numRows = 1",
        "output": "[[1]]",
        "args": [
          1
        ],
        "expected": [
          [
            1
          ]
        ]
      },
      {
        "input": "numRows = 2",
        "output": "[[1],[1,1]]",
        "args": [
          2
        ],
        "expected": [
          [
            1
          ],
          [
            1,
            1
          ]
        ]
      }
    ]
  },
  "majority-element": {
    "id": "19",
    "slug": "majority-element",
    "title": "Majority Element",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Hash Table"
      },
      {
        "name": "Divide and Conquer"
      }
    ],
    "description": "Given an array `nums` of size `n`, return the majority element that appears more than ⌊n / 2⌋ times.",
    "constraints": [
      "1 <= nums.length <= 5 * 10^4"
    ],
    "methodName": "majorityElement",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar majorityElement = function(nums) {\n    \n};",
      "python": "class Solution:\n    def majorityElement(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement majorityElement\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement majorityElement\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [3,2,3]",
        "output": "3",
        "args": [
          [
            3,
            2,
            3
          ]
        ],
        "expected": 3
      },
      {
        "input": "nums = [2,2,1,1,1,2,2]",
        "output": "2",
        "args": [
          [
            2,
            2,
            1,
            1,
            1,
            2,
            2
          ]
        ],
        "expected": 2
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [1]",
        "output": "1",
        "args": [
          [
            1
          ]
        ],
        "expected": 1
      },
      {
        "input": "nums = [6,5,5]",
        "output": "5",
        "args": [
          [
            6,
            5,
            5
          ]
        ],
        "expected": 5
      }
    ]
  },
  "number-of-1-bits": {
    "id": "20",
    "slug": "number-of-1-bits",
    "title": "Number of 1 Bits",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Bit Manipulation"
      }
    ],
    "description": "Write a function that takes the binary representation of a positive integer and returns the number of set bits it has (Hamming weight).",
    "constraints": [
      "1 <= n <= 2^31 - 1"
    ],
    "methodName": "hammingWeight",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} n\n * @return {any}\n */\nvar hammingWeight = function(n) {\n    \n};",
      "python": "class Solution:\n    def hammingWeight(self, n):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement hammingWeight\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement hammingWeight\n}"
    },
    "publicTestCases": [
      {
        "input": "n = 11",
        "output": "3",
        "args": [
          11
        ],
        "expected": 3
      },
      {
        "input": "n = 128",
        "output": "1",
        "args": [
          128
        ],
        "expected": 1
      }
    ],
    "hiddenTestCases": [
      {
        "input": "n = 2147483645",
        "output": "30",
        "args": [
          2147483645
        ],
        "expected": 30
      },
      {
        "input": "n = 0",
        "output": "0",
        "args": [
          0
        ],
        "expected": 0
      }
    ]
  },
  "happy-number": {
    "id": "21",
    "slug": "happy-number",
    "title": "Happy Number",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Hash Table"
      },
      {
        "name": "Math"
      },
      {
        "name": "Two Pointers"
      }
    ],
    "description": "Write an algorithm to determine if a number `n` is happy.",
    "constraints": [
      "1 <= n <= 2^31 - 1"
    ],
    "methodName": "isHappy",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} n\n * @return {any}\n */\nvar isHappy = function(n) {\n    \n};",
      "python": "class Solution:\n    def isHappy(self, n):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement isHappy\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement isHappy\n}"
    },
    "publicTestCases": [
      {
        "input": "n = 19",
        "output": "true",
        "args": [
          19
        ],
        "expected": true
      },
      {
        "input": "n = 2",
        "output": "false",
        "args": [
          2
        ],
        "expected": false
      }
    ],
    "hiddenTestCases": [
      {
        "input": "n = 7",
        "output": "true",
        "args": [
          7
        ],
        "expected": true
      },
      {
        "input": "n = 1",
        "output": "true",
        "args": [
          1
        ],
        "expected": true
      }
    ]
  },
  "roman-to-integer": {
    "id": "22",
    "slug": "roman-to-integer",
    "title": "Roman to Integer",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Hash Table"
      },
      {
        "name": "Math"
      },
      {
        "name": "Strings"
      }
    ],
    "description": "Given a roman numeral, convert it to an integer.",
    "constraints": [
      "1 <= s.length <= 15"
    ],
    "methodName": "romanToInt",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s\n * @return {any}\n */\nvar romanToInt = function(s) {\n    \n};",
      "python": "class Solution:\n    def romanToInt(self, s):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement romanToInt\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement romanToInt\n}"
    },
    "publicTestCases": [
      {
        "input": "s = \"III\"",
        "output": "3",
        "args": [
          "III"
        ],
        "expected": 3
      },
      {
        "input": "s = \"LVIII\"",
        "output": "58",
        "args": [
          "LVIII"
        ],
        "expected": 58
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s = \"MCMXCIV\"",
        "output": "1994",
        "args": [
          "MCMXCIV"
        ],
        "expected": 1994
      },
      {
        "input": "s = \"IV\"",
        "output": "4",
        "args": [
          "IV"
        ],
        "expected": 4
      },
      {
        "input": "s = \"IX\"",
        "output": "9",
        "args": [
          "IX"
        ],
        "expected": 9
      }
    ]
  },
  "longest-common-prefix": {
    "id": "23",
    "slug": "longest-common-prefix",
    "title": "Longest Common Prefix",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Strings"
      },
      {
        "name": "Trie"
      }
    ],
    "description": "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string `\"\"`.",
    "constraints": [
      "1 <= strs.length <= 200"
    ],
    "methodName": "longestCommonPrefix",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} strs\n * @return {any}\n */\nvar longestCommonPrefix = function(strs) {\n    \n};",
      "python": "class Solution:\n    def longestCommonPrefix(self, strs):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement longestCommonPrefix\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement longestCommonPrefix\n}"
    },
    "publicTestCases": [
      {
        "input": "strs = [\"flower\",\"flow\",\"flight\"]",
        "output": "\"fl\"",
        "args": [
          [
            "flower",
            "flow",
            "flight"
          ]
        ],
        "expected": "fl"
      },
      {
        "input": "strs = [\"dog\",\"racecar\",\"car\"]",
        "output": "\"\"",
        "args": [
          [
            "dog",
            "racecar",
            "car"
          ]
        ],
        "expected": ""
      }
    ],
    "hiddenTestCases": [
      {
        "input": "strs = [\"a\"]",
        "output": "\"a\"",
        "args": [
          [
            "a"
          ]
        ],
        "expected": "a"
      },
      {
        "input": "strs = [\"interspecies\",\"interstellar\",\"interstate\"]",
        "output": "\"inters\"",
        "args": [
          [
            "interspecies",
            "interstellar",
            "interstate"
          ]
        ],
        "expected": "inters"
      }
    ]
  },
  "remove-duplicates-from-sorted-array": {
    "id": "24",
    "slug": "remove-duplicates-from-sorted-array",
    "title": "Remove Duplicates from Sorted Array",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Two Pointers"
      }
    ],
    "description": "Given an integer array `nums` sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return the number of unique elements `k`.",
    "constraints": [
      "1 <= nums.length <= 3 * 10^4"
    ],
    "methodName": "removeDuplicates",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar removeDuplicates = function(nums) {\n    \n};",
      "python": "class Solution:\n    def removeDuplicates(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement removeDuplicates\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement removeDuplicates\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [1,1,2]",
        "output": "2",
        "args": [
          [
            1,
            1,
            2
          ]
        ],
        "expected": 2
      },
      {
        "input": "nums = [0,0,1,1,1,2,2,3,3,4]",
        "output": "5",
        "args": [
          [
            0,
            0,
            1,
            1,
            1,
            2,
            2,
            3,
            3,
            4
          ]
        ],
        "expected": 5
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [1]",
        "output": "1",
        "args": [
          [
            1
          ]
        ],
        "expected": 1
      },
      {
        "input": "nums = [1,2,3,4]",
        "output": "4",
        "args": [
          [
            1,
            2,
            3,
            4
          ]
        ],
        "expected": 4
      }
    ]
  },
  "remove-element": {
    "id": "25",
    "slug": "remove-element",
    "title": "Remove Element",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Two Pointers"
      }
    ],
    "description": "Given an integer array `nums` and an integer `val`, remove all occurrences of `val` in `nums` in-place. Return the number of elements in `nums` which are not equal to `val`.",
    "constraints": [
      "0 <= nums.length <= 100"
    ],
    "methodName": "removeElement",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums, val\n * @return {any}\n */\nvar removeElement = function(nums, val) {\n    \n};",
      "python": "class Solution:\n    def removeElement(self, nums, val):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement removeElement\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement removeElement\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [3,2,2,3], val = 3",
        "output": "2",
        "args": [
          [
            3,
            2,
            2,
            3
          ],
          3
        ],
        "expected": 2
      },
      {
        "input": "nums = [0,1,2,2,3,0,4,2], val = 2",
        "output": "5",
        "args": [
          [
            0,
            1,
            2,
            2,
            3,
            0,
            4,
            2
          ],
          2
        ],
        "expected": 5
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [], val = 0",
        "output": "0",
        "args": [
          [],
          0
        ],
        "expected": 0
      },
      {
        "input": "nums = [1], val = 1",
        "output": "0",
        "args": [
          [
            1
          ],
          1
        ],
        "expected": 0
      }
    ]
  },
  "search-insert-position": {
    "id": "26",
    "slug": "search-insert-position",
    "title": "Search Insert Position",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Binary Search"
      }
    ],
    "description": "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.",
    "constraints": [
      "1 <= nums.length <= 10^4"
    ],
    "methodName": "searchInsert",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums, target\n * @return {any}\n */\nvar searchInsert = function(nums, target) {\n    \n};",
      "python": "class Solution:\n    def searchInsert(self, nums, target):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement searchInsert\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement searchInsert\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [1,3,5,6], target = 5",
        "output": "2",
        "args": [
          [
            1,
            3,
            5,
            6
          ],
          5
        ],
        "expected": 2
      },
      {
        "input": "nums = [1,3,5,6], target = 2",
        "output": "1",
        "args": [
          [
            1,
            3,
            5,
            6
          ],
          2
        ],
        "expected": 1
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [1,3,5,6], target = 7",
        "output": "4",
        "args": [
          [
            1,
            3,
            5,
            6
          ],
          7
        ],
        "expected": 4
      },
      {
        "input": "nums = [1,3,5,6], target = 0",
        "output": "0",
        "args": [
          [
            1,
            3,
            5,
            6
          ],
          0
        ],
        "expected": 0
      }
    ]
  },
  "length-of-last-word": {
    "id": "27",
    "slug": "length-of-last-word",
    "title": "Length of Last Word",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Strings"
      }
    ],
    "description": "Given a string `s` consisting of words and spaces, return the length of the last word in the string.",
    "constraints": [
      "1 <= s.length <= 10^4"
    ],
    "methodName": "lengthOfLastWord",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s\n * @return {any}\n */\nvar lengthOfLastWord = function(s) {\n    \n};",
      "python": "class Solution:\n    def lengthOfLastWord(self, s):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement lengthOfLastWord\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement lengthOfLastWord\n}"
    },
    "publicTestCases": [
      {
        "input": "s = \"Hello World\"",
        "output": "5",
        "args": [
          "Hello World"
        ],
        "expected": 5
      },
      {
        "input": "s = \"   fly me   to   the moon  \"",
        "output": "4",
        "args": [
          "   fly me   to   the moon  "
        ],
        "expected": 4
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s = \"luffy is still joyboy\"",
        "output": "6",
        "args": [
          "luffy is still joyboy"
        ],
        "expected": 6
      },
      {
        "input": "s = \"a\"",
        "output": "1",
        "args": [
          "a"
        ],
        "expected": 1
      }
    ]
  },
  "counting-bits": {
    "id": "28",
    "slug": "counting-bits",
    "title": "Counting Bits",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Dynamic Programming"
      },
      {
        "name": "Bit Manipulation"
      }
    ],
    "description": "Given an integer `n`, return an array `ans` of length `n + 1` such that for each `i` (`0 <= i <= n`), `ans[i]` is the number of `1`'s in the binary representation of `i`.",
    "constraints": [
      "0 <= n <= 10^5"
    ],
    "methodName": "countBits",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} n\n * @return {any}\n */\nvar countBits = function(n) {\n    \n};",
      "python": "class Solution:\n    def countBits(self, n):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement countBits\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement countBits\n}"
    },
    "publicTestCases": [
      {
        "input": "n = 2",
        "output": "[0,1,1]",
        "args": [
          2
        ],
        "expected": [
          0,
          1,
          1
        ]
      },
      {
        "input": "n = 5",
        "output": "[0,1,1,2,1,2]",
        "args": [
          5
        ],
        "expected": [
          0,
          1,
          1,
          2,
          1,
          2
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "n = 0",
        "output": "[0]",
        "args": [
          0
        ],
        "expected": [
          0
        ]
      },
      {
        "input": "n = 1",
        "output": "[0,1]",
        "args": [
          1
        ],
        "expected": [
          0,
          1
        ]
      }
    ]
  },
  "ransom-note": {
    "id": "29",
    "slug": "ransom-note",
    "title": "Ransom Note",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Hash Table"
      },
      {
        "name": "Strings"
      },
      {
        "name": "Counting"
      }
    ],
    "description": "Given two strings `ransomNote` and `magazine`, return `true` if `ransomNote` can be constructed by using the letters from `magazine` and `false` otherwise.",
    "constraints": [
      "1 <= ransomNote.length, magazine.length <= 10^5"
    ],
    "methodName": "canConstruct",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} ransomNote, magazine\n * @return {any}\n */\nvar canConstruct = function(ransomNote, magazine) {\n    \n};",
      "python": "class Solution:\n    def canConstruct(self, ransomNote, magazine):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement canConstruct\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement canConstruct\n}"
    },
    "publicTestCases": [
      {
        "input": "ransomNote = \"a\", magazine = \"b\"",
        "output": "false",
        "args": [
          "a",
          "b"
        ],
        "expected": false
      },
      {
        "input": "ransomNote = \"aa\", magazine = \"aab\"",
        "output": "true",
        "args": [
          "aa",
          "aab"
        ],
        "expected": true
      }
    ],
    "hiddenTestCases": [
      {
        "input": "ransomNote = \"aa\", magazine = \"ab\"",
        "output": "false",
        "args": [
          "aa",
          "ab"
        ],
        "expected": false
      },
      {
        "input": "ransomNote = \"bg\", magazine = \"efjbdfbdgfjhhaiigfhbaejahgfbbgbjagbddfgdiaigdadhcfcj\"",
        "output": "true",
        "args": [
          "bg",
          "efjbdfbdgfjhhaiigfhbaejahgfbbgbjagbddfgdiaigdadhcfcj"
        ],
        "expected": true
      }
    ]
  },
  "is-subsequence": {
    "id": "30",
    "slug": "is-subsequence",
    "title": "Is Subsequence",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Two Pointers"
      },
      {
        "name": "Strings"
      },
      {
        "name": "Dynamic Programming"
      }
    ],
    "description": "Given two strings `s` and `t`, return `true` if `s` is a subsequence of `t`, or `false` otherwise.",
    "constraints": [
      "0 <= s.length <= 100",
      "0 <= t.length <= 10^4"
    ],
    "methodName": "isSubsequence",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s, t\n * @return {any}\n */\nvar isSubsequence = function(s, t) {\n    \n};",
      "python": "class Solution:\n    def isSubsequence(self, s, t):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement isSubsequence\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement isSubsequence\n}"
    },
    "publicTestCases": [
      {
        "input": "s = \"abc\", t = \"ahbgdc\"",
        "output": "true",
        "args": [
          "abc",
          "ahbgdc"
        ],
        "expected": true
      },
      {
        "input": "s = \"axc\", t = \"ahbgdc\"",
        "output": "false",
        "args": [
          "axc",
          "ahbgdc"
        ],
        "expected": false
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s = \"\", t = \"ahbgdc\"",
        "output": "true",
        "args": [
          "",
          "ahbgdc"
        ],
        "expected": true
      },
      {
        "input": "s = \"b\", t = \"c\"",
        "output": "false",
        "args": [
          "b",
          "c"
        ],
        "expected": false
      }
    ]
  },
  "squares-of-a-sorted-array": {
    "id": "31",
    "slug": "squares-of-a-sorted-array",
    "title": "Squares of a Sorted Array",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Two Pointers"
      },
      {
        "name": "Sorting"
      }
    ],
    "description": "Given an integer array `nums` sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.",
    "constraints": [
      "1 <= nums.length <= 10^4"
    ],
    "methodName": "sortedSquares",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar sortedSquares = function(nums) {\n    \n};",
      "python": "class Solution:\n    def sortedSquares(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement sortedSquares\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement sortedSquares\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [-4,-1,0,3,10]",
        "output": "[0,1,9,16,100]",
        "args": [
          [
            -4,
            -1,
            0,
            3,
            10
          ]
        ],
        "expected": [
          0,
          1,
          9,
          16,
          100
        ]
      },
      {
        "input": "nums = [-7,-3,2,3,11]",
        "output": "[4,9,9,49,121]",
        "args": [
          [
            -7,
            -3,
            2,
            3,
            11
          ]
        ],
        "expected": [
          4,
          9,
          9,
          49,
          121
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [0]",
        "output": "[0]",
        "args": [
          [
            0
          ]
        ],
        "expected": [
          0
        ]
      },
      {
        "input": "nums = [-5,-3,-2,-1]",
        "output": "[1,4,9,25]",
        "args": [
          [
            -5,
            -3,
            -2,
            -1
          ]
        ],
        "expected": [
          1,
          4,
          9,
          25
        ]
      }
    ]
  },
  "backspace-string-compare": {
    "id": "32",
    "slug": "backspace-string-compare",
    "title": "Backspace String Compare",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Two Pointers"
      },
      {
        "name": "Strings"
      },
      {
        "name": "Stack"
      }
    ],
    "description": "Given two strings `s` and `t`, return `true` if they are equal when both are typed into empty text editors. '#' means a backspace character.",
    "constraints": [
      "1 <= s.length, t.length <= 200"
    ],
    "methodName": "backspaceCompare",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s, t\n * @return {any}\n */\nvar backspaceCompare = function(s, t) {\n    \n};",
      "python": "class Solution:\n    def backspaceCompare(self, s, t):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement backspaceCompare\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement backspaceCompare\n}"
    },
    "publicTestCases": [
      {
        "input": "s = \"ab#c\", t = \"ad#c\"",
        "output": "true",
        "args": [
          "ab#c",
          "ad#c"
        ],
        "expected": true
      },
      {
        "input": "s = \"ab##\", t = \"c#d#\"",
        "output": "true",
        "args": [
          "ab##",
          "c#d#"
        ],
        "expected": true
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s = \"a#c\", t = \"b\"",
        "output": "false",
        "args": [
          "a#c",
          "b"
        ],
        "expected": false
      },
      {
        "input": "s = \"a##c\", t = \"#a#c\"",
        "output": "true",
        "args": [
          "a##c",
          "#a#c"
        ],
        "expected": true
      }
    ]
  },
  "last-stone-weight": {
    "id": "33",
    "slug": "last-stone-weight",
    "title": "Last Stone Weight",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Heap"
      }
    ],
    "description": "You are given an array of integers `stones` where `stones[i]` is the weight of the ith stone. Smash the two heaviest stones until at most 1 stone remains. Return the weight of the last remaining stone, or 0 if none remain.",
    "constraints": [
      "1 <= stones.length <= 30"
    ],
    "methodName": "lastStoneWeight",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} stones\n * @return {any}\n */\nvar lastStoneWeight = function(stones) {\n    \n};",
      "python": "class Solution:\n    def lastStoneWeight(self, stones):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement lastStoneWeight\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement lastStoneWeight\n}"
    },
    "publicTestCases": [
      {
        "input": "stones = [2,7,4,1,8,1]",
        "output": "1",
        "args": [
          [
            2,
            7,
            4,
            1,
            8,
            1
          ]
        ],
        "expected": 1
      },
      {
        "input": "stones = [1]",
        "output": "1",
        "args": [
          [
            1
          ]
        ],
        "expected": 1
      }
    ],
    "hiddenTestCases": [
      {
        "input": "stones = [2,2]",
        "output": "0",
        "args": [
          [
            2,
            2
          ]
        ],
        "expected": 0
      },
      {
        "input": "stones = [3,7,2]",
        "output": "2",
        "args": [
          [
            3,
            7,
            2
          ]
        ],
        "expected": 2
      }
    ]
  },
  "min-cost-climbing-stairs": {
    "id": "34",
    "slug": "min-cost-climbing-stairs",
    "title": "Min Cost Climbing Stairs",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Dynamic Programming"
      }
    ],
    "description": "You are given an integer array `cost` where `cost[i]` is the cost of ith step on a staircase. Return the minimum cost to reach the top of the floor.",
    "constraints": [
      "2 <= cost.length <= 1000"
    ],
    "methodName": "minCostClimbingStairs",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} cost\n * @return {any}\n */\nvar minCostClimbingStairs = function(cost) {\n    \n};",
      "python": "class Solution:\n    def minCostClimbingStairs(self, cost):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement minCostClimbingStairs\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement minCostClimbingStairs\n}"
    },
    "publicTestCases": [
      {
        "input": "cost = [10,15,20]",
        "output": "15",
        "args": [
          [
            10,
            15,
            20
          ]
        ],
        "expected": 15
      },
      {
        "input": "cost = [1,100,1,1,1,100,1,1,100,1]",
        "output": "6",
        "args": [
          [
            1,
            100,
            1,
            1,
            1,
            100,
            1,
            1,
            100,
            1
          ]
        ],
        "expected": 6
      }
    ],
    "hiddenTestCases": [
      {
        "input": "cost = [0,0,0,0]",
        "output": "0",
        "args": [
          [
            0,
            0,
            0,
            0
          ]
        ],
        "expected": 0
      },
      {
        "input": "cost = [10,15]",
        "output": "10",
        "args": [
          [
            10,
            15
          ]
        ],
        "expected": 10
      }
    ]
  },
  "find-pivot-index": {
    "id": "35",
    "slug": "find-pivot-index",
    "title": "Find Pivot Index",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Prefix Sum"
      }
    ],
    "description": "Given an array of integers `nums`, calculate the pivot index where the sum of all the numbers strictly to the left is equal to the sum of all the numbers strictly to the right.",
    "constraints": [
      "1 <= nums.length <= 10^4"
    ],
    "methodName": "pivotIndex",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar pivotIndex = function(nums) {\n    \n};",
      "python": "class Solution:\n    def pivotIndex(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement pivotIndex\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement pivotIndex\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [1,7,3,6,5,6]",
        "output": "3",
        "args": [
          [
            1,
            7,
            3,
            6,
            5,
            6
          ]
        ],
        "expected": 3
      },
      {
        "input": "nums = [1,2,3]",
        "output": "-1",
        "args": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": -1
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [2,1,-1]",
        "output": "0",
        "args": [
          [
            2,
            1,
            -1
          ]
        ],
        "expected": 0
      },
      {
        "input": "nums = [0,0,0,0]",
        "output": "0",
        "args": [
          [
            0,
            0,
            0,
            0
          ]
        ],
        "expected": 0
      }
    ]
  },
  "power-of-two": {
    "id": "36",
    "slug": "power-of-two",
    "title": "Power of Two",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Math"
      },
      {
        "name": "Bit Manipulation"
      }
    ],
    "description": "Given an integer `n`, return `true` if it is a power of two. Otherwise, return `false`.",
    "constraints": [
      "-2^31 <= n <= 2^31 - 1"
    ],
    "methodName": "isPowerOfTwo",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} n\n * @return {any}\n */\nvar isPowerOfTwo = function(n) {\n    \n};",
      "python": "class Solution:\n    def isPowerOfTwo(self, n):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement isPowerOfTwo\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement isPowerOfTwo\n}"
    },
    "publicTestCases": [
      {
        "input": "n = 1",
        "output": "true",
        "args": [
          1
        ],
        "expected": true
      },
      {
        "input": "n = 16",
        "output": "true",
        "args": [
          16
        ],
        "expected": true
      },
      {
        "input": "n = 3",
        "output": "false",
        "args": [
          3
        ],
        "expected": false
      }
    ],
    "hiddenTestCases": [
      {
        "input": "n = 0",
        "output": "false",
        "args": [
          0
        ],
        "expected": false
      },
      {
        "input": "n = 4",
        "output": "true",
        "args": [
          4
        ],
        "expected": true
      },
      {
        "input": "n = 5",
        "output": "false",
        "args": [
          5
        ],
        "expected": false
      },
      {
        "input": "n = 1024",
        "output": "true",
        "args": [
          1024
        ],
        "expected": true
      }
    ]
  },
  "intersection-of-two-arrays": {
    "id": "37",
    "slug": "intersection-of-two-arrays",
    "title": "Intersection of Two Arrays",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Hash Table"
      },
      {
        "name": "Two Pointers"
      }
    ],
    "description": "Given two integer arrays `nums1` and `nums2`, return an array of their unique intersection.",
    "constraints": [
      "1 <= nums1.length, nums2.length <= 1000"
    ],
    "methodName": "intersection",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums1, nums2\n * @return {any}\n */\nvar intersection = function(nums1, nums2) {\n    \n};",
      "python": "class Solution:\n    def intersection(self, nums1, nums2):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement intersection\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement intersection\n}"
    },
    "publicTestCases": [
      {
        "input": "nums1 = [1,2,2,1], nums2 = [2,2]",
        "output": "[2]",
        "args": [
          [
            1,
            2,
            2,
            1
          ],
          [
            2,
            2
          ]
        ],
        "expected": [
          2
        ]
      },
      {
        "input": "nums1 = [4,9,5], nums2 = [9,4,9,8,4]",
        "output": "[4,9]",
        "args": [
          [
            4,
            9,
            5
          ],
          [
            9,
            4,
            9,
            8,
            4
          ]
        ],
        "expected": [
          4,
          9
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums1 = [1,2,3], nums2 = [4,5,6]",
        "output": "[]",
        "args": [
          [
            1,
            2,
            3
          ],
          [
            4,
            5,
            6
          ]
        ],
        "expected": []
      }
    ]
  },
  "find-all-numbers-disappeared-in-an-array": {
    "id": "38",
    "slug": "find-all-numbers-disappeared-in-an-array",
    "title": "Find All Numbers Disappeared in an Array",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Hash Table"
      }
    ],
    "description": "Given an array `nums` of `n` integers where `nums[i]` is in the range `[1, n]`, return an array of all the integers in the range `[1, n]` that do not appear in `nums`.",
    "constraints": [
      "n == nums.length",
      "1 <= n <= 10^5"
    ],
    "methodName": "findDisappearedNumbers",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar findDisappearedNumbers = function(nums) {\n    \n};",
      "python": "class Solution:\n    def findDisappearedNumbers(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement findDisappearedNumbers\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement findDisappearedNumbers\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [4,3,2,7,8,2,3,1]",
        "output": "[5,6]",
        "args": [
          [
            4,
            3,
            2,
            7,
            8,
            2,
            3,
            1
          ]
        ],
        "expected": [
          5,
          6
        ]
      },
      {
        "input": "nums = [1,1]",
        "output": "[2]",
        "args": [
          [
            1,
            1
          ]
        ],
        "expected": [
          2
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [1]",
        "output": "[]",
        "args": [
          [
            1
          ]
        ],
        "expected": []
      },
      {
        "input": "nums = [2,2]",
        "output": "[1]",
        "args": [
          [
            2,
            2
          ]
        ],
        "expected": [
          1
        ]
      }
    ]
  },
  "reverse-vowels-of-a-string": {
    "id": "39",
    "slug": "reverse-vowels-of-a-string",
    "title": "Reverse Vowels of a String",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Two Pointers"
      },
      {
        "name": "Strings"
      }
    ],
    "description": "Given a string `s`, reverse only all the vowels in the string and return it.",
    "constraints": [
      "1 <= s.length <= 3 * 10^5"
    ],
    "methodName": "reverseVowels",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s\n * @return {any}\n */\nvar reverseVowels = function(s) {\n    \n};",
      "python": "class Solution:\n    def reverseVowels(self, s):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement reverseVowels\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement reverseVowels\n}"
    },
    "publicTestCases": [
      {
        "input": "s = \"hello\"",
        "output": "\"holle\"",
        "args": [
          "hello"
        ],
        "expected": "holle"
      },
      {
        "input": "s = \"leetcode\"",
        "output": "\"leotcede\"",
        "args": [
          "leetcode"
        ],
        "expected": "leotcede"
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s = \"aA\"",
        "output": "\"Aa\"",
        "args": [
          "aA"
        ],
        "expected": "Aa"
      },
      {
        "input": "s = \"race car\"",
        "output": "\"race car\"",
        "args": [
          "race car"
        ],
        "expected": "race car"
      }
    ]
  },
  "maximum-product-of-three-numbers": {
    "id": "40",
    "slug": "maximum-product-of-three-numbers",
    "title": "Maximum Product of Three Numbers",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Math"
      },
      {
        "name": "Sorting"
      }
    ],
    "description": "Given an integer array `nums`, find three numbers whose product is maximum and return the maximum product.",
    "constraints": [
      "3 <= nums.length <= 10^4"
    ],
    "methodName": "maximumProduct",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar maximumProduct = function(nums) {\n    \n};",
      "python": "class Solution:\n    def maximumProduct(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement maximumProduct\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement maximumProduct\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [1,2,3]",
        "output": "6",
        "args": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": 6
      },
      {
        "input": "nums = [1,2,3,4]",
        "output": "24",
        "args": [
          [
            1,
            2,
            3,
            4
          ]
        ],
        "expected": 24
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [-1,-2,-3]",
        "output": "-6",
        "args": [
          [
            -1,
            -2,
            -3
          ]
        ],
        "expected": -6
      },
      {
        "input": "nums = [-100,-98,-1,2,3,4]",
        "output": "39200",
        "args": [
          [
            -100,
            -98,
            -1,
            2,
            3,
            4
          ]
        ],
        "expected": 39200
      }
    ]
  },
  "can-place-flowers": {
    "id": "41",
    "slug": "can-place-flowers",
    "title": "Can Place Flowers",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Greedy"
      }
    ],
    "description": "You have a long flowerbed in which some of the plots are planted, and some are not. Flowers cannot be planted in adjacent plots. Return `true` if `n` new flowers can be planted without violating the rule.",
    "constraints": [
      "1 <= flowerbed.length <= 2 * 10^4"
    ],
    "methodName": "canPlaceFlowers",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} flowerbed, n\n * @return {any}\n */\nvar canPlaceFlowers = function(flowerbed, n) {\n    \n};",
      "python": "class Solution:\n    def canPlaceFlowers(self, flowerbed, n):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement canPlaceFlowers\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement canPlaceFlowers\n}"
    },
    "publicTestCases": [
      {
        "input": "flowerbed = [1,0,0,0,1], n = 1",
        "output": "true",
        "args": [
          [
            1,
            0,
            0,
            0,
            1
          ],
          1
        ],
        "expected": true
      },
      {
        "input": "flowerbed = [1,0,0,0,1], n = 2",
        "output": "false",
        "args": [
          [
            1,
            0,
            0,
            0,
            1
          ],
          2
        ],
        "expected": false
      }
    ],
    "hiddenTestCases": [
      {
        "input": "flowerbed = [0,0,1,0,1], n = 1",
        "output": "true",
        "args": [
          [
            0,
            0,
            1,
            0,
            1
          ],
          1
        ],
        "expected": true
      },
      {
        "input": "flowerbed = [0], n = 1",
        "output": "true",
        "args": [
          [
            0
          ],
          1
        ],
        "expected": true
      }
    ]
  },
  "valid-perfect-square": {
    "id": "42",
    "slug": "valid-perfect-square",
    "title": "Valid Perfect Square",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Math"
      },
      {
        "name": "Binary Search"
      }
    ],
    "description": "Given a positive integer `num`, return `true` if `num` is a perfect square or `false` otherwise.",
    "constraints": [
      "1 <= num <= 2^31 - 1"
    ],
    "methodName": "isPerfectSquare",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} num\n * @return {any}\n */\nvar isPerfectSquare = function(num) {\n    \n};",
      "python": "class Solution:\n    def isPerfectSquare(self, num):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement isPerfectSquare\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement isPerfectSquare\n}"
    },
    "publicTestCases": [
      {
        "input": "num = 16",
        "output": "true",
        "args": [
          16
        ],
        "expected": true
      },
      {
        "input": "num = 14",
        "output": "false",
        "args": [
          14
        ],
        "expected": false
      }
    ],
    "hiddenTestCases": [
      {
        "input": "num = 1",
        "output": "true",
        "args": [
          1
        ],
        "expected": true
      },
      {
        "input": "num = 2147483647",
        "output": "false",
        "args": [
          2147483647
        ],
        "expected": false
      },
      {
        "input": "num = 100",
        "output": "true",
        "args": [
          100
        ],
        "expected": true
      }
    ]
  },
  "add-binary": {
    "id": "43",
    "slug": "add-binary",
    "title": "Add Binary",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Math"
      },
      {
        "name": "Strings"
      },
      {
        "name": "Bit Manipulation"
      }
    ],
    "description": "Given two binary strings `a` and `b`, return their sum as a binary string.",
    "constraints": [
      "1 <= a.length, b.length <= 10^4"
    ],
    "methodName": "addBinary",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} a, b\n * @return {any}\n */\nvar addBinary = function(a, b) {\n    \n};",
      "python": "class Solution:\n    def addBinary(self, a, b):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement addBinary\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement addBinary\n}"
    },
    "publicTestCases": [
      {
        "input": "a = \"11\", b = \"1\"",
        "output": "\"100\"",
        "args": [
          "11",
          "1"
        ],
        "expected": "100"
      },
      {
        "input": "a = \"1010\", b = \"1011\"",
        "output": "\"10101\"",
        "args": [
          "1010",
          "1011"
        ],
        "expected": "10101"
      }
    ],
    "hiddenTestCases": [
      {
        "input": "a = \"0\", b = \"0\"",
        "output": "\"0\"",
        "args": [
          "0",
          "0"
        ],
        "expected": "0"
      },
      {
        "input": "a = \"1\", b = \"111\"",
        "output": "\"1000\"",
        "args": [
          "1",
          "111"
        ],
        "expected": "1000"
      }
    ]
  },
  "hamming-distance": {
    "id": "44",
    "slug": "hamming-distance",
    "title": "Hamming Distance",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Bit Manipulation"
      }
    ],
    "description": "The Hamming distance between two integers is the number of positions at which the corresponding bits are different. Given two integers `x` and `y`, return the Hamming distance.",
    "constraints": [
      "0 <= x, y <= 2^31 - 1"
    ],
    "methodName": "hammingDistance",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} x, y\n * @return {any}\n */\nvar hammingDistance = function(x, y) {\n    \n};",
      "python": "class Solution:\n    def hammingDistance(self, x, y):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement hammingDistance\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement hammingDistance\n}"
    },
    "publicTestCases": [
      {
        "input": "x = 1, y = 4",
        "output": "2",
        "args": [
          1,
          4
        ],
        "expected": 2
      },
      {
        "input": "x = 3, y = 1",
        "output": "1",
        "args": [
          3,
          1
        ],
        "expected": 1
      }
    ],
    "hiddenTestCases": [
      {
        "input": "x = 0, y = 0",
        "output": "0",
        "args": [
          0,
          0
        ],
        "expected": 0
      },
      {
        "input": "x = 93, y = 73",
        "output": "2",
        "args": [
          93,
          73
        ],
        "expected": 2
      }
    ]
  },
  "toeplitz-matrix": {
    "id": "45",
    "slug": "toeplitz-matrix",
    "title": "Toeplitz Matrix",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Matrix"
      }
    ],
    "description": "Given an `m x n` matrix, return `true` if the matrix is Toeplitz. A matrix is Toeplitz if every diagonal from top-left to bottom-right has the same elements.",
    "constraints": [
      "m == matrix.length",
      "n == matrix[i].length",
      "1 <= m, n <= 20"
    ],
    "methodName": "isToeplitzMatrix",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} matrix\n * @return {any}\n */\nvar isToeplitzMatrix = function(matrix) {\n    \n};",
      "python": "class Solution:\n    def isToeplitzMatrix(self, matrix):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement isToeplitzMatrix\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement isToeplitzMatrix\n}"
    },
    "publicTestCases": [
      {
        "input": "matrix = [[1,2,3,4],[5,1,2,3],[9,5,1,2]]",
        "output": "true",
        "args": [
          [
            [
              1,
              2,
              3,
              4
            ],
            [
              5,
              1,
              2,
              3
            ],
            [
              9,
              5,
              1,
              2
            ]
          ]
        ],
        "expected": true
      },
      {
        "input": "matrix = [[1,2],[2,2]]",
        "output": "false",
        "args": [
          [
            [
              1,
              2
            ],
            [
              2,
              2
            ]
          ]
        ],
        "expected": false
      }
    ],
    "hiddenTestCases": [
      {
        "input": "matrix = [[1]]",
        "output": "true",
        "args": [
          [
            [
              1
            ]
          ]
        ],
        "expected": true
      },
      {
        "input": "matrix = [[1,2,3],[4,1,2]]",
        "output": "true",
        "args": [
          [
            [
              1,
              2,
              3
            ],
            [
              4,
              1,
              2
            ]
          ]
        ],
        "expected": true
      }
    ]
  },
  "transpose-matrix": {
    "id": "46",
    "slug": "transpose-matrix",
    "title": "Transpose Matrix",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Matrix"
      },
      {
        "name": "Simulation"
      }
    ],
    "description": "Given a 2D integer array `matrix`, return the transpose of `matrix`.",
    "constraints": [
      "m == matrix.length",
      "n == matrix[i].length",
      "1 <= m, n <= 1000"
    ],
    "methodName": "transpose",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} matrix\n * @return {any}\n */\nvar transpose = function(matrix) {\n    \n};",
      "python": "class Solution:\n    def transpose(self, matrix):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement transpose\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement transpose\n}"
    },
    "publicTestCases": [
      {
        "input": "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        "output": "[[1,4,7],[2,5,8],[3,6,9]]",
        "args": [
          [
            [
              1,
              2,
              3
            ],
            [
              4,
              5,
              6
            ],
            [
              7,
              8,
              9
            ]
          ]
        ],
        "expected": [
          [
            1,
            4,
            7
          ],
          [
            2,
            5,
            8
          ],
          [
            3,
            6,
            9
          ]
        ]
      },
      {
        "input": "matrix = [[1,2,3],[4,5,6]]",
        "output": "[[1,4],[2,5],[3,6]]",
        "args": [
          [
            [
              1,
              2,
              3
            ],
            [
              4,
              5,
              6
            ]
          ]
        ],
        "expected": [
          [
            1,
            4
          ],
          [
            2,
            5
          ],
          [
            3,
            6
          ]
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "matrix = [[1]]",
        "output": "[[1]]",
        "args": [
          [
            [
              1
            ]
          ]
        ],
        "expected": [
          [
            1
          ]
        ]
      },
      {
        "input": "matrix = [[5,1]]",
        "output": "[[5],[1]]",
        "args": [
          [
            [
              5,
              1
            ]
          ]
        ],
        "expected": [
          [
            5
          ],
          [
            1
          ]
        ]
      }
    ]
  },
  "monotonic-array": {
    "id": "47",
    "slug": "monotonic-array",
    "title": "Monotonic Array",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      }
    ],
    "description": "An array is monotonic if it is either monotone increasing or monotone decreasing. Return `true` if the given array is monotonic, or `false` otherwise.",
    "constraints": [
      "1 <= nums.length <= 10^5"
    ],
    "methodName": "isMonotonic",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar isMonotonic = function(nums) {\n    \n};",
      "python": "class Solution:\n    def isMonotonic(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement isMonotonic\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement isMonotonic\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [1,2,2,3]",
        "output": "true",
        "args": [
          [
            1,
            2,
            2,
            3
          ]
        ],
        "expected": true
      },
      {
        "input": "nums = [6,5,4,4]",
        "output": "true",
        "args": [
          [
            6,
            5,
            4,
            4
          ]
        ],
        "expected": true
      },
      {
        "input": "nums = [1,3,2]",
        "output": "false",
        "args": [
          [
            1,
            3,
            2
          ]
        ],
        "expected": false
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [1,1,1]",
        "output": "true",
        "args": [
          [
            1,
            1,
            1
          ]
        ],
        "expected": true
      },
      {
        "input": "nums = [5]",
        "output": "true",
        "args": [
          [
            5
          ]
        ],
        "expected": true
      }
    ]
  },
  "sort-array-by-parity": {
    "id": "48",
    "slug": "sort-array-by-parity",
    "title": "Sort Array By Parity",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Two Pointers"
      },
      {
        "name": "Sorting"
      }
    ],
    "description": "Given an integer array `nums`, move all the even integers at the beginning of the array followed by all the odd integers.",
    "constraints": [
      "1 <= nums.length <= 5000"
    ],
    "methodName": "sortArrayByParity",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar sortArrayByParity = function(nums) {\n    \n};",
      "python": "class Solution:\n    def sortArrayByParity(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement sortArrayByParity\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement sortArrayByParity\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [3,1,2,4]",
        "output": "[2,4,3,1]",
        "args": [
          [
            3,
            1,
            2,
            4
          ]
        ],
        "expected": [
          2,
          4,
          3,
          1
        ]
      },
      {
        "input": "nums = [0]",
        "output": "[0]",
        "args": [
          [
            0
          ]
        ],
        "expected": [
          0
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [1,3,5]",
        "output": "[1,3,5]",
        "args": [
          [
            1,
            3,
            5
          ]
        ],
        "expected": [
          1,
          3,
          5
        ]
      },
      {
        "input": "nums = [2,4,6]",
        "output": "[2,4,6]",
        "args": [
          [
            2,
            4,
            6
          ]
        ],
        "expected": [
          2,
          4,
          6
        ]
      }
    ]
  },
  "defanging-an-ip-address": {
    "id": "49",
    "slug": "defanging-an-ip-address",
    "title": "Defanging an IP Address",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Strings"
      }
    ],
    "description": "Given a valid (IPv4) IP `address`, return a defanged version of that IP address where every period `.` is replaced with `[.]`.",
    "constraints": [
      "The given address is a valid IPv4 address."
    ],
    "methodName": "defangIPaddr",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} address\n * @return {any}\n */\nvar defangIPaddr = function(address) {\n    \n};",
      "python": "class Solution:\n    def defangIPaddr(self, address):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement defangIPaddr\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement defangIPaddr\n}"
    },
    "publicTestCases": [
      {
        "input": "address = \"1.1.1.1\"",
        "output": "\"1[.]1[.]1[.]1\"",
        "args": [
          "1.1.1.1"
        ],
        "expected": "1[.]1[.]1[.]1"
      },
      {
        "input": "address = \"255.100.50.0\"",
        "output": "\"255[.]100[.]50[.]0\"",
        "args": [
          "255.100.50.0"
        ],
        "expected": "255[.]100[.]50[.]0"
      }
    ],
    "hiddenTestCases": [
      {
        "input": "address = \"127.0.0.1\"",
        "output": "\"127[.]0[.]0[.]1\"",
        "args": [
          "127.0.0.1"
        ],
        "expected": "127[.]0[.]0[.]1"
      },
      {
        "input": "address = \"0.0.0.0\"",
        "output": "\"0[.]0[.]0[.]0\"",
        "args": [
          "0.0.0.0"
        ],
        "expected": "0[.]0[.]0[.]0"
      }
    ]
  },
  "shuffle-the-array": {
    "id": "50",
    "slug": "shuffle-the-array",
    "title": "Shuffle the Array",
    "difficulty": "EASY",
    "topics": [
      {
        "name": "Arrays"
      }
    ],
    "description": "Given the array `nums` consisting of `2n` elements in the form `[x1,x2,...,xn,y1,y2,...,yn]`, return the array in the form `[x1,y1,x2,y2,...,xn,yn]`.",
    "constraints": [
      "1 <= n <= 500",
      "nums.length == 2n"
    ],
    "methodName": "shuffle",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums, n\n * @return {any}\n */\nvar shuffle = function(nums, n) {\n    \n};",
      "python": "class Solution:\n    def shuffle(self, nums, n):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement shuffle\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement shuffle\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [2,5,1,3,4,7], n = 3",
        "output": "[2,3,5,4,1,7]",
        "args": [
          [
            2,
            5,
            1,
            3,
            4,
            7
          ],
          3
        ],
        "expected": [
          2,
          3,
          5,
          4,
          1,
          7
        ]
      },
      {
        "input": "nums = [1,2,3,4,4,3,2,1], n = 4",
        "output": "[1,4,2,3,3,2,4,1]",
        "args": [
          [
            1,
            2,
            3,
            4,
            4,
            3,
            2,
            1
          ],
          4
        ],
        "expected": [
          1,
          4,
          2,
          3,
          3,
          2,
          4,
          1
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [1,1,2,2], n = 2",
        "output": "[1,2,1,2]",
        "args": [
          [
            1,
            1,
            2,
            2
          ],
          2
        ],
        "expected": [
          1,
          2,
          1,
          2
        ]
      }
    ]
  },
  "3sum": {
    "id": "51",
    "slug": "3sum",
    "title": "3Sum",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Two Pointers"
      },
      {
        "name": "Sorting"
      }
    ],
    "description": "Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.",
    "constraints": [
      "3 <= nums.length <= 3000",
      "-10^5 <= nums[i] <= 10^5"
    ],
    "methodName": "threeSum",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar threeSum = function(nums) {\n    \n};",
      "python": "class Solution:\n    def threeSum(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement threeSum\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement threeSum\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [-1,0,1,2,-1,-4]",
        "output": "[[-1,-1,2],[-1,0,1]]",
        "args": [
          [
            -1,
            0,
            1,
            2,
            -1,
            -4
          ]
        ],
        "expected": [
          [
            -1,
            -1,
            2
          ],
          [
            -1,
            0,
            1
          ]
        ]
      },
      {
        "input": "nums = [0,1,1]",
        "output": "[]",
        "args": [
          [
            0,
            1,
            1
          ]
        ],
        "expected": []
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [0,0,0]",
        "output": "[[0,0,0]]",
        "args": [
          [
            0,
            0,
            0
          ]
        ],
        "expected": [
          [
            0,
            0,
            0
          ]
        ]
      },
      {
        "input": "nums = [-2,0,1,1,2]",
        "output": "[[-2,0,2],[-2,1,1]]",
        "args": [
          [
            -2,
            0,
            1,
            1,
            2
          ]
        ],
        "expected": [
          [
            -2,
            0,
            2
          ],
          [
            -2,
            1,
            1
          ]
        ]
      }
    ]
  },
  "longest-substring-without-repeating-characters": {
    "id": "52",
    "slug": "longest-substring-without-repeating-characters",
    "title": "Longest Substring Without Repeating Characters",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Hash Table"
      },
      {
        "name": "Strings"
      },
      {
        "name": "Sliding Window"
      }
    ],
    "description": "Given a string `s`, find the length of the longest substring without repeating characters.",
    "constraints": [
      "0 <= s.length <= 5 * 10^4"
    ],
    "methodName": "lengthOfLongestSubstring",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s\n * @return {any}\n */\nvar lengthOfLongestSubstring = function(s) {\n    \n};",
      "python": "class Solution:\n    def lengthOfLongestSubstring(self, s):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement lengthOfLongestSubstring\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement lengthOfLongestSubstring\n}"
    },
    "publicTestCases": [
      {
        "input": "s = \"abcabcbb\"",
        "output": "3",
        "args": [
          "abcabcbb"
        ],
        "expected": 3
      },
      {
        "input": "s = \"bbbbb\"",
        "output": "1",
        "args": [
          "bbbbb"
        ],
        "expected": 1
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s = \"pwwkew\"",
        "output": "3",
        "args": [
          "pwwkew"
        ],
        "expected": 3
      },
      {
        "input": "s = \"\"",
        "output": "0",
        "args": [
          ""
        ],
        "expected": 0
      },
      {
        "input": "s = \"au\"",
        "output": "2",
        "args": [
          "au"
        ],
        "expected": 2
      }
    ]
  },
  "container-with-most-water": {
    "id": "53",
    "slug": "container-with-most-water",
    "title": "Container With Most Water",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Two Pointers"
      },
      {
        "name": "Greedy"
      }
    ],
    "description": "Given `n` non-negative integers `height` where each represents a point at coordinate `(i, height[i])`. Find two lines that together with the x-axis form a container, such that the container contains the most water.",
    "constraints": [
      "n == height.length",
      "2 <= n <= 10^5"
    ],
    "methodName": "maxArea",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} height\n * @return {any}\n */\nvar maxArea = function(height) {\n    \n};",
      "python": "class Solution:\n    def maxArea(self, height):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement maxArea\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement maxArea\n}"
    },
    "publicTestCases": [
      {
        "input": "height = [1,8,6,2,5,4,8,3,7]",
        "output": "49",
        "args": [
          [
            1,
            8,
            6,
            2,
            5,
            4,
            8,
            3,
            7
          ]
        ],
        "expected": 49
      },
      {
        "input": "height = [1,1]",
        "output": "1",
        "args": [
          [
            1,
            1
          ]
        ],
        "expected": 1
      }
    ],
    "hiddenTestCases": [
      {
        "input": "height = [4,3,2,1,4]",
        "output": "16",
        "args": [
          [
            4,
            3,
            2,
            1,
            4
          ]
        ],
        "expected": 16
      },
      {
        "input": "height = [1,2,1]",
        "output": "2",
        "args": [
          [
            1,
            2,
            1
          ]
        ],
        "expected": 2
      }
    ]
  },
  "group-anagrams": {
    "id": "54",
    "slug": "group-anagrams",
    "title": "Group Anagrams",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Hash Table"
      },
      {
        "name": "Strings"
      },
      {
        "name": "Sorting"
      }
    ],
    "description": "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.",
    "constraints": [
      "1 <= strs.length <= 10^4"
    ],
    "methodName": "groupAnagrams",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} strs\n * @return {any}\n */\nvar groupAnagrams = function(strs) {\n    \n};",
      "python": "class Solution:\n    def groupAnagrams(self, strs):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement groupAnagrams\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement groupAnagrams\n}"
    },
    "publicTestCases": [
      {
        "input": "strs = [\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]",
        "output": "[[\"eat\",\"tea\",\"ate\"],[\"tan\",\"nat\"],[\"bat\"]]",
        "args": [
          [
            "eat",
            "tea",
            "tan",
            "ate",
            "nat",
            "bat"
          ]
        ],
        "expected": [
          [
            "eat",
            "tea",
            "ate"
          ],
          [
            "tan",
            "nat"
          ],
          [
            "bat"
          ]
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "strs = [\"\"]",
        "output": "[[\"\"]]",
        "args": [
          [
            ""
          ]
        ],
        "expected": [
          [
            ""
          ]
        ]
      },
      {
        "input": "strs = [\"a\"]",
        "output": "[[\"a\"]]",
        "args": [
          [
            "a"
          ]
        ],
        "expected": [
          [
            "a"
          ]
        ]
      }
    ]
  },
  "top-k-frequent-elements": {
    "id": "55",
    "slug": "top-k-frequent-elements",
    "title": "Top K Frequent Elements",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Hash Table"
      },
      {
        "name": "Heap"
      },
      {
        "name": "Bucket Sort"
      }
    ],
    "description": "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements.",
    "constraints": [
      "1 <= nums.length <= 10^5",
      "k is in range [1, number of unique elements]"
    ],
    "methodName": "topKFrequent",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums, k\n * @return {any}\n */\nvar topKFrequent = function(nums, k) {\n    \n};",
      "python": "class Solution:\n    def topKFrequent(self, nums, k):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement topKFrequent\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement topKFrequent\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [1,1,1,2,2,3], k = 2",
        "output": "[1,2]",
        "args": [
          [
            1,
            1,
            1,
            2,
            2,
            3
          ],
          2
        ],
        "expected": [
          1,
          2
        ]
      },
      {
        "input": "nums = [1], k = 1",
        "output": "[1]",
        "args": [
          [
            1
          ],
          1
        ],
        "expected": [
          1
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [4,1,-1,2,-1,2,3], k = 2",
        "output": "[-1,2]",
        "args": [
          [
            4,
            1,
            -1,
            2,
            -1,
            2,
            3
          ],
          2
        ],
        "expected": [
          -1,
          2
        ]
      }
    ]
  },
  "product-of-array-except-self": {
    "id": "56",
    "slug": "product-of-array-except-self",
    "title": "Product of Array Except Self",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Prefix Sum"
      }
    ],
    "description": "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.",
    "constraints": [
      "2 <= nums.length <= 10^5"
    ],
    "methodName": "productExceptSelf",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar productExceptSelf = function(nums) {\n    \n};",
      "python": "class Solution:\n    def productExceptSelf(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement productExceptSelf\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement productExceptSelf\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [1,2,3,4]",
        "output": "[24,12,8,6]",
        "args": [
          [
            1,
            2,
            3,
            4
          ]
        ],
        "expected": [
          24,
          12,
          8,
          6
        ]
      },
      {
        "input": "nums = [-1,1,0,-3,3]",
        "output": "[0,0,9,0,0]",
        "args": [
          [
            -1,
            1,
            0,
            -3,
            3
          ]
        ],
        "expected": [
          0,
          0,
          9,
          0,
          0
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [2,3]",
        "output": "[3,2]",
        "args": [
          [
            2,
            3
          ]
        ],
        "expected": [
          3,
          2
        ]
      },
      {
        "input": "nums = [1,0]",
        "output": "[0,1]",
        "args": [
          [
            1,
            0
          ]
        ],
        "expected": [
          0,
          1
        ]
      }
    ]
  },
  "longest-consecutive-sequence": {
    "id": "57",
    "slug": "longest-consecutive-sequence",
    "title": "Longest Consecutive Sequence",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Hash Table"
      },
      {
        "name": "Union Find"
      }
    ],
    "description": "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence in O(n) time.",
    "constraints": [
      "0 <= nums.length <= 10^5"
    ],
    "methodName": "longestConsecutive",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar longestConsecutive = function(nums) {\n    \n};",
      "python": "class Solution:\n    def longestConsecutive(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement longestConsecutive\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement longestConsecutive\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [100,4,200,1,3,2]",
        "output": "4",
        "args": [
          [
            100,
            4,
            200,
            1,
            3,
            2
          ]
        ],
        "expected": 4
      },
      {
        "input": "nums = [0,3,7,2,5,8,4,6,0,1]",
        "output": "9",
        "args": [
          [
            0,
            3,
            7,
            2,
            5,
            8,
            4,
            6,
            0,
            1
          ]
        ],
        "expected": 9
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = []",
        "output": "0",
        "args": [
          []
        ],
        "expected": 0
      },
      {
        "input": "nums = [9,1,4,7,3,-1,0,5,8,-1,6]",
        "output": "7",
        "args": [
          [
            9,
            1,
            4,
            7,
            3,
            -1,
            0,
            5,
            8,
            -1,
            6
          ]
        ],
        "expected": 7
      }
    ]
  },
  "two-sum-ii-input-array-is-sorted": {
    "id": "58",
    "slug": "two-sum-ii-input-array-is-sorted",
    "title": "Two Sum II - Input Array Is Sorted",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Two Pointers"
      },
      {
        "name": "Binary Search"
      }
    ],
    "description": "Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number.",
    "constraints": [
      "2 <= numbers.length <= 3 * 10^4"
    ],
    "methodName": "twoSumII",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} numbers, target\n * @return {any}\n */\nvar twoSumII = function(numbers, target) {\n    \n};",
      "python": "class Solution:\n    def twoSumII(self, numbers, target):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement twoSumII\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement twoSumII\n}"
    },
    "publicTestCases": [
      {
        "input": "numbers = [2,7,11,15], target = 9",
        "output": "[1,2]",
        "args": [
          [
            2,
            7,
            11,
            15
          ],
          9
        ],
        "expected": [
          1,
          2
        ]
      },
      {
        "input": "numbers = [2,3,4], target = 6",
        "output": "[1,3]",
        "args": [
          [
            2,
            3,
            4
          ],
          6
        ],
        "expected": [
          1,
          3
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "numbers = [-1,0], target = -1",
        "output": "[1,2]",
        "args": [
          [
            -1,
            0
          ],
          -1
        ],
        "expected": [
          1,
          2
        ]
      },
      {
        "input": "numbers = [1,2,3,4,4,9], target = 8",
        "output": "[4,5]",
        "args": [
          [
            1,
            2,
            3,
            4,
            4,
            9
          ],
          8
        ],
        "expected": [
          4,
          5
        ]
      }
    ]
  },
  "subarray-sum-equals-k": {
    "id": "59",
    "slug": "subarray-sum-equals-k",
    "title": "Subarray Sum Equals K",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Hash Table"
      },
      {
        "name": "Prefix Sum"
      }
    ],
    "description": "Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.",
    "constraints": [
      "1 <= nums.length <= 2 * 10^4"
    ],
    "methodName": "subarraySum",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums, k\n * @return {any}\n */\nvar subarraySum = function(nums, k) {\n    \n};",
      "python": "class Solution:\n    def subarraySum(self, nums, k):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement subarraySum\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement subarraySum\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [1,1,1], k = 2",
        "output": "2",
        "args": [
          [
            1,
            1,
            1
          ],
          2
        ],
        "expected": 2
      },
      {
        "input": "nums = [1,2,3], k = 3",
        "output": "2",
        "args": [
          [
            1,
            2,
            3
          ],
          3
        ],
        "expected": 2
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [1,-1,0], k = 0",
        "output": "3",
        "args": [
          [
            1,
            -1,
            0
          ],
          0
        ],
        "expected": 3
      },
      {
        "input": "nums = [3,4,7,2,-3,1,4,2], k = 7",
        "output": "4",
        "args": [
          [
            3,
            4,
            7,
            2,
            -3,
            1,
            4,
            2
          ],
          7
        ],
        "expected": 4
      }
    ]
  },
  "longest-palindromic-substring": {
    "id": "60",
    "slug": "longest-palindromic-substring",
    "title": "Longest Palindromic Substring",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Strings"
      },
      {
        "name": "Dynamic Programming"
      }
    ],
    "description": "Given a string `s`, return the longest palindromic substring in `s`.",
    "constraints": [
      "1 <= s.length <= 1000"
    ],
    "methodName": "longestPalindrome",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s\n * @return {any}\n */\nvar longestPalindrome = function(s) {\n    \n};",
      "python": "class Solution:\n    def longestPalindrome(self, s):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement longestPalindrome\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement longestPalindrome\n}"
    },
    "publicTestCases": [
      {
        "input": "s = \"babad\"",
        "output": "\"bab\"",
        "args": [
          "babad"
        ],
        "expected": "bab"
      },
      {
        "input": "s = \"cbbd\"",
        "output": "\"bb\"",
        "args": [
          "cbbd"
        ],
        "expected": "bb"
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s = \"a\"",
        "output": "\"a\"",
        "args": [
          "a"
        ],
        "expected": "a"
      },
      {
        "input": "s = \"ac\"",
        "output": "\"a\"",
        "args": [
          "ac"
        ],
        "expected": "a"
      },
      {
        "input": "s = \"racecar\"",
        "output": "\"racecar\"",
        "args": [
          "racecar"
        ],
        "expected": "racecar"
      }
    ]
  },
  "palindromic-substrings": {
    "id": "61",
    "slug": "palindromic-substrings",
    "title": "Palindromic Substrings",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Strings"
      },
      {
        "name": "Dynamic Programming"
      }
    ],
    "description": "Given a string `s`, return the number of palindromic substrings in it.",
    "constraints": [
      "1 <= s.length <= 1000"
    ],
    "methodName": "countSubstrings",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s\n * @return {any}\n */\nvar countSubstrings = function(s) {\n    \n};",
      "python": "class Solution:\n    def countSubstrings(self, s):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement countSubstrings\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement countSubstrings\n}"
    },
    "publicTestCases": [
      {
        "input": "s = \"abc\"",
        "output": "3",
        "args": [
          "abc"
        ],
        "expected": 3
      },
      {
        "input": "s = \"aaa\"",
        "output": "6",
        "args": [
          "aaa"
        ],
        "expected": 6
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s = \"a\"",
        "output": "1",
        "args": [
          "a"
        ],
        "expected": 1
      },
      {
        "input": "s = \"aba\"",
        "output": "4",
        "args": [
          "aba"
        ],
        "expected": 4
      }
    ]
  },
  "coin-change": {
    "id": "62",
    "slug": "coin-change",
    "title": "Coin Change",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Dynamic Programming"
      },
      {
        "name": "BFS"
      }
    ],
    "description": "You are given an integer array `coins` and an integer `amount`. Return the fewest number of coins needed to make up that amount, or -1 if impossible.",
    "constraints": [
      "1 <= coins.length <= 12",
      "0 <= amount <= 10^4"
    ],
    "methodName": "coinChange",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} coins, amount\n * @return {any}\n */\nvar coinChange = function(coins, amount) {\n    \n};",
      "python": "class Solution:\n    def coinChange(self, coins, amount):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement coinChange\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement coinChange\n}"
    },
    "publicTestCases": [
      {
        "input": "coins = [1,2,5], amount = 11",
        "output": "3",
        "args": [
          [
            1,
            2,
            5
          ],
          11
        ],
        "expected": 3
      },
      {
        "input": "coins = [2], amount = 3",
        "output": "-1",
        "args": [
          [
            2
          ],
          3
        ],
        "expected": -1
      }
    ],
    "hiddenTestCases": [
      {
        "input": "coins = [1], amount = 0",
        "output": "0",
        "args": [
          [
            1
          ],
          0
        ],
        "expected": 0
      },
      {
        "input": "coins = [1,2,5], amount = 100",
        "output": "20",
        "args": [
          [
            1,
            2,
            5
          ],
          100
        ],
        "expected": 20
      }
    ]
  },
  "decode-ways": {
    "id": "63",
    "slug": "decode-ways",
    "title": "Decode Ways",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Strings"
      },
      {
        "name": "Dynamic Programming"
      }
    ],
    "description": "A message containing letters from A-Z can be encoded into numbers using 'A' -> '1' to 'Z' -> '26'. Given a string `s` containing only digits, return the number of ways to decode it.",
    "constraints": [
      "1 <= s.length <= 100"
    ],
    "methodName": "numDecodings",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s\n * @return {any}\n */\nvar numDecodings = function(s) {\n    \n};",
      "python": "class Solution:\n    def numDecodings(self, s):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement numDecodings\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement numDecodings\n}"
    },
    "publicTestCases": [
      {
        "input": "s = \"12\"",
        "output": "2",
        "args": [
          "12"
        ],
        "expected": 2
      },
      {
        "input": "s = \"226\"",
        "output": "3",
        "args": [
          "226"
        ],
        "expected": 3
      },
      {
        "input": "s = \"06\"",
        "output": "0",
        "args": [
          "06"
        ],
        "expected": 0
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s = \"10\"",
        "output": "1",
        "args": [
          "10"
        ],
        "expected": 1
      },
      {
        "input": "s = \"27\"",
        "output": "1",
        "args": [
          "27"
        ],
        "expected": 1
      }
    ]
  },
  "house-robber": {
    "id": "64",
    "slug": "house-robber",
    "title": "House Robber",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Dynamic Programming"
      }
    ],
    "description": "You are a professional robber planning to rob houses along a street without triggering alarms (cannot rob two adjacent houses). Determine the maximum money you can rob.",
    "constraints": [
      "1 <= nums.length <= 100"
    ],
    "methodName": "rob",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar rob = function(nums) {\n    \n};",
      "python": "class Solution:\n    def rob(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement rob\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement rob\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [1,2,3,1]",
        "output": "4",
        "args": [
          [
            1,
            2,
            3,
            1
          ]
        ],
        "expected": 4
      },
      {
        "input": "nums = [2,7,9,3,1]",
        "output": "12",
        "args": [
          [
            2,
            7,
            9,
            3,
            1
          ]
        ],
        "expected": 12
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [2,1,1,2]",
        "output": "4",
        "args": [
          [
            2,
            1,
            1,
            2
          ]
        ],
        "expected": 4
      },
      {
        "input": "nums = [0]",
        "output": "0",
        "args": [
          [
            0
          ]
        ],
        "expected": 0
      }
    ]
  },
  "house-robber-ii": {
    "id": "65",
    "slug": "house-robber-ii",
    "title": "House Robber II",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Dynamic Programming"
      }
    ],
    "description": "All houses at this place are arranged in a circle. Return the maximum amount of money you can rob without alerting the police.",
    "constraints": [
      "1 <= nums.length <= 100"
    ],
    "methodName": "robII",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar robII = function(nums) {\n    \n};",
      "python": "class Solution:\n    def robII(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement robII\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement robII\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [2,3,2]",
        "output": "3",
        "args": [
          [
            2,
            3,
            2
          ]
        ],
        "expected": 3
      },
      {
        "input": "nums = [1,2,3,1]",
        "output": "4",
        "args": [
          [
            1,
            2,
            3,
            1
          ]
        ],
        "expected": 4
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [1,2,3]",
        "output": "3",
        "args": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": 3
      },
      {
        "input": "nums = [5]",
        "output": "5",
        "args": [
          [
            5
          ]
        ],
        "expected": 5
      }
    ]
  },
  "unique-paths": {
    "id": "66",
    "slug": "unique-paths",
    "title": "Unique Paths",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Math"
      },
      {
        "name": "Dynamic Programming"
      },
      {
        "name": "Combinatorics"
      }
    ],
    "description": "A robot is located at the top-left corner of an `m x n` grid. It can only move down or right. How many possible unique paths are there to reach the bottom-right corner?",
    "constraints": [
      "1 <= m, n <= 100"
    ],
    "methodName": "uniquePaths",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} m, n\n * @return {any}\n */\nvar uniquePaths = function(m, n) {\n    \n};",
      "python": "class Solution:\n    def uniquePaths(self, m, n):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement uniquePaths\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement uniquePaths\n}"
    },
    "publicTestCases": [
      {
        "input": "m = 3, n = 7",
        "output": "28",
        "args": [
          3,
          7
        ],
        "expected": 28
      },
      {
        "input": "m = 3, n = 2",
        "output": "3",
        "args": [
          3,
          2
        ],
        "expected": 3
      }
    ],
    "hiddenTestCases": [
      {
        "input": "m = 1, n = 1",
        "output": "1",
        "args": [
          1,
          1
        ],
        "expected": 1
      },
      {
        "input": "m = 3, n = 3",
        "output": "6",
        "args": [
          3,
          3
        ],
        "expected": 6
      }
    ]
  },
  "jump-game": {
    "id": "67",
    "slug": "jump-game",
    "title": "Jump Game",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Dynamic Programming"
      },
      {
        "name": "Greedy"
      }
    ],
    "description": "You are given an integer array `nums`. You are initially positioned at the array's first index, and each element represents your maximum jump length. Return `true` if you can reach the last index.",
    "constraints": [
      "1 <= nums.length <= 10^4"
    ],
    "methodName": "canJump",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar canJump = function(nums) {\n    \n};",
      "python": "class Solution:\n    def canJump(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement canJump\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement canJump\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [2,3,1,1,4]",
        "output": "true",
        "args": [
          [
            2,
            3,
            1,
            1,
            4
          ]
        ],
        "expected": true
      },
      {
        "input": "nums = [3,2,1,0,4]",
        "output": "false",
        "args": [
          [
            3,
            2,
            1,
            0,
            4
          ]
        ],
        "expected": false
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [0]",
        "output": "true",
        "args": [
          [
            0
          ]
        ],
        "expected": true
      },
      {
        "input": "nums = [2,0,0]",
        "output": "true",
        "args": [
          [
            2,
            0,
            0
          ]
        ],
        "expected": true
      }
    ]
  },
  "jump-game-ii": {
    "id": "68",
    "slug": "jump-game-ii",
    "title": "Jump Game II",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Dynamic Programming"
      },
      {
        "name": "Greedy"
      }
    ],
    "description": "Return the minimum number of jumps to reach the last index from the first index in `nums`.",
    "constraints": [
      "1 <= nums.length <= 10^4"
    ],
    "methodName": "jump",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar jump = function(nums) {\n    \n};",
      "python": "class Solution:\n    def jump(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement jump\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement jump\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [2,3,1,1,4]",
        "output": "2",
        "args": [
          [
            2,
            3,
            1,
            1,
            4
          ]
        ],
        "expected": 2
      },
      {
        "input": "nums = [2,3,0,1,4]",
        "output": "2",
        "args": [
          [
            2,
            3,
            0,
            1,
            4
          ]
        ],
        "expected": 2
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [1,2,3]",
        "output": "2",
        "args": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": 2
      },
      {
        "input": "nums = [0]",
        "output": "0",
        "args": [
          [
            0
          ]
        ],
        "expected": 0
      }
    ]
  },
  "gas-station": {
    "id": "69",
    "slug": "gas-station",
    "title": "Gas Station",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Greedy"
      }
    ],
    "description": "Given two integer arrays `gas` and `cost`, return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1.",
    "constraints": [
      "n == gas.length == cost.length",
      "1 <= n <= 10^5"
    ],
    "methodName": "canCompleteCircuit",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} gas, cost\n * @return {any}\n */\nvar canCompleteCircuit = function(gas, cost) {\n    \n};",
      "python": "class Solution:\n    def canCompleteCircuit(self, gas, cost):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement canCompleteCircuit\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement canCompleteCircuit\n}"
    },
    "publicTestCases": [
      {
        "input": "gas = [1,2,3,4,5], cost = [3,4,5,1,2]",
        "output": "3",
        "args": [
          [
            1,
            2,
            3,
            4,
            5
          ],
          [
            3,
            4,
            5,
            1,
            2
          ]
        ],
        "expected": 3
      },
      {
        "input": "gas = [2,3,4], cost = [3,4,3]",
        "output": "-1",
        "args": [
          [
            2,
            3,
            4
          ],
          [
            3,
            4,
            3
          ]
        ],
        "expected": -1
      }
    ],
    "hiddenTestCases": [
      {
        "input": "gas = [5,1,2,3,4], cost = [4,4,1,5,1]",
        "output": "4",
        "args": [
          [
            5,
            1,
            2,
            3,
            4
          ],
          [
            4,
            4,
            1,
            5,
            1
          ]
        ],
        "expected": 4
      }
    ]
  },
  "rotate-image": {
    "id": "70",
    "slug": "rotate-image",
    "title": "Rotate Image",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Math"
      },
      {
        "name": "Matrix"
      }
    ],
    "description": "You are given an `n x n` 2D matrix representing an image, rotate the image by 90 degrees (clockwise) in-place.",
    "constraints": [
      "matrix.length == n",
      "1 <= n <= 20"
    ],
    "methodName": "rotate",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} matrix\n * @return {any}\n */\nvar rotate = function(matrix) {\n    \n};",
      "python": "class Solution:\n    def rotate(self, matrix):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement rotate\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement rotate\n}"
    },
    "publicTestCases": [
      {
        "input": "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        "output": "[[7,4,1],[8,5,2],[9,6,3]]",
        "args": [
          [
            [
              1,
              2,
              3
            ],
            [
              4,
              5,
              6
            ],
            [
              7,
              8,
              9
            ]
          ]
        ],
        "expected": [
          [
            7,
            4,
            1
          ],
          [
            8,
            5,
            2
          ],
          [
            9,
            6,
            3
          ]
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]",
        "output": "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]",
        "args": [
          [
            [
              5,
              1,
              9,
              11
            ],
            [
              2,
              4,
              8,
              10
            ],
            [
              13,
              3,
              6,
              7
            ],
            [
              15,
              14,
              12,
              16
            ]
          ]
        ],
        "expected": [
          [
            15,
            13,
            2,
            5
          ],
          [
            14,
            3,
            4,
            1
          ],
          [
            12,
            6,
            8,
            9
          ],
          [
            16,
            7,
            10,
            11
          ]
        ]
      }
    ]
  },
  "spiral-matrix": {
    "id": "71",
    "slug": "spiral-matrix",
    "title": "Spiral Matrix",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Matrix"
      },
      {
        "name": "Simulation"
      }
    ],
    "description": "Given an `m x n` matrix, return all elements of the matrix in spiral order.",
    "constraints": [
      "m == matrix.length",
      "n == matrix[i].length",
      "1 <= m, n <= 10"
    ],
    "methodName": "spiralOrder",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} matrix\n * @return {any}\n */\nvar spiralOrder = function(matrix) {\n    \n};",
      "python": "class Solution:\n    def spiralOrder(self, matrix):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement spiralOrder\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement spiralOrder\n}"
    },
    "publicTestCases": [
      {
        "input": "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        "output": "[1,2,3,6,9,8,7,4,5]",
        "args": [
          [
            [
              1,
              2,
              3
            ],
            [
              4,
              5,
              6
            ],
            [
              7,
              8,
              9
            ]
          ]
        ],
        "expected": [
          1,
          2,
          3,
          6,
          9,
          8,
          7,
          4,
          5
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]",
        "output": "[1,2,3,4,8,12,11,10,9,5,6,7]",
        "args": [
          [
            [
              1,
              2,
              3,
              4
            ],
            [
              5,
              6,
              7,
              8
            ],
            [
              9,
              10,
              11,
              12
            ]
          ]
        ],
        "expected": [
          1,
          2,
          3,
          4,
          8,
          12,
          11,
          10,
          9,
          5,
          6,
          7
        ]
      }
    ]
  },
  "set-matrix-zeroes": {
    "id": "72",
    "slug": "set-matrix-zeroes",
    "title": "Set Matrix Zeroes",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Hash Table"
      },
      {
        "name": "Matrix"
      }
    ],
    "description": "Given an `m x n` integer matrix, if an element is 0, set its entire row and column to 0's in-place.",
    "constraints": [
      "m == matrix.length",
      "n == matrix[0].length",
      "1 <= m, n <= 200"
    ],
    "methodName": "setZeroes",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} matrix\n * @return {any}\n */\nvar setZeroes = function(matrix) {\n    \n};",
      "python": "class Solution:\n    def setZeroes(self, matrix):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement setZeroes\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement setZeroes\n}"
    },
    "publicTestCases": [
      {
        "input": "matrix = [[1,1,1],[1,0,1],[1,1,1]]",
        "output": "[[1,0,1],[0,0,0],[1,0,1]]",
        "args": [
          [
            [
              1,
              1,
              1
            ],
            [
              1,
              0,
              1
            ],
            [
              1,
              1,
              1
            ]
          ]
        ],
        "expected": [
          [
            1,
            0,
            1
          ],
          [
            0,
            0,
            0
          ],
          [
            1,
            0,
            1
          ]
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]",
        "output": "[[0,0,0,0],[0,4,5,0],[0,3,1,0]]",
        "args": [
          [
            [
              0,
              1,
              2,
              0
            ],
            [
              3,
              4,
              5,
              2
            ],
            [
              1,
              3,
              1,
              5
            ]
          ]
        ],
        "expected": [
          [
            0,
            0,
            0,
            0
          ],
          [
            0,
            4,
            5,
            0
          ],
          [
            0,
            3,
            1,
            0
          ]
        ]
      }
    ]
  },
  "number-of-islands": {
    "id": "73",
    "slug": "number-of-islands",
    "title": "Number of Islands",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "DFS"
      },
      {
        "name": "BFS"
      },
      {
        "name": "Union Find"
      },
      {
        "name": "Matrix"
      }
    ],
    "description": "Given an `m x n` 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
    "constraints": [
      "m == grid.length",
      "n == grid[i].length",
      "1 <= m, n <= 300"
    ],
    "methodName": "numIslands",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} grid\n * @return {any}\n */\nvar numIslands = function(grid) {\n    \n};",
      "python": "class Solution:\n    def numIslands(self, grid):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement numIslands\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement numIslands\n}"
    },
    "publicTestCases": [
      {
        "input": "grid = [[\"1\",\"1\",\"1\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"1\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"0\",\"0\"]]",
        "output": "1",
        "args": [
          [
            [
              "1",
              "1",
              "1",
              "1",
              "0"
            ],
            [
              "1",
              "1",
              "0",
              "1",
              "0"
            ],
            [
              "1",
              "1",
              "0",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "0",
              "0",
              "0"
            ]
          ]
        ],
        "expected": 1
      }
    ],
    "hiddenTestCases": [
      {
        "input": "grid = [[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"0\",\"1\",\"1\"]]",
        "output": "3",
        "args": [
          [
            [
              "1",
              "1",
              "0",
              "0",
              "0"
            ],
            [
              "1",
              "1",
              "0",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "1",
              "0",
              "0"
            ],
            [
              "0",
              "0",
              "0",
              "1",
              "1"
            ]
          ]
        ],
        "expected": 3
      }
    ]
  },
  "daily-temperatures": {
    "id": "74",
    "slug": "daily-temperatures",
    "title": "Daily Temperatures",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Stack"
      },
      {
        "name": "Monotonic Stack"
      }
    ],
    "description": "Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the ith day to get a warmer temperature.",
    "constraints": [
      "1 <= temperatures.length <= 10^5"
    ],
    "methodName": "dailyTemperatures",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} temperatures\n * @return {any}\n */\nvar dailyTemperatures = function(temperatures) {\n    \n};",
      "python": "class Solution:\n    def dailyTemperatures(self, temperatures):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement dailyTemperatures\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement dailyTemperatures\n}"
    },
    "publicTestCases": [
      {
        "input": "temperatures = [73,74,75,71,69,72,76,73]",
        "output": "[1,1,4,2,1,1,0,0]",
        "args": [
          [
            73,
            74,
            75,
            71,
            69,
            72,
            76,
            73
          ]
        ],
        "expected": [
          1,
          1,
          4,
          2,
          1,
          1,
          0,
          0
        ]
      },
      {
        "input": "temperatures = [30,40,50,60]",
        "output": "[1,1,1,0]",
        "args": [
          [
            30,
            40,
            50,
            60
          ]
        ],
        "expected": [
          1,
          1,
          1,
          0
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "temperatures = [30,60,90]",
        "output": "[1,1,0]",
        "args": [
          [
            30,
            60,
            90
          ]
        ],
        "expected": [
          1,
          1,
          0
        ]
      },
      {
        "input": "temperatures = [90,80,70]",
        "output": "[0,0,0]",
        "args": [
          [
            90,
            80,
            70
          ]
        ],
        "expected": [
          0,
          0,
          0
        ]
      }
    ]
  },
  "evaluate-reverse-polish-notation": {
    "id": "75",
    "slug": "evaluate-reverse-polish-notation",
    "title": "Evaluate Reverse Polish Notation",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Math"
      },
      {
        "name": "Stack"
      }
    ],
    "description": "You are given an array of strings `tokens` that represents an arithmetic expression in a Reverse Polish Notation. Evaluate the expression and return an integer.",
    "constraints": [
      "1 <= tokens.length <= 10^4"
    ],
    "methodName": "evalRPN",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} tokens\n * @return {any}\n */\nvar evalRPN = function(tokens) {\n    \n};",
      "python": "class Solution:\n    def evalRPN(self, tokens):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement evalRPN\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement evalRPN\n}"
    },
    "publicTestCases": [
      {
        "input": "tokens = [\"2\",\"1\",\"+\",\"3\",\"*\"]",
        "output": "9",
        "args": [
          [
            "2",
            "1",
            "+",
            "3",
            "*"
          ]
        ],
        "expected": 9
      },
      {
        "input": "tokens = [\"4\",\"13\",\"5\",\"/\",\"+\"]",
        "output": "6",
        "args": [
          [
            "4",
            "13",
            "5",
            "/",
            "+"
          ]
        ],
        "expected": 6
      }
    ],
    "hiddenTestCases": [
      {
        "input": "tokens = [\"10\",\"6\",\"9\",\"3\",\"+\",\"-11\",\"*\",\"/\",\"*\",\"17\",\"+\",\"5\",\"+\"]",
        "output": "22",
        "args": [
          [
            "10",
            "6",
            "9",
            "3",
            "+",
            "-11",
            "*",
            "/",
            "*",
            "17",
            "+",
            "5",
            "+"
          ]
        ],
        "expected": 22
      }
    ]
  },
  "generate-parentheses": {
    "id": "76",
    "slug": "generate-parentheses",
    "title": "Generate Parentheses",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Strings"
      },
      {
        "name": "Dynamic Programming"
      },
      {
        "name": "Backtracking"
      }
    ],
    "description": "Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    "constraints": [
      "1 <= n <= 8"
    ],
    "methodName": "generateParenthesis",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} n\n * @return {any}\n */\nvar generateParenthesis = function(n) {\n    \n};",
      "python": "class Solution:\n    def generateParenthesis(self, n):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement generateParenthesis\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement generateParenthesis\n}"
    },
    "publicTestCases": [
      {
        "input": "n = 3",
        "output": "[\"((()))\",\"(()())\",\"(())()\",\"()(())\",\"()()()\"]",
        "args": [
          3
        ],
        "expected": [
          "((()))",
          "(()())",
          "(())()",
          "()(())",
          "()()()"
        ]
      },
      {
        "input": "n = 1",
        "output": "[\"()\"]",
        "args": [
          1
        ],
        "expected": [
          "()"
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "n = 2",
        "output": "[\"(())\",\"()()\"]",
        "args": [
          2
        ],
        "expected": [
          "(())",
          "()()"
        ]
      }
    ]
  },
  "search-a-2d-matrix": {
    "id": "77",
    "slug": "search-a-2d-matrix",
    "title": "Search a 2D Matrix",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Binary Search"
      },
      {
        "name": "Matrix"
      }
    ],
    "description": "Write an efficient algorithm that searches for a value `target` in an `m x n` integer matrix where each row is sorted and the first integer of each row is greater than the last integer of previous row.",
    "constraints": [
      "m == matrix.length",
      "n == matrix[i].length",
      "1 <= m, n <= 100"
    ],
    "methodName": "searchMatrix",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} matrix, target\n * @return {any}\n */\nvar searchMatrix = function(matrix, target) {\n    \n};",
      "python": "class Solution:\n    def searchMatrix(self, matrix, target):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement searchMatrix\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement searchMatrix\n}"
    },
    "publicTestCases": [
      {
        "input": "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3",
        "output": "true",
        "args": [
          [
            [
              1,
              3,
              5,
              7
            ],
            [
              10,
              11,
              16,
              20
            ],
            [
              23,
              30,
              34,
              60
            ]
          ],
          3
        ],
        "expected": true
      },
      {
        "input": "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13",
        "output": "false",
        "args": [
          [
            [
              1,
              3,
              5,
              7
            ],
            [
              10,
              11,
              16,
              20
            ],
            [
              23,
              30,
              34,
              60
            ]
          ],
          13
        ],
        "expected": false
      }
    ],
    "hiddenTestCases": [
      {
        "input": "matrix = [[1]], target = 1",
        "output": "true",
        "args": [
          [
            [
              1
            ]
          ],
          1
        ],
        "expected": true
      },
      {
        "input": "matrix = [[1,1]], target = 2",
        "output": "false",
        "args": [
          [
            [
              1,
              1
            ]
          ],
          2
        ],
        "expected": false
      }
    ]
  },
  "find-minimum-in-rotated-sorted-array": {
    "id": "78",
    "slug": "find-minimum-in-rotated-sorted-array",
    "title": "Find Minimum in Rotated Sorted Array",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Binary Search"
      }
    ],
    "description": "Given the sorted rotated array `nums` of unique elements, return the minimum element of this array.",
    "constraints": [
      "n == nums.length",
      "1 <= n <= 5000"
    ],
    "methodName": "findMin",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar findMin = function(nums) {\n    \n};",
      "python": "class Solution:\n    def findMin(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement findMin\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement findMin\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [3,4,5,1,2]",
        "output": "1",
        "args": [
          [
            3,
            4,
            5,
            1,
            2
          ]
        ],
        "expected": 1
      },
      {
        "input": "nums = [4,5,6,7,0,1,2]",
        "output": "0",
        "args": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ]
        ],
        "expected": 0
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [11,13,15,17]",
        "output": "11",
        "args": [
          [
            11,
            13,
            15,
            17
          ]
        ],
        "expected": 11
      },
      {
        "input": "nums = [1]",
        "output": "1",
        "args": [
          [
            1
          ]
        ],
        "expected": 1
      },
      {
        "input": "nums = [2,1]",
        "output": "1",
        "args": [
          [
            2,
            1
          ]
        ],
        "expected": 1
      }
    ]
  },
  "search-in-rotated-sorted-array": {
    "id": "79",
    "slug": "search-in-rotated-sorted-array",
    "title": "Search in Rotated Sorted Array",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Binary Search"
      }
    ],
    "description": "Given the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not.",
    "constraints": [
      "1 <= nums.length <= 5000"
    ],
    "methodName": "searchRotated",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums, target\n * @return {any}\n */\nvar searchRotated = function(nums, target) {\n    \n};",
      "python": "class Solution:\n    def searchRotated(self, nums, target):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement searchRotated\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement searchRotated\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [4,5,6,7,0,1,2], target = 0",
        "output": "4",
        "args": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ],
          0
        ],
        "expected": 4
      },
      {
        "input": "nums = [4,5,6,7,0,1,2], target = 3",
        "output": "-1",
        "args": [
          [
            4,
            5,
            6,
            7,
            0,
            1,
            2
          ],
          3
        ],
        "expected": -1
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [1], target = 0",
        "output": "-1",
        "args": [
          [
            1
          ],
          0
        ],
        "expected": -1
      },
      {
        "input": "nums = [1], target = 1",
        "output": "0",
        "args": [
          [
            1
          ],
          1
        ],
        "expected": 0
      },
      {
        "input": "nums = [5,1,3], target = 5",
        "output": "0",
        "args": [
          [
            5,
            1,
            3
          ],
          5
        ],
        "expected": 0
      }
    ]
  },
  "koko-eating-bananas": {
    "id": "80",
    "slug": "koko-eating-bananas",
    "title": "Koko Eating Bananas",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Binary Search"
      }
    ],
    "description": "Koko loves to eat bananas. Return the minimum integer `k` such that she can eat all the bananas within `h` hours.",
    "constraints": [
      "1 <= piles.length <= 10^4",
      "piles.length <= h <= 10^9"
    ],
    "methodName": "minEatingSpeed",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} piles, h\n * @return {any}\n */\nvar minEatingSpeed = function(piles, h) {\n    \n};",
      "python": "class Solution:\n    def minEatingSpeed(self, piles, h):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement minEatingSpeed\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement minEatingSpeed\n}"
    },
    "publicTestCases": [
      {
        "input": "piles = [3,6,7,11], h = 8",
        "output": "4",
        "args": [
          [
            3,
            6,
            7,
            11
          ],
          8
        ],
        "expected": 4
      },
      {
        "input": "piles = [30,11,23,4,20], h = 5",
        "output": "30",
        "args": [
          [
            30,
            11,
            23,
            4,
            20
          ],
          5
        ],
        "expected": 30
      }
    ],
    "hiddenTestCases": [
      {
        "input": "piles = [30,11,23,4,20], h = 6",
        "output": "23",
        "args": [
          [
            30,
            11,
            23,
            4,
            20
          ],
          6
        ],
        "expected": 23
      },
      {
        "input": "piles = [312884470], h = 312884469",
        "output": "2",
        "args": [
          [
            312884470
          ],
          312884469
        ],
        "expected": 2
      }
    ]
  },
  "letter-combinations-of-a-phone-number": {
    "id": "81",
    "slug": "letter-combinations-of-a-phone-number",
    "title": "Letter Combinations of a Phone Number",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Hash Table"
      },
      {
        "name": "Strings"
      },
      {
        "name": "Backtracking"
      }
    ],
    "description": "Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent.",
    "constraints": [
      "0 <= digits.length <= 4"
    ],
    "methodName": "letterCombinations",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} digits\n * @return {any}\n */\nvar letterCombinations = function(digits) {\n    \n};",
      "python": "class Solution:\n    def letterCombinations(self, digits):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement letterCombinations\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement letterCombinations\n}"
    },
    "publicTestCases": [
      {
        "input": "digits = \"23\"",
        "output": "[\"ad\",\"ae\",\"af\",\"bd\",\"be\",\"bf\",\"cd\",\"ce\",\"cf\"]",
        "args": [
          "23"
        ],
        "expected": [
          "ad",
          "ae",
          "af",
          "bd",
          "be",
          "bf",
          "cd",
          "ce",
          "cf"
        ]
      },
      {
        "input": "digits = \"\"",
        "output": "[]",
        "args": [
          ""
        ],
        "expected": []
      }
    ],
    "hiddenTestCases": [
      {
        "input": "digits = \"2\"",
        "output": "[\"a\",\"b\",\"c\"]",
        "args": [
          "2"
        ],
        "expected": [
          "a",
          "b",
          "c"
        ]
      }
    ]
  },
  "combination-sum": {
    "id": "82",
    "slug": "combination-sum",
    "title": "Combination Sum",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Backtracking"
      }
    ],
    "description": "Given an array of distinct integers `candidates` and a target integer `target`, return a list of all unique combinations of `candidates` where the chosen numbers sum to `target`.",
    "constraints": [
      "1 <= candidates.length <= 30",
      "2 <= target <= 40"
    ],
    "methodName": "combinationSum",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} candidates, target\n * @return {any}\n */\nvar combinationSum = function(candidates, target) {\n    \n};",
      "python": "class Solution:\n    def combinationSum(self, candidates, target):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement combinationSum\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement combinationSum\n}"
    },
    "publicTestCases": [
      {
        "input": "candidates = [2,3,6,7], target = 7",
        "output": "[[2,2,3],[7]]",
        "args": [
          [
            2,
            3,
            6,
            7
          ],
          7
        ],
        "expected": [
          [
            2,
            2,
            3
          ],
          [
            7
          ]
        ]
      },
      {
        "input": "candidates = [2,3,5], target = 8",
        "output": "[[2,2,2,2],[2,3,3],[3,5]]",
        "args": [
          [
            2,
            3,
            5
          ],
          8
        ],
        "expected": [
          [
            2,
            2,
            2,
            2
          ],
          [
            2,
            3,
            3
          ],
          [
            3,
            5
          ]
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "candidates = [2], target = 1",
        "output": "[]",
        "args": [
          [
            2
          ],
          1
        ],
        "expected": []
      }
    ]
  },
  "permutations": {
    "id": "83",
    "slug": "permutations",
    "title": "Permutations",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Backtracking"
      }
    ],
    "description": "Given an array `nums` of distinct integers, return all the possible permutations in any order.",
    "constraints": [
      "1 <= nums.length <= 6"
    ],
    "methodName": "permute",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar permute = function(nums) {\n    \n};",
      "python": "class Solution:\n    def permute(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement permute\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement permute\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [1,2,3]",
        "output": "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
        "args": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": [
          [
            1,
            2,
            3
          ],
          [
            1,
            3,
            2
          ],
          [
            2,
            1,
            3
          ],
          [
            2,
            3,
            1
          ],
          [
            3,
            1,
            2
          ],
          [
            3,
            2,
            1
          ]
        ]
      },
      {
        "input": "nums = [0,1]",
        "output": "[[0,1],[1,0]]",
        "args": [
          [
            0,
            1
          ]
        ],
        "expected": [
          [
            0,
            1
          ],
          [
            1,
            0
          ]
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [1]",
        "output": "[[1]]",
        "args": [
          [
            1
          ]
        ],
        "expected": [
          [
            1
          ]
        ]
      }
    ]
  },
  "subsets": {
    "id": "84",
    "slug": "subsets",
    "title": "Subsets",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Backtracking"
      },
      {
        "name": "Bit Manipulation"
      }
    ],
    "description": "Given an integer array `nums` of unique elements, return all possible subsets (the power set).",
    "constraints": [
      "1 <= nums.length <= 10"
    ],
    "methodName": "subsets",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar subsets = function(nums) {\n    \n};",
      "python": "class Solution:\n    def subsets(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement subsets\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement subsets\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [1,2,3]",
        "output": "[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]",
        "args": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": [
          [],
          [
            1
          ],
          [
            2
          ],
          [
            1,
            2
          ],
          [
            3
          ],
          [
            1,
            3
          ],
          [
            2,
            3
          ],
          [
            1,
            2,
            3
          ]
        ]
      },
      {
        "input": "nums = [0]",
        "output": "[[],[0]]",
        "args": [
          [
            0
          ]
        ],
        "expected": [
          [],
          [
            0
          ]
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [1,2]",
        "output": "[[],[1],[2],[1,2]]",
        "args": [
          [
            1,
            2
          ]
        ],
        "expected": [
          [],
          [
            1
          ],
          [
            2
          ],
          [
            1,
            2
          ]
        ]
      }
    ]
  },
  "word-search": {
    "id": "85",
    "slug": "word-search",
    "title": "Word Search",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Strings"
      },
      {
        "name": "Backtracking"
      },
      {
        "name": "Matrix"
      }
    ],
    "description": "Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.",
    "constraints": [
      "m == board.length",
      "n = board[i].length",
      "1 <= word.length <= 15"
    ],
    "methodName": "exist",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} board, word\n * @return {any}\n */\nvar exist = function(board, word) {\n    \n};",
      "python": "class Solution:\n    def exist(self, board, word):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement exist\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement exist\n}"
    },
    "publicTestCases": [
      {
        "input": "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCCED\"",
        "output": "true",
        "args": [
          [
            [
              "A",
              "B",
              "C",
              "E"
            ],
            [
              "S",
              "F",
              "C",
              "S"
            ],
            [
              "A",
              "D",
              "E",
              "E"
            ]
          ],
          "ABCCED"
        ],
        "expected": true
      },
      {
        "input": "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"SEE\"",
        "output": "true",
        "args": [
          [
            [
              "A",
              "B",
              "C",
              "E"
            ],
            [
              "S",
              "F",
              "C",
              "S"
            ],
            [
              "A",
              "D",
              "E",
              "E"
            ]
          ],
          "SEE"
        ],
        "expected": true
      }
    ],
    "hiddenTestCases": [
      {
        "input": "board = [[\"A\",\"B\",\"C\",\"E\"],[\"S\",\"F\",\"C\",\"S\"],[\"A\",\"D\",\"E\",\"E\"]], word = \"ABCB\"",
        "output": "false",
        "args": [
          [
            [
              "A",
              "B",
              "C",
              "E"
            ],
            [
              "S",
              "F",
              "C",
              "S"
            ],
            [
              "A",
              "D",
              "E",
              "E"
            ]
          ],
          "ABCB"
        ],
        "expected": false
      }
    ]
  },
  "find-all-anagrams-in-a-string": {
    "id": "86",
    "slug": "find-all-anagrams-in-a-string",
    "title": "Find All Anagrams in a String",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Hash Table"
      },
      {
        "name": "Strings"
      },
      {
        "name": "Sliding Window"
      }
    ],
    "description": "Given two strings `s` and `p`, return an array of all the start indices of `p`'s anagrams in `s`.",
    "constraints": [
      "1 <= s.length, p.length <= 3 * 10^4"
    ],
    "methodName": "findAnagrams",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s, p\n * @return {any}\n */\nvar findAnagrams = function(s, p) {\n    \n};",
      "python": "class Solution:\n    def findAnagrams(self, s, p):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement findAnagrams\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement findAnagrams\n}"
    },
    "publicTestCases": [
      {
        "input": "s = \"cbaebabacd\", p = \"abc\"",
        "output": "[0,6]",
        "args": [
          "cbaebabacd",
          "abc"
        ],
        "expected": [
          0,
          6
        ]
      },
      {
        "input": "s = \"abab\", p = \"ab\"",
        "output": "[0,1,2]",
        "args": [
          "abab",
          "ab"
        ],
        "expected": [
          0,
          1,
          2
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s = \"aaaaaaaaaa\", p = \"aaaaaaaaaaaaa\"",
        "output": "[]",
        "args": [
          "aaaaaaaaaa",
          "aaaaaaaaaaaaa"
        ],
        "expected": []
      }
    ]
  },
  "longest-repeating-character-replacement": {
    "id": "87",
    "slug": "longest-repeating-character-replacement",
    "title": "Longest Repeating Character Replacement",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Hash Table"
      },
      {
        "name": "Strings"
      },
      {
        "name": "Sliding Window"
      }
    ],
    "description": "You are given a string `s` and an integer `k`. You can choose any character of the string and change it to any other uppercase English character at most `k` times. Return the length of the longest substring containing the same letter you can get after performing above operations.",
    "constraints": [
      "1 <= s.length <= 10^5",
      "0 <= k <= s.length"
    ],
    "methodName": "characterReplacement",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s, k\n * @return {any}\n */\nvar characterReplacement = function(s, k) {\n    \n};",
      "python": "class Solution:\n    def characterReplacement(self, s, k):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement characterReplacement\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement characterReplacement\n}"
    },
    "publicTestCases": [
      {
        "input": "s = \"ABAB\", k = 2",
        "output": "4",
        "args": [
          "ABAB",
          2
        ],
        "expected": 4
      },
      {
        "input": "s = \"AABABBA\", k = 1",
        "output": "4",
        "args": [
          "AABABBA",
          1
        ],
        "expected": 4
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s = \"AAAA\", k = 2",
        "output": "4",
        "args": [
          "AAAA",
          2
        ],
        "expected": 4
      },
      {
        "input": "s = \"ABBB\", k = 2",
        "output": "4",
        "args": [
          "ABBB",
          2
        ],
        "expected": 4
      }
    ]
  },
  "permutation-in-string": {
    "id": "88",
    "slug": "permutation-in-string",
    "title": "Permutation in String",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Hash Table"
      },
      {
        "name": "Two Pointers"
      },
      {
        "name": "Strings"
      },
      {
        "name": "Sliding Window"
      }
    ],
    "description": "Given two strings `s1` and `s2`, return `true` if `s2` contains a permutation of `s1`, or `false` otherwise.",
    "constraints": [
      "1 <= s1.length, s2.length <= 10^4"
    ],
    "methodName": "checkInclusion",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s1, s2\n * @return {any}\n */\nvar checkInclusion = function(s1, s2) {\n    \n};",
      "python": "class Solution:\n    def checkInclusion(self, s1, s2):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement checkInclusion\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement checkInclusion\n}"
    },
    "publicTestCases": [
      {
        "input": "s1 = \"ab\", s2 = \"eidbaooo\"",
        "output": "true",
        "args": [
          "ab",
          "eidbaooo"
        ],
        "expected": true
      },
      {
        "input": "s1 = \"ab\", s2 = \"eidboaoo\"",
        "output": "false",
        "args": [
          "ab",
          "eidboaoo"
        ],
        "expected": false
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s1 = \"adc\", s2 = \"dcda\"",
        "output": "true",
        "args": [
          "adc",
          "dcda"
        ],
        "expected": true
      }
    ]
  },
  "minimum-size-subarray-sum": {
    "id": "89",
    "slug": "minimum-size-subarray-sum",
    "title": "Minimum Size Subarray Sum",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Binary Search"
      },
      {
        "name": "Sliding Window"
      },
      {
        "name": "Prefix Sum"
      }
    ],
    "description": "Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a subarray whose sum is greater than or equal to `target`. If there is no such subarray, return 0.",
    "constraints": [
      "1 <= target <= 10^9",
      "1 <= nums.length <= 10^5"
    ],
    "methodName": "minSubArrayLen",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} target, nums\n * @return {any}\n */\nvar minSubArrayLen = function(target, nums) {\n    \n};",
      "python": "class Solution:\n    def minSubArrayLen(self, target, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement minSubArrayLen\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement minSubArrayLen\n}"
    },
    "publicTestCases": [
      {
        "input": "target = 7, nums = [2,3,1,2,4,3]",
        "output": "2",
        "args": [
          7,
          [
            2,
            3,
            1,
            2,
            4,
            3
          ]
        ],
        "expected": 2
      },
      {
        "input": "target = 4, nums = [1,4,4]",
        "output": "1",
        "args": [
          4,
          [
            1,
            4,
            4
          ]
        ],
        "expected": 1
      }
    ],
    "hiddenTestCases": [
      {
        "input": "target = 11, nums = [1,1,1,1,1,1,1,1]",
        "output": "0",
        "args": [
          11,
          [
            1,
            1,
            1,
            1,
            1,
            1,
            1,
            1
          ]
        ],
        "expected": 0
      },
      {
        "input": "target = 15, nums = [1,2,3,4,5]",
        "output": "5",
        "args": [
          15,
          [
            1,
            2,
            3,
            4,
            5
          ]
        ],
        "expected": 5
      }
    ]
  },
  "target-sum": {
    "id": "90",
    "slug": "target-sum",
    "title": "Target Sum",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Dynamic Programming"
      },
      {
        "name": "Backtracking"
      }
    ],
    "description": "You are given an integer array `nums` and an integer `target`. Build an expression out of nums by adding one of the symbols '+' and '-' before each integer in nums and then concatenate all the integers. Return the number of different expressions that you can build, which evaluates to `target`.",
    "constraints": [
      "1 <= nums.length <= 20",
      "0 <= sum(nums[i]) <= 1000"
    ],
    "methodName": "findTargetSumWays",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums, target\n * @return {any}\n */\nvar findTargetSumWays = function(nums, target) {\n    \n};",
      "python": "class Solution:\n    def findTargetSumWays(self, nums, target):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement findTargetSumWays\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement findTargetSumWays\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [1,1,1,1,1], target = 3",
        "output": "5",
        "args": [
          [
            1,
            1,
            1,
            1,
            1
          ],
          3
        ],
        "expected": 5
      },
      {
        "input": "nums = [1], target = 1",
        "output": "1",
        "args": [
          [
            1
          ],
          1
        ],
        "expected": 1
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [1,0], target = 1",
        "output": "2",
        "args": [
          [
            1,
            0
          ],
          1
        ],
        "expected": 2
      },
      {
        "input": "nums = [0,0,0,0,0,0,0,0,1], target = 1",
        "output": "256",
        "args": [
          [
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1
          ],
          1
        ],
        "expected": 256
      }
    ]
  },
  "word-break": {
    "id": "91",
    "slug": "word-break",
    "title": "Word Break",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Hash Table"
      },
      {
        "name": "Strings"
      },
      {
        "name": "Dynamic Programming"
      },
      {
        "name": "Trie"
      }
    ],
    "description": "Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.",
    "constraints": [
      "1 <= s.length <= 300",
      "1 <= wordDict.length <= 1000"
    ],
    "methodName": "wordBreak",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s, wordDict\n * @return {any}\n */\nvar wordBreak = function(s, wordDict) {\n    \n};",
      "python": "class Solution:\n    def wordBreak(self, s, wordDict):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement wordBreak\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement wordBreak\n}"
    },
    "publicTestCases": [
      {
        "input": "s = \"leetcode\", wordDict = [\"leet\",\"code\"]",
        "output": "true",
        "args": [
          "leetcode",
          [
            "leet",
            "code"
          ]
        ],
        "expected": true
      },
      {
        "input": "s = \"applepenapple\", wordDict = [\"apple\",\"pen\"]",
        "output": "true",
        "args": [
          "applepenapple",
          [
            "apple",
            "pen"
          ]
        ],
        "expected": true
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s = \"catsandog\", wordDict = [\"cats\",\"dog\",\"sand\",\"and\",\"cat\"]",
        "output": "false",
        "args": [
          "catsandog",
          [
            "cats",
            "dog",
            "sand",
            "and",
            "cat"
          ]
        ],
        "expected": false
      }
    ]
  },
  "partition-equal-subset-sum": {
    "id": "92",
    "slug": "partition-equal-subset-sum",
    "title": "Partition Equal Subset Sum",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Dynamic Programming"
      }
    ],
    "description": "Given an integer array `nums`, return `true` if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or `false` otherwise.",
    "constraints": [
      "1 <= nums.length <= 200",
      "1 <= nums[i] <= 100"
    ],
    "methodName": "canPartition",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar canPartition = function(nums) {\n    \n};",
      "python": "class Solution:\n    def canPartition(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement canPartition\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement canPartition\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [1,5,11,5]",
        "output": "true",
        "args": [
          [
            1,
            5,
            11,
            5
          ]
        ],
        "expected": true
      },
      {
        "input": "nums = [1,2,3,5]",
        "output": "false",
        "args": [
          [
            1,
            2,
            3,
            5
          ]
        ],
        "expected": false
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [1,1]",
        "output": "true",
        "args": [
          [
            1,
            1
          ]
        ],
        "expected": true
      },
      {
        "input": "nums = [2,2,3,5]",
        "output": "false",
        "args": [
          [
            2,
            2,
            3,
            5
          ]
        ],
        "expected": false
      }
    ]
  },
  "longest-increasing-subsequence": {
    "id": "93",
    "slug": "longest-increasing-subsequence",
    "title": "Longest Increasing Subsequence",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Binary Search"
      },
      {
        "name": "Dynamic Programming"
      }
    ],
    "description": "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.",
    "constraints": [
      "1 <= nums.length <= 2500"
    ],
    "methodName": "lengthOfLIS",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar lengthOfLIS = function(nums) {\n    \n};",
      "python": "class Solution:\n    def lengthOfLIS(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement lengthOfLIS\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement lengthOfLIS\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [10,9,2,5,3,7,101,18]",
        "output": "4",
        "args": [
          [
            10,
            9,
            2,
            5,
            3,
            7,
            101,
            18
          ]
        ],
        "expected": 4
      },
      {
        "input": "nums = [0,1,0,3,2,3]",
        "output": "4",
        "args": [
          [
            0,
            1,
            0,
            3,
            2,
            3
          ]
        ],
        "expected": 4
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [7,7,7,7,7,7,7]",
        "output": "1",
        "args": [
          [
            7,
            7,
            7,
            7,
            7,
            7,
            7
          ]
        ],
        "expected": 1
      },
      {
        "input": "nums = [1,3,6,7,9,4,10,5,6]",
        "output": "6",
        "args": [
          [
            1,
            3,
            6,
            7,
            9,
            4,
            10,
            5,
            6
          ]
        ],
        "expected": 6
      }
    ]
  },
  "maximum-product-subarray": {
    "id": "94",
    "slug": "maximum-product-subarray",
    "title": "Maximum Product Subarray",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Dynamic Programming"
      }
    ],
    "description": "Given an integer array `nums`, find a subarray that has the largest product, and return the product.",
    "constraints": [
      "1 <= nums.length <= 2 * 10^4"
    ],
    "methodName": "maxProduct",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar maxProduct = function(nums) {\n    \n};",
      "python": "class Solution:\n    def maxProduct(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement maxProduct\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement maxProduct\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [2,3,-2,4]",
        "output": "6",
        "args": [
          [
            2,
            3,
            -2,
            4
          ]
        ],
        "expected": 6
      },
      {
        "input": "nums = [-2,0,-1]",
        "output": "0",
        "args": [
          [
            -2,
            0,
            -1
          ]
        ],
        "expected": 0
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [-2,3,-4]",
        "output": "24",
        "args": [
          [
            -2,
            3,
            -4
          ]
        ],
        "expected": 24
      },
      {
        "input": "nums = [0,2]",
        "output": "2",
        "args": [
          [
            0,
            2
          ]
        ],
        "expected": 2
      }
    ]
  },
  "kth-largest-element-in-an-array": {
    "id": "95",
    "slug": "kth-largest-element-in-an-array",
    "title": "Kth Largest Element in an Array",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Divide and Conquer"
      },
      {
        "name": "Sorting"
      },
      {
        "name": "Heap"
      },
      {
        "name": "Quickselect"
      }
    ],
    "description": "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array.",
    "constraints": [
      "1 <= k <= nums.length <= 10^5"
    ],
    "methodName": "findKthLargest",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums, k\n * @return {any}\n */\nvar findKthLargest = function(nums, k) {\n    \n};",
      "python": "class Solution:\n    def findKthLargest(self, nums, k):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement findKthLargest\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement findKthLargest\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [3,2,1,5,6,4], k = 2",
        "output": "5",
        "args": [
          [
            3,
            2,
            1,
            5,
            6,
            4
          ],
          2
        ],
        "expected": 5
      },
      {
        "input": "nums = [3,2,3,1,2,4,5,5,6], k = 4",
        "output": "4",
        "args": [
          [
            3,
            2,
            3,
            1,
            2,
            4,
            5,
            5,
            6
          ],
          4
        ],
        "expected": 4
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [1], k = 1",
        "output": "1",
        "args": [
          [
            1
          ],
          1
        ],
        "expected": 1
      },
      {
        "input": "nums = [7,6,5,4,3,2,1], k = 5",
        "output": "3",
        "args": [
          [
            7,
            6,
            5,
            4,
            3,
            2,
            1
          ],
          5
        ],
        "expected": 3
      }
    ]
  },
  "sort-colors": {
    "id": "96",
    "slug": "sort-colors",
    "title": "Sort Colors",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Two Pointers"
      },
      {
        "name": "Sorting"
      }
    ],
    "description": "Given an array `nums` with `n` objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with colors in order red (0), white (1), and blue (2).",
    "constraints": [
      "n == nums.length",
      "1 <= n <= 300"
    ],
    "methodName": "sortColors",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar sortColors = function(nums) {\n    \n};",
      "python": "class Solution:\n    def sortColors(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement sortColors\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement sortColors\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [2,0,2,1,1,0]",
        "output": "[0,0,1,1,2,2]",
        "args": [
          [
            2,
            0,
            2,
            1,
            1,
            0
          ]
        ],
        "expected": [
          0,
          0,
          1,
          1,
          2,
          2
        ]
      },
      {
        "input": "nums = [2,0,1]",
        "output": "[0,1,2]",
        "args": [
          [
            2,
            0,
            1
          ]
        ],
        "expected": [
          0,
          1,
          2
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [0]",
        "output": "[0]",
        "args": [
          [
            0
          ]
        ],
        "expected": [
          0
        ]
      },
      {
        "input": "nums = [1]",
        "output": "[1]",
        "args": [
          [
            1
          ]
        ],
        "expected": [
          1
        ]
      }
    ]
  },
  "next-permutation": {
    "id": "97",
    "slug": "next-permutation",
    "title": "Next Permutation",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Two Pointers"
      }
    ],
    "description": "A permutation of an array of integers is an arrangement of its members into a sequence or linear order. Find the next lexicographical permutation of `nums` in-place.",
    "constraints": [
      "1 <= nums.length <= 100"
    ],
    "methodName": "nextPermutation",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar nextPermutation = function(nums) {\n    \n};",
      "python": "class Solution:\n    def nextPermutation(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement nextPermutation\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement nextPermutation\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [1,2,3]",
        "output": "[1,3,2]",
        "args": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": [
          1,
          3,
          2
        ]
      },
      {
        "input": "nums = [3,2,1]",
        "output": "[1,2,3]",
        "args": [
          [
            3,
            2,
            1
          ]
        ],
        "expected": [
          1,
          2,
          3
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [1,1,5]",
        "output": "[1,5,1]",
        "args": [
          [
            1,
            1,
            5
          ]
        ],
        "expected": [
          1,
          5,
          1
        ]
      },
      {
        "input": "nums = [1]",
        "output": "[1]",
        "args": [
          [
            1
          ]
        ],
        "expected": [
          1
        ]
      }
    ]
  },
  "non-overlapping-intervals": {
    "id": "98",
    "slug": "non-overlapping-intervals",
    "title": "Non-overlapping Intervals",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Dynamic Programming"
      },
      {
        "name": "Greedy"
      },
      {
        "name": "Sorting"
      }
    ],
    "description": "Given an array of intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.",
    "constraints": [
      "1 <= intervals.length <= 10^5"
    ],
    "methodName": "eraseOverlapIntervals",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} intervals\n * @return {any}\n */\nvar eraseOverlapIntervals = function(intervals) {\n    \n};",
      "python": "class Solution:\n    def eraseOverlapIntervals(self, intervals):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement eraseOverlapIntervals\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement eraseOverlapIntervals\n}"
    },
    "publicTestCases": [
      {
        "input": "intervals = [[1,2],[2,3],[3,4],[1,3]]",
        "output": "1",
        "args": [
          [
            [
              1,
              2
            ],
            [
              2,
              3
            ],
            [
              3,
              4
            ],
            [
              1,
              3
            ]
          ]
        ],
        "expected": 1
      },
      {
        "input": "intervals = [[1,2],[1,2],[1,2]]",
        "output": "2",
        "args": [
          [
            [
              1,
              2
            ],
            [
              1,
              2
            ],
            [
              1,
              2
            ]
          ]
        ],
        "expected": 2
      }
    ],
    "hiddenTestCases": [
      {
        "input": "intervals = [[1,2],[2,3]]",
        "output": "0",
        "args": [
          [
            [
              1,
              2
            ],
            [
              2,
              3
            ]
          ]
        ],
        "expected": 0
      }
    ]
  },
  "merge-intervals": {
    "id": "99",
    "slug": "merge-intervals",
    "title": "Merge Intervals",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Sorting"
      }
    ],
    "description": "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    "constraints": [
      "1 <= intervals.length <= 10^4"
    ],
    "methodName": "mergeIntervals",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} intervals\n * @return {any}\n */\nvar mergeIntervals = function(intervals) {\n    \n};",
      "python": "class Solution:\n    def mergeIntervals(self, intervals):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement mergeIntervals\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement mergeIntervals\n}"
    },
    "publicTestCases": [
      {
        "input": "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        "output": "[[1,6],[8,10],[15,18]]",
        "args": [
          [
            [
              1,
              3
            ],
            [
              2,
              6
            ],
            [
              8,
              10
            ],
            [
              15,
              18
            ]
          ]
        ],
        "expected": [
          [
            1,
            6
          ],
          [
            8,
            10
          ],
          [
            15,
            18
          ]
        ]
      },
      {
        "input": "intervals = [[1,4],[4,5]]",
        "output": "[[1,5]]",
        "args": [
          [
            [
              1,
              4
            ],
            [
              4,
              5
            ]
          ]
        ],
        "expected": [
          [
            1,
            5
          ]
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "intervals = [[1,4],[0,4]]",
        "output": "[[0,4]]",
        "args": [
          [
            [
              1,
              4
            ],
            [
              0,
              4
            ]
          ]
        ],
        "expected": [
          [
            0,
            4
          ]
        ]
      },
      {
        "input": "intervals = [[1,4],[2,3]]",
        "output": "[[1,4]]",
        "args": [
          [
            [
              1,
              4
            ],
            [
              2,
              3
            ]
          ]
        ],
        "expected": [
          [
            1,
            4
          ]
        ]
      }
    ]
  },
  "insert-interval": {
    "id": "100",
    "slug": "insert-interval",
    "title": "Insert Interval",
    "difficulty": "MEDIUM",
    "topics": [
      {
        "name": "Arrays"
      }
    ],
    "description": "You are given an array of non-overlapping intervals `intervals` sorted by `start_i`. Insert `newInterval` into `intervals` such that `intervals` is still sorted and non-overlapping.",
    "constraints": [
      "0 <= intervals.length <= 10^4"
    ],
    "methodName": "insert",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} intervals, newInterval\n * @return {any}\n */\nvar insert = function(intervals, newInterval) {\n    \n};",
      "python": "class Solution:\n    def insert(self, intervals, newInterval):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement insert\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement insert\n}"
    },
    "publicTestCases": [
      {
        "input": "intervals = [[1,3],[6,9]], newInterval = [2,5]",
        "output": "[[1,5],[6,9]]",
        "args": [
          [
            [
              1,
              3
            ],
            [
              6,
              9
            ]
          ],
          [
            2,
            5
          ]
        ],
        "expected": [
          [
            1,
            5
          ],
          [
            6,
            9
          ]
        ]
      },
      {
        "input": "intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]",
        "output": "[[1,2],[3,10],[12,16]]",
        "args": [
          [
            [
              1,
              2
            ],
            [
              3,
              5
            ],
            [
              6,
              7
            ],
            [
              8,
              10
            ],
            [
              12,
              16
            ]
          ],
          [
            4,
            8
          ]
        ],
        "expected": [
          [
            1,
            2
          ],
          [
            3,
            10
          ],
          [
            12,
            16
          ]
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "intervals = [], newInterval = [5,7]",
        "output": "[[5,7]]",
        "args": [
          [],
          [
            5,
            7
          ]
        ],
        "expected": [
          [
            5,
            7
          ]
        ]
      }
    ]
  },
  "trapping-rain-water": {
    "id": "101",
    "slug": "trapping-rain-water",
    "title": "Trapping Rain Water",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Two Pointers"
      },
      {
        "name": "Dynamic Programming"
      },
      {
        "name": "Stack"
      }
    ],
    "description": "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    "constraints": [
      "n == height.length",
      "1 <= n <= 2 * 10^4",
      "0 <= height[i] <= 10^5"
    ],
    "methodName": "trap",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} height\n * @return {any}\n */\nvar trap = function(height) {\n    \n};",
      "python": "class Solution:\n    def trap(self, height):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement trap\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement trap\n}"
    },
    "publicTestCases": [
      {
        "input": "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        "output": "6",
        "args": [
          [
            0,
            1,
            0,
            2,
            1,
            0,
            1,
            3,
            2,
            1,
            2,
            1
          ]
        ],
        "expected": 6
      },
      {
        "input": "height = [4,2,0,3,2,5]",
        "output": "9",
        "args": [
          [
            4,
            2,
            0,
            3,
            2,
            5
          ]
        ],
        "expected": 9
      }
    ],
    "hiddenTestCases": [
      {
        "input": "height = [1,2,3,4,5]",
        "output": "0",
        "args": [
          [
            1,
            2,
            3,
            4,
            5
          ]
        ],
        "expected": 0
      },
      {
        "input": "height = [5,4,3,2,1]",
        "output": "0",
        "args": [
          [
            5,
            4,
            3,
            2,
            1
          ]
        ],
        "expected": 0
      },
      {
        "input": "height = [3,0,2,0,4]",
        "output": "7",
        "args": [
          [
            3,
            0,
            2,
            0,
            4
          ]
        ],
        "expected": 7
      }
    ]
  },
  "median-of-two-sorted-arrays": {
    "id": "102",
    "slug": "median-of-two-sorted-arrays",
    "title": "Median of Two Sorted Arrays",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Binary Search"
      },
      {
        "name": "Divide and Conquer"
      }
    ],
    "description": "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays in O(log(m+n)) runtime.",
    "constraints": [
      "0 <= m, n <= 1000",
      "1 <= m + n <= 2000"
    ],
    "methodName": "findMedianSortedArrays",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums1, nums2\n * @return {any}\n */\nvar findMedianSortedArrays = function(nums1, nums2) {\n    \n};",
      "python": "class Solution:\n    def findMedianSortedArrays(self, nums1, nums2):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement findMedianSortedArrays\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement findMedianSortedArrays\n}"
    },
    "publicTestCases": [
      {
        "input": "nums1 = [1,3], nums2 = [2]",
        "output": "2",
        "args": [
          [
            1,
            3
          ],
          [
            2
          ]
        ],
        "expected": 2
      },
      {
        "input": "nums1 = [1,2], nums2 = [3,4]",
        "output": "2.5",
        "args": [
          [
            1,
            2
          ],
          [
            3,
            4
          ]
        ],
        "expected": 2.5
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums1 = [0,0], nums2 = [0,0]",
        "output": "0",
        "args": [
          [
            0,
            0
          ],
          [
            0,
            0
          ]
        ],
        "expected": 0
      },
      {
        "input": "nums1 = [], nums2 = [1]",
        "output": "1",
        "args": [
          [],
          [
            1
          ]
        ],
        "expected": 1
      }
    ]
  },
  "merge-k-sorted-lists": {
    "id": "103",
    "slug": "merge-k-sorted-lists",
    "title": "Merge k Sorted Lists",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Linked List"
      },
      {
        "name": "Divide and Conquer"
      },
      {
        "name": "Heap"
      }
    ],
    "description": "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    "constraints": [
      "k == lists.length",
      "0 <= k <= 10^4",
      "0 <= lists[i].length <= 500"
    ],
    "methodName": "mergeKLists",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} lists\n * @return {any}\n */\nvar mergeKLists = function(lists) {\n    \n};",
      "python": "class Solution:\n    def mergeKLists(self, lists):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement mergeKLists\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement mergeKLists\n}"
    },
    "publicTestCases": [
      {
        "input": "lists = [[1,4,5],[1,3,4],[2,6]]",
        "output": "[1,1,2,3,4,4,5,6]",
        "args": [
          [
            [
              1,
              4,
              5
            ],
            [
              1,
              3,
              4
            ],
            [
              2,
              6
            ]
          ]
        ],
        "expected": [
          1,
          1,
          2,
          3,
          4,
          4,
          5,
          6
        ]
      },
      {
        "input": "lists = []",
        "output": "[]",
        "args": [
          []
        ],
        "expected": []
      }
    ],
    "hiddenTestCases": [
      {
        "input": "lists = [[]]",
        "output": "[]",
        "args": [
          [
            []
          ]
        ],
        "expected": []
      },
      {
        "input": "lists = [[1]]",
        "output": "[1]",
        "args": [
          [
            [
              1
            ]
          ]
        ],
        "expected": [
          1
        ]
      }
    ]
  },
  "first-missing-positive": {
    "id": "104",
    "slug": "first-missing-positive",
    "title": "First Missing Positive",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Hash Table"
      }
    ],
    "description": "Given an unsorted integer array `nums`, return the smallest positive integer that is not present in `nums` in O(n) time and O(1) auxiliary space.",
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-2^31 <= nums[i] <= 2^31 - 1"
    ],
    "methodName": "firstMissingPositive",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar firstMissingPositive = function(nums) {\n    \n};",
      "python": "class Solution:\n    def firstMissingPositive(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement firstMissingPositive\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement firstMissingPositive\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [1,2,0]",
        "output": "3",
        "args": [
          [
            1,
            2,
            0
          ]
        ],
        "expected": 3
      },
      {
        "input": "nums = [3,4,-1,1]",
        "output": "2",
        "args": [
          [
            3,
            4,
            -1,
            1
          ]
        ],
        "expected": 2
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [7,8,9,11,12]",
        "output": "1",
        "args": [
          [
            7,
            8,
            9,
            11,
            12
          ]
        ],
        "expected": 1
      },
      {
        "input": "nums = [1]",
        "output": "2",
        "args": [
          [
            1
          ]
        ],
        "expected": 2
      },
      {
        "input": "nums = [2]",
        "output": "1",
        "args": [
          [
            2
          ]
        ],
        "expected": 1
      }
    ]
  },
  "wildcard-matching": {
    "id": "105",
    "slug": "wildcard-matching",
    "title": "Wildcard Matching",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Strings"
      },
      {
        "name": "Dynamic Programming"
      },
      {
        "name": "Greedy"
      },
      {
        "name": "Recursion"
      }
    ],
    "description": "Given an input string (`s`) and a pattern (`p`), implement wildcard pattern matching with support for '?' (matches any single character) and '*' (matches any sequence of characters including empty).",
    "constraints": [
      "0 <= s.length, p.length <= 2000"
    ],
    "methodName": "isMatch",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s, p\n * @return {any}\n */\nvar isMatch = function(s, p) {\n    \n};",
      "python": "class Solution:\n    def isMatch(self, s, p):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement isMatch\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement isMatch\n}"
    },
    "publicTestCases": [
      {
        "input": "s = \"aa\", p = \"a\"",
        "output": "false",
        "args": [
          "aa",
          "a"
        ],
        "expected": false
      },
      {
        "input": "s = \"aa\", p = \"*\"",
        "output": "true",
        "args": [
          "aa",
          "*"
        ],
        "expected": true
      },
      {
        "input": "s = \"cb\", p = \"?a\"",
        "output": "false",
        "args": [
          "cb",
          "?a"
        ],
        "expected": false
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s = \"adceb\", p = \"*a*b\"",
        "output": "true",
        "args": [
          "adceb",
          "*a*b"
        ],
        "expected": true
      },
      {
        "input": "s = \"acdcb\", p = \"a*c?b\"",
        "output": "false",
        "args": [
          "acdcb",
          "a*c?b"
        ],
        "expected": false
      }
    ]
  },
  "n-queens": {
    "id": "106",
    "slug": "n-queens",
    "title": "N-Queens",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Backtracking"
      }
    ],
    "description": "The n-queens puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other. Return all distinct solutions.",
    "constraints": [
      "1 <= n <= 9"
    ],
    "methodName": "solveNQueens",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} n\n * @return {any}\n */\nvar solveNQueens = function(n) {\n    \n};",
      "python": "class Solution:\n    def solveNQueens(self, n):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement solveNQueens\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement solveNQueens\n}"
    },
    "publicTestCases": [
      {
        "input": "n = 4",
        "output": "[[\".Q..\",\"...Q\",\"Q...\",\"..Q.\"],[\"..Q.\",\"Q...\",\"...Q\",\".Q..\"]]",
        "args": [
          4
        ],
        "expected": [
          [
            ".Q..",
            "...Q",
            "Q...",
            "..Q."
          ],
          [
            "..Q.",
            "Q...",
            "...Q",
            ".Q.."
          ]
        ]
      },
      {
        "input": "n = 1",
        "output": "[[\"Q\"]]",
        "args": [
          1
        ],
        "expected": [
          [
            "Q"
          ]
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "n = 2",
        "output": "[]",
        "args": [
          2
        ],
        "expected": []
      },
      {
        "input": "n = 3",
        "output": "[]",
        "args": [
          3
        ],
        "expected": []
      }
    ]
  },
  "edit-distance": {
    "id": "107",
    "slug": "edit-distance",
    "title": "Edit Distance",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Strings"
      },
      {
        "name": "Dynamic Programming"
      }
    ],
    "description": "Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2` (insert, delete, or replace character).",
    "constraints": [
      "0 <= word1.length, word2.length <= 500"
    ],
    "methodName": "minDistance",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} word1, word2\n * @return {any}\n */\nvar minDistance = function(word1, word2) {\n    \n};",
      "python": "class Solution:\n    def minDistance(self, word1, word2):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement minDistance\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement minDistance\n}"
    },
    "publicTestCases": [
      {
        "input": "word1 = \"horse\", word2 = \"ros\"",
        "output": "3",
        "args": [
          "horse",
          "ros"
        ],
        "expected": 3
      },
      {
        "input": "word1 = \"intention\", word2 = \"execution\"",
        "output": "5",
        "args": [
          "intention",
          "execution"
        ],
        "expected": 5
      }
    ],
    "hiddenTestCases": [
      {
        "input": "word1 = \"\", word2 = \"\"",
        "output": "0",
        "args": [
          "",
          ""
        ],
        "expected": 0
      },
      {
        "input": "word1 = \"a\", word2 = \"\"",
        "output": "1",
        "args": [
          "a",
          ""
        ],
        "expected": 1
      },
      {
        "input": "word1 = \"\", word2 = \"abc\"",
        "output": "3",
        "args": [
          "",
          "abc"
        ],
        "expected": 3
      }
    ]
  },
  "largest-rectangle-in-histogram": {
    "id": "108",
    "slug": "largest-rectangle-in-histogram",
    "title": "Largest Rectangle in Histogram",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Stack"
      },
      {
        "name": "Monotonic Stack"
      }
    ],
    "description": "Given an array of integers `heights` representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
    "constraints": [
      "1 <= heights.length <= 10^5",
      "0 <= heights[i] <= 10^4"
    ],
    "methodName": "largestRectangleArea",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} heights\n * @return {any}\n */\nvar largestRectangleArea = function(heights) {\n    \n};",
      "python": "class Solution:\n    def largestRectangleArea(self, heights):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement largestRectangleArea\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement largestRectangleArea\n}"
    },
    "publicTestCases": [
      {
        "input": "heights = [2,1,5,6,2,3]",
        "output": "10",
        "args": [
          [
            2,
            1,
            5,
            6,
            2,
            3
          ]
        ],
        "expected": 10
      },
      {
        "input": "heights = [2,4]",
        "output": "4",
        "args": [
          [
            2,
            4
          ]
        ],
        "expected": 4
      }
    ],
    "hiddenTestCases": [
      {
        "input": "heights = [1]",
        "output": "1",
        "args": [
          [
            1
          ]
        ],
        "expected": 1
      },
      {
        "input": "heights = [2,1,2]",
        "output": "3",
        "args": [
          [
            2,
            1,
            2
          ]
        ],
        "expected": 3
      },
      {
        "input": "heights = [5,5,5,5]",
        "output": "20",
        "args": [
          [
            5,
            5,
            5,
            5
          ]
        ],
        "expected": 20
      }
    ]
  },
  "sliding-window-maximum": {
    "id": "109",
    "slug": "sliding-window-maximum",
    "title": "Sliding Window Maximum",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Queue"
      },
      {
        "name": "Sliding Window"
      },
      {
        "name": "Heap"
      },
      {
        "name": "Monotonic Queue"
      }
    ],
    "description": "You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. Return the max sliding window.",
    "constraints": [
      "1 <= nums.length <= 10^5",
      "1 <= k <= nums.length"
    ],
    "methodName": "maxSlidingWindow",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums, k\n * @return {any}\n */\nvar maxSlidingWindow = function(nums, k) {\n    \n};",
      "python": "class Solution:\n    def maxSlidingWindow(self, nums, k):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement maxSlidingWindow\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement maxSlidingWindow\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [1,3,-1,-3,5,3,6,7], k = 3",
        "output": "[3,3,5,5,6,7]",
        "args": [
          [
            1,
            3,
            -1,
            -3,
            5,
            3,
            6,
            7
          ],
          3
        ],
        "expected": [
          3,
          3,
          5,
          5,
          6,
          7
        ]
      },
      {
        "input": "nums = [1], k = 1",
        "output": "[1]",
        "args": [
          [
            1
          ],
          1
        ],
        "expected": [
          1
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [1,-1], k = 1",
        "output": "[1,-1]",
        "args": [
          [
            1,
            -1
          ],
          1
        ],
        "expected": [
          1,
          -1
        ]
      },
      {
        "input": "nums = [9,11], k = 2",
        "output": "[11]",
        "args": [
          [
            9,
            11
          ],
          2
        ],
        "expected": [
          11
        ]
      }
    ]
  },
  "minimum-window-substring": {
    "id": "110",
    "slug": "minimum-window-substring",
    "title": "Minimum Window Substring",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Hash Table"
      },
      {
        "name": "Strings"
      },
      {
        "name": "Sliding Window"
      }
    ],
    "description": "Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window.",
    "constraints": [
      "m == s.length",
      "n == t.length",
      "1 <= m, n <= 10^5"
    ],
    "methodName": "minWindow",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s, t\n * @return {any}\n */\nvar minWindow = function(s, t) {\n    \n};",
      "python": "class Solution:\n    def minWindow(self, s, t):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement minWindow\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement minWindow\n}"
    },
    "publicTestCases": [
      {
        "input": "s = \"ADOBECODEBANC\", t = \"ABC\"",
        "output": "\"BANC\"",
        "args": [
          "ADOBECODEBANC",
          "ABC"
        ],
        "expected": "BANC"
      },
      {
        "input": "s = \"a\", t = \"a\"",
        "output": "\"a\"",
        "args": [
          "a",
          "a"
        ],
        "expected": "a"
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s = \"a\", t = \"aa\"",
        "output": "\"\"",
        "args": [
          "a",
          "aa"
        ],
        "expected": ""
      },
      {
        "input": "s = \"ab\", t = \"b\"",
        "output": "\"b\"",
        "args": [
          "ab",
          "b"
        ],
        "expected": "b"
      }
    ]
  },
  "regular-expression-matching": {
    "id": "111",
    "slug": "regular-expression-matching",
    "title": "Regular Expression Matching",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Strings"
      },
      {
        "name": "Dynamic Programming"
      },
      {
        "name": "Recursion"
      }
    ],
    "description": "Given an input string `s` and a pattern `p`, implement regular expression matching with support for '.' and '*' where '.' matches any single character and '*' matches zero or more of the preceding element.",
    "constraints": [
      "1 <= s.length <= 20",
      "1 <= p.length <= 20"
    ],
    "methodName": "isMatchRegex",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s, p\n * @return {any}\n */\nvar isMatchRegex = function(s, p) {\n    \n};",
      "python": "class Solution:\n    def isMatchRegex(self, s, p):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement isMatchRegex\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement isMatchRegex\n}"
    },
    "publicTestCases": [
      {
        "input": "s = \"aa\", p = \"a\"",
        "output": "false",
        "args": [
          "aa",
          "a"
        ],
        "expected": false
      },
      {
        "input": "s = \"aa\", p = \"a*\"",
        "output": "true",
        "args": [
          "aa",
          "a*"
        ],
        "expected": true
      },
      {
        "input": "s = \"ab\", p = \".*\"",
        "output": "true",
        "args": [
          "ab",
          ".*"
        ],
        "expected": true
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s = \"aab\", p = \"c*a*b\"",
        "output": "true",
        "args": [
          "aab",
          "c*a*b"
        ],
        "expected": true
      },
      {
        "input": "s = \"mississippi\", p = \"mis*is*p*.\"",
        "output": "false",
        "args": [
          "mississippi",
          "mis*is*p*."
        ],
        "expected": false
      }
    ]
  },
  "maximal-rectangle": {
    "id": "112",
    "slug": "maximal-rectangle",
    "title": "Maximal Rectangle",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Dynamic Programming"
      },
      {
        "name": "Stack"
      },
      {
        "name": "Matrix"
      },
      {
        "name": "Monotonic Stack"
      }
    ],
    "description": "Given a `rows x cols` binary `matrix` filled with 0's and 1's, find the largest rectangle containing only 1's and return its area.",
    "constraints": [
      "rows == matrix.length",
      "cols == matrix[i].length",
      "1 <= row, cols <= 200"
    ],
    "methodName": "maximalRectangle",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} matrix\n * @return {any}\n */\nvar maximalRectangle = function(matrix) {\n    \n};",
      "python": "class Solution:\n    def maximalRectangle(self, matrix):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement maximalRectangle\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement maximalRectangle\n}"
    },
    "publicTestCases": [
      {
        "input": "matrix = [[\"1\",\"0\",\"1\",\"0\",\"0\"],[\"1\",\"0\",\"1\",\"1\",\"1\"],[\"1\",\"1\",\"1\",\"1\",\"1\"],[\"1\",\"0\",\"0\",\"1\",\"0\"]]",
        "output": "6",
        "args": [
          [
            [
              "1",
              "0",
              "1",
              "0",
              "0"
            ],
            [
              "1",
              "0",
              "1",
              "1",
              "1"
            ],
            [
              "1",
              "1",
              "1",
              "1",
              "1"
            ],
            [
              "1",
              "0",
              "0",
              "1",
              "0"
            ]
          ]
        ],
        "expected": 6
      }
    ],
    "hiddenTestCases": [
      {
        "input": "matrix = [[\"0\"]]",
        "output": "0",
        "args": [
          [
            [
              "0"
            ]
          ]
        ],
        "expected": 0
      },
      {
        "input": "matrix = [[\"1\"]]",
        "output": "1",
        "args": [
          [
            [
              "1"
            ]
          ]
        ],
        "expected": 1
      }
    ]
  },
  "longest-valid-parentheses": {
    "id": "113",
    "slug": "longest-valid-parentheses",
    "title": "Longest Valid Parentheses",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Strings"
      },
      {
        "name": "Dynamic Programming"
      },
      {
        "name": "Stack"
      }
    ],
    "description": "Given a string containing just the characters '(' and ')', return the length of the longest valid (well-formed) parentheses substring.",
    "constraints": [
      "0 <= s.length <= 3 * 10^4"
    ],
    "methodName": "longestValidParentheses",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s\n * @return {any}\n */\nvar longestValidParentheses = function(s) {\n    \n};",
      "python": "class Solution:\n    def longestValidParentheses(self, s):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement longestValidParentheses\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement longestValidParentheses\n}"
    },
    "publicTestCases": [
      {
        "input": "s = \"(()\"",
        "output": "2",
        "args": [
          "(()"
        ],
        "expected": 2
      },
      {
        "input": "s = \")()())\"",
        "output": "4",
        "args": [
          ")()())"
        ],
        "expected": 4
      },
      {
        "input": "s = \"\"",
        "output": "0",
        "args": [
          ""
        ],
        "expected": 0
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s = \"()(()\"",
        "output": "2",
        "args": [
          "()(()"
        ],
        "expected": 2
      },
      {
        "input": "s = \"(()())\"",
        "output": "6",
        "args": [
          "(()())"
        ],
        "expected": 6
      }
    ]
  },
  "burst-balloons": {
    "id": "114",
    "slug": "burst-balloons",
    "title": "Burst Balloons",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Dynamic Programming"
      }
    ],
    "description": "You are given `n` balloons, indexed from 0 to `n - 1`. Each balloon is painted with a number on it represented by an array `nums`. If you burst the ith balloon, you get `nums[i - 1] * nums[i] * nums[i + 1]` coins. Return the maximum coins you can collect.",
    "constraints": [
      "n == nums.length",
      "1 <= n <= 300",
      "0 <= nums[i] <= 100"
    ],
    "methodName": "maxCoins",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar maxCoins = function(nums) {\n    \n};",
      "python": "class Solution:\n    def maxCoins(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement maxCoins\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement maxCoins\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [3,1,5,8]",
        "output": "167",
        "args": [
          [
            3,
            1,
            5,
            8
          ]
        ],
        "expected": 167
      },
      {
        "input": "nums = [1,5]",
        "output": "10",
        "args": [
          [
            1,
            5
          ]
        ],
        "expected": 10
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [7]",
        "output": "7",
        "args": [
          [
            7
          ]
        ],
        "expected": 7
      },
      {
        "input": "nums = [1,2,3]",
        "output": "12",
        "args": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": 12
      }
    ]
  },
  "distinct-subsequences": {
    "id": "115",
    "slug": "distinct-subsequences",
    "title": "Distinct Subsequences",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Strings"
      },
      {
        "name": "Dynamic Programming"
      }
    ],
    "description": "Given two strings `s` and `t`, return the number of distinct subsequences of `s` which equals `t`.",
    "constraints": [
      "1 <= s.length, t.length <= 1000"
    ],
    "methodName": "numDistinct",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s, t\n * @return {any}\n */\nvar numDistinct = function(s, t) {\n    \n};",
      "python": "class Solution:\n    def numDistinct(self, s, t):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement numDistinct\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement numDistinct\n}"
    },
    "publicTestCases": [
      {
        "input": "s = \"rabbbit\", t = \"rabbit\"",
        "output": "3",
        "args": [
          "rabbbit",
          "rabbit"
        ],
        "expected": 3
      },
      {
        "input": "s = \"babgbag\", t = \"bag\"",
        "output": "5",
        "args": [
          "babgbag",
          "bag"
        ],
        "expected": 5
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s = \"a\", t = \"b\"",
        "output": "0",
        "args": [
          "a",
          "b"
        ],
        "expected": 0
      },
      {
        "input": "s = \"aaa\", t = \"a\"",
        "output": "3",
        "args": [
          "aaa",
          "a"
        ],
        "expected": 3
      }
    ]
  },
  "russian-doll-envelopes": {
    "id": "116",
    "slug": "russian-doll-envelopes",
    "title": "Russian Doll Envelopes",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Binary Search"
      },
      {
        "name": "Dynamic Programming"
      },
      {
        "name": "Sorting"
      }
    ],
    "description": "You are given a 2D array of integers `envelopes` where `envelopes[i] = [w_i, h_i]` represents width and height. Return the maximum number of envelopes you can Russian doll (put one inside another).",
    "constraints": [
      "1 <= envelopes.length <= 10^5"
    ],
    "methodName": "maxEnvelopes",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} envelopes\n * @return {any}\n */\nvar maxEnvelopes = function(envelopes) {\n    \n};",
      "python": "class Solution:\n    def maxEnvelopes(self, envelopes):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement maxEnvelopes\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement maxEnvelopes\n}"
    },
    "publicTestCases": [
      {
        "input": "envelopes = [[5,4],[6,4],[6,7],[2,3]]",
        "output": "3",
        "args": [
          [
            [
              5,
              4
            ],
            [
              6,
              4
            ],
            [
              6,
              7
            ],
            [
              2,
              3
            ]
          ]
        ],
        "expected": 3
      },
      {
        "input": "envelopes = [[1,1],[1,1],[1,1]]",
        "output": "1",
        "args": [
          [
            [
              1,
              1
            ],
            [
              1,
              1
            ],
            [
              1,
              1
            ]
          ]
        ],
        "expected": 1
      }
    ],
    "hiddenTestCases": [
      {
        "input": "envelopes = [[4,5],[4,6],[6,7],[2,3],[1,1]]",
        "output": "4",
        "args": [
          [
            [
              4,
              5
            ],
            [
              4,
              6
            ],
            [
              6,
              7
            ],
            [
              2,
              3
            ],
            [
              1,
              1
            ]
          ]
        ],
        "expected": 4
      }
    ]
  },
  "super-egg-drop": {
    "id": "117",
    "slug": "super-egg-drop",
    "title": "Super Egg Drop",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Math"
      },
      {
        "name": "Binary Search"
      },
      {
        "name": "Dynamic Programming"
      }
    ],
    "description": "You are given `k` identical eggs and you have access to a building with `n` floors labeled from 1 to `n`. Return the minimum number of moves you need to determine with certainty what `f` is (the highest floor from which eggs do not break).",
    "constraints": [
      "1 <= k <= 100",
      "1 <= n <= 10^4"
    ],
    "methodName": "superEggDrop",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} k, n\n * @return {any}\n */\nvar superEggDrop = function(k, n) {\n    \n};",
      "python": "class Solution:\n    def superEggDrop(self, k, n):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement superEggDrop\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement superEggDrop\n}"
    },
    "publicTestCases": [
      {
        "input": "k = 1, n = 2",
        "output": "2",
        "args": [
          1,
          2
        ],
        "expected": 2
      },
      {
        "input": "k = 2, n = 6",
        "output": "3",
        "args": [
          2,
          6
        ],
        "expected": 3
      },
      {
        "input": "k = 3, n = 14",
        "output": "4",
        "args": [
          3,
          14
        ],
        "expected": 4
      }
    ],
    "hiddenTestCases": [
      {
        "input": "k = 2, n = 100",
        "output": "14",
        "args": [
          2,
          100
        ],
        "expected": 14
      }
    ]
  },
  "palindrome-partitioning-ii": {
    "id": "118",
    "slug": "palindrome-partitioning-ii",
    "title": "Palindrome Partitioning II",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Strings"
      },
      {
        "name": "Dynamic Programming"
      }
    ],
    "description": "Given a string `s`, partition `s` such that every substring of the partition is a palindrome. Return the minimum cuts needed for a palindrome partitioning of `s`.",
    "constraints": [
      "1 <= s.length <= 2000"
    ],
    "methodName": "minCut",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s\n * @return {any}\n */\nvar minCut = function(s) {\n    \n};",
      "python": "class Solution:\n    def minCut(self, s):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement minCut\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement minCut\n}"
    },
    "publicTestCases": [
      {
        "input": "s = \"aab\"",
        "output": "1",
        "args": [
          "aab"
        ],
        "expected": 1
      },
      {
        "input": "s = \"a\"",
        "output": "0",
        "args": [
          "a"
        ],
        "expected": 0
      },
      {
        "input": "s = \"ab\"",
        "output": "1",
        "args": [
          "ab"
        ],
        "expected": 1
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s = \"aba\"",
        "output": "0",
        "args": [
          "aba"
        ],
        "expected": 0
      },
      {
        "input": "s = \"racecar\"",
        "output": "0",
        "args": [
          "racecar"
        ],
        "expected": 0
      },
      {
        "input": "s = \"abcdef\"",
        "output": "5",
        "args": [
          "abcdef"
        ],
        "expected": 5
      }
    ]
  },
  "shortest-palindrome": {
    "id": "119",
    "slug": "shortest-palindrome",
    "title": "Shortest Palindrome",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Strings"
      },
      {
        "name": "Rolling Hash"
      },
      {
        "name": "String Matching"
      }
    ],
    "description": "You are given a string `s`. You can convert it to a palindrome by adding characters in front of it. Find and return the shortest palindrome you can find by performing this transformation.",
    "constraints": [
      "0 <= s.length <= 5 * 10^4"
    ],
    "methodName": "shortestPalindrome",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s\n * @return {any}\n */\nvar shortestPalindrome = function(s) {\n    \n};",
      "python": "class Solution:\n    def shortestPalindrome(self, s):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement shortestPalindrome\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement shortestPalindrome\n}"
    },
    "publicTestCases": [
      {
        "input": "s = \"aacecaaa\"",
        "output": "\"aaacecaaa\"",
        "args": [
          "aacecaaa"
        ],
        "expected": "aaacecaaa"
      },
      {
        "input": "s = \"abcd\"",
        "output": "\"dcbabcd\"",
        "args": [
          "abcd"
        ],
        "expected": "dcbabcd"
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s = \"\"",
        "output": "\"\"",
        "args": [
          ""
        ],
        "expected": ""
      },
      {
        "input": "s = \"a\"",
        "output": "\"a\"",
        "args": [
          "a"
        ],
        "expected": "a"
      }
    ]
  },
  "word-ladder": {
    "id": "120",
    "slug": "word-ladder",
    "title": "Word Ladder",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Hash Table"
      },
      {
        "name": "Strings"
      },
      {
        "name": "BFS"
      }
    ],
    "description": "A transformation sequence from word `beginWord` to word `endWord` using a dictionary `wordList` is a sequence of words `beginWord -> s1 -> s2 -> ... -> sk` such that every adjacent pair differs by 1 letter and `sk == endWord`. Return the number of words in the shortest transformation sequence, or 0 if no such sequence exists.",
    "constraints": [
      "1 <= beginWord.length <= 10",
      "1 <= wordList.length <= 5000"
    ],
    "methodName": "ladderLength",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} beginWord, endWord, wordList\n * @return {any}\n */\nvar ladderLength = function(beginWord, endWord, wordList) {\n    \n};",
      "python": "class Solution:\n    def ladderLength(self, beginWord, endWord, wordList):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement ladderLength\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement ladderLength\n}"
    },
    "publicTestCases": [
      {
        "input": "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
        "output": "5",
        "args": [
          "hit",
          "cog",
          [
            "hot",
            "dot",
            "dog",
            "lot",
            "log",
            "cog"
          ]
        ],
        "expected": 5
      },
      {
        "input": "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]",
        "output": "0",
        "args": [
          "hit",
          "cog",
          [
            "hot",
            "dot",
            "dog",
            "lot",
            "log"
          ]
        ],
        "expected": 0
      }
    ],
    "hiddenTestCases": [
      {
        "input": "beginWord = \"a\", endWord = \"c\", wordList = [\"a\",\"b\",\"c\"]",
        "output": "2",
        "args": [
          "a",
          "c",
          [
            "a",
            "b",
            "c"
          ]
        ],
        "expected": 2
      }
    ]
  },
  "find-median-from-data-stream": {
    "id": "121",
    "slug": "find-median-from-data-stream",
    "title": "Find Median from Data Stream",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Two Pointers"
      },
      {
        "name": "Design"
      },
      {
        "name": "Sorting"
      },
      {
        "name": "Heap"
      },
      {
        "name": "Data Stream"
      }
    ],
    "description": "The median is the middle value in an ordered integer list. Design a data structure that supports adding integer streams and calculating the current median.",
    "constraints": [
      "At most 5 * 10^4 calls"
    ],
    "methodName": "streamMedian",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} commands, args\n * @return {any}\n */\nvar streamMedian = function(commands, args) {\n    \n};",
      "python": "class Solution:\n    def streamMedian(self, commands, args):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement streamMedian\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement streamMedian\n}"
    },
    "publicTestCases": [
      {
        "input": "commands = [\"addNum\",\"addNum\",\"findMedian\",\"addNum\",\"findMedian\"], args = [[1],[2],[],[3],[]]",
        "output": "[null,null,1.5,null,2]",
        "args": [
          [
            "addNum",
            "addNum",
            "findMedian",
            "addNum",
            "findMedian"
          ],
          [
            [
              1
            ],
            [
              2
            ],
            [],
            [
              3
            ],
            []
          ]
        ],
        "expected": [
          null,
          null,
          1.5,
          null,
          2
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "commands = [\"addNum\",\"findMedian\"], args = [[5],[]]",
        "output": "[null,5]",
        "args": [
          [
            "addNum",
            "findMedian"
          ],
          [
            [
              5
            ],
            []
          ]
        ],
        "expected": [
          null,
          5
        ]
      }
    ]
  },
  "text-justification": {
    "id": "122",
    "slug": "text-justification",
    "title": "Text Justification",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Strings"
      },
      {
        "name": "Simulation"
      }
    ],
    "description": "Given an array of strings `words` and a width `maxWidth`, format the text such that each line has exactly `maxWidth` characters and is fully (left and right) justified.",
    "constraints": [
      "1 <= words.length <= 300",
      "1 <= maxWidth <= 100"
    ],
    "methodName": "fullJustify",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} words, maxWidth\n * @return {any}\n */\nvar fullJustify = function(words, maxWidth) {\n    \n};",
      "python": "class Solution:\n    def fullJustify(self, words, maxWidth):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement fullJustify\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement fullJustify\n}"
    },
    "publicTestCases": [
      {
        "input": "words = [\"This\",\"is\",\"an\",\"example\",\"of\",\"text\",\"justification.\"], maxWidth = 16",
        "output": "[\"This    is    an\",\"example  of text\",\"justification.  \"]",
        "args": [
          [
            "This",
            "is",
            "an",
            "example",
            "of",
            "text",
            "justification."
          ],
          16
        ],
        "expected": [
          "This    is    an",
          "example  of text",
          "justification.  "
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "words = [\"What\",\"must\",\"be\",\"acknowledgment\",\"shall\",\"be\"], maxWidth = 16",
        "output": "[\"What   must   be\",\"acknowledgment  \",\"shall be        \"]",
        "args": [
          [
            "What",
            "must",
            "be",
            "acknowledgment",
            "shall",
            "be"
          ],
          16
        ],
        "expected": [
          "What   must   be",
          "acknowledgment  ",
          "shall be        "
        ]
      }
    ]
  },
  "minimum-cost-to-cut-a-stick": {
    "id": "123",
    "slug": "minimum-cost-to-cut-a-stick",
    "title": "Minimum Cost to Cut a Stick",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Dynamic Programming"
      },
      {
        "name": "Sorting"
      }
    ],
    "description": "Given an integer `n` and an array of integers `cuts` where `cuts[i]` denotes a position you should perform a cut at. The cost of one cut is the length of the stick to be cut. Return the minimum total cost of the cuts.",
    "constraints": [
      "2 <= n <= 10^6",
      "1 <= cuts.length <= 100"
    ],
    "methodName": "minCost",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} n, cuts\n * @return {any}\n */\nvar minCost = function(n, cuts) {\n    \n};",
      "python": "class Solution:\n    def minCost(self, n, cuts):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement minCost\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement minCost\n}"
    },
    "publicTestCases": [
      {
        "input": "n = 7, cuts = [1,3,4,5]",
        "output": "16",
        "args": [
          7,
          [
            1,
            3,
            4,
            5
          ]
        ],
        "expected": 16
      },
      {
        "input": "n = 9, cuts = [5,6,1,4,2]",
        "output": "22",
        "args": [
          9,
          [
            5,
            6,
            1,
            4,
            2
          ]
        ],
        "expected": 22
      }
    ],
    "hiddenTestCases": [
      {
        "input": "n = 10, cuts = [1,2,3]",
        "output": "15",
        "args": [
          10,
          [
            1,
            2,
            3
          ]
        ],
        "expected": 15
      }
    ]
  },
  "frog-jump": {
    "id": "124",
    "slug": "frog-jump",
    "title": "Frog Jump",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Dynamic Programming"
      }
    ],
    "description": "A frog is crossing a river. The river is divided into some number of units, and at each unit, there may or may not exist a stone represented by `stones`. If the frog's last jump was `k` units, its next jump must be either `k - 1`, `k`, or `k + 1` units. Determine if the frog can reach the last stone.",
    "constraints": [
      "2 <= stones.length <= 2000",
      "0 <= stones[i] <= 2^31 - 1"
    ],
    "methodName": "canCross",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} stones\n * @return {any}\n */\nvar canCross = function(stones) {\n    \n};",
      "python": "class Solution:\n    def canCross(self, stones):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement canCross\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement canCross\n}"
    },
    "publicTestCases": [
      {
        "input": "stones = [0,1,3,5,6,8,12,17]",
        "output": "true",
        "args": [
          [
            0,
            1,
            3,
            5,
            6,
            8,
            12,
            17
          ]
        ],
        "expected": true
      },
      {
        "input": "stones = [0,1,2,3,4,8,9,11]",
        "output": "false",
        "args": [
          [
            0,
            1,
            2,
            3,
            4,
            8,
            9,
            11
          ]
        ],
        "expected": false
      }
    ],
    "hiddenTestCases": [
      {
        "input": "stones = [0,1]",
        "output": "true",
        "args": [
          [
            0,
            1
          ]
        ],
        "expected": true
      },
      {
        "input": "stones = [0,2]",
        "output": "false",
        "args": [
          [
            0,
            2
          ]
        ],
        "expected": false
      }
    ]
  },
  "count-smaller-numbers-after-self": {
    "id": "125",
    "slug": "count-smaller-numbers-after-self",
    "title": "Count of Smaller Numbers After Self",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Binary Search"
      },
      {
        "name": "Divide and Conquer"
      },
      {
        "name": "Binary Indexed Tree"
      },
      {
        "name": "Segment Tree"
      }
    ],
    "description": "Given an integer array `nums`, return an integer array `counts` where `counts[i]` is the number of smaller elements to the right of `nums[i]`.",
    "constraints": [
      "1 <= nums.length <= 10^5",
      "-10^4 <= nums[i] <= 10^4"
    ],
    "methodName": "countSmaller",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums\n * @return {any}\n */\nvar countSmaller = function(nums) {\n    \n};",
      "python": "class Solution:\n    def countSmaller(self, nums):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement countSmaller\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement countSmaller\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [5,2,6,1]",
        "output": "[2,1,1,0]",
        "args": [
          [
            5,
            2,
            6,
            1
          ]
        ],
        "expected": [
          2,
          1,
          1,
          0
        ]
      },
      {
        "input": "nums = [-1]",
        "output": "[0]",
        "args": [
          [
            -1
          ]
        ],
        "expected": [
          0
        ]
      },
      {
        "input": "nums = [-1,-1]",
        "output": "[0,0]",
        "args": [
          [
            -1,
            -1
          ]
        ],
        "expected": [
          0,
          0
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [1,2,3,4]",
        "output": "[0,0,0,0]",
        "args": [
          [
            1,
            2,
            3,
            4
          ]
        ],
        "expected": [
          0,
          0,
          0,
          0
        ]
      },
      {
        "input": "nums = [4,3,2,1]",
        "output": "[3,2,1,0]",
        "args": [
          [
            4,
            3,
            2,
            1
          ]
        ],
        "expected": [
          3,
          2,
          1,
          0
        ]
      }
    ]
  },
  "max-points-on-a-line": {
    "id": "126",
    "slug": "max-points-on-a-line",
    "title": "Max Points on a Line",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Hash Table"
      },
      {
        "name": "Math"
      },
      {
        "name": "Geometry"
      }
    ],
    "description": "Given an array of `points` where `points[i] = [x_i, y_i]` represents a point on the X-Y plane, return the maximum number of points that lie on the same straight line.",
    "constraints": [
      "1 <= points.length <= 300"
    ],
    "methodName": "maxPoints",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} points\n * @return {any}\n */\nvar maxPoints = function(points) {\n    \n};",
      "python": "class Solution:\n    def maxPoints(self, points):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement maxPoints\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement maxPoints\n}"
    },
    "publicTestCases": [
      {
        "input": "points = [[1,1],[2,2],[3,3]]",
        "output": "3",
        "args": [
          [
            [
              1,
              1
            ],
            [
              2,
              2
            ],
            [
              3,
              3
            ]
          ]
        ],
        "expected": 3
      },
      {
        "input": "points = [[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]",
        "output": "4",
        "args": [
          [
            [
              1,
              1
            ],
            [
              3,
              2
            ],
            [
              5,
              3
            ],
            [
              4,
              1
            ],
            [
              2,
              3
            ],
            [
              1,
              4
            ]
          ]
        ],
        "expected": 4
      }
    ],
    "hiddenTestCases": [
      {
        "input": "points = [[0,0]]",
        "output": "1",
        "args": [
          [
            [
              0,
              0
            ]
          ]
        ],
        "expected": 1
      }
    ]
  },
  "best-time-to-buy-and-sell-stock-iii": {
    "id": "127",
    "slug": "best-time-to-buy-and-sell-stock-iii",
    "title": "Best Time to Buy and Sell Stock III",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Dynamic Programming"
      }
    ],
    "description": "You are given an array `prices` where `prices[i]` is the price of a given stock on the ith day. Find the maximum profit you can achieve with at most two transactions.",
    "constraints": [
      "1 <= prices.length <= 10^5"
    ],
    "methodName": "maxProfitIII",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} prices\n * @return {any}\n */\nvar maxProfitIII = function(prices) {\n    \n};",
      "python": "class Solution:\n    def maxProfitIII(self, prices):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement maxProfitIII\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement maxProfitIII\n}"
    },
    "publicTestCases": [
      {
        "input": "prices = [3,3,5,0,0,3,1,4]",
        "output": "6",
        "args": [
          [
            3,
            3,
            5,
            0,
            0,
            3,
            1,
            4
          ]
        ],
        "expected": 6
      },
      {
        "input": "prices = [1,2,3,4,5]",
        "output": "4",
        "args": [
          [
            1,
            2,
            3,
            4,
            5
          ]
        ],
        "expected": 4
      }
    ],
    "hiddenTestCases": [
      {
        "input": "prices = [7,6,4,3,1]",
        "output": "0",
        "args": [
          [
            7,
            6,
            4,
            3,
            1
          ]
        ],
        "expected": 0
      }
    ]
  },
  "best-time-to-buy-and-sell-stock-iv": {
    "id": "128",
    "slug": "best-time-to-buy-and-sell-stock-iv",
    "title": "Best Time to Buy and Sell Stock IV",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Dynamic Programming"
      }
    ],
    "description": "You are given an integer `k` and an array of integers `prices` where `prices[i]` is the price of a given stock on the ith day. Find the maximum profit you can achieve with at most `k` transactions.",
    "constraints": [
      "1 <= k <= 100",
      "1 <= prices.length <= 1000"
    ],
    "methodName": "maxProfitIV",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} k, prices\n * @return {any}\n */\nvar maxProfitIV = function(k, prices) {\n    \n};",
      "python": "class Solution:\n    def maxProfitIV(self, k, prices):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement maxProfitIV\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement maxProfitIV\n}"
    },
    "publicTestCases": [
      {
        "input": "k = 2, prices = [2,4,1]",
        "output": "2",
        "args": [
          2,
          [
            2,
            4,
            1
          ]
        ],
        "expected": 2
      },
      {
        "input": "k = 2, prices = [3,2,6,5,0,3]",
        "output": "7",
        "args": [
          2,
          [
            3,
            2,
            6,
            5,
            0,
            3
          ]
        ],
        "expected": 7
      }
    ],
    "hiddenTestCases": [
      {
        "input": "k = 1, prices = [1,2]",
        "output": "1",
        "args": [
          1,
          [
            1,
            2
          ]
        ],
        "expected": 1
      }
    ]
  },
  "remove-invalid-parentheses": {
    "id": "129",
    "slug": "remove-invalid-parentheses",
    "title": "Remove Invalid Parentheses",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Strings"
      },
      {
        "name": "Backtracking"
      },
      {
        "name": "BFS"
      }
    ],
    "description": "Given a string `s` that contains parentheses and letters, remove the minimum number of invalid parentheses to make the input string valid. Return all unique results in any order.",
    "constraints": [
      "1 <= s.length <= 25"
    ],
    "methodName": "removeInvalidParentheses",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} s\n * @return {any}\n */\nvar removeInvalidParentheses = function(s) {\n    \n};",
      "python": "class Solution:\n    def removeInvalidParentheses(self, s):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement removeInvalidParentheses\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement removeInvalidParentheses\n}"
    },
    "publicTestCases": [
      {
        "input": "s = \"()())()\"",
        "output": "[\"(())()\",\"()()()\"]",
        "args": [
          "()())()"
        ],
        "expected": [
          "(())()",
          "()()()"
        ]
      },
      {
        "input": "s = \"(a)())()\"",
        "output": "[\"(a())()\",\"(a)()()\"]",
        "args": [
          "(a)())()"
        ],
        "expected": [
          "(a())()",
          "(a)()()"
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "s = \")(\"",
        "output": "[\"\"]",
        "args": [
          ")("
        ],
        "expected": [
          ""
        ]
      }
    ]
  },
  "sudoku-solver": {
    "id": "130",
    "slug": "sudoku-solver",
    "title": "Sudoku Solver",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Hash Table"
      },
      {
        "name": "Backtracking"
      },
      {
        "name": "Matrix"
      }
    ],
    "description": "Write a program to solve a Sudoku puzzle by filling the empty cells (denoted by '.').",
    "constraints": [
      "board.length == 9",
      "board[i].length == 9"
    ],
    "methodName": "solveSudoku",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} board\n * @return {any}\n */\nvar solveSudoku = function(board) {\n    \n};",
      "python": "class Solution:\n    def solveSudoku(self, board):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement solveSudoku\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement solveSudoku\n}"
    },
    "publicTestCases": [
      {
        "input": "board = [[\"5\",\"3\",\".\",\".\",\"7\",\".\",\".\",\".\",\".\"],[\"6\",\".\",\".\",\"1\",\"9\",\"5\",\".\",\".\",\".\"],[\".\",\"9\",\"8\",\".\",\".\",\".\",\".\",\"6\",\".\"],[\"8\",\".\",\".\",\".\",\"6\",\".\",\".\",\".\",\"3\"],[\"4\",\".\",\".\",\"8\",\".\",\"3\",\".\",\".\",\"1\"],[\"7\",\".\",\".\",\".\",\"2\",\".\",\".\",\".\",\"6\"],[\".\",\"6\",\".\",\".\",\".\",\".\",\"2\",\"8\",\".\"],[\".\",\".\",\".\",\"4\",\"1\",\"9\",\".\",\".\",\"5\"],[\".\",\".\",\".\",\".\",\"8\",\".\",\".\",\"7\",\"9\"]]",
        "output": "[[\"5\",\"3\",\"4\",\"6\",\"7\",\"8\",\"9\",\"1\",\"2\"],[\"6\",\"7\",\"2\",\"1\",\"9\",\"5\",\"3\",\"4\",\"8\"],[\"1\",\"9\",\"8\",\"3\",\"4\",\"2\",\"5\",\"6\",\"7\"],[\"8\",\"5\",\"9\",\"7\",\"6\",\"1\",\"4\",\"2\",\"3\"],[\"4\",\"2\",\"6\",\"8\",\"5\",\"3\",\"7\",\"9\",\"1\"],[\"7\",\"1\",\"3\",\"9\",\"2\",\"4\",\"8\",\"5\",\"6\"],[\"9\",\"6\",\"1\",\"5\",\"3\",\"7\",\"2\",\"8\",\"4\"],[\"2\",\"8\",\"7\",\"4\",\"1\",\"9\",\"6\",\"3\",\"5\"],[\"3\",\"4\",\"5\",\"2\",\"8\",\"6\",\"1\",\"7\",\"9\"]]",
        "args": [
          [
            [
              "5",
              "3",
              ".",
              ".",
              "7",
              ".",
              ".",
              ".",
              "."
            ],
            [
              "6",
              ".",
              ".",
              "1",
              "9",
              "5",
              ".",
              ".",
              "."
            ],
            [
              ".",
              "9",
              "8",
              ".",
              ".",
              ".",
              ".",
              "6",
              "."
            ],
            [
              "8",
              ".",
              ".",
              ".",
              "6",
              ".",
              ".",
              ".",
              "3"
            ],
            [
              "4",
              ".",
              ".",
              "8",
              ".",
              "3",
              ".",
              ".",
              "1"
            ],
            [
              "7",
              ".",
              ".",
              ".",
              "2",
              ".",
              ".",
              ".",
              "6"
            ],
            [
              ".",
              "6",
              ".",
              ".",
              ".",
              ".",
              "2",
              "8",
              "."
            ],
            [
              ".",
              ".",
              ".",
              "4",
              "1",
              "9",
              ".",
              ".",
              "5"
            ],
            [
              ".",
              ".",
              ".",
              ".",
              "8",
              ".",
              ".",
              "7",
              "9"
            ]
          ]
        ],
        "expected": [
          [
            "5",
            "3",
            "4",
            "6",
            "7",
            "8",
            "9",
            "1",
            "2"
          ],
          [
            "6",
            "7",
            "2",
            "1",
            "9",
            "5",
            "3",
            "4",
            "8"
          ],
          [
            "1",
            "9",
            "8",
            "3",
            "4",
            "2",
            "5",
            "6",
            "7"
          ],
          [
            "8",
            "5",
            "9",
            "7",
            "6",
            "1",
            "4",
            "2",
            "3"
          ],
          [
            "4",
            "2",
            "6",
            "8",
            "5",
            "3",
            "7",
            "9",
            "1"
          ],
          [
            "7",
            "1",
            "3",
            "9",
            "2",
            "4",
            "8",
            "5",
            "6"
          ],
          [
            "9",
            "6",
            "1",
            "5",
            "3",
            "7",
            "2",
            "8",
            "4"
          ],
          [
            "2",
            "8",
            "7",
            "4",
            "1",
            "9",
            "6",
            "3",
            "5"
          ],
          [
            "3",
            "4",
            "5",
            "2",
            "8",
            "6",
            "1",
            "7",
            "9"
          ]
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "board = [[\"5\",\"3\",\"4\",\"6\",\"7\",\"8\",\"9\",\"1\",\"2\"],[\"6\",\"7\",\"2\",\"1\",\"9\",\"5\",\"3\",\"4\",\"8\"],[\"1\",\"9\",\"8\",\"3\",\"4\",\"2\",\"5\",\"6\",\"7\"],[\"8\",\"5\",\"9\",\"7\",\"6\",\"1\",\"4\",\"2\",\"3\"],[\"4\",\"2\",\"6\",\"8\",\"5\",\"3\",\"7\",\"9\",\"1\"],[\"7\",\"1\",\"3\",\"9\",\"2\",\"4\",\"8\",\"5\",\"6\"],[\"9\",\"6\",\"1\",\"5\",\"3\",\"7\",\"2\",\"8\",\"4\"],[\"2\",\"8\",\"7\",\"4\",\"1\",\"9\",\"6\",\"3\",\"5\"],[\"3\",\"4\",\"5\",\"2\",\"8\",\"6\",\"1\",\"7\",\".\"]]",
        "output": "[[\"5\",\"3\",\"4\",\"6\",\"7\",\"8\",\"9\",\"1\",\"2\"],[\"6\",\"7\",\"2\",\"1\",\"9\",\"5\",\"3\",\"4\",\"8\"],[\"1\",\"9\",\"8\",\"3\",\"4\",\"2\",\"5\",\"6\",\"7\"],[\"8\",\"5\",\"9\",\"7\",\"6\",\"1\",\"4\",\"2\",\"3\"],[\"4\",\"2\",\"6\",\"8\",\"5\",\"3\",\"7\",\"9\",\"1\"],[\"7\",\"1\",\"3\",\"9\",\"2\",\"4\",\"8\",\"5\",\"6\"],[\"9\",\"6\",\"1\",\"5\",\"3\",\"7\",\"2\",\"8\",\"4\"],[\"2\",\"8\",\"7\",\"4\",\"1\",\"9\",\"6\",\"3\",\"5\"],[\"3\",\"4\",\"5\",\"2\",\"8\",\"6\",\"1\",\"7\",\"9\"]]",
        "args": [
          [
            [
              "5",
              "3",
              "4",
              "6",
              "7",
              "8",
              "9",
              "1",
              "2"
            ],
            [
              "6",
              "7",
              "2",
              "1",
              "9",
              "5",
              "3",
              "4",
              "8"
            ],
            [
              "1",
              "9",
              "8",
              "3",
              "4",
              "2",
              "5",
              "6",
              "7"
            ],
            [
              "8",
              "5",
              "9",
              "7",
              "6",
              "1",
              "4",
              "2",
              "3"
            ],
            [
              "4",
              "2",
              "6",
              "8",
              "5",
              "3",
              "7",
              "9",
              "1"
            ],
            [
              "7",
              "1",
              "3",
              "9",
              "2",
              "4",
              "8",
              "5",
              "6"
            ],
            [
              "9",
              "6",
              "1",
              "5",
              "3",
              "7",
              "2",
              "8",
              "4"
            ],
            [
              "2",
              "8",
              "7",
              "4",
              "1",
              "9",
              "6",
              "3",
              "5"
            ],
            [
              "3",
              "4",
              "5",
              "2",
              "8",
              "6",
              "1",
              "7",
              "."
            ]
          ]
        ],
        "expected": [
          [
            "5",
            "3",
            "4",
            "6",
            "7",
            "8",
            "9",
            "1",
            "2"
          ],
          [
            "6",
            "7",
            "2",
            "1",
            "9",
            "5",
            "3",
            "4",
            "8"
          ],
          [
            "1",
            "9",
            "8",
            "3",
            "4",
            "2",
            "5",
            "6",
            "7"
          ],
          [
            "8",
            "5",
            "9",
            "7",
            "6",
            "1",
            "4",
            "2",
            "3"
          ],
          [
            "4",
            "2",
            "6",
            "8",
            "5",
            "3",
            "7",
            "9",
            "1"
          ],
          [
            "7",
            "1",
            "3",
            "9",
            "2",
            "4",
            "8",
            "5",
            "6"
          ],
          [
            "9",
            "6",
            "1",
            "5",
            "3",
            "7",
            "2",
            "8",
            "4"
          ],
          [
            "2",
            "8",
            "7",
            "4",
            "1",
            "9",
            "6",
            "3",
            "5"
          ],
          [
            "3",
            "4",
            "5",
            "2",
            "8",
            "6",
            "1",
            "7",
            "9"
          ]
        ]
      }
    ]
  },
  "cherry-pickup": {
    "id": "131",
    "slug": "cherry-pickup",
    "title": "Cherry Pickup",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Dynamic Programming"
      },
      {
        "name": "Matrix"
      }
    ],
    "description": "You are given an `n x n` grid representing a field of cherries. Return the maximum number of cherries you can collect by following rules: start at (0,0) go to (n-1,n-1) and return to (0,0).",
    "constraints": [
      "n == grid.length",
      "1 <= n <= 50"
    ],
    "methodName": "cherryPickup",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} grid\n * @return {any}\n */\nvar cherryPickup = function(grid) {\n    \n};",
      "python": "class Solution:\n    def cherryPickup(self, grid):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement cherryPickup\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement cherryPickup\n}"
    },
    "publicTestCases": [
      {
        "input": "grid = [[0,1,-1],[1,0,-1],[1,1,1]]",
        "output": "5",
        "args": [
          [
            [
              0,
              1,
              -1
            ],
            [
              1,
              0,
              -1
            ],
            [
              1,
              1,
              1
            ]
          ]
        ],
        "expected": 5
      },
      {
        "input": "grid = [[1,1,-1],[1,-1,1],[-1,1,1]]",
        "output": "0",
        "args": [
          [
            [
              1,
              1,
              -1
            ],
            [
              1,
              -1,
              1
            ],
            [
              -1,
              1,
              1
            ]
          ]
        ],
        "expected": 0
      }
    ],
    "hiddenTestCases": [
      {
        "input": "grid = [[1]]",
        "output": "1",
        "args": [
          [
            [
              1
            ]
          ]
        ],
        "expected": 1
      }
    ]
  },
  "concatenated-words": {
    "id": "132",
    "slug": "concatenated-words",
    "title": "Concatenated Words",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Strings"
      },
      {
        "name": "Dynamic Programming"
      },
      {
        "name": "DFS"
      },
      {
        "name": "Trie"
      }
    ],
    "description": "Given an array of strings `words` (without duplicates), return all concatenated words in the given list of words.",
    "constraints": [
      "1 <= words.length <= 10^4",
      "1 <= words[i].length <= 30"
    ],
    "methodName": "findAllConcatenatedWordsInADict",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} words\n * @return {any}\n */\nvar findAllConcatenatedWordsInADict = function(words) {\n    \n};",
      "python": "class Solution:\n    def findAllConcatenatedWordsInADict(self, words):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement findAllConcatenatedWordsInADict\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement findAllConcatenatedWordsInADict\n}"
    },
    "publicTestCases": [
      {
        "input": "words = [\"cat\",\"cats\",\"catsdogcats\",\"dog\",\"dogcatsdog\",\"hippopotamuses\",\"rat\",\"ratcatdogcat\"]",
        "output": "[\"catsdogcats\",\"dogcatsdog\",\"ratcatdogcat\"]",
        "args": [
          [
            "cat",
            "cats",
            "catsdogcats",
            "dog",
            "dogcatsdog",
            "hippopotamuses",
            "rat",
            "ratcatdogcat"
          ]
        ],
        "expected": [
          "catsdogcats",
          "dogcatsdog",
          "ratcatdogcat"
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "words = [\"cat\",\"dog\",\"catdog\"]",
        "output": "[\"catdog\"]",
        "args": [
          [
            "cat",
            "dog",
            "catdog"
          ]
        ],
        "expected": [
          "catdog"
        ]
      }
    ]
  },
  "cracking-the-safe": {
    "id": "133",
    "slug": "cracking-the-safe",
    "title": "Cracking the Safe",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "DFS"
      },
      {
        "name": "Graph"
      },
      {
        "name": "Eulerian Circuit"
      }
    ],
    "description": "There is a safe protected by a password of `n` digits. Each digit can be one of the first `k` digits `0, 1, ..., k-1`. Return any string of minimum length that is guaranteed to open the safe.",
    "constraints": [
      "1 <= n <= 4",
      "1 <= k <= 10"
    ],
    "methodName": "crackSafe",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} n, k\n * @return {any}\n */\nvar crackSafe = function(n, k) {\n    \n};",
      "python": "class Solution:\n    def crackSafe(self, n, k):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement crackSafe\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement crackSafe\n}"
    },
    "publicTestCases": [
      {
        "input": "n = 1, k = 2",
        "output": "\"01\"",
        "args": [
          1,
          2
        ],
        "expected": "01"
      },
      {
        "input": "n = 2, k = 2",
        "output": "\"00110\"",
        "args": [
          2,
          2
        ],
        "expected": "00110"
      }
    ],
    "hiddenTestCases": [
      {
        "input": "n = 1, k = 1",
        "output": "\"0\"",
        "args": [
          1,
          1
        ],
        "expected": "0"
      }
    ]
  },
  "erect-the-fence": {
    "id": "134",
    "slug": "erect-the-fence",
    "title": "Erect the Fence",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Math"
      },
      {
        "name": "Geometry"
      }
    ],
    "description": "You are given an array `trees` where `trees[i] = [x_i, y_i]` represents the location of a tree in the garden. Return the coordinates of trees that are exactly on the fence perimeter (Convex Hull).",
    "constraints": [
      "1 <= trees.length <= 3000"
    ],
    "methodName": "outerTrees",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} trees\n * @return {any}\n */\nvar outerTrees = function(trees) {\n    \n};",
      "python": "class Solution:\n    def outerTrees(self, trees):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement outerTrees\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement outerTrees\n}"
    },
    "publicTestCases": [
      {
        "input": "trees = [[1,1],[2,2],[2,0],[2,4],[3,3],[4,2]]",
        "output": "[[1,1],[2,0],[4,2],[3,3],[2,4]]",
        "args": [
          [
            [
              1,
              1
            ],
            [
              2,
              2
            ],
            [
              2,
              0
            ],
            [
              2,
              4
            ],
            [
              3,
              3
            ],
            [
              4,
              2
            ]
          ]
        ],
        "expected": [
          [
            1,
            1
          ],
          [
            2,
            0
          ],
          [
            4,
            2
          ],
          [
            3,
            3
          ],
          [
            2,
            4
          ]
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "trees = [[1,2],[2,2],[4,2]]",
        "output": "[[1,2],[2,2],[4,2]]",
        "args": [
          [
            [
              1,
              2
            ],
            [
              2,
              2
            ],
            [
              4,
              2
            ]
          ]
        ],
        "expected": [
          [
            1,
            2
          ],
          [
            2,
            2
          ],
          [
            4,
            2
          ]
        ]
      }
    ]
  },
  "alien-dictionary": {
    "id": "135",
    "slug": "alien-dictionary",
    "title": "Alien Dictionary",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Strings"
      },
      {
        "name": "Graph"
      },
      {
        "name": "Topological Sort"
      }
    ],
    "description": "There is a new alien language that uses the English alphabet. Given a list of words from the alien language dictionary sorted lexicographically, derive the order of letters in this language.",
    "constraints": [
      "1 <= words.length <= 100",
      "1 <= words[i].length <= 100"
    ],
    "methodName": "alienOrder",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} words\n * @return {any}\n */\nvar alienOrder = function(words) {\n    \n};",
      "python": "class Solution:\n    def alienOrder(self, words):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement alienOrder\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement alienOrder\n}"
    },
    "publicTestCases": [
      {
        "input": "words = [\"wrt\",\"wrf\",\"er\",\"ett\",\"rftt\"]",
        "output": "\"wertf\"",
        "args": [
          [
            "wrt",
            "wrf",
            "er",
            "ett",
            "rftt"
          ]
        ],
        "expected": "wertf"
      },
      {
        "input": "words = [\"z\",\"x\"]",
        "output": "\"zx\"",
        "args": [
          [
            "z",
            "x"
          ]
        ],
        "expected": "zx"
      }
    ],
    "hiddenTestCases": [
      {
        "input": "words = [\"z\",\"x\",\"z\"]",
        "output": "\"\"",
        "args": [
          [
            "z",
            "x",
            "z"
          ]
        ],
        "expected": ""
      }
    ]
  },
  "count-of-range-sum": {
    "id": "136",
    "slug": "count-of-range-sum",
    "title": "Count of Range Sum",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Binary Search"
      },
      {
        "name": "Divide and Conquer"
      },
      {
        "name": "Binary Indexed Tree"
      },
      {
        "name": "Segment Tree"
      }
    ],
    "description": "Given an integer array `nums` and two integers `lower` and `upper`, return the number of range sums that lie in `[lower, upper]` inclusive.",
    "constraints": [
      "1 <= nums.length <= 10^5"
    ],
    "methodName": "countRangeSum",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums, lower, upper\n * @return {any}\n */\nvar countRangeSum = function(nums, lower, upper) {\n    \n};",
      "python": "class Solution:\n    def countRangeSum(self, nums, lower, upper):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement countRangeSum\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement countRangeSum\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [-2,5,-1], lower = -2, upper = 2",
        "output": "3",
        "args": [
          [
            -2,
            5,
            -1
          ],
          -2,
          2
        ],
        "expected": 3
      },
      {
        "input": "nums = [0], lower = 0, upper = 0",
        "output": "1",
        "args": [
          [
            0
          ],
          0,
          0
        ],
        "expected": 1
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [0,-3,-3,1,1,2], lower = 3, upper = 5",
        "output": "2",
        "args": [
          [
            0,
            -3,
            -3,
            1,
            1,
            2
          ],
          3,
          5
        ],
        "expected": 2
      }
    ]
  },
  "redundant-connection-ii": {
    "id": "137",
    "slug": "redundant-connection-ii",
    "title": "Redundant Connection II",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "DFS"
      },
      {
        "name": "BFS"
      },
      {
        "name": "Union Find"
      },
      {
        "name": "Graph"
      }
    ],
    "description": "A directed tree is a directed graph where there is only one root node. Find an edge in `edges` that can be removed so that the resulting graph is a rooted tree of `n` nodes.",
    "constraints": [
      "n == edges.length",
      "3 <= n <= 1000"
    ],
    "methodName": "findRedundantDirectedConnection",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} edges\n * @return {any}\n */\nvar findRedundantDirectedConnection = function(edges) {\n    \n};",
      "python": "class Solution:\n    def findRedundantDirectedConnection(self, edges):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement findRedundantDirectedConnection\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement findRedundantDirectedConnection\n}"
    },
    "publicTestCases": [
      {
        "input": "edges = [[1,2],[1,3],[2,3]]",
        "output": "[2,3]",
        "args": [
          [
            [
              1,
              2
            ],
            [
              1,
              3
            ],
            [
              2,
              3
            ]
          ]
        ],
        "expected": [
          2,
          3
        ]
      },
      {
        "input": "edges = [[1,2],[2,3],[3,4],[4,1],[1,5]]",
        "output": "[4,1]",
        "args": [
          [
            [
              1,
              2
            ],
            [
              2,
              3
            ],
            [
              3,
              4
            ],
            [
              4,
              1
            ],
            [
              1,
              5
            ]
          ]
        ],
        "expected": [
          4,
          1
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "edges = [[2,1],[3,1],[4,2],[1,4]]",
        "output": "[2,1]",
        "args": [
          [
            [
              2,
              1
            ],
            [
              3,
              1
            ],
            [
              4,
              2
            ],
            [
              1,
              4
            ]
          ]
        ],
        "expected": [
          2,
          1
        ]
      }
    ]
  },
  "reverse-nodes-in-k-group": {
    "id": "138",
    "slug": "reverse-nodes-in-k-group",
    "title": "Reverse Nodes in k-Group",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Linked List"
      },
      {
        "name": "Recursion"
      }
    ],
    "description": "Given the head of a linked list, reverse the nodes of the list `k` at a time, and return the modified list.",
    "constraints": [
      "1 <= k <= length of list <= 5000"
    ],
    "methodName": "reverseKGroup",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} head, k\n * @return {any}\n */\nvar reverseKGroup = function(head, k) {\n    \n};",
      "python": "class Solution:\n    def reverseKGroup(self, head, k):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement reverseKGroup\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement reverseKGroup\n}"
    },
    "publicTestCases": [
      {
        "input": "head = [1,2,3,4,5], k = 2",
        "output": "[2,1,4,3,5]",
        "args": [
          [
            1,
            2,
            3,
            4,
            5
          ],
          2
        ],
        "expected": [
          2,
          1,
          4,
          3,
          5
        ]
      },
      {
        "input": "head = [1,2,3,4,5], k = 3",
        "output": "[3,2,1,4,5]",
        "args": [
          [
            1,
            2,
            3,
            4,
            5
          ],
          3
        ],
        "expected": [
          3,
          2,
          1,
          4,
          5
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "head = [1,2,3,4,5], k = 1",
        "output": "[1,2,3,4,5]",
        "args": [
          [
            1,
            2,
            3,
            4,
            5
          ],
          1
        ],
        "expected": [
          1,
          2,
          3,
          4,
          5
        ]
      },
      {
        "input": "head = [1], k = 1",
        "output": "[1]",
        "args": [
          [
            1
          ],
          1
        ],
        "expected": [
          1
        ]
      }
    ]
  },
  "freedom-trail": {
    "id": "139",
    "slug": "freedom-trail",
    "title": "Freedom Trail",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Strings"
      },
      {
        "name": "Dynamic Programming"
      },
      {
        "name": "DFS"
      },
      {
        "name": "BFS"
      }
    ],
    "description": "Given a string `ring` and a string `key`, return the minimum number of steps to spell all the characters in the `key` using the ring dial.",
    "constraints": [
      "1 <= ring.length, key.length <= 100"
    ],
    "methodName": "findRotateSteps",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} ring, key\n * @return {any}\n */\nvar findRotateSteps = function(ring, key) {\n    \n};",
      "python": "class Solution:\n    def findRotateSteps(self, ring, key):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement findRotateSteps\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement findRotateSteps\n}"
    },
    "publicTestCases": [
      {
        "input": "ring = \"godding\", key = \"gd\"",
        "output": "4",
        "args": [
          "godding",
          "gd"
        ],
        "expected": 4
      },
      {
        "input": "ring = \"godding\", key = \"godding\"",
        "output": "13",
        "args": [
          "godding",
          "godding"
        ],
        "expected": 13
      }
    ],
    "hiddenTestCases": [
      {
        "input": "ring = \"ababcab\", key = \"acba\"",
        "output": "9",
        "args": [
          "ababcab",
          "acba"
        ],
        "expected": 9
      }
    ]
  },
  "paint-house-iii": {
    "id": "140",
    "slug": "paint-house-iii",
    "title": "Paint House III",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Dynamic Programming"
      }
    ],
    "description": "There is a row of `m` houses in a small city. Return the minimum cost to paint all the remaining houses such that there are exactly `target` neighborhoods.",
    "constraints": [
      "1 <= m <= 100",
      "1 <= n <= 20",
      "1 <= target <= m"
    ],
    "methodName": "minCostPaint",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} houses, cost, m, n, target\n * @return {any}\n */\nvar minCostPaint = function(houses, cost, m, n, target) {\n    \n};",
      "python": "class Solution:\n    def minCostPaint(self, houses, cost, m, n, target):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement minCostPaint\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement minCostPaint\n}"
    },
    "publicTestCases": [
      {
        "input": "houses = [0,0,0,0,0], cost = [[1,10],[10,1],[10,1],[1,10],[5,1]], m = 5, n = 2, target = 3",
        "output": "9",
        "args": [
          [
            0,
            0,
            0,
            0,
            0
          ],
          [
            [
              1,
              10
            ],
            [
              10,
              1
            ],
            [
              10,
              1
            ],
            [
              1,
              10
            ],
            [
              5,
              1
            ]
          ],
          5,
          2,
          3
        ],
        "expected": 9
      },
      {
        "input": "houses = [0,2,1,2,0], cost = [[1,10],[10,1],[10,1],[1,10],[5,1]], m = 5, n = 2, target = 3",
        "output": "11",
        "args": [
          [
            0,
            2,
            1,
            2,
            0
          ],
          [
            [
              1,
              10
            ],
            [
              10,
              1
            ],
            [
              10,
              1
            ],
            [
              1,
              10
            ],
            [
              5,
              1
            ]
          ],
          5,
          2,
          3
        ],
        "expected": 11
      }
    ],
    "hiddenTestCases": [
      {
        "input": "houses = [3,1,2,3], cost = [[1,1,1],[1,1,1],[1,1,1],[1,1,1]], m = 4, n = 3, target = 3",
        "output": "-1",
        "args": [
          [
            3,
            1,
            2,
            3
          ],
          [
            [
              1,
              1,
              1
            ],
            [
              1,
              1,
              1
            ],
            [
              1,
              1,
              1
            ],
            [
              1,
              1,
              1
            ]
          ],
          4,
          3,
          3
        ],
        "expected": -1
      }
    ]
  },
  "serialize-and-deserialize-binary-tree": {
    "id": "141",
    "slug": "serialize-and-deserialize-binary-tree",
    "title": "Serialize and Deserialize Binary Tree",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Strings"
      },
      {
        "name": "Trees"
      },
      {
        "name": "DFS"
      },
      {
        "name": "BFS"
      },
      {
        "name": "Design"
      }
    ],
    "description": "Design an algorithm to serialize and deserialize a binary tree to and from a string representation.",
    "constraints": [
      "0 <= nodes <= 10^4"
    ],
    "methodName": "serializeAndDeserialize",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} treeArray\n * @return {any}\n */\nvar serializeAndDeserialize = function(treeArray) {\n    \n};",
      "python": "class Solution:\n    def serializeAndDeserialize(self, treeArray):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement serializeAndDeserialize\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement serializeAndDeserialize\n}"
    },
    "publicTestCases": [
      {
        "input": "treeArray = [1,2,3,null,null,4,5]",
        "output": "[1,2,3,null,null,4,5]",
        "args": [
          [
            1,
            2,
            3,
            null,
            null,
            4,
            5
          ]
        ],
        "expected": [
          1,
          2,
          3,
          null,
          null,
          4,
          5
        ]
      },
      {
        "input": "treeArray = []",
        "output": "[]",
        "args": [
          []
        ],
        "expected": []
      }
    ],
    "hiddenTestCases": [
      {
        "input": "treeArray = [1]",
        "output": "[1]",
        "args": [
          [
            1
          ]
        ],
        "expected": [
          1
        ]
      },
      {
        "input": "treeArray = [1,2]",
        "output": "[1,2]",
        "args": [
          [
            1,
            2
          ]
        ],
        "expected": [
          1,
          2
        ]
      }
    ]
  },
  "binary-tree-maximum-path-sum": {
    "id": "142",
    "slug": "binary-tree-maximum-path-sum",
    "title": "Binary Tree Maximum Path Sum",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Dynamic Programming"
      },
      {
        "name": "Trees"
      },
      {
        "name": "DFS"
      }
    ],
    "description": "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge. Return the maximum path sum of any non-empty path.",
    "constraints": [
      "1 <= nodes <= 3 * 10^4",
      "-1000 <= Node.val <= 1000"
    ],
    "methodName": "maxPathSum",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nodes\n * @return {any}\n */\nvar maxPathSum = function(nodes) {\n    \n};",
      "python": "class Solution:\n    def maxPathSum(self, nodes):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement maxPathSum\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement maxPathSum\n}"
    },
    "publicTestCases": [
      {
        "input": "nodes = [1,2,3]",
        "output": "6",
        "args": [
          [
            1,
            2,
            3
          ]
        ],
        "expected": 6
      },
      {
        "input": "nodes = [-10,9,20,null,null,15,7]",
        "output": "42",
        "args": [
          [
            -10,
            9,
            20,
            null,
            null,
            15,
            7
          ]
        ],
        "expected": 42
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nodes = [-3]",
        "output": "-3",
        "args": [
          [
            -3
          ]
        ],
        "expected": -3
      },
      {
        "input": "nodes = [2,-1]",
        "output": "2",
        "args": [
          [
            2,
            -1
          ]
        ],
        "expected": 2
      }
    ]
  },
  "longest-increasing-path-in-a-matrix": {
    "id": "143",
    "slug": "longest-increasing-path-in-a-matrix",
    "title": "Longest Increasing Path in a Matrix",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Dynamic Programming"
      },
      {
        "name": "DFS"
      },
      {
        "name": "BFS"
      },
      {
        "name": "Graph"
      },
      {
        "name": "Memoization"
      }
    ],
    "description": "Given an `m x n` integers matrix, return the length of the longest increasing path in matrix.",
    "constraints": [
      "m == matrix.length",
      "n == matrix[i].length",
      "1 <= m, n <= 200"
    ],
    "methodName": "longestIncreasingPath",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} matrix\n * @return {any}\n */\nvar longestIncreasingPath = function(matrix) {\n    \n};",
      "python": "class Solution:\n    def longestIncreasingPath(self, matrix):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement longestIncreasingPath\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement longestIncreasingPath\n}"
    },
    "publicTestCases": [
      {
        "input": "matrix = [[9,9,4],[6,6,8],[2,1,1]]",
        "output": "4",
        "args": [
          [
            [
              9,
              9,
              4
            ],
            [
              6,
              6,
              8
            ],
            [
              2,
              1,
              1
            ]
          ]
        ],
        "expected": 4
      },
      {
        "input": "matrix = [[3,4,5],[3,2,6],[2,2,1]]",
        "output": "4",
        "args": [
          [
            [
              3,
              4,
              5
            ],
            [
              3,
              2,
              6
            ],
            [
              2,
              2,
              1
            ]
          ]
        ],
        "expected": 4
      }
    ],
    "hiddenTestCases": [
      {
        "input": "matrix = [[1]]",
        "output": "1",
        "args": [
          [
            [
              1
            ]
          ]
        ],
        "expected": 1
      }
    ]
  },
  "word-search-ii": {
    "id": "144",
    "slug": "word-search-ii",
    "title": "Word Search II",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Strings"
      },
      {
        "name": "Backtracking"
      },
      {
        "name": "Trie"
      },
      {
        "name": "Matrix"
      }
    ],
    "description": "Given an `m x n` board of characters and a list of strings `words`, return all words on the board.",
    "constraints": [
      "m == board.length",
      "n == board[i].length",
      "1 <= words.length <= 3 * 10^4"
    ],
    "methodName": "findWords",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} board, words\n * @return {any}\n */\nvar findWords = function(board, words) {\n    \n};",
      "python": "class Solution:\n    def findWords(self, board, words):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement findWords\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement findWords\n}"
    },
    "publicTestCases": [
      {
        "input": "board = [[\"o\",\"a\",\"a\",\"n\"],[\"e\",\"t\",\"a\",\"e\"],[\"i\",\"h\",\"k\",\"r\"],[\"i\",\"f\",\"l\",\"v\"]], words = [\"oath\",\"pea\",\"eat\",\"rain\"]",
        "output": "[\"oath\",\"eat\"]",
        "args": [
          [
            [
              "o",
              "a",
              "a",
              "n"
            ],
            [
              "e",
              "t",
              "a",
              "e"
            ],
            [
              "i",
              "h",
              "k",
              "r"
            ],
            [
              "i",
              "f",
              "l",
              "v"
            ]
          ],
          [
            "oath",
            "pea",
            "eat",
            "rain"
          ]
        ],
        "expected": [
          "oath",
          "eat"
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "board = [[\"a\",\"b\"],[\"c\",\"d\"]], words = [\"abcb\"]",
        "output": "[]",
        "args": [
          [
            [
              "a",
              "b"
            ],
            [
              "c",
              "d"
            ]
          ],
          [
            "abcb"
          ]
        ],
        "expected": []
      }
    ]
  },
  "word-ladder-ii": {
    "id": "145",
    "slug": "word-ladder-ii",
    "title": "Word Ladder II",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Hash Table"
      },
      {
        "name": "Strings"
      },
      {
        "name": "Backtracking"
      },
      {
        "name": "BFS"
      }
    ],
    "description": "Given two words, `beginWord` and `endWord`, and a dictionary `wordList`, return all the shortest transformation sequences from `beginWord` to `endWord`.",
    "constraints": [
      "1 <= beginWord.length <= 5",
      "1 <= wordList.length <= 500"
    ],
    "methodName": "findLadders",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} beginWord, endWord, wordList\n * @return {any}\n */\nvar findLadders = function(beginWord, endWord, wordList) {\n    \n};",
      "python": "class Solution:\n    def findLadders(self, beginWord, endWord, wordList):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement findLadders\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement findLadders\n}"
    },
    "publicTestCases": [
      {
        "input": "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\",\"cog\"]",
        "output": "[[\"hit\",\"hot\",\"dot\",\"dog\",\"cog\"],[\"hit\",\"hot\",\"lot\",\"log\",\"cog\"]]",
        "args": [
          "hit",
          "cog",
          [
            "hot",
            "dot",
            "dog",
            "lot",
            "log",
            "cog"
          ]
        ],
        "expected": [
          [
            "hit",
            "hot",
            "dot",
            "dog",
            "cog"
          ],
          [
            "hit",
            "hot",
            "lot",
            "log",
            "cog"
          ]
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "beginWord = \"hit\", endWord = \"cog\", wordList = [\"hot\",\"dot\",\"dog\",\"lot\",\"log\"]",
        "output": "[]",
        "args": [
          "hit",
          "cog",
          [
            "hot",
            "dot",
            "dog",
            "lot",
            "log"
          ]
        ],
        "expected": []
      }
    ]
  },
  "expression-add-operators": {
    "id": "146",
    "slug": "expression-add-operators",
    "title": "Expression Add Operators",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Math"
      },
      {
        "name": "Strings"
      },
      {
        "name": "Backtracking"
      }
    ],
    "description": "Given a string `num` that contains only digits and an integer `target`, return all possibilities to insert binary operators '+', '-', and/or '*' between digits of `num` so that resultant value equals `target`.",
    "constraints": [
      "1 <= num.length <= 10",
      "-2^31 <= target <= 2^31 - 1"
    ],
    "methodName": "addOperators",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} num, target\n * @return {any}\n */\nvar addOperators = function(num, target) {\n    \n};",
      "python": "class Solution:\n    def addOperators(self, num, target):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement addOperators\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement addOperators\n}"
    },
    "publicTestCases": [
      {
        "input": "num = \"123\", target = 6",
        "output": "[\"1+2+3\",\"1*2*3\"]",
        "args": [
          "123",
          6
        ],
        "expected": [
          "1+2+3",
          "1*2*3"
        ]
      },
      {
        "input": "num = \"232\", target = 8",
        "output": "[\"2+3*2\",\"2*3+2\"]",
        "args": [
          "232",
          8
        ],
        "expected": [
          "2+3*2",
          "2*3+2"
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "num = \"3456237490\", target = 9191",
        "output": "[]",
        "args": [
          "3456237490",
          9191
        ],
        "expected": []
      }
    ]
  },
  "trapping-rain-water-ii": {
    "id": "147",
    "slug": "trapping-rain-water-ii",
    "title": "Trapping Rain Water II",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "BFS"
      },
      {
        "name": "Heap"
      },
      {
        "name": "Matrix"
      }
    ],
    "description": "Given an `m x n` integer matrix `heightMap` representing the height of each unit cell in a 2D elevation map, return the volume of water it can trap after raining.",
    "constraints": [
      "m == heightMap.length",
      "n == heightMap[i].length",
      "1 <= m, n <= 200"
    ],
    "methodName": "trapRainWater",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} heightMap\n * @return {any}\n */\nvar trapRainWater = function(heightMap) {\n    \n};",
      "python": "class Solution:\n    def trapRainWater(self, heightMap):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement trapRainWater\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement trapRainWater\n}"
    },
    "publicTestCases": [
      {
        "input": "heightMap = [[1,4,3,1,3,2],[3,2,1,3,2,4],[2,3,3,2,3,1]]",
        "output": "4",
        "args": [
          [
            [
              1,
              4,
              3,
              1,
              3,
              2
            ],
            [
              3,
              2,
              1,
              3,
              2,
              4
            ],
            [
              2,
              3,
              3,
              2,
              3,
              1
            ]
          ]
        ],
        "expected": 4
      }
    ],
    "hiddenTestCases": [
      {
        "input": "heightMap = [[3,3,3,3,3],[3,2,2,2,3],[3,2,1,2,3],[3,2,2,2,3],[3,3,3,3,3]]",
        "output": "10",
        "args": [
          [
            [
              3,
              3,
              3,
              3,
              3
            ],
            [
              3,
              2,
              2,
              2,
              3
            ],
            [
              3,
              2,
              1,
              2,
              3
            ],
            [
              3,
              2,
              2,
              2,
              3
            ],
            [
              3,
              3,
              3,
              3,
              3
            ]
          ]
        ],
        "expected": 10
      }
    ]
  },
  "skyline-problem": {
    "id": "148",
    "slug": "skyline-problem",
    "title": "The Skyline Problem",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Divide and Conquer"
      },
      {
        "name": "Heap"
      },
      {
        "name": "Binary Indexed Tree"
      },
      {
        "name": "Segment Tree"
      },
      {
        "name": "Line Sweep"
      }
    ],
    "description": "A city's skyline is the outer contour of the silhouette formed by all the buildings in that city when viewed from a distance. Given the locations and heights of all the buildings, return the skyline formed by these buildings.",
    "constraints": [
      "1 <= buildings.length <= 10^4"
    ],
    "methodName": "getSkyline",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} buildings\n * @return {any}\n */\nvar getSkyline = function(buildings) {\n    \n};",
      "python": "class Solution:\n    def getSkyline(self, buildings):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement getSkyline\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement getSkyline\n}"
    },
    "publicTestCases": [
      {
        "input": "buildings = [[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]]",
        "output": "[[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]",
        "args": [
          [
            [
              2,
              9,
              10
            ],
            [
              3,
              7,
              15
            ],
            [
              5,
              12,
              12
            ],
            [
              15,
              20,
              10
            ],
            [
              19,
              24,
              8
            ]
          ]
        ],
        "expected": [
          [
            2,
            10
          ],
          [
            3,
            15
          ],
          [
            7,
            12
          ],
          [
            12,
            0
          ],
          [
            15,
            10
          ],
          [
            20,
            8
          ],
          [
            24,
            0
          ]
        ]
      }
    ],
    "hiddenTestCases": [
      {
        "input": "buildings = [[0,2,3],[2,5,3]]",
        "output": "[[0,3],[5,0]]",
        "args": [
          [
            [
              0,
              2,
              3
            ],
            [
              2,
              5,
              3
            ]
          ]
        ],
        "expected": [
          [
            0,
            3
          ],
          [
            5,
            0
          ]
        ]
      }
    ]
  },
  "stickers-to-spell-word": {
    "id": "149",
    "slug": "stickers-to-spell-word",
    "title": "Stickers to Spell Word",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Strings"
      },
      {
        "name": "Dynamic Programming"
      },
      {
        "name": "Backtracking"
      },
      {
        "name": "Bitmask"
      }
    ],
    "description": "We are given `n` different types of stickers. Each sticker has a lowercase English word on it. We would like to spell out the given string `target` by cutting individual letters from stickers. Return the minimum number of stickers you need to spell out target.",
    "constraints": [
      "1 <= stickers.length <= 50",
      "1 <= target.length <= 15"
    ],
    "methodName": "minStickers",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} stickers, target\n * @return {any}\n */\nvar minStickers = function(stickers, target) {\n    \n};",
      "python": "class Solution:\n    def minStickers(self, stickers, target):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement minStickers\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement minStickers\n}"
    },
    "publicTestCases": [
      {
        "input": "stickers = [\"with\",\"example\",\"science\"], target = \"thehat\"",
        "output": "3",
        "args": [
          [
            "with",
            "example",
            "science"
          ],
          "thehat"
        ],
        "expected": 3
      },
      {
        "input": "stickers = [\"notice\",\"possible\"], target = \"basicbasic\"",
        "output": "-1",
        "args": [
          [
            "notice",
            "possible"
          ],
          "basicbasic"
        ],
        "expected": -1
      }
    ],
    "hiddenTestCases": [
      {
        "input": "stickers = [\"a\",\"b\",\"c\"], target = \"abc\"",
        "output": "3",
        "args": [
          [
            "a",
            "b",
            "c"
          ],
          "abc"
        ],
        "expected": 3
      }
    ]
  },
  "split-array-largest-sum": {
    "id": "150",
    "slug": "split-array-largest-sum",
    "title": "Split Array Largest Sum",
    "difficulty": "HARD",
    "topics": [
      {
        "name": "Arrays"
      },
      {
        "name": "Binary Search"
      },
      {
        "name": "Dynamic Programming"
      },
      {
        "name": "Greedy"
      },
      {
        "name": "Prefix Sum"
      }
    ],
    "description": "Given an integer array `nums` and an integer `k`, split `nums` into `k` non-empty subarrays such that the largest sum of any subarray is minimized. Return the minimized largest sum.",
    "constraints": [
      "1 <= nums.length <= 1000",
      "1 <= k <= min(50, nums.length)"
    ],
    "methodName": "splitArray",
    "supportedLanguages": [
      "javascript",
      "python",
      "cpp",
      "java"
    ],
    "starterCode": {
      "javascript": "/**\n * @param {any} nums, k\n * @return {any}\n */\nvar splitArray = function(nums, k) {\n    \n};",
      "python": "class Solution:\n    def splitArray(self, nums, k):\n        pass",
      "cpp": "#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement splitArray\n};",
      "java": "import java.util.*;\n\nclass Solution {\n    // Implement splitArray\n}"
    },
    "publicTestCases": [
      {
        "input": "nums = [7,2,5,10,8], k = 2",
        "output": "18",
        "args": [
          [
            7,
            2,
            5,
            10,
            8
          ],
          2
        ],
        "expected": 18
      },
      {
        "input": "nums = [1,2,3,4,5], k = 2",
        "output": "9",
        "args": [
          [
            1,
            2,
            3,
            4,
            5
          ],
          2
        ],
        "expected": 9
      }
    ],
    "hiddenTestCases": [
      {
        "input": "nums = [1,4,4], k = 3",
        "output": "4",
        "args": [
          [
            1,
            4,
            4
          ],
          3
        ],
        "expected": 4
      }
    ]
  }
};
