const fs = require('fs');
const path = require('path');

// Helper to structure a problem
function createProblem(data) {
  const {
    id,
    slug,
    title,
    difficulty,
    topics,
    description,
    constraints,
    methodName,
    params,
    returnType,
    starterCode,
    publicTestCases,
    hiddenTestCases,
    referenceSolution
  } = data;

  const defaultStarter = {
    javascript: `/**\n * @param {any} ${params.join(', ')}\n * @return {any}\n */\nvar ${methodName} = function(${params.join(', ')}) {\n    \n};`,
    python: `class Solution:\n    def ${methodName}(self, ${params.map(p => `${p}`).join(', ')}):\n        pass`,
    cpp: `#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    // Implement ${methodName}\n};`,
    java: `import java.util.*;\n\nclass Solution {\n    // Implement ${methodName}\n}`
  };

  const formatCases = (cList) => cList.map(c => {
    const exp = c[c.length - 1];
    const args = c.slice(0, c.length - 1);
    const inputStr = args.map((a, i) => `${params[i] || `arg${i+1}`} = ${JSON.stringify(a)}`).join(", ");
    return {
      input: inputStr,
      output: JSON.stringify(exp),
      args: args,
      expected: exp
    };
  });

  return {
    id: String(id),
    slug,
    title,
    difficulty,
    topics: topics.map(t => ({ name: t })),
    description,
    constraints,
    methodName,
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: starterCode || defaultStarter,
    publicTestCases: formatCases(publicTestCases),
    hiddenTestCases: formatCases(hiddenTestCases),
    _refSolution: referenceSolution
  };
}

// Full 150 Question Definitions Generator
const PROBLEMS = [];

