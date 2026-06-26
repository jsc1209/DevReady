package com.devready.backend_user.jobposting.service;

import com.devready.backend_user.jobposting.mapper.JobPostingMapper;
import com.devready.backend_user.jobposting.vo.JobPostingVO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 공고 조회 서비스. 인증 불필요한 단순 읽기.
 */
@Service
@RequiredArgsConstructor
public class JobPostingService {

    private final JobPostingMapper jobPostingMapper;

    public List<JobPostingVO> findAll() {
        return jobPostingMapper.findAll();
    }

    public JobPostingVO findById(Long id) {
        return jobPostingMapper.findById(id);
    }
}
