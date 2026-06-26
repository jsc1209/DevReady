import { useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { Add, EditOutlined, DeleteOutlined, ToggleOn, ToggleOff } from "@mui/icons-material";
import { Modal } from "./adminShared";
import { inputSx } from "./adminUtils";

// ─── Algorithms (A-009) — 알고리즘(면접 준비 콘텐츠) 관리 ───
// mock co-locate (다른 섹션과 공유 금지)

const INIT_ALGO = [
  { id: 1, title: "이진 탐색 트리 구현", category: "알고리즘", level: "중급", active: true },
  { id: 2, title: "OSI 7계층 설명", category: "CS", level: "초급", active: true },
  { id: 3, title: "React 렌더링 최적화", category: "프론트엔드", level: "중급", active: true },
  { id: 4, title: "REST API 설계 원칙", category: "백엔드", level: "초급", active: true },
  { id: 5, title: "동적 프로그래밍 응용", category: "알고리즘", level: "고급", active: false },
];

const ALGO_CATS = ["전체", "알고리즘", "CS", "프론트엔드", "백엔드"];
const ALGO_LEVELS = ["초급", "중급", "고급"];

const LEVEL_SX = {
  초급: { bgcolor: "#DCFCE7", color: "#15803D" }, // green-100 / green-700
  중급: { bgcolor: "#DBEAFE", color: "#1D4ED8" }, // blue-100 / blue-700
  고급: { bgcolor: "#FEE2E2", color: "#DC2626" }, // red-100 / red-600
};

// 공유 셀(헤더/본문) sx
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
  borderTop: "1px solid",
  borderColor: "divider",
};

