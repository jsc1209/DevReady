import { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import {
  ChevronRight,
  CheckCircle,
  RadioButtonUnchecked,
  PlayArrow,
  Replay,
  ExpandMore,
  ExpandLess,
  ErrorOutlineOutlined, // 원본 lucide AlertCircle. v9에 ErrorOutline 부재 → ErrorOutlineOutlined 로 교체.
  Search,
  ArrowBack,
  Terminal,
} from "@mui/icons-material";
import { PROBLEMS, LEVELS, CATEGORIES_FILTER, LEVEL_COLOR } from "../data/codingTestMock";

const LANGS = ["python", "javascript", "java"];

// 다크 IDE 영역에서 쓰는 원본 gray/색 hex (theme 토큰 대신 그대로 사용).
const D = {
  gray950: "#0A0A0A",
  gray900: "#111827",
  gray800: "#1F2937",
  gray700: "#374151",
  gray600: "#4B5563",
  gray500: "#6B7280",
  gray400: "#9CA3AF",
  gray300: "#D1D5DB",
  gray100: "#F3F4F6",
  white: "#FFFFFF",
  indigo400: "#818CF8",
  green400: "#4ADE80",
  green300: "#86EFAC",
  blue400: "#60A5FA",
  blue300: "#93C5FD",
  red400: "#F87171",
  red300: "#FCA5A5",
};

// 문제 목록 (max-w-5xl 컨테이너). onSelect(id) 로 에디터 진입.
function ProblemList({ onSelect }) {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("전체");
  const [catFilter, setCatFilter] = useState("전체");

  const filtered = PROBLEMS.filter((p) => {
    if (levelFilter !== "전체" && p.level !== levelFilter) return false;
    if (catFilter !== "전체" && p.category !== catFilter) return false;
    if (search && !p.title.includes(search) && !p.tags.some((t) => t.includes(search))) return false;
    return true;
  });

  const solved = PROBLEMS.filter((p) => p.solved).length;

  const stats = [
    { label: "쉬움", count: PROBLEMS.filter((p) => p.level === "쉬움").length, color: "#16A34A", bg: "#F0FDF4" },
    { label: "중간", count: PROBLEMS.filter((p) => p.level === "중간").length, color: "#CA8A04", bg: "#FEFCE8" },
    { label: "어려움", count: PROBLEMS.filter((p) => p.level === "어려움").length, color: "#DC2626", bg: "#FEF2F2" },
  ];

  return (
    <Box sx={{ maxWidth: 1024, mx: "auto", px: 2, py: 5 }}>
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
          <Typography sx={{ fontSize: 30, fontWeight: 700, color: "#111827" }}>
            코딩 테스트
          </Typography>
          <Typography sx={{ fontSize: 14, color: "#6B7280", mt: 0.5 }}>
            실전 감각을 키우는 알고리즘 문제풀이
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, fontSize: 14 }}>
          <Box
            sx={{
              px: 1.5,
              py: 0.75,
              borderRadius: "8px",
              bgcolor: "#F0FDF4",
              border: "1px solid #BBF7D0",
              color: "#15803D",
              fontWeight: 500,
            }}
          >
            {solved} / {PROBLEMS.length} 해결
          </Box>
        </Box>
      </Box>

      {/* Stats */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 2,
          mb: 3,
        }}
      >
        {stats.map((s) => (
          <Box key={s.label} sx={{ borderRadius: "12px", p: 2, bgcolor: s.bg, textAlign: "center" }}>
            <Box sx={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.count}</Box>
            <Box sx={{ fontSize: 12, color: "#6B7280", mt: 0.25 }}>{s.label}</Box>
          </Box>
        ))}
      </Box>

      {/* Filters */}
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5, mb: 3 }}>
        <Box sx={{ position: "relative", flex: 1 }}>
          <Search
            sx={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 16,
              color: "#9CA3AF",
              pointerEvents: "none",
            }}
          />
          <Box
            component="input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="문제 제목, 태그 검색"
            sx={{
              width: "100%",
              pl: 4.5,
              pr: 2,
              py: 1,
              borderRadius: "8px",
              border: "1px solid #E5E7EB",
              bgcolor: "#FFFFFF",
              fontSize: 14,
              fontFamily: "inherit",
              color: "#0F172A",
              outline: "none",
              "&:focus": { borderColor: "#818CF8" },
              "&::placeholder": { color: "#9CA3AF" },
              boxSizing: "border-box",
            }}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          {LEVELS.map((l) => (
            <Box
              key={l}
              component="button"
              onClick={() => setLevelFilter(l)}
              sx={{
                px: 1.5,
                py: 1,
                borderRadius: "8px",
                fontSize: 14,
                fontFamily: "inherit",
                cursor: "pointer",
                border: "1px solid",
                transition: "border-color .15s, background-color .15s",
                ...(levelFilter === l
                  ? { bgcolor: "#4F46E5", color: "#FFFFFF", borderColor: "#4F46E5" }
                  : {
                      bgcolor: "#FFFFFF",
                      color: "#4B5563",
                      borderColor: "#E5E7EB",
                      "&:hover": { borderColor: "#D1D5DB" },
                    }),
              }}
            >
              {l}
            </Box>
          ))}
        </Box>
      </Box>

      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
        {CATEGORIES_FILTER.map((c) => (
          <Box
            key={c}
            component="button"
            onClick={() => setCatFilter(c)}
            sx={{
              px: 1.5,
              py: 0.75,
              borderRadius: "999px",
              fontSize: 12,
              fontFamily: "inherit",
              cursor: "pointer",
              border: "1px solid",
              transition: "border-color .15s, background-color .15s",
              ...(catFilter === c
                ? { bgcolor: "#111827", color: "#FFFFFF", borderColor: "#111827" }
                : {
                    bgcolor: "#FFFFFF",
                    color: "#4B5563",
                    borderColor: "#E5E7EB",
                    "&:hover": { borderColor: "#9CA3AF" },
                  }),
            }}
          >
            {c}
          </Box>
        ))}
      </Box>

      {/* Problem table */}
      <Box
        sx={{
          borderRadius: "16px",
          border: "1px solid #E5E7EB",
          bgcolor: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        <Table sx={{ width: "100%" }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "#F9FAFB", "& th": { borderBottom: "1px solid #F3F4F6" } }}>
              <TableCell sx={{ px: 2.5, py: 1.5, fontSize: 12, fontWeight: 500, color: "#6B7280", width: 32 }}>
                #
              </TableCell>
              <TableCell sx={{ px: 2.5, py: 1.5, fontSize: 12, fontWeight: 500, color: "#6B7280" }}>
                제목
              </TableCell>
              <TableCell
                sx={{
                  px: 2,
                  py: 1.5,
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#6B7280",
                  display: { xs: "none", sm: "table-cell" },
                }}
              >
                분류
              </TableCell>
              <TableCell sx={{ px: 2, py: 1.5, fontSize: 12, fontWeight: 500, color: "#6B7280" }}>
                난이도
              </TableCell>
              <TableCell
                sx={{
                  px: 2,
                  py: 1.5,
                  fontSize: 12,
                  fontWeight: 500,
                  color: "#6B7280",
                  display: { xs: "none", md: "table-cell" },
                }}
              >
                정답률
              </TableCell>
              <TableCell sx={{ width: 40, borderBottom: "1px solid #F3F4F6" }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((p) => (
              <TableRow
                key={p.id}
                onClick={() => onSelect(p.id)}
                hover
                sx={{
                  cursor: "pointer",
                  "& td": { borderBottom: "1px solid #F9FAFB" },
                  "&:hover": { bgcolor: "#F9FAFB" },
                }}
              >
                <TableCell sx={{ px: 2.5, py: 2 }}>
                  {p.solved ? (
                    <CheckCircle sx={{ fontSize: 16, color: "#22C55E" }} />
                  ) : (
                    <RadioButtonUnchecked sx={{ fontSize: 16, color: "#D1D5DB" }} />
                  )}
                </TableCell>
                <TableCell sx={{ px: 2.5, py: 2 }}>
                  <Box sx={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>{p.title}</Box>
                  <Box sx={{ display: "flex", gap: 0.5, mt: 0.5, flexWrap: "wrap" }}>
                    {p.tags.map((t) => (
                      <Box
                        key={t}
                        component="span"
                        sx={{
                          fontSize: 12,
                          px: 0.75,
                          py: 0.25,
                          borderRadius: "4px",
                          bgcolor: "#F3F4F6",
                          color: "#6B7280",
                        }}
                      >
                        {t}
                      </Box>
                    ))}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    px: 2,
                    py: 2,
                    fontSize: 14,
                    color: "#6B7280",
                    display: { xs: "none", sm: "table-cell" },
                  }}
                >
                  {p.category}
                </TableCell>
                <TableCell sx={{ px: 2, py: 2 }}>
                  <Box
                    component="span"
                    sx={{
                      fontSize: 12,
                      px: 1,
                      py: 0.25,
                      borderRadius: "999px",
                      border: "1px solid",
                      fontWeight: 500,
                      ...LEVEL_COLOR[p.level],
                    }}
                  >
                    {p.level}
                  </Box>
                </TableCell>
                <TableCell
                  sx={{
                    px: 2,
                    py: 2,
                    fontSize: 14,
                    color: "#6B7280",
                    fontFamily: "'DM Mono', monospace",
                    display: { xs: "none", md: "table-cell" },
                  }}
                >
                  {p.acceptance}%
                </TableCell>
                <TableCell sx={{ pr: 2 }}>
                  <ChevronRight sx={{ fontSize: 16, color: "#9CA3AF" }} />
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  sx={{ px: 2.5, py: 6, textAlign: "center", fontSize: 14, color: "#9CA3AF", borderBottom: "none" }}
                >
                  검색 결과가 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}

// 풀스크린 다크 IDE: 좌(문제 패널 42%) / 우(에디터 + 콘솔).
function CodeEditor({ problem, onBack }) {
  const [lang, setLang] = useState("python");
  const [code, setCode] = useState(problem.starterCode[lang]);
  const [tab, setTab] = useState("desc"); // desc | examples | solution
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    setCode(problem.starterCode[lang] || "// 이 언어의 스타터 코드가 없습니다.");
  }, [lang, problem]);

  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const el = e.currentTarget;
      const start = el.selectionStart;
      const end = el.selectionEnd;
      const newCode = code.substring(0, start) + "    " + code.substring(end);
      setCode(newCode);
      requestAnimationFrame(() => {
        el.selectionStart = el.selectionEnd = start + 4;
      });
    }
  };

  const handleRun = () => {
    setRunning(true);
    setShowResult(false);
    setTimeout(() => {
      const mockResults = problem.testCases.map((tc, i) => ({
        input: tc.input,
        expected: tc.expected,
        actual: i < 2 ? tc.expected : "오답",
        pass: i < 2,
      }));
      setResults(
        mockResults.length > 0
          ? mockResults
          : [{ input: "예시 입력", expected: "예시 출력", actual: "예시 출력", pass: true }]
      );
      setRunning(false);
      setShowResult(true);
    }, 1200);
  };

  const allPass = results ? results.every((r) => r.pass) : false;

  const langLabel = (l) => (l === "javascript" ? "JavaScript" : l === "python" ? "Python" : "Java");

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", bgcolor: D.gray950 }}>
      {/* Top bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.25,
          borderBottom: `1px solid ${D.gray800}`,
          bgcolor: D.gray900,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            component="button"
            onClick={onBack}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              fontSize: 14,
              fontFamily: "inherit",
              color: D.gray400,
              bgcolor: "transparent",
              border: "none",
              cursor: "pointer",
              p: 0,
              transition: "color .15s",
              "&:hover": { color: D.white },
            }}
          >
            <ArrowBack sx={{ fontSize: 16 }} />
            목록
          </Box>
          <Box sx={{ width: "1px", height: 16, bgcolor: D.gray700 }} />
          <Box component="span" sx={{ fontSize: 14, color: D.white, fontWeight: 500 }}>
            {problem.title}
          </Box>
          <Box
            component="span"
            sx={{
              fontSize: 12,
              px: 1,
              py: 0.25,
              borderRadius: "999px",
              border: "1px solid",
              fontWeight: 500,
              ...LEVEL_COLOR[problem.level],
            }}
          >
            {problem.level}
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {/* Language selector */}
          <Box
            component="select"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            sx={{
              bgcolor: D.gray800,
              border: `1px solid ${D.gray700}`,
              color: D.gray300,
              fontSize: 12,
              fontFamily: "inherit",
              borderRadius: "8px",
              px: 1.25,
              py: 0.75,
              outline: "none",
              cursor: "pointer",
            }}
          >
            {LANGS.map((l) => (
              <option key={l} value={l}>
                {langLabel(l)}
              </option>
            ))}
          </Box>
          <Box
            component="button"
            onClick={() => setCode(problem.starterCode[lang])}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              fontSize: 12,
              fontFamily: "inherit",
              color: D.gray400,
              px: 1.25,
              py: 0.75,
              borderRadius: "8px",
              border: `1px solid ${D.gray700}`,
              bgcolor: "transparent",
              cursor: "pointer",
              transition: "color .15s, border-color .15s",
              "&:hover": { color: D.white, borderColor: D.gray500 },
            }}
          >
            <Replay sx={{ fontSize: 12 }} />
            초기화
          </Box>
          <Box
            component="button"
            onClick={handleRun}
            disabled={running}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "inherit",
              px: 1.5,
              py: 0.75,
              borderRadius: "8px",
              border: "none",
              color: D.white,
              bgcolor: "#6C63FF",
              cursor: running ? "default" : "pointer",
            }}
          >
            {running ? (
              <Box component="span" sx={{ animation: "pulse 1.5s ease-in-out infinite", "@keyframes pulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.5 } } }}>
                실행 중...
              </Box>
            ) : (
              <>
                <PlayArrow sx={{ fontSize: 12 }} />
                실행
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* Body: split */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left: problem */}
        <Box
          sx={{
            width: "42%",
            minWidth: 320,
            borderRight: `1px solid ${D.gray800}`,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Tabs */}
          <Box sx={{ display: "flex", borderBottom: `1px solid ${D.gray800}`, bgcolor: D.gray900 }}>
            {["desc", "examples", "solution"].map((t) => (
              <Box
                key={t}
                component="button"
                onClick={() => setTab(t)}
                sx={{
                  px: 2,
                  py: 1.25,
                  fontSize: 12,
                  fontWeight: 500,
                  fontFamily: "inherit",
                  bgcolor: "transparent",
                  cursor: "pointer",
                  borderBottom: "2px solid",
                  borderLeft: "none",
                  borderRight: "none",
                  borderTop: "none",
                  transition: "color .15s",
                  ...(tab === t
                    ? { color: D.indigo400, borderColor: D.indigo400 }
                    : { color: D.gray500, borderColor: "transparent", "&:hover": { color: D.gray300 } }),
                }}
              >
                {t === "desc" ? "문제 설명" : t === "examples" ? "예제" : "해설"}
              </Box>
            ))}
          </Box>

          <Box sx={{ flex: 1, overflowY: "auto", p: 2.5, fontSize: 14, color: D.gray300 }}>
            {tab === "desc" && (
              <Box>
                <Typography
                  sx={{
                    fontSize: 14,
                    color: D.gray300,
                    lineHeight: 1.7,
                    whiteSpace: "pre-wrap",
                    mb: 3,
                  }}
                >
                  {problem.desc}
                </Typography>
                <Box sx={{ borderTop: `1px solid ${D.gray800}`, pt: 2 }}>
                  <Box
                    sx={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: D.gray500,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      mb: 1.5,
                    }}
                  >
                    제약 조건
                  </Box>
                  <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, display: "flex", flexDirection: "column", gap: 0.75 }}>
                    {problem.constraints.map((c, i) => (
                      <Box
                        component="li"
                        key={i}
                        sx={{ display: "flex", alignItems: "flex-start", gap: 1, fontSize: 12, color: D.gray400 }}
                      >
                        <Box component="span" sx={{ color: D.indigo400, mt: 0.25 }}>•</Box>
                        {c}
                      </Box>
                    ))}
                  </Box>
                </Box>
                <Box sx={{ borderTop: `1px solid ${D.gray800}`, pt: 2, mt: 2 }}>
                  <Box
                    sx={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: D.gray500,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      mb: 1,
                    }}
                  >
                    태그
                  </Box>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {problem.tags.map((t) => (
                      <Box
                        key={t}
                        component="span"
                        sx={{
                          fontSize: 12,
                          px: 1,
                          py: 0.25,
                          borderRadius: "4px",
                          bgcolor: D.gray800,
                          color: D.gray400,
                          border: `1px solid ${D.gray700}`,
                        }}
                      >
                        {t}
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            )}
            {tab === "examples" && (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {problem.examples.map((ex, i) => (
                  <Box key={i} sx={{ borderRadius: "12px", border: `1px solid ${D.gray800}`, overflow: "hidden" }}>
                    <Box sx={{ px: 1.5, py: 1, bgcolor: D.gray800, fontSize: 12, fontWeight: 500, color: D.gray400 }}>
                      예제 {i + 1}
                    </Box>
                    <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1 }}>
                      <Box>
                        <Box component="span" sx={{ fontSize: 12, color: D.gray500 }}>입력</Box>
                        <Box
                          sx={{
                            mt: 0.5,
                            px: 1.5,
                            py: 1,
                            borderRadius: "8px",
                            bgcolor: D.gray900,
                            fontFamily: "monospace",
                            fontSize: 12,
                            color: D.green400,
                          }}
                        >
                          {ex.input}
                        </Box>
                      </Box>
                      <Box>
                        <Box component="span" sx={{ fontSize: 12, color: D.gray500 }}>출력</Box>
                        <Box
                          sx={{
                            mt: 0.5,
                            px: 1.5,
                            py: 1,
                            borderRadius: "8px",
                            bgcolor: D.gray900,
                            fontFamily: "monospace",
                            fontSize: 12,
                            color: D.blue400,
                          }}
                        >
                          {ex.output}
                        </Box>
                      </Box>
                      {ex.explain && (
                        <Box sx={{ fontSize: 12, color: D.gray500, fontStyle: "italic" }}>💡 {ex.explain}</Box>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
            {tab === "solution" && (
              <Box>
                {problem.solution.python ? (
                  <Box>
                    <Box sx={{ fontSize: 12, color: D.gray500, mb: 1.5 }}>Python 풀이 예시</Box>
                    <Box
                      component="pre"
                      sx={{
                        bgcolor: D.gray900,
                        borderRadius: "12px",
                        p: 2,
                        fontSize: 12,
                        color: D.green300,
                        overflowX: "auto",
                        lineHeight: 1.7,
                        m: 0,
                        fontFamily: "monospace",
                      }}
                    >
                      {problem.solution.python}
                    </Box>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      py: 6,
                      color: D.gray600,
                    }}
                  >
                    <ErrorOutlineOutlined sx={{ fontSize: 32, mb: 1.5 }} />
                    <Box sx={{ fontSize: 14 }}>먼저 직접 풀어보세요!</Box>
                  </Box>
                )}
              </Box>
            )}
          </Box>
        </Box>

        {/* Right: editor + console */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Editor */}
          <Box sx={{ flex: 1, overflow: "hidden", position: "relative" }}>
            <Box
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                zIndex: 10,
                fontSize: 12,
                color: D.gray600,
                fontFamily: "monospace",
                pointerEvents: "none",
              }}
            >
              {lang === "python" ? "Python 3" : lang === "javascript" ? "Node.js" : "Java 17"}
            </Box>
            <Box
              component="textarea"
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              sx={{
                width: "100%",
                height: "100%",
                resize: "none",
                bgcolor: D.gray950,
                color: D.gray100,
                fontSize: 14,
                p: 2.5,
                pt: 2,
                border: "none",
                outline: "none",
                lineHeight: 1.7,
                fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
                tabSize: 4,
                boxSizing: "border-box",
                display: "block",
              }}
            />
          </Box>

          {/* Console */}
          <Box
            sx={{
              borderTop: `1px solid ${D.gray800}`,
              transition: "height .2s",
              height: showResult ? 208 : 40,
            }}
          >
            <Box
              onClick={() => setShowResult(!showResult)}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                px: 2,
                height: 40,
                bgcolor: D.gray900,
                cursor: "pointer",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Terminal sx={{ fontSize: 14, color: D.gray500 }} />
                <Box component="span" sx={{ fontSize: 12, color: D.gray400, fontWeight: 500 }}>
                  실행 결과
                </Box>
                {results && (
                  <Box
                    component="span"
                    sx={{ fontSize: 12, fontWeight: 500, color: allPass ? D.green400 : D.red400 }}
                  >
                    {allPass ? "✓ 통과" : "✗ 실패"}
                  </Box>
                )}
              </Box>
              <Box
                component="button"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  bgcolor: "transparent",
                  border: "none",
                  p: 0,
                  cursor: "pointer",
                  color: D.gray600,
                  "&:hover": { color: D.gray400 },
                }}
              >
                {showResult ? <ExpandMore sx={{ fontSize: 14 }} /> : <ExpandLess sx={{ fontSize: 14 }} />}
              </Box>
            </Box>

            {showResult && results && (
              <Box sx={{ overflowY: "auto", height: 160, p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}>
                {results.map((r, i) => (
                  <Box
                    key={i}
                    sx={{
                      borderRadius: "8px",
                      p: 1.5,
                      border: "1px solid",
                      borderColor: r.pass ? "#166534" : "#991B1B",
                      bgcolor: r.pass ? "rgba(5,46,22,0.4)" : "rgba(69,10,10,0.4)",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.75 }}>
                      <Box component="span" sx={{ fontSize: 12, fontWeight: 500, color: D.gray400 }}>
                        테스트 {i + 1}
                      </Box>
                      <Box
                        component="span"
                        sx={{ fontSize: 12, fontWeight: 600, color: r.pass ? D.green400 : D.red400 }}
                      >
                        {r.pass ? "✓ 통과" : "✗ 실패"}
                      </Box>
                    </Box>
                    <Box sx={{ fontSize: 12, fontFamily: "monospace", display: "flex", flexDirection: "column", gap: 0.25 }}>
                      <Box sx={{ color: D.gray500 }}>
                        입력: <Box component="span" sx={{ color: D.gray300 }}>{r.input}</Box>
                      </Box>
                      <Box sx={{ color: D.gray500 }}>
                        예상: <Box component="span" sx={{ color: D.blue300 }}>{r.expected}</Box>
                      </Box>
                      <Box sx={{ color: D.gray500 }}>
                        출력: <Box component="span" sx={{ color: r.pass ? D.green300 : D.red300 }}>{r.actual}</Box>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/**
 * 코딩 테스트 (/coding-test) — test-demo-UI/CodingTestPage.tsx → JS+MUI.
 * selectedId 로 문제목록(ProblemList) ↔ 코드에디터(CodeEditor) 토글.
 * CodeEditor 는 풀스크린 다크 IDE 라 theme 토큰 대신 원본 다크 hex 를 그대로 사용.
 */
export default function CodingTestPage() {
  const [selectedId, setSelectedId] = useState(null);
  const problem = PROBLEMS.find((p) => p.id === selectedId);

  if (problem) {
    return <CodeEditor problem={problem} onBack={() => setSelectedId(null)} />;
  }

  return <ProblemList onSelect={setSelectedId} />;
}
