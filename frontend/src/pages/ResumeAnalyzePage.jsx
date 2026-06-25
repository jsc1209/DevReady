import { useState } from 'react'
import {
  Box, Typography, TextField, Button, Stack, Paper,
  LinearProgress, Alert, CircularProgress, Divider,
} from '@mui/material'
import { analyzeResume } from '../api/resumeApi'

// 점수 한 줄: 라벨 + 막대 + 숫자 (score 1~10, job_fit 은 0~10)
const ScoreBar = ({ label, score, note }) => (
  <Box>
    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
      <Typography variant="body2">{label}</Typography>
      <Typography variant="body2" fontWeight={700}>
        {score} / 10{note ? ` · ${note}` : ''}
      </Typography>
    </Stack>
    <LinearProgress variant="determinate" value={score * 10} sx={{ height: 8, borderRadius: 4 }} />
  </Box>
)

// 피드백 리스트 (강점/약점/제안)
const FeedbackList = ({ title, items }) => {
  if (!items || items.length === 0) return null
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>{title}</Typography>
      <Stack spacing={1}>
        {items.map((it, i) => (
          <Typography key={i} variant="body2"
            sx={{ pl: 1, borderLeft: '3px solid', borderColor: 'divider' }}>
            {it}
          </Typography>
        ))}
      </Stack>
    </Box>
  )
}

const ResumeAnalyzePage = () => {
  const [resumeText, setResumeText] = useState('')
  const [jobPosting, setJobPosting] = useState('')
  const [role, setRole] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [result, setResult] = useState(null)

  const isEmpty = resumeText.trim().length === 0
  const isTooLong = resumeText.length > 12000
  const hasPosting = jobPosting.trim().length > 0

  const handleAnalyze = async () => {
    setErrorMsg('')
    setResult(null)
    setIsLoading(true)
    try {
      const data = await analyzeResume({ document: resumeText, jobPosting, role, lang: 'ko' })
      // 서버는 검증 실패·모델 로딩 중에도 HTTP 200 + { ok:false, error } 로 응답
      if (!data.ok) {
        setErrorMsg(data.error || '분석에 실패했습니다.')
        return
      }
      setResult(data.analysis)
    } catch (e) {
      setErrorMsg(
        e.code === 'ECONNABORTED'
          ? '응답 시간이 초과됐습니다. AI 서버 상태를 확인하세요.'
          : 'AI 서버에 연결할 수 없습니다. 서버 실행 여부와 VITE_API_BASE_URL 을 확인하세요.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box sx={{ maxWidth: 880, mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>이력서 분석</Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        자소서·이력서를 붙여넣으면 휴리스틱 점수와 AI 정성 피드백을 받습니다.
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="자소서 / 이력서 (필수)"
          placeholder="분석할 자소서나 이력서 내용을 붙여넣으세요."
          multiline minRows={8} fullWidth
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          helperText={`${resumeText.length} / 12000 자`}
          error={isTooLong}
        />
        <TextField
          label="채용 공고 (선택)"
          placeholder="공고를 넣으면 직무 적합도(job_fit)까지 산출됩니다."
          multiline minRows={3} fullWidth
          value={jobPosting}
          onChange={(e) => setJobPosting(e.target.value)}
        />
        <TextField
          label="목표 직무 (선택)" placeholder="예: 백엔드 개발자" fullWidth
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <Button
          variant="contained" size="large"
          onClick={handleAnalyze}
          disabled={isLoading || isEmpty || isTooLong}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : '분석하기'}
        </Button>
      </Stack>

      {errorMsg && <Alert severity="error" sx={{ mt: 3 }}>{errorMsg}</Alert>}

      {result && (
        <Paper variant="outlined" sx={{ mt: 4, p: { xs: 2, md: 3 } }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
            종합 {result.overall_score} / 10
          </Typography>

          <Stack spacing={2} sx={{ mb: 3 }}>
            <ScoreBar label="구체성 (specificity)" score={result.specificity_score} />
            <ScoreBar label="STAR 구조" score={result.star_score} />
            <ScoreBar
              label="직무 적합도 (job fit)"
              score={result.job_fit_score}
              note={!hasPosting && result.job_fit_score === 0 ? '공고 입력 시 산출' : ''}
            />
          </Stack>

          {result.summary && (
            <Alert severity="info" icon={false} sx={{ mb: 3 }}>{result.summary}</Alert>
          )}

          <Stack spacing={3}>
            <FeedbackList title="강점" items={result.strengths} />
            <Divider />
            <FeedbackList title="약점" items={result.weaknesses} />
            <Divider />
            <FeedbackList title="개선 제안" items={result.suggestions} />
          </Stack>
        </Paper>
      )}
    </Box>
  )
}

export default ResumeAnalyzePage
