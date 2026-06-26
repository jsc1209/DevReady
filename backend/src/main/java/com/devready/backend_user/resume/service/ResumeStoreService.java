package com.devready.backend_user.resume.service;

import com.devready.backend_user.resume.mapper.ResumeMapper;
import com.devready.backend_user.resume.vo.CareerVO;
import com.devready.backend_user.resume.vo.ResumeVO;
import com.devready.backend_user.resume.vo.ResumeVersionVO;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 이력서 base + 버전 영속화. 멀티 이력서(회원당 여러 resume 행), 이력서당 여러 version.
 * 저장 = resume 기본 + career[] + resume_skill[] 정규화(전체 교체) + member.name 동기화
 *        + resume_version(전체 스냅샷 JSON) INSERT.
 * 학력/자격증/자소서는 정규화하지 않고 스냅샷 JSON 에만 보존(슬라이스3 바인딩 시점에 정규화).
 * 모든 쓰기/읽기는 본인 member_id 범위로 제한.
 *
 * (분석 프록시 {@code ResumeService} 와 별개 클래스 — 그쪽은 /api/resume/analyze 중계 전용.)
 */
@Service
@RequiredArgsConstructor
public class ResumeStoreService {

    private final ResumeMapper resumeMapper;
    private final ObjectMapper objectMapper;

    private static final Set<String> ALLOWED_EMP = Set.of("정규직", "계약직", "인턴");
    private static final Pattern YM = Pattern.compile("(\\d{4})\\.(\\d{1,2})");

    /** 내 이력서 전체(각 resume = 최신 스냅샷 data + 버전 목록). 본인 것만. */
    @Transactional(readOnly = true)
    public List<Map<String, Object>> findMyResumes(Long memberId) {
        List<ResumeVO> resumes = resumeMapper.findResumesByMember(memberId);
        List<Map<String, Object>> out = new ArrayList<>();
        for (ResumeVO r : resumes) {
            List<ResumeVersionVO> versions = resumeMapper.findVersionsByResume(r.getResumeId());
            Map<String, Object> latest = versions.isEmpty()
                    ? null : parse(versions.get(versions.size() - 1).getSnapshot());

            Map<String, Object> item = new LinkedHashMap<>();
            item.put("resumeId", r.getResumeId());
            item.put("isPrimary", r.getIsPrimary());
            item.put("name", latest != null ? latest.get("name") : null);
            item.put("data", latest);

            List<Map<String, Object>> vlist = new ArrayList<>();
            for (ResumeVersionVO v : versions) {
                Map<String, Object> vm = new LinkedHashMap<>();
                vm.put("versionId", v.getVersionId());
                vm.put("versionNo", v.getVersionNo());
                vm.put("label", v.getLabel());
                vm.put("createdAt", v.getCreatedAt());
                vm.put("data", parse(v.getSnapshot()));
                vlist.add(vm);
            }
            item.put("versions", vlist);
            out.add(item);
        }
        return out;
    }

    /** 새 이력서 생성(첫 저장). */
    @Transactional
    public Map<String, Object> createResume(Long memberId, Map<String, Object> body) {
        ResumeVO r = new ResumeVO();
        r.setMemberId(memberId);
        applyBase(r, body);
        r.setIsPrimary(resumeMapper.countByMember(memberId) == 0 ? 1 : 0);
        resumeMapper.insertResume(r);
        return persist(memberId, r.getResumeId(), body);
    }

    /** 기존 이력서 저장/수정. 본인 소유 아니면 null. */
    @Transactional
    public Map<String, Object> updateResume(Long memberId, Long resumeId, Map<String, Object> body) {
        ResumeVO owner = resumeMapper.findResumeById(resumeId);
        if (owner == null || !owner.getMemberId().equals(memberId)) {
            return null;
        }
        ResumeVO r = new ResumeVO();
        r.setResumeId(resumeId);
        applyBase(r, body);
        resumeMapper.updateResumeBase(r);
        return persist(memberId, resumeId, body);
    }

    /** 이력서 삭제(종속 행 포함). 본인 소유 아니면 false. */
    @Transactional
    public boolean deleteResume(Long memberId, Long resumeId) {
        ResumeVO owner = resumeMapper.findResumeById(resumeId);
        if (owner == null || !owner.getMemberId().equals(memberId)) {
            return false;
        }
        resumeMapper.deleteVersionsByResume(resumeId);
        resumeMapper.deleteCareersByResume(resumeId);
        resumeMapper.deleteResumeSkillsByResume(resumeId);
        resumeMapper.deleteResume(resumeId);
        return true;
    }