export default function AlgorithmsSection() {
  const [items, setItems] = useState(INIT_ALGO);
  const [catFilter, setCatFilter] = useState("전체");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title: "", category: "알고리즘", level: "초급", description: "" });

  let filtered = items;
  if (catFilter !== "전체") {
    filtered = items.filter((i) => i.category === catFilter);
  }

  const openCreate = () => {
    setForm({ title: "", category: "알고리즘", level: "초급", description: "" });
    setModal({ mode: "create" });
  };

  const openEdit = (item) => {
    setForm({ title: item.title, category: item.category, level: item.level, description: "" });
    setModal({ mode: "edit", item });
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (modal?.mode === "create") {
      setItems((prev) => [
        ...prev,
        { id: Date.now(), title: form.title, category: form.category, level: form.level, active: true },
      ]);
    } else if (modal?.item) {
      setItems((prev) =>
        prev.map((x) => {
          if (x.id === modal.item.id) {
            return { ...x, title: form.title, category: form.category, level: form.level };
          }
          return x;
        }),
      );
    }
    setModal(null);
  };

  const toggleActive = (id) => {
    setItems((prev) =>
      prev.map((x) => {
        if (x.id === id) {
          return { ...x, active: !x.active };
        }
        return x;
      }),
    );
  };

  const handleDelete = (id) => {
    if (confirm("삭제하시겠습니까?")) {
      setItems((prev) => prev.filter((x) => x.id !== id));
    }
  };

  return (
    <Box>
      {/* Header */}
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
            알고리즘 관리
          </Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            면접 준비 콘텐츠 등록·수정·관리
          </Typography>
        </Box>
        <Box
          component="button"
          type="button"
          onClick={openCreate}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 1.25,
            borderRadius: "8px",
            border: "none",
            bgcolor: "primary.main",
            color: "#fff",
            fontSize: 14,
            font: "inherit",
            cursor: "pointer",
            transition: "background-color .2s",
            "&:hover": { bgcolor: "#4F46E5" },
          }}
        >
          <Add sx={{ fontSize: 16 }} />
          콘텐츠 등록
        </Box>
      </Box>

      {/* Category filter */}
      <Stack direction="row" spacing={0.5} sx={{ mb: 2 }}>
        {ALGO_CATS.map((c) => {
          const active = catFilter === c;
          return (
            <Box
              key={c}
              component="button"
              type="button"
              onClick={() => setCatFilter(c)}
              sx={{
                px: 2,
                py: 1,
                borderRadius: "8px",
                fontSize: 14,
                fontWeight: 500,
                border: "none",
                font: "inherit",
                cursor: "pointer",
                transition: "background-color .2s, color .2s",
                ...(active
                  ? { bgcolor: "primary.main", color: "#fff" }
                  : {
                      bgcolor: "#F8F9FF",
                      color: "text.secondary",
                      "&:hover": { color: "text.primary" },
                    }),
              }}
            >
              {c}
            </Box>
          );
        })}
      </Stack>

      {/* Table */}
      <Box
        sx={{
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "#fff",
          overflow: "hidden",
        }}
      >
        <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
          <Box component="thead" sx={{ bgcolor: "#F8F9FF" }}>
            <Box component="tr">
              <Box component="th" sx={thSx}>제목</Box>
              <Box component="th" sx={thSx}>카테고리</Box>
              <Box component="th" sx={thSx}>난이도</Box>
              <Box component="th" sx={thSx}>상태</Box>
              <Box component="th" sx={thSx}>작업</Box>
            </Box>
          </Box>
          <Box component="tbody">
            {filtered.map((item) => (
              <Box
                component="tr"
                key={item.id}
                sx={{
                  transition: "background-color .2s",
                  "&:hover": { bgcolor: "rgba(248,249,255,0.5)" },
                }}
              >
                <Box
                  component="td"
                  sx={{ ...tdSx, fontSize: 14, fontWeight: 500, color: "text.primary" }}
                >
                  {item.title}
                </Box>
                <Box component="td" sx={tdSx}>
                  <Box
                    component="span"
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: "999px",
                      bgcolor: "#F3E8FF", // purple-100
                      color: "#7E22CE", // purple-700
                      fontSize: 12,
                    }}
                  >
                    {item.category}
                  </Box>
                </Box>
                <Box component="td" sx={tdSx}>
                  <Box
                    component="span"
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: "999px",
                      fontSize: 12,
                      fontWeight: 500,
                      ...LEVEL_SX[item.level],
                    }}
                  >
                    {item.level}
                  </Box>
                </Box>
                <Box component="td" sx={tdSx}>
                  <Box
                    component="button"
                    type="button"
                    onClick={() => toggleActive(item.id)}
                    sx={{
                      p: 0,
                      border: "none",
                      bgcolor: "transparent",
                      cursor: "pointer",
                      display: "flex",
                    }}
                  >
                    {item.active ? (
                      <ToggleOn sx={{ fontSize: 24, color: "#6C63FF" }} />
                    ) : (
                      <ToggleOff sx={{ fontSize: 24, color: "#D1D5DB" }} />
                    )}
                  </Box>
                </Box>
                <Box component="td" sx={tdSx}>
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <Box
                      component="button"
                      type="button"
                      onClick={() => openEdit(item)}
                      sx={{
                        p: 0.75,
                        borderRadius: "8px",
                        border: "none",
                        bgcolor: "transparent",
                        color: "text.secondary",
                        cursor: "pointer",
                        display: "flex",
                        transition: "background-color .2s, color .2s",
                        "&:hover": { bgcolor: "#F8F9FF", color: "primary.main" },
                      }}
                    >
                      <EditOutlined sx={{ fontSize: 16 }} />
                    </Box>
                    <Box
                      component="button"
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      sx={{
                        p: 0.75,
                        borderRadius: "8px",
                        border: "none",
                        bgcolor: "transparent",
                        color: "text.secondary",
                        cursor: "pointer",
                        display: "flex",
                        transition: "background-color .2s, color .2s",
                        "&:hover": { bgcolor: "#FEF2F2", color: "#EF4444" },
                      }}
                    >
                      <DeleteOutlined sx={{ fontSize: 16 }} />
                    </Box>
                  </Stack>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Modal */}
      {modal && (
        <Modal
          title={modal.mode === "create" ? "콘텐츠 등록" : "콘텐츠 수정"}
          onClose={() => setModal(null)}
        >
          <Stack spacing={2}>
            <Box>
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
                placeholder="콘텐츠 제목"
                sx={inputSx}
              />
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1.5 }}>
              <Box>
                <Typography
                  component="label"
                  sx={{ display: "block", fontSize: 12, fontWeight: 500, color: "text.secondary", mb: 0.5 }}
                >
                  카테고리
                </Typography>
                <Box
                  component="select"
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                  sx={inputSx}
                >
                  {["알고리즘", "CS", "프론트엔드", "백엔드"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </Box>
              </Box>
              <Box>
                <Typography
                  component="label"
                  sx={{ display: "block", fontSize: 12, fontWeight: 500, color: "text.secondary", mb: 0.5 }}
                >
                  난이도
                </Typography>
                <Box
                  component="select"
                  value={form.level}
                  onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
                  sx={inputSx}
                >
                  {ALGO_LEVELS.map((l) => (
                    <option key={l}>{l}</option>
                  ))}
                </Box>
              </Box>
            </Box>
            <Box>
              <Typography
                component="label"
                sx={{ display: "block", fontSize: 12, fontWeight: 500, color: "text.secondary", mb: 0.5 }}
              >
                설명
              </Typography>
              <Box
                component="textarea"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={4}
                placeholder="콘텐츠 설명..."
                sx={{ ...inputSx, resize: "vertical" }}
              />
            </Box>
            <Stack direction="row" spacing={1}>
              <Box
                component="button"
                type="button"
                onClick={() => setModal(null)}
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
                onClick={handleSave}
                sx={{
                  flex: 1,
                  py: 1.25,
                  borderRadius: "12px",
                  border: "none",
                  bgcolor: "primary.main",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  font: "inherit",
                  cursor: "pointer",
                  transition: "background-color .2s",
                  "&:hover": { bgcolor: "#4F46E5" },
                }}
              >
                저장
              </Box>
            </Stack>
          </Stack>
        </Modal>
      )}
    </Box>
  );
}
