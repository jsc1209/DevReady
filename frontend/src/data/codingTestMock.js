// 코딩 테스트 화면(CodingTestPage)용 목업 데이터.
// 원본 test-demo-UI/CodingTestPage.tsx 상단 상수를 그대로 JS 로 옮긴 것.

export const PROBLEMS = [
  {
    id: 1,
    title: "두 수의 합",
    category: "배열",
    level: "쉬움",
    acceptance: 72,
    solved: true,
    tags: ["해시맵", "두 포인터"],
    desc: `정수 배열 nums와 정수 target이 주어질 때, 두 수를 더해서 target이 되는 인덱스 쌍을 반환하세요.\n\n각 입력에 정확히 하나의 해가 존재하며, 같은 원소를 두 번 사용하지 않습니다.`,
    examples: [
      { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explain: "nums[0] + nums[1] = 2 + 7 = 9" },
      { input: "nums = [3,2,4], target = 6", output: "[1,2]", explain: "nums[1] + nums[2] = 2 + 4 = 6" },
    ],
    constraints: ["2 ≤ nums.length ≤ 10^4", "-10^9 ≤ nums[i] ≤ 10^9", "하나의 유효한 답이 반드시 존재"],
    starterCode: {
      python: `def twoSum(nums: list[int], target: int) -> list[int]:\n    # 여기에 코드를 작성하세요\n    pass`,
      javascript: `function twoSum(nums, target) {\n  // 여기에 코드를 작성하세요\n}`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // 여기에 코드를 작성하세요\n        return new int[]{};\n    }\n}`,
    },
    solution: {
      python: `def twoSum(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, v in enumerate(nums):\n        diff = target - v\n        if diff in seen:\n            return [seen[diff], i]\n        seen[v] = i`,
    },
    testCases: [
      { input: "[2,7,11,15], 9", expected: "[0,1]" },
      { input: "[3,2,4], 6", expected: "[1,2]" },
      { input: "[3,3], 6", expected: "[0,1]" },
    ],
  },
  {
    id: 2,
    title: "유효한 괄호",
    category: "스택",
    level: "쉬움",
    acceptance: 65,
    solved: true,
    tags: ["스택", "문자열"],
    desc: `괄호 문자열 s가 주어집니다. '(', ')', '{', '}', '[', ']' 로만 이루어진 문자열이 유효한지 판별하세요.\n\n유효한 문자열은:\n- 열린 괄호는 같은 종류의 닫힌 괄호로 닫혀야 합니다.\n- 열린 괄호는 올바른 순서로 닫혀야 합니다.`,
    examples: [
      { input: `s = "()"`, output: "true", explain: "유효한 괄호 쌍" },
      { input: `s = "()[]{}"`, output: "true", explain: "각각 유효한 쌍" },
      { input: `s = "(]"`, output: "false", explain: "타입이 맞지 않음" },
    ],
    constraints: ["1 ≤ s.length ≤ 10^4", "s는 괄호 문자만 포함"],
    starterCode: {
      python: `def isValid(s: str) -> bool:\n    # 여기에 코드를 작성하세요\n    pass`,
      javascript: `function isValid(s) {\n  // 여기에 코드를 작성하세요\n}`,
      java: `class Solution {\n    public boolean isValid(String s) {\n        // 여기에 코드를 작성하세요\n        return false;\n    }\n}`,
    },
    solution: {
      python: `def isValid(s: str) -> bool:\n    stack = []\n    mapping = {')': '(', '}': '{', ']': '['}\n    for c in s:\n        if c in mapping:\n            if not stack or stack[-1] != mapping[c]:\n                return False\n            stack.pop()\n        else:\n            stack.append(c)\n    return not stack`,
    },
    testCases: [
      { input: `"()"`, expected: "true" },
      { input: `"()[]{}"`, expected: "true" },
      { input: `"(]"`, expected: "false" },
    ],
  },
  {
    id: 3,
    title: "이진 탐색",
    category: "이진탐색",
    level: "쉬움",
    acceptance: 58,
    solved: false,
    tags: ["이진 탐색"],
    desc: `오름차순으로 정렬된 정수 배열 nums와 정수 target이 주어질 때, target의 인덱스를 반환하세요.\n\ntarget이 없으면 -1을 반환합니다.\n\n반드시 O(log n) 시간복잡도로 구현해야 합니다.`,
    examples: [
      { input: "nums = [-1,0,3,5,9,12], target = 9", output: "4", explain: "9는 인덱스 4에 존재" },
      { input: "nums = [-1,0,3,5,9,12], target = 2", output: "-1", explain: "2는 배열에 없음" },
    ],
    constraints: ["1 ≤ nums.length ≤ 10^4", "-10^4 < nums[i], target < 10^4", "모든 원소는 유일", "nums는 오름차순 정렬"],
    starterCode: {
      python: `def search(nums: list[int], target: int) -> int:\n    # 여기에 코드를 작성하세요\n    pass`,
      javascript: `function search(nums, target) {\n  // 여기에 코드를 작성하세요\n}`,
      java: `class Solution {\n    public int search(int[] nums, int target) {\n        // 여기에 코드를 작성하세요\n        return -1;\n    }\n}`,
    },
    solution: { python: "" },
    testCases: [
      { input: "[-1,0,3,5,9,12], 9", expected: "4" },
      { input: "[-1,0,3,5,9,12], 2", expected: "-1" },
    ],
  },
  {
    id: 4,
    title: "최장 증가 부분수열(LIS)",
    category: "동적프로그래밍",
    level: "중간",
    acceptance: 43,
    solved: false,
    tags: ["DP", "이진탐색"],
    desc: `정수 배열 nums가 주어질 때, 가장 긴 증가하는 부분수열의 길이를 반환하세요.\n\n부분수열은 배열에서 일부 원소를 순서를 유지하면서 선택한 것입니다.`,
    examples: [
      { input: "nums = [10,9,2,5,3,7,101,18]", output: "4", explain: "[2,3,7,101]" },
      { input: "nums = [0,1,0,3,2,3]", output: "4", explain: "[0,1,2,3]" },
    ],
    constraints: ["1 ≤ nums.length ≤ 2500", "-10^4 ≤ nums[i] ≤ 10^4"],
    starterCode: {
      python: `def lengthOfLIS(nums: list[int]) -> int:\n    # 여기에 코드를 작성하세요\n    pass`,
      javascript: `function lengthOfLIS(nums) {\n  // 여기에 코드를 작성하세요\n}`,
      java: `class Solution {\n    public int lengthOfLIS(int[] nums) {\n        // 여기에 코드를 작성하세요\n        return 0;\n    }\n}`,
    },
    solution: { python: "" },
    testCases: [
      { input: "[10,9,2,5,3,7,101,18]", expected: "4" },
      { input: "[0,1,0,3,2,3]", expected: "4" },
    ],
  },
  {
    id: 5,
    title: "섬의 개수",
    category: "그래프",
    level: "중간",
    acceptance: 50,
    solved: false,
    tags: ["BFS", "DFS", "유니온파인드"],
    desc: `'1'(땅)과 '0'(물)로 이루어진 2D 그리드가 주어질 때, 섬의 개수를 반환하세요.\n\n섬은 수평·수직으로 인접한 땅으로 이루어지며, 사방이 물로 둘러싸여 있습니다.`,
    examples: [
      { input: `grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]`, output: "1", explain: "연결된 하나의 섬" },
      { input: `grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]`, output: "3", explain: "3개의 섬" },
    ],
    constraints: ["m == grid.length", "n == grid[i].length", "1 ≤ m, n ≤ 300", "grid[i][j]는 '0' 또는 '1'"],
    starterCode: {
      python: `def numIslands(grid: list[list[str]]) -> int:\n    # 여기에 코드를 작성하세요\n    pass`,
      javascript: `function numIslands(grid) {\n  // 여기에 코드를 작성하세요\n}`,
      java: `class Solution {\n    public int numIslands(char[][] grid) {\n        // 여기에 코드를 작성하세요\n        return 0;\n    }\n}`,
    },
    solution: { python: "" },
    testCases: [],
  },
  {
    id: 6,
    title: "N-Queen",
    category: "백트래킹",
    level: "어려움",
    acceptance: 32,
    solved: false,
    tags: ["백트래킹"],
    desc: `N×N 체스판에 N개의 퀸을 서로 공격하지 않도록 놓는 모든 경우의 수를 반환하세요.`,
    examples: [
      { input: "n = 4", output: "2", explain: "두 가지 배치가 가능" },
      { input: "n = 1", output: "1", explain: "1×1에 퀸 1개" },
    ],
    constraints: ["1 ≤ n ≤ 9"],
    starterCode: {
      python: `def totalNQueens(n: int) -> int:\n    # 여기에 코드를 작성하세요\n    pass`,
      javascript: `function totalNQueens(n) {\n  // 여기에 코드를 작성하세요\n}`,
      java: `class Solution {\n    public int totalNQueens(int n) {\n        // 여기에 코드를 작성하세요\n        return 0;\n    }\n}`,
    },
    solution: { python: "" },
    testCases: [
      { input: "4", expected: "2" },
      { input: "1", expected: "1" },
    ],
  },
];

export const LEVELS = ["전체", "쉬움", "중간", "어려움"];
export const CATEGORIES_FILTER = ["전체", "배열", "스택", "이진탐색", "동적프로그래밍", "그래프", "백트래킹"];

// 난이도 뱃지 색(원본 text-green/yellow/red-* 조합을 정확 hex sx 객체로 변환).
// 쉬움=green / 중간=yellow / 어려움=red.
export const LEVEL_COLOR = {
  쉬움: { color: "#16A34A", bgcolor: "#F0FDF4", borderColor: "#BBF7D0" }, // green-600 / green-50 / green-200
  중간: { color: "#CA8A04", bgcolor: "#FEFCE8", borderColor: "#FEF08A" }, // yellow-600 / yellow-50 / yellow-200
  어려움: { color: "#DC2626", bgcolor: "#FEF2F2", borderColor: "#FECACA" }, // red-600 / red-50 / red-200
};
