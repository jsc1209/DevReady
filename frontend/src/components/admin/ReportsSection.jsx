import { useState } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { DeleteOutlined } from "@mui/icons-material";
import { Toast, StatusBadge } from "./adminShared";

// ─── mock 데이터 (co-locate) ───
const INIT_REPORTS = [
  { id: 1, type: "게시글", content: "부적절한 언어 사용이 발견되었습니다...", reporter: "김철수", reportedUser: "이영희", reason: "욕설", status: "접수" },
  { id: 2, type: "채팅", content: "반복적인 홍보 메시지 전송...", reporter: "박민준", reportedUser: "최수연", reason: "스팸", status: "접수" },
  { id: 3, type: "게시글", content: "커뮤니티 가이드라인 위반 게시물...", reporter: "정도현", reportedUser: "한지민", reason: "부적절한 콘텐츠", status: "경고처리" },
  { id: 4, type: "게시글", content: "허위 정보를 담은 게시글 발견...", reporter: "이영희", reportedUser: "박민준", reason: "허위정보", status: "접수" },
  { id: 5, type: "채팅", content: "개인정보 요청 메시지...", reporter: "최수연", reportedUser: "정도현", reason: "개인정보침해", status: "삭제처리" },
];

const BOARD_POSTS = [
  { id: 1, tag: "면접후기", author: "김철수", preview: "네이버 프론트엔드 면접 후기 공유합니다. 알고리즘 위주로...", date: "2026-06-08", reports: 0 },
  { id: 2, tag: "면접후기", author: "이영희", preview: "카카오 백엔드 2차 면접 경험담입니다. 시스템 설계 질문이...", date: "2026-06-07", reports: 1 },
  { id: 3, tag: "면접후기", author: "박민준", preview: "토스 풀스택 코딩테스트 후기, 난이도는 중상 정도...", date: "2026-06-06", reports: 0 },
  { id: 4, tag: "질문", author: "최수연", preview: "알고리즘 스터디 모집합니다. 주 2회 온라인 진행...", date: "2026-06-09", reports: 0 },
  { id: 5, tag: "질문", author: "정도현", preview: "CS 기초 같이 공부하실 분 구합니다...", date: "2026-06-08", reports: 0 },
  { id: 6, tag: "자유", author: "한지민", preview: "취준 생활 힘드네요 다들 화이팅입니다...", date: "2026-06-09", reports: 2 },
  { id: 7, tag: "자유", author: "김철수", preview: "DevReady 이용하고 나서 면접 합격했습니다!!", date: "2026-06-07", reports: 0 },
  { id: 8, tag: "자유", author: "이영희", preview: "면접 준비 팁 공유드립니다...", date: "2026-06-06", reports: 0 },
];

const BOARD_TAG_SX = {
  면접후기: { bgcolor: "#DBEAFE", color: "#1D4ED8" }, // blue-100 / blue-700
  질문: { bgcolor: "#FEF3C7", color: "#B45309" }, // amber-100 / amber-700
  자유: { bgcolor: "#F3F4F6", color: "#4B5563" }, // gray-100 / gray-600
};

const mono = "'DM Mono', monospace";

const MAIN_TABS = ["신고 목록", "게시글 전체"];

// 공유 th 스타일
const thSx = {
  px: 2.5,
  py: 1.5,
  textAlign: "left",
  fontSize: 12,
  fontWeight: 500,
  color: "text.secondary",
};

const tdSx = { px: 2.5, py: 2 };

