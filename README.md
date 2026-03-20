# LesChef-Web

레시피·게시판·식재료 보관함을 다루는 웹 프로젝트입니다. **프론트(Next.js)** 와 **백엔드(Express)** 가 분리된 저장소입니다.

## 구성

| 디렉터리 | 설명 |
|----------|------|
| `leschef-web-front/` | Next.js 15 (App Router), `src/app` · `src/components` |
| `les-chef-back/` | Express + MongoDB(Mongoose), `src/routers` · `src/controllers` |

## 사전 준비

- Node.js 20+ 권장  
- MongoDB (백엔드)  
- 각 패키지의 `.env` / `.env.example` 참고

## 로컬 실행

### 백엔드

```bash
cd les-chef-back
cp .env.example .env   # 최초 1회, 값 수정
npm install
npm run dev             # 기본 http://localhost:3001 (PORT는 .env)
```

### 프론트

```bash
cd leschef-web-front
cp .env.example .env    # API 베이스 URL 등
npm install
npm run dev             # node server.js → 기본 http://localhost:3000
# 또는: npm run dev:http  (next dev만)
```

## 자주 쓰는 스크립트

### 프론트 (`leschef-web-front`)

| 스크립트 | 설명 |
|----------|------|
| `npm run dev` | 커스텀 HTTP 서버로 Next 실행 |
| `npm run dev:http` | `next dev --turbopack` |
| `npm run build` / `npm start` | 프로덕션 빌드·실행 |
| `npm run type-check` | `tsc --noEmit` |
| `npm run knip` | 미사용 파일·의존성·export 점검 |
| `npm run format` / `npm run format:check` | Prettier 일괄 포맷 / 검사 |
| `npm test` | Jest |

### 백엔드 (`les-chef-back`)

| 스크립트 | 설명 |
|----------|------|
| `npm run dev` | `tsx watch src/index.ts` |
| `npm run build` | `tsc` → `dist/` |
| `npm start` | `node dist/index.js` |
| `npm run type-check` | 타입만 검사 |
| `npm run knip` | 미사용 코드 점검 |
| `npm run format` / `npm run format:check` | Prettier |
| `npm test` | Jest (`RUN_AUTH_API_INTEGRATION=1` 시 일부 통합 테스트) |

## 코드 가이드 (요약)

- **프론트**: 페이지는 `src/app`, 공통 UI는 `src/components`, API 래퍼는 `src/utils/api`, 경로 별칭 `@/` → `src/`.
- **백엔드**: 라우트는 `src/routers/<도메인>/index.ts`, 비즈니스 로직은 `src/controllers`. 컨트롤러 **배럴 `index.ts`** 는 라우터에서 직접 파일을 import 하는 경우가 많으므로, 배럴을 새로 만들 때는 실제 import 경로를 맞출 것.
- **환경 변수**: 민감 값은 커밋하지 말고 `.env.example`만 갱신.

## 유지보수 시 추천 순서

1. `npm run format:check` (또는 저장 전 `npm run format`)  
2. `npm run type-check` (프론트/백 각각)  
3. `npm run knip` — 제거 후보 확인 (Tailwind 설정 등 **예외는 `knip.json`** 참고)  
4. `npm test`  
5. 프론트는 `npm run build`로 최종 확인  

## Lockfile

상위 폴더에 다른 `package-lock.json`이 있으면 Knip/NPM이 잘못된 루트를 고를 수 있습니다. **이 프로젝트는 각 하위 폴더에서만 `npm install` 하는 것**을 권장합니다.

## 코드 스타일 (Prettier)

- 프론트·백 각각 `.prettierrc.json` / `.prettierignore` 가 있습니다.
- VS Code/Cursor에서 **Prettier 확장** 설치 시 `.vscode/settings.json` 기준으로 저장 시 포맷됩니다.
- PR 전 `npm run format:check` 로 통일 여부를 확인할 수 있습니다.
