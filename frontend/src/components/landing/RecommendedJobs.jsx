// 랜딩 좌측 사이드바: 오늘의 맞춤 공고 + 바로가기
// test-demo-UI/LandingPage.tsx (lines ~259-350) 의 LEFT aside 를 MUI 로 변환
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Stack,
  Typography,
  Button,
  IconButton,
  Avatar,
} from "@mui/material";
import {
  ChevronRight,
  LocationOn,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import { RECOMMENDED_JOBS, QUICK_LINKS } from "../../data/landingMock";

export default function RecommendedJobs({ savedJobs, toggleSave }) {
  const navigate = useNavigate();

  return (
    <Box
      component="aside"
      sx={{ display: { xs: "none", lg: "block" }, width: 288, flexShrink: 0 }}
    >
      {/* ── Card 1: 오늘의 맞춤 공고 ─────────────────── */}
      <Paper variant="outlined" sx={{ overflow: "hidden" }}>
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
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            오늘의 맞춤 공고
          </Typography>
          <Button
            onClick={() => navigate("/jobs")}
            endIcon={<ChevronRight sx={{ fontSize: 14 }} />}
            sx={{
              minWidth: 0,
              p: 0,
              fontSize: 12,
              color: "text.secondary",
              "& .MuiButton-endIcon": { ml: 0.25 },
              "&:hover": { color: "primary.main", bgcolor: "transparent" },
            }}
          >
            더보기
          </Button>
        </Box>

        <Box>
          {RECOMMENDED_JOBS.map((job) => {
            const dDay = parseInt(job.deadline.replace("D-", ""), 10);
            const isSaved = savedJobs.has(job.id);
            return (
              <Box
                key={job.id}
                onClick={() => navigate(`/jobs/${job.id}`)}
                sx={{
                  px: 2,
                  py: 1.5,
                  cursor: "pointer",
                  borderTop: "1px solid",
                  borderColor: "grey.50",
                  transition: "background-color 0.2s",
                  "&:first-of-type": { borderTop: "none" },
                  "&:hover": { bgcolor: "grey.50" },
                }}
              >
                <Stack direction="row" alignItems="flex-start" spacing={1.25}>
                  {/* left: company avatar */}
                  <Avatar
                    variant="rounded"
                    sx={{
                      bgcolor: job.companyColor,
                      color: job.textColor,
                      width: 32,
                      height: 32,
                      fontSize: 12,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {job.companyInitial}
                  </Avatar>

                  {/* middle */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 0.5,
                      }}
                    >
                      <Typography
                        variant="caption"
                        noWrap
                        sx={{ color: "text.secondary" }}
                      >
                        {job.company}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 0.5,
                          flexShrink: 0,
                        }}
                      >
                        {job.isNew && (
                          <Box
                            component="span"
                            sx={{
                              fontSize: 11,
                              fontWeight: 500,
                              px: 0.75,
                              py: 0.25,
                              borderRadius: 0.75,
                              bgcolor: "#EEF2FF",
                              color: "#6C63FF",
                            }}
                          >
                            NEW
                          </Box>
                        )}
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: 500,
                            color: dDay <= 5 ? "error.main" : "text.secondary",
                          }}
                        >
                          {job.deadline}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      sx={{
                        color: "text.primary",
                        mt: 0.25,
                        lineHeight: 1.3,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {job.title}
                    </Typography>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mt: 0.5,
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "text.secondary",
                          display: "flex",
                          alignItems: "center",
                          gap: 0.25,
                        }}
                      >
                        <LocationOn sx={{ fontSize: 10 }} />
                        {job.location}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: "text.secondary" }}
                      >
                        {job.experience}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        gap: 0.5,
                        mt: 0.75,
                        flexWrap: "wrap",
                      }}
                    >
                      {job.tags.map((tag) => (
                        <Box
                          key={tag}
                          component="span"
                          sx={{
                            fontSize: 11,
                            px: 0.75,
                            py: 0.25,
                            borderRadius: 0.75,
                            bgcolor: "grey.100",
                            color: "text.secondary",
                          }}
                        >
                          {tag}
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  {/* right: save button */}
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSave(job.id);
                    }}
                    size="small"
                    sx={{ flexShrink: 0, mt: 0.25 }}
                  >
                    {isSaved ? (
                      <Favorite sx={{ fontSize: 14, color: "error.light" }} />
                    ) : (
                      <FavoriteBorder
                        sx={{ fontSize: 14, color: "text.disabled" }}
                      />
                    )}
                  </IconButton>
                </Stack>
              </Box>
            );
          })}
        </Box>
      </Paper>

      {/* ── Card 2: 바로가기 ─────────────────────────── */}
      <Paper variant="outlined" sx={{ mt: 2, overflow: "hidden" }}>
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 600, color: "text.primary" }}
          >
            바로가기
          </Typography>
        </Box>
        <Box
          sx={{
            p: 1.5,
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
          }}
        >
          {QUICK_LINKS.map(({ icon: Icon, label, href, highlight }) => (
            <Button
              key={label}
              onClick={() => navigate(href)}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 0.75,
                p: 1,
                textAlign: "center",
                textTransform: "none",
                minWidth: 0,
                color: highlight ? "#4F46E5" : "text.secondary",
                bgcolor: highlight ? "#EEF2FF" : "transparent",
                "&:hover": {
                  bgcolor: highlight ? "#E0E7FF" : "grey.50",
                },
              }}
            >
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: highlight ? "#E0E7FF" : "grey.100",
                }}
              >
                <Icon
                  sx={{
                    fontSize: 16,
                    color: highlight ? "#4F46E5" : "text.secondary",
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                sx={{
                  lineHeight: 1.2,
                  fontWeight: highlight ? 500 : 400,
                  color: highlight ? "#4F46E5" : "text.secondary",
                }}
              >
                {label}
              </Typography>
            </Button>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
