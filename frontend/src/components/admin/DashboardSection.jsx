import { Box, Paper, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";

// ─── Dashboard mock 데이터 (co-locate) ──────────────────────────────────────────

const mono = "'DM Mono', monospace";

const DASH_MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
const DASH_SIGNUP = [85, 102, 78, 134, 156, 198, 167, 145, 189, 210, 178, 230];
const DASH_ACTIVE = [420, 480, 510, 620, 720, 850, 780, 810, 920, 1050, 980, 1150];
const DASH_LINE_DATA = DASH_MONTHS.map((m, i) => ({ month: m, 신규가입: DASH_SIGNUP[i], 활성이용자: DASH_ACTIVE[i] }));

const DASH_JOB_DATA = [
  { name: "프론트엔드", 횟수: 2840, 평균점수: 76 },
  { name: "백엔드", 횟수: 2120, 평균점수: 74 },
  { name: "풀스택", 횟수: 1560, 평균점수: 78 },
  { name: "DevOps", 횟수: 680, 평균점수: 72 },
  { name: "AI/ML", 횟수: 420, 평균점수: 80 },
];

const DASH_REVENUE_DATA = [
  { plan: "무료", 건수: 890, 매출: 0 },
  { plan: "베이직", 건수: 284, 매출: 2811600 },
  { plan: "프로", 건수: 108, 매출: 2149200 },
];

const KPI_CARDS = [
  { label: "전체 회원", value: "1,284명", sub: "↑ 이번달 +128", color: "#6C63FF" },
  { label: "면접 횟수", value: "8,420회", sub: "이번달 +340", color: "#10B981" },
  { label: "등록 공고", value: "156건", sub: "진행중 42건", color: "#F59E0B" },
  { label: "이번달 매출", value: "24,180,000원", sub: "↑ 전월대비 +12%", color: "#EF4444" },
];

// 카드(rounded-2xl border border-border bg-card)
const cardSx = {
  borderRadius: "16px",
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "#fff",
};

const tooltipStyle = { background: "#FFF", border: "1px solid #E2E8F0", borderRadius: 8 };

// ─── DashboardSection ───────────────────────────────────────────────────────────

export default function DashboardSection() {
  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{ fontSize: 30, fontWeight: 700, color: "text.primary", mb: 1 }}
        >
          대시보드
        </Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
          DevReady 플랫폼 운영 현황을 한눈에 확인하세요
        </Typography>
      </Box>

      {/* KPI 카드 그리드 */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1,1fr)",
            md: "repeat(2,1fr)",
            lg: "repeat(4,1fr)",
          },
          gap: 2,
          mb: 4,
        }}
      >
        {KPI_CARDS.map((k, i) => (
          <Paper key={i} elevation={0} sx={{ ...cardSx, p: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 1.5,
              }}
            >
              <Typography sx={{ fontSize: 14, color: "text.secondary" }}>{k.label}</Typography>
              <Box sx={{ width: 12, height: 12, borderRadius: "999px", backgroundColor: k.color }} />
            </Box>
            <Typography
              sx={{ fontSize: 24, fontWeight: 700, color: "text.primary", mb: 0.5, fontFamily: mono }}
            >
              {k.value}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{k.sub}</Typography>
          </Paper>
        ))}
      </Box>

      {/* 차트 2열 (LineChart + BarChart) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(1,1fr)", lg: "repeat(2,1fr)" },
          gap: 3,
          mb: 3,
        }}
      >
        <Paper elevation={0} sx={{ ...cardSx, p: 3 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary", mb: 2.5 }}>
            월별 신규가입 / 활성이용자
          </Typography>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={DASH_LINE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="month" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              <Line type="monotone" dataKey="신규가입" stroke="#6C63FF" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="활성이용자" stroke="#10B981" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Paper>

        <Paper elevation={0} sx={{ ...cardSx, p: 3 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary", mb: 2.5 }}>
            직군별 면접 이용 (면접통계)
          </Typography>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={DASH_JOB_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="name" tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748B", fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="횟수" fill="#6C63FF" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* 구독별 매출 BarChart */}
      <Paper elevation={0} sx={{ ...cardSx, p: 3 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary", mb: 2.5 }}>
          구독별 매출
        </Typography>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={DASH_REVENUE_DATA}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
            <XAxis dataKey="plan" tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748B", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(v) => v.toLocaleString() + "원"} />
            <Bar dataKey="매출" fill="#F59E0B" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}
