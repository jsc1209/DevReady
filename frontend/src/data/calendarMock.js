// 캘린더(/calendar) 공고·교육 일정 mock + 학습 진행도 mock.
// 원본 test-demo-UI/CalendarPage.tsx 상단의 배열 값을 분리.
// saved: true = 찜 목록(1순위), false = AI 추천(2순위)

export const JOB_EVENTS = [
  {
    id: "1", company: "카카오", title: "프론트엔드 개발자", location: "판교",
    start: "2026-06-01", end: "2026-06-20",
    color: "#6C63FF", bg: "#EDE9FF", textColor: "#6C63FF", saved: true,
  },
  {
    id: "2", company: "네이버", title: "풀스택 개발자", location: "분당",
    start: "2026-06-05", end: "2026-06-25",
    color: "#10B981", bg: "#D1FAE5", textColor: "#059669", saved: true,
  },
  {
    id: "3", company: "토스", title: "백엔드 개발자 (Java)", location: "강남",
    start: "2026-06-10", end: "2026-07-01",
    color: "#3B82F6", bg: "#DBEAFE", textColor: "#2563EB", saved: true,
  },
  {
    id: "4", company: "라인", title: "프론트엔드 신입", location: "신촌",
    start: "2026-06-15", end: "2026-06-28",
    color: "#F59E0B", bg: "#FEF3C7", textColor: "#D97706", saved: false,
  },
  {
    id: "5", company: "쿠팡", title: "데이터 엔지니어", location: "잠실",
    start: "2026-06-18", end: "2026-07-10",
    color: "#EF4444", bg: "#FEE2E2", textColor: "#DC2626", saved: false,
  },
  {
    id: "6", company: "당근", title: "Android 개발자", location: "서초",
    start: "2026-06-14", end: "2026-06-30",
    color: "#F97316", bg: "#FFEDD5", textColor: "#EA580C", saved: true,
  },
  {
    id: "7", company: "배달의민족", title: "백엔드 개발자", location: "송파",
    start: "2026-06-20", end: "2026-07-05",
    color: "#14B8A6", bg: "#CCFBF1", textColor: "#0D9488", saved: false,
  },
];

// 교육 캘린더 mock (수강 강의 일정) · saved: true = 찜(수강), false = AI 추천 강의
export const EDU_EVENTS = [
  { id: "e1", company: "알고리즘", title: "알고리즘 기초 완성", location: "온라인", start: "2026-06-02", end: "2026-06-22", color: "#6366F1", bg: "#EDE9FF", textColor: "#6366F1", saved: true },
  { id: "e2", company: "CS 기초", title: "네트워크 & HTTP", location: "온라인", start: "2026-06-08", end: "2026-06-26", color: "#10B981", bg: "#D1FAE5", textColor: "#059669", saved: true },
  { id: "e3", company: "프론트엔드", title: "React & TypeScript 심화", location: "온라인", start: "2026-06-12", end: "2026-07-02", color: "#F59E0B", bg: "#FEF3C7", textColor: "#D97706", saved: true },
  { id: "e4", company: "백엔드", title: "Spring Boot & JPA", location: "온라인", start: "2026-06-16", end: "2026-07-08", color: "#EC4899", bg: "#FCE7F3", textColor: "#DB2777", saved: false },
  { id: "e5", company: "데이터", title: "SQL & 데이터베이스", location: "온라인", start: "2026-06-10", end: "2026-06-28", color: "#3B82F6", bg: "#DBEAFE", textColor: "#2563EB", saved: false },
  { id: "e6", company: "DevOps", title: "Docker & 쿠버네티스", location: "온라인", start: "2026-06-18", end: "2026-07-10", color: "#8B5CF6", bg: "#EDE9FE", textColor: "#7C3AED", saved: false },
];

// 교육센터 학습 진행도 mock (EducationPage의 COURSES와 동일 값)
export const LEARNING_COURSES = [
  { title: "알고리즘 기초 완성", done: 28, total: 42, color: "#6366F1" },
  { title: "React & TypeScript 심화", done: 29, total: 36, color: "#F59E0B" },
  { title: "네트워크 & HTTP", done: 11, total: 24, color: "#3B82F6" },
  { title: "Spring Boot & JPA", done: 5, total: 30, color: "#EC4899" },
];

export const LEARNING_OVERALL = Math.round(
  (LEARNING_COURSES.reduce((s, c) => s + c.done, 0) /
    LEARNING_COURSES.reduce((s, c) => s + c.total, 0)) * 100
);

export const DAYS_OF_WEEK = ["일", "월", "화", "수", "목", "금", "토"];
