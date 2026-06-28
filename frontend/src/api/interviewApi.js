import gatewayAxios from "./gatewayAxios";

/**
 * POST /api/interview/evaluate — Spring 게이트웨이가 Colab FastAPI(SSE)를 중계.
 * 응답: DataVO { success, message, data } 그대로 반환.
 *   data = { scores:{technical_accuracy,specificity,logic,communication},
 *            strengths[], improvements[], feedback, overall, display_scores:{logic,clarity,depth} }
 * (~140초 소요. 에러/실패 분기는 호출처에서 res.success 로 처리.)
 */
export async function evaluateAnswer({ question, answer, lang = "ko" }) {
  const res = await gatewayAxios.post("/api/interview/evaluate", { question, answer, lang });
  return res.data; // DataVO
}

/**
 * FastAPI 4축(+display_scores) → 프론트 5키(scoreAnswer 와 동일 구조)로 매핑.
 * technical/logic/specificity/communication 직접, depth 는 display_scores.depth 재사용
 * (없으면 (specificity+technical_accuracy)/2 — server mapping.py 와 동일 공식).
 */
export function mapScores(evaluation) {
  const s = evaluation?.scores ?? {};
  const ta = s.technical_accuracy ?? 0;
  const sp = s.specificity ?? 0;
  const depth = evaluation?.display_scores?.depth ?? Math.round((sp + ta) / 2);
  return {
    technical: ta,
    logic: s.logic ?? 0,
    specificity: sp,
    depth,
    communication: s.communication ?? 0,
  };
}

/**
 * FastAPI evaluate 응답의 STAR(점수+등급+종합)를 프론트 엔트리용으로 추출.
 * AI 값만 사용(mock 폴백 없음) — 누락 시 0/"N/A".
 *   응답: star{S,T,A,R}(0~100), star_grade{S,T,A,R}("A"~"F"/"N/A"),
 *         star_overall(0~100), star_overall_grade("A+"~"F"/"N/A").
 */
export function mapStar(evaluation) {
  const st = evaluation?.star ?? {};
  const sg = evaluation?.star_grade ?? {};
  const num = (v) => {
    const x = Number(v);
    return Number.isFinite(x) ? x : 0;
  };
  const grd = (v) => (v == null || v === "" ? "N/A" : String(v));
  return {
    star: { S: num(st.S), T: num(st.T), A: num(st.A), R: num(st.R) },
    starGrade: { S: grd(sg.S), T: grd(sg.T), A: grd(sg.A), R: grd(sg.R) },
    starOverall: num(evaluation?.star_overall),
    starOverallGrade: grd(evaluation?.star_overall_grade),
  };
}

/**
 * POST /api/interview/generate — Spring 게이트웨이가 Colab /interview/generate 를 패스스루.
 * 입력 {resume, job_posting, n, persona, lang}. 응답(원본): { ok:true, questions:[문자열,...] } / { ok:false, error }.
 * (DataVO 미적용 — res.ok / res.questions 로 분기.)
 */
export async function generateQuestions({ resume, job_posting, n = 5, persona = "default", lang = "ko" }) {
  const res = await gatewayAxios.post("/api/interview/generate", { resume, job_posting, n, persona, lang });
  return res.data;
}

/**
 * POST /api/interview/report — Spring 게이트웨이가 Colab /interview/report 를 패스스루.
 * 입력 {results:[{question, evaluation:{scores(4축), feedback}}...], lang}.
 * 응답(원본): { ok, overall, axis_averages, categories, grade, report:{summary, strengths[], weaknesses[], guide[]} } / { ok:false, error }.
 */
export async function generateReport({ results, lang = "ko" }) {
  const res = await gatewayAxios.post("/api/interview/report", { results, lang });
  return res.data;
}

// ── 면접 결과 영속화/조회 (/api/interview-sessions) — 로그인 토큰 기준, 본인 것만 ──

const TYPE_LABEL = { 기술: "기술 면접", 인성: "인성 면접", 종합: "종합 면접" };

function gradeOf(score) {
  if (score >= 90) return "A+";
  if (score >= 85) return "A";
  if (score >= 80) return "B+";
  if (score >= 75) return "B";
  if (score >= 70) return "C+";
  return "C";
}

// 개별 STAR 등급(A~F). 서버 clamp_star 의 ×20 격자(100→A,80→B,60→C,40→D,20→F,0→N/A)와
// 일치하도록 구간 역산(>=90 A / >=70 B / >=50 C / >=30 D / >0 F / 0·무효 N/A). 라이브/저장본 공용.
export function starGradeOf(score) {
  const v = Number(score);
  if (!Number.isFinite(v) || v <= 0) return "N/A";
  if (v >= 90) return "A";
  if (v >= 70) return "B";
  if (v >= 50) return "C";
  if (v >= 30) return "D";
  return "F";
}

