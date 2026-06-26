import { Routes, Route, Link, Navigate } from 'react-router-dom'
import { Box, Typography, Button, Stack } from '@mui/material'
import ResumeAnalyzePage from './pages/ResumeAnalyzePage'
import ResumePage from "./pages/ResumePage";
import SignupPage from "./pages/SignupPage";
import AuthPage from "./pages/AuthPage";
import MyPage from "./pages/MyPage";
import LandingPage from "./pages/LandingPage";
import HistoryPage from "./pages/HistoryPage";
import InterviewLanding from "./pages/InterviewLanding";
import JobsPage from "./pages/JobsPage";
import JobDetailPage from "./pages/JobDetailPage";
import EducationPage from "./pages/EducationPage";
import CodingTestPage from "./pages/CodingTestPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import CommunityPage from "./pages/CommunityPage";
import CalendarPage from "./pages/CalendarPage";
import MyPageFull from "./pages/MyPageFull";
import InterviewSetup from "./pages/InterviewSetup";
import InterviewPayment from "./pages/InterviewPayment";
import InterviewReport from "./pages/InterviewReport";
import InterviewSession from "./pages/InterviewSession";
import SessionDetail from "./pages/SessionDetail";
import AdminPage from "./pages/AdminPage";
import Layout from "./components/layout/Layout";
import RequireResume from "./components/RequireResume";

const Home = () => (
  <Box sx={{ p: 4 }}>
    <Typography variant="h4" gutterBottom>DevReady 데모</Typography>
    <Typography color="text.secondary" sx={{ mb: 3 }}>
      AI 서버 연동 데모 — 기능을 하나씩 추가하는 중
    </Typography>
    <Stack direction="row" spacing={2}>
      <Button component={Link} to="/resume/analyze" variant="contained">이력서 분석</Button>
    </Stack>
  </Box>
)

const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/demo" element={<Home />} />
      <Route path="/resume" element={<ResumePage />} />
      <Route path="/resume/analyze" element={<ResumeAnalyzePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/me" element={<MyPage />} />
      <Route path="/history" element={<HistoryPage />} />
      <Route path="/history/:id" element={<SessionDetail />} />
      {/* 모의면접 — 진입 자체를 이력서 게이트로 차단(메뉴 클릭·URL 직접입력 모두) */}
      <Route path="/interview" element={<RequireResume><InterviewLanding /></RequireResume>} />
      <Route path="/interview/setup" element={<RequireResume><InterviewSetup /></RequireResume>} />
      <Route path="/interview/payment" element={<RequireResume><InterviewPayment /></RequireResume>} />
      <Route path="/interview/report/:id" element={<RequireResume><InterviewReport /></RequireResume>} />
      {/* 공고 — 진입 게이트 */}
      <Route path="/jobs" element={<RequireResume><JobsPage /></RequireResume>} />
      <Route path="/jobs/:id" element={<RequireResume><JobDetailPage /></RequireResume>} />
      {/* 교육 — 진입 게이트 */}
      <Route path="/education" element={<RequireResume><EducationPage /></RequireResume>} />
      <Route path="/education/coding-test" element={<RequireResume><CodingTestPage /></RequireResume>} />
      <Route path="/education/course/:id" element={<RequireResume><CourseDetailPage /></RequireResume>} />
      <Route path="/community" element={<CommunityPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/mypage" element={<MyPageFull />} />
    </Route>
    {/* 면접 진행은 헤더/띠 없는 풀스크린 몰입형 (원본 Root: /interview/session 는 Layout 제외) */}
    {/* Layout 밖이지만 동일하게 진입 게이트 적용(URL 직접입력 차단) */}
    <Route path="/interview/session" element={<RequireResume><InterviewSession /></RequireResume>} />
    {/* 관리자 페이지도 자체 사이드바 풀스크린 (원본 Root: /admin 는 Layout 제외) */}
    <Route path="/admin" element={<AdminPage />} />
  </Routes>
)

export default App
