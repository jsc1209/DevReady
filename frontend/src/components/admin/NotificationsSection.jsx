import { useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { Send, ToggleOn, ToggleOff } from "@mui/icons-material";
import { Toast } from "./adminShared";
import { inputSx } from "./adminUtils";

const mono = "'DM Mono', monospace";

// ─── Notifications (A-008) mock — co-locate ───
const INIT_SENT = [
  { id: 1, type: "공지", title: "시스템 점검 안내", target: "전체", sentAt: "2026-06-10 02:00", status: "발송완료" },
  { id: 2, type: "이벤트", title: "여름 할인 이벤트", target: "일반회원", sentAt: "2026-06-08 09:00", status: "발송완료" },
  { id: 3, type: "시스템", title: "비밀번호 변경 권고", target: "미변경 사용자", sentAt: "2026-06-07 12:00", status: "발송완료" },
  { id: 4, type: "공지", title: "약관 개정 안내", target: "전체", sentAt: "2026-06-05 10:00", status: "발송완료" },
];

const DEADLINE_ITEMS = [
  { key: "d3", label: "D-3 알림", last: "2026-06-09 09:00" },
  { key: "d1", label: "D-1 알림", last: "2026-06-09 09:00" },
  { key: "dday", label: "D-day 알림", last: "미설정" },
];

// 발송 이력 유형 칩 색 (원본 className 대응)
function typeChipSx(type) {
  if (type === "공지") return { bgcolor: "#DBEAFE", color: "#1D4ED8" }; // blue-100/700
  if (type === "이벤트") return { bgcolor: "#DCFCE7", color: "#15803D" }; // green-100/700
  return { bgcolor: "#F3F4F6", color: "#374151" }; // gray-100/700
}

const thSx = {
  px: 2.5,
  py: 1.5,
  textAlign: "left",
  fontSize: 12,
  fontWeight: 500,
  color: "text.secondary",
};

export default function NotificationsSection() {
  const [form, setForm] = useState({ target: "전체", type: "공지", title: "", content: "", schedule: "즉시" });
  const [sent, setSent] = useState(INIT_SENT);
  const [deadlineToggles, setDeadlineToggles] = useState({ d3: true, d1: true, dday: false });
  const [toast, setToast] = useState("");
  const showMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleSend = () => {
    if (!form.title.trim()) return;
    const newItem = {
      id: Date.now(),
      type: form.type,
      title: form.title,
      target: form.target,
      sentAt: new Date().toLocaleString("ko-KR"),
      status: "발송완료",
    };
    setSent((prev) => [newItem, ...prev]);
    setForm((f) => ({ ...f, title: "", content: "" }));
    showMsg("알림이 발송되었습니다.");
  };

  return (
    <Box>
      <Toast msg={toast} />
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 30, fontWeight: 700, color: "text.primary", mb: 1 }}>
          알림 관리
        </Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
          회원 대상 알림 발송 및 발송 이력 관리
        </Typography>
      </Box>

      {/* 알림 발송 */}
      <Box
        sx={{
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "#fff",
          p: 3,
          mb: 3,
        }}
      >
        <Typography
          component="h3"
          sx={{
            fontWeight: 600,
            color: "text.primary",
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Send sx={{ fontSize: 16, color: "primary.main" }} />
          알림 발송
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 1.5,
            mb: 1.5,
          }}
        >
          <Box>
            <Typography
              component="label"
              sx={{ display: "block", fontSize: 12, fontWeight: 500, color: "text.secondary", mb: 0.5 }}
            >
              대상
            </Typography>
            <Box
              component="select"
              value={form.target}
              onChange={(e) => setForm((f) => ({ ...f, target: e.target.value }))}
              sx={inputSx}
            >
              {["전체", "일반회원", "기업회원"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </Box>
          </Box>
          <Box>
            <Typography
              component="label"
              sx={{ display: "block", fontSize: 12, fontWeight: 500, color: "text.secondary", mb: 0.5 }}
            >
              유형
            </Typography>
            <Box
              component="select"
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              sx={inputSx}
            >
              {["공지", "이벤트", "시스템"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </Box>
          </Box>
          <Box>
            <Typography
              component="label"
              sx={{ display: "block", fontSize: 12, fontWeight: 500, color: "text.secondary", mb: 0.5 }}
            >
              발송시간
            </Typography>
            <Box
              component="select"
              value={form.schedule}
              onChange={(e) => setForm((f) => ({ ...f, schedule: e.target.value }))}
              sx={inputSx}
            >
              {["즉시", "예약"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </Box>
          </Box>
        </Box>
        <Box sx={{ mb: 1.5 }}>
          <Typography
            component="label"
            sx={{ display: "block", fontSize: 12, fontWeight: 500, color: "text.secondary", mb: 0.5 }}
          >
            제목
          </Typography>
          <Box
            component="input"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            placeholder="알림 제목..."
            sx={inputSx}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography
            component="label"
            sx={{ display: "block", fontSize: 12, fontWeight: 500, color: "text.secondary", mb: 0.5 }}
          >
            내용
          </Typography>
          <Box
            component="textarea"
            value={form.content}
            onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
            rows={4}
            placeholder="알림 내용..."
            sx={{ ...inputSx, resize: "vertical" }}
          />
        </Box>
        <Box
          component="button"
          type="button"
          onClick={handleSend}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2.5,
            py: 1.25,
            borderRadius: "8px",
            border: "none",
            bgcolor: "primary.main",
            color: "#fff",
            font: "inherit",
            cursor: "pointer",
            transition: "background-color .2s",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          <Send sx={{ fontSize: 16 }} />
          발송
        </Box>
      </Box>

      {/* 마감 임박 알림 */}
      <Box
        sx={{
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "#fff",
          p: 3,
          mb: 3,
        }}
      >
        <Typography component="h3" sx={{ fontWeight: 600, color: "text.primary", mb: 2 }}>
          마감 임박 알림 설정
        </Typography>
        <Stack spacing={1.5}>
          {DEADLINE_ITEMS.map(({ key, label, last }, idx) => (
            <Box
              key={key}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 1.5,
                borderBottom: idx === DEADLINE_ITEMS.length - 1 ? "none" : "1px solid",
                borderColor: "divider",
              }}
            >
              <Box>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}>
                  {label}
                </Typography>
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                  마지막 발송: {last}
                </Typography>
              </Box>
              <Box
                component="button"
                type="button"
                onClick={() => setDeadlineToggles((prev) => ({ ...prev, [key]: !prev[key] }))}
                sx={{
                  border: "none",
                  bgcolor: "transparent",
                  p: 0,
                  cursor: "pointer",
                  display: "flex",
                }}
              >
                {deadlineToggles[key] ? (
                  <ToggleOn sx={{ fontSize: 28, color: "#6C63FF" }} />
                ) : (
                  <ToggleOff sx={{ fontSize: 28, color: "#D1D5DB" }} />
                )}
              </Box>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* 발송 이력 */}
      <Box
        sx={{
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "#fff",
          overflow: "hidden",
        }}
      >
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography component="h3" sx={{ fontWeight: 600, color: "text.primary" }}>
            발송 이력
          </Typography>
        </Box>
        <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
          <Box component="thead" sx={{ bgcolor: "#F8F9FF" }}>
            <Box component="tr">
              <Box component="th" sx={thSx}>유형</Box>
              <Box component="th" sx={thSx}>제목</Box>
              <Box component="th" sx={thSx}>대상</Box>
              <Box component="th" sx={thSx}>발송시각</Box>
              <Box component="th" sx={thSx}>상태</Box>
            </Box>
          </Box>
          <Box component="tbody">
            {sent.map((s) => (
              <Box
                component="tr"
                key={s.id}
                sx={{
                  borderTop: "1px solid",
                  borderColor: "divider",
                  transition: "background-color .2s",
                  "&:hover": { bgcolor: "rgba(248,249,255,0.5)" },
                }}
              >
                <Box component="td" sx={{ px: 2.5, py: 2 }}>
                  <Box
                    component="span"
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: "999px",
                      fontSize: 12,
                      fontWeight: 500,
                      ...typeChipSx(s.type),
                    }}
                  >
                    {s.type}
                  </Box>
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 2, fontSize: 14, fontWeight: 500, color: "text.primary" }}>
                  {s.title}
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 2, fontSize: 14, color: "text.secondary" }}>
                  {s.target}
                </Box>
                <Box
                  component="td"
                  sx={{ px: 2.5, py: 2, fontSize: 14, color: "text.secondary", fontFamily: mono }}
                >
                  {s.sentAt}
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 2 }}>
                  <Box
                    component="span"
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: "999px",
                      bgcolor: "#DCFCE7",
                      color: "#15803D",
                      fontSize: 12,
                    }}
                  >
                    {s.status}
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
