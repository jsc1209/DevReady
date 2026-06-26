import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import {
  Dashboard,
  People,
  Work,
  WarningAmber,
  MenuBook,
  SmartToy,
  Notifications,
  Send,
  Star,
  Shield,
  ArrowBack,
} from "@mui/icons-material";
import DashboardSection from "../components/admin/DashboardSection";
import UsersSection from "../components/admin/UsersSection";
import JobsSection from "../components/admin/JobsSection";
import ReportsSection from "../components/admin/ReportsSection";
import AlgorithmsSection from "../components/admin/AlgorithmsSection";
import ChatbotSection from "../components/admin/ChatbotSection";
import NoticesSection from "../components/admin/NoticesSection";
import NotificationsSection from "../components/admin/NotificationsSection";
import SatisfactionSection from "../components/admin/SatisfactionSection";
import AdminAuthSection from "../components/admin/AdminAuthSection";

// 원본 MENU_ITEMS (아이콘 ref 보유 → 셸에 둠). isHeader 는 섹션 그룹 라벨.
const MENU_ITEMS = [
  { id: "dashboard", label: "대시보드", icon: Dashboard },
  { id: "domain-header", label: "DOMAIN", isHeader: true },
  { id: "users", label: "회원 관리", icon: People },
  { id: "jobs", label: "공고 관리", icon: Work },
  { id: "reports", label: "자유게시판 관리", icon: WarningAmber },
  { id: "content-header", label: "CONTENT", isHeader: true },
  { id: "algorithms", label: "알고리즘 관리", icon: MenuBook },
  { id: "chatbot", label: "챗봇 관리", icon: SmartToy },
  { id: "notices", label: "공지사항·FAQ", icon: Notifications },
  { id: "system-header", label: "SYSTEM", isHeader: true },
  { id: "notifications", label: "알림 관리", icon: Send },
  { id: "satisfaction", label: "만족도 관리", icon: Star },
  { id: "admin-auth", label: "관리자 권한", icon: Shield },
];

/**
 * 관리자 페이지 (/admin) — test-demo-UI/AdminPage.tsx → JS+MUI.
 * 원본 Root 가 /admin 을 헤더/네비 없이 풀스크린으로 렌더하므로 App.jsx 에서 Layout 밖 라우트.
 * 자체 다크 사이드바(섹션 전환) + 섹션별 컴포넌트는 components/admin/ 로 분할.
 */
export default function AdminPage() {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState("dashboard");

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F9FAFB" }}>
      {/* Sidebar */}
      <Box
        component="aside"
        sx={{
          width: 256,
          bgcolor: "#1E293B",
          color: "#fff",
          flexShrink: 0,
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <Box sx={{ p: 3, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <Box
            component="button"
            type="button"
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              mb: 2,
              width: "100%",
              border: "none",
              bgcolor: "transparent",
              cursor: "pointer",
              color: "inherit",
              transition: "opacity .2s",
              "&:hover": { opacity: 0.8 },
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "8px",
                bgcolor: "#6C63FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box sx={{ color: "#fff", fontWeight: 900, letterSpacing: "-0.05em", fontSize: 16 }}>
                DR
              </Box>
            </Box>
            <Box sx={{ textAlign: "left" }}>
              <Box sx={{ fontWeight: 700, color: "#fff" }}>관리자</Box>
              <Box sx={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>DevReady</Box>
            </Box>
          </Box>
          <Box
            component="button"
            type="button"
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 1,
              borderRadius: "8px",
              fontSize: 14,
              color: "rgba(255,255,255,0.7)",
              width: "100%",
              border: "none",
              bgcolor: "transparent",
              cursor: "pointer",
              transition: "background-color .2s, color .2s",
              "&:hover": { bgcolor: "rgba(255,255,255,0.05)", color: "#fff" },
            }}
          >
            <ArrowBack sx={{ fontSize: 16 }} />
            홈으로 돌아가기
          </Box>
        </Box>

        <Box component="nav" sx={{ p: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
            {MENU_ITEMS.map((item) => {
              if (item.isHeader) {
                return (
                  <Box key={item.id} sx={{ pt: 2.5, pb: 0.75, px: 1.5 }}>
                    <Box
                      sx={{
                        fontSize: 10,
                        color: "rgba(255,255,255,0.3)",
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        fontWeight: 600,
                      }}
                    >
                      {item.label}
                    </Box>
                  </Box>
                );
              }
              const Icon = item.icon;
              const isActive = activeMenu === item.id;
              return (
                <Box
                  key={item.id}
                  component="button"
                  type="button"
                  onClick={() => setActiveMenu(item.id)}
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    px: 1.5,
                    py: 1.25,
                    borderRadius: "8px",
                    fontSize: 14,
                    border: "none",
                    font: "inherit",
                    cursor: "pointer",
                    transition: "background-color .2s, color .2s",
                    ...(isActive
                      ? { bgcolor: "#6C63FF", color: "#fff" }
                      : {
                          bgcolor: "transparent",
                          color: "rgba(255,255,255,0.7)",
                          "&:hover": { bgcolor: "rgba(255,255,255,0.05)", color: "#fff" },
                        }),
                  }}
                >
                  <Icon sx={{ fontSize: 16 }} />
                  {item.label}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box component="main" sx={{ flex: 1, overflow: "auto" }}>
        <Box sx={{ maxWidth: 1280, mx: "auto", p: 4 }}>
          {activeMenu === "dashboard" && <DashboardSection />}
          {activeMenu === "users" && <UsersSection />}
          {activeMenu === "jobs" && <JobsSection />}
          {activeMenu === "reports" && <ReportsSection />}
          {activeMenu === "algorithms" && <AlgorithmsSection />}
          {activeMenu === "chatbot" && <ChatbotSection />}
          {activeMenu === "notices" && <NoticesSection />}
          {activeMenu === "notifications" && <NotificationsSection />}
          {activeMenu === "satisfaction" && <SatisfactionSection />}
          {activeMenu === "admin-auth" && <AdminAuthSection />}
        </Box>
      </Box>
    </Box>
  );
}
