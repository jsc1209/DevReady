package com.devready.backend_user.resume.mapper;

import com.devready.backend_user.resume.vo.CareerVO;
import com.devready.backend_user.resume.vo.ResumeVO;
import com.devready.backend_user.resume.vo.ResumeVersionVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface ResumeMapper {

    // resume
    int countByMember(@Param("memberId") Long memberId);
    List<ResumeVO> findResumesByMember(@Param("memberId") Long memberId);
    ResumeVO findResumeById(@Param("id") Long id);
    int insertResume(ResumeVO resume);          // keyProperty=resumeId
    int updateResumeBase(ResumeVO resume);
    int deleteResume(@Param("resumeId") Long resumeId);

    // member 기본정보 동기화(name 만)
    int updateMemberName(@Param("memberId") Long memberId, @Param("name") String name);

    // career (정규화, 저장 시 전체 교체)
    int deleteCareersByResume(@Param("resumeId") Long resumeId);
    int insertCareer(CareerVO career);

    // skill / resume_skill (정규화, 저장 시 전체 교체 + skill 마스터 upsert)
    int deleteResumeSkillsByResume(@Param("resumeId") Long resumeId);
    Long findSkillByName(@Param("name") String name);
    int insertSkill(Map<String, Object> param);  // keyProperty=skillId
    int insertResumeSkill(@Param("resumeId") Long resumeId, @Param("skillId") Long skillId);

    // resume_version
    int maxVersionNo(@Param("resumeId") Long resumeId);
    int insertVersion(ResumeVersionVO version);  // keyProperty=versionId
    List<ResumeVersionVO> findVersionsByResume(@Param("resumeId") Long resumeId);
    int deleteVersionsByResume(@Param("resumeId") Long resumeId);
    String findVersionCreatedAt(@Param("versionId") Long versionId);
}
