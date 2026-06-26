package com.devready.backend_user.resume.vo;

import lombok.Getter;
import lombok.Setter;

/** resume 테이블 행(기본 이력서). 개인 링크·대표여부 등. 이름/이메일/전화는 member 소유. */
@Getter
@Setter
public class ResumeVO {
    private Long resumeId;
    private Long memberId;
    private String birthDate;       // 입력 없음 → NULL
    private String address;
    private String githubUrl;
    private String portfolioUrl;
    private Integer isPrimary;
    private String createdAt;
    private String updatedAt;
}
