import { Box, Paper, Stack, Typography, Button, Divider } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const STATS = [
  { label: '누적 면접 세션', value: '12,400+' },
  { label: '등록 기업', value: '1,240+' },
  { label: '채용 공고', value: '3,890' },
  { label: '합격 후기', value: '2,100+' },
];

const TRENDING_KEYWORDS = [
  'React 18',
  'TypeScript',
  'Next.js',
  'Spring Boot',
  'Kubernetes',
  'LLM 파인튜닝',
];

export default function RightSidebar() {
  const navigate = useNavigate();

  return (
    <Box
      component="aside"
      sx={{ display: { xs: 'none', xl: 'block' }, width: 224, flexShrink: 0 }}
    >
      <Stack spacing={2}>
        {/* CTA card */}
        <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
          <Box
            sx={{
              position: 'relative',
              width: 48,
              height: 48,
              borderRadius: '14px',
              mx: 'auto',
              mb: 1.5,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                'linear-gradient(135deg,#7B6CFF 0%,#6C63FF 50%,#8B5CF6 100%)',
              boxShadow: '0 8px 20px -4px rgba(108,99,255,0.5)',
            }}
          >
            {/* 상단 광택 하이라이트 */}
            <Box
              sx={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                height: '50%',
                pointerEvents: 'none',
                background:
                  'linear-gradient(to bottom, rgba(255,255,255,0.28), transparent)',
              }}
            />
            <Typography
              sx={{
                color: '#fff',
                lineHeight: 1,
                fontSize: '20px',
                fontWeight: 700,
                letterSpacing: '-0.03em',
              }}
            >
              DR
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
            지금 무료로 시작
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 1.5 }}>
            가입하고 AI 면접
            <br />
            무료 체험 1회 제공
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={() => navigate('/auth')}
            sx={{ fontWeight: 600 }}
          >
            회원가입
          </Button>
          <Button
            variant="text"
            fullWidth
            onClick={() => navigate('/auth')}
            sx={{ mt: 1, color: 'text.secondary' }}
          >
            로그인
          </Button>
        </Paper>

        {/* Stats */}
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary', display: 'block', mb: 1.5 }}>
            플랫폼 현황
          </Typography>
          {STATS.map((stat, i) => (
            <Box key={stat.label}>
              {i > 0 && <Divider />}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  py: 0.75,
                }}
              >
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {stat.label}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  {stat.value}
                </Typography>
              </Box>
            </Box>
          ))}
        </Paper>

        {/* Trending keywords */}
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              color: 'text.primary',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              mb: 1.5,
            }}
          >
            <TrendingUp sx={{ fontSize: 14, color: 'primary.main' }} />
            급상승 키워드
          </Typography>
          {TRENDING_KEYWORDS.map((kw, i) => (
            <Button
              key={kw}
              onClick={() => navigate(`/jobs?q=${kw}`)}
              sx={{
                width: '100%',
                justifyContent: 'flex-start',
                gap: 1,
                py: 0.75,
                px: 0,
                fontSize: '0.75rem',
                color: 'text.secondary',
                textTransform: 'none',
                '&:hover': { color: 'primary.main', bgcolor: 'transparent' },
              }}
            >
              <Box
                component="span"
                sx={{
                  width: 16,
                  textAlign: 'center',
                  fontWeight: 700,
                  color: i < 3 ? 'primary.main' : 'text.disabled',
                }}
              >
                {i + 1}
              </Box>
              {kw}
            </Button>
          ))}
        </Paper>

        {/* SNS login hint */}
        <Box
          sx={{
            bgcolor: '#FEFCE8',
            border: '1px solid',
            borderColor: '#FEF08A',
            borderRadius: 3,
            p: 2,
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: '#854D0E', fontWeight: 500, display: 'block', mb: 0.5 }}>
            SNS 간편 로그인 지원
          </Typography>
          <Typography variant="caption" sx={{ color: '#CA8A04', display: 'block' }}>
            카카오 · 네이버 · 구글
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}
