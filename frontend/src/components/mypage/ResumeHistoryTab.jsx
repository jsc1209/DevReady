import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import {
  CheckCircle,
  Description,
  ExpandMore,
  ExpandLess,
  Replay,
} from "@mui/icons-material";
import { getMyResumes, updateResume as apiUpdateResume } from "../../api/resumeApi";

const mono = "'DM Mono', monospace";

// getMyResumes() → 모든 이력서의 버전을 평탄화(최근순). 각 항목 = 버전 + 소속 resumeId + 스냅샷 데이터.
function flattenVersions(list) {
  const out = [];
  (list || []).forEach((r) => {
    (r.versions || []).forEach((v) => {
      const d = v.data || {};
      out.push({
        id: String(v.versionId),
        resumeId: r.resumeId,
        label: v.label,
        date: v.createdAt,
        resumeName: r.name ?? d.name ?? "이력서",
        skills: Array.isArray(d.skills) ? d.skills : [],
        careers: Array.isArray(d.careers) ? d.careers.length : 0,
        data: d,
      });
    });
  });
  // createdAt 문자열 내림차순(최근 먼저)
  return out.sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

/**
 * 내 이력서 탭 (MyPage) — 실제 버전 히스토리(/api/resumes)를 표시.
 * 모든 이력서의 버전을 최근순으로 나열, 가장 최근 버전을 '현재'로 표시.
 * 복원 = 해당 스냅샷으로 새 버전을 저장(= 그 시점 상태로 되돌림).
 */
export default function ResumeHistoryTab() {
  const [openId, setOpenId] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restored, setRestored] = useState(null);

  const load = () => {
    setLoading(true);
    getMyResumes()
      .then((list) => {
        setHistory(flattenVersions(list));
        setLoading(false);
      })
      .catch(() => {
        setHistory([]);
        setLoading(false);
      });
  };
  useEffect(() => {
    load();
  }, []);

  // 현재 = 가장 최근 버전
  const currentVersion = history[0]?.id ?? null;

  const restore = async (v) => {
    try {
      await apiUpdateResume(v.resumeId, v.data); // 스냅샷으로 새 버전 생성 = 복원
      setRestored(v.label);
      setTimeout(() => setRestored(null), 2500);
      load();
    } catch {
      setRestored(null);
    }
  };

  return (
    <Box
      sx={{
        borderRadius: "16px",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        p: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2.5,
        }}
      >
        <Typography
          variant="h2"
          sx={{ fontSize: 16, fontWeight: 600, color: "text.primary" }}
        >
          이력서 버전 히스토리
        </Typography>
        {restored && (
          <Box
            component="span"
            sx={{
              fontSize: 12,
              color: "#22C55E",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            <CheckCircle sx={{ fontSize: 14 }} />
            {restored}(으)로 복원됨
          </Box>
        )}
      </Box>

      {loading ? (
        <Typography sx={{ fontSize: 14, color: "text.secondary", py: 4, textAlign: "center" }}>
          불러오는 중…
        </Typography>
      ) : history.length === 0 ? (
        <Typography sx={{ fontSize: 14, color: "text.secondary", py: 4, textAlign: "center" }}>
          저장된 이력서 버전이 없습니다. 이력서를 작성하고 저장하면 버전이 쌓입니다.
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {history.map((r) => {
            const isCurrent = r.id === currentVersion;
            const isOpen = openId === r.id;
            return (
              <Box
                key={r.id}
                sx={{
                  borderRadius: "12px",
                  border: "1px solid",
                  overflow: "hidden",
                  transition: "all .2s",
                  ...(isCurrent
                    ? {
                        borderColor: "rgba(108,99,255,0.4)",
                        bgcolor: "rgba(108,99,255,0.03)",
                      }
                    : { borderColor: "divider", bgcolor: "#F8F9FF" }),
                }}
              >
                <Box
                  component="button"
                  type="button"
                  onClick={() => setOpenId(isOpen ? null : r.id)}
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 2,
                    py: 1.5,
                    bgcolor: "transparent",
                    border: "none",
                    font: "inherit",
                    cursor: "pointer",
                    transition: "background-color .2s",
                    "&:hover": { bgcolor: "rgba(241,243,251,0.5)" },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Description
                      sx={{
                        fontSize: 16,
                        color: isCurrent ? "primary.main" : "text.secondary",
                      }}
                    />
                    <Box sx={{ textAlign: "left" }}>
                      <Box
                        sx={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: "text.primary",
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                        }}
                      >
                        {r.label}
                        {isCurrent && (
                          <Box
                            component="span"
                            sx={{
                              fontSize: 12,
                              bgcolor: "primary.main",
                              color: "#fff",
                              px: 0.75,
                              py: 0.25,
                              borderRadius: "999px",
                            }}
                          >
                            현재
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ fontSize: 12, color: "text.secondary" }}>
                        {r.date}
                      </Box>
                    </Box>
                  </Box>
                  {isOpen ? (
                    <ExpandLess sx={{ fontSize: 16, color: "text.secondary" }} />
                  ) : (
                    <ExpandMore sx={{ fontSize: 16, color: "text.secondary" }} />
                  )}
                </Box>

                {isOpen && (
                  <Box
                    sx={{
                      px: 2,
                      pb: 2,
                      pt: 1,
                      borderTop: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "text.secondary",
                        mb: 1.5,
                        lineHeight: 1.625,
                      }}
                    >
                      이력서: {r.resumeName}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 0.75,
                        mb: 1.5,
                      }}
                    >
                      {r.skills.map((s) => (
                        <Box
                          key={s}
                          component="span"
                          sx={{
                            fontSize: 12,
                            bgcolor: "rgba(108,99,255,0.1)",
                            color: "primary.main",
                            px: 1,
                            py: 0.25,
                            borderRadius: "999px",
                          }}
                        >
                          {s}
                        </Box>
                      ))}
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.5,
                        fontSize: 12,
                        color: "text.secondary",
                        mb: 2,
                      }}
                    >
                      <Box component="span">
                        경력{" "}
                        <Box
                          component="b"
                          sx={{ color: "text.primary", fontFamily: mono }}
                        >
                          {r.careers}
                        </Box>
                        건
                      </Box>
                      <Box component="span">
                        스킬{" "}
                        <Box
                          component="b"
                          sx={{ color: "text.primary", fontFamily: mono }}
                        >
                          {r.skills.length}
                        </Box>
                        개
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      {!isCurrent && (
                        <Box
                          component="button"
                          type="button"
                          onClick={() => restore(r)}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            px: 1.5,
                            py: 0.75,
                            borderRadius: "8px",
                            bgcolor: "primary.main",
                            color: "#fff",
                            fontSize: 12,
                            border: "none",
                            font: "inherit",
                            cursor: "pointer",
                            transition: "background-color .2s",
                            "&:hover": { bgcolor: "primary.dark" },
                          }}
                        >
                          <Replay sx={{ fontSize: 12 }} />이 버전으로 복원
                        </Box>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
