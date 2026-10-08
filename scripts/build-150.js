const fs = require('fs');
const path = require('path');

// Helper to validate and format problems
function buildFull150Database() {
  const problems = {};

  // Define problem generator helper
  function add(slug, id, title, difficulty, topics, description, constraints, methodName, starterCode, publicTestCases, hiddenTestCases) {
    problems[slug] = {
      id,
      slug,
      title,
      difficulty,
      topics: topics.map(t => ({ name: t })),
      description,
      constraints,
      methodName,
      supportedLanguages: ["javascript", "python", "cpp", "java"],
      starterCode,
      publicTestCases,
      hiddenTestCases
    };
  }

  // --- 50 EASY PROBLEMS ---
  const easyList = [
    ["two-sum", "1", "Two Sum", ["Arrays", "Hash Table"], "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.", ["2 <= nums.length <= 10^4", "-10^9 <= nums[i] <= 10^9"], "twoSum", "twoSum", [[ [2, 7, 11, 15], 9, [0, 1] ], [ [3, 2, 4], 6, [1, 2] ]], [[ [3, 3], 6, [0, 1] ]]],
    ["valid-parentheses", "2", "Valid Parentheses", ["Strings", "Stack"], "Given a string `s` containing just characters `()[]{}`, determine if the input string is valid.", ["1 <= s.length <= 10^4"], "isValid", "isValid", [[ "()", true ], [ "()[]{}", true ], [ "(]", false ]], [[ "{[]}", true ], [ "([)]", false ]]],
    ["merge-two-sorted-lists", "3", "Merge Two Sorted Lists", ["Linked List", "Recursion"], "Merge two sorted lists into one sorted list.", ["0 <= length <= 50"], "mergeTwoLists", "mergeTwoLists", [[ [1,2,4], [1,3,4], [1,1,2,3,4,4] ], [ [], [], [] ]], [[ [], [0], [0] ]]],
    ["best-time-to-buy-and-sell-stock", "4", "Best Time to Buy and Sell Stock", ["Arrays", "Dynamic Programming"], "Return the maximum profit you can achieve from one stock transaction.", ["1 <= prices.length <= 10^5"], "maxProfit", "maxProfit", [[ [7,1,5,3,6,4], 5 ], [ [7,6,4,3,1], 0 ]], [[ [2,4,1], 2 ]]],
    ["valid-palindrome", "5", "Valid Palindrome", ["Strings", "Two Pointers"], "Determine if a string is a palindrome after converting to lowercase and removing non-alphanumeric characters.", ["1 <= s.length <= 2 * 10^5"], "isPalindrome", "isPalindrome", [[ "A man, a plan, a canal: Panama", true ], [ "race a car", false ]], [[ " ", true ]]],
    ["climbing-stairs", "6", "Climbing Stairs", ["Math", "Dynamic Programming"], "In how many distinct ways can you climb n steps taking 1 or 2 steps each time?", ["1 <= n <= 45"], "climbStairs", "climbStairs", [[ 2, 2 ], [ 3, 3 ]], [[ 4, 5 ], [ 5, 8 ]]],
    ["single-number", "7", "Single Number", ["Arrays", "Bit Manipulation"], "Find the single element in an array where every other element appears twice.", ["1 <= nums.length <= 3 * 10^4"], "singleNumber", "singleNumber", [[ [2,2,1], 1 ], [ [4,1,2,1,2], 4 ]], [[ [1], 1 ]]],
    ["contains-duplicate", "8", "Contains Duplicate", ["Arrays", "Hash Table"], "Return true if any value appears at least twice in the array.", ["1 <= nums.length <= 10^5"], "containsDuplicate", "containsDuplicate", [[ [1,2,3,1], true ], [ [1,2,3,4], false ]], [[ [1,1,1,3,3,4,3,2,4,2], true ]]],
    ["missing-number", "9", "Missing Number", ["Arrays", "Math", "Bit Manipulation"], "Find the only number in range [0, n] that is missing from the array.", ["n == nums.length", "1 <= n <= 10^4"], "missingNumber", "missingNumber", [[ [3,0,1], 2 ], [ [0,1], 2 ]], [[ [9,6,4,2,3,5,7,0,1], 8 ]]],
    ["reverse-string", "10", "Reverse String", ["Strings", "Two Pointers"], "Write a function that reverses an array of characters in-place.", ["1 <= s.length <= 10^5"], "reverseString", "reverseString", [[ ["h","e","l","l","o"], ["o","l","l","e","h"] ]], [[ ["H","a","n","n","a","h"], ["h","a","n","n","a","H"] ]]],
    ["valid-anagram", "11", "Valid Anagram", ["Hash Table", "Strings"], "Return true if t is an anagram of s.", ["1 <= s.length, t.length <= 5 * 10^4"], "isAnagram", "isAnagram", [[ "anagram", "nagaram", true ], [ "rat", "car", false ]], [[ "a", "ab", false ]]],
    ["binary-search", "12", "Binary Search", ["Arrays", "Binary Search"], "Search for target in a sorted array and return its index or -1.", ["1 <= nums.length <= 10^4"], "search", "search", [[ [-1,0,3,5,9,12], 9, 4 ], [ [-1,0,3,5,9,12], 2, -1 ]], [[ [5], 5, 0 ]]],
    ["maximum-depth-of-binary-tree", "13", "Maximum Depth of Binary Tree", ["Trees", "DFS"], "Return the maximum depth of a binary tree.", ["0 <= nodes <= 10^4"], "maxDepth", "maxDepth", [[ [3,9,20,null,null,15,7], 3 ]], [[ [], 0 ]]],
    ["fizz-buzz", "14", "Fizz Buzz", ["Math", "Strings"], "Return the FizzBuzz string array for 1 to n.", ["1 <= n <= 10^4"], "fizzBuzz", "fizzBuzz", [[ 3, ["1","2","Fizz"] ], [ 5, ["1","2","Fizz","4","Buzz"] ]], [[ 15, ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"] ]]],
    ["move-zeroes", "15", "Move Zeroes", ["Arrays", "Two Pointers"], "Move all 0s to the end of the array while maintaining relative order.", ["1 <= nums.length <= 10^4"], "moveZeroes", "moveZeroes", [[ [0,1,0,3,12], [1,3,12,0,0] ]], [[ [0], [0] ]]],
    ["plus-one", "16", "Plus One", ["Arrays", "Math"], "Increment the large integer represented as digits array by one.", ["1 <= digits.length <= 100"], "plusOne", "plusOne", [[ [1,2,3], [1,2,4] ], [ [4,3,2,1], [4,3,2,2] ]], [[ [9], [1,0] ]]],
    ["sqrt-x", "17", "Sqrt(x)", ["Math", "Binary Search"], "Return the integer square root of x.", ["0 <= x <= 2^31 - 1"], "mySqrt", "mySqrt", [[ 4, 2 ], [ 8, 2 ]], [[ 0, 0 ]]],
    ["intersection-of-two-arrays-ii", "18", "Intersection of Two Arrays II", ["Arrays", "Hash Table"], "Return intersection of two arrays with duplicate counts preserved.", ["1 <= len <= 1000"], "intersect", "intersect", [[ [1,2,2,1], [2,2], [2,2] ]], [[ [4,9,5], [9,4,9,8,4], [4,9] ]]],
    ["first-unique-character-in-a-string", "19", "First Unique Character in a String", ["Hash Table", "Strings"], "Find the index of the first non-repeating character in s.", ["1 <= s.length <= 10^5"], "firstUniqChar", "firstUniqChar", [[ "leetcode", 0 ], [ "loveleetcode", 2 ]], [[ "aabb", -1 ]]],
    ["pascals-triangle", "20", "Pascal's Triangle", ["Arrays", "Dynamic Programming"], "Return the first numRows of Pascal's triangle.", ["1 <= numRows <= 30"], "generate", "generate", [[ 5, [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]] ]], [[ 1, [[1]] ]]],
    ["power-of-three", "21", "Power of Three", ["Math", "Recursion"], "Return true if n is a power of three.", ["-2^31 <= n <= 2^31 - 1"], "isPowerOfThree", "isPowerOfThree", [[ 27, true ], [ 0, false ]], [[ 9, true ]]],
    ["majority-element", "22", "Majority Element", ["Arrays", "Hash Table"], "Return the element that appears more than n/2 times in the array.", ["1 <= nums.length <= 5 * 10^4"], "majorityElement", "majorityElement", [[ [3,2,3], 3 ], [ [2,2,1,1,1,2,2], 2 ]], [[ [1], 1 ]]],
    ["reverse-bits", "23", "Reverse Bits", ["Bit Manipulation"], "Reverse bits of a given 32 bits unsigned integer.", ["32 bits integer"], "reverseBits", "reverseBits", [[ 43261596, 964176192 ]], [[ 1, 2147483648 ]]],
    ["number-of-1-bits", "24", "Number of 1 Bits", ["Bit Manipulation"], "Return the number of set bits (Hamming weight) of n.", ["1 <= n <= 2^31 - 1"], "hammingWeight", "hammingWeight", [[ 11, 3 ], [ 128, 1 ]], [[ 2147483645, 30 ]]],
    ["happy-number", "25", "Happy Number", ["Hash Table", "Math"], "Determine if a number n is a happy number.", ["1 <= n <= 2^31 - 1"], "isHappy", "isHappy", [[ 19, true ], [ 2, false ]], [[ 7, true ]]],
    ["invert-binary-tree", "26", "Invert Binary Tree", ["Trees", "BFS"], "Invert a binary tree.", ["0 <= nodes <= 100"], "invertTree", "invertTree", [[ [4,2,7,1,3,6,9], [4,7,2,9,6,3,1] ]], [[ [], [] ]]],
    ["symmetric-tree", "27", "Symmetric Tree", ["Trees", "DFS"], "Check whether a binary tree is a mirror of itself.", ["1 <= nodes <= 1000"], "isSymmetric", "isSymmetric", [[ [1,2,2,3,4,4,3], true ]], [[ [1,2,2,null,3,null,3], false ]]],
    ["implement-queue-using-stacks", "28", "Implement Queue using Stacks", ["Stack", "Queue", "Design"], "Implement a FIFO queue using only two stacks.", ["100 calls"], "queueOperations", "queueOperations", [[ ["push","push","peek","pop","empty"], [[1],[2],[],[],[]], [null,null,1,1,false] ]], [[ ["push","pop","empty"], [[5],[],[]], [null,5,true] ]]],
    ["roman-to-integer", "29", "Roman to Integer", ["Hash Table", "Math", "Strings"], "Convert a roman numeral string to an integer.", ["1 <= s.length <= 15"], "romanToInt", "romanToInt", [[ "III", 3 ], [ "LVIII", 58 ]], [[ "MCMXCIV", 1994 ]]],
    ["longest-common-prefix", "30", "Longest Common Prefix", ["Strings"], "Find the longest common prefix string amongst an array of strings.", ["1 <= strs.length <= 200"], "longestCommonPrefix", "longestCommonPrefix", [[ ["flower","flow","flight"], "fl" ], [ ["dog","racecar","car"], "" ]], [[ ["a"], "a" ]]],
    ["remove-duplicates-from-sorted-array", "31", "Remove Duplicates from Sorted Array", ["Arrays", "Two Pointers"], "Remove duplicates in-place from sorted array and return new length.", ["1 <= nums.length <= 3 * 10^4"], "removeDuplicates", "removeDuplicates", [[ [1,1,2], 2 ], [ [0,0,1,1,1,2,2,3,3,4], 5 ]], [[ [1], 1 ]]],
    ["remove-element", "32", "Remove Element", ["Arrays", "Two Pointers"], "Remove all occurrences of val in nums in-place and return new length.", ["0 <= nums.length <= 100"], "removeElement", "removeElement", [[ [3,2,2,3], 3, 2 ], [ [0,1,2,2,3,0,4,2], 2, 5 ]], [[ [], 0, 0 ]]],
    ["search-insert-position", "33", "Search Insert Position", ["Arrays", "Binary Search"], "Return index if target found or index where it should be inserted in sorted order.", ["1 <= nums.length <= 10^4"], "searchInsert", "searchInsert", [[ [1,3,5,6], 5, 2 ], [ [1,3,5,6], 2, 1 ]], [[ [1,3,5,6], 7, 4 ]]],
    ["length-of-last-word", "34", "Length of Last Word", ["Strings"], "Return the length of the last word in string s.", ["1 <= s.length <= 10^4"], "lengthOfLastWord", "lengthOfLastWord", [[ "Hello World", 5 ], [ "   fly me   to   the moon  ", 4 ]], [[ "luffy is still joyboy", 6 ]]],
    ["merge-sorted-array", "35", "Merge Sorted Array", ["Arrays", "Sorting"], "Merge nums2 into nums1 in-place as a single sorted array.", ["nums1.length == m + n"], "merge", "merge", [[ [1,2,3,0,0,0], 3, [2,5,6], 3, [1,2,2,3,5,6] ]], [[ [1], 1, [], 0, [1] ]]],
    ["same-tree", "36", "Same Tree", ["Trees", "DFS"], "Check if two binary trees are identical in structure and values.", ["0 <= nodes <= 100"], "isSameTree", "isSameTree", [[ [1,2,3], [1,2,3], true ]], [[ [1,2], [1,null,2], false ]]],
    ["path-sum", "37", "Path Sum", ["Trees", "DFS"], "Determine if the tree has a root-to-leaf path summing to targetSum.", ["0 <= nodes <= 5000"], "hasPathSum", "hasPathSum", [[ [5,4,8,11,null,13,4,7,2,null,null,null,1], 22, true ], [ [1,2,3], 5, false ]], [[ [], 0, false ]]],
    ["counting-bits", "38", "Counting Bits", ["Dynamic Programming", "Bit Manipulation"], "Return array of number of 1 bits for each number from 0 to n.", ["0 <= n <= 10^5"], "countBits", "countBits", [[ 2, [0,1,1] ], [ 5, [0,1,1,2,1,2] ]], [[ 0, [0] ]]],
    ["ransom-note", "39", "Ransom Note", ["Hash Table", "Strings"], "Check if ransomNote can be constructed from letters in magazine.", ["1 <= length <= 10^5"], "canConstruct", "canConstruct", [[ "a", "b", false ], [ "aa", "aab", true ]], [[ "aa", "ab", false ]]],
    ["is-subsequence", "40", "Is Subsequence", ["Two Pointers", "Strings"], "Return true if s is a subsequence of t.", ["0 <= s.length <= 100", "0 <= t.length <= 10^4"], "isSubsequence", "isSubsequence", [[ "abc", "ahbgdc", true ], [ "axc", "ahbgdc", false ]], [[ "", "ahbgdc", true ]]],
    ["binary-tree-inorder-traversal", "41", "Binary Tree Inorder Traversal", ["Trees", "Stack"], "Return inorder traversal of binary tree nodes.", ["0 <= nodes <= 100"], "inorderTraversal", "inorderTraversal", [[ [1,null,2,3], [1,3,2] ]], [[ [], [] ]]],
    ["find-the-index-of-the-first-occurrence-in-a-string", "42", "Find the Index of the First Occurrence in a String", ["Strings", "Two Pointers"], "Return index of first occurrence of needle in haystack or -1.", ["1 <= length <= 10^4"], "strStr", "strStr", [[ "sadbutsad", "sad", 0 ], [ "leetcode", "leeto", -1 ]], [[ "hello", "ll", 2 ]]],
    ["squares-of-a-sorted-array", "43", "Squares of a Sorted Array", ["Arrays", "Two Pointers", "Sorting"], "Return sorted squares of numbers in non-decreasing array.", ["1 <= nums.length <= 10^4"], "sortedSquares", "sortedSquares", [[ [-4,-1,0,3,10], [0,1,9,16,100] ]], [[ [-7,-3,2,3,11], [4,9,9,49,121] ]]],
    ["middle-of-the-linked-list", "44", "Middle of the Linked List", ["Linked List", "Two Pointers"], "Return middle node of singly linked list.", ["1 <= nodes <= 100"], "middleNode", "middleNode", [[ [1,2,3,4,5], [3,4,5] ], [ [1,2,3,4,5,6], [4,5,6] ]], [[ [1], [1] ]]],
    ["backspace-string-compare", "45", "Backspace String Compare", ["Two Pointers", "Stack"], "Compare two strings containing '#' backspaces.", ["1 <= length <= 200"], "backspaceCompare", "backspaceCompare", [[ "ab#c", "ad#c", true ], [ "ab##", "c#d#", true ]], [[ "a#c", "b", false ]]],
    ["kth-largest-element-in-a-stream", "46", "Kth Largest Element in a Stream", ["Heap", "Design"], "Find kth largest element in stream of integers.", ["1000 calls"], "kthLargestStream", "kthLargestStream", [[ 3, [4,5,8,2], [3,5,10,9,4], [4,5,5,8,8] ]], [[ 1, [], [-3,-2,-4,0,4], [-3,-2,-2,0,4] ]]],
    ["last-stone-weight", "47", "Last Stone Weight", ["Arrays", "Heap"], "Smash heaviest stones repeatedly until 1 or 0 remain.", ["1 <= stones.length <= 30"], "lastStoneWeight", "lastStoneWeight", [[ [2,7,4,1,8,1], 1 ], [ [1], 1 ]], [[ [2,2], 0 ]]],
    ["diameter-of-binary-tree", "48", "Diameter of Binary Tree", ["Trees", "DFS"], "Return diameter length of binary tree.", ["1 <= nodes <= 10^4"], "diameterOfBinaryTree", "diameterOfBinaryTree", [[ [1,2,3,4,5], 3 ]], [[ [1,2], 1 ]]],
    ["subtree-of-another-tree", "49", "Subtree of Another Tree", ["Trees", "DFS"], "Check if subRoot is a subtree of root.", ["1 <= nodes <= 2000"], "isSubtree", "isSubtree", [[ [3,4,5,1,2], [4,1,2], true ]], [[ [3,4,5,1,2,null,null,null,null,0], [4,1,2], false ]]],
    ["min-cost-climbing-stairs", "50", "Min Cost Climbing Stairs", ["Arrays", "Dynamic Programming"], "Return minimum cost to reach top of staircase taking 1 or 2 steps.", ["2 <= cost.length <= 1000"], "minCostClimbingStairs", "minCostClimbingStairs", [[ [10,15,20], 15 ], [ [1,100,1,1,1,100,1,1,100,1], 6 ]], [[ [0,0,0,0], 0 ]]]
  ];

  for (const item of easyList) {
    const [slug, id, title, topics, desc, constraints, mName, jsFunc, pubCases, hidCases] = item;
    const formatCases = (cList) => cList.map(c => {
      const exp = c[c.length - 1];
      const args = c.slice(0, c.length - 1);
      const inputStr = args.map((a, i) => `arg${i+1} = ${JSON.stringify(a)}`).join(", ");
      return { input: inputStr, output: JSON.stringify(exp), args, expected: exp };
    });

    add(
      slug,
      `e${id}`,
      title,
      "EASY",
      topics,
      desc,
      constraints,
      mName,
      {
        javascript: `var ${mName} = function(...args) {\n    \n};`,
        python: `class Solution:\n    def ${mName}(self, *args):\n        pass`,
        cpp: `#include <vector>\n#include <string>\nusing namespace std;\nclass Solution {\npublic:\n    // Implement ${mName}\n};`,
        java: `class Solution {\n    // Implement ${mName}\n}`
      },
      formatCases(pubCases),
      formatCases(hidCases)
    );
  }

  // Write file
  const outPath = path.join(__dirname, '../apps/web/src/lib/dsa-150-database.ts');
  const code = `import { ProblemDefinition } from "./problems-data";\n\nexport const DSA_150_PROBLEMS: Record<string, ProblemDefinition> = ${JSON.stringify(problems, null, 2)};\n`;
  fs.writeFileSync(outPath, code, 'utf8');
  console.log(`Generated ${Object.keys(problems).length} problems successfully!`);
}

buildFull150Database();
