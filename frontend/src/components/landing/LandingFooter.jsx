import { Box, Stack, Typography, Button } from '@mui/material';

const FOOTER_LINKS = [
  '이용약관',
  '개인정보처리방침',
  '고객센터',
  '공지사항',
  '회사소개',
  '광고문의',
];

export default function LandingFooter() {
  return (
    <Box
      component="footer"
      sx={{
        mt: 6,
        borderTop: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
        py: 4,
        px: 2,
      }}
    >
      <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
          spacing={3}
          sx={{ mb: 3 }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 2,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography
                component="span"
                sx={{
                  color: '#fff',
                  fontWeight: 900,
                  letterSpacing: '-0.05em',
                  lineHeight: 1,
                  fontSize: 13,
                }}
              >
                DR
              </Typography>
            </Box>
            <Typography sx={{ fontWeight: 700, color: 'text.primary' }}>
              DevReady
            </Typography>
          </Stack>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              columnGap: 1,
              rowGap: 0.5,
            }}
          >
            {FOOTER_LINKS.map((link) => (
              <Button
                key={link}
                disableRipple
                sx={{
                  minWidth: 0,
                  p: 0,
                  fontSize: 12,
                  fontWeight: 400,
                  textTransform: 'none',
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'text.primary',
                    bgcolor: 'transparent',
                  },
                }}
              >
                {link}
              </Button>
            ))}
          </Box>
        </Stack>

        <Stack spacing={0.5}>
          <Typography variant="caption" color="text.secondary">
            (주)DevReady | 대표: 홍길동 | 사업자등록번호: 000-00-00000 | 통신판매업신고: 제0000-서울강남-0000호
          </Typography>
          <Typography variant="caption" color="text.secondary">
            서울특별시 강남구 테헤란로 000, 00층 | 고객센터: 02-0000-0000 | 이메일: help@interviewai.kr
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            © 2026 DevReady Corp. All rights reserved.
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
}
