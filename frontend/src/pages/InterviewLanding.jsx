import { useNavigate } from "react-router-dom";
import { Box, Typography, Button, Stack, Paper } from "@mui/material";
import {
  Bolt,
  PlayArrow,
  ChevronRight,
  CheckCircle,
  Star,
  EmojiEvents,
} from "@mui/icons-material";
import { AIRecommendCard } from "../components/common/AIRecommendCard";
import {
  STATS,
  STEPS,
  FEATURES,
  PLANS,
  REVIEWS,
} from "../data/interviewLandingMock";

// 원본 ../auth 의 실행 가드(프로토타입 localStorage 플래그)를 그대로 복제.
// 페이지 열람은 자유, "요금제 선택" 같은 실행 동작만 가드한다.
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

// 섹션 공통 제목/부제
function SectionHeading({ title, subtitle }) {
  return (
    <Box sx={{ textAlign: "center", mb: 7 }}>
      <Typography
        variant="h2"
        sx={{ fontSize: 30, fontWeight: 700, color: "text.primary", mb: 1.5 }}
      >
        {title}
      </Typography>
      <Typography sx={{ color: "text.secondary" }}>{subtitle}</Typography>
    </Box>
  );
}

/**
 * 면접 시작 랜딩 (/interview) — test-demo-UI/InterviewLanding.tsx → JS+MUI.
 * 공통 레이아웃(헤더/띠)은 App.jsx 의 Layout 이 감싸므로 본문 섹션만 렌더.
 * AI 추천 카드는 공용 부품 common/AIRecommendCard 를 variant="interview" 로 사용.
 */
