package com.devready.backend_user.chat.service;

import com.devready.backend_user.chat.dto.ChatConversation;
import com.devready.backend_user.chat.dto.ChatMessage;
import com.devready.backend_user.chat.mapper.ChatMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 챗봇 대화 영속화(로그인 사용자 전용). 한 번 주고받음(USER+BOT)을 단일 트랜잭션으로 저장한다.
 *
 * <p>find-or-create: member 의 30분 이내 최근 대화가 있으면 재사용(last_active_at touch),
 * 없으면 신규 대화 생성(title = 첫 메시지 200자 절단). 별도 빈으로 분리해 @Transactional 이
 * 실제 적용되도록 하고, 호출부(ChatService)가 예외를 잡아 채팅 응답과 격리한다.
 */
@Service
@RequiredArgsConstructor
public class ChatStoreService {

    private static final int REUSE_WINDOW_MINUTES = 30;
    private static final int TITLE_MAX = 200;

    private final ChatMapper chatMapper;

    /**
     * 사용자 메시지 + 봇 응답을 저장. 대화는 30분 내 최근 것을 재사용하거나 신규 생성.
     * @param memberId   로그인 회원(비-null 보장 — 호출부에서 익명 분기)
     * @param userMessage 사용자 입력(비어있지 않음 보장)
     * @param botAnswer  FastAPI 응답 answer(없으면 빈 문자열로 저장)
     * @param source     FastAPI 응답 source("faq"|"interview"|"none" 등) — answer_type 매핑에 사용
     */
    @Transactional
    public void saveTurn(Long memberId, String userMessage, String botAnswer, String source) {
        Long conversationId = chatMapper.findLatestActiveConversationId(memberId, REUSE_WINDOW_MINUTES);
        if (conversationId == null) {
            ChatConversation conv = new ChatConversation();
            conv.setMemberId(memberId);
            conv.setTitle(truncate(userMessage, TITLE_MAX));
            chatMapper.insertConversation(conv);
            conversationId = conv.getConversationId();
        } else {
            chatMapper.touchLastActive(conversationId);
        }

        // USER 행 — answer_type 은 스키마 NOT NULL 충족용 'AI' 고정(실제 구분은 sender)
        chatMapper.insertMessage(message(conversationId, "USER", userMessage, "AI"));
        // BOT 행 — FAQ 응답이면 FIXED, 그 외(interview/none/ai)면 AI
        String botType = "faq".equals(source) ? "FIXED" : "AI";
        chatMapper.insertMessage(message(conversationId, "BOT", botAnswer, botType));
    }

    private ChatMessage message(Long conversationId, String sender, String content, String answerType) {
        ChatMessage m = new ChatMessage();
        m.setConversationId(conversationId);
        m.setSender(sender);
        m.setMessageContent(content == null ? "" : content);
        m.setFaqId(null);
        m.setAnswerType(answerType);
        return m;
    }

    private String truncate(String s, int max) {
        if (s == null) return "";
        String t = s.trim();
        return t.length() <= max ? t : t.substring(0, max);
    }
}
