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
