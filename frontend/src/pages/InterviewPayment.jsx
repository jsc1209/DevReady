import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import {
  CheckCircle,
  CreditCard,
  Shield,
  ChevronLeft,
  Lock,
  Smartphone,
  Apartment,
  ErrorOutlineOutlined,
} from "@mui/icons-material";
import { PLANS } from "../data/interviewPaymentMock";

const mono = "'DM Mono', monospace";

// 결제수단 — @mui 아이콘 ref 보유 → 페이지 안 로컬 const.
const PAYMENT_METHODS = [
  { id: "card", icon: CreditCard, label: "신용·체크카드" },
  { id: "kakao", icon: Smartphone, label: "카카오페이" },
  { id: "naver", icon: Smartphone, label: "네이버페이" },
  { id: "bank", icon: Apartment, label: "무통장 입금" },
];

// raw input 픽셀 재현: focus:ring-2 ring-primary/30 + focus:border-primary
const inputSx = {
  width: "100%",
  px: 2,
  py: 1.5,
  borderRadius: "12px",
  border: "1px solid",
  borderColor: "#E5E7EB", // gray-200
  fontSize: 14,
  font: "inherit",
  color: "text.primary",
  boxSizing: "border-box",
  transition: "border-color .2s, box-shadow .2s",
  "&:focus": {
    outline: "none",
    borderColor: "#6C63FF",
    boxShadow: "0 0 0 2px rgba(108,99,255,0.3)",
  },
  "&::placeholder": { color: "#9CA3AF" }, // gray-400
};

/**
 * 결제하기 (/interview/payment) — test-demo-UI/InterviewPayment.tsx → JS+MUI.
 * Layout 밖 풀페이지(본문만, 자체 gray-50 배경). location.state.planId 로 요금제 결정.
 */