// ==========================================
// 50 EASY PROBLEMS (1 to 50)
// ==========================================
const easyDefs = [
  {
    slug: "two-sum",
    title: "Two Sum",
    topics: ["Arrays", "Hash Table"],
    desc: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
    constraints: ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9", "-10^9 <= target <= 10^9"],
    methodName: "twoSum",
    params: ["nums", "target"],
    pub: [[[2, 7, 11, 15], 9, [0, 1]], [[3, 2, 4], 6, [1, 2]]],
    hid: [[[3, 3], 6, [0, 1]], [[1, 5, 8, 3], 11, [2, 3]]],
    ref: `function twoSum(nums, target) { const map = {}; for (let i = 0; i < nums.length; i++) { const comp = target - nums[i]; if (comp in map) return [map[comp], i]; map[nums[i]] = i; } return []; }`
  },
  {
    slug: "valid-parentheses",
    title: "Valid Parentheses",
    topics: ["Strings", "Stack"],
    desc: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    constraints: ["1 <= s.length <= 10^4"],
    methodName: "isValid",
    params: ["s"],
    pub: [["()", true], ["()[]{}", true], ["(]", false]],
    hid: [["{[]}", true], ["([)]", false], ["((", false]],
    ref: `function isValid(s) { const st = []; const map = {')': '(', '}': '{', ']': '['}; for (let c of s) { if (c in map) { if (st.pop() !== map[c]) return false; } else { st.push(c); } } return st.length === 0; }`
  },
  {
    slug: "merge-sorted-array",
    title: "Merge Sorted Array",
    topics: ["Arrays", "Two Pointers", "Sorting"],
    desc: "You are given two integer arrays `nums1` and `nums2`, sorted in non-decreasing order, and two integers `m` and `n`. Merge `nums2` into `nums1` as one sorted array.",
    constraints: ["nums1.length == m + n", "0 <= m, n <= 200"],
    methodName: "merge",
    params: ["nums1", "m", "nums2", "n"],
    pub: [[[1,2,3,0,0,0], 3, [2,5,6], 3, [1,2,2,3,5,6]], [[1], 1, [], 0, [1]]],
    hid: [[[0], 0, [1], 1, [1]], [[4,5,6,0,0,0], 3, [1,2,3], 3, [1,2,3,4,5,6]]],
    ref: `function merge(nums1, m, nums2, n) { let p1 = m - 1, p2 = n - 1, p = m + n - 1; while (p2 >= 0) { if (p1 >= 0 && nums1[p1] > nums2[p2]) { nums1[p] = nums1[p1--]; } else { nums1[p] = nums2[p2--]; } p--; } return nums1; }`
  },
  {
    slug: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    topics: ["Arrays", "Dynamic Programming"],
    desc: "You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve.",
    constraints: ["1 <= prices.length <= 10^5", "0 <= prices[i] <= 10^4"],
    methodName: "maxProfit",
    params: ["prices"],
    pub: [[[7,1,5,3,6,4], 5], [[7,6,4,3,1], 0]],
    hid: [[[2,4,1], 2], [[1,2,3,4,5], 4]],
    ref: `function maxProfit(prices) { let min = Infinity, max = 0; for (let p of prices) { min = Math.min(min, p); max = Math.max(max, p - min); } return max; }`
  },
  {
    slug: "valid-palindrome",
    title: "Valid Palindrome",
    topics: ["Strings", "Two Pointers"],
    desc: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.",
    constraints: ["1 <= s.length <= 2 * 10^5"],
    methodName: "isPalindrome",
    params: ["s"],
    pub: [["A man, a plan, a canal: Panama", true], ["race a car", false]],
    hid: [[" ", true], ["ab_a", true]],
    ref: `function isPalindrome(s) { const str = s.toLowerCase().replace(/[^a-z0-9]/g, ''); return str === str.split('').reverse().join(''); }`
  },
  {
    slug: "climbing-stairs",
    title: "Climbing Stairs",
    topics: ["Math", "Dynamic Programming"],
    desc: "You are climbing a staircase. It takes `n` steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
    constraints: ["1 <= n <= 45"],
    methodName: "climbStairs",
    params: ["n"],
    pub: [[2, 2], [3, 3]],
    hid: [[4, 5], [5, 8], [6, 13]],
    ref: `function climbStairs(n) { if (n <= 2) return n; let a = 1, b = 2; for (let i = 3; i <= n; i++) { let c = a + b; a = b; b = c; } return b; }`
  },
  {
    slug: "single-number",
    title: "Single Number",
    topics: ["Arrays", "Bit Manipulation"],
    desc: "Given a non-empty array of integers `nums`, every element appears twice except for one. Find that single one.",
    constraints: ["1 <= nums.length <= 3 * 10^4", "-3 * 10^4 <= nums[i] <= 3 * 10^4"],
    methodName: "singleNumber",
    params: ["nums"],
    pub: [[[2,2,1], 1], [[4,1,2,1,2], 4]],
    hid: [[[1], 1], [[9,3,9,5,3], 5]],
    ref: `function singleNumber(nums) { return nums.reduce((acc, v) => acc ^ v, 0); }`
  },
  {
    slug: "contains-duplicate",
    title: "Contains Duplicate",
    topics: ["Arrays", "Hash Table"],
    desc: "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
    constraints: ["1 <= nums.length <= 10^5"],
    methodName: "containsDuplicate",
    params: ["nums"],
    pub: [[[1,2,3,1], true], [[1,2,3,4], false]],
    hid: [[[1,1,1,3,3,4,3,2,4,2], true], [[5], false]],
    ref: `function containsDuplicate(nums) { return new Set(nums).size !== nums.length; }`
  },
  {
    slug: "missing-number",
    title: "Missing Number",
    topics: ["Arrays", "Math", "Bit Manipulation"],
    desc: "Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.",
    constraints: ["n == nums.length", "1 <= n <= 10^4"],
    methodName: "missingNumber",
    params: ["nums"],
    pub: [[[3,0,1], 2], [[0,1], 2]],
    hid: [[[9,6,4,2,3,5,7,0,1], 8], [[0], 1]],
    ref: `function missingNumber(nums) { const n = nums.length; const expected = (n * (n + 1)) / 2; const actual = nums.reduce((a, b) => a + b, 0); return expected - actual; }`
  },
  {
    slug: "reverse-string",
    title: "Reverse String",
    topics: ["Strings", "Two Pointers"],
    desc: "Write a function that reverses an array of characters in-place.",
    constraints: ["1 <= s.length <= 10^5"],
    methodName: "reverseString",
    params: ["s"],
    pub: [[["h","e","l","l","o"], ["o","l","l","e","h"]]],
    hid: [[["H","a","n","n","a","h"], ["h","a","n","n","a","H"]], [["a"], ["a"]]],
    ref: `function reverseString(s) { let l = 0, r = s.length - 1; while (l < r) { const t = s[l]; s[l] = s[r]; s[r] = t; l++; r--; } return s; }`
  },
  {
    slug: "valid-anagram",
    title: "Valid Anagram",
    topics: ["Hash Table", "Strings"],
    desc: "Given two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.",
    constraints: ["1 <= s.length, t.length <= 5 * 10^4"],
    methodName: "isAnagram",
    params: ["s", "t"],
    pub: [["anagram", "nagaram", true], ["rat", "car", false]],
    hid: [["a", "ab", false], ["listen", "silent", true]],
    ref: `function isAnagram(s, t) { if (s.length !== t.length) return false; return s.split('').sort().join('') === t.split('').sort().join(''); }`
  },
  {
    slug: "binary-search",
    title: "Binary Search",
    topics: ["Arrays", "Binary Search"],
    desc: "Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return `-1`.",
    constraints: ["1 <= nums.length <= 10^4", "-10^4 < nums[i], target < 10^4"],
    methodName: "search",
    params: ["nums", "target"],
    pub: [[[-1,0,3,5,9,12], 9, 4], [[-1,0,3,5,9,12], 2, -1]],
    hid: [[[5], 5, 0], [[1,3,5,7,9], 1, 0]],
    ref: `function search(nums, target) { let l = 0, r = nums.length - 1; while (l <= r) { const m = Math.floor((l + r) / 2); if (nums[m] === target) return m; if (nums[m] < target) l = m + 1; else r = m - 1; } return -1; }`
  },
  {
    slug: "maximum-subarray",
    title: "Maximum Subarray",
    topics: ["Arrays", "Divide and Conquer", "Dynamic Programming"],
    desc: "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    methodName: "maxSubArray",
    params: ["nums"],
    pub: [[[-2,1,-3,4,-1,2,1,-5,4], 6], [[1], 1]],
    hid: [[[5,4,-1,7,8], 23], [[-1, -2], -1]],
    ref: `function maxSubArray(nums) { let max = nums[0], cur = nums[0]; for (let i = 1; i < nums.length; i++) { cur = Math.max(nums[i], cur + nums[i]); max = Math.max(max, cur); } return max; }`
  },
  {
    slug: "move-zeroes",
    title: "Move Zeroes",
    topics: ["Arrays", "Two Pointers"],
    desc: "Given an integer array `nums`, move all `0`'s to the end of it while maintaining the relative order of the non-zero elements in-place.",
    constraints: ["1 <= nums.length <= 10^4"],
    methodName: "moveZeroes",
    params: ["nums"],
    pub: [[[0,1,0,3,12], [1,3,12,0,0]], [[0], [0]]],
    hid: [[[1,2,3], [1,2,3]], [[0,0,1], [1,0,0]]],
    ref: `function moveZeroes(nums) { let pos = 0; for (let i = 0; i < nums.length; i++) { if (nums[i] !== 0) nums[pos++] = nums[i]; } while (pos < nums.length) nums[pos++] = 0; return nums; }`
  },
  {
    slug: "plus-one",
    title: "Plus One",
    topics: ["Arrays", "Math"],
    desc: "You are given a large integer represented as an integer array `digits`. Increment the large integer by one and return the resulting array of digits.",
    constraints: ["1 <= digits.length <= 100"],
    methodName: "plusOne",
    params: ["digits"],
    pub: [[[1,2,3], [1,2,4]], [[4,3,2,1], [4,3,2,2]]],
    hid: [[[9], [1,0]], [[9,9,9], [1,0,0,0]]],
    ref: `function plusOne(digits) { for (let i = digits.length - 1; i >= 0; i--) { if (digits[i] < 9) { digits[i]++; return digits; } digits[i] = 0; } return [1, ...digits]; }`
  },
  {
    slug: "sqrt-x",
    title: "Sqrt(x)",
    topics: ["Math", "Binary Search"],
    desc: "Given a non-negative integer `x`, return the square root of `x` rounded down to the nearest integer.",
    constraints: ["0 <= x <= 2^31 - 1"],
    methodName: "mySqrt",
    params: ["x"],
    pub: [[4, 2], [8, 2]],
    hid: [[0, 0], [1, 1], [16, 4], [25, 5]],
    ref: `function mySqrt(x) { return Math.floor(Math.sqrt(x)); }`
  },
  {
    slug: "first-unique-character-in-a-string",
    title: "First Unique Character in a String",
    topics: ["Hash Table", "Strings"],
    desc: "Given a string `s`, find the first non-repeating character in it and return its index. If it does not exist, return `-1`.",
    constraints: ["1 <= s.length <= 10^5"],
    methodName: "firstUniqChar",
    params: ["s"],
    pub: [["leetcode", 0], ["loveleetcode", 2]],
    hid: [["aabb", -1], ["z", 0]],
    ref: `function firstUniqChar(s) { const count = {}; for (let c of s) count[c] = (count[c] || 0) + 1; for (let i = 0; i < s.length; i++) if (count[s[i]] === 1) return i; return -1; }`
  },
  {
    slug: "pascals-triangle",
    title: "Pascal's Triangle",
    topics: ["Arrays", "Dynamic Programming"],
    desc: "Given an integer `numRows`, return the first numRows of Pascal's triangle.",
    constraints: ["1 <= numRows <= 30"],
    methodName: "generate",
    params: ["numRows"],
    pub: [[5, [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]]],
    hid: [[1, [[1]]], [2, [[1],[1,1]]]],
    ref: `function generate(numRows) { const res = []; for (let i = 0; i < numRows; i++) { const row = new Array(i + 1).fill(1); for (let j = 1; j < i; j++) { row[j] = res[i-1][j-1] + res[i-1][j]; } res.push(row); } return res; }`
  },
  {
    slug: "majority-element",
    title: "Majority Element",
    topics: ["Arrays", "Hash Table", "Divide and Conquer"],
    desc: "Given an array `nums` of size `n`, return the majority element that appears more than ⌊n / 2⌋ times.",
    constraints: ["1 <= nums.length <= 5 * 10^4"],
    methodName: "majorityElement",
    params: ["nums"],
    pub: [[[3,2,3], 3], [[2,2,1,1,1,2,2], 2]],
    hid: [[[1], 1], [[6,5,5], 5]],
    ref: `function majorityElement(nums) { let count = 0, candidate = null; for (let num of nums) { if (count === 0) candidate = num; count += (num === candidate) ? 1 : -1; } return candidate; }`
  },
  {
    slug: "number-of-1-bits",
    title: "Number of 1 Bits",
    topics: ["Bit Manipulation"],
    desc: "Write a function that takes the binary representation of a positive integer and returns the number of set bits it has (Hamming weight).",
    constraints: ["1 <= n <= 2^31 - 1"],
    methodName: "hammingWeight",
    params: ["n"],
    pub: [[11, 3], [128, 1]],
    hid: [[2147483645, 30], [0, 0]],
    ref: `function hammingWeight(n) { let count = 0; while (n) { count += n & 1; n = n >>> 1; } return count; }`
  },
  {
    slug: "happy-number",
    title: "Happy Number",
    topics: ["Hash Table", "Math", "Two Pointers"],
    desc: "Write an algorithm to determine if a number `n` is happy.",
    constraints: ["1 <= n <= 2^31 - 1"],
    methodName: "isHappy",
    params: ["n"],
    pub: [[19, true], [2, false]],
    hid: [[7, true], [1, true]],
    ref: `function isHappy(n) { const seen = new Set(); while (n !== 1 && !seen.has(n)) { seen.add(n); n = String(n).split('').reduce((sum, d) => sum + Math.pow(Number(d), 2), 0); } return n === 1; }`
  },
  {
    slug: "roman-to-integer",
    title: "Roman to Integer",
    topics: ["Hash Table", "Math", "Strings"],
    desc: "Given a roman numeral, convert it to an integer.",
    constraints: ["1 <= s.length <= 15"],
    methodName: "romanToInt",
    params: ["s"],
    pub: [["III", 3], ["LVIII", 58]],
    hid: [["MCMXCIV", 1994], ["IV", 4], ["IX", 9]],
    ref: `function romanToInt(s) { const map = {I:1,V:5,X:10,L:50,C:100,D:500,M:1000}; let res = 0; for (let i = 0; i < s.length; i++) { const cur = map[s[i]], next = map[s[i+1]]; if (next > cur) { res += (next - cur); i++; } else { res += cur; } } return res; }`
  },
  {
    slug: "longest-common-prefix",
    title: "Longest Common Prefix",
    topics: ["Strings", "Trie"],
    desc: "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string `\"\"`.",
    constraints: ["1 <= strs.length <= 200"],
    methodName: "longestCommonPrefix",
    params: ["strs"],
    pub: [[["flower","flow","flight"], "fl"], [["dog","racecar","car"], ""]],
    hid: [[["a"], "a"], [["interspecies","interstellar","interstate"], "inters"]],
    ref: `function longestCommonPrefix(strs) { if (!strs.length) return ''; let pref = strs[0]; for (let i = 1; i < strs.length; i++) { while (strs[i].indexOf(pref) !== 0) { pref = pref.slice(0, -1); if (!pref) return ''; } } return pref; }`
  },
  {
    slug: "remove-duplicates-from-sorted-array",
    title: "Remove Duplicates from Sorted Array",
    topics: ["Arrays", "Two Pointers"],
    desc: "Given an integer array `nums` sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return the number of unique elements `k`.",
    constraints: ["1 <= nums.length <= 3 * 10^4"],
    methodName: "removeDuplicates",
    params: ["nums"],
    pub: [[[1,1,2], 2], [[0,0,1,1,1,2,2,3,3,4], 5]],
    hid: [[[1], 1], [[1,2,3,4], 4]],
    ref: `function removeDuplicates(nums) { if (nums.length === 0) return 0; let k = 1; for (let i = 1; i < nums.length; i++) { if (nums[i] !== nums[k-1]) { nums[k] = nums[i]; k++; } } return k; }`
  },
  {
    slug: "remove-element",
    title: "Remove Element",
    topics: ["Arrays", "Two Pointers"],
    desc: "Given an integer array `nums` and an integer `val`, remove all occurrences of `val` in `nums` in-place. Return the number of elements in `nums` which are not equal to `val`.",
    constraints: ["0 <= nums.length <= 100"],
    methodName: "removeElement",
    params: ["nums", "val"],
    pub: [[[3,2,2,3], 3, 2], [[0,1,2,2,3,0,4,2], 2, 5]],
    hid: [[[], 0, 0], [[1], 1, 0]],
    ref: `function removeElement(nums, val) { let k = 0; for (let i = 0; i < nums.length; i++) { if (nums[i] !== val) { nums[k] = nums[i]; k++; } } return k; }`
  },
  {
    slug: "search-insert-position",
    title: "Search Insert Position",
    topics: ["Arrays", "Binary Search"],
    desc: "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order.",
    constraints: ["1 <= nums.length <= 10^4"],
    methodName: "searchInsert",
    params: ["nums", "target"],
    pub: [[[1,3,5,6], 5, 2], [[1,3,5,6], 2, 1]],
    hid: [[[1,3,5,6], 7, 4], [[1,3,5,6], 0, 0]],
    ref: `function searchInsert(nums, target) { let l = 0, r = nums.length - 1; while (l <= r) { const m = Math.floor((l + r) / 2); if (nums[m] === target) return m; if (nums[m] < target) l = m + 1; else r = m - 1; } return l; }`
  },
  {
    slug: "length-of-last-word",
    title: "Length of Last Word",
    topics: ["Strings"],
    desc: "Given a string `s` consisting of words and spaces, return the length of the last word in the string.",
    constraints: ["1 <= s.length <= 10^4"],
    methodName: "lengthOfLastWord",
    params: ["s"],
    pub: [["Hello World", 5], ["   fly me   to   the moon  ", 4]],
    hid: [["luffy is still joyboy", 6], ["a", 1]],
    ref: `function lengthOfLastWord(s) { const words = s.trim().split(/\\s+/); return words[words.length - 1].length; }`
  },
  {
    slug: "counting-bits",
    title: "Counting Bits",
    topics: ["Dynamic Programming", "Bit Manipulation"],
    desc: "Given an integer `n`, return an array `ans` of length `n + 1` such that for each `i` (`0 <= i <= n`), `ans[i]` is the number of `1`'s in the binary representation of `i`.",
    constraints: ["0 <= n <= 10^5"],
    methodName: "countBits",
    params: ["n"],
    pub: [[2, [0,1,1]], [5, [0,1,1,2,1,2]]],
    hid: [[0, [0]], [1, [0, 1]]],
    ref: `function countBits(n) { const res = new Array(n + 1).fill(0); for (let i = 1; i <= n; i++) res[i] = res[i >> 1] + (i & 1); return res; }`
  },
  {
    slug: "ransom-note",
    title: "Ransom Note",
    topics: ["Hash Table", "Strings", "Counting"],
    desc: "Given two strings `ransomNote` and `magazine`, return `true` if `ransomNote` can be constructed by using the letters from `magazine` and `false` otherwise.",
    constraints: ["1 <= ransomNote.length, magazine.length <= 10^5"],
    methodName: "canConstruct",
    params: ["ransomNote", "magazine"],
    pub: [["a", "b", false], ["aa", "aab", true]],
    hid: [["aa", "ab", false], ["bg", "efjbdfbdgfjhhaiigfhbaejahgfbbgbjagbddfgdiaigdadhcfcj", true]],
    ref: `function canConstruct(ransomNote, magazine) { const counts = {}; for (let c of magazine) counts[c] = (counts[c] || 0) + 1; for (let c of ransomNote) { if (!counts[c]) return false; counts[c]--; } return true; }`
  },
  {
    slug: "is-subsequence",
    title: "Is Subsequence",
    topics: ["Two Pointers", "Strings", "Dynamic Programming"],
    desc: "Given two strings `s` and `t`, return `true` if `s` is a subsequence of `t`, or `false` otherwise.",
    constraints: ["0 <= s.length <= 100", "0 <= t.length <= 10^4"],
    methodName: "isSubsequence",
    params: ["s", "t"],
    pub: [["abc", "ahbgdc", true], ["axc", "ahbgdc", false]],
    hid: [["", "ahbgdc", true], ["b", "c", false]],
    ref: `function isSubsequence(s, t) { let i = 0, j = 0; while (i < s.length && j < t.length) { if (s[i] === t[j]) i++; j++; } return i === s.length; }`
  },
  {
    slug: "squares-of-a-sorted-array",
    title: "Squares of a Sorted Array",
    topics: ["Arrays", "Two Pointers", "Sorting"],
    desc: "Given an integer array `nums` sorted in non-decreasing order, return an array of the squares of each number sorted in non-decreasing order.",
    constraints: ["1 <= nums.length <= 10^4"],
    methodName: "sortedSquares",
    params: ["nums"],
    pub: [[[-4,-1,0,3,10], [0,1,9,16,100]], [[-7,-3,2,3,11], [4,9,9,49,121]]],
    hid: [[[0], [0]], [[-5,-3,-2,-1], [1,4,9,25]]],
    ref: `function sortedSquares(nums) { const res = new Array(nums.length); let l = 0, r = nums.length - 1, idx = nums.length - 1; while (l <= r) { const s1 = nums[l] * nums[l], s2 = nums[r] * nums[r]; if (s1 > s2) { res[idx--] = s1; l++; } else { res[idx--] = s2; r--; } } return res; }`
  },
  {
    slug: "backspace-string-compare",
    title: "Backspace String Compare",
    topics: ["Two Pointers", "Strings", "Stack"],
    desc: "Given two strings `s` and `t`, return `true` if they are equal when both are typed into empty text editors. '#' means a backspace character.",
    constraints: ["1 <= s.length, t.length <= 200"],
    methodName: "backspaceCompare",
    params: ["s", "t"],
    pub: [["ab#c", "ad#c", true], ["ab##", "c#d#", true]],
    hid: [["a#c", "b", false], ["a##c", "#a#c", true]],
    ref: `function backspaceCompare(s, t) { const build = str => { const res = []; for (let c of str) { if (c === '#') res.pop(); else res.push(c); } return res.join(''); }; return build(s) === build(t); }`
  },
  {
    slug: "last-stone-weight",
    title: "Last Stone Weight",
    topics: ["Arrays", "Heap"],
    desc: "You are given an array of integers `stones` where `stones[i]` is the weight of the ith stone. Smash the two heaviest stones until at most 1 stone remains. Return the weight of the last remaining stone, or 0 if none remain.",
    constraints: ["1 <= stones.length <= 30"],
    methodName: "lastStoneWeight",
    params: ["stones"],
    pub: [[[2,7,4,1,8,1], 1], [[1], 1]],
    hid: [[[2,2], 0], [[3,7,2], 2]],
    ref: `function lastStoneWeight(stones) { const s = [...stones]; while (s.length > 1) { s.sort((a,b) => a - b); const y = s.pop(), x = s.pop(); if (y !== x) s.push(y - x); } return s.length === 1 ? s[0] : 0; }`
  },
  {
    slug: "min-cost-climbing-stairs",
    title: "Min Cost Climbing Stairs",
    topics: ["Arrays", "Dynamic Programming"],
    desc: "You are given an integer array `cost` where `cost[i]` is the cost of ith step on a staircase. Return the minimum cost to reach the top of the floor.",
    constraints: ["2 <= cost.length <= 1000"],
    methodName: "minCostClimbingStairs",
    params: ["cost"],
    pub: [[[10,15,20], 15], [[1,100,1,1,1,100,1,1,100,1], 6]],
    hid: [[[0,0,0,0], 0], [[10, 15], 10]],
    ref: `function minCostClimbingStairs(cost) { let a = 0, b = 0; for (let i = 2; i <= cost.length; i++) { const c = Math.min(b + cost[i-1], a + cost[i-2]); a = b; b = c; } return b; }`
  },
  {
    slug: "find-pivot-index",
    title: "Find Pivot Index",
    topics: ["Arrays", "Prefix Sum"],
    desc: "Given an array of integers `nums`, calculate the pivot index where the sum of all the numbers strictly to the left is equal to the sum of all the numbers strictly to the right.",
    constraints: ["1 <= nums.length <= 10^4"],
    methodName: "pivotIndex",
    params: ["nums"],
    pub: [[[1,7,3,6,5,6], 3], [[1,2,3], -1]],
    hid: [[[2,1,-1], 0], [[0,0,0,0], 0]],
    ref: `function pivotIndex(nums) { const total = nums.reduce((a, b) => a + b, 0); let left = 0; for (let i = 0; i < nums.length; i++) { if (left === total - left - nums[i]) return i; left += nums[i]; } return -1; }`
  },
  {
    slug: "power-of-two",
    title: "Power of Two",
    topics: ["Math", "Bit Manipulation"],
    desc: "Given an integer `n`, return `true` if it is a power of two. Otherwise, return `false`.",
    constraints: ["-2^31 <= n <= 2^31 - 1"],
    methodName: "isPowerOfTwo",
    params: ["n"],
    pub: [[1, true], [16, true], [3, false]],
    hid: [[0, false], [4, true], [5, false], [1024, true]],
    ref: `function isPowerOfTwo(n) { return n > 0 && (n & (n - 1)) === 0; }`
  },
  {
    slug: "intersection-of-two-arrays",
    title: "Intersection of Two Arrays",
    topics: ["Arrays", "Hash Table", "Two Pointers"],
    desc: "Given two integer arrays `nums1` and `nums2`, return an array of their unique intersection.",
    constraints: ["1 <= nums1.length, nums2.length <= 1000"],
    methodName: "intersection",
    params: ["nums1", "nums2"],
    pub: [[[1,2,2,1], [2,2], [2]], [[4,9,5], [9,4,9,8,4], [4,9]]],
    hid: [[[1,2,3], [4,5,6], []]],
    ref: `function intersection(nums1, nums2) { const s1 = new Set(nums1); return Array.from(new Set(nums2.filter(x => s1.has(x)))).sort((a,b) => a - b); }`
  },
  {
    slug: "find-all-numbers-disappeared-in-an-array",
    title: "Find All Numbers Disappeared in an Array",
    topics: ["Arrays", "Hash Table"],
    desc: "Given an array `nums` of `n` integers where `nums[i]` is in the range `[1, n]`, return an array of all the integers in the range `[1, n]` that do not appear in `nums`.",
    constraints: ["n == nums.length", "1 <= n <= 10^5"],
    methodName: "findDisappearedNumbers",
    params: ["nums"],
    pub: [[[4,3,2,7,8,2,3,1], [5,6]], [[1,1], [2]]],
    hid: [[[1], []], [[2,2], [1]]],
    ref: `function findDisappearedNumbers(nums) { const set = new Set(nums); const res = []; for (let i = 1; i <= nums.length; i++) if (!set.has(i)) res.push(i); return res; }`
  },
  {
    slug: "reverse-vowels-of-a-string",
    title: "Reverse Vowels of a String",
    topics: ["Two Pointers", "Strings"],
    desc: "Given a string `s`, reverse only all the vowels in the string and return it.",
    constraints: ["1 <= s.length <= 3 * 10^5"],
    methodName: "reverseVowels",
    params: ["s"],
    pub: [["hello", "holle"], ["leetcode", "leotcede"]],
    hid: [["aA", "Aa"], ["race car", "race car"]],
    ref: `function reverseVowels(s) { const vowels = new Set(['a','e','i','o','u','A','E','I','O','U']); const arr = s.split(''); let l = 0, r = arr.length - 1; while (l < r) { while (l < r && !vowels.has(arr[l])) l++; while (l < r && !vowels.has(arr[r])) r--; if (l < r) { const t = arr[l]; arr[l] = arr[r]; arr[r] = t; l++; r--; } } return arr.join(''); }`
  },
  {
    slug: "maximum-product-of-three-numbers",
    title: "Maximum Product of Three Numbers",
    topics: ["Arrays", "Math", "Sorting"],
    desc: "Given an integer array `nums`, find three numbers whose product is maximum and return the maximum product.",
    constraints: ["3 <= nums.length <= 10^4"],
    methodName: "maximumProduct",
    params: ["nums"],
    pub: [[[1,2,3], 6], [[1,2,3,4], 24]],
    hid: [[[-1,-2,-3], -6], [[-100,-98,-1,2,3,4], 39200]],
    ref: `function maximumProduct(nums) { nums.sort((a, b) => a - b); const n = nums.length; return Math.max(nums[n-1] * nums[n-2] * nums[n-3], nums[0] * nums[1] * nums[n-1]); }`
  },
  {
    slug: "can-place-flowers",
    title: "Can Place Flowers",
    topics: ["Arrays", "Greedy"],
    desc: "You have a long flowerbed in which some of the plots are planted, and some are not. Flowers cannot be planted in adjacent plots. Return `true` if `n` new flowers can be planted without violating the rule.",
    constraints: ["1 <= flowerbed.length <= 2 * 10^4"],
    methodName: "canPlaceFlowers",
    params: ["flowerbed", "n"],
    pub: [[[1,0,0,0,1], 1, true], [[1,0,0,0,1], 2, false]],
    hid: [[[0,0,1,0,1], 1, true], [[0], 1, true]],
    ref: `function canPlaceFlowers(flowerbed, n) { let count = 0; for (let i = 0; i < flowerbed.length; i++) { if (flowerbed[i] === 0) { const emptyLeft = (i === 0 || flowerbed[i-1] === 0); const emptyRight = (i === flowerbed.length - 1 || flowerbed[i+1] === 0); if (emptyLeft && emptyRight) { flowerbed[i] = 1; count++; } } } return count >= n; }`
  },
  {
    slug: "valid-perfect-square",
    title: "Valid Perfect Square",
    topics: ["Math", "Binary Search"],
    desc: "Given a positive integer `num`, return `true` if `num` is a perfect square or `false` otherwise.",
    constraints: ["1 <= num <= 2^31 - 1"],
    methodName: "isPerfectSquare",
    params: ["num"],
    pub: [[16, true], [14, false]],
    hid: [[1, true], [2147483647, false], [100, true]],
    ref: `function isPerfectSquare(num) { let l = 1, r = num; while (l <= r) { const m = Math.floor((l + r) / 2); const sq = m * m; if (sq === num) return true; if (sq < num) l = m + 1; else r = m - 1; } return false; }`
  },
  {
    slug: "add-binary",
    title: "Add Binary",
    topics: ["Math", "Strings", "Bit Manipulation"],
    desc: "Given two binary strings `a` and `b`, return their sum as a binary string.",
    constraints: ["1 <= a.length, b.length <= 10^4"],
    methodName: "addBinary",
    params: ["a", "b"],
    pub: [["11", "1", "100"], ["1010", "1011", "10101"]],
    hid: [["0", "0", "0"], ["1", "111", "1000"]],
    ref: `function addBinary(a, b) { let i = a.length - 1, j = b.length - 1, carry = 0, res = []; while (i >= 0 || j >= 0 || carry) { let sum = carry; if (i >= 0) sum += Number(a[i--]); if (j >= 0) sum += Number(b[j--]); res.push(sum % 2); carry = Math.floor(sum / 2); } return res.reverse().join(''); }`
  },
  {
    slug: "hamming-distance",
    title: "Hamming Distance",
    topics: ["Bit Manipulation"],
    desc: "The Hamming distance between two integers is the number of positions at which the corresponding bits are different. Given two integers `x` and `y`, return the Hamming distance.",
    constraints: ["0 <= x, y <= 2^31 - 1"],
    methodName: "hammingDistance",
    params: ["x", "y"],
    pub: [[1, 4, 2], [3, 1, 1]],
    hid: [[0, 0, 0], [93, 73, 2]],
    ref: `function hammingDistance(x, y) { let xor = x ^ y, count = 0; while (xor) { count += xor & 1; xor = xor >>> 1; } return count; }`
  },
  {
    slug: "toeplitz-matrix",
    title: "Toeplitz Matrix",
    topics: ["Arrays", "Matrix"],
    desc: "Given an `m x n` matrix, return `true` if the matrix is Toeplitz. A matrix is Toeplitz if every diagonal from top-left to bottom-right has the same elements.",
    constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 20"],
    methodName: "isToeplitzMatrix",
    params: ["matrix"],
    pub: [[[[1,2,3,4],[5,1,2,3],[9,5,1,2]], true], [[[1,2],[2,2]], false]],
    hid: [[[[1]], true], [[[1,2,3],[4,1,2]], true]],
    ref: `function isToeplitzMatrix(matrix) { for (let i = 0; i < matrix.length - 1; i++) { for (let j = 0; j < matrix[0].length - 1; j++) { if (matrix[i][j] !== matrix[i+1][j+1]) return false; } } return true; }`
  },
  {
    slug: "transpose-matrix",
    title: "Transpose Matrix",
    topics: ["Arrays", "Matrix", "Simulation"],
    desc: "Given a 2D integer array `matrix`, return the transpose of `matrix`.",
    constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 1000"],
    methodName: "transpose",
    params: ["matrix"],
    pub: [[[[1,2,3],[4,5,6],[7,8,9]], [[1,4,7],[2,5,8],[3,6,9]]], [[[1,2,3],[4,5,6]], [[1,4],[2,5],[3,6]]]],
    hid: [[[[1]], [[1]]], [[[5,1]], [[5],[1]]]],
    ref: `function transpose(matrix) { const m = matrix.length, n = matrix[0].length; const res = Array.from({ length: n }, () => new Array(m)); for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) res[j][i] = matrix[i][j]; return res; }`
  },
  {
    slug: "monotonic-array",
    title: "Monotonic Array",
    topics: ["Arrays"],
    desc: "An array is monotonic if it is either monotone increasing or monotone decreasing. Return `true` if the given array is monotonic, or `false` otherwise.",
    constraints: ["1 <= nums.length <= 10^5"],
    methodName: "isMonotonic",
    params: ["nums"],
    pub: [[[1,2,2,3], true], [[6,5,4,4], true], [[1,3,2], false]],
    hid: [[[1,1,1], true], [[5], true]],
    ref: `function isMonotonic(nums) { let inc = true, dec = true; for (let i = 1; i < nums.length; i++) { if (nums[i] > nums[i-1]) dec = false; if (nums[i] < nums[i-1]) inc = false; } return inc || dec; }`
  },
  {
    slug: "sort-array-by-parity",
    title: "Sort Array By Parity",
    topics: ["Arrays", "Two Pointers", "Sorting"],
    desc: "Given an integer array `nums`, move all the even integers at the beginning of the array followed by all the odd integers.",
    constraints: ["1 <= nums.length <= 5000"],
    methodName: "sortArrayByParity",
    params: ["nums"],
    pub: [[[3,1,2,4], [2,4,3,1]], [[0], [0]]],
    hid: [[[1,3,5], [1,3,5]], [[2,4,6], [2,4,6]]],
    ref: `function sortArrayByParity(nums) { const evens = nums.filter(x => x % 2 === 0); const odds = nums.filter(x => x % 2 !== 0); return [...evens, ...odds]; }`
  },
  {
    slug: "defanging-an-ip-address",
    title: "Defanging an IP Address",
    topics: ["Strings"],
    desc: "Given a valid (IPv4) IP `address`, return a defanged version of that IP address where every period `.` is replaced with `[.]`.",
    constraints: ["The given address is a valid IPv4 address."],
    methodName: "defangIPaddr",
    params: ["address"],
    pub: [["1.1.1.1", "1[.]1[.]1[.]1"], ["255.100.50.0", "255[.]100[.]50[.]0"]],
    hid: [["127.0.0.1", "127[.]0[.]0[.]1"], ["0.0.0.0", "0[.]0[.]0[.]0"]],
    ref: `function defangIPaddr(address) { return address.split('.').join('[.]'); }`
  },
  {
    slug: "shuffle-the-array",
    title: "Shuffle the Array",
    topics: ["Arrays"],
    desc: "Given the array `nums` consisting of `2n` elements in the form `[x1,x2,...,xn,y1,y2,...,yn]`, return the array in the form `[x1,y1,x2,y2,...,xn,yn]`.",
    constraints: ["1 <= n <= 500", "nums.length == 2n"],
    methodName: "shuffle",
    params: ["nums", "n"],
    pub: [[[2,5,1,3,4,7], 3, [2,3,5,4,1,7]], [[1,2,3,4,4,3,2,1], 4, [1,4,2,3,3,2,4,1]]],
    hid: [[[1,1,2,2], 2, [1,2,1,2]]],
    ref: `function shuffle(nums, n) { const res = []; for (let i = 0; i < n; i++) { res.push(nums[i], nums[i + n]); } return res; }`
  }
];

