// 교육 센터(/education) 화면 mock 데이터.
// 아이콘은 lucide → @mui/icons-material 치환한 컴포넌트로 보관(landingMock 패턴).
// 원본 매핑: Code2→Code, Network→Lan, Database→Storage, Brain→Psychology, Server→Dns
import { Code, Lan, Storage, Psychology, Dns } from "@mui/icons-material";

// 카테고리 필터
export const CATEGORIES = [
  { id: "all", label: "전체" },
  { id: "algorithm", label: "알고리즘" },
  { id: "cs", label: "CS 기초" },
  { id: "frontend", label: "프론트엔드" },
  { id: "backend", label: "백엔드" },
];

// 강좌 목록 (icon = @mui/icons-material 컴포넌트)
export const COURSES = [
  {
    id: 1,
    category: "algorithm",
    icon: Code,
    color: "#6366F1",
    title: "알고리즘 기초 완성",
    desc: "정렬·탐색·DP·그래프를 코딩테스트 관점에서 체계적으로",
    progress: 68,
    total: 42,
    done: 28,
    level: "중급",
    time: "8시간",
  },
  {
    id: 2,
    category: "cs",
    icon: Lan,
    color: "#3B82F6",
    title: "네트워크 & HTTP",
    desc: "OSI 7계층, TCP/IP, HTTP/HTTPS, REST, WebSocket",
    progress: 45,
    total: 24,
    done: 11,
    level: "기초",
    time: "4시간",
  },
  {
    id: 3,
    category: "cs",
    icon: Storage,
    color: "#10B981",
    title: "데이터베이스 핵심",
    desc: "정규화, 인덱스, 트랜잭션, SQL 최적화",
    progress: 30,
    total: 20,
    done: 6,
    level: "중급",
    time: "5시간",
  },
  {
    id: 4,
    category: "frontend",
    icon: Psychology,
    color: "#F59E0B",
    title: "React & TypeScript 심화",
    desc: "훅, 상태관리, 성능 최적화, 타입 시스템",
    progress: 80,
    total: 36,
    done: 29,
    level: "심화",
    time: "10시간",
  },
  {
    id: 5,
    category: "backend",
    icon: Dns,
    color: "#EC4899",
    title: "Spring Boot & JPA",
    desc: "의존성 주입, JPA 연관관계, JWT 인증, API 설계",
    progress: 15,
    total: 30,
    done: 5,
    level: "중급",
    time: "9시간",
  },
  {
    id: 6,
    category: "cs",
    icon: Psychology,
    color: "#8B5CF6",
    title: "운영체제 핵심 개념",
    desc: "프로세스·스레드, 메모리 관리, 동기화, 데드락",
    progress: 0,
    total: 18,
    done: 0,
    level: "기초",
    time: "4시간",
  },
];

// 취약 개념 (오답 기반 자동 선정)
export const WEAK_CONCEPTS = [
  { title: "Virtual DOM & Reconciliation", category: "프론트엔드", wrongRate: 72 },
  { title: "TCP 3-way Handshake", category: "네트워크", wrongRate: 65 },
  { title: "트랜잭션 격리 수준", category: "DB", wrongRate: 58 },
];

// 오늘의 AI 추천 퀴즈 주제
export const QUIZ_TOPICS = [
  { label: "React Hook 동작 원리", category: "프론트엔드" },
  { label: "정렬 알고리즘 시간복잡도", category: "알고리즘" },
  { label: "HTTP 메서드 차이", category: "네트워크" },
  { label: "자바스크립트 이벤트 루프", category: "프론트엔드" },
  { label: "DB 트랜잭션 격리수준", category: "DB" },
  { label: "프로세스 vs 스레드", category: "OS" },
];

// AI 생성 퀴즈 (type = "multiple" | "ox" | "descriptive")
export const ALL_QUIZZES = [
  {
    type: "multiple",
    q: "React에서 useEffect의 두 번째 인자(deps 배열)를 빈 배열로 넣으면 어떻게 동작하나요?",
    opts: ["매 렌더마다 실행", "컴포넌트 마운트 시 1회 실행", "언마운트 시에만 실행", "실행되지 않음"],
    answer: 1,
    explanation: "빈 배열 []을 전달하면 컴포넌트가 마운트될 때 단 한 번만 실행됩니다. componentDidMount와 같은 동작입니다.",
  },
  {
    type: "ox",
    q: "HTTP는 Stateless(무상태) 프로토콜이다.",
    answer: "O",
    explanation: "HTTP는 각 요청이 독립적이며 이전 요청 상태를 저장하지 않는 무상태 프로토콜입니다. 상태 유지를 위해 쿠키·세션·JWT를 사용합니다.",
  },
  {
    type: "multiple",
    q: "자바스크립트 이벤트 루프에서 마이크로태스크 큐가 매크로태스크보다 먼저 처리되는 이유는?",
    opts: ["V8 엔진 설계상 우선순위", "Promise가 더 최신 기술이라서", "콜 스택이 비면 마이크로태스크 큐를 먼저 소진하도록 명세 정의", "브라우저 제조사 임의 결정"],
    answer: 2,
    explanation: "ECMAScript 명세에서 콜 스택이 비면 마이크로태스크 큐를 완전히 소진한 후 렌더링 → 매크로태스크 순서로 진행합니다.",
  },
  {
    type: "ox",
    q: "TCP는 연결을 맺을 때 2-way handshake를 사용한다.",
    answer: "X",
    explanation: "TCP는 3-way handshake(SYN → SYN-ACK → ACK)를 사용합니다. 2-way는 연결의 신뢰성을 보장하지 못합니다.",
  },
  {
    type: "descriptive",
    q: "가상 DOM(Virtual DOM)이 실제 DOM보다 성능상 유리한 이유를 설명하세요.",
    answer: "메모리상의 가상 DOM에서 변경을 먼저 계산(diffing)하고, 실제 변경된 부분만 실제 DOM에 적용(reconciliation)하여 불필요한 리렌더링을 최소화합니다.",
    explanation: "React의 재조정(Reconciliation) 알고리즘은 이전 Virtual DOM 트리와 새 트리를 비교해 최소한의 실제 DOM 조작만 수행합니다.",
  },
  {
    type: "multiple",
    q: "DB에서 REPEATABLE READ 격리 수준이 방지하는 문제는?",
    opts: ["Dirty Read", "Non-Repeatable Read", "Phantom Read", "Lost Update"],
    answer: 1,
    explanation: "REPEATABLE READ는 같은 트랜잭션 내에서 같은 행을 두 번 읽어도 결과가 같도록 보장합니다. Non-Repeatable Read를 방지합니다.",
  },
  {
    type: "ox",
    q: "프로세스는 스레드보다 컨텍스트 스위칭 비용이 더 크다.",
    answer: "O",
    explanation: "프로세스는 독립적인 메모리 공간을 가지므로 컨텍스트 스위칭 시 TLB 플러시, 메모리 매핑 교체 등 비용이 큽니다. 스레드는 같은 주소 공간을 공유해 비용이 작습니다.",
  },
  {
    type: "descriptive",
    q: "REST API에서 PUT과 PATCH의 차이를 설명하세요.",
    answer: "PUT은 리소스 전체를 교체하는 완전 대체(idempotent)이며, PATCH는 리소스의 일부만 수정하는 부분 업데이트입니다.",
    explanation: "PUT 요청 시 전송하지 않은 필드는 null/기본값으로 초기화될 수 있으므로, 부분 수정 시에는 PATCH를 사용하는 것이 적합합니다.",
  },
];
