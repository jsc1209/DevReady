package com.devready.backend_user.jobposting.vo;

import lombok.Getter;
import lombok.Setter;

/**
 * 공고 조회 응답 VO. job_posting 의 표시용 컬럼만 담는다(admin_id 등 내부 컬럼 제외).
 * map-underscore-to-camel-case 로 컬럼 ↔ 카멜 자동 매핑.
 * deadline/createdAt 은 DATE 를 문자열("yyyy-MM-dd")로 받아 직렬화 단순화.
 */
@Getter
@Setter
public class JobPostingVO {
    private Long jobPostingId;
    private String companyName;
    private String jobCategory;
    private String requirements;
    private String preferredQualifications;
    private String deadline;
    private String postingUrl;
    private String status;
    private String createdAt;
}
