import { ProblemDefinition } from "./problems-data";

export const BASIC_PRACTICE_PROBLEMS: Record<string, ProblemDefinition> = {
  "check-bar-entry-status": {
    id: "basic-1",
    slug: "check-bar-entry-status",
    title: "Check Bar Entry Status",
    difficulty: "EASY",
    topics: [{ name: "Conditionals" }, { name: "Logic" }],
    description: `A person wants to enter a bar. They are allowed entry only if they are **at least 21 years old** (\`age >= 21\`) **AND** possess a valid government ID (\`hasId === true\`).

Given an integer \`age\` and a boolean \`hasId\`, return \`"Allowed"\` if they meet both requirements, otherwise return \`"Denied"\`.`,
    constraints: [
      "1 <= age <= 120",
      "hasId is a boolean (true or false)"
    ],
    methodName: "checkBarEntry",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {number} age
 * @param {boolean} hasId
 * @return {string}
 */
var checkBarEntry = function(age, hasId) {
    if (age >= 21 && hasId) {
        return "Allowed";
    }
    return "Denied";
};`,
      python: `class Solution:
    def checkBarEntry(self, age: int, hasId: bool) -> str:
        if age >= 21 and hasId:
            return "Allowed"
        return "Denied"`,
      cpp: `#include <string>
using namespace std;

class Solution {
public:
    string checkBarEntry(int age, bool hasId) {
        if (age >= 21 && hasId) {
            return "Allowed";
        }
        return "Denied";
    }
};`,
      java: `class Solution {
    public String checkBarEntry(int age, boolean hasId) {
        if (age >= 21 && hasId) {
            return "Allowed";
        }
        return "Denied";
    }
}`
    },
    publicTestCases: [
      {
        input: "age = 21, hasId = true",
        output: '"Allowed"',
        args: [21, true],
        expected: "Allowed"
      },
      {
        input: "age = 19, hasId = true",
        output: '"Denied"',
        args: [19, true],
        expected: "Denied"
      },
      {
        input: "age = 25, hasId = false",
        output: '"Denied"',
        args: [25, false],
        expected: "Denied"
      }
    ],
    hiddenTestCases: [
      {
        input: "age = 30, hasId = true",
        output: '"Allowed"',
        args: [30, true],
        expected: "Allowed"
      },
      {
        input: "age = 16, hasId = false",
        output: '"Denied"',
        args: [16, false],
        expected: "Denied"
      },
      {
        input: "age = 20, hasId = true",
        output: '"Denied"',
        args: [20, true],
        expected: "Denied"
      },
      {
        input: "age = 21, hasId = false",
        output: '"Denied"',
        args: [21, false],
        expected: "Denied"
      }
    ]
  },

  "check-bar-entry": {
    id: "basic-1-alias",
    slug: "check-bar-entry",
    title: "Check Bar Entry Status",
    difficulty: "EASY",
    topics: [{ name: "Conditionals" }, { name: "Logic" }],
    description: `A person wants to enter a bar. They are allowed entry only if they are **at least 21 years old** (\`age >= 21\`) **AND** possess a valid government ID (\`hasId === true\`).

Given an integer \`age\` and a boolean \`hasId\`, return \`"Allowed"\` if they meet both requirements, otherwise return \`"Denied"\`.`,
    constraints: [
      "1 <= age <= 120",
      "hasId is a boolean (true or false)"
    ],
    methodName: "checkBarEntry",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {number} age
 * @param {boolean} hasId
 * @return {string}
 */
var checkBarEntry = function(age, hasId) {
    if (age >= 21 && hasId) {
        return "Allowed";
    }
    return "Denied";
};`,
      python: `class Solution:
    def checkBarEntry(self, age: int, hasId: bool) -> str:
        if age >= 21 and hasId:
            return "Allowed"
        return "Denied"`,
      cpp: `#include <string>
using namespace std;

class Solution {
public:
    string checkBarEntry(int age, bool hasId) {
        if (age >= 21 && hasId) {
            return "Allowed";
        }
        return "Denied";
    }
};`,
      java: `class Solution {
    public String checkBarEntry(int age, boolean hasId) {
        if (age >= 21 && hasId) {
            return "Allowed";
        }
        return "Denied";
    }
}`
    },
    publicTestCases: [
      {
        input: "age = 21, hasId = true",
        output: '"Allowed"',
        args: [21, true],
        expected: "Allowed"
      },
      {
        input: "age = 19, hasId = true",
        output: '"Denied"',
        args: [19, true],
        expected: "Denied"
      },
      {
        input: "age = 25, hasId = false",
        output: '"Denied"',
        args: [25, false],
        expected: "Denied"
      }
    ],
    hiddenTestCases: [
      {
        input: "age = 30, hasId = true",
        output: '"Allowed"',
        args: [30, true],
        expected: "Allowed"
      },
      {
        input: "age = 16, hasId = false",
        output: '"Denied"',
        args: [16, false],
        expected: "Denied"
      },
      {
        input: "age = 20, hasId = true",
        output: '"Denied"',
        args: [20, true],
        expected: "Denied"
      },
      {
        input: "age = 21, hasId = false",
        output: '"Denied"',
        args: [21, false],
        expected: "Denied"
      }
    ]
  },

  "area-of-square": {
    id: "basic-2",
    slug: "area-of-square",
    title: "Area of Square",
    difficulty: "EASY",
    topics: [{ name: "Math" }, { name: "Geometry" }],
    description: `Given the side length \`side\` of a square, calculate and return its total area.

$$\\text{Area} = \\text{side} \\times \\text{side}$$`,
    constraints: [
      "1 <= side <= 10^4"
    ],
    methodName: "areaOfSquare",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {number} side
 * @return {number}
 */
var areaOfSquare = function(side) {
    return side * side;
};`,
      python: `class Solution:
    def areaOfSquare(self, side: int) -> int:
        return side * side`,
      cpp: `class Solution {
public:
    int areaOfSquare(int side) {
        return side * side;
    }
};`,
      java: `class Solution {
    public int areaOfSquare(int side) {
        return side * side;
    }
}`
    },
    publicTestCases: [
      {
        input: "side = 5",
        output: "25",
        args: [5],
        expected: 25
      },
      {
        input: "side = 10",
        output: "100",
        args: [10],
        expected: 100
      },
      {
        input: "side = 1",
        output: "1",
        args: [1],
        expected: 1
      }
    ],
    hiddenTestCases: [
      {
        input: "side = 12",
        output: "144",
        args: [12],
        expected: 144
      },
      {
        input: "side = 7",
        output: "49",
        args: [7],
        expected: 49
      },
      {
        input: "side = 20",
        output: "400",
        args: [20],
        expected: 400
      }
    ]
  },

  "area-of-triangle": {
    id: "basic-3",
    slug: "area-of-triangle",
    title: "Area of Triangle",
    difficulty: "EASY",
    topics: [{ name: "Math" }, { name: "Geometry" }],
    description: `Given the \`base\` and \`height\` of a triangle, calculate and return its area.

$$\\text{Area} = \\frac{1}{2} \\times \\text{base} \\times \\text{height}$$`,
    constraints: [
      "1 <= base, height <= 10^4"
    ],
    methodName: "areaOfTriangle",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {number} base
 * @param {number} height
 * @return {number}
 */
var areaOfTriangle = function(base, height) {
    return (base * height) / 2;
};`,
      python: `class Solution:
    def areaOfTriangle(self, base: float, height: float) -> float:
        return (base * height) / 2.0`,
      cpp: `class Solution {
public:
    double areaOfTriangle(double base, double height) {
        return (base * height) / 2.0;
    }
};`,
      java: `class Solution {
    public double areaOfTriangle(double base, double height) {
        return (base * height) / 2.0;
    }
}`
    },
    publicTestCases: [
      {
        input: "base = 10, height = 5",
        output: "25",
        args: [10, 5],
        expected: 25
      },
      {
        input: "base = 7, height = 4",
        output: "14",
        args: [7, 4],
        expected: 14
      },
      {
        input: "base = 6, height = 8",
        output: "24",
        args: [6, 8],
        expected: 24
      }
    ],
    hiddenTestCases: [
      {
        input: "base = 3, height = 6",
        output: "9",
        args: [3, 6],
        expected: 9
      },
      {
        input: "base = 12, height = 10",
        output: "60",
        args: [12, 10],
        expected: 60
      },
      {
        input: "base = 5, height = 9",
        output: "22.5",
        args: [5, 9],
        expected: 22.5
      }
    ]
  },

  "area-of-circle": {
    id: "basic-4",
    slug: "area-of-circle",
    title: "Area of Circle",
    difficulty: "EASY",
    topics: [{ name: "Math" }, { name: "Geometry" }],
    description: `Given the \`radius\` of a circle, calculate its area rounded to 2 decimal places.

$$\\text{Area} = \\pi \\times \\text{radius}^2$$

Return the computed area as a number rounded to 2 decimal places (using $\\pi \\approx 3.14159...$).`,
    constraints: [
      "1 <= radius <= 1000"
    ],
    methodName: "areaOfCircle",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {number} radius
 * @return {number}
 */
var areaOfCircle = function(radius) {
    const area = Math.PI * radius * radius;
    return Math.round(area * 100) / 100;
};`,
      python: `import math

class Solution:
    def areaOfCircle(self, radius: float) -> float:
        area = math.pi * radius * radius
        return round(area, 2)`,
      cpp: `#include <cmath>
using namespace std;

class Solution {
public:
    double areaOfCircle(double radius) {
        double area = M_PI * radius * radius;
        return round(area * 100.0) / 100.0;
    }
};`,
      java: `class Solution {
    public double areaOfCircle(double radius) {
        double area = Math.PI * radius * radius;
        return Math.round(area * 100.0) / 100.0;
    }
}`
    },
    publicTestCases: [
      {
        input: "radius = 5",
        output: "78.54",
        args: [5],
        expected: 78.54
      },
      {
        input: "radius = 1",
        output: "3.14",
        args: [1],
        expected: 3.14
      },
      {
        input: "radius = 10",
        output: "314.16",
        args: [10],
        expected: 314.16
      }
    ],
    hiddenTestCases: [
      {
        input: "radius = 7",
        output: "153.94",
        args: [7],
        expected: 153.94
      },
      {
        input: "radius = 3",
        output: "28.27",
        args: [3],
        expected: 28.27
      },
      {
        input: "radius = 2",
        output: "12.57",
        args: [2],
        expected: 12.57
      }
    ]
  },

  "area-of-rectangle": {
    id: "basic-5",
    slug: "area-of-rectangle",
    title: "Area of Rectangle",
    difficulty: "EASY",
    topics: [{ name: "Math" }, { name: "Geometry" }],
    description: `Given the \`length\` and \`width\` of a rectangle, calculate and return its area.

$$\\text{Area} = \\text{length} \\times \\text{width}$$`,
    constraints: [
      "1 <= length, width <= 10^4"
    ],
    methodName: "areaOfRectangle",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {number} length
 * @param {number} width
 * @return {number}
 */
var areaOfRectangle = function(length, width) {
    return length * width;
};`,
      python: `class Solution:
    def areaOfRectangle(self, length: int, width: int) -> int:
        return length * width`,
      cpp: `class Solution {
public:
    int areaOfRectangle(int length, int width) {
        return length * width;
    }
};`,
      java: `class Solution {
    public int areaOfRectangle(int length, int width) {
        return length * width;
    }
}`
    },
    publicTestCases: [
      {
        input: "length = 5, width = 4",
        output: "20",
        args: [5, 4],
        expected: 20
      },
      {
        input: "length = 10, width = 2",
        output: "20",
        args: [10, 2],
        expected: 20
      },
      {
        input: "length = 8, width = 6",
        output: "48",
        args: [8, 6],
        expected: 48
      }
    ],
    hiddenTestCases: [
      {
        input: "length = 12, width = 3",
        output: "36",
        args: [12, 3],
        expected: 36
      },
      {
        input: "length = 15, width = 5",
        output: "75",
        args: [15, 5],
        expected: 75
      }
    ]
  },

  "even-or-odd": {
    id: "basic-6",
    slug: "even-or-odd",
    title: "Check Even or Odd",
    difficulty: "EASY",
    topics: [{ name: "Conditionals" }, { name: "Math" }],
    description: `Given an integer \`n\`, return \`"Even"\` if the number is even, and \`"Odd"\` if the number is odd.`,
    constraints: [
      "-10^9 <= n <= 10^9"
    ],
    methodName: "evenOrOdd",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {number} n
 * @return {string}
 */
var evenOrOdd = function(n) {
    return n % 2 === 0 ? "Even" : "Odd";
};`,
      python: `class Solution:
    def evenOrOdd(self, n: int) -> str:
        return "Even" if n % 2 == 0 else "Odd"`,
      cpp: `#include <string>
using namespace std;

class Solution {
public:
    string evenOrOdd(int n) {
        return (n % 2 == 0) ? "Even" : "Odd";
    }
};`,
      java: `class Solution {
    public String evenOrOdd(int n) {
        return (n % 2 == 0) ? "Even" : "Odd";
    }
}`
    },
    publicTestCases: [
      {
        input: "n = 4",
        output: '"Even"',
        args: [4],
        expected: "Even"
      },
      {
        input: "n = 7",
        output: '"Odd"',
        args: [7],
        expected: "Odd"
      },
      {
        input: "n = 0",
        output: '"Even"',
        args: [0],
        expected: "Even"
      }
    ],
    hiddenTestCases: [
      {
        input: "n = -3",
        output: '"Odd"',
        args: [-3],
        expected: "Odd"
      },
      {
        input: "n = 102",
        output: '"Even"',
        args: [102],
        expected: "Even"
      }
    ]
  },

  "max-of-two-numbers": {
    id: "basic-7",
    slug: "max-of-two-numbers",
    title: "Find Maximum of Two Numbers",
    difficulty: "EASY",
    topics: [{ name: "Conditionals" }, { name: "Logic" }],
    description: `Given two integers \`a\` and \`b\`, return the maximum (greater) of the two values using conditional logic.`,
    constraints: [
      "-10^9 <= a, b <= 10^9"
    ],
    methodName: "findMax",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {number} a
 * @param {number} b
 * @return {number}
 */
var findMax = function(a, b) {
    return a > b ? a : b;
};`,
      python: `class Solution:
    def findMax(self, a: int, b: int) -> int:
        return a if a > b else b`,
      cpp: `class Solution {
public:
    int findMax(int a, int b) {
        return (a > b) ? a : b;
    }
};`,
      java: `class Solution {
    public int findMax(int a, int b) {
        return (a > b) ? a : b;
    }
}`
    },
    publicTestCases: [
      {
        input: "a = 10, b = 20",
        output: "20",
        args: [10, 20],
        expected: 20
      },
      {
        input: "a = 50, b = 15",
        output: "50",
        args: [50, 15],
        expected: 50
      },
      {
        input: "a = -5, b = -2",
        output: "-2",
        args: [-5, -2],
        expected: -2
      }
    ],
    hiddenTestCases: [
      {
        input: "a = 100, b = 100",
        output: "100",
        args: [100, 100],
        expected: 100
      },
      {
        input: "a = -20, b = 0",
        output: "0",
        args: [-20, 0],
        expected: 0
      }
    ]
  },

  "check-voting-eligibility": {
    id: "basic-8",
    slug: "check-voting-eligibility",
    title: "Check Voting Eligibility",
    difficulty: "EASY",
    topics: [{ name: "Conditionals" }, { name: "Logic" }],
    description: `Given a person's \`age\`, return \`"Eligible"\` if their age is 18 or older (\`age >= 18\`), otherwise return \`"Not Eligible"\`.`,
    constraints: [
      "1 <= age <= 120"
    ],
    methodName: "checkVotingEligibility",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {number} age
 * @return {string}
 */
var checkVotingEligibility = function(age) {
    return age >= 18 ? "Eligible" : "Not Eligible";
};`,
      python: `class Solution:
    def checkVotingEligibility(self, age: int) -> str:
        return "Eligible" if age >= 18 else "Not Eligible"`,
      cpp: `#include <string>
using namespace std;

class Solution {
public:
    string checkVotingEligibility(int age) {
        return (age >= 18) ? "Eligible" : "Not Eligible";
    }
};`,
      java: `class Solution {
    public String checkVotingEligibility(int age) {
        return (age >= 18) ? "Eligible" : "Not Eligible";
    }
}`
    },
    publicTestCases: [
      {
        input: "age = 18",
        output: '"Eligible"',
        args: [18],
        expected: "Eligible"
      },
      {
        input: "age = 21",
        output: '"Eligible"',
        args: [21],
        expected: "Eligible"
      },
      {
        input: "age = 15",
        output: '"Not Eligible"',
        args: [15],
        expected: "Not Eligible"
      }
    ],
    hiddenTestCases: [
      {
        input: "age = 65",
        output: '"Eligible"',
        args: [65],
        expected: "Eligible"
      },
      {
        input: "age = 17",
        output: '"Not Eligible"',
        args: [17],
        expected: "Not Eligible"
      }
    ]
  },

  "grade-calculator": {
    id: "basic-9",
    slug: "grade-calculator",
    title: "Grade Calculator",
    difficulty: "EASY",
    topics: [{ name: "Conditionals" }, { name: "Logic" }],
    description: `Given a student's numeric score \`marks\` ($0 \\le \\text{marks} \\le 100$), return their letter grade as follows:
- $\\ge 90$: \`"A"\`
- $80 - 89$: \`"B"\`
- $70 - 79$: \`"C"\`
- $60 - 69$: \`"D"\`
- $< 60$: \`"F"\``,
    constraints: [
      "0 <= marks <= 100"
    ],
    methodName: "calculateGrade",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {number} marks
 * @return {string}
 */
var calculateGrade = function(marks) {
    if (marks >= 90) return "A";
    if (marks >= 80) return "B";
    if (marks >= 70) return "C";
    if (marks >= 60) return "D";
    return "F";
};`,
      python: `class Solution:
    def calculateGrade(self, marks: int) -> str:
        if marks >= 90: return "A"
        if marks >= 80: return "B"
        if marks >= 70: return "C"
        if marks >= 60: return "D"
        return "F"`,
      cpp: `#include <string>
using namespace std;

class Solution {
public:
    string calculateGrade(int marks) {
        if (marks >= 90) return "A";
        if (marks >= 80) return "B";
        if (marks >= 70) return "C";
        if (marks >= 60) return "D";
        return "F";
    }
};`,
      java: `class Solution {
    public String calculateGrade(int marks) {
        if (marks >= 90) return "A";
        if (marks >= 80) return "B";
        if (marks >= 70) return "C";
        if (marks >= 60) return "D";
        return "F";
    }
}`
    },
    publicTestCases: [
      {
        input: "marks = 95",
        output: '"A"',
        args: [95],
        expected: "A"
      },
      {
        input: "marks = 82",
        output: '"B"',
        args: [82],
        expected: "B"
      },
      {
        input: "marks = 74",
        output: '"C"',
        args: [74],
        expected: "C"
      }
    ],
    hiddenTestCases: [
      {
        input: "marks = 65",
        output: '"D"',
        args: [65],
        expected: "D"
      },
      {
        input: "marks = 45",
        output: '"F"',
        args: [45],
        expected: "F"
      },
      {
        input: "marks = 90",
        output: '"A"',
        args: [90],
        expected: "A"
      }
    ]
  },

  "check-number-sign": {
    id: "basic-10",
    slug: "check-number-sign",
    title: "Check Number Sign",
    difficulty: "EASY",
    topics: [{ name: "Conditionals" }, { name: "Math" }],
    description: `Given an integer \`n\`, return \`"Positive"\` if $n > 0$, \`"Negative"\` if $n < 0$, and \`"Zero"\` if $n = 0$.`,
    constraints: [
      "-10^9 <= n <= 10^9"
    ],
    methodName: "checkNumberSign",
    supportedLanguages: ["javascript", "python", "cpp", "java"],
    starterCode: {
      javascript: `/**
 * @param {number} n
 * @return {string}
 */
var checkNumberSign = function(n) {
    if (n > 0) return "Positive";
    if (n < 0) return "Negative";
    return "Zero";
};`,
      python: `class Solution:
    def checkNumberSign(self, n: int) -> str:
        if n > 0: return "Positive"
        if n < 0: return "Negative"
        return "Zero"`,
      cpp: `#include <string>
using namespace std;

class Solution {
public:
    string checkNumberSign(int n) {
        if (n > 0) return "Positive";
        if (n < 0) return "Negative";
        return "Zero";
    }
};`,
      java: `class Solution {
    public String checkNumberSign(int n) {
        if (n > 0) return "Positive";
        if (n < 0) return "Negative";
        return "Zero";
    }
}`
    },
    publicTestCases: [
      {
        input: "n = 15",
        output: '"Positive"',
        args: [15],
        expected: "Positive"
      },
      {
        input: "n = -8",
        output: '"Negative"',
        args: [-8],
        expected: "Negative"
      },
      {
        input: "n = 0",
        output: '"Zero"',
        args: [0],
        expected: "Zero"
      }
    ],
    hiddenTestCases: [
      {
        input: "n = 100",
        output: '"Positive"',
        args: [100],
        expected: "Positive"
      },
      {
        input: "n = -1",
        output: '"Negative"',
        args: [-1],
        expected: "Negative"
      }
    ]
  }
};
