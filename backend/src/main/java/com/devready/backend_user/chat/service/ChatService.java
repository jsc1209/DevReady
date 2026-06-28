package com.devready.backend_user.chat.service;

import com.devready.backend_user.chat.dto.ChatRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.Map;

/**
 * 챗봇 게이트웨이 — Colab FastAPI /chat 으로 중계(얇은 프록시, stateless).
 *
 * <p>비로그인 허용·DB 저장 없음. InterviewService.proxyPost(generate/report) 패스스루 패턴을
 * 그대로 따른다 — URL 미설정·연결 실패 시 graceful {ok:false,error}, 정상 시 원본 그대로 반환.
 * FastAPI 응답({ok, source, answer, score, category, matched_question, related_question})은 변형하지 않는다.
 */
@Slf4j
@Service
public class ChatService {

    private final RestClient aiRestClient;
    private final String aiServerUrl;
    private final ChatStoreService chatStoreService;

    public ChatService(RestClient aiRestClient,
                       @Value("${ai.server.url:}") String aiServerUrl,
                       ChatStoreService chatStoreService) {
        this.aiRestClient = aiRestClient;
        this.aiServerUrl = aiServerUrl;
        this.chatStoreService = chatStoreService;
    }

    /**
     * 사용자 메시지 → FastAPI /chat 패스스루. 로그인 사용자면 대화를 DB 에 영속화한다.
     * @param memberId 로그인 회원 식별값(@LoginMember). null 이면 익명 — 저장 없이 stateless.
     * @return FastAPI 원본 Map. 입력 누락·URL 미설정·연결 실패·빈 응답 시 graceful {ok:false, error}.
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> chat(ChatRequest req, Long memberId) {
        // 입력 검증 — message 누락 시 AI 서버 호출 없이 즉시 반환
        if (req == null || req.getMessage() == null || req.getMessage().isBlank()) {
            return Map.of("ok", false, "error", "메시지를 입력해주세요.");
        }
        // AI 서버 URL 미설정(Colab 미가동) → 연결 불가로 간주
        if (aiServerUrl == null || aiServerUrl.isBlank()) {
            return Map.of("ok", false, "error", "AI 서버에 연결할 수 없습니다.");
        }

        String lang = (req.getLang() != null && !req.getLang().isBlank()) ? req.getLang() : "ko";
        Map<String, Object> body = new HashMap<>();
        body.put("message", req.getMessage());
        body.put("lang", lang);

        Map<String, Object> resp;
        try {
            resp = aiRestClient.post()
                    .uri("/chat")
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(Map.class);
        } catch (Exception e) {
            // 연결 거부·타임아웃·파싱 오류 등 → 연결 불가로 신호(메시지만 로깅)
            log.warn("AI 챗봇 호출 실패: {}", e.toString());
            return Map.of("ok", false, "error", "AI 서버에 연결할 수 없습니다.");
        }
        if (resp == null) {
            return Map.of("ok", false, "error", "AI 서버 응답이 비어 있습니다.");
        }

        // 로그인 사용자 + 정상 응답(ok:true)일 때만 대화 저장. 저장 실패는 채팅 응답과 격리(부수효과).
        if (memberId != null && Boolean.TRUE.equals(resp.get("ok"))) {
            try {
                String answer = resp.get("answer") == null ? "" : String.valueOf(resp.get("answer"));
                String source = resp.get("source") == null ? null : String.valueOf(resp.get("source"));
                chatStoreService.saveTurn(memberId, req.getMessage(), answer, source);
            } catch (Exception e) {
                log.warn("챗봇 대화 저장 실패(채팅 응답에는 영향 없음): {}", e.toString());
            }
        }

        return resp; // 원본 그대로 패스스루
    }
}
