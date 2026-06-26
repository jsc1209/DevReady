import gatewayAxios from "./gatewayAxios";

/**
 * 공고 조회 API — Spring 게이트웨이(/api/jobs) 호출.
 * 백엔드 job_posting 은 표시용 컬럼만 가지므로, 화면(JobsPage/JobDetailPage/JobCard)이
 * 기대하는 UI 형태로 여기서 변환한다. DB 에 없는 시각·분석 필드는 안전 기본값(자리표시)으로 채워
 * 컴포넌트의 .map()·toLocaleString() 등이 깨지지 않게 한다. (화면 컴포넌트는 거의 손대지 않음.)
 */

// "a, b, c" → ["a","b","c"] (시드가 ', ' 조인이라 콤마로 분리)
function splitList(text) {
  if (!text) return [];
  return String(text)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// 백엔드 JobPostingVO → 화면 기대 형태
function mapJob(dto) {
  if (!dto) return null;
  const company = dto.companyName ?? "";
  const category = dto.jobCategory ?? "";
  return {
    // 실 DB 매핑
    id: String(dto.jobPostingId),
    company,
    title: category,
    deadline: dto.deadline ?? "",
    requirements: splitList(dto.requirements),
    preferred: splitList(dto.preferredQualifications),
    postingUrl: dto.postingUrl ?? "",
    status: dto.status ?? "OPEN",
    // DB 에 없는 표시/분석 필드 — 자리표시 기본값(크래시 방지)
    logo: company.slice(0, 1) || "?",
    logoColor: "#6C63FF",
    logoBg: "#EEF0FF",
    location: "",
    type: "",
    tags: [],
    salary: "협의",
    hot: false,
    new: false,
    desc: company && category ? `${company}에서 ${category}를 모집합니다.` : "",
    mainDuties: [],
    coverLetterQuestions: [],
    viewCount: 0,
    applicants: 0,
    categoryDist: [],
  };
}

// 공고 목록
export async function getJobs() {
  const res = await gatewayAxios.get("/api/jobs");
  const list = res?.data?.data ?? [];
  return Array.isArray(list) ? list.map(mapJob) : [];
}

// 공고 단건 상세
export async function getJob(id) {
  const res = await gatewayAxios.get(`/api/jobs/${id}`);
  return mapJob(res?.data?.data);
}
