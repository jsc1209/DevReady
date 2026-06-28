package com.devready.backend_user.chat.controller;

import com.devready.backend_user.chat.dto.ChatRequest;
import com.devready.backend_user.chat.service.ChatService;
import com.devready.backend_user.common.jwt.LoginMember;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 챗봇 게이트웨이 컨트롤러.
 * 프론트 → Spring(/api/chat) → Colab FastAPI(/chat) 중계. 비로그인 허용(익명은 저장 없이 stateless).
 * 로그인 사용자는 @LoginMember 로 member_id 를 받아 대화를 DB 에 영속화한다(저장 실패는 응답과 격리).
 * FastAPI 는 실패도 HTTP 200 + {ok:false} 이므로 프론트가 ok 로 분기(generate/report 와 동일 패스스루).
 */
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping
    public Map<String, Object> chat(@LoginMember Long memberId, @RequestBody ChatRequest req) {
        return chatService.chat(req, memberId);
    }
}
