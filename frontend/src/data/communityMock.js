// 커뮤니티(/community) 페이지가 사용하는 mock 데이터.
// 원본 test-demo-UI/CommunityPage.tsx 의 정적 데이터 export 를 분리.
// TABS 의 아이콘은 컴포넌트 참조이므로 data 엔 iconKey(문자열)만 두고,
// 페이지에서 실제 @mui 아이콘 컴포넌트로 매핑한다.

export const TABS = [
  { id: "qna", label: "질문 아카이브", iconKey: "help" },
  { id: "free", label: "자유 게시판", iconKey: "file" },
];

export const QNA_CATEGORIES = [
  "전체",
  "프론트엔드",
  "백엔드",
  "CS 기초",
  "알고리즘",
  "DevOps",
  "인성",
];

export const INIT_QNAS = [
  { id: 1, title: "React의 useCallback과 useMemo의 차이가 뭔가요?", category: "프론트엔드", tags: ["React", "성능"], answers: 8, views: 124, bookmarked: false },
  { id: 2, title: "JWT 토큰과 세션 기반 인증의 장단점을 설명해주세요", category: "백엔드", tags: ["보안", "백엔드"], answers: 12, views: 231, bookmarked: true },
  { id: 3, title: "인덱스를 과도하게 사용하면 왜 성능이 저하되나요?", category: "CS 기초", tags: ["DB", "최적화"], answers: 6, views: 89, bookmarked: false },
  { id: 4, title: "프로세스와 스레드의 차이점은 무엇인가요?", category: "CS 기초", tags: ["OS", "CS 기초"], answers: 14, views: 310, bookmarked: false },
  { id: 5, title: "Docker와 VM의 차이점을 설명해주세요", category: "DevOps", tags: ["Docker", "DevOps"], answers: 9, views: 178, bookmarked: false },
  { id: 6, title: "자신의 강점과 약점을 말씀해주세요", category: "인성", tags: ["인성", "자기소개"], answers: 5, views: 67, bookmarked: false },
  { id: 7, title: "RESTful API 설계 원칙에 대해 설명해주세요", category: "백엔드", tags: ["REST", "API"], answers: 11, views: 195, bookmarked: false },
  { id: 8, title: "BFS와 DFS의 차이점과 적합한 사용 사례는?", category: "알고리즘", tags: ["BFS", "DFS", "그래프"], answers: 7, views: 143, bookmarked: true },
];

export const INIT_FREE_POSTS = [
  {
    id: 1,
    title: "3개월 만에 토스 합격한 후기 공유합니다",
    content:
      "안녕하세요! 취준 3개월 만에 토스 합격했습니다. 제가 했던 공부 방법 공유할게요.\n\n1. 알고리즘: 백준 골드 50문제 집중 풀이\n2. CS: 면접 스터디 참여로 매일 1개 주제 정리\n3. 프로젝트: 실서비스 수준 프로젝트 2개 완성\n\n포기하지 마시고 모두 화이팅!",
    author: "김개발",
    likes: 87,
    likedByMe: false,
    time: "2시간 전",
    mine: false,
    reported: false,
    comments: [
      { id: 1, user: "이취준", text: "정말 대단하시네요! 알고리즘 어떤 유형 위주로 하셨나요?", time: "1시간 전", mine: false },
      { id: 2, user: "나", text: "축하드려요! 저도 열심히 해야겠어요", time: "30분 전", mine: true },
    ],
  },
  {
    id: 2,
    title: "이력서 포트폴리오 피드백 주실 분 계신가요?",
    content:
      "안녕하세요. 신입 프론트엔드 개발자 지망생입니다.\nReact + TypeScript 프로젝트 3개를 진행했는데 포트폴리오 피드백 받고 싶어요.\n깃허브 링크 남겨도 될까요?",
    author: "이취준",
    likes: 12,
    likedByMe: false,
    time: "4시간 전",
    mine: false,
    reported: false,
    comments: [],
  },
  {
    id: 3,
    title: "신입 연봉 협상 어떻게 하셨나요?",
    content:
      "연봉 협상 시도해보신 분들 경험 공유 부탁드려요. 첫 직장이라 어떻게 해야 할지 모르겠습니다.",
    author: "박신입",
    likes: 45,
    likedByMe: false,
    time: "어제",
    mine: false,
    reported: false,
    comments: [
      { id: 1, user: "선배개발자", text: "시장 평균 연봉을 먼저 파악하고, 최소 요구 금액을 미리 정해두는 게 좋아요", time: "어제", mine: false },
    ],
  },
];

export const REPORT_REASONS = ["허위 정보", "욕설/비방", "광고/스팸", "개인정보 침해", "기타"];
