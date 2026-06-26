package com.devready.backend_user.education.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

/**
 * 교육 퀴즈 게이트웨이 — Colab FastAPI /education/quiz 로 중계(얇은 패스스루 프록시).
 *
 * <p>resume/generate/report 프록시와 동일 구조 — 기존 aiRestClient(=${ai.server.url})·설정을 재사용한다.
 * FastAPI 원본({ok, topic, count, quiz:[...]} / 실패 {ok:false, error})을 변형 없이 그대로 반환한다.
 * (난이도별 퀴즈 생성은 추론이 길어 비스트리밍으로 호출 — 실패/타임아웃 시 graceful {ok:false,...}.)
 */
@Service
public class EducationService {

    private static final Logger log = LoggerFactory.getLogger(EducationService.class);

    private final RestClient aiRestClient;
    private final String aiServerUrl;

    public EducationService(RestClient aiRestClient,
                            @Value("${ai.server.url:}") String aiServerUrl) {
        this.aiRestClient = aiRestClient;
        this.aiServerUrl = aiServerUrl;
    }

    /**
     * 요청 바디(topic/n/difficulty/lang)를 FastAPI 로 그대로 전달.
     * @return FastAPI 원본 응답 Map. URL 미설정·연결 실패·타임아웃 시 {ok:false, error}.
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> quiz(Map<String, Object> body) {
        if (aiServerUrl == null || aiServerUrl.isBlank()) {
            return Map.of("ok", false, "error", "AI 서버에 연결할 수 없습니다.");
        }
        try {
            Map<String, Object> resp = aiRestClient.post()
                    .uri("/education/quiz")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);
            if (resp == null) {
                return Map.of("ok", false, "error", "AI 서버 응답이 비어 있습니다.");
            }
            return resp; // 원본 그대로 패스스루
        } catch (Exception e) {
            log.warn("교육 퀴즈 호출 실패: {}", e.toString());
            return Map.of("ok", false, "error", "AI 서버에 연결할 수 없습니다.");
        }
    }
}