export default function InterviewPayment() {
  const navigate = useNavigate();
  const location = useLocation();
  const planId = location.state?.planId ?? "standard";
  const plan = PLANS[planId] ?? PLANS.standard;

  const [method, setMethod] = useState("card");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardNum, setCardNum] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");
  const [error, setError] = useState("");

  function formatCardNum(val) {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(val) {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + " / " + digits.slice(2);
    return digits;
  }

  async function handlePay() {
    setError("");
    if (method === "card") {
      if (cardNum.replace(/\s/g, "").length < 16) {
        setError("카드 번호를 올바르게 입력해주세요.");
        return;
      }
      if (cardExpiry.replace(/\D/g, "").length < 4) {
        setError("유효기간을 올바르게 입력해주세요.");
        return;
      }
      if (cardCvc.length < 3) {
        setError("CVC를 올바르게 입력해주세요.");
        return;
      }
      if (!cardName.trim()) {
        setError("카드 소유자 이름을 입력해주세요.");
        return;
      }
    }
    if (!agreed) {
      setError("이용약관 및 결제 동의가 필요합니다.");
      return;
    }

    setLoading(true);
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    navigate("/interview/setup", { state: { paid: true, planId } });
  }

  const vat = Math.round((plan.priceNum * 0.1) / 11);
  const supply = plan.priceNum - vat;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F9FAFB", py: 5, px: 2 }}>
      <Box sx={{ maxWidth: 896, mx: "auto" }}>
        {/* Back */}
        <Box
          component="button"
          type="button"
          onClick={() => navigate("/interview")}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 0.75,
            fontSize: 14,
            color: "#6B7280", // gray-500
            font: "inherit",
            bgcolor: "transparent",
            border: "none",
            p: 0,
            mb: 4,
            cursor: "pointer",
            transition: "color .2s",
            "&:hover": { color: "#1F2937" }, // gray-800
          }}
        >
          <ChevronLeft sx={{ fontSize: 16 }} />
          모의면접 소개로 돌아가기
        </Box>

        <Typography
          sx={{ fontSize: 24, fontWeight: 700, color: "#111827", mb: 4 }}
        >
          결제하기
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "repeat(3, 1fr)" },
            gap: 3,
            alignItems: "start",
          }}
        >
          {/* Left: Payment form */}
          <Box
            sx={{
              gridColumn: { lg: "span 2" },
              display: "flex",
              flexDirection: "column",
              gap: 2.5,
            }}
          >
            {/* Payment method */}
            <Box
              sx={{
                bgcolor: "background.paper",
                borderRadius: "16px",
                border: "1px solid",
                borderColor: "#E5E7EB",
                p: 3,
              }}
            >
              <Typography
                sx={{ fontWeight: 600, color: "#111827", mb: 2 }}
              >
                결제 수단 선택
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "repeat(2, 1fr)",
                    sm: "repeat(4, 1fr)",
                  },
                  gap: 1.5,
                }}
              >
                {PAYMENT_METHODS.map(({ id, icon: Icon, label }) => {
                  const active = method === id;
                  return (
                    <Box
                      key={id}
                      component="button"
                      type="button"
                      onClick={() => setMethod(id)}
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                        p: 1.5,
                        borderRadius: "12px",
                        border: "2px solid",
                        fontSize: 14,
                        font: "inherit",
                        cursor: "pointer",
                        transition: "border-color .2s, color .2s, background-color .2s",
                        ...(active
                          ? {
                              borderColor: "#6C63FF",
                              color: "#6C63FF",
                              backgroundColor: "#6C63FF0D",
                            }
                          : {
                              borderColor: "#E5E7EB", // gray-200
                              color: "#4B5563", // gray-600
                              backgroundColor: "transparent",
                              "&:hover": { borderColor: "#D1D5DB" }, // gray-300
                            }),
                      }}
                    >
                      <Icon sx={{ fontSize: 20 }} />
                      {label}
                    </Box>
                  );
                })}
              </Box>
            </Box>

            {/* Card form */}
            {method === "card" && (
              <Box
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: "#E5E7EB",
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Typography sx={{ fontWeight: 600, color: "#111827" }}>
                  카드 정보 입력
                </Typography>
                <Box>
                  <Typography
                    component="label"
                    sx={{
                      display: "block",
                      fontSize: 14,
                      color: "#4B5563",
                      mb: 0.75,
                    }}
                  >
                    카드 번호
                  </Typography>
                  <Box
                    component="input"
                    type="text"
                    inputMode="numeric"
                    placeholder="0000 0000 0000 0000"
                    value={cardNum}
                    onChange={(e) => setCardNum(formatCardNum(e.target.value))}
                    sx={inputSx}
                  />
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(2, 1fr)",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography
                      component="label"
                      sx={{
                        display: "block",
                        fontSize: 14,
                        color: "#4B5563",
                        mb: 0.75,
                      }}
                    >
                      유효기간
                    </Typography>
                    <Box
                      component="input"
                      type="text"
                      inputMode="numeric"
                      placeholder="MM / YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      sx={inputSx}
                    />
                  </Box>
                  <Box>
                    <Typography
                      component="label"
                      sx={{
                        display: "block",
                        fontSize: 14,
                        color: "#4B5563",
                        mb: 0.75,
                      }}
                    >
                      CVC
                    </Typography>
                    <Box
                      component="input"
                      type="text"
                      inputMode="numeric"
                      placeholder="000"
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) =>
                        setCardCvc(e.target.value.replace(/\D/g, "").slice(0, 4))
                      }
                      sx={inputSx}
                    />
                  </Box>
                </Box>
                <Box>
                  <Typography
                    component="label"
                    sx={{
                      display: "block",
                      fontSize: 14,
                      color: "#4B5563",
                      mb: 0.75,
                    }}
                  >
                    카드 소유자 이름
                  </Typography>
                  <Box
                    component="input"
                    type="text"
                    placeholder="홍길동"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    sx={inputSx}
                  />
                </Box>
              </Box>
            )}

            {/* Kakao/Naver Pay */}
            {(method === "kakao" || method === "naver") && (
              <Box
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: "#E5E7EB",
                  p: 3,
                  textAlign: "center",
                  fontSize: 14,
                  color: "#6B7280",
                }}
              >
                <Smartphone
                  sx={{ fontSize: 40, display: "block", mx: "auto", mb: 1.5, color: "#D1D5DB" }}
                />
                결제 버튼을 누르면 {method === "kakao" ? "카카오페이" : "네이버페이"} 앱으로 이동합니다.
              </Box>
            )}

            {/* Bank transfer */}
            {method === "bank" && (
              <Box
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: "16px",
                  border: "1px solid",
                  borderColor: "#E5E7EB",
                  p: 3,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                <Typography sx={{ fontWeight: 600, color: "#111827", mb: 1 }}>
                  입금 계좌 정보
                </Typography>
                <Box
                  sx={{
                    bgcolor: "#F9FAFB", // gray-50
                    borderRadius: "12px",
                    p: 2,
                    fontSize: 14,
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box component="span" sx={{ color: "#6B7280" }}>은행</Box>
                    <Box component="span" sx={{ fontWeight: 500, color: "#111827" }}>
                      신한은행
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box component="span" sx={{ color: "#6B7280" }}>계좌번호</Box>
                    <Box
                      component="span"
                      sx={{ fontWeight: 500, color: "#111827", fontFamily: mono }}
                    >
                      110-123-456789
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Box component="span" sx={{ color: "#6B7280" }}>예금주</Box>
                    <Box component="span" sx={{ fontWeight: 500, color: "#111827" }}>
                      (주)DevReady
                    </Box>
                  </Box>
                </Box>
                <Typography sx={{ fontSize: 12, color: "#9CA3AF" }}>
                  입금 확인 후 서비스가 자동 활성화됩니다. (영업일 기준 1시간 이내)
                </Typography>
              </Box>
            )}

            {/* Agreement */}
            <Box
              sx={{
                bgcolor: "background.paper",
                borderRadius: "16px",
                border: "1px solid",
                borderColor: "#E5E7EB",
                p: 3,
              }}
            >
              <Typography sx={{ fontWeight: 600, color: "#111827", mb: 2 }}>
                이용약관 동의
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  fontSize: 14,
                  color: "#6B7280",
                  mb: 2,
                }}
              >
                <Typography sx={{ fontSize: 14 }}>
                  · 서비스 이용약관, 개인정보 처리방침에 동의합니다.
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                  · 구독 상품의 경우 매월 자동으로 결제됩니다.
                </Typography>
                <Typography sx={{ fontSize: 14 }}>
                  · 환불은 이용 시작 전 100%, 이용 후 잔여 기간에 비례하여 환불됩니다.
                </Typography>
              </Box>
              <Box
                component="label"
                className="agree-group"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  cursor: "pointer",
                }}
              >
                <Box
                  onClick={() => setAgreed(!agreed)}
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid",
                    cursor: "pointer",
                    transition: "border-color .2s, background-color .2s",
                    ...(agreed
                      ? { borderColor: "#6C63FF", backgroundColor: "#6C63FF" }
                      : { borderColor: "#D1D5DB" }), // gray-300
                  }}
                >
                  {agreed && <CheckCircle sx={{ fontSize: 14, color: "#fff" }} />}
                </Box>
                <Box
                  component="span"
                  sx={{
                    fontSize: 14,
                    color: "#374151", // gray-700
                    ".agree-group:hover &": { color: "#111827" },
                  }}
                >
                  위 내용을 모두 확인하고 동의합니다 (필수)
                </Box>
              </Box>
            </Box>

            {/* Error */}
            {error && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  fontSize: 14,
                  color: "#DC2626", // red-600
                  bgcolor: "#FEF2F2", // red-50
                  border: "1px solid #FECACA", // red-200
                  borderRadius: "12px",
                  px: 2,
                  py: 1.5,
                }}
              >
                <ErrorOutlineOutlined sx={{ fontSize: 16, flexShrink: 0 }} />
                {error}
              </Box>
            )}
          </Box>

          {/* Right: Order summary */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Box
              sx={{
                bgcolor: "background.paper",
                borderRadius: "16px",
                border: "1px solid",
                borderColor: "#E5E7EB",
                p: 3,
              }}
            >
              <Typography sx={{ fontWeight: 600, color: "#111827", mb: 2 }}>
                주문 요약
              </Typography>
              <Box
                sx={{
                  pb: 2,
                  mb: 2,
                  borderBottom: "1px solid",
                  borderColor: "#F3F4F6", // gray-100
                }}
              >
                <Typography sx={{ fontWeight: 500, color: "#111827" }}>
                  {plan.name}
                </Typography>
                <Typography sx={{ fontSize: 14, color: "#6B7280", mt: 0.5 }}>
                  {plan.per === "월" ? "월 구독" : "단건 이용권"}
                </Typography>
              </Box>
              <Box
                component="ul"
                sx={{
                  listStyle: "none",
                  m: 0,
                  p: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  mb: 2,
                }}
              >
                {plan.features.map((f) => (
                  <Box
                    component="li"
                    key={f}
                    sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 1,
                      fontSize: 14,
                      color: "#4B5563", // gray-600
                    }}
                  >
                    <CheckCircle
                      sx={{ fontSize: 14, mt: "2px", flexShrink: 0, color: "#6C63FF" }}
                    />
                    {f}
                  </Box>
                ))}
              </Box>
              <Box
                sx={{
                  borderTop: "1px solid",
                  borderColor: "#F3F4F6", // gray-100
                  pt: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                  fontSize: 14,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#6B7280",
                  }}
                >
                  <Box component="span">공급가액</Box>
                  <Box component="span" sx={{ fontFamily: mono }}>
                    ₩{supply.toLocaleString()}
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#6B7280",
                  }}
                >
                  <Box component="span">부가세 (10%)</Box>
                  <Box component="span" sx={{ fontFamily: mono }}>
                    ₩{vat.toLocaleString()}
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: 700,
                    color: "#111827",
                    pt: 1,
                    borderTop: "1px solid",
                    borderColor: "#F3F4F6", // gray-100
                  }}
                >
                  <Box component="span">최종 결제금액</Box>
                  <Box component="span" sx={{ color: "#6C63FF", fontFamily: mono }}>
                    ₩{plan.price}
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box
              component="button"
              type="button"
              onClick={handlePay}
              disabled={loading}
              sx={{
                width: "100%",
                py: 2,
                borderRadius: "12px",
                color: "#fff",
                fontWeight: 600,
                fontSize: 16,
                font: "inherit",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                backgroundColor: "#6C63FF",
                boxShadow: "0 10px 15px -3px rgba(108,99,255,0.2)",
                cursor: loading ? "default" : "pointer",
                transition: "opacity .2s",
                "&:hover": { opacity: 0.9 },
                "&:disabled": { opacity: 0.6 },
              }}
            >
              {loading ? (
                <>
                  <CircularProgress size={16} sx={{ color: "#fff" }} />
                  결제 처리 중...
                </>
              ) : (
                <>
                  <Lock sx={{ fontSize: 16 }} />
                  ₩{plan.price} 결제하기
                </>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 0.75,
                fontSize: 12,
                color: "#9CA3AF", // gray-400
              }}
            >
              <Shield sx={{ fontSize: 14 }} />
              SSL 암호화 안전 결제
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
