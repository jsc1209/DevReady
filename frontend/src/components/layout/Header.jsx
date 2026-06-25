import { useNavigate, useLocation } from "react-router-dom";
import { Box, Stack, Button, Chip, Typography } from "@mui/material";
import useAuthStore from "../../store/authStore";

/**
 * 공통 네비 헤더 (핵심 뼈대 — 드롭다운/알림/찜/프로필/모바일햄버거 제외).
 * 로그인 상태는 zustand authStore(token/user) 구독으로 판별.
 */
const NAV = [
  { label: "교육", path: "/education" },
  { label: "공고", path: "/jobs" },
  { label: "캘린더", path: "/calendar" },
  { label: "이력서", path: "/resume" },
  { label: "모의 면접", path: "/interview", badge: "유료" },
  { label: "커뮤니티", path: "/community" },
];

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: (t) => t.zIndex.appBar,
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          maxWidth: 1280,
          mx: "auto",
          px: 2,
          height: 64,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        {/* 로고 → / */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          onClick={() => navigate("/")}
          sx={{ cursor: "pointer", flexShrink: 0, userSelect: "none" }}
        >
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography sx={{ color: "#fff", fontWeight: 900, fontSize: 13, letterSpacing: "-0.05em" }}>
              DR
            </Typography>
          </Box>
          <Typography sx={{ fontWeight: 700, fontSize: 18 }}>DevReady</Typography>
        </Stack>

        {/* 중앙 메뉴 (md 이상에서만 노출) */}
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", flex: 1 }}
        >
          {NAV.map(({ label, path, badge }) => {
            const active = isActive(path);
            return (
              <Button
                key={path}
                onClick={() => navigate(path)}
                sx={{
                  color: active ? "primary.main" : "text.secondary",
                  fontWeight: active ? 600 : 400,
                  "&:hover": { color: "primary.main", bgcolor: "action.hover" },
                }}
              >
                {label}
                {badge && (
                  <Chip
                    label={badge}
                    size="small"
                    color="primary"
                    sx={{ ml: 0.75, height: 18, fontSize: 11 }}
                  />
                )}
              </Button>
            );
          })}
        </Stack>

        {/* 우측 로그인 영역 */}
        <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: "auto", flexShrink: 0 }}>
          {token ? (
            <>
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {user?.nickname ?? "사용자"}님
              </Typography>
              <Button
                size="small"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button size="small" sx={{ color: "text.secondary" }} onClick={() => navigate("/login")}>
                로그인
              </Button>
              <Button size="small" variant="contained" color="primary" onClick={() => navigate("/signup")}>
                무료 시작
              </Button>
            </>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
