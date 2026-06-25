import { Box, Paper, Stack, Typography, Button } from "@mui/material";
import {
  Bolt,
  ArrowForward,
  ChevronRight,
  FavoriteBorder,
  MenuBook,
  Description,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { COMMUNITY_POSTS, TAG_COLORS } from "../../data/landingMock";
import MiniCalendar from "./MiniCalendar";
import AdBanner from "./AdBanner";

export default function CenterFeed() {
  const navigate = useNavigate();

  return (
    <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
      {/* AI 모의면접 프로모 배너 */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #6C63FF 0%, #8B5CF6 100%)",
          color: "#fff",
          borderRadius: 3,
          p: 2.5,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          aria-hidden
          sx={{
            position: "absolute",
            right: 16,
            top: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            opacity: 0.1,
            pointerEvents: "none",
          }}
        >
          <Box
            component="span"
            sx={{
              color: "#fff",
              fontWeight: 900,
              letterSpacing: "-0.05em",
              lineHeight: 1,
              fontSize: 130,
            }}
          >
            DR
          </Box>
        </Box>

        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 0.75,
              bgcolor: "rgba(255,255,255,0.2)",
              color: "#fff",
              fontSize: 12,
              px: 1.25,
              py: 0.5,
              borderRadius: 999,
              mb: 1,
            }}
          >
            <Bolt sx={{ fontSize: 14 }} />
            AI 기반 모의면접
          </Box>
          <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 0.5 }}>
            실전처럼 연습하고, 합격을 앞당기세요
          </Typography>
          <Typography sx={{ fontSize: 14, color: "rgba(255,255,255,0.8)", mb: 1.5 }}>
            이력서 기반 맞춤 질문 · 실시간 AI 피드백 · 상세 리포트 제공
          </Typography>
          <Button
            onClick={() => navigate("/interview")}
            endIcon={<ArrowForward sx={{ fontSize: 14 }} />}
            sx={{
              bgcolor: "#fff",
              color: "primary.main",
              fontSize: 14,
              fontWeight: 600,
              textTransform: "none",
              px: 2,
              py: 1,
              borderRadius: 2,
              "&:hover": { bgcolor: "#f9fafb" },
            }}
          >
            모의면접 시작
          </Button>
        </Box>
      </Box>

      {/* 미니 캘린더 */}
      <MiniCalendar />

      {/* 인피드 광고 */}
      <AdBanner />

      {/* 커뮤니티 인기글 */}
      <Paper variant="outlined" sx={{ overflow: "hidden" }}>
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: 14, color: "text.primary" }}>
            커뮤니티 인기글
          </Typography>
          <Button
            onClick={() => navigate("/community")}
            endIcon={<ChevronRight sx={{ fontSize: 12 }} />}
            sx={{
              fontSize: 12,
              color: "text.secondary",
              textTransform: "none",
              minWidth: 0,
              p: 0,
              "&:hover": { color: "primary.main", bgcolor: "transparent" },
            }}
          >
            더보기
          </Button>
        </Box>
        <Box>
          {COMMUNITY_POSTS.map((post) => (
            <Box
              key={post.id}
              onClick={() => navigate("/community")}
              sx={{
                px: 2,
                py: 1.5,
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                cursor: "pointer",
                borderTop: "1px solid",
                borderColor: "grey.50",
                "&:first-of-type": { borderTop: "none" },
                "&:hover": { bgcolor: "grey.50" },
              }}
            >
              <Box
                component="span"
                sx={{
                  fontSize: 12,
                  fontWeight: 500,
                  px: 1,
                  py: 0.25,
                  borderRadius: 1,
                  flexShrink: 0,
                  bgcolor: TAG_COLORS[post.tag] + "15",
                  color: TAG_COLORS[post.tag],
                }}
              >
                {post.tag}
              </Box>
              <Typography
                variant="body2"
                sx={{
                  flex: 1,
                  color: "text.primary",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {post.title}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  fontSize: 12,
                  color: "text.secondary",
                  flexShrink: 0,
                }}
              >
                <FavoriteBorder sx={{ fontSize: 12 }} />
                {post.likes}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  color: "text.secondary",
                  flexShrink: 0,
                  display: { xs: "none", sm: "block" },
                }}
              >
                {post.time}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* 교육 / 이력서 빠른 CTA */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 2,
        }}
      >
        <Box
          onClick={() => navigate("/education")}
          sx={{
            borderRadius: 3,
            p: 2,
            cursor: "pointer",
            background: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
            transition: "opacity 0.2s",
            "&:hover": { opacity: 0.95 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: "#E0E7FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MenuBook sx={{ fontSize: 16, color: "#4F46E5" }} />
            </Box>
            <Typography sx={{ fontWeight: 600, fontSize: 14, color: "text.primary" }}>
              무료 강의
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 1.5 }}>
            CS 기초부터 React 심화까지
            <br />
            무료로 학습하세요
          </Typography>
          <Box
            component="span"
            sx={{
              fontSize: 12,
              fontWeight: 500,
              color: "#4F46E5",
              display: "flex",
              alignItems: "center",
              gap: 0.25,
            }}
          >
            강의 보러가기 <ChevronRight sx={{ fontSize: 12 }} />
          </Box>
        </Box>

        <Box
          onClick={() => navigate("/resume")}
          sx={{
            borderRadius: 3,
            p: 2,
            cursor: "pointer",
            background: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)",
            transition: "opacity 0.2s",
            "&:hover": { opacity: 0.95 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: "#D1FAE5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Description sx={{ fontSize: 16, color: "#059669" }} />
            </Box>
            <Typography sx={{ fontWeight: 600, fontSize: 14, color: "text.primary" }}>
              AI 이력서 작성
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 1.5 }}>
            AI가 내 경험을 분석해
            <br />
            매력적인 이력서를 완성해드려요
          </Typography>
          <Box
            component="span"
            sx={{
              fontSize: 12,
              fontWeight: 500,
              color: "#059669",
              display: "flex",
              alignItems: "center",
              gap: 0.25,
            }}
          >
            이력서 작성하기 <ChevronRight sx={{ fontSize: 12 }} />
          </Box>
        </Box>
      </Box>
    </Stack>
  );
}
