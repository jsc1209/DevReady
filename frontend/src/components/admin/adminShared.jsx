import { Box, Typography, Stack } from "@mui/material";
import { CheckCircle, Cancel, Star } from "@mui/icons-material";

/**
 * AdminPage 공유 부품 — test-demo-UI/AdminPage.tsx 의 Toast/StatusBadge/Modal/StarRating
 * + inputSx/csvDownload 유틸을 한 모듈로 분리(여러 섹션이 import).
 */

const mono = "'DM Mono', monospace";

// ─── Toast (우상단 성공 알림) ───
export function Toast({ msg }) {
  if (!msg) return null;
  return (
    <Box
      sx={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 1300,
        bgcolor: "#fff",
        border: "1px solid #BBF7D0", // green-200
        borderRadius: "12px",
        boxShadow: 6,
        px: 2,
        py: 1.5,
        display: "flex",
        alignItems: "center",
        gap: 1,
        fontSize: 14,
        color: "#15803D", // green-700
      }}
    >
      <CheckCircle sx={{ fontSize: 16 }} />
      {msg}
    </Box>
  );
}

// ─── StatusBadge (상태 칩) ───
const STATUS_SX = {
  활성: { bgcolor: "#DCFCE7", color: "#15803D" },
  정지: { bgcolor: "#FEF3C7", color: "#B45309" },
  탈퇴: { bgcolor: "#F3F4F6", color: "#6B7280" },
  승인: { bgcolor: "#DCFCE7", color: "#15803D" },
  대기: { bgcolor: "#FEF9C3", color: "#A16207" },
  반려: { bgcolor: "#FEE2E2", color: "#DC2626" },
  비활성: { bgcolor: "#F3F4F6", color: "#6B7280" },
  삭제: { bgcolor: "#FEE2E2", color: "#DC2626" },
  접수: { bgcolor: "#DBEAFE", color: "#1D4ED8" },
  경고처리: { bgcolor: "#FEF3C7", color: "#B45309" },
  삭제처리: { bgcolor: "#FEE2E2", color: "#DC2626" },
};

export function StatusBadge({ status }) {
  const c = STATUS_SX[status] ?? { bgcolor: "#F3F4F6", color: "#4B5563" };
  return (
    <Box
      component="span"
      sx={{
        px: 1,
        py: 0.5,
        borderRadius: "999px",
        fontSize: 12,
        fontWeight: 500,
        ...c,
      }}
    >
      {status}
    </Box>
  );
}

// ─── Modal (가운데 오버레이) ───
export function Modal({ title, onClose, children }) {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        zIndex: 1200,
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
          border: "1px solid #E5E7EB",
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
            borderBottom: "1px solid #F3F4F6",
          }}
        >
          <Typography sx={{ fontWeight: 600, color: "#111827" }}>{title}</Typography>
          <Box
            component="button"
            type="button"
            onClick={onClose}
            sx={{
              p: 0.5,
              borderRadius: "8px",
              border: "none",
              bgcolor: "transparent",
              cursor: "pointer",
              display: "flex",
              "&:hover": { bgcolor: "#F3F4F6" },
            }}
          >
            <Cancel sx={{ fontSize: 16, color: "#9CA3AF" }} />
          </Box>
        </Box>
        <Box sx={{ p: 3, maxHeight: "70vh", overflowY: "auto" }}>{children}</Box>
      </Box>
    </Box>
  );
}

// ─── StarRating (만족도 별점) ───
export function StarRating({ score }) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          sx={{
            fontSize: 16,
            color: i <= Math.round(score) ? "#FACC15" : "#E5E7EB",
          }}
        />
      ))}
      <Typography sx={{ fontSize: 12, color: "text.secondary", ml: 0.5, fontFamily: mono }}>
        {score}
      </Typography>
    </Stack>
  );
}

// inputSx(공유 입력 스타일) · csvDownload 유틸은 components/admin/adminUtils.js 에 분리
// (fast-refresh: 컴포넌트 파일은 컴포넌트만 export).
