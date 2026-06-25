import { Box, Paper, Stack, Typography, TextField, InputAdornment, Button, Chip } from "@mui/material";
import { Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { JOB_CATEGORIES } from "../../data/landingMock";

export default function HeroSearch({ searchQuery, setSearchQuery }) {
  const navigate = useNavigate();

  return (
    <Paper
      square
      elevation={0}
      sx={{
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
        py: 4,
        px: 2,
      }}
    >
      <Box sx={{ maxWidth: 880, mx: "auto", textAlign: "center" }}>
        <Typography variant="h5" fontWeight="bold" color="text.primary" sx={{ mb: 0.5 }}>
          AI가 함께하는{" "}
          <Box component="span" sx={{ color: "primary.main" }}>
            취업 준비
          </Box>
          , 지금 시작하세요
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          공고 검색부터 AI 모의면접까지, 합격의 모든 과정을 지원합니다
        </Typography>

        <Stack direction="row" spacing={1} sx={{ maxWidth: 640, mx: "auto" }}>
          <TextField
            fullWidth
            size="small"
            placeholder="직무, 회사, 기술 스택으로 검색하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") navigate(`/jobs?q=${searchQuery}`);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/jobs?q=${searchQuery}`)}
            sx={{ flexShrink: 0, px: 3, fontWeight: 600 }}
          >
            검색
          </Button>
        </Stack>

        {/* Job category quick links */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 1,
            mt: 2,
          }}
        >
          {JOB_CATEGORIES.map(({ icon: Icon, label }) => (
            <Chip
              key={label}
              clickable
              icon={<Icon sx={{ fontSize: 14 }} />}
              label={label}
              onClick={() => navigate(`/jobs?category=${label}`)}
              size="small"
              sx={{
                bgcolor: "grey.100",
                color: "text.secondary",
                "&:hover": { bgcolor: "action.hover", color: "primary.main" },
              }}
            />
          ))}
        </Box>
      </Box>
    </Paper>
  );
}
