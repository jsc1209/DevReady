import gatewayAxios from './gatewayAxios'

// POST /api/resume/analyze — Spring 게이트웨이(8080)가 Colab FastAPI(/resume/analyze)를 중계.
// 응답은 FastAPI 원본을 그대로 전달(DataVO 미적용):
// 성공: { ok:true, lang, analysis:{ overall_score, specificity_score, star_score,
//        job_fit_score, strengths[], weaknesses[], suggestions[], summary } }
// 실패: { ok:false, error }  ← (검증 실패·연결 불가 모두) res.data.ok 로 분기
export const analyzeResume = async ({ document, jobPosting = '', role = '', lang = 'ko' }) => {
  const res = await gatewayAxios.post('/api/resume/analyze', {
    document,
    job_posting: jobPosting,
    role,
    lang,
  })
  return res.data
}

// ── 이력서 영속화(/api/resumes) — 로그인 토큰(gatewayAxios 인터셉터) 기준, 본인 것만 ──
// DataVO 응답({success,message,data}) 에서 data 만 반환.

// 내 이력서 목록: [{ resumeId, name, isPrimary, data(최신 스냅샷), versions:[{versionId,versionNo,label,createdAt,data}] }]
export const getMyResumes = async () => {
  const res = await gatewayAxios.get('/api/resumes')
  return res?.data?.data ?? []
}

// 새 이력서 첫 저장 → { resumeId, versionId, versionNo, label, createdAt }
export const createResume = async (resume) => {
  const res = await gatewayAxios.post('/api/resumes', resume)
  return res?.data?.data
}

// 기존 이력서 저장/수정(+버전 추가) → { resumeId, versionId, versionNo, label, createdAt }
export const updateResume = async (id, resume) => {
  const res = await gatewayAxios.put(`/api/resumes/${id}`, resume)
  return res?.data?.data
}

// 이력서 삭제
export const deleteResumeById = async (id) => {
  await gatewayAxios.delete(`/api/resumes/${id}`)
}
