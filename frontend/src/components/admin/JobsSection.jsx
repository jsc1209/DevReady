import { useState } from "react";
import { Box, Stack, Typography, Button } from "@mui/material";
import {
  ArrowBack,
  Add,
  DeleteOutlined,
  EditOutlined,
  Cancel,
  Save,
  SmartToy,
} from "@mui/icons-material";
import { Toast, StatusBadge } from "./adminShared";
import { inputSx } from "./adminUtils";

const mono = "'DM Mono', monospace";

// ─── 공고 관리 (A-005) — mock 데이터 co-locate ──────────────────────────────
const INIT_JOBS = [
  { id: 1, company: "카카오", title: "프론트엔드 개발자", status: "승인", applicants: 42, deadline: "2026-06-20" },
  { id: 2, company: "네이버", title: "백엔드 개발자", status: "대기", applicants: 0, deadline: "2026-06-25" },
  { id: 3, company: "토스", title: "풀스택 개발자", status: "승인", applicants: 28, deadline: "2026-07-01" },
  { id: 4, company: "라인플러스", title: "DevOps 엔지니어", status: "대기", applicants: 0, deadline: "2026-07-10" },
  { id: 5, company: "쿠팡", title: "AI/ML 엔지니어", status: "반려", applicants: 0, deadline: "2026-06-30" },
];

const JOB_CATEGORIES = ["프론트엔드", "백엔드", "풀스택", "데이터", "모바일", "AI·ML", "DevOps", "기타"];
const JOB_TYPES = ["신입", "경력", "신입·경력 무관"];
const JOB_EDUCATIONS = ["무관", "고졸 이상", "초대졸 이상", "대졸 이상", "석사 이상"];
const JOB_FIELDS = ["웹서비스", "핀테크", "커머스", "플랫폼", "AI", "게임", "기타"];

