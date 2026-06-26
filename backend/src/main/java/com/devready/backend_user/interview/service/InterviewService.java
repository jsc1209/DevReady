package com.devready.backend_user.interview.service;

import com.devready.backend_user.interview.dto.EvaluateRequest;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

/**
 * 면접 채점 게이트웨이 — Colab FastAPI 로 중계(얇은 프록시).
 *
 * <p>비스트리밍 /interview/evaluate 는 EXAONE 추론(~125s)이 응답 헤더를 늦게 보내
 * trycloudflare 터널의 ~100s 한계에서 524 로 끊긴다. 그래서 SSE 스트리밍
 * /interview/evaluate/stream 을 호출한다 — 첫 토큰이 1~2초에 도착해 524 를 회피하고,
 * Spring 이 스트림을 끝까지 소비해 최종 이벤트만 추출한다(프론트는 동기 호출 그대로).
 *
 * <p>SSE 이벤트(라인 "data: {json}"): type=token(무시) / type=done({ok,evaluation|error})
 * / type=error({error}). done·error 페이로드는 기존 컨트롤러 계약과 동일해 그대로 반환한다.
 */
@Service
public class InterviewService {

    private static final Logger log = LoggerFactory.getLogger(InterviewService.class);

    private final RestClient aiRestClient;
    private final ObjectMapper objectMapper;
    private final String aiServerUrl;

    public InterviewService(RestClient aiRestClient,
                            ObjectMapper objectMapper,
                            @Value("${ai.server.url:}") String aiServerUrl) {
        this.aiRestClient = aiRestClient;
        this.objectMapper = objectMapper;
        this.aiServerUrl = aiServerUrl;
    }

    /**
     * FastAPI /interview/evaluate/stream(SSE) 호출 후 최종 이벤트를 반환.
     * @return 최종 done/error 이벤트 Map({ok, evaluation|error, ...}).
     *         URL 미설정·연결 실패·타임아웃·최종이벤트 없음 시 null (점수 위조하지 않음).
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> evaluate(EvaluateRequest req) {
        // AI 서버 URL 미설정(Colab 미가동) → 연결 불가로 간주
        if (aiServerUrl == null || aiServerUrl.isBlank()) {
            return null;
        }

        Map<String, Object> body = new HashMap<>();
        body.put("question", req.getQuestion());
        body.put("answer", req.getAnswer());
        body.put("lang", (req.getLang() != null && !req.getLang().isBlank()) ? req.getLang() : "ko");

        try {
            return aiRestClient.post()
                    .uri("/interview/evaluate/stream")
                    .contentType(MediaType.APPLICATION_JSON)
                    .accept(MediaType.TEXT_EVENT_STREAM)
                    .body(body)
                    .exchange((request, response) -> {
                        // exchange: 에러 상태도 던지지 않음 → 스트림을 직접 소비
                        try (BufferedReader reader = new BufferedReader(
                                new InputStreamReader(response.getBody(), StandardCharsets.UTF_8))) {
                            String line;
                            while ((line = reader.readLine()) != null) {
                                if (line.isEmpty() || !line.startsWith("data:")) {
                                    continue;
                                }
                                String payload = line.substring(5).trim();   // "data:" 제거
                                if (payload.isEmpty()) {
                                    continue;
                                }
                                JsonNode node = objectMapper.readTree(payload);
                                String type = node.path("type").asText();
                                if ("token".equals(type)) {
                                    continue;   // 생성 중 토큰 — 무시
                                }
                                if ("done".equals(type) || "error".equals(type)) {
                                    // 최종 이벤트({ok,evaluation} 또는 {error}) → 컨트롤러가 그대로 분기
                                    return (Map<String, Object>) objectMapper.convertValue(node, Map.class);
                                }
                            }
                            return null;   // done/error 없이 스트림 종료
                        }
                    });
        } catch (Exception e) {
            // 연결 거부·타임아웃·스트림/파싱 오류 등 → 연결 불가로 신호(메시지만 로깅, 스택 과다 금지)
            log.warn("AI 평가 호출 실패: {}", e.toString());
            return null;
        }
    }

    /**
     * 맞춤 질문 생성 — Colab /interview/generate 패스스루.
     * @return FastAPI 원본({ok, questions} / 실패 {ok:false, error}). 연결 불가 시 graceful {ok:false,...}.
     */
    public Map<String, Object> generate(Map<String, Object> body) {
        return proxyPost("/interview/generate", body);
    }

    /**
     * 세션 종합 리포트 — Colab /interview/report 패스스루.
     * @return FastAPI 원본({ok, ..., report:{...}} / 실패 {ok:false, error}). 연결 불가 시 graceful {ok:false,...}.
     */
    public Map<String, Object> report(Map<String, Object> body) {
        return proxyPost("/interview/report", body);
    }

    /** 비스트리밍 패스스루 프록시(generate·report 공용). evaluate(SSE+DataVO)와 달리 응답을 변형 없이 그대로 반환한다. */
    @SuppressWarnings("unchecked")
    private Map<String, Object> proxyPost(String uri, Map<String, Object> body) {
        if (aiServerUrl == null || aiServerUrl.isBlank()) {
            return Map.of("ok", false, "error", "AI 서버에 연결할 수 없습니다.");
        }
        try {
            Map<String, Object> resp = aiRestClient.post()
                    .uri(uri)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);
            if (resp == null) {
                return Map.of("ok", false, "error", "AI 서버 응답이 비어 있습니다.");
            }
            return resp; // 원본 그대로 패스스루
        } catch (Exception e) {
            log.warn("AI 호출 실패({}): {}", uri, e.toString());
            return Map.of("ok", false, "error", "AI 서버에 연결할 수 없습니다.");
        }
    }
}
