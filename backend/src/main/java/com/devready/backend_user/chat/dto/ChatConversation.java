package com.devready.backend_user.chat.dto;

import lombok.Getter;
import lombok.Setter;

/**
 * chat_conversation 행(영속화용). started_at/last_active_at 은 INSERT 시 NOW() 로 채우므로
 * 여기엔 두지 않는다. insertConversation 후 conversationId 에 생성 PK 가 회수된다.
 */
@Getter
@Setter
public class ChatConversation {
    private Long conversationId;
    private Long memberId;
    private String title;
}
