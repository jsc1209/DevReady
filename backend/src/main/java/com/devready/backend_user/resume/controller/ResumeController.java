package com.devready.backend_user.resume.controller;

import com.devready.backend_user.resume.service.ResumeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 이력서 분석 게이트웨이 컨트롤러.
 * 프론트 → Spring(/api/resume/analyze) → Colab FastAPI(/resume/analyze) 중계.
 * FastAPI 원본 응답을 변형 없이 그대로 반환한다(DataVO 미적용 — 프론트 파싱 보존).
 * 요청 바디는 snake_case 그대로 패스스루하기 위해 Map 으로 받는다.
 */
@RestController
@RequestMapping("/api/resume")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeService resumeService;

    @PostMapping("/analyze")
    public Map<String, Object> analyze(@RequestBody Map<String, Object> body) {
        return resumeService.analyze(body);
    }
}
