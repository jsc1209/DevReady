package com.devready.backend_user.resume.controller;

import com.devready.backend_user.common.jwt.LoginMember;
import com.devready.backend_user.common.vo.DataVO;
import com.devready.backend_user.resume.service.ResumeStoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * 이력서 영속화 API(/api/resumes). 분석 프록시(/api/resume/analyze)와 경로·클래스 모두 분리.
 * 모든 작업은 @LoginMember(토큰→member_id) 기준이며, 비로그인은 401, 남의 이력서는 거부.
 */
@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeStoreController {

    private final ResumeStoreService resumeStoreService;

    /** 내 이력서 목록(각 resume = 최신 데이터 + 버전 목록). */
    @GetMapping
    public ResponseEntity<DataVO> myResumes(@LoginMember Long memberId) {
        if (memberId == null) {
            return ResponseEntity.status(401).body(DataVO.fail("로그인이 필요합니다."));
        }
        return ResponseEntity.ok(DataVO.ok(resumeStoreService.findMyResumes(memberId)));
    }

    /** 새 이력서 저장(첫 저장). */
    @PostMapping
    public ResponseEntity<DataVO> create(@LoginMember Long memberId,
                                         @RequestBody Map<String, Object> body) {
        if (memberId == null) {
            return ResponseEntity.status(401).body(DataVO.fail("로그인이 필요합니다."));
        }
        return ResponseEntity.ok(DataVO.ok("저장되었습니다.", resumeStoreService.createResume(memberId, body)));
    }

    /** 기존 이력서 저장/수정(+버전 추가). */
    @PutMapping("/{id}")
    public ResponseEntity<DataVO> update(@LoginMember Long memberId,
                                         @PathVariable Long id,
                                         @RequestBody Map<String, Object> body) {
        if (memberId == null) {
            return ResponseEntity.status(401).body(DataVO.fail("로그인이 필요합니다."));
        }
        Map<String, Object> res = resumeStoreService.updateResume(memberId, id, body);
        if (res == null) {
            return ResponseEntity.status(404).body(DataVO.fail("이력서를 찾을 수 없거나 권한이 없습니다."));
        }
        return ResponseEntity.ok(DataVO.ok("저장되었습니다.", res));
    }

    /** 이력서 삭제. */
    @DeleteMapping("/{id}")
    public ResponseEntity<DataVO> delete(@LoginMember Long memberId, @PathVariable Long id) {
        if (memberId == null) {
            return ResponseEntity.status(401).body(DataVO.fail("로그인이 필요합니다."));
        }
        if (!resumeStoreService.deleteResume(memberId, id)) {
            return ResponseEntity.status(404).body(DataVO.fail("이력서를 찾을 수 없거나 권한이 없습니다."));
        }
        return ResponseEntity.ok(DataVO.ok("삭제되었습니다.", null));
    }
}
