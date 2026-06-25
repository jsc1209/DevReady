// 면접 랜딩(/interview) 화면 mock 데이터.
// 아이콘은 lucide → @mui/icons-material 치환한 컴포넌트로 보관(landingMock 패턴).
import {
  Psychology,
  Description,
  Videocam,
  BarChart,
  QuestionAnswer,
  TrendingUp,
  Mic,
} from "@mui/icons-material";

// 상단 통계
export const STATS = [
  { value: "12,400+", label: "누적 면접 세션" },
  { value: "94%", label: "사용자 만족도" },
  { value: "3.2배", label: "합격률 향상" },
];

// 진행 3단계 (icon = @mui/icons-material 컴포넌트)
export const STEPS = [
  {
    step: "01",
    icon: Description,
    title: "이력서 & 공고 선택",
    desc: "내 이력서와 지원할 공고를 선택하면 AI가 맞춤 질문을 생성합니다.",
  },
  {
    step: "02",
    icon: Mic,
    title: "AI 면접 진행",
    desc: "실제 면접처럼 답변하면 AI 면접관이 꼬리 질문을 이어갑니다.",
  },
  {
    step: "03",
    icon: BarChart,
    title: "리포트 확인",
    desc: "면접 후 강점·약점·키워드 분석이 담긴 상세 리포트를 받습니다.",
  },
];

// 주요 기능 6
export const FEATURES = [
  {
    icon: Psychology,
    title: "AI 실시간 분석",
    desc: "답변 내용, 말하는 속도, 키워드 분포를 실시간으로 분석합니다.",
  },
  {
    icon: Description,
    title: "이력서 기반 맞춤 질문",
    desc: "내 이력서와 지원 공고를 바탕으로 맞춤형 면접 질문을 생성합니다.",
  },
  {
    icon: Videocam,
    title: "화상·음성 모의 면접",
    desc: "실제 면접처럼 카메라·마이크를 활용해 현장감 있는 연습이 가능합니다.",
  },
  {
    icon: BarChart,
    title: "상세 피드백 리포트",
    desc: "면접 종료 후 강점·약점·개선 포인트를 담은 리포트를 제공합니다.",
  },
  {
    icon: QuestionAnswer,
    title: "꼬리 질문 대응 훈련",
    desc: "AI 면접관이 답변에 맞게 즉석 꼬리 질문을 던져 실전 감각을 높입니다.",
  },
  {
    icon: TrendingUp,
    title: "성장 추이 트래킹",
    desc: "회차별 점수 변화를 비교해 실력 향상 추이를 한눈에 확인합니다.",
  },
];

// 요금제 3
export const PLANS = [
  {
    id: "basic",
    name: "1회 이용권",
    price: "9,900",
    originalPrice: null,
    per: "1회",
    desc: "단건 면접 연습에 적합",
    features: ["AI 모의면접 1회", "기본 피드백 리포트", "30일 이내 사용"],
    badge: null,
    highlight: false,
  },
  {
    id: "standard",
    name: "월정액 스탠다드",
    price: "29,900",
    originalPrice: "39,900",
    per: "월",
    desc: "꾸준히 연습하는 취준생 추천",
    features: [
      "AI 모의면접 무제한",
      "상세 피드백 리포트",
      "이력서 기반 맞춤 질문",
      "성장 추이 리포트",
      "커뮤니티 프리미엄 배지",
    ],
    badge: "가장 인기",
    highlight: true,
  },
  {
    id: "premium",
    name: "월정액 프리미엄",
    price: "59,900",
    originalPrice: "79,900",
    per: "월",
    desc: "전문 피드백까지 원하는 분께",
    features: [
      "스탠다드 모든 혜택",
      "전문 면접관 1:1 피드백 (월 1회)",
      "공고 맞춤 자기소개서 첨삭",
      "우선 고객지원",
    ],
    badge: "프리미엄",
    highlight: false,
  },
];

// 합격 후기 3
export const REVIEWS = [
  {
    name: "이*현",
    company: "카카오 합격",
    rating: 5,
    text: "꼬리 질문이 진짜 면접이랑 거의 똑같아서 실전에서 당황하지 않았어요. 피드백 리포트도 구체적이고 정말 도움됐습니다.",
  },
  {
    name: "박*준",
    company: "네이버 합격",
    rating: 5,
    text: "이력서 기반 맞춤 질문이 신기했어요. 내 프로젝트 경험 기반으로 질문해줘서 어색함 없이 연습할 수 있었습니다.",
  },
  {
    name: "김*영",
    company: "토스 최종합격",
    rating: 5,
    text: "말하는 속도와 키워드 분석이 특히 좋았어요. 제가 말이 빠르다는 걸 처음 깨달았습니다. 덕분에 고쳤어요!",
  },
];
