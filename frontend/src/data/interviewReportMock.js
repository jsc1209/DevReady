// 면접 결과 리포트(/interview/report/:id)·세션 상세(/history/:id)가 공유하는 mock·라벨 데이터.
// 원본 test-demo-UI/InterviewReport.tsx 의 MOCK_ENTRIES / MOCK_CONFIG / *_LABELS / SURVEY_EVERY / starGuide 를 분리.
// state(면접 완료 후 전달)가 없으면 이 MOCK 으로 정상 렌더되어야 한다.

// 실제 면접 완료로 들어온 경우만 카운트. SURVEY_EVERY 회마다 만족도 설문 프롬프트 노출.
export const SURVEY_EVERY = 10;

export const MOCK_ENTRIES = [
  {
    question: "React에서 Virtual DOM이 무엇인지, 실제 DOM과의 차이점을 설명해주세요.",
    answer: "Virtual DOM은 실제 DOM의 가벼운 복사본으로, React가 상태 변경 시 먼저 Virtual DOM에 반영하여 이전 상태와 비교(diffing)한 뒤 변경된 부분만 실제 DOM에 적용합니다.",
    followupQ: "Virtual DOM이 항상 성능상 이점을 가져다준다고 할 수 있을까요?",
    followupA: "항상 그렇지는 않습니다. 변경이 거의 없는 단순한 DOM에서는 Virtual DOM 비교 비용이 오히려 오버헤드가 될 수 있습니다.",
    scores: { technical: 78, logic: 80, specificity: 75, depth: 72, communication: 85 },
    star: { S: 80, T: 70, A: 75, R: 65 },
    wpm: 145,
    silenceCount: 1,
  },
  {
    question: "클로저(Closure)란 무엇인지 예시와 함께 설명해주세요.",
    answer: "클로저는 함수가 자신이 선언된 환경의 변수에 접근할 수 있는 함수입니다. counter 함수 내부의 increment 함수는 외부 count 변수에 접근해 값을 유지합니다.",
    followupQ: "클로저를 사용할 때 메모리 누수가 발생할 수 있는 상황은?",
    followupA: "이벤트 리스너에서 클로저로 외부 변수를 참조하면, 이벤트 리스너를 제거하지 않는 경우 GC가 해당 변수를 회수하지 못해 누수가 발생합니다.",
    scores: { technical: 72, logic: 78, specificity: 68, depth: 70, communication: 82 },
    star: { S: 60, T: 65, A: 72, R: 58 },
    wpm: 152,
    silenceCount: 2,
  },
];

export const MOCK_CONFIG = {
  job: "frontend",
  level: "junior",
  type: "technical",
  interviewer: "friendly",
  companyType: "스타트업",
};

export const JOB_LABELS = {
  frontend: "프론트엔드",
  backend: "백엔드",
  fullstack: "풀스택",
  mobile: "모바일",
  devops: "DevOps",
};

export const LEVEL_LABELS = {
  junior: "신입",
  mid: "3년 이하",
  senior: "5년 이상",
};

export const TYPE_LABELS = {
  technical: "기술 면접",
  personality: "인성 면접",
  mixed: "종합 면접",
};

export const starGuide = {
  S: "상황(Situation): 답변 초반에 배경·맥락을 1~2문장으로 명확히 설정하세요.",
  T: "과제(Task): 자신이 맡은 역할과 목표를 구체적으로 제시하세요.",
  A: "행동(Action): '나는 ~했다'처럼 본인의 구체적 행동 단계를 나열하세요.",
  R: "결과(Result): 수치나 임팩트로 성과를 정량화해서 마무리하세요.",
};
