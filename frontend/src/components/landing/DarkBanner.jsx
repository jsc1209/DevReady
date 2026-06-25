import { Box, Stack, Typography, Button } from "@mui/material";
import { School } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function DarkBanner() {
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => navigate("/education")}
      sx={{
        mt: 2,
        borderRadius: 3,
        p: 2.5,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        gap: 2,
        cursor: "pointer",
        color: "#fff",
        background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 100%)",
        transition: "opacity 0.2s",
        "&:hover": { opacity: 0.95 },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.5}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 3,
            bgcolor: "rgba(255,255,255,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <School sx={{ fontSize: 24, color: "#fff" }} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: "1rem" }}>
            취업 역량 강화 무료 특강
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.7)",
              fontSize: "0.875rem",
              mt: 0.25,
            }}
          >
            코딩테스트 · CS · 면접 · 포트폴리오 완성 과정
          </Typography>
        </Box>
      </Stack>
      <Button
        variant="contained"
        sx={{
          ml: { sm: "auto" },
          flexShrink: 0,
          px: 2.5,
          py: 1.25,
          bgcolor: "#fff",
          color: "#312E81",
          fontWeight: 600,
          fontSize: "0.875rem",
          boxShadow: "none",
          "&:hover": { bgcolor: "grey.50", boxShadow: "none" },
        }}
      >
        강의 보러가기
      </Button>
    </Box>
  );
}
