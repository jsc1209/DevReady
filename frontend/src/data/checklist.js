// 교육 체크리스트/목표 mock + localStorage 기반 달성 기록 유틸.
// 원본 src/app/data/checklist.ts 를 JS 로 포팅(타입 제거).
// CalendarPage(교육 캘린더)가 completedOnDate/achievementHistory/completionRate 를 import.
// todayStr 은 완료일 기록용이라 real new Date() 유지(데모 결정성과 무관).

export const EDUCATION_GOALS = [
  { id: "g-algo", title: "알고리즘 기초 완성", desc: "이번 달 알고리즘 강의 완강 + 풀이 정리" },
  { id: "g-react", title: "React & TypeScript 심화", desc: "컴포넌트 설계·상태관리 마스터" },
  { id: "g-cs", title: "CS 기초 다지기", desc: "네트워크·HTTP 핵심 개념 정리" },
];

export const CHECKLIST = [
  { id: "c1", title: "이진 탐색 트리 구현 강의 수강", goalId: "g-algo" },
  { id: "c2", title: "DP 문제 5개 풀이", goalId: "g-algo" },
  { id: "c3", title: "정렬 알고리즘 비교 정리", goalId: "g-algo" },
  { id: "c4", title: "useMemo/useCallback 정리", goalId: "g-react" },
  { id: "c5", title: "TypeScript 제네릭 실습", goalId: "g-react" },
  { id: "c6", title: "상태관리 패턴 학습", goalId: "g-react" },
  { id: "c7", title: "TCP 3-way handshake 정리", goalId: "g-cs" },
  { id: "c8", title: "HTTP 캐시 헤더 학습", goalId: "g-cs" },
];

const KEY = "devready_checklist_done";

const todayStr = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

export const getDoneMap = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
};

export const isDone = (id) => id in getDoneMap();

export const toggleDone = (id) => {
  const m = getDoneMap();
  if (id in m) delete m[id];
  else m[id] = todayStr();
  localStorage.setItem(KEY, JSON.stringify(m));
};

export const completionRate = () =>
  CHECKLIST.length ? Math.round((Object.keys(getDoneMap()).length / CHECKLIST.length) * 100) : 0;

export const goalProgress = (goalId) => {
  const items = CHECKLIST.filter((c) => c.goalId === goalId);
  const done = items.filter((c) => isDone(c.id)).length;
  return { done, total: items.length, pct: items.length ? Math.round((done / items.length) * 100) : 0 };
};

export const completedOnDate = (date) => {
  const m = getDoneMap();
  return CHECKLIST.filter((c) => m[c.id] === date);
};

export const achievementHistory = () => {
  const m = getDoneMap();
  return CHECKLIST.filter((c) => m[c.id])
    .map((c) => ({ ...c, date: m[c.id] }))
    .sort((a, b) => b.date.localeCompare(a.date));
};
