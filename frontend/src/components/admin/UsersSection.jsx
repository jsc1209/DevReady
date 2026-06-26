import { useState } from "react";
import { Box, Stack, Typography } from "@mui/material";
import { Search, Download, Cancel } from "@mui/icons-material";
import { Toast, StatusBadge, Modal } from "./adminShared";
import { inputSx, csvDownload } from "./adminUtils";

const mono = "'DM Mono', monospace";

// ─── 회원 mock (co-locate) ──────────────────────────────────────────────────
const INIT_USERS = [
  { id: 1, name: "김철수", email: "kim@example.com", plan: "프로", sessions: 42, joined: "2026-01-15", status: "활성" },
  { id: 2, name: "이영희", email: "lee@example.com", plan: "베이직", sessions: 18, joined: "2026-02-20", status: "활성" },
  { id: 3, name: "박민준", email: "park@example.com", plan: "무료", sessions: 5, joined: "2026-03-10", status: "활성" },
  { id: 4, name: "최수연", email: "choi@example.com", plan: "프로", sessions: 31, joined: "2026-01-05", status: "정지" },
  { id: 5, name: "정도현", email: "jung@example.com", plan: "베이직", sessions: 9, joined: "2026-04-22", status: "활성" },
  { id: 6, name: "한지민", email: "han@example.com", plan: "무료", sessions: 2, joined: "2026-05-30", status: "탈퇴" },
];

// 플랜 칩 색(공유 StatusBadge 밖 — purple/blue/gray 인라인)
const PLAN_SX = {
  무료: { bgcolor: "#F3F4F6", color: "#4B5563" },
  베이직: { bgcolor: "#DBEAFE", color: "#1D4ED8" },
  프로: { bgcolor: "#F3E8FF", color: "#7E22CE" },
};

function PlanChip({ plan }) {
  const c = PLAN_SX[plan] ?? { bgcolor: "#F3F4F6", color: "#4B5563" };
  return (
    <Box
      component="span"
      sx={{ px: 1, py: 0.5, borderRadius: "999px", fontSize: 12, fontWeight: 500, ...c }}
    >
      {plan}
    </Box>
  );
}

const TH_SX = {
  px: 2.5,
  py: 1.5,
  textAlign: "left",
  fontSize: 12,
  fontWeight: 500,
  color: "text.secondary",
};

const TD_SX = { px: 2.5, py: 2 };

