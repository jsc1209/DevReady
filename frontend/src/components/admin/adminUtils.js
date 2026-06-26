// AdminPage 공유 유틸(비컴포넌트) — 원본 inputCls/csvDownload.
// 컴포넌트(Toast/StatusBadge/Modal/StarRating)는 adminShared.jsx 에 분리.

// 공유 입력 sx (원본 inputCls)
export const inputSx = {
  width: "100%",
  px: 1.5,
  py: 1.25,
  borderRadius: "12px",
  border: "1px solid",
  borderColor: "divider",
  bgcolor: "background.default",
  fontSize: 14,
  font: "inherit",
  outline: "none",
  boxSizing: "border-box",
  "&:focus": {
    borderColor: "primary.main",
    boxShadow: "0 0 0 2px rgba(108,99,255,0.2)",
  },
};

// CSV 다운로드 유틸
export function csvDownload(filename, rows) {
  const content = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob(["﻿" + content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
