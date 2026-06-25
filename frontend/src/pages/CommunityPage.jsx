import { useState } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import {
  HelpOutlined,
  Description,
  OutlinedFlag,
  ThumbUp,
  ThumbUpOutlined,
  ChatBubbleOutlineOutlined,
  ChevronRight,
  Add,
  Search,
  BookmarkBorder,
  BookmarkAdded,
  Close,
  EditOutlined,
  DeleteOutlined,
  Check,
  ArrowBack,
} from "@mui/icons-material";
import {
  TABS,
  QNA_CATEGORIES,
  INIT_QNAS,
  INIT_FREE_POSTS,
  REPORT_REASONS,
} from "../data/communityMock";

// data 의 iconKey(문자열) → 실제 @mui 아이콘 컴포넌트 매핑.
// HelpCircle→HelpOutlined, FileText→Description.
const TAB_ICONS = { help: HelpOutlined, file: Description };

const mono = "'DM Mono', monospace";

// 입력/텍스트영역 공통 sx (원본 raw input/textarea 재현):
// rounded-xl bg-secondary border border-border text-sm focus:border-primary/60
const inputSx = {
  borderRadius: "12px",
  bgcolor: "#F8F9FF",
  border: "1px solid",
  borderColor: "divider",
  fontSize: 14,
  color: "text.primary",
  font: "inherit",
  boxSizing: "border-box",
  "&:focus": { outline: "none", borderColor: "rgba(108,99,255,0.6)" },
  "&::placeholder": { color: "text.secondary" },
};

// ─── Modal ────────────────────────────────────────────────────────────────────
// 원본 fixed inset-0 bg-black/50 오버레이 + rounded-2xl 카드 구조 충실 재현.
function Modal({ title, onClose, children }) {
  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        bgcolor: "rgba(0,0,0,0.5)",
        zIndex: 1300,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 2,
        overflowY: "auto",
      }}
    >
      <Box
        sx={{
          borderRadius: "16px",
          border: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          width: "100%",
          maxWidth: 512,
          my: 4,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 3,
            py: 2,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            component="h3"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            {title}
          </Typography>
          <Box
            component="button"
            type="button"
            onClick={onClose}
            sx={{
              p: 0.5,
              borderRadius: "8px",
              border: "none",
              bgcolor: "transparent",
              color: "text.secondary",
              cursor: "pointer",
              display: "inline-flex",
              transition: "all .2s",
              "&:hover": { bgcolor: "#F8F9FF", color: "text.primary" },
            }}
          >
            <Close sx={{ fontSize: 16 }} />
          </Box>
        </Box>
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
}

// ─── ReportModal ────────────────────────────────────────────────────────────────
function ReportModal({ target, onClose }) {
  const [selected, setSelected] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <Modal title="신고 완료" onClose={onClose}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            py: 2,
          }}
        >
          <Check sx={{ fontSize: 40, color: "#4ADE80" }} />
          <Typography
            sx={{ color: "text.primary", fontSize: 14, textAlign: "center" }}
          >
            신고가 접수되었습니다.
            <br />
            검토 후 조치하겠습니다.
          </Typography>
          <Button
            onClick={onClose}
            variant="contained"
            sx={{
              mt: 1,
              px: 3,
              py: 1.25,
              borderRadius: "12px",
              fontSize: 14,
            }}
          >
            확인
          </Button>
        </Box>
      </Modal>
    );
  }

  return (
    <Modal title={`${target} 신고`} onClose={onClose}>
      <Typography sx={{ fontSize: 14, color: "text.secondary", mb: 2 }}>
        신고 사유를 선택해주세요.
      </Typography>
      <Box
        sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2.5 }}
      >
        {REPORT_REASONS.map((r) => (
          <Box
            key={r}
            component="button"
            type="button"
            onClick={() => setSelected(r)}
            sx={{
              p: 1.5,
              borderRadius: "12px",
              border: "1px solid",
              fontSize: 14,
              textAlign: "left",
              font: "inherit",
              cursor: "pointer",
              transition: "all .2s",
              color: "text.primary",
              ...(selected === r
                ? { borderColor: "primary.main", bgcolor: "rgba(108,99,255,0.05)" }
                : {
                    borderColor: "divider",
                    bgcolor: "#F8F9FF",
                    "&:hover": { borderColor: "rgba(108,99,255,0.4)" },
                  }),
            }}
          >
            {r}
          </Box>
        ))}
      </Box>
      <Button
        fullWidth
        disabled={!selected}
        onClick={() => setSubmitted(true)}
        variant="contained"
        sx={{
          py: 1.25,
          borderRadius: "12px",
          fontSize: 14,
          "&:hover": { bgcolor: "primary.dark" },
          "&.Mui-disabled": { opacity: 0.4, color: "#fff", bgcolor: "primary.main" },
        }}
      >
        신고 접수
      </Button>
    </Modal>
  );
}

