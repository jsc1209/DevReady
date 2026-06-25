import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  Stack,
} from "@mui/material";
import { Close, Description, CheckCircle, InfoOutlined } from "@mui/icons-material";

/**
 * 입사 지원(자기소개서 작성) 모달 (test-demo-UI/ApplicationForm.tsx → JS+MUI Dialog).
 * 공고 상세에서 쓰는 재사용 컴포넌트. react-hook-form 미사용(원본대로 useState 제어형).
 * props (원본 시그니처 유지):
 *  - jobTitle: string
 *  - company: string
 *  - questions: { id, question }[]
 *  - onClose: () => void
 *  - onSubmit: (answers: { [id]: string }) => void
 */
export function ApplicationForm({ jobTitle, company, questions, onClose, onSubmit }) {
  const [answers, setAnswers] = useState(() =>
    questions.reduce((acc, q) => ({ ...acc, [q.id]: "" }), {})
  );
  const [errors, setErrors] = useState({});

  const handleSubmit = () => {
    const newErrors = {};
    questions.forEach((q) => {
      if (!answers[q.id]?.trim()) {
        newErrors[q.id] = true;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit(answers);
  };

  const getCharCount = (id) => answers[id]?.length || 0;

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { borderRadius: "16px", maxHeight: "90vh" } }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          p: 3,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              bgcolor: "rgba(108,99,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Description sx={{ fontSize: 24, color: "primary.main" }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, color: "text.primary" }}>
              {company} 입사 지원
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.25 }}>
              {jobTitle}
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} aria-label="닫기" size="small">
          <Close sx={{ fontSize: 20, color: "text.secondary" }} />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent dividers sx={{ p: 3 }}>
        {/* 작성 안내 박스 */}
        <Box
          sx={{
            borderRadius: "12px",
            bgcolor: "#EFF6FF",
            border: "1px solid #BFDBFE",
            p: 2,
            mb: 3,
            display: "flex",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <InfoOutlined sx={{ fontSize: 20, color: "#2563EB", flexShrink: 0, mt: 0.25 }} />
          <Box>
            <Typography variant="body2" sx={{ color: "#1E3A8A", fontWeight: 500, mb: 0.5 }}>
              자기소개서 작성 안내
            </Typography>
            <Typography variant="caption" sx={{ color: "#1E40AF", lineHeight: 1.6 }}>
              모든 질문에 성실히 답변해주세요. 작성된 내용을 바탕으로 AI 모의 면접을 진행할 수 있습니다.
            </Typography>
          </Box>
        </Box>

        {/* 질문 목록 */}
        <Stack spacing={3}>
          {questions.map((q, idx) => {
            const charCount = getCharCount(q.id);
            const hasError = errors[q.id];
            return (
              <Box key={q.id}>
                <Stack direction="row" spacing={1} alignItems="flex-start" sx={{ mb: 1 }}>
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                      fontWeight: 500,
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </Box>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, color: "text.primary", flex: 1 }}
                  >
                    {q.question}
                  </Typography>
                </Stack>
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  value={answers[q.id] || ""}
                  onChange={(e) => {
                    setAnswers({ ...answers, [q.id]: e.target.value });
                    if (errors[q.id]) {
                      setErrors({ ...errors, [q.id]: false });
                    }
                  }}
                  error={hasError}
                  helperText={hasError ? "이 항목은 필수입니다" : ""}
                  placeholder="여기에 답변을 작성해주세요 (200자 이상 권장)"
                />
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    mt: 0.5,
                    fontSize: 12,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      color: charCount >= 200 ? "success.main" : "text.secondary",
                    }}
                  >
                    {charCount >= 200 ? (
                      <>
                        <CheckCircle sx={{ fontSize: 14 }} />
                        적절한 분량입니다
                      </>
                    ) : (
                      `200자 이상 권장 (현재 ${charCount}자)`
                    )}
                  </Box>
                  <Box component="span" sx={{ color: "text.secondary" }}>
                    {charCount}자
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </DialogContent>

      {/* Footer */}
      <DialogActions sx={{ p: 3, gap: 1.5 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ flex: 1, py: 1.25, color: "text.primary", borderColor: "divider" }}
        >
          취소
        </Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ flex: 1, py: 1.25 }}>
          제출하기
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ApplicationForm;
