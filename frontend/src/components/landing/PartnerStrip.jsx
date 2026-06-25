import { Paper, Box, Stack, Typography, Button, Avatar } from "@mui/material";
import { ChevronRight } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { PARTNER_COMPANIES } from "../../data/landingMock";

export default function PartnerStrip() {
  const navigate = useNavigate();

  return (
    <Paper variant="outlined" sx={{ mt: 3, overflow: "hidden" }}>
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: "0.875rem", color: "text.primary" }}>
          채용 중인 기업
        </Typography>
        <Button
          onClick={() => navigate("/jobs")}
          endIcon={<ChevronRight sx={{ width: 14, height: 14 }} />}
          sx={{
            color: "text.secondary",
            fontSize: "0.75rem",
            textTransform: "none",
            minWidth: 0,
            p: 0,
            "&:hover": { color: "primary.main", backgroundColor: "transparent" },
          }}
        >
          전체보기
        </Button>
      </Box>

      <Box
        sx={{
          px: 2,
          py: 2,
          display: "flex",
          alignItems: "center",
          gap: 2,
          overflowX: "auto",
        }}
      >
        {PARTNER_COMPANIES.map((co) => (
          <Box
            component="button"
            key={co.name}
            onClick={() => navigate("/jobs")}
            sx={{
              flexShrink: 0,
              border: "none",
              background: "none",
              p: 0,
              cursor: "pointer",
            }}
          >
            <Stack alignItems="center" spacing={1}>
              <Avatar
                variant="rounded"
                sx={{
                  bgcolor: co.color,
                  color: co.text,
                  width: 48,
                  height: 48,
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  boxShadow: 1,
                  transition: "transform 0.2s",
                  "button:hover &": { transform: "scale(1.05)" },
                }}
              >
                {co.initial}
              </Avatar>
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                {co.name}
              </Typography>
            </Stack>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
