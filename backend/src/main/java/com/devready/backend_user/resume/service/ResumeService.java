package com.devready.backend_user.resume.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

/**
 * 이력서 분석 게이트웨이 — Colab FastAPI /resume/analyze 로 중계(얇은 프록시).
 *
 * <p>면접 프록시와 동일하게 aiRestClient(=${ai.server.url}, 기존 설정·타임아웃)를 재사용한다.
 * FastAPI 원본 응답({ok, lang, analysis} / 실패 {ok:false, error})을 변형 없이 그대로 반환한다 —
 * 프론트 ResumeAnalyzePage 가 data.ok/data.analysis 로 파싱하므로 DataVO 로 감싸지 않는다.
 * (면접 evaluate 와 달리 /resume/analyze 는 스트리밍 변형이 없어 비스트리밍으로 호출한다.)
 */
@Service
public class ResumeService {

    private static final Logger log = LoggerFactory.getLogger(ResumeService.class);

    private final RestClient aiRestClient;
    private final String aiServerUrl;

    public ResumeService(RestClient aiRestClient,
                         @Value("${ai.server.url:}") String aiServerUrl) {
        this.aiRestClient = aiRestClient;
        this.aiServerUrl = aiServerUrl;
    }

    /**
     * 프론트 요청 바디(snake_case: document/job_posting/role/lang)를 FastAPI 로 그대로 전달.
     * @return FastAPI 원본 응답 Map. URL 미설정·연결 실패·타임아웃 시 {ok:false, error}
     *         (프론트의 실패 계약과 동일한 모양 — 점수/결과 위조하지 않음).
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> analyze(Map<String, Object> body) {
        // AI 서버 URL 미설정(Colab 미가동) → 연결 불가로 간주
        if (aiServerUrl == null || aiServerUrl.isBlank()) {
            return Map.of("ok", false, "error", "AI 서버에 연결할 수 없습니다.");
        }
        try {
            Map<String, Object> resp = aiRestClient.post()
                    .uri("/resume/analyze")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);
            if (resp == null) {
                return Map.of("ok", false, "error", "AI 서버 응답이 비어 있습니다.");
            }
            return resp; // 원본 그대로 패스스루
        } catch (Exception e) {
            // 연결 거부·타임아웃·HTTP 에러(cloudflare 524 등) → 프론트 실패 계약과 동일 모양 반환
            log.warn("이력서 분석 호출 실패: {}", e.toString());
            return Map.of("ok", false, "error", "AI 서버에 연결할 수 없습니다.");
        }
    }
}
