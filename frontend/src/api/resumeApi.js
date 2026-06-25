import axiosInstance from './axiosInstance'

// POST /resume/analyze
// 성공: { ok:true, lang, analysis:{ overall_score, specificity_score, star_score,
//        job_fit_score, strengths[], weaknesses[], suggestions[], summary } }
// 실패: { ok:false, error }  ← HTTP 200 으로 오므로 res.data.ok 로 분기
export const analyzeResume = async ({ document, jobPosting = '', role = '', lang = 'ko' }) => {
  const res = await axiosInstance.post('/resume/analyze', {
    document,
    job_posting: jobPosting,
    role,
    lang,
  })
  return res.data
}
