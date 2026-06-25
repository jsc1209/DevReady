import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  RadioButtonUnchecked,
  MenuBook,
  PlayArrow,
  Code,
  Description,
  EmojiEvents,
  ExpandMore,
  ExpandLess,
  Lightbulb,
  Close,
  AutoAwesome,
} from "@mui/icons-material";
import { getQuiz, grade } from "../data/courseQuiz";
import { COURSE_DATA, DEFAULT_COURSE } from "../data/courseDetailMock";

// 챕터 type → 아이콘 (원본 typeIcon 맵). lucide → @mui/icons-material 치환.
const typeIcon = { video: PlayArrow, text: Description, quiz: EmojiEvents, code: Code };

/**
 * 강의 상세 (/education/:id) — test-demo-UI/CourseDetailPage.tsx → JS+MUI.
 * 이 화면은 원본이 bg-[#F7F8FA] + 흰 카드 + gray 계열을 직접 쓰므로(브랜드 토큰 X)
 * 해당 hex 를 그대로 유지한다. 강조색은 course.color(동적 hex).
 * 공통 헤더/띠는 App 의 Layout 이 감싸지만, 이 화면은 자체 sticky 강의 헤더를 별도로 둔다(원본 동일).
 */
export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = id ? COURSE_DATA[id] ?? DEFAULT_COURSE : DEFAULT_COURSE;

  // 완료된 챕터 추적
  const allChapters = course.units.flatMap((u) => u.chapters);

  // 진행도 자동 저장 (localStorage) — 나갔다 와도 유지
  const courseId = id ?? "default";
  const STORE_KEY = `devready_course_${courseId}`;
  const readSaved = () => {
    try {
      return JSON.parse(localStorage.getItem(STORE_KEY) || "{}");
    } catch {
      return {};
    }
  };

  const [completedIds, setCompletedIds] = useState(() => {
    const s = readSaved();
    return Array.isArray(s.completed)
      ? new Set(s.completed)
      : new Set(allChapters.slice(0, Math.floor(allChapters.length * 0.4)).map((c) => c.id));
  });
  const [currentChapterId, setCurrentChapterId] = useState(() => {
    const s = readSaved();
    return typeof s.currentChapterId === "number" ? s.currentChapterId : allChapters[0]?.id ?? 1;
  });
  const [quizResults, setQuizResults] = useState(() => {
    const s = readSaved();
    return s.quiz && typeof s.quiz === "object" ? s.quiz : {};
  });
  const [openUnits, setOpenUnits] = useState(new Set(course.units.map((u) => u.id)));
  const [showCode, setShowCode] = useState(false);

  // 단계 퀴즈 / 완료 화면 상태
  const [quizOpen, setQuizOpen] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [qSelected, setQSelected] = useState(null);
  const [qText, setQText] = useState("");
  const [qCode, setQCode] = useState("");
  const [showComplete, setShowComplete] = useState(false);

  // 변경 시 자동 저장
  useEffect(() => {
    try {
      localStorage.setItem(
        STORE_KEY,
        JSON.stringify({ completed: [...completedIds], quiz: quizResults, currentChapterId })
      );
    } catch {
      /* ignore */
    }
  }, [completedIds, quizResults, currentChapterId, STORE_KEY]);

  const currentChapter = allChapters.find((c) => c.id === currentChapterId);
  const currentIdx = allChapters.findIndex((c) => c.id === currentChapterId);
  const progress = Math.round((completedIds.size / allChapters.length) * 100);

  const currentQuiz = currentChapter ? getQuiz(courseId, currentChapterId, currentChapter.title) : null;
  const quizAnswerable = !currentQuiz
    ? false
    : currentQuiz.type === "객관식"
    ? qSelected !== null
    : currentQuiz.type === "코딩"
    ? qCode.trim().length > 0
    : qText.trim().length > 0;

  function markDone() {
    // 이미 완료된 챕터면 퀴즈 없이 다음으로
    if (completedIds.has(currentChapterId)) {
      if (currentIdx < allChapters.length - 1) setCurrentChapterId(allChapters[currentIdx + 1].id);
      return;
    }
    // 미완료 → 단계 퀴즈 (응답 초기화)
    setQSelected(null);
    setQText("");
    setQCode(currentQuiz?.starterCode ?? "");
    setQuizFeedback(null);
    setQuizOpen(true);
  }

  function submitQuiz() {
    if (!currentChapter || !currentQuiz) return;
    const res = { selected: qSelected ?? undefined, text: qText, code: qCode };
    const ok = grade(currentQuiz, res);
    setQuizResults((prev) => ({ ...prev, [currentChapterId]: { type: currentQuiz.type, correct: ok } }));
    setCompletedIds((prev) => new Set([...prev, currentChapterId])); // 오답이어도 진행, 정확도에만 반영
    setQuizFeedback(ok);
  }

  function proceedAfterQuiz() {
    setQuizOpen(false);
    setQuizFeedback(null);
    const willAllDone = new Set([...completedIds, currentChapterId]).size === allChapters.length;
    if (willAllDone) {
      setShowComplete(true);
      return;
    }
    if (currentIdx < allChapters.length - 1) setCurrentChapterId(allChapters[currentIdx + 1].id);
  }

  function getStatus(chapterId) {
    if (completedIds.has(chapterId)) return "done";
    if (chapterId === currentChapterId) return "current";
    return "locked";
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F7F8FA" }}>
      {/* Header */}
      <Box
        sx={{
          bgcolor: "#fff",
          borderBottom: "1px solid",
          borderColor: "#E5E7EB",
          px: 2,
          py: 1.5,
          position: "sticky",
          top: 0,
          zIndex: 30,
        }}
      >
        <Box sx={{ maxWidth: 1280, mx: "auto", display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            component="button"
            onClick={() => navigate("/education")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              fontSize: 14,
              color: "#6B7280",
              bgcolor: "transparent",
              border: "none",
              cursor: "pointer",
              p: 0,
              transition: "color .15s",
              "&:hover": { color: "#1F2937" },
            }}
          >
            <ChevronLeft sx={{ fontSize: 16 }} />
            교육 센터
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              component="h1"
              sx={{
                fontWeight: 700,
                color: "#111827",
                fontSize: 16,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {course.title}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexShrink: 0 }}>
            <Box
              sx={{
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 1,
                fontSize: 14,
                color: "#6B7280",
              }}
            >
              <Box
                sx={{
                  width: 128,
                  height: 6,
                  bgcolor: "#E5E7EB",
                  borderRadius: "999px",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    height: "100%",
                    borderRadius: "999px",
                    transition: "all .3s",
                    width: `${progress}%`,
                    backgroundColor: course.color,
                  }}
                />
              </Box>
              <Box component="span" sx={{ fontWeight: 500, color: "#374151" }}>
                {progress}%
              </Box>
            </Box>
            <Box
              component="span"
              sx={{
                fontSize: 12,
                px: 1,
                py: 0.5,
                borderRadius: "999px",
                bgcolor: "#F3F4F6",
                color: "#4B5563",
              }}
            >
              {course.level}
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          maxWidth: 1280,
          mx: "auto",
          px: 2,
          py: 3,
          display: "flex",
          gap: 2.5,
          alignItems: "flex-start",
        }}
      >
        {/* Sidebar: chapter list (lg only) */}
        <Box component="aside" sx={{ display: { xs: "none", lg: "block" }, width: 256, flexShrink: 0 }}>
          <Box
            sx={{
              bgcolor: "#fff",
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "#E5E7EB",
              overflow: "hidden",
              position: "sticky",
              top: 80,
            }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "#F3F4F6" }}>
              <Typography sx={{ fontSize: 12, color: "#6B7280", mb: 0.5 }}>전체 진행률</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    flex: 1,
                    height: 8,
                    bgcolor: "#F3F4F6",
                    borderRadius: "999px",
                    overflow: "hidden",
                  }}
                >
                  <Box
                    sx={{
                      height: "100%",
                      borderRadius: "999px",
                      transition: "all .3s",
                      width: `${progress}%`,
                      backgroundColor: course.color,
                    }}
                  />
                </Box>
                <Box component="span" sx={{ fontSize: 12, fontWeight: 700, color: "#374151" }}>
                  {completedIds.size}/{allChapters.length}
                </Box>
              </Box>
            </Box>
            <Box sx={{ overflowY: "auto", maxHeight: "70vh" }}>
              {course.units.map((unit) => (
                <Box key={unit.id}>
                  <Box
                    component="button"
                    onClick={() =>
                      setOpenUnits((prev) => {
                        const n = new Set(prev);
                        if (n.has(unit.id)) n.delete(unit.id);
                        else n.add(unit.id);
                        return n;
                      })
                    }
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      px: 2,
                      py: 1.25,
                      bgcolor: "#F9FAFB",
                      border: "none",
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "background-color .15s",
                      "&:hover": { bgcolor: "#F3F4F6" },
                    }}
                  >
                    <Box component="span" sx={{ fontSize: 12, fontWeight: 600, color: "#4B5563" }}>
                      {unit.title}
                    </Box>
                    {openUnits.has(unit.id) ? (
                      <ExpandLess sx={{ fontSize: 12, color: "#9CA3AF" }} />
                    ) : (
                      <ExpandMore sx={{ fontSize: 12, color: "#9CA3AF" }} />
                    )}
                  </Box>
                  {openUnits.has(unit.id) &&
                    unit.chapters.map((ch) => {
                      const status = getStatus(ch.id);
                      const Icon = typeIcon[ch.type];
                      return (
                        <Box
                          component="button"
                          key={ch.id}
                          onClick={() => setCurrentChapterId(ch.id)}
                          sx={{
                            width: "100%",
                            display: "flex",
                            alignItems: "center",
                            gap: 1.25,
                            px: 2,
                            py: 1.25,
                            textAlign: "left",
                            border: "none",
                            cursor: "pointer",
                            transition: "background-color .15s",
                            bgcolor: currentChapterId === ch.id ? "#EEF2FF" : "transparent",
                            "&:hover": {
                              bgcolor: currentChapterId === ch.id ? "#EEF2FF" : "#F9FAFB",
                            },
                          }}
                        >
                          {status === "done" ? (
                            <CheckCircle sx={{ fontSize: 16, flexShrink: 0, color: "#22C55E" }} />
                          ) : status === "current" ? (
                            <Box
                              sx={{
                                width: 16,
                                height: 16,
                                borderRadius: "999px",
                                flexShrink: 0,
                                border: "2px solid #6366F1",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Box sx={{ width: 6, height: 6, borderRadius: "999px", bgcolor: "#6366F1" }} />
                            </Box>
                          ) : (
                            <RadioButtonUnchecked sx={{ fontSize: 16, flexShrink: 0, color: "#D1D5DB" }} />
                          )}
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              sx={{
                                fontSize: 12,
                                lineHeight: 1.4,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                fontWeight: currentChapterId === ch.id ? 500 : 400,
                                color: currentChapterId === ch.id ? "#4338CA" : "#374151",
                              }}
                            >
                              {ch.title}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: 12,
                                color: "#9CA3AF",
                                display: "flex",
                                alignItems: "center",
                                gap: 0.25,
                                mt: 0.25,
                              }}
                            >
                              <Icon sx={{ fontSize: 10 }} />
                              {ch.duration}
                            </Typography>
                          </Box>
                        </Box>
                      );
                    })}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Main content */}
        <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          {currentChapter && (
            <>
              <Box
                sx={{
                  bgcolor: "#fff",
                  borderRadius: "12px",
                  border: "1px solid",
                  borderColor: "#E5E7EB",
                  overflow: "hidden",
                }}
              >
                {/* Chapter header */}
                <Box
                  sx={{
                    px: 3,
                    py: 2,
                    borderBottom: "1px solid",
                    borderColor: "#F3F4F6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <MenuBook sx={{ fontSize: 16, color: course.color }} />
                      <Box component="span" sx={{ fontSize: 12, color: "#6B7280" }}>
                        {currentChapter.duration}
                      </Box>
                      {completedIds.has(currentChapterId) && (
                        <Box
                          component="span"
                          sx={{
                            fontSize: 12,
                            color: "#16A34A",
                            bgcolor: "#F0FDF4",
                            px: 1,
                            py: 0.25,
                            borderRadius: "999px",
                            display: "flex",
                            alignItems: "center",
                            gap: 0.25,
                          }}
                        >
                          <CheckCircle sx={{ fontSize: 12 }} />
                          완료
                        </Box>
                      )}
                    </Box>
                    <Typography component="h2" sx={{ fontWeight: 700, color: "#111827", fontSize: 18 }}>
                      {currentChapter.title}
                    </Typography>
                  </Box>
                </Box>

                {/* Content */}
                <Box sx={{ px: 3, py: 2.5 }}>
                  <Box sx={{ maxWidth: "none" }}>
                    {currentChapter.content.split("\n").map((line, i) => {
                      if (line.startsWith("## "))
                        return (
                          <Typography
                            component="h2"
                            key={i}
                            sx={{
                              fontSize: 20,
                              fontWeight: 700,
                              color: "#111827",
                              mt: 3,
                              mb: 1.5,
                              "&:first-of-type": { mt: 0 },
                            }}
                          >
                            {line.slice(3)}
                          </Typography>
                        );
                      if (line.startsWith("### "))
                        return (
                          <Typography
                            component="h3"
                            key={i}
                            sx={{ fontSize: 16, fontWeight: 600, color: "#1F2937", mt: 2, mb: 1 }}
                          >
                            {line.slice(4)}
                          </Typography>
                        );
                      if (line.startsWith("> "))
                        return (
                          <Box
                            component="blockquote"
                            key={i}
                            sx={{
                              borderLeft: "4px solid #A5B4FC",
                              pl: 2,
                              py: 0.5,
                              bgcolor: "#EEF2FF",
                              fontSize: 14,
                              color: "#3730A3",
                              borderRadius: "0 8px 8px 0",
                              my: 1.5,
                              m: 0,
                              mt: 1.5,
                              mb: 1.5,
                            }}
                          >
                            {line.slice(2)}
                          </Box>
                        );
                      if (line.startsWith("- "))
                        return (
                          <Box
                            component="li"
                            key={i}
                            sx={{
                              fontSize: 14,
                              color: "#374151",
                              ml: 2,
                              mb: 0.5,
                              listStyleType: "disc",
                            }}
                          >
                            {line.slice(2)}
                          </Box>
                        );
                      if (line.startsWith("| ")) {
                        const cells = line.split("|").filter((c) => c.trim());
                        if (line.includes("---")) return <Box key={i} />;
                        const isHeader =
                          i < 5 &&
                          currentChapter.content.split("\n").slice(i + 1, i + 2)[0]?.includes("---");
                        return (
                          <Box
                            key={i}
                            sx={{
                              display: "flex",
                              borderBottom: "1px solid",
                              borderColor: "#F3F4F6",
                              fontWeight: isHeader ? 500 : 400,
                              bgcolor: isHeader ? "#F9FAFB" : "transparent",
                              "&:hover": isHeader ? {} : { bgcolor: "#F9FAFB" },
                            }}
                          >
                            {cells.map((cell, j) => (
                              <Box key={j} sx={{ flex: 1, px: 1.5, py: 1, fontSize: 14, color: "#374151" }}>
                                {cell.trim()}
                              </Box>
                            ))}
                          </Box>
                        );
                      }
                      if (line.startsWith("```") || line === "")
                        return <Box key={i} sx={line === "" ? { height: 8 } : {}} />;
                      return (
                        <Typography key={i} sx={{ fontSize: 14, color: "#374151", lineHeight: 1.7 }}>
                          {line}
                        </Typography>
                      );
                    })}
                  </Box>

                  {/* Tip */}
                  {currentChapter.tip && (
                    <Box
                      sx={{
                        mt: 2.5,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                        bgcolor: "#FFFBEB",
                        border: "1px solid #FDE68A",
                        borderRadius: "12px",
                        p: 2,
                      }}
                    >
                      <Lightbulb sx={{ fontSize: 16, color: "#F59E0B", flexShrink: 0, mt: 0.25 }} />
                      <Typography sx={{ fontSize: 14, color: "#92400E" }}>{currentChapter.tip}</Typography>
                    </Box>
                  )}

                  {/* Code example */}
                  {currentChapter.codeExample && (
                    <Box sx={{ mt: 2.5 }}>
                      <Box
                        component="button"
                        onClick={() => setShowCode(!showCode)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          fontSize: 14,
                          fontWeight: 500,
                          color: "#374151",
                          bgcolor: "transparent",
                          border: "none",
                          cursor: "pointer",
                          p: 0,
                          mb: 1,
                          transition: "color .15s",
                          "&:hover": { color: "#4F46E5" },
                        }}
                      >
                        <Code sx={{ fontSize: 16 }} />
                        코드 예제 {showCode ? "접기" : "보기"}
                        <ExpandMore
                          sx={{
                            fontSize: 16,
                            transition: "transform .2s",
                            transform: showCode ? "rotate(180deg)" : "none",
                          }}
                        />
                      </Box>
                      {showCode && (
                        <Box
                          component="pre"
                          sx={{
                            bgcolor: "#111827",
                            color: "#F3F4F6",
                            borderRadius: "12px",
                            p: 2,
                            fontSize: 12,
                            overflowX: "auto",
                            lineHeight: 1.7,
                            fontFamily: "'DM Mono', monospace",
                            m: 0,
                            whiteSpace: "pre",
                          }}
                        >
                          <code>{currentChapter.codeExample}</code>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>

                {/* Actions */}
                <Box
                  sx={{
                    px: 3,
                    py: 2,
                    borderTop: "1px solid",
                    borderColor: "#F3F4F6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    component="button"
                    onClick={() => {
                      if (currentIdx > 0) {
                        const prevId = allChapters[currentIdx - 1].id;
                        setCompletedIds((prev) => {
                          const n = new Set(prev);
                          n.delete(prevId);
                          return n;
                        });
                        setQuizResults((prev) => {
                          const n = { ...prev };
                          delete n[prevId];
                          return n;
                        });
                        setCurrentChapterId(prevId);
                      }
                    }}
                    disabled={currentIdx === 0}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                      px: 2,
                      py: 1,
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      bgcolor: "transparent",
                      fontSize: 14,
                      color: "#4B5563",
                      cursor: "pointer",
                      transition: "background-color .15s",
                      "&:hover": { bgcolor: "#F9FAFB" },
                      "&:disabled": { opacity: 0.4, cursor: "default" },
                    }}
                  >
                    <ChevronLeft sx={{ fontSize: 16 }} />
                    이전
                  </Box>
                  <Box
                    component="button"
                    onClick={markDone}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 3,
                      py: 1.25,
                      borderRadius: "12px",
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#fff",
                      border: "none",
                      cursor: "pointer",
                      transition: "opacity .15s",
                      "&:hover": { opacity: 0.9 },
                      backgroundColor: completedIds.has(currentChapterId) ? "#10B981" : course.color,
                    }}
                  >
                    <CheckCircle sx={{ fontSize: 16 }} />
                    {completedIds.has(currentChapterId) ? "완료됨 · 다음으로" : "완료 · 다음으로"}
                  </Box>
                  <Box
                    component="button"
                    onClick={() =>
                      currentIdx < allChapters.length - 1 &&
                      setCurrentChapterId(allChapters[currentIdx + 1].id)
                    }
                    disabled={currentIdx === allChapters.length - 1}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.75,
                      px: 2,
                      py: 1,
                      borderRadius: "8px",
                      border: "1px solid #E5E7EB",
                      bgcolor: "transparent",
                      fontSize: 14,
                      color: "#4B5563",
                      cursor: "pointer",
                      transition: "background-color .15s",
                      "&:hover": { bgcolor: "#F9FAFB" },
                      "&:disabled": { opacity: 0.4, cursor: "default" },
                    }}
                  >
                    다음
                    <ChevronRight sx={{ fontSize: 16 }} />
                  </Box>
                </Box>
              </Box>

              {/* Mobile: chapter list */}
              <Box
                sx={{
                  display: { xs: "block", lg: "none" },
                  bgcolor: "#fff",
                  borderRadius: "12px",
                  border: "1px solid",
                  borderColor: "#E5E7EB",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    px: 2,
                    py: 1.5,
                    borderBottom: "1px solid",
                    borderColor: "#F3F4F6",
                    fontWeight: 600,
                    fontSize: 14,
                    color: "#1F2937",
                  }}
                >
                  전체 목차
                </Box>
                {course.units
                  .flatMap((u) => u.chapters)
                  .map((ch) => {
                    const status = getStatus(ch.id);
                    return (
                      <Box
                        component="button"
                        key={ch.id}
                        onClick={() => setCurrentChapterId(ch.id)}
                        sx={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          px: 2,
                          py: 1.5,
                          textAlign: "left",
                          borderBottom: "1px solid",
                          borderColor: "#F9FAFB",
                          border: "none",
                          borderBottomWidth: 1,
                          borderBottomStyle: "solid",
                          borderBottomColor: "#F9FAFB",
                          "&:last-of-type": { borderBottom: "none" },
                          cursor: "pointer",
                          transition: "background-color .15s",
                          bgcolor: currentChapterId === ch.id ? "#EEF2FF" : "transparent",
                          "&:hover": {
                            bgcolor: currentChapterId === ch.id ? "#EEF2FF" : "#F9FAFB",
                          },
                        }}
                      >
                        {status === "done" ? (
                          <CheckCircle sx={{ fontSize: 16, color: "#22C55E", flexShrink: 0 }} />
                        ) : (
                          <RadioButtonUnchecked sx={{ fontSize: 16, color: "#D1D5DB", flexShrink: 0 }} />
                        )}
                        <Box
                          component="span"
                          sx={{
                            fontSize: 14,
                            fontWeight: currentChapterId === ch.id ? 500 : 400,
                            color: currentChapterId === ch.id ? "#4338CA" : "#374151",
                          }}
                        >
                          {ch.title}
                        </Box>
                        <Box component="span" sx={{ fontSize: 12, color: "#9CA3AF", ml: "auto" }}>
                          {ch.duration}
                        </Box>
                      </Box>
                    );
                  })}
              </Box>
            </>
          )}
        </Box>
      </Box>

      {/* 단계 테스트 퀴즈 모달 */}
      {quizOpen && currentChapter && currentQuiz && (
        <Box
          sx={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            bgcolor: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: 2,
          }}
        >
          <Box
            sx={{
              bgcolor: "#fff",
              borderRadius: "16px",
              width: "100%",
              maxWidth: 512,
              boxShadow: 24,
              border: "1px solid",
              borderColor: "#E5E7EB",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 3,
                py: 2,
                borderBottom: "1px solid",
                borderColor: "#F3F4F6",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                <Box
                  component="span"
                  sx={{
                    fontSize: 12,
                    px: 1,
                    py: 0.25,
                    borderRadius: "999px",
                    fontWeight: 500,
                    flexShrink: 0,
                    backgroundColor: course.color + "20",
                    color: course.color,
                  }}
                >
                  {currentQuiz.type} 퀴즈
                </Box>
                <Box
                  component="span"
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "#111827",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {currentChapter.title}
                </Box>
              </Box>
              <Box
                component="button"
                onClick={() => {
                  setQuizOpen(false);
                  setQuizFeedback(null);
                }}
                sx={{
                  p: 0.5,
                  borderRadius: "8px",
                  flexShrink: 0,
                  border: "none",
                  bgcolor: "transparent",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#F3F4F6" },
                }}
              >
                <Close sx={{ fontSize: 16, color: "#9CA3AF" }} />
              </Box>
            </Box>

            <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2, maxHeight: "70vh", overflowY: "auto" }}>
              {quizFeedback === null ? (
                <>
                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#111827", lineHeight: 1.7 }}>
                    {currentQuiz.question}
                  </Typography>

                  {currentQuiz.type === "객관식" && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      {currentQuiz.options?.map((opt, i) => (
                        <Box
                          component="button"
                          key={i}
                          onClick={() => setQSelected(i)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.25,
                            px: 2,
                            py: 1.5,
                            borderRadius: "12px",
                            border: "1px solid",
                            textAlign: "left",
                            fontSize: 14,
                            cursor: "pointer",
                            transition: "background-color .15s",
                            borderColor: qSelected === i ? "#6366F1" : "#E5E7EB",
                            bgcolor: qSelected === i ? "#EEF2FF" : "transparent",
                            color: qSelected === i ? "#4338CA" : "#374151",
                            "&:hover": { bgcolor: qSelected === i ? "#EEF2FF" : "#F9FAFB" },
                          }}
                        >
                          <Box
                            component="span"
                            sx={{
                              width: 20,
                              height: 20,
                              borderRadius: "999px",
                              border: "2px solid",
                              borderColor: qSelected === i ? "#6366F1" : "#D1D5DB",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {qSelected === i && (
                              <Box component="span" sx={{ width: 8, height: 8, borderRadius: "999px", bgcolor: "#6366F1" }} />
                            )}
                          </Box>
                          {opt}
                        </Box>
                      ))}
                    </Box>
                  )}

                  {currentQuiz.type === "서술형" && (
                    <Box
                      component="textarea"
                      value={qText}
                      onChange={(e) => setQText(e.target.value)}
                      rows={5}
                      placeholder="답변을 작성하세요..."
                      sx={{
                        width: "100%",
                        px: 1.5,
                        py: 1.25,
                        borderRadius: "12px",
                        border: "1px solid #E5E7EB",
                        bgcolor: "#fff",
                        fontSize: 14,
                        fontFamily: "inherit",
                        resize: "vertical",
                        boxSizing: "border-box",
                        "&:focus": { outline: "none", boxShadow: "0 0 0 2px #C7D2FE" },
                      }}
                    />
                  )}

                  {currentQuiz.type === "코딩" && (
                    <Box
                      component="textarea"
                      value={qCode}
                      onChange={(e) => setQCode(e.target.value)}
                      rows={8}
                      spellCheck={false}
                      sx={{
                        width: "100%",
                        px: 1.5,
                        py: 1.5,
                        borderRadius: "12px",
                        bgcolor: "#111827",
                        color: "#F3F4F6",
                        fontSize: 12,
                        lineHeight: 1.7,
                        fontFamily: "monospace",
                        border: "none",
                        resize: "vertical",
                        boxSizing: "border-box",
                        "&:focus": { outline: "none", boxShadow: "0 0 0 2px #818CF8" },
                      }}
                    />
                  )}

                  <Box
                    component="button"
                    onClick={submitQuiz}
                    disabled={!quizAnswerable}
                    sx={{
                      width: "100%",
                      py: 1.25,
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      transition: "opacity .15s",
                      backgroundColor: course.color,
                      "&:hover": { opacity: 0.9 },
                      "&:disabled": { opacity: 0.4, cursor: "default" },
                    }}
                  >
                    제출
                  </Box>
                </>
              ) : (
                <Box sx={{ textAlign: "center", py: 0.5 }}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 1.5,
                      bgcolor: quizFeedback ? "#DCFCE7" : "#FEE2E2",
                    }}
                  >
                    {quizFeedback ? (
                      <CheckCircle sx={{ fontSize: 28, color: "#16A34A" }} />
                    ) : (
                      <Close sx={{ fontSize: 28, color: "#EF4444" }} />
                    )}
                  </Box>
                  <Typography component="h3" sx={{ fontWeight: 700, color: "#111827", mb: 0.5 }}>
                    {quizFeedback ? "정답입니다! 🎉" : "오답입니다"}
                  </Typography>
                  <Typography sx={{ fontSize: 14, color: "#6B7280", mb: 0.5 }}>
                    {quizFeedback
                      ? "잘 이해하고 계세요. 다음 단계로 넘어갑니다."
                      : "괜찮아요! 학습을 이어가고 정확도에 반영됩니다."}
                  </Typography>
                  {currentQuiz.type === "객관식" &&
                    currentQuiz.options &&
                    typeof currentQuiz.answerIndex === "number" && (
                      <Typography sx={{ fontSize: 12, color: "#9CA3AF", mb: 2 }}>
                        정답: {currentQuiz.options[currentQuiz.answerIndex]}
                      </Typography>
                    )}
                  <Box
                    component="button"
                    onClick={proceedAfterQuiz}
                    sx={{
                      width: "100%",
                      py: 1.25,
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 600,
                      mt: 1.5,
                      border: "none",
                      cursor: "pointer",
                      transition: "opacity .15s",
                      backgroundColor: course.color,
                      "&:hover": { opacity: 0.9 },
                    }}
                  >
                    {currentIdx === allChapters.length - 1 ? "학습 완료" : "다음 단계로"}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}

      {/* 전체 완료 화면 */}
      {showComplete &&
        (() => {
          const answered = Object.values(quizResults);
          const correct = answered.filter((r) => r.correct).length;
          const acc = answered.length ? Math.round((correct / answered.length) * 100) : 0;
          return (
            <Box
              sx={{
                position: "fixed",
                inset: 0,
                zIndex: 60,
                bgcolor: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2,
              }}
            >
              <Box
                sx={{
                  bgcolor: "#fff",
                  borderRadius: "16px",
                  width: "100%",
                  maxWidth: 448,
                  boxShadow: 24,
                  border: "1px solid",
                  borderColor: "#E5E7EB",
                  overflow: "hidden",
                  textAlign: "center",
                }}
              >
                <Box sx={{ px: 3, pt: 4, pb: 3 }}>
                  <Box sx={{ fontSize: 48, mb: 1.5 }}>🎉</Box>
                  <Typography component="h2" sx={{ fontSize: 20, fontWeight: 700, color: "#111827", mb: 0.5 }}>
                    교육 과정을 완료했습니다!
                  </Typography>
                  <Typography sx={{ fontSize: 14, color: "#6B7280", mb: 3 }}>{course.title}</Typography>

                  <Box
                    sx={{
                      borderRadius: "16px",
                      border: "1px solid #F3F4F6",
                      bgcolor: "#F9FAFB",
                      p: 2.5,
                      mb: 3,
                    }}
                  >
                    <Typography sx={{ fontSize: 12, color: "#6B7280", mb: 0.5 }}>테스트 퀴즈 정확도</Typography>
                    <Typography
                      sx={{
                        fontSize: 36,
                        fontWeight: 700,
                        color: course.color,
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      {acc}%
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "#9CA3AF", mt: 0.5 }}>
                      정답 {correct}/{answered.length}
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                    <Box
                      component="button"
                      onClick={() => navigate("/")}
                      sx={{
                        flex: 1,
                        py: 1.25,
                        borderRadius: "12px",
                        border: "1px solid #E5E7EB",
                        bgcolor: "transparent",
                        fontSize: 14,
                        color: "#374151",
                        cursor: "pointer",
                        transition: "background-color .15s",
                        "&:hover": { bgcolor: "#F9FAFB" },
                      }}
                    >
                      교육 종료
                    </Box>
                    <Box
                      component="button"
                      onClick={() => navigate("/education")}
                      sx={{
                        flex: 1,
                        py: 1.25,
                        borderRadius: "12px",
                        border: "1px solid #E5E7EB",
                        bgcolor: "transparent",
                        fontSize: 14,
                        color: "#374151",
                        cursor: "pointer",
                        transition: "background-color .15s",
                        "&:hover": { bgcolor: "#F9FAFB" },
                      }}
                    >
                      추가 교육 선택
                    </Box>
                  </Box>
                  <Box
                    component="button"
                    onClick={() => navigate("/interview")}
                    sx={{
                      width: "100%",
                      py: 1.5,
                      borderRadius: "12px",
                      color: "#fff",
                      fontSize: 14,
                      fontWeight: 600,
                      border: "none",
                      cursor: "pointer",
                      transition: "opacity .15s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                      backgroundColor: course.color,
                      "&:hover": { opacity: 0.9 },
                    }}
                  >
                    <AutoAwesome sx={{ fontSize: 16 }} />
                    모의 면접 시도하기
                  </Box>
                </Box>
              </Box>
            </Box>
          );
        })()}
    </Box>
  );
}
