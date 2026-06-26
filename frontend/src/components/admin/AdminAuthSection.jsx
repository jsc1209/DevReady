import { useState } from "react";
import { Box, Typography, Stack, Button } from "@mui/material";
import {
  Add,
  EditOutlined,
  Save,
  Shield,
  PersonOff,
  Visibility,
} from "@mui/icons-material";
import { Toast, StatusBadge, Modal } from "./adminShared";
import { inputSx } from "./adminUtils";

const mono = "'DM Mono', monospace";

// ─── mock (co-locate) ───
const INIT_ADMINS = [
  { id: 1, name: "관리자1", email: "admin1@interviewai.com", role: "슈퍼관리자", permissions: ["전체"], lastLogin: "2026-06-09", active: true },
  { id: 2, name: "관리자2", email: "admin2@interviewai.com", role: "컨텐츠관리", permissions: ["알고리즘", "챗봇"], lastLogin: "2026-06-08", active: true },
  { id: 3, name: "관리자3", email: "admin3@interviewai.com", role: "고객지원", permissions: ["신고", "커뮤니티"], lastLogin: "2026-06-07", active: false },
];

const ALL_PERMISSIONS = ["회원관리", "기업관리", "공고관리", "신고관리", "알림관리", "커뮤니티", "알고리즘", "만족도", "챗봇", "약관관리", "전체"];

// ─── 셀 공통 sx ───
const thSx = {
  px: 2.5,
  py: 1.5,
  textAlign: "left",
  fontSize: 12,
  fontWeight: 500,
  color: "text.secondary",
  whiteSpace: "nowrap",
};
const tdSx = {
  px: 2.5,
  py: 2,
  verticalAlign: "middle",
};

