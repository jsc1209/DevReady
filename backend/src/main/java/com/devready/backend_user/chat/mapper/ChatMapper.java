package com.devready.backend_user.chat.mapper;

import com.devready.backend_user.chat.dto.ChatConversation;
import com.devready.backend_user.chat.dto.ChatMessage;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 챗봇 대화 영속화 매퍼. INSERT 는 useGeneratedKeys 로 생성 PK 를 DTO 에 돌려준다.
 * 익명(비로그인) 대화는 저장하지 않으므로 모두 member_id 가 있는 행만 다룬다.
 */
@Mapper
public interface ChatMapper {

    /** member 의 last_active_at 이 NOW()-N분 이내인 가장 최근 conversation_id(없으면 null). */
    Long findLatestActiveConversationId(@Param("memberId") Long memberId,
                                        @Param("withinMinutes") int withinMinutes);

    /** 신규 대화 생성. conversationId 에 생성 PK 회수. */
    void insertConversation(ChatConversation conv);

    /** 메시지 1행 저장(USER 또는 BOT). */
    void insertMessage(ChatMessage msg);

    /** 대화 재사용 시 last_active_at = NOW() 로 갱신. */
    void touchLastActive(@Param("conversationId") Long conversationId);
}