// ─── QnA Tab ─────────────────────────────────────────────────────────────────
function QnaTab() {
  const [qnas, setQnas] = useState(INIT_QNAS);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("전체");
  const [showBookmarked, setShowBookmarked] = useState(false);
  const [reportId, setReportId] = useState(null);

  const toggleBookmark = (id) => {
    setQnas((prev) =>
      prev.map((q) => (q.id === id ? { ...q, bookmarked: !q.bookmarked } : q))
    );
  };

  const filtered = qnas.filter((q) => {
    const matchCat = category === "전체" || q.category === category;
    const matchSearch =
      !search || q.title.includes(search) || q.tags.some((t) => t.includes(search));
    const matchBookmark = !showBookmarked || q.bookmarked;
    return matchCat && matchSearch && matchBookmark;
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box sx={{ position: "relative" }}>
          <Search
            sx={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              fontSize: 16,
              color: "text.secondary",
              pointerEvents: "none",
            }}
          />
          <Box
            component="input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="질문 검색"
            sx={{
              ...inputSx,
              pl: 4.5,
              pr: 2,
              py: 1,
              width: 208,
            }}
          />
        </Box>
        <Box
          component="button"
          type="button"
          onClick={() => setShowBookmarked((b) => !b)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            px: 1.5,
            py: 1,
            borderRadius: "12px",
            border: "1px solid",
            fontSize: 14,
            font: "inherit",
            cursor: "pointer",
            transition: "all .2s",
            ...(showBookmarked
              ? {
                  borderColor: "primary.main",
                  bgcolor: "rgba(108,99,255,0.1)",
                  color: "primary.main",
                }
              : {
                  borderColor: "divider",
                  bgcolor: "#F8F9FF",
                  color: "text.secondary",
                  "&:hover": { color: "text.primary" },
                }),
          }}
        >
          <BookmarkBorder sx={{ fontSize: 14 }} />
          북마크만
        </Box>
      </Box>

      {/* Category pills */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {QNA_CATEGORIES.map((c) => (
          <Box
            key={c}
            component="button"
            type="button"
            onClick={() => setCategory(c)}
            sx={{
              px: 1.5,
              py: 0.75,
              borderRadius: "999px",
              fontSize: 12,
              font: "inherit",
              cursor: "pointer",
              transition: "all .2s",
              ...(category === c
                ? { bgcolor: "primary.main", color: "#fff", border: "1px solid transparent" }
                : {
                    bgcolor: "#F8F9FF",
                    border: "1px solid",
                    borderColor: "divider",
                    color: "text.secondary",
                    "&:hover": { color: "text.primary" },
                  }),
            }}
          >
            {c}
          </Box>
        ))}
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {filtered.map((q) => (
          <Box
            key={q.id}
            sx={{
              borderRadius: "16px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              p: 2.5,
              cursor: "pointer",
              transition: "all .2s",
              "&:hover": {
                boxShadow: 1,
                borderColor: "rgba(108,99,255,0.3)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 1.5,
              }}
            >
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}
                >
                  <Box
                    component="span"
                    sx={{
                      fontSize: 12,
                      bgcolor: "#F8F9FF",
                      border: "1px solid",
                      borderColor: "divider",
                      px: 1,
                      py: 0.25,
                      borderRadius: "999px",
                      color: "text.secondary",
                      flexShrink: 0,
                    }}
                  >
                    {q.category}
                  </Box>
                </Box>
                <Typography
                  sx={{
                    fontWeight: 500,
                    color: "text.primary",
                    mb: 1,
                    lineHeight: 1.4,
                  }}
                >
                  {q.title}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                    {q.tags.map((t) => (
                      <Box
                        key={t}
                        component="span"
                        sx={{
                          fontSize: 12,
                          bgcolor: "rgba(108,99,255,0.1)",
                          color: "primary.main",
                          px: 1,
                          py: 0.25,
                          borderRadius: "999px",
                        }}
                      >
                        {t}
                      </Box>
                    ))}
                  </Box>
                  <Box
                    sx={{
                      ml: "auto",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      fontSize: 12,
                      color: "text.secondary",
                      flexShrink: 0,
                    }}
                  >
                    <Box
                      component="span"
                      sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
                    >
                      <ChatBubbleOutlineOutlined sx={{ fontSize: 12 }} />
                      답변 <Box component="span" sx={{ fontFamily: mono }}>{q.answers}</Box>
                    </Box>
                    <Box component="span">
                      조회 <Box component="span" sx={{ fontFamily: mono }}>{q.views}</Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.25,
                  flexShrink: 0,
                }}
              >
                <Box
                  component="button"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(q.id);
                  }}
                  sx={{
                    p: 0.75,
                    borderRadius: "8px",
                    border: "none",
                    bgcolor: "transparent",
                    cursor: "pointer",
                    display: "inline-flex",
                    transition: "color .2s",
                    color: q.bookmarked ? "primary.main" : "text.secondary",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  {q.bookmarked ? (
                    <BookmarkAdded sx={{ fontSize: 16 }} />
                  ) : (
                    <BookmarkBorder sx={{ fontSize: 16 }} />
                  )}
                </Box>
                <Box
                  component="button"
                  type="button"
                  title="신고"
                  onClick={(e) => {
                    e.stopPropagation();
                    setReportId(q.id);
                  }}
                  sx={{
                    p: 0.75,
                    borderRadius: "8px",
                    border: "none",
                    bgcolor: "transparent",
                    color: "text.secondary",
                    cursor: "pointer",
                    display: "inline-flex",
                    transition: "color .2s",
                    "&:hover": { color: "#EF4444" },
                  }}
                >
                  <OutlinedFlag sx={{ fontSize: 16 }} />
                </Box>
              </Box>
            </Box>
          </Box>
        ))}
        {filtered.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              color: "text.secondary",
              fontSize: 14,
            }}
          >
            {showBookmarked ? "북마크한 질문이 없습니다" : "검색 결과가 없습니다"}
          </Box>
        )}
      </Box>

      {reportId !== null && (
        <ReportModal target="질문" onClose={() => setReportId(null)} />
      )}
    </Box>
  );
}

