package com.devready.backend_user.education.controller;

import com.devready.backend_user.education.service.EducationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 교육 퀴즈 게이트웨이 컨트롤러.
 * 프론트 → Spring(/api/education/quiz) → Colab FastAPI(/education/quiz) 중계.
 * FastAPI 원본을 변형 없이 그대로 반환(패스스루). 요청 바디(topic/n/difficulty/lang)는 Map 으로 받는다.
 */
@RestController
@RequestMapping("/api/education")
@RequiredArgsConstructor
public class EducationController {

    private final EducationService educationService;

    @PostMapping("/quiz")
    public Map<String, Object> quiz(@RequestBody Map<String, Object> body) {
        return educationService.quiz(body);
    }
}
