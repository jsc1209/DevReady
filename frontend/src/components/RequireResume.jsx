import { Navigate } from "react-router-dom";

// 라우트 진입 가드. 페이지 안의 인라인 액션 가드와 "완전히 동일한" 기준을 재사용한다.
//   devready_authed        === "1"  → 로그인됨
//   devready_resume_complete === "1" → 이력서 필수 충족(슬라이스2에서 DB 저장 성공 시 set)
// 새 판단 기준을 도입하지 않는다(액션 가드와 1:1).
function isAuthed() {
  try {
    return localStorage.getItem("devready_authed") === "1";
  } catch {
    return false;
  }
}
function isResumeComplete() {
  try {
    // "1"(필수 충족)일 때만 통과. 미작성(null)·미충족·읽기 실패는 차단.
    return localStorage.getItem("devready_resume_complete") === "1";
  } catch {
    return false;
  }
}

/**
 * 교육/공고/모의면접 라우트 진입 가드(메뉴 클릭·URL 직접입력 모두 차단).
 * - 비로그인        → /auth   (기존 인증 흐름)
 * - 이력서 미충족   → /resume (이력서 작성)
 * - 둘 다 충족      → 자식 그대로 렌더(정상 진입)
 *
 * ★ /resume·/auth·홈·마이페이지에는 절대 적용하지 말 것
 *   (작성 화면을 막으면 영원히 갇힘 → 무한 리디렉션).
 */
export default function RequireResume({ children }) {
  if (!isAuthed()) return <Navigate to="/auth" replace />;
  if (!isResumeComplete()) return <Navigate to="/resume" replace />;
  return children;
}
