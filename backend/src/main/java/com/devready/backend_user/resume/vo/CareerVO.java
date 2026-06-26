package com.devready.backend_user.resume.vo;

import lombok.Getter;
import lombok.Setter;

/** career 테이블 행(정규화 경력). 원본 period/team 등 일부는 스냅샷에만 보존. */
@Getter
@Setter
public class CareerVO {
    private Long careerId;
    private Long resumeId;
    private String companyName;
    private String jobPosition;
    private String startDate;       // period 파싱(yyyy-MM-01)
    private String endDate;         // 재직중 → null
    private String employmentType;  // CHECK(정규직/계약직/인턴)로 보정
    private String mainDuties;      // desc 100자 절단
}
