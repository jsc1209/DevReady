# DevReady (모노레포)

개인 풀스택 데모/포트폴리오. 프론트엔드 + 백엔드(예정) + AI 연동 + DB를 한 레포로 통합한다.

## 구조

```
.
├── frontend/   # React + Vite + MUI 프론트엔드 (이력서 분석 등 데모 기능)
├── backend/    # Spring Boot 백엔드 (다음 단계에 추가 예정)
├── ai/         # AI 서버는 Colab/RunPod에서 별도 실행 — 연동은 frontend/.env 의 VITE_API_BASE_URL
├── db/         # MySQL 스키마(devready_schema.sql) — 컨테이너 최초 기동 시 자동 로드
└── docker-compose.yml
```

## DB 띄우기 (MySQL 8)

```bash
docker compose up -d   # devready-mysql 컨테이너 기동 (포트 3306, DB·계정 모두 devready / 스키마 자동 로드)
```

## 프론트 실행

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```