    // ───── 내부: 정규화(career/skill) + member 동기화 + 버전 INSERT ─────
    private Map<String, Object> persist(Long memberId, Long resumeId, Map<String, Object> body) {
        // member.name 동기화(name 만; email/phone 은 로그인 식별·UNIQUE 라 미동기화)
        Map<String, Object> basic = asMap(body.get("basic"));
        if (basic != null) {
            String name = str(basic.get("name"));
            if (name != null && !name.isBlank()) {
                resumeMapper.updateMemberName(memberId, trunc(name.trim(), 50));  // member.name VARCHAR(50)
            }
        }

        // career 전체 교체(정규화)
        resumeMapper.deleteCareersByResume(resumeId);
        if (!Boolean.TRUE.equals(body.get("careerNone"))) {
            for (Object o : asList(body.get("careers"))) {
                Map<String, Object> c = asMap(o);
                if (c == null) continue;
                String company = str(c.get("company"));
                if (company == null || company.isBlank()) continue;   // 빈 행 스킵(스냅샷엔 보존)
                CareerVO cv = new CareerVO();
                cv.setResumeId(resumeId);
                cv.setCompanyName(trunc(company, 100));
                cv.setJobPosition(trunc(orEmpty(str(c.get("role"))), 100));
                String emp = str(c.get("employmentType"));
                cv.setEmploymentType(ALLOWED_EMP.contains(emp) ? emp : "계약직");
                cv.setMainDuties(trunc(orEmpty(str(c.get("desc"))), 100));
                boolean current = Boolean.TRUE.equals(c.get("current"));
                String[] se = parsePeriod(str(c.get("period")), current);
                cv.setStartDate(se[0]);
                cv.setEndDate(se[1]);
                resumeMapper.insertCareer(cv);
            }
        }

        // resume_skill 전체 교체 + skill 마스터 upsert
        resumeMapper.deleteResumeSkillsByResume(resumeId);
        if (!Boolean.TRUE.equals(body.get("skillsNone"))) {
            for (Object o : asList(body.get("skills"))) {
                String s = str(o);
                if (s == null || s.isBlank()) continue;
                s = s.trim();
                Long skillId = resumeMapper.findSkillByName(s);
                if (skillId == null) {
                    Map<String, Object> p = new HashMap<>();
                    p.put("name", trunc(s, 100));
                    resumeMapper.insertSkill(p);
                    skillId = ((Number) p.get("skillId")).longValue();
                }
                resumeMapper.insertResumeSkill(resumeId, skillId);
            }
        }

        // resume_version INSERT (전체 스냅샷)
        int versionNo = resumeMapper.maxVersionNo(resumeId) + 1;
        String resumeName = str(body.get("name"));
        ResumeVersionVO v = new ResumeVersionVO();
        v.setResumeId(resumeId);
        v.setVersionNo(versionNo);
        v.setLabel("v" + versionNo + " — " + (resumeName == null || resumeName.isBlank() ? "이력서" : resumeName));
        v.setSnapshot(toJson(body));
        resumeMapper.insertVersion(v);

        Map<String, Object> res = new LinkedHashMap<>();
        res.put("resumeId", resumeId);
        res.put("versionId", v.getVersionId());
        res.put("versionNo", versionNo);
        res.put("label", v.getLabel());
        res.put("createdAt", resumeMapper.findVersionCreatedAt(v.getVersionId()));
        return res;
    }

    private void applyBase(ResumeVO r, Map<String, Object> body) {
        Map<String, Object> basic = asMap(body.get("basic"));
        if (basic != null) {
            r.setAddress(str(basic.get("address")));
            r.setGithubUrl(str(basic.get("github")));
            r.setPortfolioUrl(str(basic.get("portfolio")));
        }
    }

    private String[] parsePeriod(String period, boolean current) {
        String start = null, end = null;
        if (period != null) {
            Matcher m = YM.matcher(period);
            List<String> ds = new ArrayList<>();
            while (m.find()) {
                int y = Integer.parseInt(m.group(1));
                int mo = Integer.parseInt(m.group(2));
                if (mo < 1) mo = 1;
                if (mo > 12) mo = 12;
                ds.add(String.format("%04d-%02d-01", y, mo));
            }
            if (!ds.isEmpty()) start = ds.get(0);
            if (ds.size() >= 2) end = ds.get(1);
        }
        if (start == null) start = "2000-01-01";   // 미파싱 placeholder(원본은 스냅샷에 보존)
        if (current) end = null;
        return new String[]{start, end};
    }

    // ───── helpers ─────
    @SuppressWarnings("unchecked")
    private Map<String, Object> asMap(Object o) {
        return (o instanceof Map) ? (Map<String, Object>) o : null;
    }

    @SuppressWarnings("unchecked")
    private List<Object> asList(Object o) {
        return (o instanceof List) ? (List<Object>) o : List.of();
    }

    private String str(Object o) {
        return o == null ? null : String.valueOf(o);
    }

    private String orEmpty(String s) {
        return s == null ? "" : s;
    }

    private String trunc(String s, int max) {
        if (s == null) return "";
        return s.length() <= max ? s : s.substring(0, max);
    }

    private String toJson(Object o) {
        try {
            return objectMapper.writeValueAsString(o);
        } catch (Exception e) {
            return "{}";
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> parse(String json) {
        try {
            return objectMapper.readValue(json, Map.class);
        } catch (Exception e) {
            return null;
        }
    }
}
