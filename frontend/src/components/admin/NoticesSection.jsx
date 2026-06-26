import { useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { Add, EditOutlined, DeleteOutlined, ToggleOn, ToggleOff } from "@mui/icons-material";
import { Modal } from "./adminShared";
import { inputSx } from "./adminUtils";
import { INIT_NOTICES, NOTICE_TYPE_SX } from "../../data/notices";

// ─── co-located mock (FAQ — 다른 섹션과 공유 금지) ───
const INIT_FAQS = [
  { id: 1, question: "회원가입은 어떻게 하나요?", answer: "홈페이지 상단 '회원가입' 버튼을 클릭하여 이메일로 가입하세요.", category: "계정" },
  { id: 2, question: "면접 연습은 몇 번까지 가능한가요?", answer: "무료 플랜은 월 3회, 베이직은 월 20회, 프로는 무제한입니다.", category: "면접" },
  { id: 3, question: "환불 정책이 어떻게 되나요?", answer: "결제 후 7일 이내, 서비스 미이용 시 전액 환불 가능합니다.", category: "결제" },
  { id: 4, question: "기업 회원 가입은 어떻게 하나요?", answer: "홈페이지에서 '기업 회원 가입'을 선택 후 사업자 정보를 입력해주세요.", category: "기업" },
];

const TABS = ["공지사항", "FAQ"];
const NOTICE_TYPES = ["공지", "점검", "이벤트"];

const thSx = {
  px: 2.5,
  py: 1.5,
  textAlign: "left",
  fontSize: 12,
  fontWeight: 500,
  color: "text.secondary",
};

const tdSx = { px: 2.5, py: 2, verticalAlign: "middle" };

function iconBtnSx(hoverBg, hoverColor) {
  return {
    p: 0.75,
    borderRadius: "8px",
    border: "none",
    bgcolor: "transparent",
    color: "text.secondary",
    cursor: "pointer",
    display: "inline-flex",
    transition: "background-color .15s, color .15s",
    "&:hover": { bgcolor: hoverBg, color: hoverColor },
  };
}

export default function NoticesSection() {
  const [tab, setTab] = useState("공지사항");
  const [notices, setNotices] = useState(INIT_NOTICES);
  const [faqs, setFaqs] = useState(INIT_FAQS);
  const [noticeModal, setNoticeModal] = useState(null);
  const [faqModal, setFaqModal] = useState(null);
  const [noticeForm, setNoticeForm] = useState({ title: "", content: "", type: "공지" });
  const [faqForm, setFaqForm] = useState({ question: "", answer: "", category: "" });

  const saveNotice = () => {
    if (!noticeForm.title.trim()) return;
    if (noticeModal?.mode === "create") {
      setNotices((prev) => [
        ...prev,
        {
          id: Date.now(),
          title: noticeForm.title,
          content: noticeForm.content,
          type: noticeForm.type,
          date: new Date().toISOString().slice(0, 10),
          published: false,
        },
      ]);
    } else if (noticeModal?.item) {
      setNotices((prev) =>
        prev.map((x) =>
          x.id === noticeModal.item.id
            ? { ...x, title: noticeForm.title, content: noticeForm.content, type: noticeForm.type }
            : x,
        ),
      );
    }
    setNoticeModal(null);
  };

  const saveFaq = () => {
    if (!faqForm.question.trim()) return;
    if (faqModal?.mode === "create") {
      setFaqs((prev) => [
        ...prev,
        { id: Date.now(), question: faqForm.question, answer: faqForm.answer, category: faqForm.category },
      ]);
    } else if (faqModal?.item) {
      setFaqs((prev) => prev.map((x) => (x.id === faqModal.item.id ? { ...x, ...faqForm } : x)));
    }
    setFaqModal(null);
  };

  const togglePublished = (id) =>
    setNotices((prev) => prev.map((x) => (x.id === id ? { ...x, published: !x.published } : x)));

  const deleteNotice = (id) => {
    if (window.confirm("삭제하시겠습니까?")) setNotices((prev) => prev.filter((x) => x.id !== id));
  };

  const deleteFaq = (id) => {
    if (window.confirm("삭제하시겠습니까?")) setFaqs((prev) => prev.filter((x) => x.id !== id));
  };

  return (
    <Box>
      {/* 헤더 */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography sx={{ fontSize: 30, fontWeight: 700, color: "text.primary", mb: 1 }}>
            공지사항·FAQ
          </Typography>
          <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
            공지사항 및 자주 묻는 질문 관리
          </Typography>
        </Box>
        {tab === "공지사항" && (
          <Box
            component="button"
            type="button"
            onClick={() => {
              setNoticeForm({ title: "", content: "", type: "공지" });
              setNoticeModal({ mode: "create" });
            }}
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
              fontWeight: 600,
              cursor: "pointer",
              transition: "background-color .15s",
              "&:hover": { bgcolor: "#4F46E5" },
            }}
          >
            <Add sx={{ fontSize: 16 }} />
            공지 등록
          </Box>
        )}
        {tab === "FAQ" && (
          <Box
            component="button"
            type="button"
            onClick={() => {
              setFaqForm({ question: "", answer: "", category: "" });
              setFaqModal({ mode: "create" });
            }}
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
              fontWeight: 600,
              cursor: "pointer",
              transition: "background-color .15s",
              "&:hover": { bgcolor: "#4F46E5" },
            }}
          >
            <Add sx={{ fontSize: 16 }} />
            FAQ 등록
          </Box>
        )}
      </Box>

      {/* 탭 */}
      <Stack direction="row" spacing={0.5} sx={{ mb: 2 }}>
        {TABS.map((t) => {
          const active = tab === t;
          return (
            <Box
              key={t}
              component="button"
              type="button"
              onClick={() => setTab(t)}
              sx={{
                px: 2,
                py: 1,
                borderRadius: "8px",
                border: "none",
                fontSize: 14,
                fontWeight: 500,
                cursor: "pointer",
                transition: "background-color .15s, color .15s",
                bgcolor: active ? "primary.main" : "#F8F9FF",
                color: active ? "#fff" : "text.secondary",
                "&:hover": { color: active ? "#fff" : "text.primary" },
              }}
            >
              {t}
            </Box>
          );
        })}
      </Stack>

      {/* 공지사항 테이블 */}
      {tab === "공지사항" && (
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
                <Box component="th" sx={thSx}>유형</Box>
                <Box component="th" sx={thSx}>날짜</Box>
                <Box component="th" sx={thSx}>공개</Box>
                <Box component="th" sx={thSx}>작업</Box>
              </Box>
            </Box>
            <Box component="tbody">
              {notices.map((n) => (
                <Box
                  key={n.id}
                  component="tr"
                  sx={{
                    borderTop: "1px solid",
                    borderColor: "divider",
                    transition: "background-color .15s",
                    "&:hover": { bgcolor: "rgba(248,249,255,0.5)" },
                  }}
                >
                  <Box component="td" sx={{ ...tdSx, fontSize: 14, fontWeight: 500, color: "text.primary" }}>
                    {n.title}
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
                        ...(NOTICE_TYPE_SX[n.type] ?? { bgcolor: "#F3F4F6", color: "#4B5563" }),
                      }}
                    >
                      {n.type}
                    </Box>
                  </Box>
                  <Box component="td" sx={{ ...tdSx, fontSize: 14, color: "text.secondary" }}>
                    {n.date}
                  </Box>
                  <Box component="td" sx={tdSx}>
                    <Box
                      component="button"
                      type="button"
                      onClick={() => togglePublished(n.id)}
                      sx={{
                        p: 0,
                        border: "none",
                        bgcolor: "transparent",
                        cursor: "pointer",
                        display: "inline-flex",
                      }}
                    >
                      {n.published ? (
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
                        onClick={() => {
                          setNoticeForm({ title: n.title, content: n.content, type: n.type });
                          setNoticeModal({ mode: "edit", item: n });
                        }}
                        sx={iconBtnSx("#F8F9FF", "primary.main")}
                      >
                        <EditOutlined sx={{ fontSize: 16 }} />
                      </Box>
                      <Box
                        component="button"
                        type="button"
                        onClick={() => deleteNotice(n.id)}
                        sx={iconBtnSx("#FEF2F2", "#EF4444")}
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
      )}

      {/* FAQ 테이블 */}
      {tab === "FAQ" && (
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
                <Box component="th" sx={thSx}>질문</Box>
                <Box component="th" sx={thSx}>답변</Box>
                <Box component="th" sx={thSx}>카테고리</Box>
                <Box component="th" sx={thSx}>작업</Box>
              </Box>
            </Box>
            <Box component="tbody">
              {faqs.map((f) => (
                <Box
                  key={f.id}
                  component="tr"
                  sx={{
                    borderTop: "1px solid",
                    borderColor: "divider",
                    transition: "background-color .15s",
                    "&:hover": { bgcolor: "rgba(248,249,255,0.5)" },
                  }}
                >
                  <Box
                    component="td"
                    sx={{ ...tdSx, fontSize: 14, fontWeight: 500, color: "text.primary", maxWidth: 320 }}
                  >
                    {f.question}
                  </Box>
                  <Box
                    component="td"
                    sx={{
                      ...tdSx,
                      fontSize: 14,
                      color: "text.secondary",
                      maxWidth: 384,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {f.answer}
                  </Box>
                  <Box component="td" sx={tdSx}>
                    <Box
                      component="span"
                      sx={{
                        px: 1,
                        py: 0.5,
                        borderRadius: "999px",
                        bgcolor: "#F3F4F6",
                        color: "#374151",
                        fontSize: 12,
                      }}
                    >
                      {f.category}
                    </Box>
                  </Box>
                  <Box component="td" sx={tdSx}>
                    <Stack direction="row" alignItems="center" spacing={0.75}>
                      <Box
                        component="button"
                        type="button"
                        onClick={() => {
                          setFaqForm({ question: f.question, answer: f.answer, category: f.category });
                          setFaqModal({ mode: "edit", item: f });
                        }}
                        sx={iconBtnSx("#F8F9FF", "primary.main")}
                      >
                        <EditOutlined sx={{ fontSize: 16 }} />
                      </Box>
                      <Box
                        component="button"
                        type="button"
                        onClick={() => deleteFaq(f.id)}
                        sx={iconBtnSx("#FEF2F2", "#EF4444")}
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
      )}

      {/* 공지 모달 */}
      {noticeModal && (
        <Modal
          title={noticeModal.mode === "create" ? "공지 등록" : "공지 수정"}
          onClose={() => setNoticeModal(null)}
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
                value={noticeForm.title}
                onChange={(e) => setNoticeForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="공지 제목"
                sx={inputSx}
              />
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
                value={noticeForm.type}
                onChange={(e) => setNoticeForm((f) => ({ ...f, type: e.target.value }))}
                sx={inputSx}
              >
                {NOTICE_TYPES.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </Box>
            </Box>
            <Box>
              <Typography
                component="label"
                sx={{ display: "block", fontSize: 12, fontWeight: 500, color: "text.secondary", mb: 0.5 }}
              >
                내용
              </Typography>
              <Box
                component="textarea"
                value={noticeForm.content}
                onChange={(e) => setNoticeForm((f) => ({ ...f, content: e.target.value }))}
                rows={5}
                placeholder="공지 내용..."
                sx={{ ...inputSx, resize: "vertical" }}
              />
            </Box>
            <Stack direction="row" spacing={1}>
              <Box
                component="button"
                type="button"
                onClick={() => setNoticeModal(null)}
                sx={{
                  flex: 1,
                  py: 1.25,
                  borderRadius: "12px",
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "transparent",
                  fontSize: 14,
                  color: "text.primary",
                  cursor: "pointer",
                }}
              >
                취소
              </Box>
              <Box
                component="button"
                type="button"
                onClick={saveNotice}
                sx={{
                  flex: 1,
                  py: 1.25,
                  borderRadius: "12px",
                  border: "none",
                  bgcolor: "primary.main",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background-color .15s",
                  "&:hover": { bgcolor: "#4F46E5" },
                }}
              >
                저장
              </Box>
            </Stack>
          </Stack>
        </Modal>
      )}

      {/* FAQ 모달 */}
      {faqModal && (
        <Modal title={faqModal.mode === "create" ? "FAQ 등록" : "FAQ 수정"} onClose={() => setFaqModal(null)}>
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
                value={faqForm.question}
                onChange={(e) => setFaqForm((f) => ({ ...f, question: e.target.value }))}
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
                value={faqForm.answer}
                onChange={(e) => setFaqForm((f) => ({ ...f, answer: e.target.value }))}
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
                value={faqForm.category}
                onChange={(e) => setFaqForm((f) => ({ ...f, category: e.target.value }))}
                placeholder="계정, 결제, 면접..."
                sx={inputSx}
              />
            </Box>
            <Stack direction="row" spacing={1}>
              <Box
                component="button"
                type="button"
                onClick={() => setFaqModal(null)}
                sx={{
                  flex: 1,
                  py: 1.25,
                  borderRadius: "12px",
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "transparent",
                  fontSize: 14,
                  color: "text.primary",
                  cursor: "pointer",
                }}
              >
                취소
              </Box>
              <Box
                component="button"
                type="button"
                onClick={saveFaq}
                sx={{
                  flex: 1,
                  py: 1.25,
                  borderRadius: "12px",
                  border: "none",
                  bgcolor: "primary.main",
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "background-color .15s",
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
