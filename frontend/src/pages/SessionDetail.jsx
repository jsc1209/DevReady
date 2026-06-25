import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { ArrowBack, Replay } from "@mui/icons-material";
import InterviewReport from "./InterviewReport";

/**
 * 면접 세션 상세 (/history/:id) — test-demo-UI/SessionDetail.tsx → JS+MUI.
 * 상단 바(기록으로 / 다시 도전) + InterviewReport 본문 재사용.
 * state 없이 진입하므로 InterviewReport 가 MOCK 데이터로 렌더된다.
 * 원본 useParams id 는 미사용이라 생략, Download import 도 미사용이라 생략.
 */
export default function SessionDetail() {
  const navigate = useNavigate();

  return (
    <Box>
      <Box sx={{ maxWidth: 1024, mx: "auto", px: 2, pt: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
          <Box
            component="button"
            type="button"
            onClick={() => navigate("/history")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontSize: 14,
              color: "text.secondary",
              bgcolor: "transparent",
              border: "none",
              font: "inherit",
              cursor: "pointer",
              transition: "color .2s",
              "&:hover": { color: "text.primary" },
            }}
          >
            <ArrowBack sx={{ fontSize: 16 }} />
            면접 기록으로
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Box
              component="button"
              type="button"
              onClick={() => navigate("/interview/setup")}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                px: 2,
                py: 1,
                borderRadius: "8px",
                bgcolor: "primary.main",
                color: "#fff",
                fontSize: 14,
                border: "none",
                font: "inherit",
                cursor: "pointer",
                transition: "background-color .2s",
                "&:hover": { bgcolor: "#EEF0FF", color: "primary.main" },
              }}
            >
              <Replay sx={{ fontSize: 16 }} />
              다시 도전
            </Box>
          </Box>
        </Box>
      </Box>
      <InterviewReport />
    </Box>
  );
}