// 종합 STAR 등급(A+~F). 서버 _star_overall_grade 와 동일 구간(0·무효는 N/A).
export function starOverallGradeOf(score) {
  const v = Number(score);
  if (!Number.isFinite(v) || v <= 0) return "N/A";
  if (v >= 90) return "A+";
  if (v >= 83) return "A";
  if (v >= 80) return "A-";
  if (v >= 73) return "B+";
  if (v >= 67) return "B";
  if (v >= 60) return "B-";
  if (v >= 53) return "C+";
  if (v >= 47) return "C";
  if (v >= 40) return "C-";
  if (v >= 20) return "D";
  return "F";
}
function fmtDate(s) {
  if (!s) return "-";
  return String(s).slice(0, 10).replace(/-/g, ".") || "-";
}
function n(v) {
  const x = Number(v);
  return Number.isFinite(x) ? Math.round(x) : 0;
}

// 면접 종료 저장 → { sessionId }
export async function saveSession(payload) {
  const res = await gatewayAxios.post("/api/interview-sessions", payload);
  return res?.data?.data;
}

// 내 면접 목록(History/마이페이지 탭 공용 형태). 빈 배열 안전.
export async function getSessions() {
  const res = await gatewayAxios.get("/api/interview-sessions");
  const list = res?.data?.data ?? [];
  if (!Array.isArray(list)) return [];
  return list.map((s) => {
    const score = n(s.totalScore);
    return {
      id: String(s.sessionId),
      date: fmtDate(s.startedAt),
      type: TYPE_LABEL[s.interviewType] ?? `${s.interviewType ?? ""} 면접`,
      job: s.jobCategory ?? "-",
      level: "-",
      duration: "-",
      questions: n(s.questionCount),
      score,
      grade: gradeOf(score),
      scores: {
        technical: n(s.technical),
        logic: n(s.logic),
        specificity: n(s.specificity),
        depth: n(s.depth),
        communication: n(s.communication),
      },
      // 음성/표정 지표는 v1 미영속 → 0 placeholder
      wpm: 0,
      silenceCount: 0,
      gazeStability: 0,
    };
  });
}

// 마이페이지 집계(레이더 5축 평균 + 회차 추이 + 종합). 빈 데이터 안전(0).
export async function getStats() {
  const res = await gatewayAxios.get("/api/interview-sessions/stats");
  const d = res?.data?.data ?? {};
  const a = d.axisAverages ?? {};
  return {
    avgScore: n(d.avgScore),
    sessionCount: n(d.sessionCount),
    axisAverages: {
      technical: n(a.technical),
      logic: n(a.logic),
      specificity: n(a.specificity),
      depth: n(a.depth),
      communication: n(a.communication),
    },
    growth: Array.isArray(d.growth) ? d.growth.map((g) => ({ score: n(g.totalScore), date: fmtDate(g.startedAt) })) : [],
  };
}

// 세션 상세 → InterviewReport 가 쓰는 { entries, config, aiReport } 로 변환
export async function getSession(id) {
  const res = await gatewayAxios.get(`/api/interview-sessions/${id}`);
  const d = res?.data?.data;
  if (!d) return null;
  const qs = Array.isArray(d.questions) ? d.questions : [];
  const mains = qs.filter((q) => q.parentQuestionId == null);
  const byParent = {};
  qs.forEach((q) => {
    if (q.parentQuestionId != null) byParent[String(q.parentQuestionId)] = q;
  });
  const entries = mains.map((m) => {
    const f = byParent[String(m.questionId)];
    // 저장본 STAR: DB 점수(situationScore 등)만 있음 → 등급은 클라이언트 재계산(라이브와 동일 스킴).
    const star = {
      S: Number(m.situationScore) || 0,
      T: Number(m.taskScore) || 0,
      A: Number(m.actionScore) || 0,
      R: Number(m.resultScore) || 0,
    };
    const starOverall = Math.round((star.S + star.T + star.A + star.R) / 4);
    return {
      question: m.questionText ?? "",
      answer: m.answerText ?? "",
      scores: {
        technical: n(m.technical),
        logic: n(m.logic),
        specificity: n(m.specificity),
        depth: n(m.depth),
        communication: n(m.communication),
      },
      star,
      starGrade: {
        S: starGradeOf(star.S),
        T: starGradeOf(star.T),
        A: starGradeOf(star.A),
        R: starGradeOf(star.R),
      },
      starOverall,
      starOverallGrade: starOverallGradeOf(starOverall),
      wpm: 0,
      silenceCount: 0,
      followupQ: f?.questionText ?? "",
      followupA: f?.answerText ?? "",
    };
  });
  const rep = d.report ?? null;
  const lines = (s) => (s ? String(s).split("\n").filter(Boolean) : []);
  const aiReport =
    rep && (rep.overallComment || rep.strengths || rep.weaknesses || rep.improvementNeeded)
      ? {
          report: {
            summary: rep.overallComment ?? "",
            strengths: lines(rep.strengths),
            weaknesses: lines(rep.weaknesses),
            guide: lines(rep.improvementNeeded),
          },
        }
      : null;
  return {
    entries,
    config: { type: d.interviewType ?? "", job: d.jobCategory ?? "", level: "" },
    aiReport,
  };
}