export default function ReportsSection() {
  const [mainTab, setMainTab] = useState("신고 목록");
  const [reports, setReports] = useState(INIT_REPORTS);
  const [boardPosts, setBoardPosts] = useState(BOARD_POSTS);
  const [toast, setToast] = useState("");

  const showMsg = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleWarn = (id) => {
    setReports((prev) => prev.map((x) => (x.id === id ? { ...x, status: "경고처리" } : x)));
    showMsg("경고 메시지가 발송되었습니다");
  };

  const handleDeleteReport = (id) => {
    if (window.confirm("이 콘텐츠를 삭제처리하시겠습니까?")) {
      setReports((prev) => prev.map((x) => (x.id === id ? { ...x, status: "삭제처리" } : x)));
    }
  };

  const handleDeletePost = (id) => {
    if (window.confirm("이 게시글을 삭제하시겠습니까?")) {
      setBoardPosts((prev) => prev.filter((x) => x.id !== id));
      showMsg("게시글이 삭제되었습니다.");
    }
  };

  return (
    <Box>
      <Toast msg={toast} />

      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{ fontSize: 30, fontWeight: 700, color: "text.primary", mb: 1 }}
        >
          자유게시판 관리
        </Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
          게시글 신고 처리 및 관리
        </Typography>
      </Box>

      <Stack direction="row" spacing={0.5} sx={{ mb: 3 }}>
        {MAIN_TABS.map((t) => {
          const active = mainTab === t;
          return (
            <Box
              key={t}
              component="button"
              type="button"
              onClick={() => setMainTab(t)}
              sx={{
                px: 2,
                py: 1,
                borderRadius: "8px",
                fontSize: 14,
                fontWeight: 500,
                border: "none",
                cursor: "pointer",
                font: "inherit",
                transition: "color 0.15s, background-color 0.15s",
                bgcolor: active ? "primary.main" : "#F8F9FF",
                color: active ? "#fff" : "text.secondary",
                "&:hover": active ? {} : { color: "text.primary" },
              }}
            >
              {t}
            </Box>
          );
        })}
      </Stack>

      {mainTab === "신고 목록" && (
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
                  <Box component="th" sx={thSx}>유형</Box>
                  <Box component="th" sx={thSx}>내용 미리보기</Box>
                  <Box component="th" sx={thSx}>신고자</Box>
                  <Box component="th" sx={thSx}>피신고자</Box>
                  <Box component="th" sx={thSx}>사유</Box>
                  <Box component="th" sx={thSx}>상태</Box>
                  <Box component="th" sx={thSx}>작업</Box>
                </Box>
              </Box>
              <Box component="tbody">
                {reports.map((r) => (
                  <Box
                    component="tr"
                    key={r.id}
                    sx={{
                      borderTop: "1px solid",
                      borderColor: "divider",
                      transition: "background-color 0.15s",
                      "&:hover": { bgcolor: "rgba(248,249,255,0.5)" },
                    }}
                  >
                    <Box component="td" sx={tdSx}>
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
                        {r.type}
                      </Box>
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        ...tdSx,
                        fontSize: 14,
                        color: "text.secondary",
                        maxWidth: 320,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.content}
                    </Box>
                    <Box component="td" sx={{ ...tdSx, fontSize: 14, color: "text.primary" }}>
                      {r.reporter}
                    </Box>
                    <Box component="td" sx={{ ...tdSx, fontSize: 14, color: "text.primary" }}>
                      {r.reportedUser}
                    </Box>
                    <Box component="td" sx={{ ...tdSx, fontSize: 14, color: "text.primary" }}>
                      {r.reason}
                    </Box>
                    <Box component="td" sx={tdSx}>
                      <StatusBadge status={r.status} />
                    </Box>
                    <Box component="td" sx={tdSx}>
                      <Stack direction="row" alignItems="center" spacing={0.75}>
                        {r.status === "접수" && (
                          <>
                            <Box
                              component="button"
                              type="button"
                              onClick={() => handleWarn(r.id)}
                              sx={{
                                px: 1.25,
                                py: 0.5,
                                borderRadius: "8px",
                                bgcolor: "#FEF3C7",
                                color: "#B45309",
                                fontSize: 12,
                                border: "none",
                                cursor: "pointer",
                                font: "inherit",
                                transition: "background-color 0.15s",
                                "&:hover": { bgcolor: "#FDE68A" },
                              }}
                            >
                              경고
                            </Box>
                            <Box
                              component="button"
                              type="button"
                              onClick={() => handleDeleteReport(r.id)}
                              sx={{
                                px: 1.25,
                                py: 0.5,
                                borderRadius: "8px",
                                bgcolor: "#FEE2E2",
                                color: "#DC2626",
                                fontSize: 12,
                                border: "none",
                                cursor: "pointer",
                                font: "inherit",
                                transition: "background-color 0.15s",
                                "&:hover": { bgcolor: "#FECACA" },
                              }}
                            >
                              삭제
                            </Box>
                          </>
                        )}
                      </Stack>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {mainTab === "게시글 전체" && (
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
                <Box component="th" sx={thSx}>머릿말</Box>
                <Box component="th" sx={thSx}>작성자</Box>
                <Box component="th" sx={thSx}>내용 미리보기</Box>
                <Box component="th" sx={thSx}>날짜</Box>
                <Box component="th" sx={thSx}>신고수</Box>
                <Box component="th" sx={thSx}>작업</Box>
              </Box>
            </Box>
            <Box component="tbody">
              {boardPosts.map((p) => (
                <Box
                  component="tr"
                  key={p.id}
                  sx={{
                    borderTop: "1px solid",
                    borderColor: "divider",
                    transition: "background-color 0.15s",
                    "&:hover": { bgcolor: "rgba(248,249,255,0.5)" },
                  }}
                >
                  <Box component="td" sx={tdSx}>
                    <Box
                      component="span"
                      sx={{
                        px: 1,
                        py: 0.25,
                        borderRadius: "999px",
                        fontSize: 12,
                        fontWeight: 500,
                        ...BOARD_TAG_SX[p.tag],
                      }}
                    >
                      [{p.tag}]
                    </Box>
                  </Box>
                  <Box
                    component="td"
                    sx={{ ...tdSx, fontSize: 14, fontWeight: 500, color: "text.primary" }}
                  >
                    {p.author}
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
                    {p.preview}
                  </Box>
                  <Box component="td" sx={{ ...tdSx, fontSize: 14, color: "text.secondary" }}>
                    {p.date}
                  </Box>
                  <Box component="td" sx={{ ...tdSx, fontSize: 14 }}>
                    <Box
                      component="span"
                      sx={{
                        fontFamily: mono,
                        color: p.reports > 0 ? "#DC2626" : "text.secondary",
                        fontWeight: p.reports > 0 ? 600 : 400,
                      }}
                    >
                      {p.reports}
                    </Box>
                  </Box>
                  <Box component="td" sx={tdSx}>
                    <Box
                      component="button"
                      type="button"
                      onClick={() => handleDeletePost(p.id)}
                      sx={{
                        p: 0.75,
                        borderRadius: "8px",
                        border: "none",
                        bgcolor: "transparent",
                        cursor: "pointer",
                        display: "flex",
                        color: "text.secondary",
                        transition: "background-color 0.15s, color 0.15s",
                        "&:hover": { bgcolor: "#FEF2F2", color: "#EF4444" },
                      }}
                    >
                      <DeleteOutlined sx={{ fontSize: 16 }} />
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
