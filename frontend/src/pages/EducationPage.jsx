import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Stack } from "@mui/material";
import {
  MenuBook,
  ChevronRight,
  AutoAwesome,
  EmojiEvents,
  AccessTime,
  CheckCircle,
  Lock,
  PlayArrow,
  BarChart,
  Terminal,
  Close,
} from "@mui/icons-material";
import { AIRecommendCard } from "../components/common/AIRecommendCard";
import {
  CATEGORIES,
  COURSES,
  WEAK_CONCEPTS,
  QUIZ_TOPICS,
  ALL_QUIZZES,
} from "../data/educationMock";

// 원본 ../auth 의 실행 가드(프로토타입 localStorage 플래그)를 그대로 복제.
// 페이지 열람은 자유, "AI 퀴즈 시작/약점카드/주제칩/코딩테스트" 같은 실행 동작만 가드한다.
function isAuthed() {
  try {
    return localStorage.getItem("devready_authed") === "1";
  } catch {
    return false;
  }
}
function isResumeComplete() {
  try {
    const v = localStorage.getItem("devready_resume_complete");
    return v === null ? true : v === "1";
  } catch {
    return true;
  }
}

const mono = "'DM Mono', monospace";

/**
 * 교육 센터 (/education) — test-demo-UI/EducationPage.tsx → JS+MUI.
 * 공통 레이아웃(헤더/띠)은 App.jsx 의 Layout 이 감싸므로 본문만 렌더.
 * 두 렌더 모드: quizActive(풀스크린 퀴즈) / 메인(컨테이너 max-w-6xl=1152).
 * AI 추천 카드는 공용 부품 common/AIRecommendCard 를 variant="education" 으로 사용.
 */
