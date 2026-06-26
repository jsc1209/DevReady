package com.devready.backend_user.jobposting.controller;

import com.devready.backend_user.common.vo.DataVO;
import com.devready.backend_user.jobposting.service.JobPostingService;
import com.devready.backend_user.jobposting.vo.JobPostingVO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 공고 조회 API. 조회라 인증 불필요(permitAll 유지).
 * 응답은 기존 도메인 컨벤션(DataVO) 따름.
 */
@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobPostingController {

    private final JobPostingService jobPostingService;

    @GetMapping
    public DataVO list() {
        return DataVO.ok(jobPostingService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DataVO> detail(@PathVariable Long id) {
        JobPostingVO job = jobPostingService.findById(id);
        if (job == null) {
            return ResponseEntity.status(404).body(DataVO.fail("공고를 찾을 수 없습니다."));
        }
        return ResponseEntity.ok(DataVO.ok(job));
    }
}
