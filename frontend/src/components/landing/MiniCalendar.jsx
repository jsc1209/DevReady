import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  Button,
  LinearProgress,
} from "@mui/material";
import {
  CalendarMonth,
  ChevronLeft,
  ChevronRight,
  School,
} from "@mui/icons-material";
import {
  CALENDAR_EVENTS,
  LEARNING_COURSES,
  LEARNING_OVERALL,
} from "../../data/landingMock";

const WEEK_DAYS = ["일", "월", "화", "수", "목", "금", "토"];
const CAL_TODAY = new Date(2026, 5, 16);

function calDaysInMonth(y, m) {
  return new Date(y, m + 1, 0).getDate();
}
function calFirstWeekday(y, m) {
  return new Date(y, m, 1).getDay();
}
function calDateStr(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}
function calDaysUntil(dateStr) {
  const d = new Date(dateStr);
  d.setHours(23, 59, 59, 999);
  return Math.ceil((d.getTime() - CAL_TODAY.getTime()) / 86400000);
}

export default function MiniCalendar() {
  const navigate = useNavigate();
  const [calView, setCalView] = useState({
    year: CAL_TODAY.getFullYear(),
    month: CAL_TODAY.getMonth(),
  });
  const [selectedDate, setSelectedDate] = useState(null);

  function shiftMonth(delta) {
    setCalView((prev) => {
      const next = new Date(prev.year, prev.month + delta, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });
    setSelectedDate(null);
  }

  return (
    <Paper variant="outlined" sx={{ overflow: "hidden" }}>
      {/* 헤더: 연·월 + 이전/다음 */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1}>
          <CalendarMonth sx={{ color: "primary.main", fontSize: 16 }} />
          <Typography sx={{ fontWeight: 600, fontSize: 14, color: "text.primary" }}>
            {calView.year}년 {calView.month + 1}월 일정
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButton
            onClick={() => shiftMonth(-1)}
            aria-label="이전 달"
            size="small"
            sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}
          >
            <ChevronLeft sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            onClick={() => shiftMonth(1)}
            aria-label="다음 달"
            size="small"
            sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}
          >
            <ChevronRight sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>
      </Box>

      {/* 월 달력 그리드 */}
      <Box sx={{ px: 2, pt: 1.5, pb: 1 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            mb: 0.5,
          }}
        >
          {WEEK_DAYS.map((d, i) => (
            <Box
              key={d}
              sx={{
                textAlign: "center",
                fontSize: 11,
                py: 0.5,
                color:
                  i === 0
                    ? "error.main"
                    : i === 6
                    ? "info.main"
                    : "text.secondary",
              }}
            >
              {d}
            </Box>
          ))}
        </Box>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            rowGap: 0.5,
          }}
        >
          {(() => {
            const cells = [];
            const firstWd = calFirstWeekday(calView.year, calView.month);
            const total = calDaysInMonth(calView.year, calView.month);
            const todayStr = calDateStr(
              CAL_TODAY.getFullYear(),
              CAL_TODAY.getMonth(),
              CAL_TODAY.getDate()
            );
            for (let i = 0; i < firstWd; i++)
              cells.push(<Box key={`blank-${i}`} />);
            for (let day = 1; day <= total; day++) {
              const ds = calDateStr(calView.year, calView.month, day);
              const evs = CALENDAR_EVENTS.filter((e) => e.date === ds);
              const isToday = ds === todayStr;
              const isSelected = ds === selectedDate;
              cells.push(
                <Box
                  component="button"
                  key={ds}
                  onClick={() =>
                    setSelectedDate((prev) => (prev === ds ? null : ds))
                  }
                  title={
                    evs.length > 0
                      ? evs.map((e) => `${e.company} · ${e.type}`).join(", ")
                      : "일정 없음"
                  }
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    py: 0.25,
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    p: 0,
                    "&:hover .day-num": {
                      bgcolor: isToday || isSelected ? undefined : "action.hover",
                    },
                  }}
                >
                  <Box
                    className="day-num"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      fontSize: 12,
                      transition: "background-color 0.15s",
                      ...(isToday
                        ? {
                            bgcolor: "primary.main",
                            color: "#fff",
                            fontWeight: 600,
                          }
                        : isSelected
                        ? {
                            bgcolor: "primary.light",
                            color: "primary.dark",
                            fontWeight: 600,
                            border: "1px solid",
                            borderColor: "primary.light",
                          }
                        : { color: "text.primary" }),
                    }}
                  >
                    {day}
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "2px",
                      height: 6,
                      mt: 0.25,
                    }}
                  >
                    {evs.slice(0, 3).map((e, idx) => (
                      <Box
                        key={idx}
                        sx={{
                          width: 4,
                          height: 4,
                          borderRadius: "50%",
                          backgroundColor: e.color,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              );
            }
            return cells;
          })()}
        </Box>
      </Box>

      {/* 일정: 날짜 선택 시 해당 날짜 일정, 아니면 다가오는 일정 */}
      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          px: 2,
          py: 1.5,
        }}
      >
        {selectedDate ? (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mb: 0.75,
              }}
            >
              <Typography
                sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary" }}
              >
                {Number(selectedDate.split("-")[1])}월{" "}
                {Number(selectedDate.split("-")[2])}일 일정
              </Typography>
              <Box
                component="button"
                onClick={() => setSelectedDate(null)}
                sx={{
                  fontSize: 11,
                  color: "primary.main",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  p: 0,
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                다가오는 일정 보기
              </Box>
            </Box>
            {(() => {
              const dayEvents = CALENDAR_EVENTS.filter(
                (e) => e.date === selectedDate
              );
              if (dayEvents.length === 0) {
                return (
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "text.secondary",
                      px: 0.75,
                      py: 1,
                    }}
                  >
                    이 날은 등록된 일정이 없습니다.
                  </Typography>
                );
              }
              return dayEvents.map((e) => {
                const dday = calDaysUntil(e.date);
                return (
                  <Box
                    component="button"
                    key={e.date + e.company}
                    onClick={() => navigate("/calendar")}
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                      textAlign: "left",
                      borderRadius: 2,
                      px: 0.75,
                      py: 0.75,
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        flexShrink: 0,
                        backgroundColor: e.color,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: 14,
                        color: "text.primary",
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {e.company} · {e.type}
                    </Typography>
                    <Box
                      sx={{
                        fontSize: 11,
                        fontWeight: 600,
                        px: 0.75,
                        py: 0.25,
                        borderRadius: 999,
                        flexShrink: 0,
                        ...(dday === 0
                          ? { bgcolor: "error.main", color: "#fff" }
                          : dday > 0 && dday <= 3
                          ? { bgcolor: "#FFEDD5", color: "#EA580C" }
                          : dday > 0
                          ? { bgcolor: "action.hover", color: "text.secondary" }
                          : {
                              bgcolor: "action.hover",
                              color: "text.secondary",
                            }),
                      }}
                    >
                      {dday === 0 ? "D-DAY" : dday > 0 ? `D-${dday}` : "지난 일정"}
                    </Box>
                  </Box>
                );
              });
            })()}
          </>
        ) : (
          <>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 600,
                color: "text.secondary",
                mb: 0.75,
              }}
            >
              다가오는 일정
            </Typography>
            {CALENDAR_EVENTS.filter((e) => calDaysUntil(e.date) >= 0)
              .sort((a, b) => a.date.localeCompare(b.date))
              .slice(0, 3)
              .map((e) => {
                const dday = calDaysUntil(e.date);
                const [, mm, dd] = e.date.split("-");
                return (
                  <Box
                    component="button"
                    key={e.date + e.company}
                    onClick={() => setSelectedDate(e.date)}
                    sx={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: 1.25,
                      textAlign: "left",
                      borderRadius: 2,
                      px: 0.75,
                      py: 0.75,
                      border: "none",
                      background: "none",
                      cursor: "pointer",
                      "&:hover": { bgcolor: "action.hover" },
                    }}
                  >
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        flexShrink: 0,
                        backgroundColor: e.color,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: 12,
                        color: "text.secondary",
                        width: 36,
                        flexShrink: 0,
                      }}
                    >
                      {Number(mm)}/{Number(dd)}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 14,
                        color: "text.primary",
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {e.company} · {e.type}
                    </Typography>
                    <Box
                      sx={{
                        fontSize: 11,
                        fontWeight: 600,
                        px: 0.75,
                        py: 0.25,
                        borderRadius: 999,
                        flexShrink: 0,
                        ...(dday === 0
                          ? { bgcolor: "error.main", color: "#fff" }
                          : dday <= 3
                          ? { bgcolor: "#FFEDD5", color: "#EA580C" }
                          : { bgcolor: "action.hover", color: "text.secondary" }),
                      }}
                    >
                      {dday === 0 ? "D-DAY" : `D-${dday}`}
                    </Box>
                  </Box>
                );
              })}
          </>
        )}
      </Box>

      {/* 학습 진행도 (교육센터 연동) */}
      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          px: 2,
          py: 1.5,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 1.25,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={0.75}>
            <School sx={{ color: "primary.main", fontSize: 14 }} />
            <Typography
              sx={{ fontSize: 12, fontWeight: 600, color: "text.secondary" }}
            >
              학습 진행도
            </Typography>
          </Stack>
          <Box
            component="button"
            onClick={() => navigate("/education")}
            sx={{
              fontSize: 11,
              color: "primary.main",
              display: "flex",
              alignItems: "center",
              gap: 0.25,
              border: "none",
              background: "none",
              cursor: "pointer",
              p: 0,
              "&:hover": { textDecoration: "underline" },
            }}
          >
            교육센터 <ChevronRight sx={{ fontSize: 12 }} />
          </Box>
        </Box>

        {/* 전체 진행률 */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1.25,
          }}
        >
          <Typography
            sx={{ fontSize: 12, color: "text.secondary", width: 32, flexShrink: 0 }}
          >
            전체
          </Typography>
          <LinearProgress
            variant="determinate"
            value={LEARNING_OVERALL}
            sx={{
              flex: 1,
              height: 6,
              borderRadius: 999,
              bgcolor: "action.hover",
              "& .MuiLinearProgress-bar": {
                borderRadius: 999,
                background: "linear-gradient(90deg,#6C63FF,#8B5CF6)",
              },
            }}
          />
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 600,
              color: "text.primary",
              width: 36,
              textAlign: "right",
            }}
          >
            {LEARNING_OVERALL}%
          </Typography>
        </Box>

        {/* 강의별 진행률 */}
        <Stack spacing={1}>
          {LEARNING_COURSES.slice(0, 2).map((c) => {
            const pct = Math.round((c.done / c.total) * 100);
            return (
              <Box
                component="button"
                key={c.title}
                onClick={() => navigate("/education")}
                sx={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  textAlign: "left",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  p: 0,
                  "&:hover .course-title": { color: "primary.main" },
                }}
              >
                <Typography
                  className="course-title"
                  sx={{
                    fontSize: 12,
                    color: "text.secondary",
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    transition: "color 0.15s",
                  }}
                >
                  {c.title}
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{
                    width: 64,
                    height: 6,
                    borderRadius: 999,
                    flexShrink: 0,
                    bgcolor: "action.hover",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 999,
                      backgroundColor: c.color,
                    },
                  }}
                />
                <Typography
                  sx={{
                    fontSize: 11,
                    color: "text.secondary",
                    width: 32,
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  {pct}%
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Box>

      {/* 전체보기 */}
      <Box
        sx={{
          borderTop: "1px solid",
          borderColor: "divider",
          p: 1.5,
          textAlign: "center",
        }}
      >
        <Button
          onClick={() => navigate("/calendar")}
          endIcon={<ChevronRight />}
          sx={{
            fontSize: 14,
            color: "text.secondary",
            textTransform: "none",
            "&:hover": { color: "primary.main", bgcolor: "transparent" },
          }}
        >
          캘린더 전체보기
        </Button>
      </Box>
    </Paper>
  );
}