export default function InterviewLanding() {
  const navigate = useNavigate();

  // 비로그인 → /auth, 이력서 미완 → /resume, 둘 다 충족 → 결제 (경로는 원본 유지)
  const handleSelectPlan = (planId) => {
    if (!isAuthed()) {
      navigate("/auth");
      return;
    }
    if (!isResumeComplete()) {
      navigate("/resume");
      return;
    }
    navigate("/interview/payment", { state: { planId } });
  };

  return (
    <Box sx={{ bgcolor: "background.paper" }}>
      {/* Hero */}
      <Box
        component="section"
        sx={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(to bottom right, #EEF2FF, #FFFFFF, #FAF5FF)",
          pt: 10,
          pb: 12,
          px: 2,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            opacity: 0.3,
            backgroundImage:
              "radial-gradient(circle at 20% 30%, #6C63FF22 0%, transparent 50%), radial-gradient(circle at 80% 70%, #8B5CF622 0%, transparent 50%)",
          }}
        />
        <Box
          sx={{
            position: "relative",
            maxWidth: 900,
            mx: "auto",
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "rgba(108,99,255,0.1)",
              color: "primary.main",
              borderRadius: "999px",
              px: 2,
              py: 0.75,
              fontSize: 14,
              fontWeight: 500,
              mb: 3,
            }}
          >
            <Bolt sx={{ fontSize: 14 }} />
            AI 기반 모의 면접 서비스
          </Box>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: 36, sm: 48, lg: 60 },
              fontWeight: 700,
              color: "text.primary",
              mb: 3,
              lineHeight: 1.2,
            }}
          >
            실전처럼 연습하고
            <br />
            <Box component="span" sx={{ color: "primary.main" }}>
              합격을 앞당기세요
            </Box>
          </Typography>
          <Typography
            sx={{
              fontSize: 18,
              color: "text.secondary",
              mb: 5,
              maxWidth: 640,
              mx: "auto",
              lineHeight: 1.7,
            }}
          >
            AI 면접관이 내 이력서와 지원 공고를 분석해 맞춤 질문을 제시합니다. 실시간
            피드백과 상세 리포트로 빠르게 성장하세요.
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1.5}
            justifyContent="center"
          >
            <Button
              onClick={() => handleSelectPlan("standard")}
              variant="contained"
              size="large"
              startIcon={<PlayArrow />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                boxShadow: "0 10px 15px -3px rgba(108,99,255,0.25)",
              }}
            >
              지금 시작하기
            </Button>
            <Button
              onClick={() =>
                document
                  .getElementById("plans")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              variant="outlined"
              size="large"
              endIcon={<ChevronRight />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: "12px",
                borderWidth: 2,
                borderColor: "divider",
                color: "text.primary",
                "&:hover": {
                  borderWidth: 2,
                  borderColor: "primary.main",
                  color: "primary.main",
                },
              }}
            >
              요금제 보기
            </Button>
          </Stack>

          {/* Stats */}
          <Box
            sx={{
              mt: 8,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 3,
              maxWidth: 512,
              mx: "auto",
            }}
          >
            {STATS.map((s) => (
              <Box key={s.label} sx={{ textAlign: "center" }}>
                <Typography
                  sx={{ fontSize: 24, fontWeight: 700, color: "text.primary" }}
                >
                  {s.value}
                </Typography>
                <Typography
                  sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}
                >
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* AI 추천 카드 (공용 부품) */}
      <Box
        component="section"
        sx={{ px: 2, mt: -6, position: "relative", zIndex: 10 }}
      >
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
          <AIRecommendCard variant="interview" />
        </Box>
      </Box>

      {/* How it works */}
      <Box component="section" sx={{ py: 10, px: 2, bgcolor: "background.paper" }}>
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
          <SectionHeading
            title="어떻게 진행되나요?"
            subtitle="간단한 3단계로 실전 면접을 경험하세요"
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 4,
            }}
          >
            {STEPS.map(({ step, icon: Icon, title, desc }) => (
              <Box key={step} sx={{ textAlign: "center" }}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: "16px",
                    bgcolor: "rgba(108,99,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                  }}
                >
                  <Icon sx={{ fontSize: 24, color: "primary.main" }} />
                </Box>
                <Typography
                  sx={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "primary.main",
                    mb: 1,
                  }}
                >
                  STEP {step}
                </Typography>
                <Typography
                  sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}
                >
                  {title}
                </Typography>
                <Typography
                  sx={{ fontSize: 14, color: "text.secondary", lineHeight: 1.7 }}
                >
                  {desc}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Features */}
      <Box
        component="section"
        sx={{ py: 10, px: 2, bgcolor: "background.default" }}
      >
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
          <SectionHeading
            title="주요 기능"
            subtitle="DevReady만의 차별화된 기능을 경험하세요"
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 3,
            }}
          >
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <Paper
                key={title}
                elevation={0}
                sx={{
                  borderRadius: "16px",
                  p: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "box-shadow .2s",
                  "&:hover": { boxShadow: 3 },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: "12px",
                    bgcolor: "rgba(108,99,255,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mb: 2,
                  }}
                >
                  <Icon sx={{ fontSize: 20, color: "primary.main" }} />
                </Box>
                <Typography
                  sx={{ fontWeight: 600, color: "text.primary", mb: 1 }}
                >
                  {title}
                </Typography>
                <Typography
                  sx={{ fontSize: 14, color: "text.secondary", lineHeight: 1.7 }}
                >
                  {desc}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Plans */}
      <Box
        component="section"
        id="plans"
        sx={{ py: 10, px: 2, bgcolor: "background.paper" }}
      >
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
          <SectionHeading
            title="요금제 선택"
            subtitle="나에게 맞는 플랜으로 시작하세요"
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
              alignItems: "stretch",
            }}
          >
            {PLANS.map((plan) => (
              <Paper
                key={plan.id}
                elevation={0}
                sx={{
                  position: "relative",
                  borderRadius: "16px",
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  border: "2px solid",
                  borderColor: plan.highlight ? "primary.main" : "divider",
                  boxShadow: plan.highlight
                    ? "0 20px 25px -5px rgba(108,99,255,0.1)"
                    : "none",
                  "&:hover": plan.highlight ? {} : { boxShadow: 3 },
                }}
              >
                {plan.badge && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: -14,
                      left: "50%",
                      transform: "translateX(-50%)",
                      px: 2,
                      py: 0.5,
                      borderRadius: "999px",
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      fontSize: 12,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {plan.badge}
                  </Box>
                )}
                <Box sx={{ mb: 2 }}>
                  <Typography
                    sx={{ fontWeight: 700, color: "text.primary", mb: 0.5 }}
                  >
                    {plan.name}
                  </Typography>
                  <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                    {plan.desc}
                  </Typography>
                </Box>
                <Box sx={{ mb: 3 }}>
                  {plan.originalPrice && (
                    <Typography
                      sx={{
                        fontSize: 14,
                        color: "text.disabled",
                        textDecoration: "line-through",
                        mb: 0.25,
                      }}
                    >
                      ₩{plan.originalPrice}
                    </Typography>
                  )}
                  <Box sx={{ display: "flex", alignItems: "flex-end", gap: 0.5 }}>
                    <Typography
                      sx={{ fontSize: 30, fontWeight: 700, color: "text.primary" }}
                    >
                      ₩{plan.price}
                    </Typography>
                    <Typography
                      sx={{ fontSize: 14, color: "text.secondary", mb: 0.5 }}
                    >
                      / {plan.per}
                    </Typography>
                  </Box>
                </Box>
                <Stack
                  component="ul"
                  spacing={1.25}
                  sx={{ listStyle: "none", p: 0, m: 0, mb: 4, flex: 1 }}
                >
                  {plan.features.map((f) => (
                    <Box
                      component="li"
                      key={f}
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                        fontSize: 14,
                        color: "text.primary",
                      }}
                    >
                      <CheckCircle
                        sx={{
                          fontSize: 16,
                          mt: 0.25,
                          flexShrink: 0,
                          color: "primary.main",
                        }}
                      />
                      {f}
                    </Box>
                  ))}
                </Stack>
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  fullWidth
                  variant={plan.highlight ? "contained" : "outlined"}
                  sx={
                    plan.highlight
                      ? { py: 1.5, borderRadius: "12px" }
                      : {
                          py: 1.5,
                          borderRadius: "12px",
                          borderWidth: 2,
                          borderColor: "divider",
                          color: "text.primary",
                          "&:hover": {
                            borderWidth: 2,
                            borderColor: "primary.main",
                            color: "primary.main",
                          },
                        }
                  }
                >
                  선택하기
                </Button>
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Reviews */}
      <Box
        component="section"
        sx={{ py: 10, px: 2, bgcolor: "background.default" }}
      >
        <Box sx={{ maxWidth: 900, mx: "auto" }}>
          <SectionHeading
            title="합격자들의 후기"
            subtitle="DevReady와 함께 꿈의 기업에 합격했습니다"
          />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
            }}
          >
            {REVIEWS.map((r) => (
              <Paper
                key={r.name}
                elevation={0}
                sx={{
                  borderRadius: "16px",
                  p: 3,
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: 1,
                }}
              >
                <Box sx={{ display: "flex", gap: 0.25, mb: 1.5 }}>
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} sx={{ fontSize: 16, color: "#FACC15" }} />
                  ))}
                </Box>
                <Typography
                  sx={{
                    fontSize: 14,
                    color: "text.primary",
                    lineHeight: 1.7,
                    mb: 2,
                  }}
                >
                  "{r.text}"
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      bgcolor: "rgba(108,99,255,0.15)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "primary.main",
                    }}
                  >
                    {r.name[0]}
                  </Box>
                  <Box>
                    <Typography
                      sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}
                    >
                      {r.name}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "primary.main" }}>
                      {r.company}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            ))}
          </Box>
        </Box>
      </Box>

      {/* CTA */}
      <Box component="section" sx={{ py: 10, px: 2 }}>
        <Box
          sx={{
            maxWidth: 768,
            mx: "auto",
            borderRadius: "24px",
            p: 6,
            textAlign: "center",
            color: "#fff",
            background: "linear-gradient(135deg, #6C63FF 0%, #8B5CF6 100%)",
          }}
        >
          <EmojiEvents sx={{ fontSize: 48, mb: 2, opacity: 0.9 }} />
          <Typography variant="h2" sx={{ fontSize: 30, fontWeight: 700, mb: 1.5 }}>
            지금 바로 시작하세요
          </Typography>
          <Typography
            sx={{ color: "rgba(255,255,255,0.8)", mb: 4, fontSize: 16 }}
          >
            합격을 향한 첫 번째 모의 면접, 오늘부터 시작해보세요.
          </Typography>
          <Button
            onClick={() => handleSelectPlan("standard")}
            startIcon={<PlayArrow />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: "12px",
              bgcolor: "#fff",
              color: "primary.main",
              fontWeight: 600,
              "&:hover": { bgcolor: "#F9FAFB" },
            }}
          >
            모의 면접 시작하기
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
