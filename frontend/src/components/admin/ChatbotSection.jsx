import { useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { Add, EditOutlined, DeleteOutlined, SmartToy } from "@mui/icons-material";
import { Modal } from "./adminShared";
import { inputSx } from "./adminUtils";

const mono = "'DM Mono', monospace";

// ─── mock (co-locate) ───
const INIT_QNA = [
  { id: 1, question: "면접 이용권은 어떻게 구매하나요?", answer: "마이페이지 > 이용권 구매 메뉴에서 구매 가능합니다.", category: "결제", hits: 342 },
  { id: 2, question: "면접 영상은 저장되나요?", answer: "네, 면접 기록 메뉴에서 확인 가능합니다.", category: "면접", hits: 289 },
  { id: 3, question: "이력서는 어떻게 작성하나요?", answer: "이력서 메뉴에서 양식에 따라 작성하실 수 있습니다.", category: "이력서", hits: 267 },
  { id: 4, question: "비밀번호를 잊어버렸어요.", answer: "로그인 화면에서 '비밀번호 찾기'를 클릭해 이메일로 재설정하세요.", category: "계정", hits: 198 },
  { id: 5, question: "플랜 업그레이드는 어떻게 하나요?", answer: "마이페이지 > 플랜 관리에서 업그레이드 가능합니다.", category: "결제", hits: 156 },
];

const thSx = {
  px: 2.5,
  py: 1.5,
  textAlign: "left",
  fontSize: 12,
  fontWeight: 500,
  color: "text.secondary",
};

export default function ChatbotSection() {
  const [qnas, setQnas] = useState(INIT_QNA);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ question: "", answer: "", category: "" });

  const openCreate = () => {
    setForm({ question: "", answer: "", category: "" });
    setModal({ mode: "create" });
  };
  const openEdit = (item) => {
    setForm({ question: item.question, answer: item.answer, category: item.category });
    setModal({ mode: "edit", item });
  };

  const handleSave = () => {
    if (!form.question.trim() || !form.answer.trim()) return;
    if (modal?.mode === "create") {
      setQnas((prev) => [
        ...prev,
        { id: Date.now(), question: form.question, answer: form.answer, category: form.category, hits: 0 },
      ]);
    } else if (modal?.item) {
      setQnas((prev) =>
        prev.map((x) =>
          x.id === modal.item.id
            ? { ...x, question: form.question, answer: form.answer, category: form.category }
            : x
        )
      );
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    if (confirm("삭제하시겠습니까?")) setQnas((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <Box>
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
            sx={{ fontSize: 30, fontWeight: 700, color: "text.primary", mb: 1, display: "flex", alignItems: "center", gap: 1 }}
          >
            <SmartToy sx={{ fontSize: 28, color: "primary.main" }} />
            챗봇 관리
          </Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>챗봇 Q&amp;A 등록·수정·삭제</Typography>
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
            transition: "background-color 0.2s",
            "&:hover": { bgcolor: "#5A52E0" },
          }}
        >
          <Add sx={{ fontSize: 16 }} />
          Q&amp;A 등록
        </Box>
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
        <Box component="table" sx={{ width: "100%", borderCollapse: "collapse" }}>
          <Box component="thead" sx={{ bgcolor: "#F9FAFB" }}>
            <Box component="tr">
              <Box component="th" sx={thSx}>질문</Box>
              <Box component="th" sx={thSx}>답변</Box>
              <Box component="th" sx={thSx}>카테고리</Box>
              <Box component="th" sx={thSx}>조회수</Box>
              <Box component="th" sx={thSx}>작업</Box>
            </Box>
          </Box>
          <Box component="tbody">
            {qnas.map((q) => (
              <Box
                component="tr"
                key={q.id}
                sx={{
                  borderTop: "1px solid",
                  borderColor: "divider",
                  transition: "background-color 0.2s",
                  "&:hover": { bgcolor: "rgba(249,250,251,0.5)" },
                }}
              >
                <Box
                  component="td"
                  sx={{ px: 2.5, py: 2, fontSize: 14, color: "text.primary", maxWidth: 320 }}
                >
                  {q.question}
                </Box>
                <Box
                  component="td"
                  sx={{
                    px: 2.5,
                    py: 2,
                    fontSize: 14,
                    color: "text.secondary",
                    maxWidth: 384,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {q.answer}
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 2 }}>
                  <Box
                    component="span"
                    sx={{
                      px: 1,
                      py: 0.5,
                      borderRadius: "999px",
                      bgcolor: "#DBEAFE",
                      color: "#1D4ED8",
                      fontSize: 12,
                    }}
                  >
                    {q.category}
                  </Box>
                </Box>
                <Box
                  component="td"
                  sx={{ px: 2.5, py: 2, fontSize: 14, color: "text.primary", fontFamily: mono }}
                >
                  {q.hits}
                </Box>
                <Box component="td" sx={{ px: 2.5, py: 2 }}>
                  <Stack direction="row" alignItems="center" spacing={0.75}>
                    <Box
                      component="button"
                      type="button"
                      onClick={() => openEdit(q)}
                      sx={{
                        p: 0.75,
                        borderRadius: "8px",
                        border: "none",
                        bgcolor: "transparent",
                        color: "text.secondary",
                        cursor: "pointer",
                        display: "flex",
                        transition: "all 0.2s",
                        "&:hover": { bgcolor: "#F9FAFB", color: "primary.main" },
                      }}
                    >
                      <EditOutlined sx={{ fontSize: 16 }} />
                    </Box>
                    <Box
                      component="button"
                      type="button"
                      onClick={() => handleDelete(q.id)}
                      sx={{
                        p: 0.75,
                        borderRadius: "8px",
                        border: "none",
                        bgcolor: "transparent",
                        color: "text.secondary",
                        cursor: "pointer",
                        display: "flex",
                        transition: "all 0.2s",
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

      {modal && (
        <Modal title={modal.mode === "create" ? "Q&A 등록" : "Q&A 수정"} onClose={() => setModal(null)}>
          <Stack spacing={2}>
            <Box>
              <Typography
                component="label"
                sx={{ display: "block", fontSize: 12, fontWeight: 500, color: "text.secondary", mb: 0.5 }}
              >
                질문
              </Typography>
              <Box
                component="input"
                value={form.question}
                onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                placeholder="자주 묻는 질문..."
                sx={inputSx}
              />
            </Box>
            <Box>
              <Typography
                component="label"
                sx={{ display: "block", fontSize: 12, fontWeight: 500, color: "text.secondary", mb: 0.5 }}
              >
                답변
              </Typography>
              <Box
                component="textarea"
                value={form.answer}
                onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                rows={4}
                placeholder="답변 내용..."
                sx={{ ...inputSx, resize: "vertical" }}
              />
            </Box>
            <Box>
              <Typography
                component="label"
                sx={{ display: "block", fontSize: 12, fontWeight: 500, color: "text.secondary", mb: 0.5 }}
              >
                카테고리
              </Typography>
              <Box
                component="input"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="결제, 면접, 계정..."
                sx={inputSx}
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
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#F9FAFB" },
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
                  transition: "background-color 0.2s",
                  "&:hover": { bgcolor: "#5A52E0" },
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
