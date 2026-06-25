// 랜딩 페이지 mock 데이터 (test-demo-UI/LandingPage.tsx 의 인라인 mock 을 분리)
// 모든 값은 UI 프로토타입용 정적 데이터입니다. (백엔드 없음)
import {
  Code,
  Storage,
  Layers,
  Memory,
  Public,
  Edit,
  BarChart,
  Apartment,
  Psychology,
  MenuBook,
  Work,
  Description,
  CalendarMonth,
  People,
} from "@mui/icons-material";

// 미니 캘린더용 일정 (면접·코딩테스트·공고 마감)
export const CALENDAR_EVENTS = [
  { date: "2026-06-16", type: "면접", company: "카카오", color: "#6C63FF" },
  { date: "2026-06-19", type: "코딩테스트", company: "네이버", color: "#10B981" },
  { date: "2026-06-20", type: "마감", company: "토스", color: "#EF4444" },
  { date: "2026-06-24", type: "면접", company: "당근", color: "#F59E0B" },
  { date: "2026-06-28", type: "마감", company: "라인", color: "#3B82F6" },
];

// 교육센터 학습 진행도 (EducationPage 의 COURSES 와 동일 값)
export const LEARNING_COURSES = [
  { title: "알고리즘 기초 완성", done: 28, total: 42, color: "#6366F1" },
  { title: "React & TypeScript 심화", done: 29, total: 36, color: "#F59E0B" },
  { title: "네트워크 & HTTP", done: 11, total: 24, color: "#3B82F6" },
];

export const LEARNING_OVERALL = Math.round(
  (LEARNING_COURSES.reduce((s, c) => s + c.done, 0) /
    LEARNING_COURSES.reduce((s, c) => s + c.total, 0)) *
    100
);

// 직무 카테고리 (lucide → @mui/icons-material 치환)
export const JOB_CATEGORIES = [
  { icon: Code, label: "프론트엔드" },
  { icon: Storage, label: "백엔드" },
  { icon: Layers, label: "풀스택" },
  { icon: Memory, label: "AI/ML" },
  { icon: Public, label: "DevOps" },
  { icon: Edit, label: "UI/UX" },
  { icon: BarChart, label: "데이터" },
  { icon: Apartment, label: "기획/PM" },
];

export const RECOMMENDED_JOBS = [
  {
    id: 1,
    company: "카카오",
    companyInitial: "K",
    companyColor: "#FEE500",
    textColor: "#3C1E1E",
    title: "프론트엔드 개발자 (신입/경력)",
    location: "경기 성남시",
    experience: "신입·경력",
    tags: ["React", "TypeScript"],
    deadline: "D-5",
    isNew: true,
    isSaved: false,
  },
  {
    id: 2,
    company: "네이버",
    companyInitial: "N",
    companyColor: "#03C75A",
    textColor: "#fff",
    title: "백엔드 개발자 (Java/Spring)",
    location: "경기 성남시",
    experience: "3년 이상",
    tags: ["Java", "Spring Boot"],
    deadline: "D-12",
    isNew: false,
    isSaved: true,
  },
  {
    id: 3,
    company: "토스",
    companyInitial: "T",
    companyColor: "#1B6AF6",
    textColor: "#fff",
    title: "iOS 개발자 (Swift)",
    location: "서울 강남구",
    experience: "신입·경력",
    tags: ["Swift", "SwiftUI"],
    deadline: "D-3",
    isNew: true,
    isSaved: false,
  },
  {
    id: 4,
    company: "당근",
    companyInitial: "D",
    companyColor: "#FF7E36",
    textColor: "#fff",
    title: "풀스택 개발자",
    location: "서울 서초구",
    experience: "경력 2년↑",
    tags: ["React", "Go"],
    deadline: "D-8",
    isNew: false,
    isSaved: false,
  },
  {
    id: 5,
    company: "쿠팡",
    companyInitial: "C",
    companyColor: "#EE1C25",
    textColor: "#fff",
    title: "데이터 엔지니어",
    location: "서울 송파구",
    experience: "3년 이상",
    tags: ["Python", "Spark"],
    deadline: "D-15",
    isNew: false,
    isSaved: false,
  },
  {
    id: 6,
    company: "라인",
    companyInitial: "L",
    companyColor: "#00B900",
    textColor: "#fff",
    title: "Android 개발자",
    location: "경기 성남시",
    experience: "신입·경력",
    tags: ["Kotlin", "Jetpack"],
    deadline: "D-20",
    isNew: true,
    isSaved: false,
  },
];

// 바로가기 퀵링크 (lucide → @mui/icons-material 치환)
export const QUICK_LINKS = [
  { icon: Psychology, label: "AI 모의면접", href: "/interview", highlight: true },
  { icon: MenuBook, label: "교육 강의", href: "/education" },
  { icon: Work, label: "공고 검색", href: "/jobs" },
  { icon: Description, label: "이력서 작성", href: "/resume" },
  { icon: CalendarMonth, label: "일정 관리", href: "/calendar" },
  { icon: People, label: "커뮤니티", href: "/community" },
];

export const PARTNER_COMPANIES = [
  { name: "카카오", color: "#FEE500", text: "#3C1E1E", initial: "K" },
  { name: "네이버", color: "#03C75A", text: "#fff", initial: "N" },
  { name: "토스", color: "#1B6AF6", text: "#fff", initial: "T" },
  { name: "당근마켓", color: "#FF7E36", text: "#fff", initial: "D" },
  { name: "쿠팡", color: "#EE1C25", text: "#fff", initial: "C" },
  { name: "라인", color: "#00B900", text: "#fff", initial: "L" },
  { name: "넥슨", color: "#2D2D2D", text: "#fff", initial: "NX" },
  { name: "크래프톤", color: "#1A2847", text: "#fff", initial: "KR" },
];

export const COMMUNITY_POSTS = [
  { id: 1, tag: "면접후기", title: "카카오 프론트엔드 최종합격 후기 공유합니다", likes: 148, time: "30분 전" },
  { id: 2, tag: "스터디", title: "React/TypeScript 스터디 3기 모집 (주 2회)", likes: 67, time: "1시간 전" },
  { id: 3, tag: "질문", title: "CS 질문 - OS 스케줄링 알고리즘 이해가 잘 안되는데요", likes: 34, time: "2시간 전" },
  { id: 4, tag: "자유", title: "취준 6개월 만에 토스 최종합격했습니다 ㅠㅠ", likes: 312, time: "3시간 전" },
];

export const TAG_COLORS = {
  면접후기: "#6C63FF",
  스터디: "#10B981",
  질문: "#F59E0B",
  자유: "#6B7280",
};
