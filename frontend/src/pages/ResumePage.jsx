import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import {
  AutoAwesome,
  Add,
  DeleteOutlined,
  History,
  CheckCircle,
  Visibility,
  Download,
  Close,
  Save,
  RestartAlt,
  Description,
  Person,
  School,
  Work,
  Code,
  Notes,
  ErrorOutlined,
  Check,
  WorkspacePremium,
} from "@mui/icons-material";
import jsPDF from "jspdf";

// 이력서 필수 충족 여부를 게이트 플래그(localStorage)로 동기화
function setResumeComplete(v) {
  try {
    localStorage.setItem("devready_resume_complete", v ? "1" : "0");
  } catch {
    /* ignore */
  }
}

// 원본 ../auth 의 실행 가드를 EducationPage 처럼 인라인 복제(진입 가드용).
function isAuthed() {
  try {
    return localStorage.getItem("devready_authed") === "1";
  } catch {
    return false;
  }
}

// 보조 배경(bg-secondary) — 레퍼런스 페이지와 동일한 토큰 값.
const secondary = "#F8F9FF";

const EMPLOYMENT_TYPES = ["정규직", "계약직", "인턴", "프리랜서", "파견직"];

// 필수 항목(기본정보·경력·스킬) 충족 여부 — '없음' 선택도 충족으로 인정
const isRequiredFilled = (r) =>
  !!r.basic.name?.trim() &&
  !!(r.basic.email?.trim() || r.basic.phone?.trim()) &&
  ((r.careers?.length ?? 0) > 0 || !!r.careerNone) &&
  ((r.skills?.length ?? 0) > 0 || !!r.skillsNone);

// ─── Initial data ─────────────────────────────────────────
const INITIAL_RESUME = {
  id: "r1",
  name: "학습용 이력서",
  basic: {
    name: "김지수",
    email: "jisu@example.com",
    phone: "010-1234-5678",
    address: "서울 강남구",
    github: "github.com/jisu-kim",
    portfolio: "",
  },
  educations: [{ school: "한국대학교", major: "컴퓨터공학과", grade: "3.8/4.5", period: "2020.03 ~ 2026.02" }],
  careers: [
    {
      company: "(주)스타트업A",
      role: "프론트엔드 인턴",
      period: "2025.07 ~ 2025.12",
      desc: "React 기반 대시보드 개발 및 유지보수",
      employmentType: "인턴",
      team: "웹서비스팀",
      current: false,
    },
  ],
  certifications: [{ name: "정보처리기사", issuer: "한국산업인력공단", date: "2025.08" }],
  skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js"],
  coverText: "React와 TypeScript를 주력으로 사용하며, 사용자 경험을 최우선으로 생각하는 프론트엔드 개발자입니다.",
};

// ─── Mock AI responses ────────────────────────────────────
const AI_SUGGESTIONS = {
  basic: (d) => ({
    basic: {
      ...d.basic,
      portfolio: d.basic.portfolio || "jisu-dev.vercel.app",
    },
  }),
  coverText: (d) => ({
    coverText: `저는 사용자 중심의 웹 경험을 만드는 것에 열정을 가진 프론트엔드 개발자입니다. React와 TypeScript를 활용한 ${d.careers.length > 0 ? d.careers.length + "개 회사의 실무 경험으로" : "프로젝트 경험으로"} 컴포넌트 설계, 성능 최적화, 팀 협업 역량을 키워왔습니다. 특히 Next.js 기반 SSR 최적화로 LCP를 40% 개선한 경험이 있으며, 코드 리뷰 문화 정착을 통해 팀 생산성을 높였습니다. 귀사에서 더 큰 서비스와 사용자를 만나며 성장하고 싶습니다.`,
  }),
  careers: (d) => ({
    careers: d.careers.map((c) => ({
      ...c,
      desc:
        c.desc ||
        "React/TypeScript 기반 웹 애플리케이션 개발, 성능 최적화 및 코드 리뷰 참여, 애자일 스프린트 방식으로 팀 협업",
    })),
  }),
  skills: () => ({
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js", "Git", "Figma", "REST API", "Jest"],
  }),
};

const SECTIONS = [
  { id: "basic", label: "기본 정보", icon: Person, required: true },
  { id: "edu", label: "학력", icon: School },
  { id: "career", label: "경력", icon: Work, required: true },
  { id: "cert", label: "자격증", icon: WorkspacePremium },
  { id: "skills", label: "스킬", icon: Code, required: true },
  { id: "cover", label: "자기소개서", icon: Notes },
];

// ─── PDF generation ───────────────────────────────────────
function generatePDF(resume) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const lm = 20,
    rm = 190,
    tw = rm - lm;
  let y = 20;

  const line = (text, size = 10, bold = false, color = "#111") => {
    doc.setFontSize(size);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setTextColor(color);
    doc.text(text, lm, y);
    y += size * 0.5 + 2;
  };
  const rule = () => {
    doc.setDrawColor(200, 200, 200);
    doc.line(lm, y, rm, y);
    y += 4;
  };
  const section = (title) => {
    y += 2;
    line(title, 12, true, "#6C63FF");
    rule();
  };

  // Header
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.setTextColor("#111");
  doc.text(resume.basic.name || "이름 없음", lm, y);
  y += 10;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor("#555");
  const contact = [resume.basic.email, resume.basic.phone, resume.basic.address].filter(Boolean).join("  |  ");
  doc.text(contact, lm, y);
  y += 5;
  if (resume.basic.github) {
    doc.text(`GitHub: ${resume.basic.github}`, lm, y);
    y += 5;
  }
  if (resume.basic.portfolio) {
    doc.text(`Portfolio: ${resume.basic.portfolio}`, lm, y);
    y += 5;
  }
  y += 3;
  doc.setDrawColor(108, 99, 255);
  doc.setLineWidth(0.5);
  doc.line(lm, y, rm, y);
  y += 6;

  // Education
  if (resume.educations.length > 0) {
    section("학력");
    resume.educations.forEach((e) => {
      line(`${e.school} · ${e.major}`, 10, true);
      y -= 1;
      line(`${e.period}  학점: ${e.grade}`, 9, false, "#555");
      y += 1;
    });
  }

  // Career
  if (resume.careers.length > 0) {
    section("경력");
    resume.careers.forEach((c) => {
      line(`${c.company} — ${c.role}${c.employmentType ? " (" + c.employmentType + ")" : ""}`, 10, true);
      y -= 1;
      line(`${c.current ? c.period + " (재직중)" : c.period}${c.team ? "  ·  " + c.team : ""}`, 9, false, "#555");
      if (c.desc) {
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor("#333");
        const wrapped = doc.splitTextToSize(c.desc, tw);
        doc.text(wrapped, lm, y);
        y += wrapped.length * 4.5 + 2;
      }
      y += 1;
    });
  }

  // Certifications
  if (resume.certifications.length > 0) {
    section("자격증");
    resume.certifications.forEach((c) => {
      const parts = [c.name, c.issuer, c.date].filter(Boolean);
      line(parts.join("  ·  "), 9, false, "#333");
    });
    y += 2;
  }

  // Skills
  if (resume.skills.length > 0) {
    section("기술 스택");
    line(resume.skills.join("  /  "), 9, false, "#333");
    y += 2;
  }

  // Cover letter
  if (resume.coverText) {
    section("자기소개서");
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor("#333");
    const wrapped = doc.splitTextToSize(resume.coverText, tw);
    doc.text(wrapped, lm, y);
  }

  doc.save(
    `이력서_${resume.basic.name || "resume"}_${new Date()
      .toLocaleDateString("ko-KR")
      .replace(/\. /g, "-")
      .replace(".", "")}.pdf`
  );
}

