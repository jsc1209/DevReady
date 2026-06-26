import { useState, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
import { StarRating } from "./adminShared";

const mono = "'DM Mono', monospace";

// ─── Satisfaction (A-010) mock 데이터 (co-locate) ───
const SURVEY_DATA = [
  { company: "카카오", date: "2026-06-08", avg_score: 4.5, comment: "AI 면접 기능이 매우 유용했습니다." },
  { company: "네이버", date: "2026-06-07", avg_score: 4.2, comment: "공고 등록 과정이 직관적이었습니다." },
  { company: "토스", date: "2026-06-05", avg_score: 4.8, comment: "지원자 관리 기능이 편리했습니다." },
  { company: "라인플러스", date: "2026-06-03", avg_score: 3.9, comment: "이력서 열람 기능 개선을 바랍니다." },
  { company: "쿠팡", date: "2026-05-31", avg_score: 4.1, comment: "전반적으로 만족스럽습니다." },
];

const SAT_TREND = [
  { month: "1월", avg: 3.8 },
  { month: "2월", avg: 4.0 },
  { month: "3월", avg: 4.1 },
  { month: "4월", avg: 4.0 },
  { month: "5월", avg: 4.2 },
  { month: "6월", avg: 4.3 },
];

// 테이블 셀 공통 sx
const thSx = {
  px: 2.5,
  py: 1.5,
  textAlign: "left",
  fontSize: 12,
  fontWeight: 500,
  color: "text.secondary",
};
const tdSx = {
  px: 2.5,
  py: 2,
  fontSize: 14,
};

export default function SatisfactionSection() {
  const [responses, setResponses] = useState([]);

  // 실제 서비스에선 서버 조회. 프로토타입이라 localStorage(devready_surveys) + mock 합산.
  useEffect(() => {
    let local = [];
    try {
      const raw = localStorage.getItem("devready_surveys");
      if (raw) local = JSON.parse(raw);
    } catch {
      local = [];
    }
    const mock = SURVEY_DATA.map((s) => ({
      date: s.date,
      overall: s.avg_score,
      quality: s.avg_score,
      usability: s.avg_score,
      recommend: s.avg_score,
      comment: s.comment,
    }));
    setResponses([...local].reverse().concat(mock)); // 새 응답(localStorage)이 위로
  }, []);

  const count = responses.length;
  const mean = (sel) => {
    if (!count) return 0;
    return +(responses.reduce((s, r) => s + sel(r), 0) / count).toFixed(1);
  };
  const avgOverall = mean((r) => r.overall);
  const avgRecommend = mean((r) => r.recommend);
  const radarData = [
    { subject: "전반", score: mean((r) => r.overall) },
    { subject: "질문품질", score: mean((r) => r.quality) },
    { subject: "UI편의성", score: mean((r) => r.usability) },
    { subject: "추천", score: mean((r) => r.recommend) },
  ];

  const kpis = [
    { label: "총 응답 수", value: `${count}건`, color: "#6C63FF" },
    { label: "평균 전반 만족도", value: `${avgOverall} / 5`, color: "#10B981" },
    { label: "평균 추천 의향", value: `${avgRecommend} / 5`, color: "#F59E0B" },
  ];

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{ fontSize: 30, fontWeight: 700, color: "text.primary", mb: 1 }}
        >
          만족도 관리
        </Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
          면접 이용자 만족도 설문 결과 및 분석
        </Typography>
      </Box>

      {/* KPI 카드 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(1,1fr)", sm: "repeat(3,1fr)" },
          gap: 2,
          mb: 3,
        }}
      >
        {kpis.map((k) => (
          <Paper
            key={k.label}
            elevation={0}
            sx={{
              borderRadius: "16px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "#fff",
              p: 2.5,
            }}
          >
            <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 0.5 }}>
              {k.label}
            </Typography>
            <Typography
              sx={{
                fontSize: 24,
                fontWeight: 700,
                color: k.color,
                fontFamily: mono,
              }}
            >
              {k.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* 차트 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(1,1fr)", lg: "repeat(2,1fr)" },
          gap: 3,
          mb: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "#fff",
            p: 3,
          }}
        >
          <Typography
            sx={{ fontWeight: 600, color: "text.primary", mb: 2.5 }}
          >
            항목별 평균 (레이더 차트)
          </Typography>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 11, fill: "#64748B" }}
              />
              <Radar
                dataKey="score"
                stroke="#6C63FF"
                fill="#6C63FF"
                fillOpacity={0.3}
              />
              <Tooltip
                contentStyle={{
                  background: "#FFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: 8,
                }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Paper>
        <Paper
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "#fff",
            p: 3,
          }}
        >
          <Typography
            sx={{ fontWeight: 600, color: "text.primary", mb: 2.5 }}
          >
            월별 평균 만족도 추이
          </Typography>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={SAT_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis
                dataKey="month"
                tick={{ fill: "#64748B", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[3, 5]}
                tick={{ fill: "#64748B", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: "#FFF",
                  border: "1px solid #E2E8F0",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="avg" fill="#F59E0B" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* 개별 응답 테이블 */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "#fff",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: 2.5,
            py: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "#F8F9FF",
          }}
        >
          <Typography
            component="span"
            sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}
          >
            개별 응답
          </Typography>
        </Box>
        <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
          <Box component="thead" sx={{ bgcolor: "#F8F9FF" }}>
            <Box component="tr">
              <Box component="th" sx={thSx}>
                날짜
              </Box>
              <Box component="th" sx={thSx}>
                전반 만족도
              </Box>
              <Box component="th" sx={thSx}>
                추천 의향
              </Box>
              <Box component="th" sx={thSx}>
                의견
              </Box>
            </Box>
          </Box>
          <Box component="tbody">
            {responses.map((r, i) => (
              <Box
                component="tr"
                key={i}
                sx={{
                  borderTop: "1px solid",
                  borderColor: "divider",
                  transition: "background-color .15s",
                  "&:hover": { bgcolor: "rgba(248,249,255,0.5)" },
                }}
              >
                <Box component="td" sx={{ ...tdSx, color: "text.secondary" }}>
                  {r.date}
                </Box>
                <Box component="td" sx={tdSx}>
                  <StarRating score={r.overall} />
                </Box>
                <Box
                  component="td"
                  sx={{ ...tdSx, color: "text.primary", fontFamily: mono }}
                >
                  {r.recommend} / 5
                </Box>
                <Box component="td" sx={{ ...tdSx, color: "text.secondary" }}>
                  {r.comment || "-"}
                </Box>
              </Box>
            ))}
            {responses.length === 0 && (
              <Box component="tr">
                <Box
                  component="td"
                  colSpan={4}
                  sx={{
                    px: 2.5,
                    py: 4,
                    textAlign: "center",
                    fontSize: 14,
                    color: "text.secondary",
                  }}
                >
                  아직 설문 응답이 없습니다.
                </Box>
              </Box>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
