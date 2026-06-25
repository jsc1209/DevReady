import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, IconButton } from "@mui/material";
import { AutoAwesome, ArrowForward, Close } from "@mui/icons-material";

/**
 * 상단 프로모 띠 (핵심 뼈대 — 프로모 1개, 닫기 가능).
 * 원본 test-demo-UI/AnnouncementBanner.tsx 의 배너 회전(2개)은 제외하고 6월 한정 1개만.
 */
export default function AnnouncementBanner() {
  const navigate = useNavigate();
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1.5,
        px: 2,
        py: 1,
        minHeight: 40,
        color: "#fff",
        background: "linear-gradient(to right, #6366F1, #8B5CF6)",
      }}
    >
      <AutoAwesome sx={{ fontSize: 16, opacity: 0.85, flexShrink: 0 }} />
      <Box
        component="span"
        sx={{
          flexShrink: 0,
          bgcolor: "rgba(255,255,255,0.2)",
          px: 1,
          py: 0.25,
          borderRadius: 5,
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        6월 한정
      </Box>
      <Typography
        variant="body2"
        sx={{ opacity: 0.95, display: { xs: "none", sm: "block" } }}
      >
        신규 가입 시 프리미엄 면접 세션 3회 무료 제공
      </Typography>
      <Button
        onClick={() => navigate("/auth")}
        endIcon={<ArrowForward sx={{ fontSize: 14 }} />}
        sx={{
          flexShrink: 0,
          color: "#fff",
          bgcolor: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: 5,
          px: 1.5,
          py: 0.25,
          fontSize: 12,
          "&:hover": { bgcolor: "rgba(255,255,255,0.25)" },
        }}
      >
        지금 시작하기
      </Button>
      <IconButton
        onClick={() => setDismissed(true)}
        aria-label="닫기"
        size="small"
        sx={{
          position: "absolute",
          right: 8,
          color: "#fff",
          "&:hover": { bgcolor: "rgba(255,255,255,0.2)" },
        }}
      >
        <Close sx={{ fontSize: 16 }} />
      </IconButton>
    </Box>
  );
}
