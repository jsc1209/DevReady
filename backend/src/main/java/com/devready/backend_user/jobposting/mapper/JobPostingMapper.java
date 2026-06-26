package com.devready.backend_user.jobposting.mapper;

import com.devready.backend_user.jobposting.vo.JobPostingVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface JobPostingMapper {
    List<JobPostingVO> findAll();
    JobPostingVO findById(@Param("id") Long id);
}