export default function UsersSection() {
  const [users, setUsers] = useState(INIT_USERS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("전체");
  const [selected, setSelected] = useState(null);
  const [suspendTarget, setSuspendTarget] = useState(null);
  const [suspendReason, setSuspendReason] = useState("");
  const [toast, setToast] = useState("");

  const showMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const filtered = users.filter((u) => {
    const matchSearch = u.name.includes(search) || u.email.includes(search);
    const matchFilter = filter === "전체" || u.status === filter;
    return matchSearch && matchFilter;
  });

  const handleExport = () => {
    csvDownload("users.csv", [
      ["이름", "이메일", "플랜", "면접횟수", "가입일", "상태"],
      ...users.map((u) => [u.name, u.email, u.plan, String(u.sessions), u.joined, u.status]),
    ]);
  };

  const handleWithdraw = (u) => {
    if (!confirm(`${u.name} 회원을 탈퇴 처리하시겠습니까?`)) return;
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, status: "탈퇴" } : x)));
    showMsg("탈퇴 처리되었습니다.");
  };

  const handleRestore = (u) => {
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, status: "활성" } : x)));
    showMsg("활성화 복구되었습니다.");
  };

  const confirmSuspend = () => {
    if (!suspendReason.trim()) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === suspendTarget.id ? { ...u, status: "정지" } : u))
    );
    if (selected?.id === suspendTarget.id) {
      setSelected((prev) => (prev ? { ...prev, status: "정지" } : null));
    }
    showMsg("정지 처리되었습니다.");
    setSuspendTarget(null);
  };

  return (
    <Stack direction="row" spacing={3}>
      <Toast msg={toast} />

      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* 헤더 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 30, fontWeight: 700, color: "text.primary", mb: 1 }}>
              회원 관리
            </Typography>
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
              회원 목록 조회 및 상태 관리
            </Typography>
          </Box>
          <Box
            component="button"
            type="button"
            onClick={handleExport}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 2,
              py: 1.25,
              borderRadius: "8px",
              bgcolor: "#F8F9FF",
              color: "text.primary",
              border: "1px solid",
              borderColor: "divider",
              fontSize: 14,
              font: "inherit",
              cursor: "pointer",
              transition: "background-color .15s",
              "&:hover": { bgcolor: "#EEF0FF" },
            }}
          >
            <Download sx={{ fontSize: 16 }} />
            문서 다운
          </Box>
        </Box>

        {/* 검색 + 필터 */}
        <Stack direction="row" spacing={1.5} sx={{ mb: 2 }}>
          <Box sx={{ position: "relative", flex: 1 }}>
            <Search
              sx={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 16,
                color: "text.secondary",
              }}
            />
            <Box
              component="input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="이름 또는 이메일 검색..."
              sx={{
                width: "100%",
                pl: 5,
                pr: 2,
                py: 1.25,
                borderRadius: "8px",
                bgcolor: "#fff",
                border: "1px solid",
                borderColor: "divider",
                fontSize: 14,
                font: "inherit",
                outline: "none",
                boxSizing: "border-box",
                "&:focus": { borderColor: "rgba(108,99,255,0.6)" },
              }}
            />
          </Box>
          <Box
            component="select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            sx={{
              px: 2,
              py: 1.25,
              borderRadius: "8px",
              bgcolor: "#fff",
              border: "1px solid",
              borderColor: "divider",
              fontSize: 14,
              font: "inherit",
              outline: "none",
              cursor: "pointer",
            }}
          >
            {["전체", "활성", "정지", "탈퇴"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </Box>
        </Stack>

        {/* 회원 테이블 */}
        <Box
          sx={{
            borderRadius: "16px",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "#fff",
            overflow: "hidden",
          }}
        >
          <Box sx={{ overflowX: "auto" }}>
            <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
              <Box component="thead" sx={{ bgcolor: "#F8F9FF" }}>
                <Box component="tr">
                  <Box component="th" sx={TH_SX}>이름 / 이메일</Box>
                  <Box component="th" sx={TH_SX}>플랜</Box>
                  <Box component="th" sx={TH_SX}>면접횟수</Box>
                  <Box component="th" sx={TH_SX}>가입일</Box>
                  <Box component="th" sx={TH_SX}>상태</Box>
                  <Box component="th" sx={TH_SX}>작업</Box>
                </Box>
              </Box>
              <Box component="tbody">
                {filtered.map((u) => (
                  <Box
                    component="tr"
                    key={u.id}
                    onClick={() => setSelected(u)}
                    sx={{
                      cursor: "pointer",
                      borderTop: "1px solid",
                      borderColor: "divider",
                      transition: "background-color .15s",
                      "&:hover": { bgcolor: "rgba(248,249,255,0.5)" },
                    }}
                  >
                    <Box component="td" sx={TD_SX}>
                      <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}>
                        {u.name}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                        {u.email}
                      </Typography>
                    </Box>
                    <Box component="td" sx={TD_SX}>
                      <PlanChip plan={u.plan} />
                    </Box>
                    <Box
                      component="td"
                      sx={{ ...TD_SX, fontSize: 14, color: "text.primary", fontFamily: mono }}
                    >
                      {u.sessions}회
                    </Box>
                    <Box
                      component="td"
                      sx={{ ...TD_SX, fontSize: 14, color: "text.secondary" }}
                    >
                      {u.joined}
                    </Box>
                    <Box component="td" sx={TD_SX}>
                      <StatusBadge status={u.status} />
                    </Box>
                    <Box component="td" sx={TD_SX} onClick={(e) => e.stopPropagation()}>
                      <Stack direction="row" alignItems="center" spacing={0.75}>
                        {u.status === "활성" && (
                          <Box
                            component="button"
                            type="button"
                            onClick={() => {
                              setSuspendTarget(u);
                              setSuspendReason("");
                            }}
                            sx={{
                              px: 1.25,
                              py: 0.5,
                              borderRadius: "8px",
                              bgcolor: "#FEF3C7",
                              color: "#B45309",
                              border: "none",
                              fontSize: 12,
                              font: "inherit",
                              cursor: "pointer",
                              transition: "background-color .15s",
                              "&:hover": { bgcolor: "#FDE68A" },
                            }}
                          >
                            정지
                          </Box>
                        )}
                        {u.status === "활성" && (
                          <Box
                            component="button"
                            type="button"
                            onClick={() => handleWithdraw(u)}
                            sx={{
                              px: 1.25,
                              py: 0.5,
                              borderRadius: "8px",
                              bgcolor: "#FEE2E2",
                              color: "#DC2626",
                              border: "none",
                              fontSize: 12,
                              font: "inherit",
                              cursor: "pointer",
                              transition: "background-color .15s",
                              "&:hover": { bgcolor: "#FECACA" },
                            }}
                          >
                            탈퇴
                          </Box>
                        )}
                        {(u.status === "정지" || u.status === "탈퇴") && (
                          <Box
                            component="button"
                            type="button"
                            onClick={() => handleRestore(u)}
                            sx={{
                              px: 1.25,
                              py: 0.5,
                              borderRadius: "8px",
                              bgcolor: "#DCFCE7",
                              color: "#15803D",
                              border: "none",
                              fontSize: 12,
                              font: "inherit",
                              cursor: "pointer",
                              transition: "background-color .15s",
                              "&:hover": { bgcolor: "#BBF7D0" },
                            }}
                          >
                            복구
                          </Box>
                        )}
                      </Stack>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* 회원 상세 패널 */}
      {selected && (
        <Box
          sx={{
            width: 288,
            flexShrink: 0,
            borderRadius: "16px",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "#fff",
            p: 2.5,
            alignSelf: "flex-start",
            position: "sticky",
            top: 24,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography sx={{ fontWeight: 600, color: "text.primary" }}>회원 상세</Typography>
            <Box
              component="button"
              type="button"
              onClick={() => setSelected(null)}
              sx={{
                p: 0.5,
                borderRadius: "8px",
                border: "none",
                bgcolor: "transparent",
                cursor: "pointer",
                display: "flex",
                "&:hover": { bgcolor: "#F8F9FF" },
              }}
            >
              <Cancel sx={{ fontSize: 16, color: "text.secondary" }} />
            </Box>
          </Box>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: "999px",
              bgcolor: "rgba(108,99,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 700,
              color: "primary.main",
              mx: "auto",
              mb: 2,
            }}
          >
            {selected.name[0]}
          </Box>
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography sx={{ fontWeight: 600, color: "text.primary" }}>
              {selected.name}
            </Typography>
            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
              {selected.email}
            </Typography>
          </Box>
          <Stack spacing={1} sx={{ fontSize: 14 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ fontSize: 14, color: "text.secondary" }}>플랜</Typography>
              <PlanChip plan={selected.plan} />
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: 14, color: "text.secondary" }}>면접횟수</Typography>
              <Typography
                sx={{ fontSize: 14, color: "text.primary", fontWeight: 500, fontFamily: mono }}
              >
                {selected.sessions}회
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: 14, color: "text.secondary" }}>가입일</Typography>
              <Typography sx={{ fontSize: 14, color: "text.primary" }}>
                {selected.joined}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography sx={{ fontSize: 14, color: "text.secondary" }}>최근면접</Typography>
              <Typography sx={{ fontSize: 14, color: "text.primary", fontFamily: mono }}>
                2026-06-09
              </Typography>
            </Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ fontSize: 14, color: "text.secondary" }}>상태</Typography>
              <StatusBadge status={selected.status} />
            </Box>
          </Stack>
        </Box>
      )}

      {/* 정지 모달 */}
      {suspendTarget && (
        <Modal title="회원 정지" onClose={() => setSuspendTarget(null)}>
          <Stack spacing={2}>
            <Typography sx={{ fontSize: 14, color: "text.primary" }}>
              <Box component="span" sx={{ fontWeight: 600 }}>
                {suspendTarget.name}
              </Box>{" "}
              회원을 정지합니다. 사유를 입력해주세요.
            </Typography>
            <Box
              component="textarea"
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              rows={4}
              placeholder="정지 사유를 입력하세요..."
              sx={{ ...inputSx, resize: "vertical" }}
            />
            <Stack direction="row" spacing={1}>
              <Box
                component="button"
                type="button"
                onClick={() => setSuspendTarget(null)}
                sx={{
                  flex: 1,
                  py: 1.25,
                  borderRadius: "12px",
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "transparent",
                  fontSize: 14,
                  font: "inherit",
                  color: "text.primary",
                  cursor: "pointer",
                }}
              >
                취소
              </Box>
              <Box
                component="button"
                type="button"
                onClick={confirmSuspend}
                sx={{
                  flex: 1,
                  py: 1.25,
                  borderRadius: "12px",
                  bgcolor: "#F59E0B",
                  color: "#fff",
                  border: "none",
                  fontSize: 14,
                  fontWeight: 600,
                  font: "inherit",
                  cursor: "pointer",
                  transition: "background-color .15s",
                  "&:hover": { bgcolor: "#D97706" },
                }}
              >
                정지 확인
              </Box>
            </Stack>
          </Stack>
        </Modal>
      )}
    </Stack>
  );
}