export default function EducationPage() {
  const navigate = useNavigate();

  // 비로그인 → /auth, 이력서 미완 → /resume, 둘 다 충족 → 실행
  const guard = (action) => {
    if (!isAuthed()) {
      navigate("/auth");
      return;
    }
    if (!isResumeComplete()) {
      navigate("/resume");
      return;
    }
    action();
  };

  const [cat, setCat] = useState("all");
  const [quizActive, setQuizActive] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [descriptiveInput, setDescriptiveInput] = useState("");
  const [weakConcepts, setWeakConcepts] = useState(WEAK_CONCEPTS);

  const QUIZ = ALL_QUIZZES;

  const filtered =
    cat === "all" ? COURSES : COURSES.filter((c) => c.category === cat);

  const goNextQuiz = () => {
    if (quizIdx < QUIZ.length - 1) {
      setQuizIdx(quizIdx + 1);
      setQuizAnswer(null);
      setDescriptiveInput("");
    } else {
      setQuizActive(false);
      setQuizAnswer(null);
      setQuizIdx(0);
      setDescriptiveInput("");
    }
  };

  const handleWrongAnswer = (q) => {
    // 약점 개념에 없으면 추가
    const title = q.q.slice(0, 30) + "...";
    setWeakConcepts((prev) => {
      if (prev.some((w) => w.title === title)) return prev;
      return [...prev, { title, category: "AI 퀴즈", wrongRate: 80 }];
    });
  };

  // ───────────── 풀스크린 퀴즈 모드 ─────────────
  if (quizActive) {
    const q = QUIZ[quizIdx];
    const isAnswered = quizAnswer !== null;
    const isCorrect = quizAnswer === q.answer;

    const closeQuiz = () => {
      setQuizActive(false);
      setQuizAnswer(null);
      setQuizIdx(0);
      setDescriptiveInput("");
    };

    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 6,
          bgcolor: "#F8F9FF",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 672 }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                AI 퀴즈
              </Typography>
              <Box sx={{ display: "flex", gap: 0.5 }}>
                {QUIZ.map((_, i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "999px",
                      transition: "background-color .2s",
                      bgcolor:
                        i < quizIdx
                          ? "#34D399"
                          : i === quizIdx
                          ? "primary.main"
                          : "divider",
                    }}
                  />
                ))}
              </Box>
              <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                {quizIdx + 1} / {QUIZ.length}
              </Typography>
            </Stack>
            <Button
              onClick={closeQuiz}
              startIcon={<Close sx={{ fontSize: 16 }} />}
              sx={{
                fontSize: 14,
                minWidth: 0,
                p: 0.5,
                color: "text.secondary",
                "&:hover": { color: "text.primary", bgcolor: "transparent" },
              }}
            >
              종료
            </Button>
          </Box>

          <Box
            sx={{
              borderRadius: "16px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              p: 4,
              boxShadow: 1,
            }}
          >
            {/* Type badge */}
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2.5 }}
            >
              <AutoAwesome sx={{ fontSize: 16, color: "primary.main" }} />
              <Typography
                component="span"
                sx={{ fontSize: 12, color: "primary.main", fontWeight: 500 }}
              >
                Claude AI 생성 문제
              </Typography>
              <Box
                component="span"
                sx={{
                  fontSize: 12,
                  px: 1,
                  py: 0.25,
                  borderRadius: "999px",
                  fontWeight: 500,
                  border: "1px solid",
                  ...(q.type === "ox"
                    ? { bgcolor: "#EFF6FF", color: "#2563EB", borderColor: "#BFDBFE" }
                    : q.type === "descriptive"
                    ? { bgcolor: "#FAF5FF", color: "#9333EA", borderColor: "#E9D5FF" }
                    : { bgcolor: "#EEF2FF", color: "#4F46E5", borderColor: "#C7D2FE" }),
                }}
              >
                {q.type === "ox"
                  ? "O/X"
                  : q.type === "descriptive"
                  ? "서술형"
                  : "객관식"}
              </Box>
            </Box>

            <Typography
              sx={{ color: "text.primary", mb: 3, lineHeight: 1.7 }}
            >
              {q.q}
            </Typography>

            {/* Multiple choice */}
            {q.type === "multiple" && q.opts && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                {q.opts.map((opt, i) => {
                  let style;
                  if (!isAnswered) {
                    style = {
                      borderColor: "divider",
                      bgcolor: "#F8F9FF",
                      color: "text.primary",
                      "&:hover": {
                        borderColor: "rgba(108,99,255,0.4)",
                        bgcolor: "rgba(108,99,255,0.05)",
                      },
                    };
                  } else if (i === q.answer) {
                    style = { borderColor: "#34D399", bgcolor: "#F0FDF4", color: "#15803D" };
                  } else if (i === quizAnswer) {
                    style = { borderColor: "#FCA5A5", bgcolor: "#FEF2F2", color: "#DC2626" };
                  } else {
                    style = {
                      borderColor: "divider",
                      bgcolor: "#F8F9FF",
                      color: "text.secondary",
                      opacity: 0.6,
                    };
                  }
                  return (
                    <Box
                      key={i}
                      component="button"
                      type="button"
                      disabled={isAnswered}
                      onClick={() => {
                        setQuizAnswer(i);
                        if (i !== q.answer) handleWrongAnswer(q);
                      }}
                      sx={{
                        px: 2,
                        py: 1.5,
                        borderRadius: "12px",
                        border: "1px solid",
                        fontSize: 14,
                        textAlign: "left",
                        font: "inherit",
                        cursor: isAnswered ? "default" : "pointer",
                        transition: "all .2s",
                        ...style,
                      }}
                    >
                      <Box component="span" sx={{ fontWeight: 500, mr: 1 }}>
                        {["①", "②", "③", "④"][i]}
                      </Box>
                      {opt}
                    </Box>
                  );
                })}
              </Box>
            )}

            {/* O/X */}
            {q.type === "ox" && (
              <Box sx={{ display: "flex", gap: 2 }}>
                {["O", "X"].map((ox) => {
                  let style;
                  if (!isAnswered) {
                    style = {
                      borderColor: "divider",
                      bgcolor: "#F8F9FF",
                      color: "text.secondary",
                      "&:hover": { borderColor: "rgba(108,99,255,0.4)" },
                    };
                  } else if (ox === q.answer) {
                    style = { borderColor: "#34D399", bgcolor: "#F0FDF4", color: "#16A34A" };
                  } else if (ox === quizAnswer) {
                    style = { borderColor: "#FCA5A5", bgcolor: "#FEF2F2", color: "#EF4444" };
                  } else {
                    style = {
                      borderColor: "divider",
                      bgcolor: "#F8F9FF",
                      color: "text.secondary",
                      opacity: 0.4,
                    };
                  }
                  return (
                    <Box
                      key={ox}
                      component="button"
                      type="button"
                      disabled={isAnswered}
                      onClick={() => {
                        setQuizAnswer(ox);
                        if (ox !== q.answer) handleWrongAnswer(q);
                      }}
                      sx={{
                        flex: 1,
                        py: 3,
                        borderRadius: "16px",
                        border: "2px solid",
                        fontSize: 36,
                        fontWeight: 700,
                        font: "inherit",
                        cursor: isAnswered ? "default" : "pointer",
                        transition: "all .2s",
                        ...style,
                      }}
                    >
                      {ox}
                    </Box>
                  );
                })}
              </Box>
            )}

            {/* Descriptive */}
            {q.type === "descriptive" && (
              <Box>
                <Box
                  component="textarea"
                  value={descriptiveInput}
                  onChange={(e) => setDescriptiveInput(e.target.value)}
                  disabled={isAnswered}
                  placeholder="여기에 답을 작성하세요..."
                  rows={4}
                  sx={{
                    width: "100%",
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "#F8F9FF",
                    p: 2,
                    fontSize: 14,
                    color: "text.primary",
                    font: "inherit",
                    resize: "none",
                    boxSizing: "border-box",
                    "&:focus": {
                      outline: "none",
                      borderColor: "rgba(108,99,255,0.4)",
                    },
                    "&::placeholder": { color: "text.secondary" },
                  }}
                />
                {!isAnswered && (
                  <Button
                    fullWidth
                    onClick={() => setQuizAnswer(descriptiveInput || "(빈 답변)")}
                    variant="contained"
                    sx={{ mt: 1.5, py: 1.25, borderRadius: "12px", fontSize: 14 }}
                  >
                    답변 제출
                  </Button>
                )}
              </Box>
            )}

            {/* Result */}
            {isAnswered && (
              <Box
                sx={{
                  mt: 2.5,
                  p: 2,
                  borderRadius: "12px",
                  border: "1px solid",
                  ...(q.type === "descriptive"
                    ? { bgcolor: "#EFF6FF", borderColor: "#BFDBFE" }
                    : isCorrect
                    ? { bgcolor: "#F0FDF4", borderColor: "#BBF7D0" }
                    : { bgcolor: "#FEF2F2", borderColor: "#FECACA" }),
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 500,
                    fontSize: 14,
                    mb: 1,
                    color:
                      q.type === "descriptive"
                        ? "#1D4ED8"
                        : isCorrect
                        ? "#15803D"
                        : "#DC2626",
                  }}
                >
                  {q.type === "descriptive"
                    ? "📝 모범 답안"
                    : isCorrect
                    ? "✓ 정답!"
                    : "✗ 오답"}
                </Typography>
                {q.type === "descriptive" && (
                  <Typography
                    sx={{ fontSize: 14, color: "#1E40AF", mb: 1, fontWeight: 500 }}
                  >
                    {q.answer}
                  </Typography>
                )}
                <Typography sx={{ fontSize: 14, color: "text.primary" }}>
                  {q.explanation}
                </Typography>
              </Box>
            )}

            {isAnswered && (
              <Button
                fullWidth
                onClick={goNextQuiz}
                variant="contained"
                sx={{
                  mt: 2,
                  py: 1.5,
                  borderRadius: "12px",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {quizIdx < QUIZ.length - 1 ? "다음 문제 →" : "퀴즈 완료"}
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    );
  }

  // ───────────── 메인 모드 ─────────────
  return (
    <Box sx={{ maxWidth: 1152, mx: "auto", px: 2, py: 5 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h1"
            sx={{ fontSize: 30, fontWeight: 700, color: "text.primary" }}
          >
            교육 센터
          </Typography>
          <Typography
            sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}
          >
            취약 개념부터 심화까지, AI가 맞춤 학습 경로를 추천합니다
          </Typography>
        </Box>
        <Button
          onClick={() => guard(() => setQuizActive(true))}
          variant="contained"
          startIcon={<AutoAwesome sx={{ fontSize: 16 }} />}
          sx={{
            px: 2.5,
            py: 1.25,
            borderRadius: "12px",
            fontSize: 14,
            boxShadow: "0 4px 16px rgba(99,102,241,0.25)",
          }}
        >
          AI 퀴즈 시작
        </Button>
      </Box>

      {/* 기본 베이스 정보 → 레벨테스트 기준 AI 추천 */}
      <AIRecommendCard variant="education" />

      {/* Stats */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
          gap: 2,
          mb: 4,
        }}
      >
        {[
          { label: "학습 완료", value: "79문항", icon: CheckCircle, color: "#22C55E" },
          { label: "진행 중", value: "3개 강좌", icon: PlayArrow, color: "#6C63FF" },
          { label: "총 학습 시간", value: "12.4h", icon: AccessTime, color: "#EAB308" },
          { label: "퀴즈 정답률", value: "76%", icon: EmojiEvents, color: "#F97316" },
        ].map(({ label, value, icon: Icon, color }) => (
          <Box
            key={label}
            sx={{
              borderRadius: "16px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              p: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1,
              }}
            >
              <Typography
                component="span"
                sx={{ fontSize: 12, color: "text.secondary" }}
              >
                {label}
              </Typography>
              <Icon sx={{ fontSize: 16, color }} />
            </Box>
            <Typography
              sx={{
                fontSize: 20,
                fontWeight: 700,
                color: "text.primary",
                fontFamily: mono,
              }}
            >
              {value}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* ══════════ 퀴즈칸 ══════════ */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <AutoAwesome sx={{ fontSize: 20, color: "primary.main" }} />
        <Typography
          variant="h2"
          sx={{ fontSize: 20, fontWeight: 700, color: "text.primary" }}
        >
          AI 퀴즈
        </Typography>
        <Typography
          component="span"
          sx={{
            fontSize: 12,
            color: "text.secondary",
            ml: 0.5,
            display: { xs: "none", sm: "inline" },
          }}
        >
          오답 분석 기반 약점 공략 · 추천 주제
        </Typography>
      </Box>

      {/* Weak concepts */}
      <Box
        sx={{
          borderRadius: "16px",
          border: "1px solid #FED7AA",
          bgcolor: "#FFF7ED",
          p: 2.5,
          mb: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <BarChart sx={{ fontSize: 16, color: "#F97316" }} />
          <Typography
            component="span"
            sx={{ fontWeight: 600, color: "text.primary", fontSize: 14 }}
          >
            취약 개념 반복 추천
          </Typography>
          <Typography
            component="span"
            sx={{ fontSize: 12, color: "text.secondary" }}
          >
            오답 기반 자동 선정
          </Typography>
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 1.5,
          }}
        >
          {weakConcepts.map((w) => (
            <Box
              key={w.title}
              component="button"
              type="button"
              onClick={() => guard(() => setQuizActive(true))}
              sx={{
                textAlign: "left",
                p: 1.5,
                borderRadius: "12px",
                bgcolor: "background.paper",
                border: "1px solid #FFEDD5",
                font: "inherit",
                cursor: "pointer",
                transition: "border-color .2s",
                "&:hover": { borderColor: "#FDBA74" },
              }}
            >
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "text.primary",
                  mb: 0.5,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {w.title}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography
                  component="span"
                  sx={{ fontSize: 12, color: "text.secondary" }}
                >
                  {w.category}
                </Typography>
                <Typography
                  component="span"
                  sx={{ fontSize: 12, color: "#EF4444", fontWeight: 500 }}
                >
                  {w.wrongRate}% 오답
                </Typography>
              </Box>
              <Box
                sx={{ mt: 1, height: 4, borderRadius: "999px", bgcolor: "#FFEDD5" }}
              >
                <Box
                  sx={{
                    height: 4,
                    borderRadius: "999px",
                    bgcolor: "#FB923C",
                    width: `${w.wrongRate}%`,
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* AI Quiz topic suggestions */}
      <Box
        sx={{
          borderRadius: "16px",
          border: "1px solid rgba(108,99,255,0.2)",
          bgcolor: "rgba(108,99,255,0.05)",
          p: 2.5,
          mb: 5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <AutoAwesome sx={{ fontSize: 16, color: "primary.main" }} />
          <Typography
            component="span"
            sx={{ fontWeight: 600, color: "text.primary", fontSize: 14 }}
          >
            오늘의 AI 추천 퀴즈 주제
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          {QUIZ_TOPICS.map((t) => (
            <Box
              key={t.label}
              component="button"
              type="button"
              onClick={() => guard(() => setQuizActive(true))}
              sx={{
                px: 1.5,
                py: 0.75,
                borderRadius: "999px",
                bgcolor: "background.paper",
                border: "1px solid rgba(108,99,255,0.2)",
                fontSize: 14,
                color: "primary.main",
                font: "inherit",
                cursor: "pointer",
                transition: "all .2s",
                "&:hover": { bgcolor: "primary.main", color: "#fff" },
              }}
            >
              {t.label}
            </Box>
          ))}
        </Box>
      </Box>

      {/* ══════════ 교육칸 ══════════ */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <MenuBook sx={{ fontSize: 20, color: "primary.main" }} />
        <Typography
          variant="h2"
          sx={{ fontSize: 20, fontWeight: 700, color: "text.primary" }}
        >
          교육 · 강의
        </Typography>
        <Typography
          component="span"
          sx={{
            fontSize: 12,
            color: "text.secondary",
            ml: 0.5,
            display: { xs: "none", sm: "inline" },
          }}
        >
          맞춤 강의와 코딩 테스트로 실력 향상
        </Typography>
      </Box>

      {/* Coding test entry */}
      <Box
        onClick={() => guard(() => navigate("/education/coding-test"))}
        sx={{
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "grey.200",
          background: "linear-gradient(to right, #111827, #1F2937)",
          p: 2.5,
          mb: 3,
          cursor: "pointer",
          transition: "box-shadow .2s",
          "&:hover": { boxShadow: 6 },
          "&:hover .ct-arrow": { color: "#A5B4FC" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                bgcolor: "rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Terminal sx={{ fontSize: 20, color: "#fff" }} />
            </Box>
            <Box>
              <Typography sx={{ color: "#fff", fontWeight: 600 }}>
                코딩 테스트 연습
              </Typography>
              <Typography sx={{ color: "#9CA3AF", fontSize: 14 }}>
                알고리즘 문제풀이 · 6개 문제
              </Typography>
            </Box>
          </Stack>
          <Box
            className="ct-arrow"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              color: "#818CF8",
              transition: "color .2s",
            }}
          >
            <Typography component="span" sx={{ fontSize: 14, fontWeight: 500 }}>
              시작하기
            </Typography>
            <ChevronRight sx={{ fontSize: 16 }} />
          </Box>
        </Box>
      </Box>

      {/* Category filter */}
      <Box
        sx={{
          display: "flex",
          gap: 1,
          mb: 3,
          overflowX: "auto",
          pb: 0.5,
        }}
      >
        {CATEGORIES.map((c) => (
          <Box
            key={c.id}
            component="button"
            type="button"
            onClick={() => setCat(c.id)}
            sx={{
              flexShrink: 0,
              px: 2,
              py: 1,
              borderRadius: "8px",
              fontSize: 14,
              font: "inherit",
              cursor: "pointer",
              border: cat === c.id ? "1px solid transparent" : "1px solid",
              transition: "color .2s, background-color .2s",
              ...(cat === c.id
                ? { bgcolor: "primary.main", color: "#fff" }
                : {
                    bgcolor: "#F8F9FF",
                    borderColor: "divider",
                    color: "text.secondary",
                    "&:hover": { color: "text.primary" },
                  }),
            }}
          >
            {c.label}
          </Box>
        ))}
      </Box>

      {/* Course grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          },
          gap: 2,
        }}
      >
        {filtered.map((c) => (
          <CourseCard
            key={c.id}
            course={c}
            onClick={() => navigate(`/education/course/${c.id}`)}
          />
        ))}
      </Box>
    </Box>
  );
}

// 강좌 카드 1개 (코스 그리드 반복 블록 → 로컬 함수 컴포넌트)
function CourseCard({ course: c, onClick }) {
  const Icon = c.icon;
  return (
    <Box
      onClick={onClick}
      sx={{
        borderRadius: "16px",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        p: 2.5,
        cursor: "pointer",
        transition: "all .2s",
        "&:hover": { boxShadow: 3, borderColor: "rgba(108,99,255,0.3)" },
        "&:hover .course-cta": { color: "primary.dark" },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          mb: 1.5,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: `${c.color}18`,
          }}
        >
          <Icon sx={{ fontSize: 20, color: c.color }} />
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            component="span"
            sx={{
              fontSize: 12,
              color: "text.secondary",
              px: 1,
              py: 0.25,
              borderRadius: "999px",
              bgcolor: "#F8F9FF",
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            {c.level}
          </Box>
          {c.progress === 0 && (
            <Lock sx={{ fontSize: 14, color: "text.secondary" }} />
          )}
        </Box>
      </Box>

      <Typography
        sx={{ fontWeight: 600, color: "text.primary", mb: 0.5 }}
      >
        {c.title}
      </Typography>
      <Typography
        sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.7, mb: 2 }}
      >
        {c.desc}
      </Typography>

      <Box sx={{ mb: 1.5 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            mb: 0.75,
          }}
        >
          <Typography
            component="span"
            sx={{ fontSize: 12, color: "text.secondary" }}
          >
            {c.done}/{c.total} 완료
          </Typography>
          <Typography
            component="span"
            sx={{
              fontSize: 12,
              fontWeight: 500,
              color: "text.primary",
              fontFamily: mono,
            }}
          >
            {c.progress}%
          </Typography>
        </Box>
        <Box sx={{ height: 6, borderRadius: "999px", bgcolor: "#F1F3FB" }}>
          <Box
            sx={{
              height: 6,
              borderRadius: "999px",
              transition: "width .3s",
              width: `${c.progress}%`,
              backgroundColor: c.color,
            }}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            fontSize: 12,
            color: "text.secondary",
          }}
        >
          <AccessTime sx={{ fontSize: 12 }} />
          {c.time}
        </Box>
        <Box
          className="course-cta"
          component="span"
          sx={{
            fontSize: 12,
            color: "primary.main",
            display: "flex",
            alignItems: "center",
            gap: 0.25,
            fontWeight: 500,
            transition: "color .2s",
          }}
        >
          학습하기 <ChevronRight sx={{ fontSize: 12 }} />
        </Box>
      </Box>
    </Box>
  );
}
