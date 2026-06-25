// 면접 설정(/interview/setup) 위저드의 순수 데이터(아이콘 참조 없음).
// 원본 test-demo-UI/InterviewSetup.tsx 의 STEPS / CONSENT_ITEMS / RESUMES 분리.
// (아이콘 컴포넌트 ref 를 가진 TYPES/COMPANY_TYPES/INTERVIEWER_TYPES 는 페이지 내 로컬 const)

export const STEPS = ["이용 동의", "이력서·질문 수", "면접 환경", "설정 요약", "장비 점검"];

export const CONSENT_ITEMS = [
  { id: "ai_data", label: "AI 학습 목적 답변 데이터 활용", required: true, detail: "답변 내용은 서비스 품질 개선에 익명으로 사용됩니다." },
  { id: "video_record", label: "면접 영상 분석 (선택)", required: false, detail: "동의하면 카메라로 표정·시선을 분석하는 '영상 면접'으로, 미동의 시 카메라 없이 '음성 면접'으로 진행됩니다." },
  { id: "voice_analyze", label: "음성 STT 및 분석 데이터 활용", required: true, detail: "Web Speech API로 음성을 텍스트로 변환하고 분석합니다." },
  { id: "marketing", label: "서비스 개선을 위한 익명 통계 활용", required: false, detail: "익명 처리된 통계 데이터를 서비스 개선에 활용합니다." },
];

export const RESUMES = [
  { id: "r1", title: "프론트엔드 신입 이력서", date: "2026-06-10", desc: "React · TypeScript 중심" },
  { id: "r2", title: "React 개발자 이력서", date: "2026-05-22", desc: "실무 프로젝트 2건 포함" },
  { id: "r3", title: "포트폴리오 통합본", date: "2026-04-30", desc: "전체 경력·프로젝트 요약" },
];