// ─── Free Board Tab ────────────────────────────────────────────────────────────
function FreeTab() {
  const [posts, setPosts] = useState(INIT_FREE_POSTS);
  const [openId, setOpenId] = useState(null);
  const [showWrite, setShowWrite] = useState(false);
  const [editId, setEditId] = useState(null);
  const [reportId, setReportId] = useState(null);
  const [form, setForm] = useState({ title: "", content: "" });
  const [commentInput, setCommentInput] = useState({});

  const openPost = posts.find((p) => p.id === openId);

  const submit = () => {
    if (!form.title.trim() || !form.content.trim()) return;
    if (editId !== null) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === editId ? { ...p, title: form.title, content: form.content } : p
        )
      );
      setEditId(null);
    } else {
      setPosts((prev) => [
        {
          id: Date.now(),
          title: form.title,
          content: form.content,
          author: "나",
          likes: 0,
          likedByMe: false,
          comments: [],
          time: "방금 전",
          mine: true,
          reported: false,
        },
        ...prev,
      ]);
    }
    setForm({ title: "", content: "" });
    setShowWrite(false);
  };

  const toggleLike = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              likes: p.likedByMe ? p.likes - 1 : p.likes + 1,
              likedByMe: !p.likedByMe,
            }
          : p
      )
    );
  };

  const addComment = (id) => {
    const text = commentInput[id]?.trim();
    if (!text) return;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              comments: [
                ...p.comments,
                { id: Date.now(), user: "나", text, time: "방금 전", mine: true },
              ],
            }
          : p
      )
    );
    setCommentInput((prev) => ({ ...prev, [id]: "" }));
  };

  // ───────────── 글 상세 뷰 ─────────────
  if (openPost) {
    return (
      <Box>
        <Box
          component="button"
          type="button"
          onClick={() => setOpenId(null)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            mb: 2.5,
            fontSize: 14,
            color: "text.secondary",
            border: "none",
            bgcolor: "transparent",
            font: "inherit",
            cursor: "pointer",
            transition: "color .2s",
            "&:hover": { color: "text.primary" },
          }}
        >
          <ArrowBack sx={{ fontSize: 16 }} />
          목록으로
        </Box>

        <Box
          sx={{
            borderRadius: "16px",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            p: 3,
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box>
              <Typography
                component="h2"
                sx={{
                  fontSize: 18,
                  fontWeight: 600,
                  color: "text.primary",
                  mb: 0.5,
                }}
              >
                {openPost.title}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                {openPost.author} · {openPost.time}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              {openPost.mine && (
                <>
                  <Box
                    component="button"
                    type="button"
                    onClick={() => {
                      setForm({ title: openPost.title, content: openPost.content });
                      setEditId(openPost.id);
                      setShowWrite(true);
                    }}
                    sx={{
                      p: 0.75,
                      borderRadius: "8px",
                      border: "none",
                      bgcolor: "transparent",
                      color: "text.secondary",
                      cursor: "pointer",
                      display: "inline-flex",
                      transition: "all .2s",
                      "&:hover": { bgcolor: "#F8F9FF", color: "text.primary" },
                    }}
                  >
                    <EditOutlined sx={{ fontSize: 14 }} />
                  </Box>
                  <Box
                    component="button"
                    type="button"
                    onClick={() => {
                      setPosts((prev) => prev.filter((p) => p.id !== openPost.id));
                      setOpenId(null);
                    }}
                    sx={{
                      p: 0.75,
                      borderRadius: "8px",
                      border: "none",
                      bgcolor: "transparent",
                      color: "text.secondary",
                      cursor: "pointer",
                      display: "inline-flex",
                      transition: "all .2s",
                      "&:hover": { bgcolor: "#F8F9FF", color: "#F87171" },
                    }}
                  >
                    <DeleteOutlined sx={{ fontSize: 14 }} />
                  </Box>
                </>
              )}
              {!openPost.mine && (
                <Box
                  component="button"
                  type="button"
                  onClick={() => setReportId(openPost.id)}
                  sx={{
                    p: 0.75,
                    borderRadius: "8px",
                    border: "none",
                    bgcolor: "transparent",
                    color: "text.secondary",
                    cursor: "pointer",
                    display: "inline-flex",
                    transition: "all .2s",
                    "&:hover": { bgcolor: "#F8F9FF", color: "#EF4444" },
                  }}
                >
                  <OutlinedFlag sx={{ fontSize: 14 }} />
                </Box>
              )}
            </Box>
          </Box>
          <Typography
            sx={{
              fontSize: 14,
              color: "text.primary",
              lineHeight: 1.7,
              whiteSpace: "pre-wrap",
              mb: 2.5,
            }}
          >
            {openPost.content}
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              fontSize: 12,
              borderTop: "1px solid",
              borderColor: "divider",
              pt: 2,
            }}
          >
            <Box
              component="button"
              type="button"
              onClick={() => toggleLike(openPost.id)}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                border: "none",
                bgcolor: "transparent",
                font: "inherit",
                fontSize: 12,
                cursor: "pointer",
                transition: "color .2s",
                color: openPost.likedByMe ? "primary.main" : "text.secondary",
                "&:hover": { color: "primary.main" },
              }}
            >
              {openPost.likedByMe ? (
                <ThumbUp sx={{ fontSize: 14 }} />
              ) : (
                <ThumbUpOutlined sx={{ fontSize: 14 }} />
              )}
              <Box component="span" sx={{ fontFamily: mono }}>{openPost.likes}</Box>
            </Box>
            <Box
              component="span"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                color: "text.secondary",
              }}
            >
              <ChatBubbleOutlineOutlined sx={{ fontSize: 14 }} />
              <Box component="span" sx={{ fontFamily: mono }}>{openPost.comments.length}</Box>
            </Box>
          </Box>
        </Box>

        {/* Comments */}
        <Box
          sx={{
            borderRadius: "16px",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            p: 3,
          }}
        >
          <Typography
            component="h3"
            sx={{ fontWeight: 600, color: "text.primary", mb: 2 }}
          >
            댓글 {openPost.comments.length}개
          </Typography>
          <Box
            sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 2 }}
          >
            {openPost.comments.map((c) => (
              <Box
                key={c.id}
                sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "999px",
                    bgcolor: "rgba(108,99,255,0.2)",
                    color: "primary.main",
                    fontSize: 12,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {c.user[0]}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: "text.primary",
                      }}
                    >
                      {c.user}
                    </Typography>
                    <Typography
                      component="span"
                      sx={{ fontSize: 12, color: "text.secondary" }}
                    >
                      {c.time}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontSize: 14, color: "text.primary" }}>
                    {c.text}
                  </Typography>
                </Box>
                {c.mine && (
                  <Box
                    component="button"
                    type="button"
                    onClick={() =>
                      setPosts((prev) =>
                        prev.map((p) =>
                          p.id === openPost.id
                            ? {
                                ...p,
                                comments: p.comments.filter((cc) => cc.id !== c.id),
                              }
                            : p
                        )
                      )
                    }
                    sx={{
                      p: 0.5,
                      border: "none",
                      bgcolor: "transparent",
                      color: "text.secondary",
                      cursor: "pointer",
                      display: "inline-flex",
                      transition: "color .2s",
                      "&:hover": { color: "#F87171" },
                    }}
                  >
                    <DeleteOutlined sx={{ fontSize: 12 }} />
                  </Box>
                )}
              </Box>
            ))}
            {openPost.comments.length === 0 && (
              <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
                아직 댓글이 없습니다.
              </Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Box
              component="input"
              value={commentInput[openPost.id] ?? ""}
              onChange={(e) =>
                setCommentInput((prev) => ({ ...prev, [openPost.id]: e.target.value }))
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") addComment(openPost.id);
              }}
              placeholder="댓글을 작성해주세요..."
              sx={{ ...inputSx, flex: 1, px: 2, py: 1.25 }}
            />
            <Button
              onClick={() => addComment(openPost.id)}
              variant="contained"
              sx={{
                px: 2,
                py: 1.25,
                borderRadius: "12px",
                fontSize: 14,
                flexShrink: 0,
                "&:hover": { bgcolor: "primary.dark" },
              }}
            >
              등록
            </Button>
          </Box>
        </Box>

        {reportId !== null && (
          <ReportModal target="게시글" onClose={() => setReportId(null)} />
        )}
        {showWrite && (
          <Modal title="게시글 수정" onClose={() => setShowWrite(false)}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box
                component="input"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="제목"
                sx={{ ...inputSx, width: "100%", px: 1.5, py: 1 }}
              />
              <Box
                component="textarea"
                value={form.content}
                onChange={(e) =>
                  setForm((p) => ({ ...p, content: e.target.value }))
                }
                rows={6}
                placeholder="내용"
                sx={{ ...inputSx, width: "100%", px: 1.5, py: 1, resize: "none" }}
              />
              <Button
                onClick={submit}
                fullWidth
                variant="contained"
                sx={{
                  py: 1.25,
                  borderRadius: "12px",
                  fontSize: 14,
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                수정 완료
              </Button>
            </Box>
          </Modal>
        )}
      </Box>
    );
  }

  // ───────────── 글 목록 뷰 ─────────────
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={() => {
            setShowWrite(true);
            setEditId(null);
            setForm({ title: "", content: "" });
          }}
          variant="contained"
          startIcon={<Add sx={{ fontSize: 16 }} />}
          sx={{
            px: 2,
            py: 1,
            borderRadius: "12px",
            fontSize: 14,
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          글쓰기
        </Button>
      </Box>
      {posts
        .filter((p) => !p.reported)
        .map((p) => (
          <Box
            key={p.id}
            sx={{
              borderRadius: "16px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              px: 2.5,
              py: 2,
              transition: "all .2s",
              "&:hover": {
                boxShadow: 1,
                borderColor: "rgba(108,99,255,0.2)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box
                component="button"
                type="button"
                onClick={() => setOpenId(p.id)}
                sx={{
                  flex: 1,
                  textAlign: "left",
                  border: "none",
                  bgcolor: "transparent",
                  font: "inherit",
                  cursor: "pointer",
                  p: 0,
                  minWidth: 0,
                }}
              >
                <Typography
                  sx={{ fontWeight: 500, color: "text.primary" }}
                >
                  {p.title}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mt: 0.5,
                    fontSize: 12,
                    color: "text.secondary",
                  }}
                >
                  <Box component="span">{p.author}</Box>
                  <Box component="span">{p.time}</Box>
                  {p.mine && (
                    <Box
                      component="span"
                      sx={{
                        bgcolor: "rgba(108,99,255,0.1)",
                        color: "primary.main",
                        px: 1,
                        py: 0.25,
                        borderRadius: "999px",
                      }}
                    >
                      내 글
                    </Box>
                  )}
                </Box>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  ml: 1.5,
                  flexShrink: 0,
                }}
              >
                <Box
                  component="button"
                  type="button"
                  onClick={() => toggleLike(p.id)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    fontSize: 12,
                    border: "none",
                    bgcolor: "transparent",
                    font: "inherit",
                    cursor: "pointer",
                    transition: "color .2s",
                    color: p.likedByMe ? "primary.main" : "text.secondary",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  {p.likedByMe ? (
                    <ThumbUp sx={{ fontSize: 12 }} />
                  ) : (
                    <ThumbUpOutlined sx={{ fontSize: 12 }} />
                  )}
                  <Box component="span" sx={{ fontFamily: mono }}>{p.likes}</Box>
                </Box>
                <Box
                  component="span"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    fontSize: 12,
                    color: "text.secondary",
                  }}
                >
                  <ChatBubbleOutlineOutlined sx={{ fontSize: 12 }} />
                  <Box component="span" sx={{ fontFamily: mono }}>{p.comments.length}</Box>
                </Box>
                {p.mine && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
                    <Box
                      component="button"
                      type="button"
                      onClick={() => {
                        setForm({ title: p.title, content: p.content });
                        setEditId(p.id);
                        setShowWrite(true);
                      }}
                      sx={{
                        p: 0.5,
                        border: "none",
                        bgcolor: "transparent",
                        color: "text.secondary",
                        cursor: "pointer",
                        display: "inline-flex",
                        transition: "color .2s",
                        "&:hover": { color: "text.primary" },
                      }}
                    >
                      <EditOutlined sx={{ fontSize: 12 }} />
                    </Box>
                    <Box
                      component="button"
                      type="button"
                      onClick={() =>
                        setPosts((prev) => prev.filter((x) => x.id !== p.id))
                      }
                      sx={{
                        p: 0.5,
                        border: "none",
                        bgcolor: "transparent",
                        color: "text.secondary",
                        cursor: "pointer",
                        display: "inline-flex",
                        transition: "color .2s",
                        "&:hover": { color: "#F87171" },
                      }}
                    >
                      <DeleteOutlined sx={{ fontSize: 12 }} />
                    </Box>
                  </Box>
                )}
                {!p.mine && (
                  <Box
                    component="button"
                    type="button"
                    onClick={() => setReportId(p.id)}
                    sx={{
                      p: 0.5,
                      border: "none",
                      bgcolor: "transparent",
                      color: "text.secondary",
                      cursor: "pointer",
                      display: "inline-flex",
                      transition: "color .2s",
                      "&:hover": { color: "#F87171" },
                    }}
                  >
                    <OutlinedFlag sx={{ fontSize: 12 }} />
                  </Box>
                )}
                <ChevronRight sx={{ fontSize: 16, color: "text.secondary" }} />
              </Box>
            </Box>
          </Box>
        ))}

      {showWrite && (
        <Modal
          title={editId !== null ? "게시글 수정" : "게시글 작성"}
          onClose={() => setShowWrite(false)}
        >
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            <Box>
              <Typography
                component="label"
                sx={{
                  fontSize: 12,
                  color: "text.secondary",
                  mb: 0.5,
                  display: "block",
                }}
              >
                제목 *
              </Typography>
              <Box
                component="input"
                value={form.title}
                onChange={(e) =>
                  setForm((p) => ({ ...p, title: e.target.value }))
                }
                placeholder="제목을 입력하세요"
                sx={{ ...inputSx, width: "100%", px: 1.5, py: 1 }}
              />
            </Box>
            <Box>
              <Typography
                component="label"
                sx={{
                  fontSize: 12,
                  color: "text.secondary",
                  mb: 0.5,
                  display: "block",
                }}
              >
                내용 *
              </Typography>
              <Box
                component="textarea"
                value={form.content}
                onChange={(e) =>
                  setForm((p) => ({ ...p, content: e.target.value }))
                }
                rows={6}
                placeholder="취업 정보, 질문 등 자유롭게 작성해주세요"
                sx={{ ...inputSx, width: "100%", px: 1.5, py: 1, resize: "none" }}
              />
            </Box>
            <Button
              onClick={submit}
              fullWidth
              disabled={!form.title.trim() || !form.content.trim()}
              variant="contained"
              sx={{
                py: 1.25,
                borderRadius: "12px",
                fontSize: 14,
                "&:hover": { bgcolor: "primary.dark" },
                "&.Mui-disabled": {
                  opacity: 0.4,
                  color: "#fff",
                  bgcolor: "primary.main",
                },
              }}
            >
              {editId !== null ? "수정 완료" : "게시글 등록"}
            </Button>
          </Box>
        </Modal>
      )}
      {reportId !== null && (
        <ReportModal target="게시글" onClose={() => setReportId(null)} />
      )}
    </Box>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function CommunityPage() {
  const [tab, setTab] = useState("qna");

  return (
    <Box sx={{ maxWidth: 1152, mx: "auto", px: 2, py: 5 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h1"
          sx={{ fontSize: 30, fontWeight: 700, color: "text.primary" }}
        >
          커뮤니티
        </Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}>
          취준생들과 정보를 나누고 함께 성장해요
        </Typography>
      </Box>

      {/* Tabs */}
      <Stack
        direction="row"
        sx={{
          gap: 0.5,
          bgcolor: "#F8F9FF",
          borderRadius: "12px",
          p: 0.5,
          mb: 4,
          overflowX: "auto",
        }}
      >
        {TABS.map(({ id, label, iconKey }) => {
          const Icon = TAB_ICONS[iconKey];
          const active = tab === id;
          return (
            <Box
              key={id}
              component="button"
              type="button"
              onClick={() => setTab(id)}
              sx={{
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 1,
                borderRadius: "8px",
                fontSize: 14,
                border: "none",
                font: "inherit",
                cursor: "pointer",
                transition: "all .2s",
                ...(active
                  ? {
                      bgcolor: "background.paper",
                      color: "text.primary",
                      boxShadow: 1,
                      fontWeight: 500,
                    }
                  : {
                      bgcolor: "transparent",
                      color: "text.secondary",
                      "&:hover": { color: "text.primary" },
                    }),
              }}
            >
              <Icon sx={{ fontSize: 16 }} />
              {label}
            </Box>
          );
        })}
      </Stack>

      {tab === "qna" && <QnaTab />}
      {tab === "free" && <FreeTab />}
    </Box>
  );
}