// ─── 공통 sx 토큰 ──────────────────────────────────────────
const modalOverlaySx = {
  position: "fixed",
  inset: 0,
  bgcolor: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 50,
  p: 2,
};
const modalCardSx = {
  borderRadius: "16px",
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "background.paper",
  width: "100%",
  boxShadow: 6,
};
const iconBtnSx = {
  p: 0.75,
  borderRadius: "8px",
  border: "none",
  bgcolor: "transparent",
  color: "text.secondary",
  cursor: "pointer",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  "&:hover": { bgcolor: secondary },
};
const primaryBtnSx = {
  bgcolor: "primary.main",
  color: "#fff",
  fontSize: 14,
  fontWeight: 500,
  border: "none",
  font: "inherit",
  cursor: "pointer",
  transition: "background-color .2s, opacity .2s",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 0.75,
  "&:hover": { bgcolor: "primary.dark" },
  "&:disabled": { opacity: 0.6, cursor: "default" },
};
const outlineBtnSx = {
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "transparent",
  color: "text.primary",
  fontSize: 14,
  font: "inherit",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 0.75,
  "&:hover": { bgcolor: secondary },
};
const fieldSx = {
  width: "100%",
  px: 1.5,
  py: 1,
  borderRadius: "8px",
  bgcolor: "background.paper",
  border: "1px solid",
  borderColor: "divider",
  color: "text.primary",
  fontSize: 13,
  font: "inherit",
  boxSizing: "border-box",
  "&:focus": { outline: "none", borderColor: "rgba(108,99,255,0.6)" },
  "&:disabled": { opacity: 0.5 },
  "&::placeholder": { color: "text.secondary" },
};

