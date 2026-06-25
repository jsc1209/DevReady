// 결제 페이지(/interview/payment)가 사용하는 요금제 mock 데이터.
// 원본 test-demo-UI/InterviewPayment.tsx 의 PLANS 객체를 분리.
// PAYMENT_METHODS 는 @mui 아이콘 ref 를 보유하므로 페이지 안 로컬 const 로 유지한다.

export const PLANS = {
  basic: {
    name: "1회 이용권",
    price: "9,900",
    priceNum: 9900,
    per: "1회",
    features: ["AI 모의면접 1회", "기본 피드백 리포트", "30일 이내 사용"],
  },
  standard: {
    name: "월정액 스탠다드",
    price: "29,900",
    priceNum: 29900,
    per: "월",
    features: [
      "AI 모의면접 무제한",
      "상세 피드백 리포트",
      "이력서 기반 맞춤 질문",
      "성장 추이 리포트",
      "커뮤니티 프리미엄 배지",
    ],
  },
  premium: {
    name: "월정액 프리미엄",
    price: "59,900",
    priceNum: 59900,
    per: "월",
    features: [
      "스탠다드 모든 혜택",
      "전문 면접관 1:1 피드백 (월 1회)",
      "공고 맞춤 자기소개서 첨삭",
      "우선 고객지원",
    ],
  },
};