export default function AdminAuthSection() {
  const [admins, setAdmins] = useState(INIT_ADMINS);
  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [toast, setToast] = useState("");

  const showMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleCreate = (acc) => {
    const newAdmin = { ...acc, id: Date.now(), lastLogin: "-", active: true };
    setAdmins((prev) => [...prev, newAdmin]);
    setShowCreate(false);
    showMsg(`관리자 계정 '${acc.name}'이(가) 생성되었습니다.`);
  };

  const handleEditPerms = (id, permissions) => {
    setAdmins((prev) => prev.map((a) => (a.id === id ? { ...a, permissions } : a)));
    setEditTarget(null);
    showMsg("권한이 수정되었습니다.");
  };

  const handleToggleActive = (id) => {
    setAdmins((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const next = !a.active;
        showMsg(`계정이 ${next ? "활성화" : "비활성화"}되었습니다.`);
        return { ...a, active: next };
      })
    );
  };

  return (
    <Box>
      <Toast msg={toast} />
      {showCreate && (
        <AdminCreateModal onConfirm={handleCreate} onClose={() => setShowCreate(false)} />
      )}
      {editTarget && (
        <AdminEditPermsModal
          admin={editTarget}
          onConfirm={(perms) => handleEditPerms(editTarget.id, perms)}
          onClose={() => setEditTarget(null)}
        />
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            sx={{ fontSize: 30, fontWeight: 700, color: "text.primary", mb: 1 }}
          >
            관리자 권한 관리
          </Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            관리자 계정 생성·권한 부여·비활성화 (총관리자 전용)
          </Typography>
        </Box>
        <Button
          onClick={() => setShowCreate(true)}
          disableElevation
          startIcon={<Add sx={{ fontSize: 16 }} />}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 1.25,
            borderRadius: "8px",
            bgcolor: "primary.main",
            color: "#fff",
            fontSize: 14,
            textTransform: "none",
            "&:hover": { bgcolor: "#4F46E5" },
          }}
        >
          관리자 추가
        </Button>
      </Box>

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
            <Box component="thead" sx={{ bgcolor: "#F9FAFB" }}>
              <Box component="tr">
                <Box component="th" sx={thSx}>이름 / 이메일</Box>
                <Box component="th" sx={thSx}>역할</Box>
                <Box component="th" sx={thSx}>기능 권한</Box>
                <Box component="th" sx={thSx}>최근 로그인</Box>
                <Box component="th" sx={thSx}>상태</Box>
                <Box component="th" sx={thSx}>작업</Box>
              </Box>
            </Box>
            <Box component="tbody">
              {admins.map((admin) => (
                <Box
                  component="tr"
                  key={admin.id}
                  sx={{
                    borderTop: "1px solid",
                    borderColor: "divider",
                    opacity: admin.active ? 1 : 0.5,
                    transition: "background-color .2s",
                    "&:hover": { bgcolor: "rgba(249,250,251,0.5)" },
                  }}
                >
                  <Box component="td" sx={tdSx}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          borderRadius: "999px",
                          bgcolor: "rgba(108,99,255,0.1)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 14,
                          fontWeight: 700,
                          color: "primary.main",
                          flexShrink: 0,
                        }}
                      >
                        {admin.name[0]}
                      </Box>
                      <Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}>
                          {admin.name}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                          {admin.email}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Box component="td" sx={tdSx}>
                    <Box
                      component="span"
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: "999px",
                        bgcolor: "#F3E8FF",
                        color: "#7E22CE",
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {admin.role}
                    </Box>
                  </Box>
                  <Box component="td" sx={tdSx}>
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, maxWidth: 220 }}>
                      {admin.permissions.map((perm, idx) => (
                        <Box
                          component="span"
                          key={idx}
                          sx={{
                            px: 1,
                            py: 0.25,
                            borderRadius: "8px",
                            bgcolor: "rgba(108,99,255,0.1)",
                            color: "primary.main",
                            fontSize: 12,
                          }}
                        >
                          {perm}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                  <Box
                    component="td"
                    sx={{ ...tdSx, fontSize: 14, color: "text.secondary", fontFamily: mono }}
                  >
                    {admin.lastLogin}
                  </Box>
                  <Box component="td" sx={tdSx}>
                    <StatusBadge status={admin.active ? "활성" : "비활성"} />
                  </Box>
                  <Box component="td" sx={tdSx}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                      <Box
                        component="button"
                        type="button"
                        onClick={() => setEditTarget(admin)}
                        title="권한 수정"
                        sx={{
                          p: 0.75,
                          borderRadius: "8px",
                          border: "none",
                          bgcolor: "transparent",
                          cursor: "pointer",
                          display: "flex",
                          color: "text.secondary",
                          transition: "background-color .2s, color .2s",
                          "&:hover": { bgcolor: "#F3F4F6", color: "primary.main" },
                        }}
                      >
                        <EditOutlined sx={{ fontSize: 16 }} />
                      </Box>
                      <Box
                        component="button"
                        type="button"
                        onClick={() => handleToggleActive(admin.id)}
                        title={admin.active ? "비활성화" : "활성화"}
                        sx={{
                          p: 0.75,
                          borderRadius: "8px",
                          border: "none",
                          bgcolor: "transparent",
                          cursor: "pointer",
                          display: "flex",
                          color: "text.secondary",
                          transition: "background-color .2s, color .2s",
                          ...(admin.active
                            ? { "&:hover": { bgcolor: "#FFFBEB", color: "#D97706" } }
                            : { "&:hover": { bgcolor: "#F0FDF4", color: "#16A34A" } }),
                        }}
                      >
                        {admin.active ? (
                          <PersonOff sx={{ fontSize: 16 }} />
                        ) : (
                          <Visibility sx={{ fontSize: 16 }} />
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ─── 권한 체크박스 그리드 (두 모달 공유) ───
function PermGrid({ selected, onToggle }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 1,
      }}
    >
      {ALL_PERMISSIONS.map((perm) => {
        const on = selected.includes(perm);
        return (
          <Box
            component="label"
            key={perm}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              px: 1.5,
              py: 1,
              borderRadius: "12px",
              border: "1px solid",
              cursor: "pointer",
              transition: "border-color .2s, background-color .2s, color .2s",
              ...(on
                ? {
                    borderColor: "primary.main",
                    bgcolor: "rgba(108,99,255,0.05)",
                    color: "primary.main",
                  }
                : {
                    borderColor: "divider",
                    color: "text.secondary",
                    "&:hover": { borderColor: "rgba(108,99,255,0.4)" },
                  }),
            }}
          >
            <Box
              component="input"
              type="checkbox"
              checked={on}
              onChange={() => onToggle(perm)}
              sx={{ width: 14, height: 14, accentColor: "#6C63FF" }}
            />
            <Box component="span" sx={{ fontSize: 12 }}>
              {perm}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}

// ─── 관리자 계정 생성 모달 (co-locate) ───
function AdminCreateModal({ onConfirm, onClose }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "컨텐츠관리",
    permissions: [],
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState("");

  const togglePerm = (p) => {
    if (p === "전체") {
      setForm((f) => ({ ...f, permissions: f.permissions.includes("전체") ? [] : ["전체"] }));
      return;
    }
    setForm((f) => ({
      ...f,
      permissions: f.permissions.includes(p)
        ? f.permissions.filter((x) => x !== p)
        : [...f.permissions.filter((x) => x !== "전체"), p],
    }));
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.password) {
      setError("모든 필드를 입력해주세요.");
      return;
    }
    if (form.password !== form.passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (form.permissions.length === 0) {
      setError("최소 하나의 권한을 선택해주세요.");
      return;
    }
    onConfirm({ name: form.name, email: form.email, role: form.role, permissions: form.permissions });
  };

  const title = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
      <Shield sx={{ fontSize: 20, color: "primary.main" }} />
      <Box component="span">관리자 계정 생성</Box>
    </Box>
  );

  return (
    <Modal title={title} onClose={onClose}>
      <Stack spacing={2}>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
          <Box>
            <Typography
              component="label"
              sx={{ display: "block", fontSize: 12, fontWeight: 500, color: "text.secondary", mb: 0.5 }}
            >
              이름 *
            </Typography>
            <Box
              component="input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="홍길동"
              sx={inputSx}
            />
          </Box>
          <Box>
            <Typography
              component="label"
              sx={{ display: "block", fontSize: 12, fontWeight: 500, color: "text.secondary", mb: 0.5 }}
            >
              역할
            </Typography>
            <Box
              component="select"
              value={form.role}
              onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
              sx={inputSx}
            >
              {["컨텐츠관리", "고객지원", "데이터분석", "기업관리"].map((r) => (
                <option key={r}>{r}</option>
              ))}
            </Box>
          </Box>
        </Box>
        <Box>
          <Typography
            component="label"
            sx={{ display: "block", fontSize: 12, fontWeight: 500, color: "text.secondary", mb: 0.5 }}
          >
            이메일 *
          </Typography>
          <Box
            component="input"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            placeholder="admin@interviewai.com"
            sx={inputSx}
          />
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }}>
          <Box>
            <Typography
              component="label"
              sx={{ display: "block", fontSize: 12, fontWeight: 500, color: "text.secondary", mb: 0.5 }}
            >
              초기 비밀번호 *
            </Typography>
            <Box
              component="input"
              type="password"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
              sx={inputSx}
            />
          </Box>
          <Box>
            <Typography
              component="label"
              sx={{ display: "block", fontSize: 12, fontWeight: 500, color: "text.secondary", mb: 0.5 }}
            >
              비밀번호 확인 *
            </Typography>
            <Box
              component="input"
              type="password"
              value={form.passwordConfirm}
              onChange={(e) => setForm((f) => ({ ...f, passwordConfirm: e.target.value }))}
              sx={inputSx}
            />
          </Box>
        </Box>
        <Box>
          <Typography
            component="label"
            sx={{ display: "block", fontSize: 12, fontWeight: 500, color: "text.secondary", mb: 1 }}
          >
            기능별 권한 부여 *
          </Typography>
          <PermGrid selected={form.permissions} onToggle={togglePerm} />
        </Box>
        {error && <Typography sx={{ fontSize: 12, color: "#EF4444" }}>{error}</Typography>}
        <Box sx={{ display: "flex", gap: 1.5, pt: 1 }}>
          <Button
            onClick={onClose}
            disableElevation
            sx={{
              flex: 1,
              py: 1.25,
              borderRadius: "12px",
              border: "1px solid",
              borderColor: "divider",
              color: "text.primary",
              fontSize: 14,
              textTransform: "none",
              bgcolor: "transparent",
              "&:hover": { bgcolor: "#F3F4F6" },
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleSubmit}
            disableElevation
            sx={{
              flex: 1,
              py: 1.25,
              borderRadius: "12px",
              bgcolor: "primary.main",
              color: "#fff",
              fontSize: 14,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { bgcolor: "#4F46E5" },
            }}
          >
            계정 생성
          </Button>
        </Box>
      </Stack>
    </Modal>
  );
}

// ─── 권한 수정 모달 (co-locate) ───
function AdminEditPermsModal({ admin, onConfirm, onClose }) {
  const [perms, setPerms] = useState(admin.permissions);

  const togglePerm = (p) => {
    if (p === "전체") {
      setPerms((prev) => (prev.includes("전체") ? [] : ["전체"]));
      return;
    }
    setPerms((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev.filter((x) => x !== "전체"), p]
    );
  };

  const title = (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.25 }}>
        <Shield sx={{ fontSize: 16, color: "primary.main" }} />
        <Box component="span">권한 수정</Box>
      </Box>
      <Typography sx={{ fontSize: 12, fontWeight: 400, color: "text.secondary" }}>
        {admin.name} ({admin.email})
      </Typography>
    </Box>
  );

  return (
    <Modal title={title} onClose={onClose}>
      <Box>
        <Typography
          component="label"
          sx={{ display: "block", fontSize: 12, fontWeight: 500, color: "text.secondary", mb: 1.5 }}
        >
          접근 가능한 기능 선택
        </Typography>
        <PermGrid selected={perms} onToggle={togglePerm} />
      </Box>
      <Box sx={{ display: "flex", gap: 1.5, pt: 3 }}>
        <Button
          onClick={onClose}
          disableElevation
          sx={{
            flex: 1,
            py: 1.25,
            borderRadius: "12px",
            border: "1px solid",
            borderColor: "divider",
            color: "text.primary",
            fontSize: 14,
            textTransform: "none",
            bgcolor: "transparent",
            "&:hover": { bgcolor: "#F3F4F6" },
          }}
        >
          취소
        </Button>
        <Button
          onClick={() => onConfirm(perms)}
          disableElevation
          startIcon={<Save sx={{ fontSize: 14 }} />}
          sx={{
            flex: 1,
            py: 1.25,
            borderRadius: "12px",
            bgcolor: "primary.main",
            color: "#fff",
            fontSize: 14,
            fontWeight: 600,
            textTransform: "none",
            "&:hover": { bgcolor: "#4F46E5" },
          }}
        >
          저장
        </Button>
      </Box>
    </Modal>
  );
}