// ─── AI 제안/자소서 가이드 패널 ───────────────────────────
function AiSuggestionPanel({ section, current, onApply, onClose }) {
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [applied, setApplied] = useState(false);
  const [coverDraft, setCoverDraft] = useState(current.coverText);

  const sectionKey =
    section === "cover"
      ? "coverText"
      : section === "career"
      ? "careers"
      : section === "skills"
      ? "skills"
      : "basic";

  // 자소서 가이드: 카테고리별 예시 단락(보유 스킬·경력 일부 반영) → 클릭 시 본문에 추가
  const skillsText = current.skills.slice(0, 3).join(", ") || "주요 기술";
  const COVER_BLOCKS = [
    {
      title: "성장 과정",
      desc: "가치관·성격이 형성된 배경",
      body: "어려서부터 새로운 것을 직접 만들어보며 문제를 끝까지 파고드는 성향을 길러왔습니다. 이러한 경험은 개발자로서 꾸준히 학습하고 성장하는 원동력이 되었습니다.",
    },
    {
      title: "지원 동기",
      desc: "회사·직무에 지원한 이유",
      body: "사용자에게 실질적인 가치를 주는 서비스를 만드는 귀사의 방향에 깊이 공감하여 지원하게 되었습니다. 제가 쌓아온 역량으로 팀에 기여하며 함께 성장하고 싶습니다.",
    },
    {
      title: "직무 역량·강점",
      desc: "기여할 수 있는 점",
      body: `${skillsText} 등을 활용해 요구사항을 빠르게 구현하고, 성능과 사용자 경험을 함께 고려하는 것이 강점입니다. 문서화와 코드 리뷰로 협업 효율을 높여왔습니다.`,
    },
    {
      title: "협업·문제해결 경험",
      desc: "STAR 형식 사례",
      body: "프로젝트에서 일정 지연 문제가 발생했을 때(상황), 병목 작업을 분리해 우선순위를 재정의하고(과제·행동) 핵심 기능을 먼저 배포해 일정을 회복한 경험이 있습니다(결과).",
    },
    {
      title: "입사 후 포부",
      desc: "성장 목표와 기여 계획",
      body: "입사 후 빠르게 도메인을 익혀 맡은 영역에서 안정적으로 기여하고, 장기적으로는 서비스 품질과 팀의 개발 문화를 함께 끌어올리는 개발자가 되겠습니다.",
    },
  ];
  const appendBlock = (b) => {
    const block = `[${b.title}]\n${b.body}`;
    const next = coverDraft.trim() ? coverDraft.trimEnd() + "\n\n" + block : block;
    setCoverDraft(next);
    onApply({ coverText: next });
  };
  const writeAllCover = () => {
    const all = COVER_BLOCKS.map((b) => `[${b.title}]\n${b.body}`).join("\n\n");
    setCoverDraft(all);
    onApply({ coverText: all });
  };

  const generate = () => {
    setLoading(true);
    setSuggestion(null);
    setApplied(false);
    setTimeout(() => {
      const fn = AI_SUGGESTIONS[sectionKey === "coverText" ? "coverText" : section];
      if (fn) setSuggestion(fn(current));
      setLoading(false);
    }, 1800);
  };

  const sectionLabel = SECTIONS.find((s) => s.id === section)?.label ?? "";

  // TODO(AI연동): 실서비스에선 EXAONE가 직무·회사 맥락으로 자소서 카테고리/예시를 안내. 프로토타입은 정적 가이드.
  if (section === "cover") {
    return (
      <Box sx={modalOverlaySx}>
        <Box sx={{ ...modalCardSx, maxWidth: 512 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2.5,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <AutoAwesome sx={{ fontSize: 20, color: "primary.main" }} />
              <Typography component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                AI 자소서 가이드 — 자기소개서
              </Typography>
            </Box>
            <Box component="button" type="button" onClick={onClose} sx={iconBtnSx}>
              <Close sx={{ fontSize: 16 }} />
            </Box>
          </Box>
          <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
              카테고리를 누르면 해당 단락이 자기소개서에 자동으로 작성됩니다. 작성 후 자유롭게 수정하세요.
            </Typography>
            <Box
              component="button"
              type="button"
              onClick={writeAllCover}
              sx={{ ...primaryBtnSx, width: "100%", py: 1.25, borderRadius: "12px" }}
            >
              <AutoAwesome sx={{ fontSize: 16 }} />
              전체 자동 작성
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {COVER_BLOCKS.map((b) => (
                <Box
                  key={b.title}
                  component="button"
                  type="button"
                  onClick={() => appendBlock(b)}
                  sx={{
                    borderRadius: "12px",
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: secondary,
                    p: 1.5,
                    textAlign: "left",
                    font: "inherit",
                    cursor: "pointer",
                    transition: "border-color .2s, background-color .2s",
                    "&:hover": {
                      borderColor: "rgba(108,99,255,0.4)",
                      bgcolor: "rgba(108,99,255,0.05)",
                    },
                    "&:hover .cover-add": { opacity: 1 },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <Typography component="span" sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}>
                      {b.title}
                    </Typography>
                    <Box
                      component="span"
                      className="cover-add"
                      sx={{
                        fontSize: 12,
                        color: "primary.main",
                        opacity: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: 0.25,
                        transition: "opacity .2s",
                      }}
                    >
                      <Add sx={{ fontSize: 12 }} />
                      추가
                    </Box>
                  </Box>
                  <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>{b.desc}</Typography>
                </Box>
              ))}
            </Box>
            <Box
              sx={{
                borderRadius: "12px",
                border: "1px solid",
                borderColor: "rgba(108,99,255,0.2)",
                bgcolor: "rgba(108,99,255,0.05)",
                p: 1.5,
                fontSize: 12,
                color: "text.primary",
                lineHeight: 1.7,
              }}
            >
              지원하려는 회사의 자소서 양식(추가 질문)이 있다면 공고 상세에서 확인해 그 항목에 맞춰 작성하세요. 양식이
              없으면 위 기본 카테고리를 참고하세요.
            </Box>
            <Box
              component="button"
              type="button"
              onClick={onClose}
              sx={{ ...outlineBtnSx, width: "100%", py: 1.25, borderRadius: "12px" }}
            >
              닫기
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={modalOverlaySx}>
      <Box sx={{ ...modalCardSx, maxWidth: 512 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2.5,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <AutoAwesome sx={{ fontSize: 20, color: "primary.main" }} />
            <Typography component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
              AI 자동 완성 — {sectionLabel}
            </Typography>
          </Box>
          <Box component="button" type="button" onClick={onClose} sx={iconBtnSx}>
            <Close sx={{ fontSize: 16 }} />
          </Box>
        </Box>

        <Box sx={{ p: 2.5 }}>
          <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 2 }}>
            입력된 경력·스킬 정보를 기반으로 DevReady AI가 {sectionLabel} 항목을 자동 완성해드립니다.
          </Typography>

          {!suggestion && (
            <Box
              component="button"
              type="button"
              onClick={generate}
              disabled={loading}
              sx={{ ...primaryBtnSx, width: "100%", py: 1.5, borderRadius: "12px", gap: 1 }}
            >
              {loading ? (
                <>
                  <Box
                    component="span"
                    sx={{
                      width: 16,
                      height: 16,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      borderRadius: "999px",
                      animation: "spin 1s linear infinite",
                      "@keyframes spin": { to: { transform: "rotate(360deg)" } },
                    }}
                  />
                  DevReady AI 작성 중...
                </>
              ) : (
                <>
                  <AutoAwesome sx={{ fontSize: 16 }} />
                  AI 자동 완성 생성
                </>
              )}
            </Box>
          )}

          {suggestion && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box
                sx={{
                  borderRadius: "12px",
                  border: "1px solid",
                  borderColor: "rgba(108,99,255,0.2)",
                  bgcolor: "rgba(108,99,255,0.05)",
                  p: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.75,
                    mb: 1,
                    fontSize: 12,
                    color: "primary.main",
                    fontWeight: 500,
                  }}
                >
                  <AutoAwesome sx={{ fontSize: 14 }} />
                  DevReady AI 제안
                </Box>
                <Box
                  sx={{
                    fontSize: 14,
                    color: "text.primary",
                    lineHeight: 1.7,
                    maxHeight: 192,
                    overflowY: "auto",
                  }}
                >
                  {sectionKey === "coverText" && suggestion.coverText && <Typography>{suggestion.coverText}</Typography>}
                  {sectionKey === "skills" && suggestion.skills && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                      {suggestion.skills.map((s) => (
                        <Box
                          key={s}
                          component="span"
                          sx={{
                            px: 1,
                            py: 0.25,
                            borderRadius: "999px",
                            bgcolor: "rgba(108,99,255,0.1)",
                            color: "primary.main",
                            fontSize: 12,
                          }}
                        >
                          {s}
                        </Box>
                      ))}
                    </Box>
                  )}
                  {sectionKey === "careers" && suggestion.careers && (
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                      {suggestion.careers.map((c, i) => (
                        <Box key={i}>
                          <Box sx={{ fontWeight: 500, fontSize: 12 }}>
                            {c.company} — {c.role}
                          </Box>
                          <Box sx={{ fontSize: 12, color: "text.secondary" }}>{c.desc}</Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                  {sectionKey === "basic" &&
                    suggestion.basic && (
                      <Box sx={{ fontSize: 12, display: "flex", flexDirection: "column", gap: 0.5 }}>
                        {Object.entries(suggestion.basic).map(
                          ([k, v]) =>
                            v && (
                              <Box key={k}>
                                <Box component="span" sx={{ color: "text.secondary" }}>
                                  {k}:
                                </Box>{" "}
                                {v}
                              </Box>
                            )
                        )}
                      </Box>
                    )}
                </Box>
              </Box>

              <Box sx={{ display: "flex", gap: 1 }}>
                <Box
                  component="button"
                  type="button"
                  onClick={() => {
                    onApply(suggestion);
                    setApplied(true);
                  }}
                  disabled={applied}
                  sx={{ ...primaryBtnSx, flex: 1, py: 1.25, borderRadius: "12px" }}
                >
                  {applied ? (
                    <>
                      <Check sx={{ fontSize: 16 }} />
                      반영 완료
                    </>
                  ) : (
                    <>이력서에 반영</>
                  )}
                </Box>
                <Box
                  component="button"
                  type="button"
                  onClick={generate}
                  sx={{
                    ...outlineBtnSx,
                    px: 2,
                    py: 1.25,
                    borderRadius: "12px",
                    color: "text.secondary",
                    "&:hover": { color: "text.primary", bgcolor: secondary },
                  }}
                >
                  <RestartAlt sx={{ fontSize: 14 }} />
                  재생성
                </Box>
              </Box>
              {applied && (
                <Box
                  component="button"
                  type="button"
                  onClick={onClose}
                  sx={{ ...outlineBtnSx, width: "100%", py: 1, borderRadius: "12px" }}
                >
                  닫기
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

// ─── Main component ───────────────────────────────────────
export default function ResumePage() {
  const navigate = useNavigate();

  // 진입 가드: 비로그인 → 로그인. (resume-complete 가드는 넣지 않음 — 루프 방지)
  useEffect(() => {
    if (!isAuthed()) navigate("/auth");
  }, [navigate]);

  const [resumes, setResumes] = useState([INITIAL_RESUME]);
  const [activeId, setActiveId] = useState("r1");
  const [versions, setVersions] = useState({
    r1: [
      { id: "rv1", label: "v1 — 최초 작성", date: "2026.04.12", desc: "최초 작성본", data: { ...INITIAL_RESUME } },
      {
        id: "rv2",
        label: "v2 — 네이버 지원용",
        date: "2026.05.20",
        desc: "자소서 보강",
        data: { ...INITIAL_RESUME, name: "네이버 지원용" },
      },
    ],
  });
  const [activeSection, setActiveSection] = useState("basic");
  const [showHistory, setShowHistory] = useState(false);
  const [aiPanel, setAiPanel] = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const [savedMsg, setSavedMsg] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [previewVersion, setPreviewVersion] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [renameVal, setRenameVal] = useState("");

  const resume = resumes.find((r) => r.id === activeId);

  // 게이트 플래그를 '실제 필수 충족 여부'로 동기화 (저장과 무관, 데이터 기준)
  useEffect(() => {
    setResumeComplete(isRequiredFilled(resume));
  }, [resume]);

  const updateResume = (patch) => {
    setResumes((arr) => arr.map((r) => (r.id === activeId ? { ...r, ...patch } : r)));
  };
  const updateBasic = (key, val) => {
    setResumes((arr) => arr.map((r) => (r.id === activeId ? { ...r, basic: { ...r.basic, [key]: val } } : r)));
  };

  const saveVersion = () => {
    if (!isRequiredFilled(resume)) {
      setSavedMsg(false);
      setSaveError("필수 항목(기본정보·경력·스킬)을 작성해야 저장할 수 있습니다.");
      setTimeout(() => setSaveError(""), 3000);
      return;
    }
    setSaveError("");
    const now = new Date();
    const label = `v${(versions[activeId]?.length ?? 0) + 1} — ${resume.name}`;
    const ver = {
      id: `rv${Date.now()}`,
      label,
      date: now
        .toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
        .replace(/\. /g, "."),
      desc: "수동 저장",
      data: {
        ...resume,
        educations: [...resume.educations],
        careers: [...resume.careers],
        certifications: [...resume.certifications],
        skills: [...resume.skills],
      },
    };
    setVersions((v) => ({ ...v, [activeId]: [...(v[activeId] ?? []), ver] }));
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const createResume = () => {
    const id = `r${Date.now()}`;
    const nr = {
      id,
      name: "새 이력서",
      basic: { name: "", email: "", phone: "", address: "", github: "", portfolio: "" },
      educations: [],
      careers: [],
      certifications: [],
      skills: [],
      coverText: "",
    };
    setResumes((r) => [...r, nr]);
    setVersions((v) => ({ ...v, [id]: [] }));
    setActiveId(id);
    setActiveSection("basic");
    setShowHistory(false);
  };

  const deleteResume = (id) => {
    if (resumes.length === 1) return;
    const next = resumes.find((r) => r.id !== id);
    setResumes((r) => r.filter((x) => x.id !== id));
    if (activeId === id && next) setActiveId(next.id);
    setDeleteConfirm(null);
  };

  const restoreVersion = (ver) => {
    setResumes((arr) => arr.map((r) => (r.id === activeId ? { ...ver.data, id: activeId, name: resume.name } : r)));
    setPreviewVersion(null);
    setShowHistory(false);
  };

  const applyAI = (patch) => {
    updateResume(patch);
  };

  const thisVersions = versions[activeId] ?? [];
  const aiLabel = activeSection === "cover" ? "AI 자소서 가이드" : "AI 자동 완성";

  // 섹션별 리스트 카드 공통 스타일
  const listCardSx = {
    borderRadius: "12px",
    bgcolor: secondary,
    border: "1px solid",
    borderColor: "divider",
    p: 2,
    display: "flex",
    flexDirection: "column",
    gap: 1.5,
  };
  const fieldLabelSx = { fontSize: 12, color: "text.secondary", display: "block", mb: 0.5 };
  const removeBtnSx = {
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    fontSize: 12,
    color: "#F87171",
    border: "none",
    bgcolor: "transparent",
    font: "inherit",
    cursor: "pointer",
    alignSelf: "flex-start",
    "&:hover": { color: "#DC2626" },
  };
  const addBtnSx = {
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    fontSize: 14,
    color: "primary.main",
    border: "none",
    bgcolor: "transparent",
    font: "inherit",
    cursor: "pointer",
    "&:hover": { color: "primary.dark" },
  };
  const sectionHeadingSx = { fontWeight: 600, color: "text.primary", display: { xs: "none", lg: "block" } };
  const toggleTrackSx = (on) => ({
    width: 36,
    height: 20,
    borderRadius: "999px",
    border: "none",
    p: 0,
    position: "relative",
    cursor: "pointer",
    transition: "background-color .2s",
    bgcolor: on ? "primary.main" : "divider",
  });
  const toggleThumbSx = (on) => ({
    position: "absolute",
    top: 2,
    left: on ? 16 : 2,
    width: 16,
    height: 16,
    bgcolor: "#fff",
    borderRadius: "999px",
    boxShadow: 1,
    transition: "left .2s",
  });

  const Star = () => (
    <Box component="span" sx={{ color: "#EF4444", ml: 0.25 }}>
      *
    </Box>
  );

  return (
    <Box sx={{ maxWidth: 1024, mx: "auto", px: 2, py: 5 }}>
      {/* 저장 안내 토스트 */}
      {saveError && (
        <Box
          sx={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 100,
            bgcolor: "#fff",
            border: "1px solid #FECACA",
            borderRadius: "12px",
            boxShadow: 3,
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontSize: 14,
            color: "#DC2626",
          }}
        >
          <ErrorOutlined sx={{ fontSize: 16 }} />
          {saveError}
        </Box>
      )}
      {savedMsg && (
        <Box
          sx={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 100,
            bgcolor: "#fff",
            border: "1px solid #BBF7D0",
            borderRadius: "12px",
            boxShadow: 3,
            px: 2,
            py: 1.5,
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontSize: 14,
            color: "#15803D",
          }}
        >
          <CheckCircle sx={{ fontSize: 16 }} />
          이력서가 저장되었습니다.
        </Box>
      )}

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { xs: "flex-start", sm: "center" },
          justifyContent: "space-between",
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 30, fontWeight: 700, color: "text.primary" }}>이력서</Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}>
            필수 항목(기본정보·경력·스킬)을 작성하고 저장하면 교육·모의면접을 이용할 수 있어요.
          </Typography>
        </Box>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
          <Box
            component="button"
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              px: 2,
              py: 1,
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: secondary,
              fontSize: 14,
              color: "text.primary",
              font: "inherit",
              cursor: "pointer",
              transition: "background-color .2s",
              "&:hover": { bgcolor: "rgba(108,99,255,0.06)" },
            }}
          >
            <History sx={{ fontSize: 16 }} />
            히스토리{" "}
            {thisVersions.length > 0 && (
              <Box component="span" sx={{ fontSize: 12, color: "primary.main", fontWeight: 500 }}>
                ({thisVersions.length})
              </Box>
            )}
          </Box>
          <Box
            component="button"
            type="button"
            onClick={() => generatePDF(resume)}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.75,
              px: 2,
              py: 1,
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "rgba(108,99,255,0.3)",
              bgcolor: "rgba(108,99,255,0.05)",
              color: "primary.main",
              fontSize: 14,
              font: "inherit",
              cursor: "pointer",
              transition: "background-color .2s",
              "&:hover": { bgcolor: "rgba(108,99,255,0.1)" },
            }}
          >
            <Download sx={{ fontSize: 16 }} />
            PDF 저장
          </Box>
          <Box
            component="button"
            type="button"
            onClick={saveVersion}
            sx={{ ...primaryBtnSx, px: 2, py: 1, borderRadius: "12px", fontWeight: 400 }}
          >
            {savedMsg ? (
              <>
                <Check sx={{ fontSize: 16 }} />
                저장됨
              </>
            ) : (
              <>
                <Save sx={{ fontSize: 16 }} />
                저장
              </>
            )}
          </Box>
        </Box>
      </Box>

      {/* Resume tabs */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3, overflowX: "auto", pb: 0.5 }}>
        {resumes.map((r) => (
          <Box key={r.id} sx={{ position: "relative", flexShrink: 0, "&:hover .tab-del": { display: "flex" } }}>
            {renamingId === r.id ? (
              <Box
                component="form"
                onSubmit={(e) => {
                  e.preventDefault();
                  setResumes((arr) => arr.map((x) => (x.id === r.id ? { ...x, name: renameVal || x.name } : x)));
                  setRenamingId(null);
                }}
              >
                <Box
                  component="input"
                  autoFocus
                  value={renameVal}
                  onChange={(e) => setRenameVal(e.target.value)}
                  onBlur={() => {
                    setResumes((arr) => arr.map((x) => (x.id === r.id ? { ...x, name: renameVal || x.name } : x)));
                    setRenamingId(null);
                  }}
                  sx={{
                    px: 1.5,
                    py: 0.75,
                    borderRadius: "8px",
                    border: "1px solid",
                    borderColor: "primary.main",
                    fontSize: 14,
                    color: "text.primary",
                    bgcolor: "background.paper",
                    width: 128,
                    font: "inherit",
                    "&:focus": { outline: "none" },
                  }}
                />
              </Box>
            ) : (
              <Box
                component="button"
                type="button"
                onClick={() => {
                  setActiveId(r.id);
                  setShowHistory(false);
                }}
                onDoubleClick={() => {
                  setRenamingId(r.id);
                  setRenameVal(r.name);
                }}
                title="더블클릭으로 이름 변경"
                sx={{
                  px: 2,
                  py: 1,
                  borderRadius: "12px",
                  fontSize: 14,
                  font: "inherit",
                  cursor: "pointer",
                  transition: "color .2s, background-color .2s",
                  display: "flex",
                  alignItems: "center",
                  gap: 0.75,
                  ...(activeId === r.id
                    ? { bgcolor: "primary.main", color: "#fff", border: "none" }
                    : {
                        bgcolor: secondary,
                        border: "1px solid",
                        borderColor: "divider",
                        color: "text.secondary",
                        "&:hover": { color: "text.primary" },
                      }),
                }}
              >
                <Description sx={{ fontSize: 14 }} />
                {r.name}
              </Box>
            )}
            {resumes.length > 1 && r.id !== activeId && (
              <Box
                component="button"
                type="button"
                className="tab-del"
                onClick={() => setDeleteConfirm(r.id)}
                sx={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  width: 16,
                  height: 16,
                  borderRadius: "999px",
                  bgcolor: "#F87171",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                  display: "none",
                  alignItems: "center",
                  justifyContent: "center",
                  p: 0,
                }}
              >
                <Close sx={{ fontSize: 10 }} />
              </Box>
            )}
          </Box>
        ))}
        <Box
          component="button"
          type="button"
          onClick={createResume}
          sx={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            px: 1.5,
            py: 1,
            borderRadius: "12px",
            border: "1px dashed",
            borderColor: "divider",
            bgcolor: "transparent",
            fontSize: 14,
            color: "text.secondary",
            font: "inherit",
            cursor: "pointer",
            transition: "color .2s, border-color .2s",
            "&:hover": { color: "primary.main", borderColor: "rgba(108,99,255,0.4)" },
          }}
        >
          <Add sx={{ fontSize: 14 }} />
          새 이력서
        </Box>
      </Box>

      {/* History panel */}
      {showHistory && (
        <Box
          sx={{
            borderRadius: "16px",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            p: 2.5,
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
            <Typography
              component="h3"
              sx={{ fontWeight: 600, color: "text.primary", display: "flex", alignItems: "center", gap: 1 }}
            >
              <History sx={{ fontSize: 16 }} />
              이력서 버전 히스토리
            </Typography>
            <Box
              component="button"
              type="button"
              onClick={() => setShowHistory(false)}
              sx={{
                border: "none",
                bgcolor: "transparent",
                color: "text.secondary",
                cursor: "pointer",
                display: "inline-flex",
                "&:hover": { color: "text.primary" },
              }}
            >
              <Close sx={{ fontSize: 16 }} />
            </Box>
          </Box>
          {thisVersions.length === 0 && (
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
              저장 버튼을 누르면 버전이 생성됩니다.
            </Typography>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {[...thisVersions].reverse().map((v) => (
              <Box
                key={v.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1.5,
                  borderRadius: "12px",
                  bgcolor: secondary,
                  border: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography component="span" sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}>
                      {v.label}
                    </Typography>
                    <Typography component="span" sx={{ fontSize: 12, color: "text.secondary" }}>
                      {v.date}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>{v.desc}</Typography>
                </Box>
                <Box sx={{ display: "flex", gap: 1, flexShrink: 0 }}>
                  <Box
                    component="button"
                    type="button"
                    onClick={() => setPreviewVersion(v)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      fontSize: 12,
                      color: "primary.main",
                      border: "none",
                      bgcolor: "transparent",
                      font: "inherit",
                      cursor: "pointer",
                      "&:hover": { color: "primary.dark" },
                    }}
                  >
                    <Visibility sx={{ fontSize: 12 }} />
                    열람
                  </Box>
                  <Box
                    component="button"
                    type="button"
                    onClick={() => restoreVersion(v)}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      fontSize: 12,
                      color: "text.secondary",
                      border: "none",
                      bgcolor: "transparent",
                      font: "inherit",
                      cursor: "pointer",
                      "&:hover": { color: "text.primary" },
                    }}
                  >
                    <RestartAlt sx={{ fontSize: 12 }} />
                    복원
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "repeat(4, 1fr)" },
          gap: 3,
        }}
      >
        {/* Section nav */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "row", lg: "column" },
            gap: 0.5,
            position: { lg: "sticky" },
            top: { lg: 96 },
            height: "fit-content",
            overflowX: { xs: "auto", lg: "visible" },
            pb: { xs: 0.5, lg: 0 },
          }}
        >
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <Box
                key={s.id}
                component="button"
                type="button"
                onClick={() => setActiveSection(s.id)}
                sx={{
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 1.25,
                  borderRadius: "12px",
                  fontSize: 14,
                  textAlign: "left",
                  whiteSpace: "nowrap",
                  border: "none",
                  font: "inherit",
                  cursor: "pointer",
                  transition: "color .2s, background-color .2s",
                  ...(activeSection === s.id
                    ? { bgcolor: "rgba(108,99,255,0.1)", color: "primary.main", fontWeight: 500 }
                    : { bgcolor: "transparent", color: "text.secondary", "&:hover": { bgcolor: secondary } }),
                }}
              >
                <Icon sx={{ fontSize: 14, flexShrink: 0 }} />
                {s.label}
                {s.required && <Star />}
              </Box>
            );
          })}

          <Box
            sx={{ display: { xs: "none", lg: "block" }, mt: 2, pt: 2, borderTop: "1px solid", borderColor: "divider" }}
          >
            <Box
              component="button"
              type="button"
              onClick={() => setAiPanel(activeSection)}
              sx={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1.25,
                borderRadius: "12px",
                bgcolor: "rgba(108,99,255,0.05)",
                border: "1px solid",
                borderColor: "rgba(108,99,255,0.2)",
                color: "primary.main",
                fontSize: 14,
                font: "inherit",
                cursor: "pointer",
                transition: "background-color .2s",
                "&:hover": { bgcolor: "rgba(108,99,255,0.1)" },
              }}
            >
              <AutoAwesome sx={{ fontSize: 14 }} />
              {aiLabel}
            </Box>
          </Box>
        </Box>

        {/* Content */}
        <Box
          sx={{
            gridColumn: { lg: "span 3" },
            borderRadius: "16px",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            p: 3,
          }}
        >
          {/* Mobile AI button */}
          <Box
            sx={{
              display: { xs: "flex", lg: "none" },
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2.5,
            }}
          >
            <Typography component="h2" sx={{ fontWeight: 600, color: "text.primary" }}>
              {SECTIONS.find((s) => s.id === activeSection)?.label}
            </Typography>
            <Box
              component="button"
              type="button"
              onClick={() => setAiPanel(activeSection)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                px: 1.5,
                py: 0.75,
                borderRadius: "8px",
                bgcolor: "rgba(108,99,255,0.1)",
                color: "primary.main",
                fontSize: 12,
                fontWeight: 500,
                border: "none",
                font: "inherit",
                cursor: "pointer",
                "&:hover": { bgcolor: "rgba(108,99,255,0.2)" },
              }}
            >
              <AutoAwesome sx={{ fontSize: 14 }} />
              {aiLabel}
            </Box>
          </Box>

          {/* Basic info */}
          {activeSection === "basic" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography component="h2" sx={sectionHeadingSx}>
                기본 정보
                <Star />
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
                {[
                  { key: "name", label: "이름", type: "text", span: false },
                  { key: "email", label: "이메일", type: "email", span: false },
                  { key: "phone", label: "연락처", type: "tel", span: false },
                  { key: "address", label: "거주지", type: "text", span: true },
                  { key: "github", label: "깃허브", type: "url", span: false },
                  { key: "portfolio", label: "포트폴리오", type: "url", span: false },
                ].map((f) => (
                  <Box key={f.key} sx={{ gridColumn: f.span ? "span 2" : "auto" }}>
                    <Typography component="label" sx={{ fontSize: 14, color: "text.secondary", display: "block", mb: 0.75 }}>
                      {f.label}
                    </Typography>
                    <Box
                      component="input"
                      type={f.type}
                      value={resume.basic[f.key]}
                      onChange={(e) => updateBasic(f.key, e.target.value)}
                      sx={{ ...fieldSx, px: 2, py: 1.25, borderRadius: "12px", bgcolor: secondary, fontSize: 14 }}
                    />
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Education */}
          {activeSection === "edu" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography component="h2" sx={sectionHeadingSx}>
                  학력
                </Typography>
                <Box
                  component="button"
                  type="button"
                  onClick={() =>
                    updateResume({ educations: [...resume.educations, { school: "", major: "", grade: "", period: "" }] })
                  }
                  sx={addBtnSx}
                >
                  <Add sx={{ fontSize: 16 }} />
                  추가
                </Box>
              </Box>
              {resume.educations.length === 0 && (
                <Typography sx={{ fontSize: 14, color: "text.secondary", py: 2, textAlign: "center" }}>
                  학력을 추가해주세요.
                </Typography>
              )}
              {resume.educations.map((edu, i) => (
                <Box key={i} sx={listCardSx}>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1.5 }}>
                    {[
                      ["school", "학교명"],
                      ["major", "전공"],
                      ["grade", "학점"],
                      ["period", "재학기간"],
                    ].map(([k, l]) => (
                      <Box key={k}>
                        <Typography component="label" sx={fieldLabelSx}>
                          {l}
                        </Typography>
                        <Box
                          component="input"
                          value={edu[k]}
                          onChange={(e) =>
                            updateResume({
                              educations: resume.educations.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)),
                            })
                          }
                          sx={fieldSx}
                        />
                      </Box>
                    ))}
                  </Box>
                  <Box
                    component="button"
                    type="button"
                    onClick={() => updateResume({ educations: resume.educations.filter((_, j) => j !== i) })}
                    sx={removeBtnSx}
                  >
                    <DeleteOutlined sx={{ fontSize: 14 }} />
                    삭제
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* Career */}
          {activeSection === "career" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography component="h2" sx={sectionHeadingSx}>
                  경력
                  <Star />
                </Typography>
                {!resume.careerNone && (
                  <Box
                    component="button"
                    type="button"
                    onClick={() =>
                      updateResume({
                        careers: [
                          ...resume.careers,
                          { company: "", role: "", period: "", desc: "", employmentType: "정규직", team: "", current: false },
                        ],
                      })
                    }
                    sx={addBtnSx}
                  >
                    <Add sx={{ fontSize: 16 }} />
                    추가
                  </Box>
                )}
              </Box>
              <Box component="label" sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer", alignSelf: "flex-start" }}>
                <Box
                  component="button"
                  type="button"
                  onClick={() => updateResume(resume.careerNone ? { careerNone: false } : { careerNone: true, careers: [] })}
                  sx={toggleTrackSx(resume.careerNone)}
                >
                  <Box component="span" sx={toggleThumbSx(resume.careerNone)} />
                </Box>
                <Typography component="span" sx={{ fontSize: 12, color: "text.primary" }}>
                  경력 없음 (신입)
                </Typography>
              </Box>
              {resume.careerNone ? (
                <Typography sx={{ fontSize: 14, color: "text.secondary", py: 2, textAlign: "center" }}>
                  경력 없음(신입)으로 표시됩니다.
                </Typography>
              ) : (
                <>
                  {resume.careers.length === 0 && (
                    <Typography sx={{ fontSize: 14, color: "text.secondary", py: 2, textAlign: "center" }}>
                      경력을 추가하거나 ‘경력 없음’을 선택하세요.
                    </Typography>
                  )}
                  {resume.careers.map((career, i) => (
                    <Box key={i} sx={listCardSx}>
                      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1.5 }}>
                        {[
                          ["company", "회사명"],
                          ["role", "직책/포지션"],
                        ].map(([k, l]) => (
                          <Box key={k}>
                            <Typography component="label" sx={fieldLabelSx}>
                              {l}
                            </Typography>
                            <Box
                              component="input"
                              value={career[k]}
                              onChange={(e) =>
                                updateResume({
                                  careers: resume.careers.map((x, j) => (j === i ? { ...x, [k]: e.target.value } : x)),
                                })
                              }
                              sx={fieldSx}
                            />
                          </Box>
                        ))}
                        {/* 고용 형태 */}
                        <Box>
                          <Typography component="label" sx={fieldLabelSx}>
                            고용 형태
                          </Typography>
                          <Box
                            component="select"
                            value={career.employmentType}
                            onChange={(e) =>
                              updateResume({
                                careers: resume.careers.map((x, j) =>
                                  j === i ? { ...x, employmentType: e.target.value } : x
                                ),
                              })
                            }
                            sx={fieldSx}
                          >
                            {EMPLOYMENT_TYPES.map((t) => (
                              <option key={t}>{t}</option>
                            ))}
                          </Box>
                        </Box>
                        {/* 부서/팀 */}
                        <Box>
                          <Typography component="label" sx={fieldLabelSx}>
                            부서/팀
                          </Typography>
                          <Box
                            component="input"
                            value={career.team}
                            onChange={(e) =>
                              updateResume({
                                careers: resume.careers.map((x, j) => (j === i ? { ...x, team: e.target.value } : x)),
                              })
                            }
                            placeholder="예: 프론트엔드팀"
                            sx={fieldSx}
                          />
                        </Box>
                        <Box sx={{ gridColumn: "span 2" }}>
                          <Typography component="label" sx={fieldLabelSx}>
                            근무기간
                          </Typography>
                          <Box
                            component="input"
                            value={career.period}
                            disabled={career.current}
                            onChange={(e) =>
                              updateResume({
                                careers: resume.careers.map((x, j) => (j === i ? { ...x, period: e.target.value } : x)),
                              })
                            }
                            placeholder="예: 2025.07 ~ 2025.12"
                            sx={fieldSx}
                          />
                        </Box>
                      </Box>
                      {/* 재직 중 */}
                      <Box
                        component="label"
                        sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer", alignSelf: "flex-start" }}
                      >
                        <Box
                          component="button"
                          type="button"
                          onClick={() =>
                            updateResume({
                              careers: resume.careers.map((x, j) => (j === i ? { ...x, current: !x.current } : x)),
                            })
                          }
                          sx={toggleTrackSx(career.current)}
                        >
                          <Box component="span" sx={toggleThumbSx(career.current)} />
                        </Box>
                        <Typography component="span" sx={{ fontSize: 12, color: "text.primary" }}>
                          현재 재직 중
                        </Typography>
                      </Box>
                      <Box>
                        <Typography component="label" sx={fieldLabelSx}>
                          주요 업무 및 성과
                        </Typography>
                        <Box
                          component="textarea"
                          value={career.desc}
                          onChange={(e) =>
                            updateResume({
                              careers: resume.careers.map((x, j) => (j === i ? { ...x, desc: e.target.value } : x)),
                            })
                          }
                          placeholder="주요 업무, 사용 기술, 성과 등을 작성하세요"
                          sx={{ ...fieldSx, height: 80, resize: "none" }}
                        />
                      </Box>
                      <Box
                        component="button"
                        type="button"
                        onClick={() => updateResume({ careers: resume.careers.filter((_, j) => j !== i) })}
                        sx={removeBtnSx}
                      >
                        <DeleteOutlined sx={{ fontSize: 14 }} />
                        삭제
                      </Box>
                    </Box>
                  ))}
                </>
              )}
            </Box>
          )}

          {/* Certifications */}
          {activeSection === "cert" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Typography component="h2" sx={sectionHeadingSx}>
                  자격증
                </Typography>
                <Box
                  component="button"
                  type="button"
                  onClick={() =>
                    updateResume({ certifications: [...resume.certifications, { name: "", issuer: "", date: "" }] })
                  }
                  sx={addBtnSx}
                >
                  <Add sx={{ fontSize: 16 }} />
                  추가
                </Box>
              </Box>
              {resume.certifications.length === 0 && (
                <Typography sx={{ fontSize: 14, color: "text.secondary", py: 2, textAlign: "center" }}>
                  보유한 자격증을 추가해주세요.
                </Typography>
              )}
              {resume.certifications.map((cert, i) => (
                <Box key={i} sx={listCardSx}>
                  <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1.5 }}>
                    {[
                      ["name", "자격증명"],
                      ["issuer", "발급 기관"],
                      ["date", "취득일 (예: 2025.08)"],
                    ].map(([k, l]) => (
                      <Box key={k} sx={{ gridColumn: k === "name" ? "span 2" : "auto" }}>
                        <Typography component="label" sx={fieldLabelSx}>
                          {l}
                        </Typography>
                        <Box
                          component="input"
                          value={cert[k]}
                          onChange={(e) =>
                            updateResume({
                              certifications: resume.certifications.map((x, j) =>
                                j === i ? { ...x, [k]: e.target.value } : x
                              ),
                            })
                          }
                          sx={fieldSx}
                        />
                      </Box>
                    ))}
                  </Box>
                  <Box
                    component="button"
                    type="button"
                    onClick={() =>
                      updateResume({ certifications: resume.certifications.filter((_, j) => j !== i) })
                    }
                    sx={removeBtnSx}
                  >
                    <DeleteOutlined sx={{ fontSize: 14 }} />
                    삭제
                  </Box>
                </Box>
              ))}
            </Box>
          )}

          {/* Skills */}
          {activeSection === "skills" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography component="h2" sx={sectionHeadingSx}>
                기술 스택
                <Star />
              </Typography>
              <Box component="label" sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer", alignSelf: "flex-start" }}>
                <Box
                  component="button"
                  type="button"
                  onClick={() => updateResume(resume.skillsNone ? { skillsNone: false } : { skillsNone: true, skills: [] })}
                  sx={toggleTrackSx(resume.skillsNone)}
                >
                  <Box component="span" sx={toggleThumbSx(resume.skillsNone)} />
                </Box>
                <Typography component="span" sx={{ fontSize: 12, color: "text.primary" }}>
                  보유 스킬 없음
                </Typography>
              </Box>
              {resume.skillsNone ? (
                <Typography sx={{ fontSize: 14, color: "text.secondary", py: 2, textAlign: "center" }}>
                  보유 스킬 없음으로 표시됩니다.
                </Typography>
              ) : (
                <>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, minHeight: 48 }}>
                    {resume.skills.map((s) => (
                      <Box
                        key={s}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          px: 1.5,
                          py: 0.75,
                          borderRadius: "999px",
                          bgcolor: "rgba(108,99,255,0.1)",
                          border: "1px solid",
                          borderColor: "rgba(108,99,255,0.2)",
                          color: "primary.main",
                          fontSize: 14,
                        }}
                      >
                        {s}
                        <Box
                          component="button"
                          type="button"
                          onClick={() => updateResume({ skills: resume.skills.filter((x) => x !== s) })}
                          sx={{
                            ml: 0.5,
                            border: "none",
                            bgcolor: "transparent",
                            color: "inherit",
                            cursor: "pointer",
                            font: "inherit",
                            p: 0,
                            "&:hover": { color: "#3730A3" },
                          }}
                        >
                          ×
                        </Box>
                      </Box>
                    ))}
                    {resume.skills.length === 0 && (
                      <Typography sx={{ fontSize: 14, color: "text.secondary", alignSelf: "center" }}>
                        기술 스택을 추가하거나 ‘보유 스킬 없음’을 선택하세요.
                      </Typography>
                    )}
                  </Box>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Box
                      component="input"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && skillInput.trim()) {
                          updateResume({ skills: [...resume.skills, skillInput.trim()] });
                          setSkillInput("");
                        }
                      }}
                      placeholder="스킬 입력 후 Enter"
                      sx={{ ...fieldSx, flex: 1, px: 2, py: 1.25, borderRadius: "12px", bgcolor: secondary, fontSize: 14 }}
                    />
                    <Box
                      component="button"
                      type="button"
                      onClick={() => {
                        if (skillInput.trim()) {
                          updateResume({ skills: [...resume.skills, skillInput.trim()] });
                          setSkillInput("");
                        }
                      }}
                      sx={{ ...primaryBtnSx, px: 2, py: 1.25, borderRadius: "12px", fontWeight: 400 }}
                    >
                      추가
                    </Box>
                  </Box>
                </>
              )}
            </Box>
          )}

          {/* Cover letter */}
          {activeSection === "cover" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Typography component="h2" sx={sectionHeadingSx}>
                자기소개서
              </Typography>
              <Box
                component="textarea"
                value={resume.coverText}
                onChange={(e) => updateResume({ coverText: e.target.value })}
                placeholder="자기소개서를 작성하거나 AI 자동 완성을 활용하세요."
                sx={{
                  ...fieldSx,
                  height: 256,
                  px: 2,
                  py: 1.5,
                  borderRadius: "12px",
                  bgcolor: secondary,
                  fontSize: 14,
                  resize: "none",
                  lineHeight: 1.7,
                }}
              />
              <Box sx={{ fontSize: 12, color: "text.secondary", display: "flex", alignItems: "center", gap: 0.75 }}>
                <ErrorOutlined sx={{ fontSize: 14 }} />
                {resume.coverText.length}자 작성됨
              </Box>
            </Box>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mt: 3,
              pt: 2.5,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              component="button"
              type="button"
              onClick={() => setAiPanel(activeSection)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                px: 2,
                py: 1,
                borderRadius: "12px",
                border: "1px solid",
                borderColor: "rgba(108,99,255,0.2)",
                bgcolor: "rgba(108,99,255,0.05)",
                color: "primary.main",
                fontSize: 14,
                font: "inherit",
                cursor: "pointer",
                transition: "background-color .2s",
                "&:hover": { bgcolor: "rgba(108,99,255,0.1)" },
              }}
            >
              <AutoAwesome sx={{ fontSize: 14 }} />
              {aiLabel}
            </Box>
            <Box
              component="button"
              type="button"
              onClick={saveVersion}
              sx={{ ...primaryBtnSx, px: 3, py: 1.25, borderRadius: "12px", fontWeight: 400 }}
            >
              {savedMsg ? (
                <>
                  <Check sx={{ fontSize: 16 }} />
                  저장됨!
                </>
              ) : (
                <>
                  <Save sx={{ fontSize: 16 }} />
                  저장
                </>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* AI suggestion panel */}
      {aiPanel && (
        <AiSuggestionPanel section={aiPanel} current={resume} onApply={applyAI} onClose={() => setAiPanel(null)} />
      )}

      {/* Version preview modal */}
      {previewVersion && (
        <Box sx={modalOverlaySx}>
          <Box sx={{ ...modalCardSx, maxWidth: 672, maxHeight: "80vh", overflowY: "auto" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 2.5,
                borderBottom: "1px solid",
                borderColor: "divider",
                position: "sticky",
                top: 0,
                bgcolor: "background.paper",
                zIndex: 1,
              }}
            >
              <Box>
                <Typography component="h3" sx={{ fontWeight: 600, color: "text.primary" }}>
                  {previewVersion.label}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{previewVersion.date}</Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Box
                  component="button"
                  type="button"
                  onClick={() => restoreVersion(previewVersion)}
                  sx={{ ...primaryBtnSx, px: 2, py: 1, borderRadius: "12px", fontWeight: 400 }}
                >
                  <RestartAlt sx={{ fontSize: 14 }} />이 버전으로 복원
                </Box>
                <Box
                  component="button"
                  type="button"
                  onClick={() => setPreviewVersion(null)}
                  sx={{ ...iconBtnSx, p: 1, borderRadius: "12px" }}
                >
                  <Close sx={{ fontSize: 16 }} />
                </Box>
              </Box>
            </Box>
            <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2, fontSize: 14 }}>
              <Box>
                <Typography
                  component="h4"
                  sx={{
                    fontWeight: 500,
                    mb: 0.5,
                    fontSize: 12,
                    textTransform: "uppercase",
                    color: "text.secondary",
                    letterSpacing: "0.05em",
                  }}
                >
                  기본 정보
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 0.5, fontSize: 14 }}>
                  {Object.entries(previewVersion.data.basic).map(
                    ([k, v]) =>
                      v && (
                        <Box key={k} sx={{ color: "text.secondary" }}>
                          {k}: <Box component="span" sx={{ color: "text.primary" }}>{v}</Box>
                        </Box>
                      )
                  )}
                </Box>
              </Box>
              {previewVersion.data.educations.length > 0 && (
                <Box>
                  <Typography
                    component="h4"
                    sx={{
                      fontWeight: 500,
                      mb: 0.5,
                      fontSize: 12,
                      textTransform: "uppercase",
                      color: "text.secondary",
                      letterSpacing: "0.05em",
                    }}
                  >
                    학력
                  </Typography>
                  {previewVersion.data.educations.map((e, i) => (
                    <Box key={i} sx={{ color: "text.primary" }}>
                      {e.school} · {e.major} ({e.period})
                    </Box>
                  ))}
                </Box>
              )}
              {previewVersion.data.certifications?.length > 0 && (
                <Box>
                  <Typography
                    component="h4"
                    sx={{
                      fontWeight: 500,
                      mb: 0.5,
                      fontSize: 12,
                      textTransform: "uppercase",
                      color: "text.secondary",
                      letterSpacing: "0.05em",
                    }}
                  >
                    자격증
                  </Typography>
                  {previewVersion.data.certifications.map((c, i) => (
                    <Box key={i} sx={{ color: "text.primary" }}>
                      {[c.name, c.issuer, c.date].filter(Boolean).join(" · ")}
                    </Box>
                  ))}
                </Box>
              )}
              {previewVersion.data.skills.length > 0 && (
                <Box>
                  <Typography
                    component="h4"
                    sx={{
                      fontWeight: 500,
                      mb: 0.5,
                      fontSize: 12,
                      textTransform: "uppercase",
                      color: "text.secondary",
                      letterSpacing: "0.05em",
                    }}
                  >
                    스킬
                  </Typography>
                  <Typography sx={{ color: "text.primary" }}>{previewVersion.data.skills.join(", ")}</Typography>
                </Box>
              )}
              {previewVersion.data.coverText && (
                <Box>
                  <Typography
                    component="h4"
                    sx={{
                      fontWeight: 500,
                      mb: 0.5,
                      fontSize: 12,
                      textTransform: "uppercase",
                      color: "text.secondary",
                      letterSpacing: "0.05em",
                    }}
                  >
                    자기소개서
                  </Typography>
                  <Typography sx={{ color: "text.primary", lineHeight: 1.7 }}>
                    {previewVersion.data.coverText}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      )}

      {/* Delete confirm */}
      {deleteConfirm && (
        <Box sx={{ ...modalOverlaySx, bgcolor: "rgba(0,0,0,0.4)" }}>
          <Box sx={{ ...modalCardSx, maxWidth: 384, p: 3 }}>
            <Typography component="h3" sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}>
              이력서 삭제
            </Typography>
            <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 2.5 }}>
              이 이력서를 삭제하면 복구할 수 없습니다. 계속하시겠습니까?
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Box
                component="button"
                type="button"
                onClick={() => setDeleteConfirm(null)}
                sx={{ ...outlineBtnSx, flex: 1, py: 1.25, borderRadius: "12px" }}
              >
                취소
              </Box>
              <Box
                component="button"
                type="button"
                onClick={() => deleteResume(deleteConfirm)}
                sx={{
                  flex: 1,
                  py: 1.25,
                  borderRadius: "12px",
                  bgcolor: "#EF4444",
                  color: "#fff",
                  fontSize: 14,
                  border: "none",
                  font: "inherit",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#DC2626" },
                }}
              >
                삭제
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
