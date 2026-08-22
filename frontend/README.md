# Neuti Frontend

느티나무병원 협동조합 홈페이지 프론트엔드. Next.js 16 (App Router) + React 19 +
Tailwind CSS v4 + TypeScript.

## 실행

저장소 루트에서 Docker로 띄우는 것이 기본이다.

```bash
docker compose up -d       # frontend:3003 (backend:8003, db:5433)
```

단독 실행 시:

```bash
npm run dev                # http://localhost:3000
npm run build              # prebuild 로 scripts/sync-images.mjs 실행 후 빌드
npm start
npm test                   # jest (frontend/__tests__/)
npm run lint               # eslint
```

`npm run dev`로 단독 실행하려면 백엔드가 `BACKEND_INTERNAL_URL`(기본 `http://backend:8000`)
로 접근 가능해야 한다.

## API 프록시

`next.config.ts`의 rewrites가 처리한다 (`beforeFiles`):

- `/backend-api/*` → `${BACKEND_INTERNAL_URL}/api/v1/*`
- `/uploads/*` → `${BACKEND_INTERNAL_URL}/uploads/*`

API 클라이언트는 항상 `const API_URL = '/backend-api'`를 쓴다. 운영에서는 Traefik이
같은 경로 재작성을 담당한다.

빌드 출력은 `output: "standalone"` (Docker runner 스테이지용).

## 구조

```
src/
├── app/                  App Router 페이지
│   ├── layout.tsx        metadata template + OG + LocalBusiness JSON-LD
│   ├── sitemap.ts        정적 페이지 + 시공사례 개별 URL
│   ├── robots.ts
│   ├── about/ business/ contract/ performance/ notice/ qna/ request/
│   ├── admin/estimates/  견적 요청 관리
│   └── login/
├── components/
│   ├── Layout.tsx, Navbar.tsx
│   ├── common/           MobileBottomCTA 등 공용
│   ├── home/ about/ business/ performance/ diagnosis/ estimate/
│   └── Editor/           TipTap 기반 에디터
├── context/AuthContext.tsx
├── hooks/usePerformance.ts
├── lib/                  markdown.ts, performanceApi.ts, technologyApi.ts
├── data/                 home-content.ts(정적 폴백), history.json, technology-images.json
└── types/
```

## 인증

- `localStorage['admin_token']`에 JWT 저장, `useAuth()` 훅으로 접근
- 관리자일 때만 시공사례 수정, 공지 작성, 문의 답변, `/admin/estimates` 노출

## 이미지

- `scripts/sync-images.mjs`가 빌드 전에 `assets/`의 한글 파일명을 영문으로 변환해
  `public/images/`로 동기화한다
- **macOS Unicode NFD 주의**: `readdirSync`로 읽은 한글 파일명은 분해형(NFD)이다.
  비교 전 반드시 `.normalize('NFC')`를 적용할 것
- 업로드 이미지는 백엔드 `/uploads/*`를 프록시로 서빙한다

## 테스트

`frontend/__tests__/`에 jest + Testing Library 기반 테스트가 있다.
페이지 렌더링(index, about, business, performance, layout), 컴포넌트
(ProjectCard, ProjectGrid, FilterComponents, BoardTable, MainCarousel,
StatisticsDashboard, LatestUpdates, HomeSections), 훅·라이브러리 단위 테스트로 나뉜다.
