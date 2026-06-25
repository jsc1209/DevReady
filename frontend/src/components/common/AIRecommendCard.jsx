import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  MenuItem,
  Chip,
  Stack,
} from "@mui/material";
import { AutoAwesome, ChevronRight, Tune, Speed } from "@mui/icons-material";

// 회원가입/온보딩에서 받은 "기본 베이스 정보" 선택지 (mock)
const ROLES = ["프론트엔드", "백엔드", "풀스택", "AI/ML", "DevOps", "데이터"];
const PURPOSES = ["실무 역량 강화", "취업 준비", "이직 준비", "기초 다지기"];
const CAREERS = ["신입 (0~1년)", "주니어 (1~3년)", "미들 (3~5년)", "시니어 (5년+)"];
const LANGUAGES = ["JavaScript", "TypeScript", "React"];

// 레벨 테스트 결과 (mock)
const LEVEL_TEST = { label: "중급", score: 68 };

// variant 별 추천 콘텐츠 (이 카드 전용 mock → 인라인 유지)
const RECO = {
  education: {
    title: "맞춤 학습 경로",
    desc: "레벨 테스트 결과와 기본 정보를 기준으로 추천된 강의예요.",
    items: ["React 성능 최적화 심화", "TypeScript 타입 시스템", "프론트엔드 CS 면접 대비"],
    cta: "추천 강의 보기",
    href: "/education",
  },
  jobs: {
    title: "맞춤 공고 추천",
    desc: "희망 직군·경력·사용 언어에 맞는 공고를 우선 보여드려요.",
    items: ["카카오 프론트엔드 (신입)", "토스 React 개발자", "당근 웹 프론트엔드"],
    cta: "추천 공고 보기",
    href: "/jobs",
  },
  interview: {
    title: "맞춤 모의면접",
    desc: "레벨과 직군에 맞춘 난이도로 예상 질문을 구성했어요.",
    items: ["프론트엔드 기술면접 (중급)", "React 심화 질문", "CS 기초 면접"],
    cta: "모의면접 시작",
    href: "/interview/setup",
  },
};

// 라벨 + MUI select 필드 (원본 네이티브 <select> 대체)
function Field({ label, value, options, onChange }) {
  return (
    <TextField
      select
      size="small"
      fullWidth
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <MenuItem key={o} value={o}>
          {o}
        </MenuItem>
      ))}
    </TextField>
  );
}

/**
 * AI 맞춤 추천 카드 (test-demo-UI/AIRecommendCard.tsx → JS+MUI).
 * 교육·공고·면접 3개 화면이 variant 로 구분해 공유하는 재사용 컴포넌트.
 * props: variant = "education" | "jobs" | "interview"
 */
export function AIRecommendCard({ variant }) {
  const navigate = useNavigate();
  const [role, setRole] = useState(ROLES[0]);
  const [purpose, setPurpose] = useState(PURPOSES[0]);
  const [career, setCareer] = useState(CAREERS[0]);
  const r = RECO[variant];

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: "16px",
        border: "1px solid rgba(108,99,255,0.2)",
        p: 2.5,
        mb: 4,
        background:
          "linear-gradient(135deg, rgba(108,99,255,0.06), rgba(139,92,246,0.08))",
      }}
    >
      {/* 헤더 */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          mb: 2,
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <AutoAwesome sx={{ fontSize: 20, color: "primary.main" }} />
          <Typography sx={{ fontWeight: 700, color: "text.primary" }}>
            AI 맞춤 추천
          </Typography>
          <Chip
            size="small"
            icon={<Speed sx={{ fontSize: 14 }} />}
            label={`레벨테스트 ${LEVEL_TEST.label} · ${LEVEL_TEST.score}점`}
            sx={{
              height: 22,
              fontSize: 12,
              fontWeight: 500,
              color: "primary.main",
              bgcolor: "rgba(108,99,255,0.1)",
              "& .MuiChip-icon": { color: "primary.main" },
            }}
          />
        </Stack>
        <Button
          onClick={() => navigate("/resume")}
          startIcon={<Tune sx={{ fontSize: 14 }} />}
          sx={{
            color: "text.secondary",
            fontSize: 12,
            minWidth: 0,
            p: 0.5,
            "&:hover": { color: "primary.main", bgcolor: "transparent" },
          }}
        >
          이력서 작성하기
        </Button>
      </Box>

      {/* 기본 베이스 정보 4가지 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
          gap: 1.5,
          mb: 2,
        }}
      >
        <Field label="희망 직군" value={role} options={ROLES} onChange={setRole} />
        <Field label="교육 목적" value={purpose} options={PURPOSES} onChange={setPurpose} />
        <Field label="경력" value={career} options={CAREERS} onChange={setCareer} />
        <Box>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", display: "block", mb: 0.5 }}
          >
            사용 가능 언어
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {LANGUAGES.map((l) => (
              <Chip
                key={l}
                label={l}
                size="small"
                variant="outlined"
                sx={{
                  height: 22,
                  fontSize: 11,
                  color: "primary.main",
                  borderColor: "rgba(108,99,255,0.2)",
                  bgcolor: "background.paper",
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* 추천 결과 */}
      <Box
        sx={{
          borderRadius: "12px",
          bgcolor: "background.paper",
          border: "1px solid rgba(108,99,255,0.1)",
          p: 2,
        }}
      >
        <Typography sx={{ fontWeight: 600, color: "text.primary", mb: 0.5 }}>
          {r.title}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "text.secondary", display: "block", mb: 1.5 }}
        >
          {r.desc}
        </Typography>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 1.5 }}>
          {r.items.map((it) => (
            <Box
              key={it}
              sx={{
                fontSize: 12,
                color: "text.primary",
                bgcolor: "rgba(108,99,255,0.05)",
                border: "1px solid rgba(108,99,255,0.15)",
                borderRadius: "8px",
                px: 1.25,
                py: 0.5,
              }}
            >
              {it}
            </Box>
          ))}
        </Box>
        <Button
          onClick={() => navigate(r.href)}
          endIcon={<ChevronRight sx={{ fontSize: 16 }} />}
          sx={{
            color: "primary.main",
            fontSize: 14,
            fontWeight: 500,
            minWidth: 0,
            p: 0,
            "&:hover": { color: "primary.dark", bgcolor: "transparent" },
          }}
        >
          {r.cta}
        </Button>
      </Box>
    </Paper>
  );
}

export default AIRecommendCard;
