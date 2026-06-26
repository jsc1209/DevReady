import gatewayAxios from "./gatewayAxios";

/**
 * POST /api/education/quiz — Spring 게이트웨이가 Colab /education/quiz 를 패스스루.
 * 입력 {topic(필수), n, difficulty(하/중/상), lang}.
 * Colab 원본: { ok:true, topic, count, quiz:[{q, options[4], answer(인덱스), explanation}] } / { ok:false, error }.
 *
 * ★ 변환 레이어: Colab 은 4지선다만 생성 → EducationPage 의 multiple 형태로 변환해 반환.
 *   (options → opts, type:"multiple" 부여). 화면 컴포넌트 수정을 피하기 위해 여기서 매핑한다.
 * @returns 변환된 문항 배열 [{type:"multiple", q, opts, answer, explanation}]. 실패/빈결과 시 [].
 */
export async function generateQuiz({ topic, n = 5, difficulty = "중", lang = "ko" }) {
  const res = await gatewayAxios.post("/api/education/quiz", { topic, n, difficulty, lang });
  const data = res.data;
  if (!data?.ok || !Array.isArray(data.quiz)) return [];
  return data.quiz
    .filter((it) => it && it.q && Array.isArray(it.options) && it.options.length === 4)
    .map((it) => ({
      type: "multiple",
      q: it.q,
      opts: it.options,
      answer: typeof it.answer === "number" ? it.answer : 0,
      explanation: it.explanation ?? "",
    }));
}