// TODO(AI연동): 실서비스에선 EXAONE 서버(POST /interview/generate 또는 신규 /job/recommend)에
// category·languages·field·경력·학력을 보내 추천을 받음. 프로토타입이라 아래 mock으로 대체.
function recommendJobContent(input) {
  const langs = input.languages.map((l) => l.toLowerCase());
  const has = (k) => langs.some((l) => l.includes(k));
  const duties = [];
  const preferred = [];
  const questions = [];

  switch (input.category) {
    case "프론트엔드":
      duties.push("React 기반 컴포넌트 설계 및 UI 구현", "렌더링 성능 최적화 및 번들 사이즈 관리", "웹 접근성(WCAG)·반응형 UI 대응");
      preferred.push("Next.js SSR/SSG 경험", "디자인 시스템 구축 경험", "Core Web Vitals 최적화 경험");
      questions.push("최근 진행한 프론트엔드 성능 최적화 경험을 설명해 주세요.", "컴포넌트 재사용성을 높이기 위한 본인만의 설계 원칙은?");
      break;
    case "백엔드":
      duties.push("RESTful API 설계 및 서버 로직 구현", "데이터베이스 모델링 및 쿼리 최적화", "트래픽 대응을 위한 캐싱·확장 전략 수립");
      preferred.push("대용량 트래픽 처리 경험", "MSA 설계·운영 경험", "Redis 캐싱 전략 경험");
      questions.push("N+1 문제를 경험하고 해결한 사례를 설명해 주세요.", "트랜잭션 격리 수준을 실제로 고려한 경험이 있나요?");
      break;
    case "데이터":
      duties.push("데이터 파이프라인 설계 및 ETL 구축", "데이터 품질 모니터링 및 정합성 관리", "분석용 데이터 마트 설계");
      preferred.push("Airflow 워크플로우 관리 경험", "대규모 배치/스트리밍 처리 경험", "데이터 레이크하우스 이해");
      questions.push("데이터 파이프라인 장애를 대응한 경험을 설명해 주세요.", "데이터 품질을 보장하기 위한 본인의 방법은?");
      break;
    case "모바일":
      duties.push("네이티브/크로스플랫폼 앱 기능 개발", "앱 성능·메모리 최적화", "스토어 배포 및 버전 관리");
      preferred.push("CI/CD(Fastlane) 경험", "오프라인 캐싱 전략 경험", "접근성 대응 경험");
      questions.push("앱 출시 후 크래시를 줄이기 위해 한 노력을 설명해 주세요.", "앱 아키텍처를 선택한 기준은 무엇인가요?");
      break;
    case "AI·ML":
      duties.push("모델 학습·평가 파이프라인 구축", "데이터 전처리 및 피처 엔지니어링", "모델 서빙 및 성능 모니터링");
      preferred.push("LLM 파인튜닝·프롬프트 엔지니어링 경험", "MLOps 파이프라인 구축 경험", "분산 학습 경험");
      questions.push("모델 성능을 개선한 가장 효과적인 시도를 설명해 주세요.", "오프라인 지표와 실서비스 지표가 달랐던 경험이 있나요?");
      break;
    case "DevOps":
      duties.push("CI/CD 파이프라인 구축 및 운영", "쿠버네티스 기반 인프라 관리", "모니터링·알림 체계 구성");
      preferred.push("IaC(Terraform) 경험", "멀티클라우드 운영 경험", "인프라 비용 최적화 경험");
      questions.push("장애 대응 자동화를 구축한 경험을 설명해 주세요.", "인프라 비용을 절감한 구체적 사례가 있나요?");
      break;
    default: // 풀스택·기타
      duties.push("프론트엔드·백엔드 기능 통합 개발", "API 설계 및 서비스 아키텍처 개선", "기능 단위 배포 및 운영");
      preferred.push("클라우드 인프라 운영 경험", "실시간 기능(WebSocket) 구현 경험", "테스트 자동화 경험");
      questions.push("가장 어려웠던 풀스택 프로젝트 경험을 설명해 주세요.", "프론트와 백엔드 사이 인터페이스를 설계한 방식은?");
  }

  // 언어/기술스택 기반 보강
  if (has("java") || has("spring")) {
    duties.push("Spring Boot 기반 백엔드 서비스 개발");
    preferred.push("JPA/QueryDSL 활용 경험");
  }
  if (has("react") || has("typescript")) preferred.push("React + TypeScript 대규모 프로젝트 경험");
  if (has("python")) duties.push("Python 기반 데이터 처리·자동화 스크립트 작성");
  if (has("kotlin") || has("swift")) preferred.push("네이티브 모바일 개발 경험");
  if (has("aws") || has("docker") || has("kubernetes")) preferred.push("컨테이너·클라우드 인프라 운영 경험");

  // 분야·경력 기반 질문 보강
  if (input.field && input.field !== "기타") questions.push(`${input.field} 도메인에 관심을 갖게 된 계기를 설명해 주세요.`);
  if (input.type === "신입") questions.push("학습한 내용을 실무에 적용해 본 프로젝트가 있나요?");
  else if (input.type === "경력") questions.push("이전 회사에서 주도적으로 개선한 성과를 수치로 설명해 주세요.");

  const uniq = (arr) => Array.from(new Set(arr));
  return {
    mainDuties: uniq(duties).slice(0, 4),
    preferred: uniq(preferred).slice(0, 4),
    coverLetterQuestions: uniq(questions).slice(0, 4).map((q, i) => ({ id: `q${Date.now()}_${i}`, question: q })),
  };
}

// 라벨(공통)
function FieldLabel({ children }) {
  return (
    <Typography
      component="label"
      sx={{ display: "block", fontSize: 12, fontWeight: 500, color: "text.secondary", mb: 0.5 }}
    >
      {children}
    </Typography>
  );
}

