# DevReady (모노레포)

[![CI](https://github.com/jsc1209/Devready/actions/workflows/ci.yml/badge.svg)](https://github.com/jsc1209/Devready/actions/workflows/ci.yml)

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

## 로컬 실행 (Docker)

전체 스택(프론트엔드 · 백엔드 · MySQL)을 컨테이너로 한 번에 실행합니다.

### 사전 준비
- Docker Desktop 설치 및 실행
- 루트에 `.env` 생성 후 값 입력 (커밋되지 않음):

```
DB_PASSWORD=<MySQL root 비밀번호>
JWT_SECRET=<32바이트 이상 시크릿>
VITE_API_BASE_URL=http://localhost:8000
```

### 실행
```bash
docker compose up -d --build
```
- `frontend` → http://localhost:5173 (nginx 정적 서빙)
- `backend` → http://localhost:8080 (Spring Boot, /health 로 상태 확인)
- `mysql` → localhost:3306 (db/ 의 스키마 자동 적재)

> 로컬에 MySQL 8 이 이미 3306 을 점유 중이면 충돌하므로, `net stop MySQL80` 등으로 중지 후 실행하세요.

### 종료
```bash
docker compose down
```

## 기술 스택
- **Frontend**: React (Vite, JSX), MUI, Zustand, React Router, Axios
- **Backend**: Spring Boot 3.5 (Java 21, Gradle), MyBatis, Spring Security, JWT
- **Database**: MySQL 8 (67 tables)
- **AI**: FastAPI + EXAONE-Deep-7.8B (별도 서버/Colab)
- **CI/CD**: GitHub Actions (빌드 검증 + Docker 이미지 빌드)
- **Infra**: Docker / docker-compose

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
