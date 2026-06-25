import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, Paper, Stack, Typography, IconButton } from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Notifications,
  NotificationsOff,
  AccessTime,
  WarningAmber,
  InfoOutlined,
  School,
} from "@mui/icons-material";
import { completedOnDate, achievementHistory, completionRate } from "../data/checklist";
import {
  JOB_EVENTS,
  EDU_EVENTS,
  LEARNING_COURSES,
  LEARNING_OVERALL,
  DAYS_OF_WEEK,
} from "../data/calendarMock";

const mono = "'DM Mono', monospace";

// ★ 데모 결정성: MiniCalendar(CAL_TODAY = new Date(2026,5,16))와 '오늘'·D-day 를 일치시킨다.
//   원본은 real new Date()/Date.now() 이지만 같은 앱·같은 이벤트셋에서 두 캘린더가 어긋나면 안 되므로 고정.
const TODAY = new Date(2026, 5, 16);

function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function daysUntil(dateStr) {
  const d = new Date(dateStr);
  d.setHours(23, 59, 59, 999);
  return Math.ceil((d.getTime() - TODAY.getTime()) / 86400000);
}

// 알림 뱃지(상단 배너/사이드바 공용) — 원본 cls 색을 인라인 hex 로 변환.
function alertBadge(days) {
  if (days === 1) return { label: "D-1", sx: { bgcolor: "#EF4444", color: "#fff" }, icon: "🚨" };
  if (days === 3) return { label: "D-3", sx: { bgcolor: "#FB923C", color: "#fff" }, icon: "⚠️" };
  if (days <= 0) return { label: "마감", sx: { bgcolor: "#9CA3AF", color: "#fff" }, icon: "🔒" };
  if (days <= 7) return { label: `D-${days}`, sx: { bgcolor: "#FACC15", color: "#111827" }, icon: "⏰" };
  return null;
}