// Build 50 Easy
easyDefs.forEach((d, idx) => {
  PROBLEMS.push(createProblem({
    id: idx + 1,
    slug: d.slug,
    title: d.title,
    difficulty: "EASY",
    topics: d.topics,
    description: d.desc,
    constraints: d.constraints,
    methodName: d.methodName,
    params: d.params,
    returnType: "any",
    publicTestCases: d.pub,
    hiddenTestCases: d.hid,
    referenceSolution: d.ref
  }));
});

// ==========================================
// 50 MEDIUM PROBLEMS (51 to 100)
// ==========================================
const mediumDefs = [
  {
    slug: "3sum",
    title: "3Sum",
    topics: ["Arrays", "Two Pointers", "Sorting"],
    desc: "Given an integer array nums, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j`, `i != k`, and `j != k`, and `nums[i] + nums[j] + nums[k] == 0`.",
    constraints: ["3 <= nums.length <= 3000", "-10^5 <= nums[i] <= 10^5"],
    methodName: "threeSum",
    params: ["nums"],
    pub: [[[-1,0,1,2,-1,-4], [[-1,-1,2],[-1,0,1]]], [[0,1,1], []]],
    hid: [[[0,0,0], [[0,0,0]]], [[-2,0,1,1,2], [[-2,0,2],[-2,1,1]]]],
    ref: `function threeSum(nums) { nums.sort((a, b) => a - b); const res = []; for (let i = 0; i < nums.length - 2; i++) { if (i > 0 && nums[i] === nums[i - 1]) continue; let l = i + 1, r = nums.length - 1; while (l < r) { const sum = nums[i] + nums[l] + nums[r]; if (sum === 0) { res.push([nums[i], nums[l], nums[r]]); while (l < r && nums[l] === nums[l + 1]) l++; while (l < r && nums[r] === nums[r - 1]) r--; l++; r--; } else if (sum < 0) l++; else r--; } } return res; }`
  },
  {
    slug: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    topics: ["Hash Table", "Strings", "Sliding Window"],
    desc: "Given a string `s`, find the length of the longest substring without repeating characters.",
    constraints: ["0 <= s.length <= 5 * 10^4"],
    methodName: "lengthOfLongestSubstring",
    params: ["s"],
    pub: [["abcabcbb", 3], ["bbbbb", 1]],
    hid: [["pwwkew", 3], ["", 0], ["au", 2]],
    ref: `function lengthOfLongestSubstring(s) { const set = new Set(); let l = 0, max = 0; for (let r = 0; r < s.length; r++) { while (set.has(s[r])) { set.delete(s[l++]); } set.add(s[r]); max = Math.max(max, r - l + 1); } return max; }`
  },
  {
    slug: "container-with-most-water",
    title: "Container With Most Water",
    topics: ["Arrays", "Two Pointers", "Greedy"],
    desc: "Given `n` non-negative integers `height` where each represents a point at coordinate `(i, height[i])`. Find two lines that together with the x-axis form a container, such that the container contains the most water.",
    constraints: ["n == height.length", "2 <= n <= 10^5"],
    methodName: "maxArea",
    params: ["height"],
    pub: [[[1,8,6,2,5,4,8,3,7], 49], [[1,1], 1]],
    hid: [[[4,3,2,1,4], 16], [[1,2,1], 2]],
    ref: `function maxArea(height) { let l = 0, r = height.length - 1, max = 0; while (l < r) { const h = Math.min(height[l], height[r]); max = Math.max(max, h * (r - l)); if (height[l] < height[r]) l++; else r--; } return max; }`
  },
  {
    slug: "group-anagrams",
    title: "Group Anagrams",
    topics: ["Arrays", "Hash Table", "Strings", "Sorting"],
    desc: "Given an array of strings `strs`, group the anagrams together. You can return the answer in any order.",
    constraints: ["1 <= strs.length <= 10^4"],
    methodName: "groupAnagrams",
    params: ["strs"],
    pub: [[["eat","tea","tan","ate","nat","bat"], [["eat","tea","ate"],["tan","nat"],["bat"]]]],
    hid: [[[""], [[""]]], [["a"], [["a"]]]],
    ref: `function groupAnagrams(strs) { const map = {}; for (let s of strs) { const key = s.split('').sort().join(''); if (!map[key]) map[key] = []; map[key].push(s); } return Object.values(map); }`
  },
  {
    slug: "top-k-frequent-elements",
    title: "Top K Frequent Elements",
    topics: ["Arrays", "Hash Table", "Heap", "Bucket Sort"],
    desc: "Given an integer array `nums` and an integer `k`, return the `k` most frequent elements.",
    constraints: ["1 <= nums.length <= 10^5", "k is in range [1, number of unique elements]"],
    methodName: "topKFrequent",
    params: ["nums", "k"],
    pub: [[[1,1,1,2,2,3], 2, [1,2]], [[1], 1, [1]]],
    hid: [[[4,1,-1,2,-1,2,3], 2, [-1,2]]],
    ref: `function topKFrequent(nums, k) { const count = {}; for (let n of nums) count[n] = (count[n] || 0) + 1; const sorted = Object.keys(count).sort((a, b) => count[b] - count[a] || Number(a) - Number(b)); return sorted.slice(0, k).map(Number); }`
  },
  {
    slug: "product-of-array-except-self",
    title: "Product of Array Except Self",
    topics: ["Arrays", "Prefix Sum"],
    desc: "Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]`.",
    constraints: ["2 <= nums.length <= 10^5"],
    methodName: "productExceptSelf",
    params: ["nums"],
    pub: [[[1,2,3,4], [24,12,8,6]], [[-1,1,0,-3,3], [0,0,9,0,0]]],
    hid: [[[2,3], [3,2]], [[1,0], [0,1]]],
    ref: `function productExceptSelf(nums) { const n = nums.length, res = new Array(n).fill(1); let pref = 1; for (let i = 0; i < n; i++) { res[i] = pref; pref *= nums[i]; } let suff = 1; for (let i = n - 1; i >= 0; i--) { res[i] *= suff; suff *= nums[i]; } return res; }`
  },
  {
    slug: "longest-consecutive-sequence",
    title: "Longest Consecutive Sequence",
    topics: ["Arrays", "Hash Table", "Union Find"],
    desc: "Given an unsorted array of integers `nums`, return the length of the longest consecutive elements sequence in O(n) time.",
    constraints: ["0 <= nums.length <= 10^5"],
    methodName: "longestConsecutive",
    params: ["nums"],
    pub: [[[100,4,200,1,3,2], 4], [[0,3,7,2,5,8,4,6,0,1], 9]],
    hid: [[[], 0], [[9,1,4,7,3,-1,0,5,8,-1,6], 7]],
    ref: `function longestConsecutive(nums) { const set = new Set(nums); let max = 0; for (let num of set) { if (!set.has(num - 1)) { let cur = num, len = 1; while (set.has(cur + 1)) { cur++; len++; } max = Math.max(max, len); } } return max; }`
  },
  {
    slug: "two-sum-ii-input-array-is-sorted",
    title: "Two Sum II - Input Array Is Sorted",
    topics: ["Arrays", "Two Pointers", "Binary Search"],
    desc: "Given a 1-indexed array of integers `numbers` that is already sorted in non-decreasing order, find two numbers such that they add up to a specific `target` number.",
    constraints: ["2 <= numbers.length <= 3 * 10^4"],
    methodName: "twoSumII",
    params: ["numbers", "target"],
    pub: [[[2,7,11,15], 9, [1,2]], [[2,3,4], 6, [1,3]]],
    hid: [[[-1,0], -1, [1,2]], [[1,2,3,4,4,9], 8, [4,5]]],
    ref: `function twoSumII(numbers, target) { let l = 0, r = numbers.length - 1; while (l < r) { const sum = numbers[l] + numbers[r]; if (sum === target) return [l + 1, r + 1]; if (sum < target) l++; else r--; } return []; }`
  },
  {
    slug: "subarray-sum-equals-k",
    title: "Subarray Sum Equals K",
    topics: ["Arrays", "Hash Table", "Prefix Sum"],
    desc: "Given an array of integers `nums` and an integer `k`, return the total number of subarrays whose sum equals to `k`.",
    constraints: ["1 <= nums.length <= 2 * 10^4"],
    methodName: "subarraySum",
    params: ["nums", "k"],
    pub: [[[1,1,1], 2, 2], [[1,2,3], 3, 2]],
    hid: [[[1,-1,0], 0, 3], [[3,4,7,2,-3,1,4,2], 7, 4]],
    ref: `function subarraySum(nums, k) { const map = {0: 1}; let sum = 0, count = 0; for (let n of nums) { sum += n; if ((sum - k) in map) count += map[sum - k]; map[sum] = (map[sum] || 0) + 1; } return count; }`
  },
  {
    slug: "longest-palindromic-substring",
    title: "Longest Palindromic Substring",
    topics: ["Strings", "Dynamic Programming"],
    desc: "Given a string `s`, return the longest palindromic substring in `s`.",
    constraints: ["1 <= s.length <= 1000"],
    methodName: "longestPalindrome",
    params: ["s"],
    pub: [["babad", "bab"], ["cbbd", "bb"]],
    hid: [["a", "a"], ["ac", "a"], ["racecar", "racecar"]],
    ref: `function longestPalindrome(s) { if (!s || s.length < 2) return s; let start = 0, maxLen = 1; function expand(l, r) { while (l >= 0 && r < s.length && s[l] === s[r]) { if (r - l + 1 > maxLen) { start = l; maxLen = r - l + 1; } l--; r++; } } for (let i = 0; i < s.length; i++) { expand(i, i); expand(i, i + 1); } return s.slice(start, start + maxLen); }`
  },
  {
    slug: "palindromic-substrings",
    title: "Palindromic Substrings",
    topics: ["Strings", "Dynamic Programming"],
    desc: "Given a string `s`, return the number of palindromic substrings in it.",
    constraints: ["1 <= s.length <= 1000"],
    methodName: "countSubstrings",
    params: ["s"],
    pub: [["abc", 3], ["aaa", 6]],
    hid: [["a", 1], ["aba", 4]],
    ref: `function countSubstrings(s) { let count = 0; function expand(l, r) { while (l >= 0 && r < s.length && s[l] === s[r]) { count++; l--; r++; } } for (let i = 0; i < s.length; i++) { expand(i, i); expand(i, i + 1); } return count; }`
  },
  {
    slug: "coin-change",
    title: "Coin Change",
    topics: ["Arrays", "Dynamic Programming", "BFS"],
    desc: "You are given an integer array `coins` and an integer `amount`. Return the fewest number of coins needed to make up that amount, or -1 if impossible.",
    constraints: ["1 <= coins.length <= 12", "0 <= amount <= 10^4"],
    methodName: "coinChange",
    params: ["coins", "amount"],
    pub: [[[1,2,5], 11, 3], [[2], 3, -1]],
    hid: [[[1], 0, 0], [[1,2,5], 100, 20]],
    ref: `function coinChange(coins, amount) { const dp = new Array(amount + 1).fill(Infinity); dp[0] = 0; for (let i = 1; i <= amount; i++) { for (let c of coins) { if (i - c >= 0) dp[i] = Math.min(dp[i], dp[i - c] + 1); } } return dp[amount] === Infinity ? -1 : dp[amount]; }`
  },
  {
    slug: "decode-ways",
    title: "Decode Ways",
    topics: ["Strings", "Dynamic Programming"],
    desc: "A message containing letters from A-Z can be encoded into numbers using 'A' -> '1' to 'Z' -> '26'. Given a string `s` containing only digits, return the number of ways to decode it.",
    constraints: ["1 <= s.length <= 100"],
    methodName: "numDecodings",
    params: ["s"],
    pub: [["12", 2], ["226", 3], ["06", 0]],
    hid: [["10", 1], ["27", 1]],
    ref: `function numDecodings(s) { if (!s || s[0] === '0') return 0; const n = s.length; const dp = new Array(n + 1).fill(0); dp[0] = 1; dp[1] = 1; for (let i = 2; i <= n; i++) { const one = Number(s.slice(i-1, i)); const two = Number(s.slice(i-2, i)); if (one >= 1) dp[i] += dp[i-1]; if (two >= 10 && two <= 26) dp[i] += dp[i-2]; } return dp[n]; }`
  },
  {
    slug: "house-robber",
    title: "House Robber",
    topics: ["Arrays", "Dynamic Programming"],
    desc: "You are a professional robber planning to rob houses along a street without triggering alarms (cannot rob two adjacent houses). Determine the maximum money you can rob.",
    constraints: ["1 <= nums.length <= 100"],
    methodName: "rob",
    params: ["nums"],
    pub: [[[1,2,3,1], 4], [[2,7,9,3,1], 12]],
    hid: [[[2,1,1,2], 4], [[0], 0]],
    ref: `function rob(nums) { let rob1 = 0, rob2 = 0; for (let n of nums) { const temp = Math.max(n + rob1, rob2); rob1 = rob2; rob2 = temp; } return rob2; }`
  },
  {
    slug: "house-robber-ii",
    title: "House Robber II",
    topics: ["Arrays", "Dynamic Programming"],
    desc: "All houses at this place are arranged in a circle. Return the maximum amount of money you can rob without alerting the police.",
    constraints: ["1 <= nums.length <= 100"],
    methodName: "robII",
    params: ["nums"],
    pub: [[[2,3,2], 3], [[1,2,3,1], 4]],
    hid: [[[1,2,3], 3], [[5], 5]],
    ref: `function robII(nums) { if (nums.length === 1) return nums[0]; const helper = arr => { let r1 = 0, r2 = 0; for (let n of arr) { const t = Math.max(n + r1, r2); r1 = r2; r2 = t; } return r2; }; return Math.max(helper(nums.slice(1)), helper(nums.slice(0, -1))); }`
  },
  {
    slug: "unique-paths",
    title: "Unique Paths",
    topics: ["Math", "Dynamic Programming", "Combinatorics"],
    desc: "A robot is located at the top-left corner of an `m x n` grid. It can only move down or right. How many possible unique paths are there to reach the bottom-right corner?",
    constraints: ["1 <= m, n <= 100"],
    methodName: "uniquePaths",
    params: ["m", "n"],
    pub: [[3, 7, 28], [3, 2, 3]],
    hid: [[1, 1, 1], [3, 3, 6]],
    ref: `function uniquePaths(m, n) { const dp = new Array(n).fill(1); for (let i = 1; i < m; i++) { for (let j = 1; j < n; j++) { dp[j] += dp[j - 1]; } } return dp[n - 1]; }`
  },
  {
    slug: "jump-game",
    title: "Jump Game",
    topics: ["Arrays", "Dynamic Programming", "Greedy"],
    desc: "You are given an integer array `nums`. You are initially positioned at the array's first index, and each element represents your maximum jump length. Return `true` if you can reach the last index.",
    constraints: ["1 <= nums.length <= 10^4"],
    methodName: "canJump",
    params: ["nums"],
    pub: [[[2,3,1,1,4], true], [[3,2,1,0,4], false]],
    hid: [[[0], true], [[2,0,0], true]],
    ref: `function canJump(nums) { let maxReach = 0; for (let i = 0; i < nums.length; i++) { if (i > maxReach) return false; maxReach = Math.max(maxReach, i + nums[i]); } return true; }`
  },
  {
    slug: "jump-game-ii",
    title: "Jump Game II",
    topics: ["Arrays", "Dynamic Programming", "Greedy"],
    desc: "Return the minimum number of jumps to reach the last index from the first index in `nums`.",
    constraints: ["1 <= nums.length <= 10^4"],
    methodName: "jump",
    params: ["nums"],
    pub: [[[2,3,1,1,4], 2], [[2,3,0,1,4], 2]],
    hid: [[[1,2,3], 2], [[0], 0]],
    ref: `function jump(nums) { let jumps = 0, curEnd = 0, curFarthest = 0; for (let i = 0; i < nums.length - 1; i++) { curFarthest = Math.max(curFarthest, i + nums[i]); if (i === curEnd) { jumps++; curEnd = curFarthest; } } return jumps; }`
  },
  {
    slug: "gas-station",
    title: "Gas Station",
    topics: ["Arrays", "Greedy"],
    desc: "Given two integer arrays `gas` and `cost`, return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1.",
    constraints: ["n == gas.length == cost.length", "1 <= n <= 10^5"],
    methodName: "canCompleteCircuit",
    params: ["gas", "cost"],
    pub: [[[1,2,3,4,5], [3,4,5,1,2], 3], [[2,3,4], [3,4,3], -1]],
    hid: [[[5,1,2,3,4], [4,4,1,5,1], 4]],
    ref: `function canCompleteCircuit(gas, cost) { let total = 0, curr = 0, start = 0; for (let i = 0; i < gas.length; i++) { total += gas[i] - cost[i]; curr += gas[i] - cost[i]; if (curr < 0) { start = i + 1; curr = 0; } } return total >= 0 ? start : -1; }`
  },
  {
    slug: "rotate-image",
    title: "Rotate Image",
    topics: ["Arrays", "Math", "Matrix"],
    desc: "You are given an `n x n` 2D matrix representing an image, rotate the image by 90 degrees (clockwise) in-place.",
    constraints: ["matrix.length == n", "1 <= n <= 20"],
    methodName: "rotate",
    params: ["matrix"],
    pub: [[[[1,2,3],[4,5,6],[7,8,9]], [[7,4,1],[8,5,2],[9,6,3]]]],
    hid: [[[[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]], [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]]],
    ref: `function rotate(matrix) { const n = matrix.length; for (let i = 0; i < n; i++) { for (let j = i; j < n; j++) { const t = matrix[i][j]; matrix[i][j] = matrix[j][i]; matrix[j][i] = t; } } for (let i = 0; i < n; i++) matrix[i].reverse(); return matrix; }`
  },
  {
    slug: "spiral-matrix",
    title: "Spiral Matrix",
    topics: ["Arrays", "Matrix", "Simulation"],
    desc: "Given an `m x n` matrix, return all elements of the matrix in spiral order.",
    constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 10"],
    methodName: "spiralOrder",
    params: ["matrix"],
    pub: [[[[1,2,3],[4,5,6],[7,8,9]], [1,2,3,6,9,8,7,4,5]]],
    hid: [[[[1,2,3,4],[5,6,7,8],[9,10,11,12]], [1,2,3,4,8,12,11,10,9,5,6,7]]],
    ref: `function spiralOrder(matrix) { const res = []; if (!matrix.length) return res; let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1; while (top <= bottom && left <= right) { for (let j = left; j <= right; j++) res.push(matrix[top][j]); top++; for (let i = top; i <= bottom; i++) res.push(matrix[i][right]); right--; if (top <= bottom) { for (let j = right; j >= left; j--) res.push(matrix[bottom][j]); bottom--; } if (left <= right) { for (let i = bottom; i >= top; i--) res.push(matrix[i][left]); left++; } } return res; }`
  },
  {
    slug: "set-matrix-zeroes",
    title: "Set Matrix Zeroes",
    topics: ["Arrays", "Hash Table", "Matrix"],
    desc: "Given an `m x n` integer matrix, if an element is 0, set its entire row and column to 0's in-place.",
    constraints: ["m == matrix.length", "n == matrix[0].length", "1 <= m, n <= 200"],
    methodName: "setZeroes",
    params: ["matrix"],
    pub: [[[[1,1,1],[1,0,1],[1,1,1]], [[1,0,1],[0,0,0],[1,0,1]]]],
    hid: [[[[0,1,2,0],[3,4,5,2],[1,3,1,5]], [[0,0,0,0],[0,4,5,0],[0,3,1,0]]]],
    ref: `function setZeroes(matrix) { const m = matrix.length, n = matrix[0].length; const r = new Set(), c = new Set(); for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (matrix[i][j] === 0) { r.add(i); c.add(j); } for (let i of r) for (let j = 0; j < n; j++) matrix[i][j] = 0; for (let j of c) for (let i = 0; i < m; i++) matrix[i][j] = 0; return matrix; }`
  },
  {
    slug: "number-of-islands",
    title: "Number of Islands",
    topics: ["Arrays", "DFS", "BFS", "Union Find", "Matrix"],
    desc: "Given an `m x n` 2D binary grid which represents a map of '1's (land) and '0's (water), return the number of islands.",
    constraints: ["m == grid.length", "n == grid[i].length", "1 <= m, n <= 300"],
    methodName: "numIslands",
    params: ["grid"],
    pub: [[[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]], 1]],
    hid: [[[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]], 3]],
    ref: `function numIslands(grid) { if (!grid.length) return 0; const m = grid.length, n = grid[0].length; let count = 0; function dfs(r, c) { if (r < 0 || c < 0 || r >= m || c >= n || grid[r][c] !== '1') return; grid[r][c] = '0'; dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1); } for (let i = 0; i < m; i++) { for (let j = 0; j < n; j++) { if (grid[i][j] === '1') { count++; dfs(i, j); } } } return count; }`
  },
  {
    slug: "daily-temperatures",
    title: "Daily Temperatures",
    topics: ["Arrays", "Stack", "Monotonic Stack"],
    desc: "Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the ith day to get a warmer temperature.",
    constraints: ["1 <= temperatures.length <= 10^5"],
    methodName: "dailyTemperatures",
    params: ["temperatures"],
    pub: [[[73,74,75,71,69,72,76,73], [1,1,4,2,1,1,0,0]], [[30,40,50,60], [1,1,1,0]]],
    hid: [[[30,60,90], [1,1,0]], [[90,80,70], [0,0,0]]],
    ref: `function dailyTemperatures(temperatures) { const n = temperatures.length, res = new Array(n).fill(0), st = []; for (let i = 0; i < n; i++) { while (st.length && temperatures[i] > temperatures[st[st.length - 1]]) { const prev = st.pop(); res[prev] = i - prev; } st.push(i); } return res; }`
  },
  {
    slug: "evaluate-reverse-polish-notation",
    title: "Evaluate Reverse Polish Notation",
    topics: ["Arrays", "Math", "Stack"],
    desc: "You are given an array of strings `tokens` that represents an arithmetic expression in a Reverse Polish Notation. Evaluate the expression and return an integer.",
    constraints: ["1 <= tokens.length <= 10^4"],
    methodName: "evalRPN",
    params: ["tokens"],
    pub: [[["2","1","+","3","*"], 9], [["4","13","5","/","+"], 6]],
    hid: [[["10","6","9","3","+","-11","*","/","*","17","+","5","+"], 22]],
    ref: `function evalRPN(tokens) { const st = []; for (let t of tokens) { if (t === '+') st.push(st.pop() + st.pop()); else if (t === '-') { const b = st.pop(), a = st.pop(); st.push(a - b); } else if (t === '*') st.push(st.pop() * st.pop()); else if (t === '/') { const b = st.pop(), a = st.pop(); st.push(Math.trunc(a / b)); } else st.push(Number(t)); } return st[0]; }`
  },
  {
    slug: "generate-parentheses",
    title: "Generate Parentheses",
    topics: ["Strings", "Dynamic Programming", "Backtracking"],
    desc: "Given `n` pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
    constraints: ["1 <= n <= 8"],
    methodName: "generateParenthesis",
    params: ["n"],
    pub: [[3, ["((()))","(()())","(())()","()(())","()()()"]], [1, ["()"]]],
    hid: [[2, ["(())","()()"]]],
    ref: `function generateParenthesis(n) { const res = []; function bt(cur, o, c) { if (cur.length === 2 * n) { res.push(cur); return; } if (o < n) bt(cur + '(', o + 1, c); if (c < o) bt(cur + ')', o, c + 1); } bt('', 0, 0); return res; }`
  },
  {
    slug: "search-a-2d-matrix",
    title: "Search a 2D Matrix",
    topics: ["Arrays", "Binary Search", "Matrix"],
    desc: "Write an efficient algorithm that searches for a value `target` in an `m x n` integer matrix where each row is sorted and the first integer of each row is greater than the last integer of previous row.",
    constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 100"],
    methodName: "searchMatrix",
    params: ["matrix", "target"],
    pub: [[[[1,3,5,7],[10,11,16,20],[23,30,34,60]], 3, true], [[[1,3,5,7],[10,11,16,20],[23,30,34,60]], 13, false]],
    hid: [[[[1]], 1, true], [[[1,1]], 2, false]],
    ref: `function searchMatrix(matrix, target) { const m = matrix.length, n = matrix[0].length; let l = 0, r = m * n - 1; while (l <= r) { const mid = Math.floor((l + r) / 2); const val = matrix[Math.floor(mid / n)][mid % n]; if (val === target) return true; if (val < target) l = mid + 1; else r = mid - 1; } return false; }`
  },
  {
    slug: "find-minimum-in-rotated-sorted-array",
    title: "Find Minimum in Rotated Sorted Array",
    topics: ["Arrays", "Binary Search"],
    desc: "Given the sorted rotated array `nums` of unique elements, return the minimum element of this array.",
    constraints: ["n == nums.length", "1 <= n <= 5000"],
    methodName: "findMin",
    params: ["nums"],
    pub: [[[3,4,5,1,2], 1], [[4,5,6,7,0,1,2], 0]],
    hid: [[[11,13,15,17], 11], [[1], 1], [[2,1], 1]],
    ref: `function findMin(nums) { let l = 0, r = nums.length - 1; while (l < r) { const m = Math.floor((l + r) / 2); if (nums[m] > nums[r]) l = m + 1; else r = m; } return nums[l]; }`
  },
  {
    slug: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    topics: ["Arrays", "Binary Search"],
    desc: "Given the array `nums` after the possible rotation and an integer `target`, return the index of `target` if it is in `nums`, or `-1` if it is not.",
    constraints: ["1 <= nums.length <= 5000"],
    methodName: "searchRotated",
    params: ["nums", "target"],
    pub: [[[4,5,6,7,0,1,2], 0, 4], [[4,5,6,7,0,1,2], 3, -1]],
    hid: [[[1], 0, -1], [[1], 1, 0], [[5,1,3], 5, 0]],
    ref: `function searchRotated(nums, target) { let l = 0, r = nums.length - 1; while (l <= r) { const m = Math.floor((l + r) / 2); if (nums[m] === target) return m; if (nums[l] <= nums[m]) { if (nums[l] <= target && target < nums[m]) r = m - 1; else l = m + 1; } else { if (nums[m] < target && target <= nums[r]) l = m + 1; else r = m - 1; } } return -1; }`
  },
  {
    slug: "koko-eating-bananas",
    title: "Koko Eating Bananas",
    topics: ["Arrays", "Binary Search"],
    desc: "Koko loves to eat bananas. Return the minimum integer `k` such that she can eat all the bananas within `h` hours.",
    constraints: ["1 <= piles.length <= 10^4", "piles.length <= h <= 10^9"],
    methodName: "minEatingSpeed",
    params: ["piles", "h"],
    pub: [[[3,6,7,11], 8, 4], [[30,11,23,4,20], 5, 30]],
    hid: [[[30,11,23,4,20], 6, 23], [[312884470], 312884469, 2]],
    ref: `function minEatingSpeed(piles, h) { let l = 1, r = Math.max(...piles); while (l < r) { const m = Math.floor((l + r) / 2); const hours = piles.reduce((acc, p) => acc + Math.ceil(p / m), 0); if (hours <= h) r = m; else l = m + 1; } return l; }`
  },
  {
    slug: "letter-combinations-of-a-phone-number",
    title: "Letter Combinations of a Phone Number",
    topics: ["Hash Table", "Strings", "Backtracking"],
    desc: "Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent.",
    constraints: ["0 <= digits.length <= 4"],
    methodName: "letterCombinations",
    params: ["digits"],
    pub: [["23", ["ad","ae","af","bd","be","bf","cd","ce","cf"]], ["", []]],
    hid: [["2", ["a","b","c"]]],
    ref: `function letterCombinations(digits) { if (!digits) return []; const map = {'2':'abc','3':'def','4':'ghi','5':'jkl','6':'mno','7':'pqrs','8':'tuv','9':'wxyz'}; const res = []; function bt(idx, cur) { if (idx === digits.length) { res.push(cur); return; } for (let c of map[digits[idx]]) bt(idx + 1, cur + c); } bt(0, ''); return res; }`
  },
  {
    slug: "combination-sum",
    title: "Combination Sum",
    topics: ["Arrays", "Backtracking"],
    desc: "Given an array of distinct integers `candidates` and a target integer `target`, return a list of all unique combinations of `candidates` where the chosen numbers sum to `target`.",
    constraints: ["1 <= candidates.length <= 30", "2 <= target <= 40"],
    methodName: "combinationSum",
    params: ["candidates", "target"],
    pub: [[[2,3,6,7], 7, [[2,2,3],[7]]], [[2,3,5], 8, [[2,2,2,2],[2,3,3],[3,5]]]],
    hid: [[[2], 1, []]],
    ref: `function combinationSum(candidates, target) { const res = []; function bt(idx, rem, cur) { if (rem === 0) { res.push([...cur]); return; } if (rem < 0 || idx === candidates.length) return; cur.push(candidates[idx]); bt(idx, rem - candidates[idx], cur); cur.pop(); bt(idx + 1, rem, cur); } bt(0, target, []); return res; }`
  },
  {
    slug: "permutations",
    title: "Permutations",
    topics: ["Arrays", "Backtracking"],
    desc: "Given an array `nums` of distinct integers, return all the possible permutations in any order.",
    constraints: ["1 <= nums.length <= 6"],
    methodName: "permute",
    params: ["nums"],
    pub: [[[1,2,3], [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]], [[0,1], [[0,1],[1,0]]]],
    hid: [[[1], [[1]]]],
    ref: `function permute(nums) { const res = []; function bt(cur, used) { if (cur.length === nums.length) { res.push([...cur]); return; } for (let i = 0; i < nums.length; i++) { if (used[i]) continue; used[i] = true; cur.push(nums[i]); bt(cur, used); cur.pop(); used[i] = false; } } bt([], []); return res; }`
  },
  {
    slug: "subsets",
    title: "Subsets",
    topics: ["Arrays", "Backtracking", "Bit Manipulation"],
    desc: "Given an integer array `nums` of unique elements, return all possible subsets (the power set).",
    constraints: ["1 <= nums.length <= 10"],
    methodName: "subsets",
    params: ["nums"],
    pub: [[[1,2,3], [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]], [[0], [[],[0]]]],
    hid: [[[1,2], [[],[1],[2],[1,2]]]],
    ref: `function subsets(nums) { const res = [[]]; for (let n of nums) { const len = res.length; for (let i = 0; i < len; i++) res.push([...res[i], n]); } return res; }`
  },
  {
    slug: "word-search",
    title: "Word Search",
    topics: ["Arrays", "Strings", "Backtracking", "Matrix"],
    desc: "Given an `m x n` grid of characters `board` and a string `word`, return `true` if `word` exists in the grid.",
    constraints: ["m == board.length", "n = board[i].length", "1 <= word.length <= 15"],
    methodName: "exist",
    params: ["board", "word"],
    pub: [[[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED", true], [[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "SEE", true]],
    hid: [[[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCB", false]],
    ref: `function exist(board, word) { const m = board.length, n = board[0].length; function dfs(r, c, idx) { if (idx === word.length) return true; if (r < 0 || c < 0 || r >= m || c >= n || board[r][c] !== word[idx]) return false; const t = board[r][c]; board[r][c] = '#'; const found = dfs(r+1,c,idx+1) || dfs(r-1,c,idx+1) || dfs(r,c+1,idx+1) || dfs(r,c-1,idx+1); board[r][c] = t; return found; } for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (dfs(i, j, 0)) return true; return false; }`
  },
  {
    slug: "find-all-anagrams-in-a-string",
    title: "Find All Anagrams in a String",
    topics: ["Hash Table", "Strings", "Sliding Window"],
    desc: "Given two strings `s` and `p`, return an array of all the start indices of `p`'s anagrams in `s`.",
    constraints: ["1 <= s.length, p.length <= 3 * 10^4"],
    methodName: "findAnagrams",
    params: ["s", "p"],
    pub: [["cbaebabacd", "abc", [0, 6]], ["abab", "ab", [0, 1, 2]]],
    hid: [["aaaaaaaaaa", "aaaaaaaaaaaaa", []]],
    ref: `function findAnagrams(s, p) { const res = []; if (s.length < p.length) return res; const pCount = {}, sCount = {}; for (let c of p) pCount[c] = (pCount[c] || 0) + 1; const k = p.length; for (let i = 0; i < k; i++) sCount[s[i]] = (sCount[s[i]] || 0) + 1; const isMatch = () => { for (let key in pCount) if (pCount[key] !== sCount[key]) return false; for (let key in sCount) if (pCount[key] !== sCount[key]) return false; return true; }; if (isMatch()) res.push(0); for (let i = k; i < s.length; i++) { sCount[s[i]] = (sCount[s[i]] || 0) + 1; sCount[s[i-k]]--; if (sCount[s[i-k]] === 0) delete sCount[s[i-k]]; if (isMatch()) res.push(i - k + 1); } return res; }`
  },
  {
    slug: "longest-repeating-character-replacement",
    title: "Longest Repeating Character Replacement",
    topics: ["Hash Table", "Strings", "Sliding Window"],
    desc: "You are given a string `s` and an integer `k`. You can choose any character of the string and change it to any other uppercase English character at most `k` times. Return the length of the longest substring containing the same letter you can get after performing above operations.",
    constraints: ["1 <= s.length <= 10^5", "0 <= k <= s.length"],
    methodName: "characterReplacement",
    params: ["s", "k"],
    pub: [["ABAB", 2, 4], ["AABABBA", 1, 4]],
    hid: [["AAAA", 2, 4], ["ABBB", 2, 4]],
    ref: `function characterReplacement(s, k) { const count = {}; let l = 0, maxCount = 0, maxLen = 0; for (let r = 0; r < s.length; r++) { count[s[r]] = (count[s[r]] || 0) + 1; maxCount = Math.max(maxCount, count[s[r]]); while ((r - l + 1) - maxCount > k) { count[s[l]]--; l++; } maxLen = Math.max(maxLen, r - l + 1); } return maxLen; }`
  },
  {
    slug: "permutation-in-string",
    title: "Permutation in String",
    topics: ["Hash Table", "Two Pointers", "Strings", "Sliding Window"],
    desc: "Given two strings `s1` and `s2`, return `true` if `s2` contains a permutation of `s1`, or `false` otherwise.",
    constraints: ["1 <= s1.length, s2.length <= 10^4"],
    methodName: "checkInclusion",
    params: ["s1", "s2"],
    pub: [["ab", "eidbaooo", true], ["ab", "eidboaoo", false]],
    hid: [["adc", "dcda", true]],
    ref: `function checkInclusion(s1, s2) { if (s1.length > s2.length) return false; const c1 = new Array(26).fill(0), c2 = new Array(26).fill(0); const code = c => c.charCodeAt(0) - 97; for (let i = 0; i < s1.length; i++) { c1[code(s1[i])]++; c2[code(s2[i])]++; } const match = () => c1.every((v, i) => v === c2[i]); if (match()) return true; for (let i = s1.length; i < s2.length; i++) { c2[code(s2[i])]++; c2[code(s2[i - s1.length])]--; if (match()) return true; } return false; }`
  },
  {
    slug: "minimum-size-subarray-sum",
    title: "Minimum Size Subarray Sum",
    topics: ["Arrays", "Binary Search", "Sliding Window", "Prefix Sum"],
    desc: "Given an array of positive integers `nums` and a positive integer `target`, return the minimal length of a subarray whose sum is greater than or equal to `target`. If there is no such subarray, return 0.",
    constraints: ["1 <= target <= 10^9", "1 <= nums.length <= 10^5"],
    methodName: "minSubArrayLen",
    params: ["target", "nums"],
    pub: [[7, [2,3,1,2,4,3], 2], [4, [1,4,4], 1]],
    hid: [[11, [1,1,1,1,1,1,1,1], 0], [15, [1,2,3,4,5], 5]],
    ref: `function minSubArrayLen(target, nums) { let l = 0, sum = 0, min = Infinity; for (let r = 0; r < nums.length; r++) { sum += nums[r]; while (sum >= target) { min = Math.min(min, r - l + 1); sum -= nums[l++]; } } return min === Infinity ? 0 : min; }`
  },
  {
    slug: "target-sum",
    title: "Target Sum",
    topics: ["Arrays", "Dynamic Programming", "Backtracking"],
    desc: "You are given an integer array `nums` and an integer `target`. Build an expression out of nums by adding one of the symbols '+' and '-' before each integer in nums and then concatenate all the integers. Return the number of different expressions that you can build, which evaluates to `target`.",
    constraints: ["1 <= nums.length <= 20", "0 <= sum(nums[i]) <= 1000"],
    methodName: "findTargetSumWays",
    params: ["nums", "target"],
    pub: [[[1,1,1,1,1], 3, 5], [[1], 1, 1]],
    hid: [[[1,0], 1, 2], [[0,0,0,0,0,0,0,0,1], 1, 256]],
    ref: `function findTargetSumWays(nums, target) { let memo = {}; function dp(idx, cur) { const key = idx + ',' + cur; if (key in memo) return memo[key]; if (idx === nums.length) return cur === target ? 1 : 0; const res = dp(idx + 1, cur + nums[idx]) + dp(idx + 1, cur - nums[idx]); memo[key] = res; return res; } return dp(0, 0); }`
  },
  {
    slug: "word-break",
    title: "Word Break",
    topics: ["Hash Table", "Strings", "Dynamic Programming", "Trie"],
    desc: "Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.",
    constraints: ["1 <= s.length <= 300", "1 <= wordDict.length <= 1000"],
    methodName: "wordBreak",
    params: ["s", "wordDict"],
    pub: [["leetcode", ["leet","code"], true], ["applepenapple", ["apple","pen"], true]],
    hid: [["catsandog", ["cats","dog","sand","and","cat"], false]],
    ref: `function wordBreak(s, wordDict) { const dict = new Set(wordDict); const dp = new Array(s.length + 1).fill(false); dp[0] = true; for (let i = 1; i <= s.length; i++) { for (let j = 0; j < i; j++) { if (dp[j] && dict.has(s.slice(j, i))) { dp[i] = true; break; } } } return dp[s.length]; }`
  },
  {
    slug: "partition-equal-subset-sum",
    title: "Partition Equal Subset Sum",
    topics: ["Arrays", "Dynamic Programming"],
    desc: "Given an integer array `nums`, return `true` if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or `false` otherwise.",
    constraints: ["1 <= nums.length <= 200", "1 <= nums[i] <= 100"],
    methodName: "canPartition",
    params: ["nums"],
    pub: [[[1,5,11,5], true], [[1,2,3,5], false]],
    hid: [[[1,1], true], [[2,2,3,5], false]],
    ref: `function canPartition(nums) { const sum = nums.reduce((a, b) => a + b, 0); if (sum % 2 !== 0) return false; const target = sum / 2; let dp = new Set([0]); for (let n of nums) { const next = new Set(dp); for (let t of dp) { if (t + n === target) return true; if (t + n < target) next.add(t + n); } dp = next; } return dp.has(target); }`
  },
  {
    slug: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence",
    topics: ["Arrays", "Binary Search", "Dynamic Programming"],
    desc: "Given an integer array `nums`, return the length of the longest strictly increasing subsequence.",
    constraints: ["1 <= nums.length <= 2500"],
    methodName: "lengthOfLIS",
    params: ["nums"],
    pub: [[[10,9,2,5,3,7,101,18], 4], [[0,1,0,3,2,3], 4]],
    hid: [[[7,7,7,7,7,7,7], 1], [[1,3,6,7,9,4,10,5,6], 6]],
    ref: `function lengthOfLIS(nums) { const tails = []; for (let x of nums) { let l = 0, r = tails.length; while (l < r) { const m = Math.floor((l + r) / 2); if (tails[m] < x) l = m + 1; else r = m; } tails[l] = x; } return tails.length; }`
  },
  {
    slug: "maximum-product-subarray",
    title: "Maximum Product Subarray",
    topics: ["Arrays", "Dynamic Programming"],
    desc: "Given an integer array `nums`, find a subarray that has the largest product, and return the product.",
    constraints: ["1 <= nums.length <= 2 * 10^4"],
    methodName: "maxProduct",
    params: ["nums"],
    pub: [[[2,3,-2,4], 6], [[-2,0,-1], 0]],
    hid: [[[-2,3,-4], 24], [[0,2], 2]],
    ref: `function maxProduct(nums) { let max = nums[0], min = nums[0], res = nums[0]; for (let i = 1; i < nums.length; i++) { const n = nums[i]; if (n < 0) { const t = max; max = min; min = t; } max = Math.max(n, max * n); min = Math.min(n, min * n); res = Math.max(res, max); } return res; }`
  },
  {
    slug: "kth-largest-element-in-an-array",
    title: "Kth Largest Element in an Array",
    topics: ["Arrays", "Divide and Conquer", "Sorting", "Heap", "Quickselect"],
    desc: "Given an integer array `nums` and an integer `k`, return the `k`th largest element in the array.",
    constraints: ["1 <= k <= nums.length <= 10^5"],
    methodName: "findKthLargest",
    params: ["nums", "k"],
    pub: [[[3,2,1,5,6,4], 2, 5], [[3,2,3,1,2,4,5,5,6], 4, 4]],
    hid: [[[1], 1, 1], [[7,6,5,4,3,2,1], 5, 3]],
    ref: `function findKthLargest(nums, k) { nums.sort((a, b) => b - a); return nums[k - 1]; }`
  },
  {
    slug: "sort-colors",
    title: "Sort Colors",
    topics: ["Arrays", "Two Pointers", "Sorting"],
    desc: "Given an array `nums` with `n` objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with colors in order red (0), white (1), and blue (2).",
    constraints: ["n == nums.length", "1 <= n <= 300"],
    methodName: "sortColors",
    params: ["nums"],
    pub: [[[2,0,2,1,1,0], [0,0,1,1,2,2]], [[2,0,1], [0,1,2]]],
    hid: [[[0], [0]], [[1], [1]]],
    ref: `function sortColors(nums) { let l = 0, cur = 0, r = nums.length - 1; while (cur <= r) { if (nums[cur] === 0) { const t = nums[l]; nums[l] = nums[cur]; nums[cur] = t; l++; cur++; } else if (nums[cur] === 2) { const t = nums[r]; nums[r] = nums[cur]; nums[cur] = t; r--; } else cur++; } return nums; }`
  },
  {
    slug: "next-permutation",
    title: "Next Permutation",
    topics: ["Arrays", "Two Pointers"],
    desc: "A permutation of an array of integers is an arrangement of its members into a sequence or linear order. Find the next lexicographical permutation of `nums` in-place.",
    constraints: ["1 <= nums.length <= 100"],
    methodName: "nextPermutation",
    params: ["nums"],
    pub: [[[1,2,3], [1,3,2]], [[3,2,1], [1,2,3]]],
    hid: [[[1,1,5], [1,5,1]], [[1], [1]]],
    ref: `function nextPermutation(nums) { let i = nums.length - 2; while (i >= 0 && nums[i] >= nums[i+1]) i--; if (i >= 0) { let j = nums.length - 1; while (nums[j] <= nums[i]) j--; const t = nums[i]; nums[i] = nums[j]; nums[j] = t; } let l = i + 1, r = nums.length - 1; while (l < r) { const t = nums[l]; nums[l] = nums[r]; nums[r] = t; l++; r--; } return nums; }`
  },
  {
    slug: "non-overlapping-intervals",
    title: "Non-overlapping Intervals",
    topics: ["Arrays", "Dynamic Programming", "Greedy", "Sorting"],
    desc: "Given an array of intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.",
    constraints: ["1 <= intervals.length <= 10^5"],
    methodName: "eraseOverlapIntervals",
    params: ["intervals"],
    pub: [[[[1,2],[2,3],[3,4],[1,3]], 1], [[[1,2],[1,2],[1,2]], 2]],
    hid: [[[[1,2],[2,3]], 0]],
    ref: `function eraseOverlapIntervals(intervals) { intervals.sort((a, b) => a[1] - b[1]); let count = 0, prevEnd = -Infinity; for (let [s, e] of intervals) { if (s >= prevEnd) prevEnd = e; else count++; } return count; }`
  },
  {
    slug: "merge-intervals",
    title: "Merge Intervals",
    topics: ["Arrays", "Sorting"],
    desc: "Given an array of `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
    constraints: ["1 <= intervals.length <= 10^4"],
    methodName: "mergeIntervals",
    params: ["intervals"],
    pub: [[[[1,3],[2,6],[8,10],[15,18]], [[1,6],[8,10],[15,18]]], [[[1,4],[4,5]], [[1,5]]]],
    hid: [[[[1,4],[0,4]], [[0,4]]], [[[1,4],[2,3]], [[1,4]]]],
    ref: `function mergeIntervals(intervals) { intervals.sort((a, b) => a[0] - b[0]); const res = [intervals[0]]; for (let i = 1; i < intervals.length; i++) { const last = res[res.length - 1]; if (intervals[i][0] <= last[1]) last[1] = Math.max(last[1], intervals[i][1]); else res.push(intervals[i]); } return res; }`
  },
  {
    slug: "insert-interval",
    title: "Insert Interval",
    topics: ["Arrays"],
    desc: "You are given an array of non-overlapping intervals `intervals` sorted by `start_i`. Insert `newInterval` into `intervals` such that `intervals` is still sorted and non-overlapping.",
    constraints: ["0 <= intervals.length <= 10^4"],
    methodName: "insert",
    params: ["intervals", "newInterval"],
    pub: [[[[1,3],[6,9]], [2,5], [[1,5],[6,9]]], [[[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8], [[1,2],[3,10],[12,16]]]],
    hid: [[[], [5,7], [[5,7]]]],
    ref: `function insert(intervals, newInterval) { const res = []; let i = 0, n = intervals.length; while (i < n && intervals[i][1] < newInterval[0]) res.push(intervals[i++]); while (i < n && intervals[i][0] <= newInterval[1]) { newInterval[0] = Math.min(newInterval[0], intervals[i][0]); newInterval[1] = Math.max(newInterval[1], intervals[i][1]); i++; } res.push(newInterval); while (i < n) res.push(intervals[i++]); return res; }`
  }
];

// Build 50 Medium
mediumDefs.forEach((d, idx) => {
  PROBLEMS.push(createProblem({
    id: 50 + idx + 1,
    slug: d.slug,
    title: d.title,
    difficulty: "MEDIUM",
    topics: d.topics,
    description: d.desc,
    constraints: d.constraints,
    methodName: d.methodName,
    params: d.params,
    returnType: "any",
    publicTestCases: d.pub,
    hiddenTestCases: d.hid,
    referenceSolution: d.ref
  }));
});

// ==========================================
// 50 HARD PROBLEMS (101 to 150)
// ==========================================
const hardDefs = [
  {
    slug: "trapping-rain-water",
    title: "Trapping Rain Water",
    topics: ["Arrays", "Two Pointers", "Dynamic Programming", "Stack"],
    desc: "Given `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
    constraints: ["n == height.length", "1 <= n <= 2 * 10^4", "0 <= height[i] <= 10^5"],
    methodName: "trap",
    params: ["height"],
    pub: [[[0,1,0,2,1,0,1,3,2,1,2,1], 6], [[4,2,0,3,2,5], 9]],
    hid: [[[1,2,3,4,5], 0], [[5,4,3,2,1], 0], [[3,0,2,0,4], 7]],
    ref: `function trap(height) { let l = 0, r = height.length - 1, maxL = 0, maxR = 0, res = 0; while (l < r) { if (height[l] < height[r]) { if (height[l] >= maxL) maxL = height[l]; else res += maxL - height[l]; l++; } else { if (height[r] >= maxR) maxR = height[r]; else res += maxR - height[r]; r--; } } return res; }`
  },
  {
    slug: "median-of-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    topics: ["Arrays", "Binary Search", "Divide and Conquer"],
    desc: "Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays in O(log(m+n)) runtime.",
    constraints: ["0 <= m, n <= 1000", "1 <= m + n <= 2000"],
    methodName: "findMedianSortedArrays",
    params: ["nums1", "nums2"],
    pub: [[[1,3], [2], 2.0], [[1,2], [3,4], 2.5]],
    hid: [[[0,0], [0,0], 0.0], [[], [1], 1.0]],
    ref: `function findMedianSortedArrays(nums1, nums2) { const merged = [...nums1, ...nums2].sort((a, b) => a - b); const len = merged.length; if (len % 2 === 1) return merged[Math.floor(len / 2)]; return (merged[len/2 - 1] + merged[len/2]) / 2; }`
  },
  {
    slug: "merge-k-sorted-lists",
    title: "Merge k Sorted Lists",
    topics: ["Linked List", "Divide and Conquer", "Heap"],
    desc: "You are given an array of `k` linked-lists `lists`, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
    constraints: ["k == lists.length", "0 <= k <= 10^4", "0 <= lists[i].length <= 500"],
    methodName: "mergeKLists",
    params: ["lists"],
    pub: [[[[1,4,5],[1,3,4],[2,6]], [1,1,2,3,4,4,5,6]], [[], []]],
    hid: [[ [[]], [] ], [[[1]], [1]]],
    ref: `function mergeKLists(lists) { const res = []; for (let l of lists) for (let x of l) res.push(x); return res.sort((a, b) => a - b); }`
  },
  {
    slug: "first-missing-positive",
    title: "First Missing Positive",
    topics: ["Arrays", "Hash Table"],
    desc: "Given an unsorted integer array `nums`, return the smallest positive integer that is not present in `nums` in O(n) time and O(1) auxiliary space.",
    constraints: ["1 <= nums.length <= 10^5", "-2^31 <= nums[i] <= 2^31 - 1"],
    methodName: "firstMissingPositive",
    params: ["nums"],
    pub: [[[1,2,0], 3], [[3,4,-1,1], 2]],
    hid: [[[7,8,9,11,12], 1], [[1], 2], [[2], 1]],
    ref: `function firstMissingPositive(nums) { const set = new Set(nums); let i = 1; while (set.has(i)) i++; return i; }`
  },
  {
    slug: "wildcard-matching",
    title: "Wildcard Matching",
    topics: ["Strings", "Dynamic Programming", "Greedy", "Recursion"],
    desc: "Given an input string (`s`) and a pattern (`p`), implement wildcard pattern matching with support for '?' (matches any single character) and '*' (matches any sequence of characters including empty).",
    constraints: ["0 <= s.length, p.length <= 2000"],
    methodName: "isMatch",
    params: ["s", "p"],
    pub: [["aa", "a", false], ["aa", "*", true], ["cb", "?a", false]],
    hid: [["adceb", "*a*b", true], ["acdcb", "a*c?b", false]],
    ref: `function isMatch(s, p) { const m = s.length, n = p.length; const dp = Array.from({length: m + 1}, () => new Array(n + 1).fill(false)); dp[0][0] = true; for (let j = 1; j <= n; j++) { if (p[j-1] === '*') dp[0][j] = dp[0][j-1]; } for (let i = 1; i <= m; i++) { for (let j = 1; j <= n; j++) { if (p[j-1] === '?' || s[i-1] === p[j-1]) dp[i][j] = dp[i-1][j-1]; else if (p[j-1] === '*') dp[i][j] = dp[i-1][j] || dp[i][j-1]; } } return dp[m][n]; }`
  },
  {
    slug: "n-queens",
    title: "N-Queens",
    topics: ["Arrays", "Backtracking"],
    desc: "The n-queens puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other. Return all distinct solutions.",
    constraints: ["1 <= n <= 9"],
    methodName: "solveNQueens",
    params: ["n"],
    pub: [[4, [[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]], [1, [["Q"]]]],
    hid: [[2, []], [3, []]],
    ref: `function solveNQueens(n) { const res = []; const cols = new Set(), posDiag = new Set(), negDiag = new Set(); const board = Array.from({length: n}, () => new Array(n).fill('.')); function bt(r) { if (r === n) { res.push(board.map(row => row.join(''))); return; } for (let c = 0; c < n; c++) { if (cols.has(c) || posDiag.has(r + c) || negDiag.has(r - c)) continue; cols.add(c); posDiag.add(r + c); negDiag.add(r - c); board[r][c] = 'Q'; bt(r + 1); cols.delete(c); posDiag.delete(r + c); negDiag.delete(r - c); board[r][c] = '.'; } } bt(0); return res; }`
  },
  {
    slug: "edit-distance",
    title: "Edit Distance",
    topics: ["Strings", "Dynamic Programming"],
    desc: "Given two strings `word1` and `word2`, return the minimum number of operations required to convert `word1` to `word2` (insert, delete, or replace character).",
    constraints: ["0 <= word1.length, word2.length <= 500"],
    methodName: "minDistance",
    params: ["word1", "word2"],
    pub: [["horse", "ros", 3], ["intention", "execution", 5]],
    hid: [["", "", 0], ["a", "", 1], ["", "abc", 3]],
    ref: `function minDistance(word1, word2) { const m = word1.length, n = word2.length; const dp = Array.from({length: m + 1}, () => new Array(n + 1).fill(0)); for (let i = 0; i <= m; i++) dp[i][0] = i; for (let j = 0; j <= n; j++) dp[0][j] = j; for (let i = 1; i <= m; i++) { for (let j = 1; j <= n; j++) { if (word1[i-1] === word2[j-1]) dp[i][j] = dp[i-1][j-1]; else dp[i][j] = 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]); } } return dp[m][n]; }`
  },
  {
    slug: "largest-rectangle-in-histogram",
    title: "Largest Rectangle in Histogram",
    topics: ["Arrays", "Stack", "Monotonic Stack"],
    desc: "Given an array of integers `heights` representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
    constraints: ["1 <= heights.length <= 10^5", "0 <= heights[i] <= 10^4"],
    methodName: "largestRectangleArea",
    params: ["heights"],
    pub: [[[2,1,5,6,2,3], 10], [[2,4], 4]],
    hid: [[[1], 1], [[2,1,2], 3], [[5,5,5,5], 20]],
    ref: `function largestRectangleArea(heights) { const st = []; let maxArea = 0; const h = [...heights, 0]; for (let i = 0; i < h.length; i++) { while (st.length && h[i] < h[st[st.length - 1]]) { const height = h[st.pop()]; const width = st.length === 0 ? i : i - st[st.length - 1] - 1; maxArea = Math.max(maxArea, height * width); } st.push(i); } return maxArea; }`
  },
  {
    slug: "sliding-window-maximum",
    title: "Sliding Window Maximum",
    topics: ["Arrays", "Queue", "Sliding Window", "Heap", "Monotonic Queue"],
    desc: "You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. Return the max sliding window.",
    constraints: ["1 <= nums.length <= 10^5", "1 <= k <= nums.length"],
    methodName: "maxSlidingWindow",
    params: ["nums", "k"],
    pub: [[[1,3,-1,-3,5,3,6,7], 3, [3,3,5,5,6,7]], [[1], 1, [1]]],
    hid: [[[1,-1], 1, [1,-1]], [[9,11], 2, [11]]],
    ref: `function maxSlidingWindow(nums, k) { const deque = [], res = []; for (let i = 0; i < nums.length; i++) { if (deque.length && deque[0] < i - k + 1) deque.shift(); while (deque.length && nums[deque[deque.length - 1]] < nums[i]) deque.pop(); deque.push(i); if (i >= k - 1) res.push(nums[deque[0]]); } return res; }`
  },
  {
    slug: "minimum-window-substring",
    title: "Minimum Window Substring",
    topics: ["Hash Table", "Strings", "Sliding Window"],
    desc: "Given two strings `s` and `t` of lengths `m` and `n` respectively, return the minimum window substring of `s` such that every character in `t` (including duplicates) is included in the window.",
    constraints: ["m == s.length", "n == t.length", "1 <= m, n <= 10^5"],
    methodName: "minWindow",
    params: ["s", "t"],
    pub: [["ADOBECODEBANC", "ABC", "BANC"], ["a", "a", "a"]],
    hid: [["a", "aa", ""], ["ab", "b", "b"]],
    ref: `function minWindow(s, t) { if (!s || !t || s.length < t.length) return ''; const target = {}; for (let c of t) target[c] = (target[c] || 0) + 1; let req = Object.keys(target).length, formed = 0; const window = {}; let l = 0, minLen = Infinity, minStart = 0; for (let r = 0; r < s.length; r++) { const c = s[r]; window[c] = (window[c] || 0) + 1; if (target[c] && window[c] === target[c]) formed++; while (l <= r && formed === req) { if (r - l + 1 < minLen) { minLen = r - l + 1; minStart = l; } const leftC = s[l]; window[leftC]--; if (target[leftC] && window[leftC] < target[leftC]) formed--; l++; } } return minLen === Infinity ? '' : s.slice(minStart, minStart + minLen); }`
  },
  {
    slug: "regular-expression-matching",
    title: "Regular Expression Matching",
    topics: ["Strings", "Dynamic Programming", "Recursion"],
    desc: "Given an input string `s` and a pattern `p`, implement regular expression matching with support for '.' and '*' where '.' matches any single character and '*' matches zero or more of the preceding element.",
    constraints: ["1 <= s.length <= 20", "1 <= p.length <= 20"],
    methodName: "isMatchRegex",
    params: ["s", "p"],
    pub: [["aa", "a", false], ["aa", "a*", true], ["ab", ".*", true]],
    hid: [["aab", "c*a*b", true], ["mississippi", "mis*is*p*.", false]],
    ref: `function isMatchRegex(s, p) { const m = s.length, n = p.length; const dp = Array.from({length: m + 1}, () => new Array(n + 1).fill(false)); dp[0][0] = true; for (let j = 2; j <= n; j += 2) { if (p[j-1] === '*') dp[0][j] = dp[0][j-2]; } for (let i = 1; i <= m; i++) { for (let j = 1; j <= n; j++) { if (p[j-1] === '.' || p[j-1] === s[i-1]) dp[i][j] = dp[i-1][j-1]; else if (p[j-1] === '*') { dp[i][j] = dp[i][j-2]; if (p[j-2] === '.' || p[j-2] === s[i-1]) dp[i][j] = dp[i][j] || dp[i-1][j]; } } } return dp[m][n]; }`
  },
  {
    slug: "maximal-rectangle",
    title: "Maximal Rectangle",
    topics: ["Arrays", "Dynamic Programming", "Stack", "Matrix", "Monotonic Stack"],
    desc: "Given a `rows x cols` binary `matrix` filled with 0's and 1's, find the largest rectangle containing only 1's and return its area.",
    constraints: ["rows == matrix.length", "cols == matrix[i].length", "1 <= row, cols <= 200"],
    methodName: "maximalRectangle",
    params: ["matrix"],
    pub: [[[["1","0","1","0","0"],["1","0","1","1","1"],["1","1","1","1","1"],["1","0","0","1","0"]], 6]],
    hid: [[[["0"]], 0], [[["1"]], 1]],
    ref: `function maximalRectangle(matrix) { if (!matrix.length || !matrix[0].length) return 0; const n = matrix[0].length; const heights = new Array(n).fill(0); let maxArea = 0; for (let row of matrix) { for (let i = 0; i < n; i++) heights[i] = row[i] === '1' ? heights[i] + 1 : 0; const st = []; const h = [...heights, 0]; for (let i = 0; i < h.length; i++) { while (st.length && h[i] < h[st[st.length - 1]]) { const height = h[st.pop()]; const width = st.length === 0 ? i : i - st[st.length - 1] - 1; maxArea = Math.max(maxArea, height * width); } st.push(i); } } return maxArea; }`
  },
  {
    slug: "longest-valid-parentheses",
    title: "Longest Valid Parentheses",
    topics: ["Strings", "Dynamic Programming", "Stack"],
    desc: "Given a string containing just the characters '(' and ')', return the length of the longest valid (well-formed) parentheses substring.",
    constraints: ["0 <= s.length <= 3 * 10^4"],
    methodName: "longestValidParentheses",
    params: ["s"],
    pub: [["(()", 2], [")()())", 4], ["", 0]],
    hid: [["()(()", 2], ["(()())", 6]],
    ref: `function longestValidParentheses(s) { const st = [-1]; let max = 0; for (let i = 0; i < s.length; i++) { if (s[i] === '(') st.push(i); else { st.pop(); if (st.length === 0) st.push(i); else max = Math.max(max, i - st[st.length - 1]); } } return max; }`
  },
  {
    slug: "burst-balloons",
    title: "Burst Balloons",
    topics: ["Arrays", "Dynamic Programming"],
    desc: "You are given `n` balloons, indexed from 0 to `n - 1`. Each balloon is painted with a number on it represented by an array `nums`. If you burst the ith balloon, you get `nums[i - 1] * nums[i] * nums[i + 1]` coins. Return the maximum coins you can collect.",
    constraints: ["n == nums.length", "1 <= n <= 300", "0 <= nums[i] <= 100"],
    methodName: "maxCoins",
    params: ["nums"],
    pub: [[[3,1,5,8], 167], [[1,5], 10]],
    hid: [[[7], 7], [[1,2,3], 12]],
    ref: `function maxCoins(nums) { const arr = [1, ...nums, 1]; const n = arr.length; const dp = Array.from({length: n}, () => new Array(n).fill(0)); for (let len = 2; len < n; len++) { for (let l = 0; l < n - len; l++) { const r = l + len; for (let k = l + 1; k < r; k++) { dp[l][r] = Math.max(dp[l][r], dp[l][k] + dp[k][r] + arr[l] * arr[k] * arr[r]); } } } return dp[0][n - 1]; }`
  },
  {
    slug: "distinct-subsequences",
    title: "Distinct Subsequences",
    topics: ["Strings", "Dynamic Programming"],
    desc: "Given two strings `s` and `t`, return the number of distinct subsequences of `s` which equals `t`.",
    constraints: ["1 <= s.length, t.length <= 1000"],
    methodName: "numDistinct",
    params: ["s", "t"],
    pub: [["rabbbit", "rabbit", 3], ["babgbag", "bag", 5]],
    hid: [["a", "b", 0], ["aaa", "a", 3]],
    ref: `function numDistinct(s, t) { const m = s.length, n = t.length; const dp = Array.from({length: m + 1}, () => new Array(n + 1).fill(0)); for (let i = 0; i <= m; i++) dp[i][0] = 1; for (let i = 1; i <= m; i++) { for (let j = 1; j <= n; j++) { dp[i][j] = dp[i-1][j] + (s[i-1] === t[j-1] ? dp[i-1][j-1] : 0); } } return dp[m][n]; }`
  },
  {
    slug: "russian-doll-envelopes",
    title: "Russian Doll Envelopes",
    topics: ["Arrays", "Binary Search", "Dynamic Programming", "Sorting"],
    desc: "You are given a 2D array of integers `envelopes` where `envelopes[i] = [w_i, h_i]` represents width and height. Return the maximum number of envelopes you can Russian doll (put one inside another).",
    constraints: ["1 <= envelopes.length <= 10^5"],
    methodName: "maxEnvelopes",
    params: ["envelopes"],
    pub: [[[[5,4],[6,4],[6,7],[2,3]], 3], [[[1,1],[1,1],[1,1]], 1]],
    hid: [[[[4,5],[4,6],[6,7],[2,3],[1,1]], 4]],
    ref: `function maxEnvelopes(envelopes) { envelopes.sort((a, b) => a[0] === b[0] ? b[1] - a[1] : a[0] - b[0]); const tails = []; for (let [w, h] of envelopes) { let l = 0, r = tails.length; while (l < r) { const m = Math.floor((l + r) / 2); if (tails[m] < h) l = m + 1; else r = m; } tails[l] = h; } return tails.length; }`
  },
  {
    slug: "super-egg-drop",
    title: "Super Egg Drop",
    topics: ["Math", "Binary Search", "Dynamic Programming"],
    desc: "You are given `k` identical eggs and you have access to a building with `n` floors labeled from 1 to `n`. Return the minimum number of moves you need to determine with certainty what `f` is (the highest floor from which eggs do not break).",
    constraints: ["1 <= k <= 100", "1 <= n <= 10^4"],
    methodName: "superEggDrop",
    params: ["k", "n"],
    pub: [[1, 2, 2], [2, 6, 3], [3, 14, 4]],
    hid: [[2, 100, 14]],
    ref: `function superEggDrop(k, n) { const dp = new Array(k + 1).fill(0); let m = 0; while (dp[k] < n) { m++; for (let i = k; i >= 1; i--) dp[i] = dp[i] + dp[i - 1] + 1; } return m; }`
  },
  {
    slug: "palindrome-partitioning-ii",
    title: "Palindrome Partitioning II",
    topics: ["Strings", "Dynamic Programming"],
    desc: "Given a string `s`, partition `s` such that every substring of the partition is a palindrome. Return the minimum cuts needed for a palindrome partitioning of `s`.",
    constraints: ["1 <= s.length <= 2000"],
    methodName: "minCut",
    params: ["s"],
    pub: [["aab", 1], ["a", 0], ["ab", 1]],
    hid: [["aba", 0], ["racecar", 0], ["abcdef", 5]],
    ref: `function minCut(s) { const n = s.length; const isPal = Array.from({length: n}, () => new Array(n).fill(false)); for (let r = 0; r < n; r++) { for (let l = 0; l <= r; l++) { if (s[l] === s[r] && (r - l <= 2 || isPal[l+1][r-1])) isPal[l][r] = true; } } const cuts = new Array(n).fill(0); for (let i = 0; i < n; i++) { if (isPal[0][i]) { cuts[i] = 0; } else { let min = i; for (let j = 0; j < i; j++) { if (isPal[j+1][i]) min = Math.min(min, cuts[j] + 1); } cuts[i] = min; } } return cuts[n-1]; }`
  },
  {
    slug: "shortest-palindrome",
    title: "Shortest Palindrome",
    topics: ["Strings", "Rolling Hash", "String Matching"],
    desc: "You are given a string `s`. You can convert it to a palindrome by adding characters in front of it. Find and return the shortest palindrome you can find by performing this transformation.",
    constraints: ["0 <= s.length <= 5 * 10^4"],
    methodName: "shortestPalindrome",
    params: ["s"],
    pub: [["aacecaaa", "aaacecaaa"], ["abcd", "dcbabcd"]],
    hid: [["", ""], ["a", "a"]],
    ref: `function shortestPalindrome(s) { const rev = s.split('').reverse().join(''); for (let i = 0; i < s.length; i++) { if (s.startsWith(rev.slice(i))) { return rev.slice(0, i) + s; } } return ''; }`
  },
  {
    slug: "word-ladder",
    title: "Word Ladder",
    topics: ["Hash Table", "Strings", "BFS"],
    desc: "A transformation sequence from word `beginWord` to word `endWord` using a dictionary `wordList` is a sequence of words `beginWord -> s1 -> s2 -> ... -> sk` such that every adjacent pair differs by 1 letter and `sk == endWord`. Return the number of words in the shortest transformation sequence, or 0 if no such sequence exists.",
    constraints: ["1 <= beginWord.length <= 10", "1 <= wordList.length <= 5000"],
    methodName: "ladderLength",
    params: ["beginWord", "endWord", "wordList"],
    pub: [["hit", "cog", ["hot","dot","dog","lot","log","cog"], 5], ["hit", "cog", ["hot","dot","dog","lot","log"], 0]],
    hid: [["a", "c", ["a","b","c"], 2]],
    ref: `function ladderLength(beginWord, endWord, wordList) { const dict = new Set(wordList); if (!dict.has(endWord)) return 0; const q = [[beginWord, 1]]; const visited = new Set([beginWord]); while (q.length) { const [w, d] = q.shift(); if (w === endWord) return d; for (let i = 0; i < w.length; i++) { for (let c = 97; c <= 122; c++) { const next = w.slice(0, i) + String.fromCharCode(c) + w.slice(i + 1); if (dict.has(next) && !visited.has(next)) { visited.add(next); q.push([next, d + 1]); } } } } return 0; }`
  },
  {
    slug: "find-median-from-data-stream",
    title: "Find Median from Data Stream",
    topics: ["Two Pointers", "Design", "Sorting", "Heap", "Data Stream"],
    desc: "The median is the middle value in an ordered integer list. Design a data structure that supports adding integer streams and calculating the current median.",
    constraints: ["At most 5 * 10^4 calls"],
    methodName: "streamMedian",
    params: ["commands", "args"],
    pub: [[["addNum", "addNum", "findMedian", "addNum", "findMedian"], [[1], [2], [], [3], []], [null, null, 1.5, null, 2.0]]],
    hid: [[["addNum", "findMedian"], [[5], []], [null, 5.0]]],
    ref: `function streamMedian(commands, args) { const arr = []; const res = []; for (let i = 0; i < commands.length; i++) { if (commands[i] === 'addNum') { arr.push(args[i][0]); arr.sort((a, b) => a - b); res.push(null); } else if (commands[i] === 'findMedian') { const len = arr.length; if (len % 2 === 1) res.push(arr[Math.floor(len / 2)]); else res.push((arr[len / 2 - 1] + arr[len / 2]) / 2); } } return res; }`
  },
  {
    slug: "text-justification",
    title: "Text Justification",
    topics: ["Arrays", "Strings", "Simulation"],
    desc: "Given an array of strings `words` and a width `maxWidth`, format the text such that each line has exactly `maxWidth` characters and is fully (left and right) justified.",
    constraints: ["1 <= words.length <= 300", "1 <= maxWidth <= 100"],
    methodName: "fullJustify",
    params: ["words", "maxWidth"],
    pub: [[["This", "is", "an", "example", "of", "text", "justification."], 16, ["This    is    an","example  of text","justification.  "]]],
    hid: [[["What","must","be","acknowledgment","shall","be"], 16, ["What   must   be","acknowledgment  ","shall be        "]]],
    ref: `function fullJustify(words, maxWidth) { const res = []; let cur = [], len = 0; for (let w of words) { if (len + cur.length + w.length > maxWidth) { for (let i = 0; i < maxWidth - len; i++) { cur[i % (cur.length - 1 || 1)] += ' '; } res.push(cur.join('')); cur = []; len = 0; } cur.push(w); len += w.length; } const lastLine = cur.join(' '); res.push(lastLine + ' '.repeat(maxWidth - lastLine.length)); return res; }`
  },
  {
    slug: "minimum-cost-to-cut-a-stick",
    title: "Minimum Cost to Cut a Stick",
    topics: ["Arrays", "Dynamic Programming", "Sorting"],
    desc: "Given an integer `n` and an array of integers `cuts` where `cuts[i]` denotes a position you should perform a cut at. The cost of one cut is the length of the stick to be cut. Return the minimum total cost of the cuts.",
    constraints: ["2 <= n <= 10^6", "1 <= cuts.length <= 100"],
    methodName: "minCost",
    params: ["n", "cuts"],
    pub: [[7, [1,3,4,5], 16], [9, [5,6,1,4,2], 22]],
    hid: [[10, [1,2,3], 15]],
    ref: `function minCost(n, cuts) { const arr = [0, ...cuts.sort((a,b) => a-b), n]; const m = arr.length; const dp = Array.from({length: m}, () => new Array(m).fill(0)); for (let len = 2; len < m; len++) { for (let i = 0; i < m - len; i++) { const j = i + len; let min = Infinity; for (let k = i + 1; k < j; k++) { min = Math.min(min, dp[i][k] + dp[k][j]); } dp[i][j] = (min === Infinity ? 0 : min) + (arr[j] - arr[i]); } } return dp[0][m - 1]; }`
  },
  {
    slug: "frog-jump",
    title: "Frog Jump",
    topics: ["Arrays", "Dynamic Programming"],
    desc: "A frog is crossing a river. The river is divided into some number of units, and at each unit, there may or may not exist a stone represented by `stones`. If the frog's last jump was `k` units, its next jump must be either `k - 1`, `k`, or `k + 1` units. Determine if the frog can reach the last stone.",
    constraints: ["2 <= stones.length <= 2000", "0 <= stones[i] <= 2^31 - 1"],
    methodName: "canCross",
    params: ["stones"],
    pub: [[[0,1,3,5,6,8,12,17], true], [[0,1,2,3,4,8,9,11], false]],
    hid: [[[0,1], true], [[0,2], false]],
    ref: `function canCross(stones) { const stoneSet = new Set(stones); const map = new Map(); for (let s of stones) map.set(s, new Set()); map.get(0).add(0); for (let s of stones) { for (let k of map.get(s)) { for (let step of [k - 1, k, k + 1]) { if (step > 0 && stoneSet.has(s + step)) { map.get(s + step).add(step); } } } } return map.get(stones[stones.length - 1]).size > 0; }`
  },
  {
    slug: "count-smaller-numbers-after-self",
    title: "Count of Smaller Numbers After Self",
    topics: ["Arrays", "Binary Search", "Divide and Conquer", "Binary Indexed Tree", "Segment Tree"],
    desc: "Given an integer array `nums`, return an integer array `counts` where `counts[i]` is the number of smaller elements to the right of `nums[i]`.",
    constraints: ["1 <= nums.length <= 10^5", "-10^4 <= nums[i] <= 10^4"],
    methodName: "countSmaller",
    params: ["nums"],
    pub: [[[5,2,6,1], [2,1,1,0]], [[-1], [0]], [[-1,-1], [0,0]]],
    hid: [[[1,2,3,4], [0,0,0,0]], [[4,3,2,1], [3,2,1,0]]],
    ref: `function countSmaller(nums) { const res = new Array(nums.length).fill(0); const arr = []; for (let i = nums.length - 1; i >= 0; i--) { let l = 0, r = arr.length; while (l < r) { const m = Math.floor((l + r) / 2); if (arr[m] < nums[i]) l = m + 1; else r = m; } res[i] = l; arr.splice(l, 0, nums[i]); } return res; }`
  },
  {
    slug: "max-points-on-a-line",
    title: "Max Points on a Line",
    topics: ["Arrays", "Hash Table", "Math", "Geometry"],
    desc: "Given an array of `points` where `points[i] = [x_i, y_i]` represents a point on the X-Y plane, return the maximum number of points that lie on the same straight line.",
    constraints: ["1 <= points.length <= 300"],
    methodName: "maxPoints",
    params: ["points"],
    pub: [[[[1,1],[2,2],[3,3]], 3], [[[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]], 4]],
    hid: [[[[0,0]], 1]],
    ref: `function maxPoints(points) { if (points.length <= 2) return points.length; let max = 2; for (let i = 0; i < points.length; i++) { const map = {}; for (let j = i + 1; j < points.length; j++) { const dx = points[j][0] - points[i][0]; const dy = points[j][1] - points[i][1]; const slope = dx === 0 ? 'inf' : (dy / dx).toFixed(8); map[slope] = (map[slope] || 1) + 1; max = Math.max(max, map[slope]); } } return max; }`
  },
  {
    slug: "best-time-to-buy-and-sell-stock-iii",
    title: "Best Time to Buy and Sell Stock III",
    topics: ["Arrays", "Dynamic Programming"],
    desc: "You are given an array `prices` where `prices[i]` is the price of a given stock on the ith day. Find the maximum profit you can achieve with at most two transactions.",
    constraints: ["1 <= prices.length <= 10^5"],
    methodName: "maxProfitIII",
    params: ["prices"],
    pub: [[[3,3,5,0,0,3,1,4], 6], [[1,2,3,4,5], 4]],
    hid: [[[7,6,4,3,1], 0]],
    ref: `function maxProfitIII(prices) { let b1 = -Infinity, s1 = 0, b2 = -Infinity, s2 = 0; for (let p of prices) { b1 = Math.max(b1, -p); s1 = Math.max(s1, b1 + p); b2 = Math.max(b2, s1 - p); s2 = Math.max(s2, b2 + p); } return s2; }`
  },
  {
    slug: "best-time-to-buy-and-sell-stock-iv",
    title: "Best Time to Buy and Sell Stock IV",
    topics: ["Arrays", "Dynamic Programming"],
    desc: "You are given an integer `k` and an array of integers `prices` where `prices[i]` is the price of a given stock on the ith day. Find the maximum profit you can achieve with at most `k` transactions.",
    constraints: ["1 <= k <= 100", "1 <= prices.length <= 1000"],
    methodName: "maxProfitIV",
    params: ["k", "prices"],
    pub: [[2, [2,4,1], 2], [2, [3,2,6,5,0,3], 7]],
    hid: [[1, [1,2], 1]],
    ref: `function maxProfitIV(k, prices) { if (!prices.length || k === 0) return 0; const buys = new Array(k + 1).fill(-Infinity); const sells = new Array(k + 1).fill(0); for (let p of prices) { for (let i = 1; i <= k; i++) { buys[i] = Math.max(buys[i], sells[i - 1] - p); sells[i] = Math.max(sells[i], buys[i] + p); } } return sells[k]; }`
  },
  {
    slug: "remove-invalid-parentheses",
    title: "Remove Invalid Parentheses",
    topics: ["Strings", "Backtracking", "BFS"],
    desc: "Given a string `s` that contains parentheses and letters, remove the minimum number of invalid parentheses to make the input string valid. Return all unique results in any order.",
    constraints: ["1 <= s.length <= 25"],
    methodName: "removeInvalidParentheses",
    params: ["s"],
    pub: [["()())()", ["(())()","()()()"]], ["(a)())()", ["(a())()","(a)()()"]]],
    hid: [[")(", [""]]],
    ref: `function removeInvalidParentheses(s) { const isValid = str => { let c = 0; for (let ch of str) { if (ch === '(') c++; else if (ch === ')') { c--; if (c < 0) return false; } } return c === 0; }; const res = [], q = [s], visited = new Set([s]); let found = false; while (q.length) { const cur = q.shift(); if (isValid(cur)) { res.push(cur); found = true; } if (found) continue; for (let i = 0; i < cur.length; i++) { if (cur[i] !== '(' && cur[i] !== ')') continue; const next = cur.slice(0, i) + cur.slice(i + 1); if (!visited.has(next)) { visited.add(next); q.push(next); } } } return res.length ? res : [""]; }`
  },
  {
    slug: "sudoku-solver",
    title: "Sudoku Solver",
    topics: ["Arrays", "Hash Table", "Backtracking", "Matrix"],
    desc: "Write a program to solve a Sudoku puzzle by filling the empty cells (denoted by '.').",
    constraints: ["board.length == 9", "board[i].length == 9"],
    methodName: "solveSudoku",
    params: ["board"],
    pub: [[
      [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]],
      [["5","3","4","6","7","8","9","1","2"],["6","7","2","1","9","5","3","4","8"],["1","9","8","3","4","2","5","6","7"],["8","5","9","7","6","1","4","2","3"],["4","2","6","8","5","3","7","9","1"],["7","1","3","9","2","4","8","5","6"],["9","6","1","5","3","7","2","8","4"],["2","8","7","4","1","9","6","3","5"],["3","4","5","2","8","6","1","7","9"]]
    ]],
    hid: [[
      [["5","3","4","6","7","8","9","1","2"],["6","7","2","1","9","5","3","4","8"],["1","9","8","3","4","2","5","6","7"],["8","5","9","7","6","1","4","2","3"],["4","2","6","8","5","3","7","9","1"],["7","1","3","9","2","4","8","5","6"],["9","6","1","5","3","7","2","8","4"],["2","8","7","4","1","9","6","3","5"],["3","4","5","2","8","6","1","7","."]],
      [["5","3","4","6","7","8","9","1","2"],["6","7","2","1","9","5","3","4","8"],["1","9","8","3","4","2","5","6","7"],["8","5","9","7","6","1","4","2","3"],["4","2","6","8","5","3","7","9","1"],["7","1","3","9","2","4","8","5","6"],["9","6","1","5","3","7","2","8","4"],["2","8","7","4","1","9","6","3","5"],["3","4","5","2","8","6","1","7","9"]]
    ]],
    ref: `function solveSudoku(board) { function isValid(r, c, ch) { for (let i = 0; i < 9; i++) { if (board[r][i] === ch || board[i][c] === ch) return false; const boxR = 3 * Math.floor(r / 3) + Math.floor(i / 3); const boxC = 3 * Math.floor(c / 3) + (i % 3); if (board[boxR][boxC] === ch) return false; } return true; } function solve() { for (let i = 0; i < 9; i++) { for (let j = 0; j < 9; j++) { if (board[i][j] === '.') { for (let c = 1; c <= 9; c++) { const ch = String(c); if (isValid(i, j, ch)) { board[i][j] = ch; if (solve()) return true; board[i][j] = '.'; } } return false; } } } return true; } solve(); return board; }`
  },
  {
    slug: "cherry-pickup",
    title: "Cherry Pickup",
    topics: ["Arrays", "Dynamic Programming", "Matrix"],
    desc: "You are given an `n x n` grid representing a field of cherries. Return the maximum number of cherries you can collect by following rules: start at (0,0) go to (n-1,n-1) and return to (0,0).",
    constraints: ["n == grid.length", "1 <= n <= 50"],
    methodName: "cherryPickup",
    params: ["grid"],
    pub: [[[[0,1,-1],[1,0,-1],[1,1,1]], 5], [[[1,1,-1],[1,-1,1],[-1,1,1]], 0]],
    hid: [[[[1]], 1]],
    ref: `function cherryPickup(grid) { const n = grid.length; const memo = {}; function dp(r1, c1, c2) { const r2 = r1 + c1 - c2; if (r1 === n || c1 === n || r2 === n || c2 === n || grid[r1][c1] === -1 || grid[r2][c2] === -1) return -Infinity; if (r1 === n - 1 && c1 === n - 1) return grid[r1][c1]; const key = r1 + ',' + c1 + ',' + c2; if (key in memo) return memo[key]; let ans = grid[r1][c1] + (c1 !== c2 ? grid[r2][c2] : 0); const best = Math.max(dp(r1+1, c1, c2), dp(r1, c1+1, c2), dp(r1+1, c1, c2+1), dp(r1, c1+1, c2+1)); ans += best; memo[key] = ans; return ans; } return Math.max(0, dp(0, 0, 0)); }`
  },
  {
    slug: "concatenated-words",
    title: "Concatenated Words",
    topics: ["Arrays", "Strings", "Dynamic Programming", "DFS", "Trie"],
    desc: "Given an array of strings `words` (without duplicates), return all concatenated words in the given list of words.",
    constraints: ["1 <= words.length <= 10^4", "1 <= words[i].length <= 30"],
    methodName: "findAllConcatenatedWordsInADict",
    params: ["words"],
    pub: [[["cat","cats","catsdogcats","dog","dogcatsdog","hippopotamuses","rat","ratcatdogcat"], ["catsdogcats","dogcatsdog","ratcatdogcat"]]],
    hid: [[["cat","dog","catdog"], ["catdog"]]],
    ref: `function findAllConcatenatedWordsInADict(words) { const set = new Set(words); const res = []; function canForm(w) { const dp = new Array(w.length + 1).fill(false); dp[0] = true; for (let i = 1; i <= w.length; i++) { for (let j = 0; j < i; j++) { if (i - j === w.length) continue; if (dp[j] && set.has(w.slice(j, i))) { dp[i] = true; break; } } } return dp[w.length]; } for (let w of words) { if (canForm(w)) res.push(w); } return res; }`
  },
  {
    slug: "cracking-the-safe",
    title: "Cracking the Safe",
    topics: ["DFS", "Graph", "Eulerian Circuit"],
    desc: "There is a safe protected by a password of `n` digits. Each digit can be one of the first `k` digits `0, 1, ..., k-1`. Return any string of minimum length that is guaranteed to open the safe.",
    constraints: ["1 <= n <= 4", "1 <= k <= 10"],
    methodName: "crackSafe",
    params: ["n", "k"],
    pub: [[1, 2, "01"], [2, 2, "00110"]],
    hid: [[1, 1, "0"]],
    ref: `function crackSafe(n, k) { if (n === 1 && k === 1) return '0'; const visited = new Set(); const seq = []; const prefix = '0'.repeat(n - 1); function dfs(u) { for (let i = 0; i < k; i++) { const edge = u + i; if (!visited.has(edge)) { visited.add(edge); dfs(edge.slice(1)); seq.push(i); } } } dfs(prefix); return prefix + seq.reverse().join(''); }`
  },
  {
    slug: "erect-the-fence",
    title: "Erect the Fence",
    topics: ["Arrays", "Math", "Geometry"],
    desc: "You are given an array `trees` where `trees[i] = [x_i, y_i]` represents the location of a tree in the garden. Return the coordinates of trees that are exactly on the fence perimeter (Convex Hull).",
    constraints: ["1 <= trees.length <= 3000"],
    methodName: "outerTrees",
    params: ["trees"],
    pub: [[[[1,1],[2,2],[2,0],[2,4],[3,3],[4,2]], [[1,1],[2,0],[4,2],[3,3],[2,4]]]],
    hid: [[[[1,2],[2,2],[4,2]], [[1,2],[2,2],[4,2]]]],
    ref: `function outerTrees(trees) { function orientation(p, q, r) { return (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]); } if (trees.length <= 3) return trees; trees.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]); const lower = []; for (let p of trees) { while (lower.length >= 2 && orientation(lower[lower.length - 2], lower[lower.length - 1], p) > 0) lower.pop(); lower.push(p); } const upper = []; for (let i = trees.length - 1; i >= 0; i--) { const p = trees[i]; while (upper.length >= 2 && orientation(upper[upper.length - 2], upper[upper.length - 1], p) > 0) upper.pop(); upper.push(p); } const set = new Set(); const res = []; for (let p of [...lower, ...upper]) { const key = p[0] + ',' + p[1]; if (!set.has(key)) { set.add(key); res.push(p); } } return res; }`
  },
  {
    slug: "alien-dictionary",
    title: "Alien Dictionary",
    topics: ["Arrays", "Strings", "Graph", "Topological Sort"],
    desc: "There is a new alien language that uses the English alphabet. Given a list of words from the alien language dictionary sorted lexicographically, derive the order of letters in this language.",
    constraints: ["1 <= words.length <= 100", "1 <= words[i].length <= 100"],
    methodName: "alienOrder",
    params: ["words"],
    pub: [[["wrt","wrf","er","ett","rftt"], "wertf"], [["z","x"], "zx"]],
    hid: [[["z","x","z"], ""]],
    ref: `function alienOrder(words) { const adj = {}, inDegree = {}; for (let w of words) for (let c of w) { inDegree[c] = 0; adj[c] = new Set(); } for (let i = 0; i < words.length - 1; i++) { const w1 = words[i], w2 = words[i+1]; if (w1.length > w2.length && w1.startsWith(w2)) return ''; for (let j = 0; j < Math.min(w1.length, w2.length); j++) { if (w1[j] !== w2[j]) { if (!adj[w1[j]].has(w2[j])) { adj[w1[j]].add(w2[j]); inDegree[w2[j]]++; } break; } } } const q = []; for (let c in inDegree) if (inDegree[c] === 0) q.push(c); let res = ''; while (q.length) { const c = q.shift(); res += c; for (let next of adj[c]) { inDegree[next]--; if (inDegree[next] === 0) q.push(next); } } return res.length === Object.keys(inDegree).length ? res : ''; }`
  },
  {
    slug: "count-of-range-sum",
    title: "Count of Range Sum",
    topics: ["Arrays", "Binary Search", "Divide and Conquer", "Binary Indexed Tree", "Segment Tree"],
    desc: "Given an integer array `nums` and two integers `lower` and `upper`, return the number of range sums that lie in `[lower, upper]` inclusive.",
    constraints: ["1 <= nums.length <= 10^5"],
    methodName: "countRangeSum",
    params: ["nums", "lower", "upper"],
    pub: [[[-2,5,-1], -2, 2, 3], [[0], 0, 0, 1]],
    hid: [[[0,-3,-3,1,1,2], 3, 5, 2]],
    ref: `function countRangeSum(nums, lower, upper) { let count = 0; for (let i = 0; i < nums.length; i++) { let sum = 0; for (let j = i; j < nums.length; j++) { sum += nums[j]; if (sum >= lower && sum <= upper) count++; } } return count; }`
  },
  {
    slug: "redundant-connection-ii",
    title: "Redundant Connection II",
    topics: ["DFS", "BFS", "Union Find", "Graph"],
    desc: "A directed tree is a directed graph where there is only one root node. Find an edge in `edges` that can be removed so that the resulting graph is a rooted tree of `n` nodes.",
    constraints: ["n == edges.length", "3 <= n <= 1000"],
    methodName: "findRedundantDirectedConnection",
    params: ["edges"],
    pub: [[[[1,2],[1,3],[2,3]], [2,3]], [[[1,2],[2,3],[3,4],[4,1],[1,5]], [4,1]]],
    hid: [[[[2,1],[3,1],[4,2],[1,4]], [2,1]]],
    ref: `function findRedundantDirectedConnection(edges) { const n = edges.length; const parent = new Array(n + 1).fill(0); let cand1 = null, cand2 = null; for (let e of edges) { const [u, v] = e; if (parent[v] !== 0) { cand1 = [parent[v], v]; cand2 = [u, v]; break; } parent[v] = u; } const uf = Array.from({length: n + 1}, (_, i) => i); const find = i => uf[i] === i ? i : (uf[i] = find(uf[i])); for (let e of edges) { if (cand2 && e[0] === cand2[0] && e[1] === cand2[1]) continue; const [u, v] = e; const r1 = find(u), r2 = find(v); if (r1 === r2) return cand1 ? cand1 : e; uf[r2] = r1; } return cand2; }`
  },
  {
    slug: "reverse-nodes-in-k-group",
    title: "Reverse Nodes in k-Group",
    topics: ["Linked List", "Recursion"],
    desc: "Given the head of a linked list, reverse the nodes of the list `k` at a time, and return the modified list.",
    constraints: ["1 <= k <= length of list <= 5000"],
    methodName: "reverseKGroup",
    params: ["head", "k"],
    pub: [[[1,2,3,4,5], 2, [2,1,4,3,5]], [[1,2,3,4,5], 3, [3,2,1,4,5]]],
    hid: [[[1,2,3,4,5], 1, [1,2,3,4,5]], [[1], 1, [1]]],
    ref: `function reverseKGroup(head, k) { const res = [...head]; for (let i = 0; i + k <= res.length; i += k) { const chunk = res.slice(i, i + k).reverse(); for (let j = 0; j < k; j++) res[i + j] = chunk[j]; } return res; }`
  },
  {
    slug: "freedom-trail",
    title: "Freedom Trail",
    topics: ["Strings", "Dynamic Programming", "DFS", "BFS"],
    desc: "Given a string `ring` and a string `key`, return the minimum number of steps to spell all the characters in the `key` using the ring dial.",
    constraints: ["1 <= ring.length, key.length <= 100"],
    methodName: "findRotateSteps",
    params: ["ring", "key"],
    pub: [["godding", "gd", 4], ["godding", "godding", 13]],
    hid: [["ababcab", "acba", 9]],
    ref: `function findRotateSteps(ring, key) { const n = ring.length; const memo = {}; function dp(rIdx, kIdx) { if (kIdx === key.length) return 0; const state = rIdx + ',' + kIdx; if (state in memo) return memo[state]; let minSteps = Infinity; for (let i = 0; i < n; i++) { if (ring[i] === key[kIdx]) { const dist = Math.min(Math.abs(i - rIdx), n - Math.abs(i - rIdx)); const total = 1 + dist + dp(i, kIdx + 1); minSteps = Math.min(minSteps, total); } } memo[state] = minSteps; return minSteps; } return dp(0, 0); }`
  },
  {
    slug: "paint-house-iii",
    title: "Paint House III",
    topics: ["Arrays", "Dynamic Programming"],
    desc: "There is a row of `m` houses in a small city. Return the minimum cost to paint all the remaining houses such that there are exactly `target` neighborhoods.",
    constraints: ["1 <= m <= 100", "1 <= n <= 20", "1 <= target <= m"],
    methodName: "minCostPaint",
    params: ["houses", "cost", "m", "n", "target"],
    pub: [[[0,0,0,0,0], [[1,10],[10,1],[10,1],[1,10],[5,1]], 5, 2, 3, 9], [[0,2,1,2,0], [[1,10],[10,1],[10,1],[1,10],[5,1]], 5, 2, 3, 11]],
    hid: [[[3,1,2,3], [[1,1,1],[1,1,1],[1,1,1],[1,1,1]], 4, 3, 3, -1]],
    ref: `function minCostPaint(houses, cost, m, n, target) { const memo = {}; function dp(i, prevColor, targetCount) { if (targetCount < 0) return Infinity; if (i === m) return targetCount === 0 ? 0 : Infinity; const key = i + ',' + prevColor + ',' + targetCount; if (key in memo) return memo[key]; if (houses[i] !== 0) { const newTarget = houses[i] === prevColor ? targetCount : targetCount - 1; return memo[key] = dp(i + 1, houses[i], newTarget); } let minCost = Infinity; for (let c = 1; c <= n; c++) { const newTarget = c === prevColor ? targetCount : targetCount - 1; const res = cost[i][c - 1] + dp(i + 1, c, newTarget); minCost = Math.min(minCost, res); } return memo[key] = minCost; } const ans = dp(0, 0, target); return ans === Infinity ? -1 : ans; }`
  },
  {
    slug: "serialize-and-deserialize-binary-tree",
    title: "Serialize and Deserialize Binary Tree",
    topics: ["Strings", "Trees", "DFS", "BFS", "Design"],
    desc: "Design an algorithm to serialize and deserialize a binary tree to and from a string representation.",
    constraints: ["0 <= nodes <= 10^4"],
    methodName: "serializeAndDeserialize",
    params: ["treeArray"],
    pub: [[[1,2,3,null,null,4,5], [1,2,3,null,null,4,5]], [[], []]],
    hid: [[[1], [1]], [[1,2], [1,2]]],
    ref: `function serializeAndDeserialize(treeArray) { const str = JSON.stringify(treeArray); return JSON.parse(str); }`
  },
  {
    slug: "binary-tree-maximum-path-sum",
    title: "Binary Tree Maximum Path Sum",
    topics: ["Dynamic Programming", "Trees", "DFS"],
    desc: "A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge. Return the maximum path sum of any non-empty path.",
    constraints: ["1 <= nodes <= 3 * 10^4", "-1000 <= Node.val <= 1000"],
    methodName: "maxPathSum",
    params: ["nodes"],
    pub: [[[1,2,3], 6], [[-10,9,20,null,null,15,7], 42]],
    hid: [[[-3], -3], [[2,-1], 2]],
    ref: `function maxPathSum(nodes) { if (!nodes.length || nodes[0] === null) return 0; let maxSum = -Infinity; function build(idx) { if (idx >= nodes.length || nodes[idx] === null) return 0; const left = Math.max(0, build(2 * idx + 1)); const right = Math.max(0, build(2 * idx + 2)); maxSum = Math.max(maxSum, nodes[idx] + left + right); return nodes[idx] + Math.max(left, right); } build(0); return maxSum; }`
  },
  {
    slug: "longest-increasing-path-in-a-matrix",
    title: "Longest Increasing Path in a Matrix",
    topics: ["Arrays", "Dynamic Programming", "DFS", "BFS", "Graph", "Memoization"],
    desc: "Given an `m x n` integers matrix, return the length of the longest increasing path in matrix.",
    constraints: ["m == matrix.length", "n == matrix[i].length", "1 <= m, n <= 200"],
    methodName: "longestIncreasingPath",
    params: ["matrix"],
    pub: [[[[9,9,4],[6,6,8],[2,1,1]], 4], [[[3,4,5],[3,2,6],[2,2,1]], 4]],
    hid: [[[[1]], 1]],
    ref: `function longestIncreasingPath(matrix) { const m = matrix.length, n = matrix[0].length; const memo = Array.from({length: m}, () => new Array(n).fill(0)); function dfs(r, c) { if (memo[r][c]) return memo[r][c]; let max = 1; for (let [dr, dc] of [[1,0],[-1,0],[0,1],[0,-1]]) { const nr = r + dr, nc = c + dc; if (nr >= 0 && nc >= 0 && nr < m && nc < n && matrix[nr][nc] > matrix[r][c]) { max = Math.max(max, 1 + dfs(nr, nc)); } } return memo[r][c] = max; } let res = 0; for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) res = Math.max(res, dfs(i, j)); return res; }`
  },
  {
    slug: "word-search-ii",
    title: "Word Search II",
    topics: ["Arrays", "Strings", "Backtracking", "Trie", "Matrix"],
    desc: "Given an `m x n` board of characters and a list of strings `words`, return all words on the board.",
    constraints: ["m == board.length", "n == board[i].length", "1 <= words.length <= 3 * 10^4"],
    methodName: "findWords",
    params: ["board", "words"],
    pub: [[[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], ["oath","pea","eat","rain"], ["oath","eat"]]],
    hid: [[[["a","b"],["c","d"]], ["abcb"], []]],
    ref: `function findWords(board, words) { const m = board.length, n = board[0].length; const res = []; function exist(word) { function dfs(r, c, idx) { if (idx === word.length) return true; if (r < 0 || c < 0 || r >= m || c >= n || board[r][c] !== word[idx]) return false; const t = board[r][c]; board[r][c] = '#'; const found = dfs(r+1,c,idx+1) || dfs(r-1,c,idx+1) || dfs(r,c+1,idx+1) || dfs(r,c-1,idx+1); board[r][c] = t; return found; } for (let i = 0; i < m; i++) for (let j = 0; j < n; j++) if (dfs(i, j, 0)) return true; return false; } for (let w of words) if (exist(w)) res.push(w); return res; }`
  },
  {
    slug: "word-ladder-ii",
    title: "Word Ladder II",
    topics: ["Hash Table", "Strings", "Backtracking", "BFS"],
    desc: "Given two words, `beginWord` and `endWord`, and a dictionary `wordList`, return all the shortest transformation sequences from `beginWord` to `endWord`.",
    constraints: ["1 <= beginWord.length <= 5", "1 <= wordList.length <= 500"],
    methodName: "findLadders",
    params: ["beginWord", "endWord", "wordList"],
    pub: [["hit", "cog", ["hot","dot","dog","lot","log","cog"], [["hit","hot","dot","dog","cog"],["hit","hot","lot","log","cog"]]]],
    hid: [["hit", "cog", ["hot","dot","dog","lot","log"], []]],
    ref: `function findLadders(beginWord, endWord, wordList) { const dict = new Set(wordList); if (!dict.has(endWord)) return []; let layer = { [beginWord]: [[beginWord]] }; const res = []; while (Object.keys(layer).length) { const newLayer = {}; for (let w in layer) { if (w === endWord) { return layer[w]; } } for (let w in layer) dict.delete(w); for (let w in layer) { for (let i = 0; i < w.length; i++) { for (let c = 97; c <= 122; c++) { const next = w.slice(0, i) + String.fromCharCode(c) + w.slice(i + 1); if (dict.has(next)) { if (!newLayer[next]) newLayer[next] = []; for (let path of layer[w]) newLayer[next].push([...path, next]); } } } } layer = newLayer; } return []; }`
  },
  {
    slug: "expression-add-operators",
    title: "Expression Add Operators",
    topics: ["Math", "Strings", "Backtracking"],
    desc: "Given a string `num` that contains only digits and an integer `target`, return all possibilities to insert binary operators '+', '-', and/or '*' between digits of `num` so that resultant value equals `target`.",
    constraints: ["1 <= num.length <= 10", "-2^31 <= target <= 2^31 - 1"],
    methodName: "addOperators",
    params: ["num", "target"],
    pub: [["123", 6, ["1+2+3","1*2*3"]], ["232", 8, ["2+3*2","2*3+2"]]],
    hid: [["3456237490", 9191, []]],
    ref: `function addOperators(num, target) { const res = []; function bt(idx, path, val, prev) { if (idx === num.length) { if (val === target) res.push(path); return; } for (let i = idx; i < num.length; i++) { if (i !== idx && num[idx] === '0') break; const curStr = num.slice(idx, i + 1); const cur = Number(curStr); if (idx === 0) { bt(i + 1, curStr, cur, cur); } else { bt(i + 1, path + '+' + curStr, val + cur, cur); bt(i + 1, path + '-' + curStr, val - cur, -cur); bt(i + 1, path + '*' + curStr, val - prev + prev * cur, prev * cur); } } } bt(0, '', 0, 0); return res; }`
  },
  {
    slug: "trapping-rain-water-ii",
    title: "Trapping Rain Water II",
    topics: ["Arrays", "BFS", "Heap", "Matrix"],
    desc: "Given an `m x n` integer matrix `heightMap` representing the height of each unit cell in a 2D elevation map, return the volume of water it can trap after raining.",
    constraints: ["m == heightMap.length", "n == heightMap[i].length", "1 <= m, n <= 200"],
    methodName: "trapRainWater",
    params: ["heightMap"],
    pub: [[[[1,4,3,1,3,2],[3,2,1,3,2,4],[2,3,3,2,3,1]], 4]],
    hid: [[[[3,3,3,3,3],[3,2,2,2,3],[3,2,1,2,3],[3,2,2,2,3],[3,3,3,3,3]], 10]],
    ref: `function trapRainWater(heightMap) { const m = heightMap.length, n = heightMap[0].length; if (m <= 2 || n <= 2) return 0; const visited = Array.from({length: m}, () => new Array(n).fill(false)); const heap = []; for (let i = 0; i < m; i++) { for (let j = 0; j < n; j++) { if (i === 0 || i === m - 1 || j === 0 || j === n - 1) { heap.push([heightMap[i][j], i, j]); visited[i][j] = true; } } } heap.sort((a, b) => a[0] - b[0]); let water = 0; const dirs = [[1,0],[-1,0],[0,1],[0,-1]]; while (heap.length) { heap.sort((a, b) => a[0] - b[0]); const [h, r, c] = heap.shift(); for (let [dr, dc] of dirs) { const nr = r + dr, nc = c + dc; if (nr >= 0 && nc >= 0 && nr < m && nc < n && !visited[nr][nc]) { visited[nr][nc] = true; water += Math.max(0, h - heightMap[nr][nc]); heap.push([Math.max(h, heightMap[nr][nc]), nr, nc]); } } } return water; }`
  },
  {
    slug: "skyline-problem",
    title: "The Skyline Problem",
    topics: ["Arrays", "Divide and Conquer", "Heap", "Binary Indexed Tree", "Segment Tree", "Line Sweep"],
    desc: "A city's skyline is the outer contour of the silhouette formed by all the buildings in that city when viewed from a distance. Given the locations and heights of all the buildings, return the skyline formed by these buildings.",
    constraints: ["1 <= buildings.length <= 10^4"],
    methodName: "getSkyline",
    params: ["buildings"],
    pub: [[[[2,9,10],[3,7,15],[5,12,12],[15,20,10],[19,24,8]], [[2,10],[3,15],[7,12],[12,0],[15,10],[20,8],[24,0]]]],
    hid: [[[[0,2,3],[2,5,3]], [[0,3],[5,0]]]],
    ref: `function getSkyline(buildings) { const events = []; for (let [l, r, h] of buildings) { events.push([l, -h]); events.push([r, h]); } events.sort((a, b) => a[0] === b[0] ? a[1] - b[1] : a[0] - b[0]); const res = [], heights = [0]; let prevMax = 0; for (let [x, h] of events) { if (h < 0) heights.push(-h); else heights.splice(heights.indexOf(h), 1); heights.sort((a, b) => a - b); const curMax = heights[heights.length - 1]; if (curMax !== prevMax) { res.push([x, curMax]); prevMax = curMax; } } return res; }`
  },
  {
    slug: "stickers-to-spell-word",
    title: "Stickers to Spell Word",
    topics: ["Arrays", "Strings", "Dynamic Programming", "Backtracking", "Bitmask"],
    desc: "We are given `n` different types of stickers. Each sticker has a lowercase English word on it. We would like to spell out the given string `target` by cutting individual letters from stickers. Return the minimum number of stickers you need to spell out target.",
    constraints: ["1 <= stickers.length <= 50", "1 <= target.length <= 15"],
    methodName: "minStickers",
    params: ["stickers", "target"],
    pub: [[["with","example","science"], "thehat", 3], [["notice","possible"], "basicbasic", -1]],
    hid: [[["a","b","c"], "abc", 3]],
    ref: `function minStickers(stickers, target) { const memo = {'': 0}; function dp(t) { if (t in memo) return memo[t]; let res = Infinity; const tCount = {}; for (let c of t) tCount[c] = (tCount[c] || 0) + 1; for (let s of stickers) { if (!s.includes(t[0])) continue; let nextT = ''; const sCount = {}; for (let c of s) sCount[c] = (sCount[c] || 0) + 1; for (let c in tCount) { const rem = Math.max(0, tCount[c] - (sCount[c] || 0)); nextT += c.repeat(rem); } res = Math.min(res, 1 + dp(nextT)); } memo[t] = res; return res; } const ans = dp(target); return ans === Infinity ? -1 : ans; }`
  },
  {
    slug: "split-array-largest-sum",
    title: "Split Array Largest Sum",
    topics: ["Arrays", "Binary Search", "Dynamic Programming", "Greedy", "Prefix Sum"],
    desc: "Given an integer array `nums` and an integer `k`, split `nums` into `k` non-empty subarrays such that the largest sum of any subarray is minimized. Return the minimized largest sum.",
    constraints: ["1 <= nums.length <= 1000", "1 <= k <= min(50, nums.length)"],
    methodName: "splitArray",
    params: ["nums", "k"],
    pub: [[[7,2,5,10,8], 2, 18], [[1,2,3,4,5], 2, 9]],
    hid: [[[1,4,4], 3, 4]],
    ref: `function splitArray(nums, k) { let l = Math.max(...nums), r = nums.reduce((a, b) => a + b, 0); function canSplit(maxSum) { let count = 1, cur = 0; for (let n of nums) { if (cur + n > maxSum) { count++; cur = n; } else cur += n; } return count <= k; } while (l < r) { const m = Math.floor((l + r) / 2); if (canSplit(m)) r = m; else l = m + 1; } return l; }`
  }
];

// Build 50 Hard
hardDefs.forEach((d, idx) => {
  PROBLEMS.push(createProblem({
    id: 100 + idx + 1,
    slug: d.slug,
    title: d.title,
    difficulty: "HARD",
    topics: d.topics,
    description: d.desc,
    constraints: d.constraints,
    methodName: d.methodName,
    params: d.params,
    returnType: "any",
    publicTestCases: d.pub,
    hiddenTestCases: d.hid,
    referenceSolution: d.ref
  }));
});

// Run verification on all 150 problems
console.log(`Verifying all ${PROBLEMS.length} problems...`);
let passedCount = 0;
for (const p of PROBLEMS) {
  const allCases = [...p.publicTestCases, ...p.hiddenTestCases];
  let fn;
  try {
    const context = {};
    const wrapped = new Function('context', `
      ${p._refSolution}
      context.fn = ${p.methodName};
    `);
    wrapped(context);
    fn = context.fn;
  } catch (e) {
    console.error(`Syntax/Compilation error in solution for ${p.slug} (${p.difficulty}):`, e.message);
    process.exit(1);
  }

  for (let i = 0; i < allCases.length; i++) {
    const tc = allCases[i];
    try {
      const clonedArgs = JSON.parse(JSON.stringify(tc.args));
      const res = fn(...clonedArgs);
      const resStr = JSON.stringify(res);
      const expStr = JSON.stringify(tc.expected);
      if (resStr !== expStr) {
        console.error(`FAIL [${p.difficulty}] ${p.slug} TC ${i+1}: expected ${expStr}, got ${resStr}`);
        process.exit(1);
      }
    } catch (err) {
      console.error(`RUNTIME ERROR [${p.difficulty}] ${p.slug} TC ${i+1}: ${err.message}`);
      process.exit(1);
    }
  }
  delete p._refSolution;
  passedCount++;
}

console.log(`ALL ${passedCount} DSA PROBLEMS PASSED VERIFICATION! (50 Easy, 50 Medium, 50 Hard)`);

// Build dictionary indexed by slug
const dict = {};
PROBLEMS.forEach(p => {
  dict[p.slug] = p;
});

// Write to TypeScript file
const outPath = path.join(__dirname, '../apps/web/src/lib/dsa-150-database.ts');
const fileContent = `import { ProblemDefinition } from "./problems-data";

export const DSA_150_PROBLEMS: Record<string, ProblemDefinition> = ${JSON.stringify(dict, null, 2)};
`;

fs.writeFileSync(outPath, fileContent, 'utf8');
console.log(`Wrote ${PROBLEMS.length} verified problems to ${outPath}`);
