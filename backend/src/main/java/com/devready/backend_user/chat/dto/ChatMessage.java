package com.devready.backend_user.chat.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * chat_message 행(영속화용). created_at 은 DB DEFAULT(CURRENT_TIMESTAMP) 사용.
 * sender: 'USER'|'BOT'(CHECK), answerType: 'AI'|'FIXED'(CHECK, NOT NULL),
 * faqId: nullable(FastAPI 응답에 숫자 faq_id 없어 현재는 NULL).
 */
@Getter
@Setter
public class ChatMessage {
    private Long messageId;
    private Long conversationId;
    private String sender;
    private String messageContent;
    private Long faqId;
    private String answerType;
}