export default function CalendarPage() {
  const navigate = useNavigate();
  const now = TODAY;
  const [searchParams] = useSearchParams();
  const calType = searchParams.get("type") === "edu" ? "edu" : "job";
  const events = calType === "edu" ? EDU_EVENTS : JOB_EVENTS;
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(5);
  const [selected, setSelected] = useState(null);
  const [notifications, setNotifications] = useState(
    Object.fromEntries([...JOB_EVENTS, ...EDU_EVENTS].map((e) => [e.id, true]))
  );

  const totalDays = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => {
    if (month === 0) {
      setYear((y) => y - 1);
      setMonth(11);
    } else setMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) {
      setYear((y) => y + 1);
      setMonth(0);
    } else setMonth((m) => m + 1);
  };

  // Build calendar cells (7-wide rows)
  const dayCells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];
  while (dayCells.length % 7 !== 0) dayCells.push(null);

  // Split into weeks
  const weeks = [];
  for (let i = 0; i < dayCells.length; i += 7) {
    weeks.push(dayCells.slice(i, i + 7));
  }

  const today = now.getDate();
  const isCurrentMonth = now.getFullYear() === year && now.getMonth() === month;

  // Deadline alerts: D-1 and D-3
  const alertEvents = events.filter((e) => {
    const d = daysUntil(e.end);
    return d === 1 || d === 3;
  });

  // Upcoming within 7 days (for sidebar)
  const upcomingEvents = events
    .filter((e) => {
      const d = daysUntil(e.end);
      return d >= 0 && d <= 7;
    })
    .sort((a, b) => a.end.localeCompare(b.end));

  const toggleNotification = (id, ev) => {
    ev.stopPropagation();
    setNotifications((n) => ({ ...n, [id]: !n[id] }));
  };

  // 항목 클릭 시 이동: 공고 → 공고 상세, 교육 → 교육센터
  const goEvent = (e) => navigate(calType === "edu" ? "/education" : `/jobs/${e.id}`);
  const endWord = calType === "edu" ? "종료" : "마감"; // 교육은 '종료', 공고는 '마감'

  return (
    <Box sx={{ maxWidth: 1152, mx: "auto", px: 2, py: 5 }}>
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 30, fontWeight: 700, color: "text.primary" }}>
          {calType === "edu" ? "교육 캘린더" : "공고 캘린더"}
        </Typography>
        <Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}>
          {calType === "edu"
            ? "수강 중인 강의 일정을 한눈에 관리하세요"
            : "찜한 공고의 시작일~마감일을 한눈에 관리하세요"}
        </Typography>
      </Box>

      {/* D-1 / D-3 Alert banner */}
      {alertEvents.length > 0 && (
        <Paper
          elevation={0}
          sx={{
            borderRadius: "16px",
            border: "1px solid",
            borderColor: "#FECACA",
            bgcolor: "#FEF2F2",
            p: 2,
            mb: 3,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <WarningAmber sx={{ fontSize: 16, color: "#EF4444" }} />
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#B91C1C" }}>
              {endWord} 임박 알림
            </Typography>
            <Typography sx={{ fontSize: 12, color: "#EF4444" }}>D-1·D-3 자동 감지</Typography>
          </Box>
          <Stack sx={{ gap: 1 }}>
            {alertEvents.map((e) => {
              const days = daysUntil(e.end);
              const badge = alertBadge(days);
              return (
                <Box
                  key={e.id}
                  onClick={() => goEvent(e)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    bgcolor: "background.paper",
                    borderRadius: "12px",
                    px: 2,
                    py: 1.5,
                    border: "1px solid",
                    borderColor: "#FEE2E2",
                    cursor: "pointer",
                    transition: "border-color 0.15s",
                    "&:hover": { borderColor: "#FCA5A5" },
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{ width: 12, height: 12, borderRadius: "999px", flexShrink: 0, backgroundColor: e.color }}
                    />
                    <Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 500, color: "#111827" }}>
                        {e.company} · {e.title}
                      </Typography>
                      <Box sx={{ fontSize: 12, color: "#6B7280", display: "flex", alignItems: "center", gap: 0.5, mt: 0.25 }}>
                        <AccessTime sx={{ fontSize: 12 }} />
                        {endWord}: {e.end}
                      </Box>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      component="span"
                      sx={{ fontSize: 12, fontWeight: 700, px: 1.25, py: 0.5, borderRadius: "999px", ...badge.sx }}
                    >
                      {badge.icon} {badge.label}
                    </Box>
                    <IconButton
                      onClick={(ev) => toggleNotification(e.id, ev)}
                      title={notifications[e.id] ? "알림 켜짐" : "알림 꺼짐"}
                      sx={{
                        p: 0.75,
                        borderRadius: "8px",
                        color: notifications[e.id] ? "#F97316" : "#D1D5DB",
                        "&:hover": { bgcolor: notifications[e.id] ? "#FFF7ED" : "#F9FAFB" },
                      }}
                    >
                      {notifications[e.id] ? (
                        <Notifications sx={{ fontSize: 16 }} />
                      ) : (
                        <NotificationsOff sx={{ fontSize: 16 }} />
                      )}
                    </IconButton>
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Paper>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "repeat(3, 1fr)" },
          gap: 3,
        }}
      >
        {/* Calendar */}
        <Paper
          elevation={0}
          sx={{
            gridColumn: { lg: "span 2" },
            borderRadius: "16px",
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "background.paper",
            p: 3,
          }}
        >
          {/* Month nav */}
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2.5 }}>
            <IconButton
              onClick={prevMonth}
              sx={{ p: 1, borderRadius: "8px", "&:hover": { bgcolor: "#F8F9FF" } }}
            >
              <ChevronLeft sx={{ fontSize: 16, color: "text.secondary" }} />
            </IconButton>
            <Typography sx={{ fontWeight: 600, fontSize: 16, color: "text.primary" }}>
              {year}년 {month + 1}월
            </Typography>
            <IconButton
              onClick={nextMonth}
              sx={{ p: 1, borderRadius: "8px", "&:hover": { bgcolor: "#F8F9FF" } }}
            >
              <ChevronRight sx={{ fontSize: 16, color: "text.secondary" }} />
            </IconButton>
          </Box>

          {/* Day of week header */}
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", mb: 0.5 }}>
            {DAYS_OF_WEEK.map((d, i) => (
              <Box
                key={d}
                sx={{
                  textAlign: "center",
                  fontSize: 12,
                  fontWeight: 500,
                  py: 0.75,
                  color: i === 0 ? "#F87171" : i === 6 ? "#60A5FA" : "text.secondary",
                }}
              >
                {d}
              </Box>
            ))}
          </Box>

          {/* Week rows with event dots (메인 미니 캘린더 방식) */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.25 }}>
            {weeks.map((week, wi) => (
              <Box key={wi} sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.25 }}>
                {week.map((day, di) => {
                  if (!day) return <Box key={`e-${di}`} />;
                  const dateStr = toDateStr(year, month, day);
                  const isToday = isCurrentMonth && day === today;
                  const isSelected = selected === dateStr;
                  // 해당 날짜에 진행 중인 일정(시작~마감)을 점으로 표시
                  const dayEvents = events.filter((e) => e.start <= dateStr && e.end >= dateStr);
                  const hasDead = events.some((e) => e.end === dateStr);
                  const days = hasDead ? daysUntil(dateStr) : null;
                  // 교육 캘린더: 해당 날짜에 달성한 체크리스트
                  const dayChecks = calType === "edu" ? completedOnDate(dateStr) : [];

                  let cellStateSx;
                  if (isSelected) cellStateSx = { bgcolor: "rgba(108,99,255,0.1)", borderColor: "rgba(108,99,255,0.4)" };
                  else if (isToday) cellStateSx = { bgcolor: "#EEF2FF", borderColor: "rgba(108,99,255,0.2)" };
                  else cellStateSx = { borderColor: "transparent", "&:hover": { bgcolor: "#F8F9FF" } };

                  let dayNumSx;
                  if (isToday)
                    dayNumSx = {
                      width: 20,
                      height: 20,
                      borderRadius: "999px",
                      bgcolor: "primary.main",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    };
                  else if (di === 0) dayNumSx = { color: "#F87171" };
                  else if (di === 6) dayNumSx = { color: "#60A5FA" };
                  else dayNumSx = { color: "text.primary" };

                  return (
                    <Box
                      key={day}
                      onClick={() => setSelected(isSelected ? null : dateStr)}
                      className="group"
                      sx={{
                        position: "relative",
                        cursor: "pointer",
                        borderRadius: "8px",
                        border: "1px solid",
                        transition: "all 0.15s",
                        minHeight: 64,
                        display: "flex",
                        flexDirection: "column",
                        "&:hover": { zIndex: 30 },
                        ...cellStateSx,
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 0.75, pt: 0.75 }}>
                        <Box component="span" sx={{ fontSize: 12, fontWeight: 500, ...dayNumSx }}>
                          {day}
                        </Box>
                        {days !== null && days >= 0 && days <= 3 && (
                          <Box
                            component="span"
                            sx={{
                              fontSize: 9,
                              fontWeight: 700,
                              px: 0.5,
                              borderRadius: "4px",
                              ...(days <= 1
                                ? { bgcolor: "#FEE2E2", color: "#DC2626" }
                                : { bgcolor: "#FFEDD5", color: "#EA580C" }),
                            }}
                          >
                            {days === 0 ? "D-Day" : `D-${days}`}
                          </Box>
                        )}
                      </Box>
                      {/* 일정 점 표시 + 체크리스트 달성 마커 */}
                      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 0.5, px: 0.75, pb: 0.75, mt: "auto" }}>
                        {dayChecks.length > 0 && (
                          <Box
                            component="span"
                            sx={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 0.25,
                              fontSize: 9,
                              fontWeight: 700,
                              color: "#15803D",
                              bgcolor: "#DCFCE7",
                              borderRadius: "999px",
                              px: 0.5,
                              py: 0.25,
                              lineHeight: 1,
                            }}
                          >
                            ✓{dayChecks.length}
                          </Box>
                        )}
                        {dayEvents.slice(0, 4).map((e) => (
                          <Box
                            key={e.id}
                            sx={{ width: 6, height: 6, borderRadius: "999px", backgroundColor: e.color }}
                          />
                        ))}
                        {dayEvents.length > 4 && (
                          <Box component="span" sx={{ fontSize: 9, color: "text.secondary", lineHeight: 1 }}>
                            +{dayEvents.length - 4}
                          </Box>
                        )}
                      </Box>

                      {/* 호버 툴팁: 해당 날짜 일정 내용 + 체크리스트 달성 */}
                      {(dayEvents.length > 0 || dayChecks.length > 0) && (
                        <Box
                          sx={{
                            pointerEvents: "none",
                            position: "absolute",
                            left: "50%",
                            transform: "translateX(-50%)",
                            top: "100%",
                            mt: 0.5,
                            zIndex: 40,
                            display: "none",
                            ".group:hover &": { display: "block" },
                            width: 192,
                            borderRadius: "8px",
                            border: "1px solid",
                            borderColor: "divider",
                            bgcolor: "background.paper",
                            p: 1.25,
                            textAlign: "left",
                            boxShadow: 6,
                          }}
                        >
                          <Typography sx={{ fontSize: 11, fontWeight: 600, color: "text.primary", mb: 0.75 }}>
                            {month + 1}월 {day}일{dayEvents.length > 0 ? ` · ${dayEvents.length}건` : ""}
                          </Typography>
                          {dayEvents.length > 0 && (
                            <Stack sx={{ gap: 0.5 }}>
                              {dayEvents.map((e) => (
                                <Box key={e.id} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                                  <Box
                                    sx={{ width: 6, height: 6, borderRadius: "999px", flexShrink: 0, backgroundColor: e.color }}
                                  />
                                  <Typography
                                    sx={{ fontSize: 11, color: "text.primary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                                  >
                                    {e.company} · {e.title}
                                  </Typography>
                                </Box>
                              ))}
                            </Stack>
                          )}
                          {dayChecks.length > 0 && (
                            <Stack
                              sx={{
                                gap: 0.25,
                                ...(dayEvents.length > 0
                                  ? { mt: 0.75, pt: 0.75, borderTop: "1px solid", borderColor: "divider" }
                                  : {}),
                              }}
                            >
                              <Typography sx={{ fontSize: 10, fontWeight: 500, color: "#16A34A" }}>
                                ✅ 체크리스트 달성
                              </Typography>
                              {dayChecks.map((c) => (
                                <Typography
                                  key={c.id}
                                  sx={{ fontSize: 11, color: "text.primary", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                                >
                                  · {c.title}
                                </Typography>
                              ))}
                            </Stack>
                          )}
                        </Box>
                      )}
                    </Box>
                  );
                })}
              </Box>
            ))}
          </Box>
        </Paper>

        {/* Sidebar */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {/* 체크리스트 달성 현황 — 교육 캘린더에서만 */}
          {calType === "edu" && (
            <Paper
              elevation={0}
              sx={{
                borderRadius: "16px",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                p: 2.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
                <Typography sx={{ fontWeight: 600, color: "text.primary", fontSize: 14 }}>
                  체크리스트 달성 현황
                </Typography>
                <Box
                  component="button"
                  onClick={() => navigate("/mypage?tab=goals")}
                  sx={{
                    fontSize: 12,
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
                  교육 목표 관리 <ChevronRight sx={{ fontSize: 12 }} />
                </Box>
              </Box>
              <Box sx={{ borderRadius: "12px", bgcolor: "#F8F9FF", p: 1.5, mb: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                  <Typography sx={{ fontSize: 12, color: "text.secondary" }}>전체 달성률</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, fontFamily: mono, color: "#10B981" }}>
                    {completionRate()}%
                  </Typography>
                </Box>
                <Box sx={{ height: 8, borderRadius: "999px", bgcolor: "background.paper", overflow: "hidden" }}>
                  <Box
                    sx={{
                      height: "100%",
                      borderRadius: "999px",
                      width: `${completionRate()}%`,
                      background: "linear-gradient(90deg,#10B981,#34D399)",
                    }}
                  />
                </Box>
              </Box>
              {achievementHistory().length === 0 ? (
                <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                  아직 달성한 항목이 없습니다.
                </Typography>
              ) : (
                <Stack sx={{ gap: 0.75 }}>
                  {achievementHistory()
                    .slice(0, 4)
                    .map((h) => (
                      <Box key={h.id} sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: 12 }}>
                        <Box component="span" sx={{ color: "#16A34A", flexShrink: 0 }}>
                          ✓
                        </Box>
                        <Typography
                          sx={{ color: "text.primary", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12 }}
                        >
                          {h.title}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: "text.secondary", flexShrink: 0, fontFamily: mono }}>
                          {h.date}
                        </Typography>
                      </Box>
                    ))}
                </Stack>
              )}
            </Paper>
          )}

          {/* 학습 진행도 (교육센터 연동) — 교육 캘린더에서만 표시 */}
          {calType === "edu" && (
            <Paper
              elevation={0}
              sx={{
                borderRadius: "16px",
                border: "1px solid",
                borderColor: "divider",
                bgcolor: "background.paper",
                p: 2.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <School sx={{ fontSize: 16, color: "#6C63FF" }} />
                  <Typography sx={{ fontWeight: 600, color: "text.primary", fontSize: 14 }}>
                    학습 진행도
                  </Typography>
                </Box>
                <Box
                  component="button"
                  onClick={() => navigate("/education")}
                  sx={{
                    fontSize: 12,
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
              <Box sx={{ borderRadius: "12px", bgcolor: "#F8F9FF", p: 1.5, mb: 1.5 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                  <Typography sx={{ fontSize: 12, color: "text.secondary" }}>전체 진행률</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 700, fontFamily: mono, color: "#6C63FF" }}>
                    {LEARNING_OVERALL}%
                  </Typography>
                </Box>
                <Box sx={{ height: 8, borderRadius: "999px", bgcolor: "background.paper", overflow: "hidden" }}>
                  <Box
                    sx={{
                      height: "100%",
                      borderRadius: "999px",
                      width: `${LEARNING_OVERALL}%`,
                      background: "linear-gradient(90deg,#6C63FF,#8B5CF6)",
                    }}
                  />
                </Box>
                <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 1 }}>
                  수강 중인 {LEARNING_COURSES.length}개 강의 · 총{" "}
                  {LEARNING_COURSES.reduce((s, c) => s + c.done, 0)}/
                  {LEARNING_COURSES.reduce((s, c) => s + c.total, 0)}강 완료
                </Typography>
              </Box>

              {/* 강의별 진행률 */}
              <Stack sx={{ gap: 1.5 }}>
                {LEARNING_COURSES.map((c) => {
                  const pct = Math.round((c.done / c.total) * 100);
                  return (
                    <Box
                      component="button"
                      key={c.title}
                      onClick={() => navigate("/education")}
                      className="course-row"
                      sx={{
                        textAlign: "left",
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        p: 0,
                        width: "100%",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography
                          className="course-title"
                          sx={{
                            fontSize: 12,
                            color: "text.primary",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            transition: "color 0.15s",
                            ".course-row:hover &": { color: "primary.main" },
                          }}
                        >
                          {c.title}
                        </Typography>
                        <Typography sx={{ fontSize: 11, color: "text.secondary", flexShrink: 0, ml: 1, fontFamily: mono }}>
                          {c.done}/{c.total}
                        </Typography>
                      </Box>
                      <Box sx={{ height: 6, borderRadius: "999px", bgcolor: "#F8F9FF", overflow: "hidden" }}>
                        <Box
                          sx={{ height: "100%", borderRadius: "999px", width: `${pct}%`, backgroundColor: c.color }}
                        />
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Paper>
          )}

          {/* Upcoming deadlines */}
          {upcomingEvents.length > 0 && (
            <Paper
              elevation={0}
              sx={{
                borderRadius: "16px",
                border: "1px solid",
                borderColor: "#FED7AA",
                bgcolor: "#FFF7ED",
                p: 2.5,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                <Notifications sx={{ fontSize: 16, color: "#F97316" }} />
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>
                  7일 내 {endWord}
                </Typography>
              </Box>
              <Stack sx={{ gap: 1 }}>
                {upcomingEvents.map((e) => {
                  const days = daysUntil(e.end);
                  const badge = alertBadge(days);
                  return (
                    <Box
                      key={e.id}
                      onClick={() => goEvent(e)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        bgcolor: "background.paper",
                        borderRadius: "12px",
                        px: 1.5,
                        py: 1.25,
                        border: "1px solid",
                        borderColor: "#FFEDD5",
                        cursor: "pointer",
                        transition: "border-color 0.15s",
                        "&:hover": { borderColor: "#FDBA74" },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                        <Box
                          sx={{ width: 10, height: 10, borderRadius: "999px", flexShrink: 0, backgroundColor: e.color }}
                        />
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{ fontSize: 12, fontWeight: 500, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                          >
                            {e.company}
                          </Typography>
                          <Typography
                            sx={{ fontSize: 12, color: "#6B7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                          >
                            {e.title}
                          </Typography>
                        </Box>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexShrink: 0, ml: 1 }}>
                        <Box
                          component="span"
                          sx={{ fontSize: 12, fontWeight: 700, px: 1, py: 0.25, borderRadius: "999px", ...badge.sx }}
                        >
                          {badge.label}
                        </Box>
                        <IconButton
                          onClick={(ev) => toggleNotification(e.id, ev)}
                          sx={{ p: 0.5, borderRadius: "4px", color: notifications[e.id] ? "#F97316" : "#D1D5DB" }}
                        >
                          {notifications[e.id] ? (
                            <Notifications sx={{ fontSize: 14 }} />
                          ) : (
                            <NotificationsOff sx={{ fontSize: 14 }} />
                          )}
                        </IconButton>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Paper>
          )}

          {/* Color legend */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: "16px",
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "background.paper",
              p: 2.5,
            }}
          >
            <Typography sx={{ fontWeight: 600, color: "text.primary", mb: 1.5, fontSize: 14 }}>
              {calType === "edu" ? "수강 강의 목록" : "찜한 공고 목록"}
            </Typography>
            <Stack sx={{ gap: 1 }}>
              {[...events]
                .sort((a, b) => Number(b.saved) - Number(a.saved)) // 찜(1순위) → AI추천(2순위)
                .slice(0, 5)
                .map((e) => {
                  const days = daysUntil(e.end);
                  const badge = alertBadge(days);
                  return (
                    <Box
                      key={e.id}
                      onClick={() => goEvent(e)}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1.25,
                        cursor: "pointer",
                        borderRadius: "8px",
                        p: 1,
                        mx: -1,
                        transition: "background-color 0.15s",
                        "&:hover": { bgcolor: "#F8F9FF" },
                      }}
                    >
                      <Box
                        sx={{ width: 12, height: 12, borderRadius: "999px", flexShrink: 0, backgroundColor: e.color }}
                      />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box
                          sx={{ fontSize: 14, color: "text.primary", display: "flex", alignItems: "center", gap: 0.75, overflow: "hidden" }}
                        >
                          <Box component="span" sx={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {e.company}
                          </Box>
                          <Box
                            component="span"
                            sx={{
                              fontSize: 10,
                              px: 0.75,
                              py: 0.25,
                              borderRadius: "999px",
                              fontWeight: 500,
                              flexShrink: 0,
                              ...(e.saved
                                ? { bgcolor: "rgba(108,99,255,0.1)", color: "primary.main" }
                                : {
                                    bgcolor: "#F8F9FF",
                                    border: "1px solid",
                                    borderColor: "divider",
                                    color: "text.secondary",
                                  }),
                            }}
                          >
                            {e.saved ? "찜" : "AI추천"}
                          </Box>
                        </Box>
                        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>~{e.end}</Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        {badge && days <= 7 && (
                          <Box
                            component="span"
                            sx={{ fontSize: 10, fontWeight: 700, px: 0.75, py: 0.25, borderRadius: "999px", ...badge.sx }}
                          >
                            {badge.label}
                          </Box>
                        )}
                        <IconButton
                          onClick={(ev) => toggleNotification(e.id, ev)}
                          sx={{ p: 0.5, borderRadius: "4px", color: notifications[e.id] ? "primary.main" : "#D1D5DB" }}
                        >
                          {notifications[e.id] ? (
                            <Notifications sx={{ fontSize: 14 }} />
                          ) : (
                            <NotificationsOff sx={{ fontSize: 14 }} />
                          )}
                        </IconButton>
                      </Box>
                    </Box>
                  );
                })}
            </Stack>

            {/* 5개 초과 시 더보기 → 교육: /education, 공고: /jobs */}
            {events.length > 5 && (
              <Box
                component="button"
                onClick={() => navigate(calType === "edu" ? "/education" : "/jobs")}
                sx={{
                  mt: 1,
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  py: 1,
                  borderRadius: "8px",
                  border: "1px solid",
                  borderColor: "divider",
                  bgcolor: "#F8F9FF",
                  fontSize: 14,
                  color: "text.secondary",
                  cursor: "pointer",
                  transition: "all 0.15s",
                  "&:hover": { color: "primary.main", borderColor: "rgba(108,99,255,0.4)" },
                }}
              >
                {calType === "edu" ? "교육 더보기" : "공고 더보기"} (+{events.length - 5})
                <ChevronRight sx={{ fontSize: 14 }} />
              </Box>
            )}

            <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid", borderColor: "divider" }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, fontSize: 12, color: "text.secondary" }}>
                <InfoOutlined sx={{ fontSize: 14, flexShrink: 0, mt: 0.25 }} />
                <Box component="span">
                  D-3·D-1 마감 시 상단에 알림이 자동 표시됩니다. 벨 아이콘으로 개별 알림을 설정하세요.
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
