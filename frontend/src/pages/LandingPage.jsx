import { useState } from "react";
import { Box } from "@mui/material";
import HeroSearch from "../components/landing/HeroSearch";
import RecommendedJobs from "../components/landing/RecommendedJobs";
import CenterFeed from "../components/landing/CenterFeed";
import RightSidebar from "../components/landing/RightSidebar";
import PartnerStrip from "../components/landing/PartnerStrip";
import DarkBanner from "../components/landing/DarkBanner";
import LandingFooter from "../components/landing/LandingFooter";

/**
 * 메인 랜딩 페이지 (test-demo-UI/LandingPage.tsx → JS+MUI 변환).
 *
 * 상태 배치:
 * - searchQuery, savedJobs 는 여기(페이지)에서 보유하고 직접 자식에 전달.
 * - 캘린더 상태(calView/selectedDate)는 MiniCalendar 가 독립적으로 보유
 *   (다른 섹션과 공유하지 않아 colocation 이 더 깔끔 — 원본 지시의 "MiniCalendar 독립"에 따름).
 */
export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [savedJobs, setSavedJobs] = useState(new Set([2]));

  function toggleSave(id) {
    setSavedJobs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <HeroSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <Box sx={{ maxWidth: 1280, mx: "auto", px: 2, py: 3 }}>
        <Box sx={{ display: "flex", gap: 2.5, alignItems: "flex-start" }}>
          {/* LEFT: 추천 공고 + 바로가기 (lg 이상) */}
          <Box sx={{ display: { xs: "none", lg: "block" }, width: 288, flexShrink: 0 }}>
            <RecommendedJobs savedJobs={savedJobs} toggleSave={toggleSave} />
          </Box>

          {/* CENTER: 메인 피드 */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <CenterFeed />
          </Box>

          {/* RIGHT: 사이드바 (xl 이상) */}
          <Box sx={{ display: { xs: "none", xl: "block" }, width: 224, flexShrink: 0 }}>
            <RightSidebar />
          </Box>
        </Box>

        <Box sx={{ mt: 3 }}>
          <PartnerStrip />
        </Box>
        <Box sx={{ mt: 2 }}>
          <DarkBanner />
        </Box>
      </Box>

      <LandingFooter />
    </Box>
  );
}