export default function JobsSection() {
  const [jobs, setJobs] = useState(INIT_JOBS);
  const [tab, setTab] = useState("전체");
  const [view, setView] = useState("list");
  const [editing, setEditing] = useState(null);
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [langInput, setLangInput] = useState("");

  const showMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const tabs = ["전체", "대기", "승인", "반려"];
  const filtered = tab === "전체" ? jobs : jobs.filter((j) => j.status === tab);

  const blankForm = {
    title: "",
    company: "",
    location: "",
    type: JOB_TYPES[0],
    salary: "",
    applyStart: "",
    applyEnd: "",
    education: JOB_EDUCATIONS[0],
    category: JOB_CATEGORIES[0],
    languages: [],
    field: JOB_FIELDS[0],
    mainDuties: [],
    preferred: [],
    coverLetterQuestions: [],
  };
  const [form, setForm] = useState(blankForm);

  const openCreate = () => {
    setEditing(null);
    setForm(blankForm);
    setLangInput("");
    setStep(1);
    setView("form");
  };
  const openEdit = (row) => {
    setEditing(row);
    setForm({
      title: row.title,
      company: row.company,
      location: row.location ?? "",
      type: row.type ?? JOB_TYPES[0],
      salary: row.salary ?? "",
      applyStart: row.applyStart ?? "",
      applyEnd: row.applyEnd ?? row.deadline ?? "",
      education: row.education ?? JOB_EDUCATIONS[0],
      category: row.category ?? JOB_CATEGORIES[0],
      languages: row.languages ?? [],
      field: row.field ?? JOB_FIELDS[0],
      mainDuties: row.mainDuties ?? [],
      preferred: row.preferred ?? [],
      coverLetterQuestions: row.coverLetterQuestions ?? [],
    });
    setLangInput("");
    setStep(1);
    setView("form");
  };

  const addLang = () => {
    const v = langInput.trim();
    if (!v) return;
    if (!form.languages.includes(v)) setForm((f) => ({ ...f, languages: [...f.languages, v] }));
    setLangInput("");
  };
  const removeLang = (l) => setForm((f) => ({ ...f, languages: f.languages.filter((x) => x !== l) }));

  const addLine = (key) => setForm((f) => ({ ...f, [key]: [...f[key], ""] }));
  const updateLine = (key, i, v) =>
    setForm((f) => ({ ...f, [key]: f[key].map((d, idx) => (idx === i ? v : d)) }));
  const removeLine = (key, i) =>
    setForm((f) => ({ ...f, [key]: f[key].filter((_, idx) => idx !== i) }));

  const addQ = () =>
    setForm((f) => ({ ...f, coverLetterQuestions: [...f.coverLetterQuestions, { id: `q${Date.now()}`, question: "" }] }));
  const updateQ = (id, v) =>
    setForm((f) => ({ ...f, coverLetterQuestions: f.coverLetterQuestions.map((q) => (q.id === id ? { ...q, question: v } : q)) }));
  const removeQ = (id) =>
    setForm((f) => ({ ...f, coverLetterQuestions: f.coverLetterQuestions.filter((q) => q.id !== id) }));

  const aiDisabled = !form.category || form.languages.length === 0;
  const runAI = () => {
    if (aiDisabled) return;
    setAiLoading(true);
    setTimeout(() => {
      const rec = recommendJobContent({
        category: form.category,
        languages: form.languages,
        field: form.field,
        type: form.type,
        education: form.education,
      });
      setForm((f) => ({ ...f, mainDuties: rec.mainDuties, preferred: rec.preferred, coverLetterQuestions: rec.coverLetterQuestions }));
      setAiLoading(false);
      showMsg("AI 추천이 적용되었습니다");
    }, 1000);
  };

  const handleSave = () => {
    const base = {
      company: form.company,
      title: form.title,
      location: form.location,
      type: form.type,
      salary: form.salary,
      applyStart: form.applyStart,
      applyEnd: form.applyEnd,
      deadline: form.applyEnd,
      education: form.education,
      category: form.category,
      languages: form.languages,
      field: form.field,
      mainDuties: form.mainDuties.map((d) => d.trim()).filter(Boolean),
      preferred: form.preferred.map((p) => p.trim()).filter(Boolean),
      coverLetterQuestions: form.coverLetterQuestions.filter((q) => q.question.trim()),
    };
    if (editing) {
      setJobs((prev) => prev.map((x) => (x.id === editing.id ? { ...x, ...base } : x)));
    } else {
      setJobs((prev) => [...prev, { id: Date.now(), status: "대기", applicants: 0, ...base }]);
    }
    setView("list");
    showMsg("공고가 저장되었습니다");
  };

  // ── 폼 뷰 (등록/수정) ──
  if (view === "form") {
    return (
      <Box>
        <Toast msg={toast} />
        <Box
          component="button"
          type="button"
          onClick={() => setView("list")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            fontSize: 14,
            color: "text.secondary",
            border: "none",
            bgcolor: "transparent",
            cursor: "pointer",
            p: 0,
            mb: 2,
            font: "inherit",
            "&:hover": { color: "text.primary" },
          }}
        >
          <ArrowBack sx={{ fontSize: 16 }} />
          목록으로
        </Box>
        <Typography sx={{ fontSize: 30, fontWeight: 700, color: "text.primary", mb: 2 }}>
          {editing ? "공고 수정" : "공고 등록"}
        </Typography>

        {/* 단계 인디케이터 */}
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
          {[
            [1, "기본 정보"],
            [2, "전체·기타사항"],
          ].map(([n, label]) => {
            const active = step === n;
            return (
              <Box
                key={n}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 1.5,
                  py: 0.75,
                  borderRadius: "8px",
                  fontSize: 14,
                  bgcolor: active ? "primary.main" : "#F8F9FF",
                  color: active ? "#fff" : "text.secondary",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "999px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 12,
                    fontFamily: mono,
                    bgcolor: active ? "rgba(255,255,255,0.2)" : "#fff",
                  }}
                >
                  {n}
                </Box>
                {label}
              </Box>
            );
          })}
        </Stack>

        {step === 1 && (
          <Box
            sx={{
              borderRadius: "16px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "#fff",
              p: 3,
            }}
          >
            <Stack spacing={2}>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 1.5 }}>
                <Box>
                  <FieldLabel>공고제목</FieldLabel>
                  <Box
                    component="input"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                    placeholder="예: 프론트엔드 개발자"
                    sx={inputSx}
                  />
                </Box>
                <Box>
                  <FieldLabel>회사명</FieldLabel>
                  <Box
                    component="input"
                    value={form.company}
                    onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                    placeholder="예: 카카오"
                    sx={inputSx}
                  />
                </Box>
                <Box>
                  <FieldLabel>위치</FieldLabel>
                  <Box
                    component="input"
                    value={form.location}
                    onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                    placeholder="예: 판교"
                    sx={inputSx}
                  />
                </Box>
                <Box>
                  <FieldLabel>경력/신입</FieldLabel>
                  <Box
                    component="select"
                    value={form.type}
                    onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                    sx={inputSx}
                  >
                    {JOB_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </Box>
                </Box>
                <Box>
                  <FieldLabel>급여</FieldLabel>
                  <Box
                    component="input"
                    value={form.salary}
                    onChange={(e) => setForm((f) => ({ ...f, salary: e.target.value }))}
                    placeholder="협의 또는 5000~7000만"
                    sx={inputSx}
                  />
                </Box>
                <Box>
                  <FieldLabel>자격요건(학력)</FieldLabel>
                  <Box
                    component="select"
                    value={form.education}
                    onChange={(e) => setForm((f) => ({ ...f, education: e.target.value }))}
                    sx={inputSx}
                  >
                    {JOB_EDUCATIONS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </Box>
                </Box>
              </Box>

              <Box>
                <FieldLabel>공고지원 가능 날짜</FieldLabel>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box
                    component="input"
                    type="date"
                    value={form.applyStart}
                    onChange={(e) => setForm((f) => ({ ...f, applyStart: e.target.value }))}
                    sx={inputSx}
                  />
                  <Typography sx={{ color: "text.secondary", fontSize: 14, flexShrink: 0 }}>~</Typography>
                  <Box
                    component="input"
                    type="date"
                    value={form.applyEnd}
                    onChange={(e) => setForm((f) => ({ ...f, applyEnd: e.target.value }))}
                    sx={inputSx}
                  />
                </Stack>
              </Box>

              {/* 업무 묶음 */}
              <Box
                sx={{
                  borderRadius: "12px",
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "rgba(248,249,255,0.4)",
                  p: 2,
                }}
              >
                <Stack spacing={1.5}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>업무</Typography>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 1.5 }}>
                    <Box>
                      <FieldLabel>기본 카테고리</FieldLabel>
                      <Box
                        component="select"
                        value={form.category}
                        onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                        sx={{ ...inputSx, bgcolor: "background.default" }}
                      >
                        {JOB_CATEGORIES.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </Box>
                    </Box>
                    <Box>
                      <FieldLabel>분야</FieldLabel>
                      <Box
                        component="select"
                        value={form.field}
                        onChange={(e) => setForm((f) => ({ ...f, field: e.target.value }))}
                        sx={{ ...inputSx, bgcolor: "background.default" }}
                      >
                        {JOB_FIELDS.map((t) => (
                          <option key={t}>{t}</option>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                  <Box>
                    <FieldLabel>언어/기술스택</FieldLabel>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Box
                        component="input"
                        value={langInput}
                        onChange={(e) => setLangInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addLang();
                          }
                        }}
                        placeholder="예: React 입력 후 Enter 또는 추가"
                        sx={{ ...inputSx, bgcolor: "background.default" }}
                      />
                      <Box
                        component="button"
                        type="button"
                        onClick={addLang}
                        sx={{
                          flexShrink: 0,
                          px: 1.5,
                          py: 1.25,
                          borderRadius: "12px",
                          bgcolor: "primary.main",
                          color: "#fff",
                          fontSize: 14,
                          border: "none",
                          cursor: "pointer",
                          font: "inherit",
                          transition: "background-color .15s",
                          "&:hover": { bgcolor: "#4F46E5" },
                        }}
                      >
                        추가
                      </Box>
                    </Stack>
                    {form.languages.length > 0 && (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mt: 1 }}>
                        {form.languages.map((l) => (
                          <Box
                            component="span"
                            key={l}
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                              px: 1.25,
                              py: 0.5,
                              borderRadius: "999px",
                              bgcolor: "rgba(108,99,255,0.1)",
                              color: "primary.main",
                              fontSize: 12,
                            }}
                          >
                            {l}
                            <Box
                              component="button"
                              type="button"
                              onClick={() => removeLang(l)}
                              sx={{
                                p: 0,
                                border: "none",
                                bgcolor: "transparent",
                                cursor: "pointer",
                                display: "flex",
                                color: "inherit",
                                "&:hover": { color: "#3730A3" },
                              }}
                            >
                              <Cancel sx={{ fontSize: 12 }} />
                            </Box>
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Box>
                </Stack>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
                <Box
                  component="button"
                  type="button"
                  onClick={() => setStep(2)}
                  sx={{
                    px: 2.5,
                    py: 1.25,
                    borderRadius: "12px",
                    bgcolor: "primary.main",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    font: "inherit",
                    transition: "background-color .15s",
                    "&:hover": { bgcolor: "#4F46E5" },
                  }}
                >
                  다음 →
                </Box>
              </Box>
            </Stack>
          </Box>
        )}

        {step === 2 && (
          <Box
            sx={{
              borderRadius: "16px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "#fff",
              p: 3,
            }}
          >
            <Stack spacing={2.5}>
              {/* AI 자동 추천 */}
              <Box
                sx={{
                  borderRadius: "12px",
                  border: "1px solid rgba(108,99,255,0.2)",
                  bgcolor: "rgba(108,99,255,0.05)",
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1.5,
                }}
              >
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                    <SmartToy sx={{ fontSize: 16, color: "primary.main" }} />
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>AI 자동 추천</Typography>
                  </Box>
                  <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>
                    {aiDisabled
                      ? "업무 카테고리·언어를 먼저 입력하세요."
                      : "기본 정보를 바탕으로 업무·우대·추가질문을 추천합니다."}
                  </Typography>
                </Box>
                <Box
                  component="button"
                  type="button"
                  onClick={runAI}
                  disabled={aiDisabled || aiLoading}
                  sx={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    px: 2,
                    py: 1.25,
                    borderRadius: "8px",
                    bgcolor: "primary.main",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 500,
                    border: "none",
                    cursor: "pointer",
                    font: "inherit",
                    transition: "background-color .15s",
                    "&:hover": { bgcolor: "#4F46E5" },
                    "&:disabled": { opacity: 0.4, cursor: "default" },
                  }}
                >
                  {aiLoading ? (
                    <>
                      <Box
                        component="span"
                        sx={{
                          width: 16,
                          height: 16,
                          border: "2px solid rgba(255,255,255,0.4)",
                          borderTopColor: "#fff",
                          borderRadius: "999px",
                          animation: "jobs-spin 1s linear infinite",
                          "@keyframes jobs-spin": { to: { transform: "rotate(360deg)" } },
                        }}
                      />
                      분석 중…
                    </>
                  ) : (
                    <>
                      <SmartToy sx={{ fontSize: 16 }} />
                      AI 자동 추천
                    </>
                  )}
                </Box>
              </Box>
              {aiLoading && (
                <Typography sx={{ fontSize: 12, color: "primary.main" }}>AI가 공고 정보를 분석 중…</Typography>
              )}

              {/* 업무 상세 */}
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                  <FieldLabel>업무 상세</FieldLabel>
                  <Box
                    component="button"
                    type="button"
                    onClick={() => addLine("mainDuties")}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.25,
                      fontSize: 12,
                      color: "primary.main",
                      border: "none",
                      bgcolor: "transparent",
                      cursor: "pointer",
                      p: 0,
                      font: "inherit",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    <Add sx={{ fontSize: 12 }} />
                    추가
                  </Box>
                </Box>
                <Stack spacing={1}>
                  {form.mainDuties.map((d, i) => (
                    <Stack key={i} direction="row" alignItems="center" spacing={1}>
                      <Box
                        component="input"
                        value={d}
                        onChange={(e) => updateLine("mainDuties", i, e.target.value)}
                        placeholder="업무 내용"
                        sx={inputSx}
                      />
                      <Box
                        component="button"
                        type="button"
                        onClick={() => removeLine("mainDuties", i)}
                        sx={{
                          flexShrink: 0,
                          p: 1,
                          borderRadius: "8px",
                          color: "text.secondary",
                          border: "none",
                          bgcolor: "transparent",
                          cursor: "pointer",
                          display: "flex",
                          "&:hover": { color: "#EF4444" },
                        }}
                      >
                        <DeleteOutlined sx={{ fontSize: 16 }} />
                      </Box>
                    </Stack>
                  ))}
                  {form.mainDuties.length === 0 && (
                    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                      ‘추가’ 또는 ‘AI 자동 추천’으로 업무를 입력하세요.
                    </Typography>
                  )}
                </Stack>
              </Box>

              {/* 우대사항 */}
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                  <FieldLabel>우대사항</FieldLabel>
                  <Box
                    component="button"
                    type="button"
                    onClick={() => addLine("preferred")}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.25,
                      fontSize: 12,
                      color: "primary.main",
                      border: "none",
                      bgcolor: "transparent",
                      cursor: "pointer",
                      p: 0,
                      font: "inherit",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    <Add sx={{ fontSize: 12 }} />
                    추가
                  </Box>
                </Box>
                <Stack spacing={1}>
                  {form.preferred.map((p, i) => (
                    <Stack key={i} direction="row" alignItems="center" spacing={1}>
                      <Box
                        component="input"
                        value={p}
                        onChange={(e) => updateLine("preferred", i, e.target.value)}
                        placeholder="우대사항"
                        sx={inputSx}
                      />
                      <Box
                        component="button"
                        type="button"
                        onClick={() => removeLine("preferred", i)}
                        sx={{
                          flexShrink: 0,
                          p: 1,
                          borderRadius: "8px",
                          color: "text.secondary",
                          border: "none",
                          bgcolor: "transparent",
                          cursor: "pointer",
                          display: "flex",
                          "&:hover": { color: "#EF4444" },
                        }}
                      >
                        <DeleteOutlined sx={{ fontSize: 16 }} />
                      </Box>
                    </Stack>
                  ))}
                  {form.preferred.length === 0 && (
                    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>우대사항을 입력하세요.</Typography>
                  )}
                </Stack>
              </Box>

              {/* 추가질문 */}
              <Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                  <FieldLabel>지원서 추가질문</FieldLabel>
                  <Box
                    component="button"
                    type="button"
                    onClick={addQ}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.25,
                      fontSize: 12,
                      color: "primary.main",
                      border: "none",
                      bgcolor: "transparent",
                      cursor: "pointer",
                      p: 0,
                      font: "inherit",
                      "&:hover": { textDecoration: "underline" },
                    }}
                  >
                    <Add sx={{ fontSize: 12 }} />
                    추가
                  </Box>
                </Box>
                <Stack spacing={1}>
                  {form.coverLetterQuestions.map((q) => (
                    <Stack key={q.id} direction="row" alignItems="center" spacing={1}>
                      <Box
                        component="input"
                        value={q.question}
                        onChange={(e) => updateQ(q.id, e.target.value)}
                        placeholder="질문 내용"
                        sx={inputSx}
                      />
                      <Box
                        component="button"
                        type="button"
                        onClick={() => removeQ(q.id)}
                        sx={{
                          flexShrink: 0,
                          p: 1,
                          borderRadius: "8px",
                          color: "text.secondary",
                          border: "none",
                          bgcolor: "transparent",
                          cursor: "pointer",
                          display: "flex",
                          "&:hover": { color: "#EF4444" },
                        }}
                      >
                        <DeleteOutlined sx={{ fontSize: 16 }} />
                      </Box>
                    </Stack>
                  ))}
                  {form.coverLetterQuestions.length === 0 && (
                    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>추가질문을 입력하세요.</Typography>
                  )}
                </Stack>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", pt: 1 }}>
                <Box
                  component="button"
                  type="button"
                  onClick={() => setStep(1)}
                  sx={{
                    px: 2.5,
                    py: 1.25,
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "transparent",
                    fontSize: 14,
                    cursor: "pointer",
                    font: "inherit",
                    color: "text.primary",
                  }}
                >
                  ← 이전
                </Box>
                <Box
                  component="button"
                  type="button"
                  onClick={handleSave}
                  sx={{
                    px: 2.5,
                    py: 1.25,
                    borderRadius: "12px",
                    bgcolor: "primary.main",
                    color: "#fff",
                    fontSize: 14,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    font: "inherit",
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    transition: "background-color .15s",
                    "&:hover": { bgcolor: "#4F46E5" },
                  }}
                >
                  <Save sx={{ fontSize: 16 }} />
                  저장
                </Box>
              </Box>
            </Stack>
          </Box>
        )}
      </Box>
    );
  }

  // ── 목록 뷰 ──
  return (
    <Box>
      <Toast msg={toast} />
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography sx={{ fontSize: 30, fontWeight: 700, color: "text.primary", mb: 1 }}>공고 관리</Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>채용 공고 승인 및 관리</Typography>
        </Box>
        <Button
          onClick={openCreate}
          startIcon={<Add sx={{ fontSize: 16 }} />}
          sx={{
            px: 2,
            py: 1.25,
            borderRadius: "8px",
            bgcolor: "primary.main",
            color: "#fff",
            fontSize: 14,
            "&:hover": { bgcolor: "#4F46E5" },
          }}
        >
          공고 등록
        </Button>
      </Box>

      <Stack direction="row" spacing={0.5} sx={{ mb: 2 }}>
        {tabs.map((t) => {
          const active = tab === t;
          return (
            <Box
              component="button"
              type="button"
              key={t}
              onClick={() => setTab(t)}
              sx={{
                px: 2,
                py: 1,
                borderRadius: "8px",
                fontSize: 14,
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                font: "inherit",
                transition: "color .15s, background-color .15s",
                bgcolor: active ? "primary.main" : "#F8F9FF",
                color: active ? "#fff" : "text.secondary",
                "&:hover": { color: active ? "#fff" : "text.primary" },
              }}
            >
              {t}
            </Box>
          );
        })}
      </Stack>

      <Box
        sx={{
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "#fff",
          overflow: "hidden",
        }}
      >
        <Box sx={{ overflowX: "auto" }}>
          <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
            <Box component="thead" sx={{ bgcolor: "#F8F9FF" }}>
              <Box component="tr">
                {["회사명", "공고제목", "지원자수", "마감일", "상태", "작업"].map((h) => (
                  <Box
                    component="th"
                    key={h}
                    sx={{
                      px: 2.5,
                      py: 1.5,
                      textAlign: "left",
                      fontSize: 12,
                      fontWeight: 500,
                      color: "text.secondary",
                    }}
                  >
                    {h}
                  </Box>
                ))}
              </Box>
            </Box>
            <Box component="tbody">
              {filtered.map((j) => (
                <Box
                  component="tr"
                  key={j.id}
                  sx={{
                    borderTop: "1px solid",
                    borderColor: "divider",
                    transition: "background-color .15s",
                    "&:hover": { bgcolor: "rgba(248,249,255,0.5)" },
                  }}
                >
                  <Box component="td" sx={{ px: 2.5, py: 2, fontSize: 14, fontWeight: 500, color: "text.primary" }}>
                    {j.company}
                  </Box>
                  <Box component="td" sx={{ px: 2.5, py: 2, fontSize: 14, color: "text.primary" }}>
                    {j.title}
                  </Box>
                  <Box component="td" sx={{ px: 2.5, py: 2, fontSize: 14, color: "text.primary", fontFamily: mono }}>
                    {j.applicants}명
                  </Box>
                  <Box component="td" sx={{ px: 2.5, py: 2, fontSize: 14, color: "text.secondary", fontFamily: mono }}>
                    {j.deadline}
                  </Box>
                  <Box component="td" sx={{ px: 2.5, py: 2 }}>
                    <StatusBadge status={j.status} />
                  </Box>
                  <Box component="td" sx={{ px: 2.5, py: 2 }}>
                    <Stack direction="row" alignItems="center" spacing={0.75}>
                      <Box
                        component="button"
                        type="button"
                        onClick={() => openEdit(j)}
                        sx={{
                          px: 1.25,
                          py: 0.5,
                          borderRadius: "8px",
                          bgcolor: "#F8F9FF",
                          color: "text.primary",
                          fontSize: 12,
                          border: "none",
                          cursor: "pointer",
                          font: "inherit",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          transition: "background-color .15s",
                          "&:hover": { bgcolor: "rgba(248,249,255,0.7)" },
                        }}
                      >
                        <EditOutlined sx={{ fontSize: 12 }} />
                        수정
                      </Box>
                      {j.status === "대기" && (
                        <>
                          <Box
                            component="button"
                            type="button"
                            onClick={() =>
                              setJobs((prev) => prev.map((x) => (x.id === j.id ? { ...x, status: "승인" } : x)))
                            }
                            sx={{
                              px: 1.25,
                              py: 0.5,
                              borderRadius: "8px",
                              bgcolor: "#DCFCE7",
                              color: "#15803D",
                              fontSize: 12,
                              border: "none",
                              cursor: "pointer",
                              font: "inherit",
                              transition: "background-color .15s",
                              "&:hover": { bgcolor: "#BBF7D0" },
                            }}
                          >
                            승인
                          </Box>
                          <Box
                            component="button"
                            type="button"
                            onClick={() =>
                              setJobs((prev) => prev.map((x) => (x.id === j.id ? { ...x, status: "반려" } : x)))
                            }
                            sx={{
                              px: 1.25,
                              py: 0.5,
                              borderRadius: "8px",
                              bgcolor: "#FEE2E2",
                              color: "#DC2626",
                              fontSize: 12,
                              border: "none",
                              cursor: "pointer",
                              font: "inherit",
                              transition: "background-color .15s",
                              "&:hover": { bgcolor: "#FECACA" },
                            }}
                          >
                            반려
                          </Box>
                        </>
                      )}
                      {j.status === "승인" && (
                        <Box
                          component="button"
                          type="button"
                          onClick={() => {
                            if (window.confirm("이 공고를 강제 삭제하시겠습니까?"))
                              setJobs((prev) => prev.map((x) => (x.id === j.id ? { ...x, status: "삭제" } : x)));
                          }}
                          sx={{
                            px: 1.25,
                            py: 0.5,
                            borderRadius: "8px",
                            bgcolor: "#FEE2E2",
                            color: "#DC2626",
                            fontSize: 12,
                            border: "none",
                            cursor: "pointer",
                            font: "inherit",
                            transition: "background-color .15s",
                            "&:hover": { bgcolor: "#FECACA" },
                          }}
                        >
                          강제삭제
                        </Box>
                      )}
                    </Stack>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
