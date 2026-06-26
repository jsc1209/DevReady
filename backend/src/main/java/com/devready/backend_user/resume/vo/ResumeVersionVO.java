package com.devready.backend_user.resume.vo;

import lombok.Getter;
import lombok.Setter;

/** resume_version 테이블 행. snapshot = 이력서 전체 JSON(학력·자격증·자소서 포함). */
@Getter
@Setter
public class ResumeVersionVO {
    private Long versionId;
    private Long resumeId;
    private Integer versionNo;
    private String label;
    private String snapshot;
    private String createdAt;
}
