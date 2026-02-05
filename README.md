# Switch One - 환전 플랫폼

Switchwon 프론트엔드 개발자 채용 과제 프로젝트입니다.

## 📋 프로젝트 개요

실시간 환율 정보를 제공하고 사용자가 간편하게 환전할 수 있는 웹 애플리케이션입니다.  
이 프로젝트는 [Switchwon 프론트엔드 개발자 채용 과제](https://github.com/Switchwon-Dev/frontend-developer-challenge)를 기반으로 구현되었습니다.

### 주요 기능

- 🔐 **이메일 기반 로그인**: 이메일 주소만으로 간편 로그인, JWT 토큰 기반 인증
- 🛡️ **라우트 보호**: 미인증 사용자의 보호된 페이지 접근 차단 및 자동 리다이렉트
- 💱 **실시간 환율 조회**: 최신 환율 정보 및 변동률 표시 (1분마다 자동 갱신)
- 💰 **지갑 관리**: 다중 통화(KRW, USD, JPY) 지갑 잔액 실시간 조회
- 🔄 **환전 기능**:
  - 환전 견적 조회 (`POST /orders/quote`)
  - 환전 주문 실행
  - 환전 성공 시 지갑 잔액 자동 갱신
- 📊 **거래 내역**: 모든 환전 이력 조회 및 테이블 형태로 표시

## 🏗️ 기술 스택

### 프론트엔드

- **Next.js 16** - React 프레임워크
- **React 19** - UI 라이브러리
- **TypeScript** - 타입 안정성
- **Tailwind CSS 4** - 스타일링
- **TanStack Query** - 서버 상태 관리
- **React Hook Form** - 폼 관리
- **TanStack Table** - 테이블 컴포넌트

### 개발 도구

- **pnpm** - 패키지 매니저
- **Turbo** - Monorepo 빌드 시스템
- **ESLint** - 코드 린팅
- **Prettier** - 코드 포맷팅

## 📁 프로젝트 구조

```
switch_one/
├── apps/
│   └── exchange_switch/     # Next.js 메인 애플리케이션
│       └── app/
│           ├── _api/        # API 호출 로직
│           ├── _components/ # React 컴포넌트
│           ├── _constants/  # 상수 정의
│           ├── _types/      # TypeScript 타입 정의
│           └── (loggedIn)/  # 인증된 사용자 라우트
│           └── (login)/     # 로그인 라우트
│
└── packages/
    ├── shared/              # 공유 패키지
    │   ├── hooks/          # 공용 React Hooks
    │   ├── lib/            # 유틸리티 라이브러리
    │   ├── providers/      # React Context Providers
    │   ├── ui/             # 공용 UI 컴포넌트
    │   └── utils/          # 유틸리티 함수
    │
    └── config/             # 공유 설정
        ├── eslint/         # ESLint 설정
        ├── prettier/       # Prettier 설정
        └── typescript/     # TypeScript 설정
```

## 🚀 시작하기

### 필수 요구사항

- Node.js >= 18
- pnpm 9.15.0

### 설치

```bash
# 의존성 설치
pnpm install
```

### 개발 서버 실행

```bash
# 전체 프로젝트 개발 모드 실행
pnpm dev

# exchange_switch 앱만 실행
pnpm dev:exchange
```

개발 서버는 `http://localhost:3000`에서 실행됩니다.

### 빌드

```bash
# 프로덕션 빌드
pnpm build

# 프로덕션 서버 실행
pnpm start
```

### 코드 포맷팅

```bash
# 코드 포맷팅
pnpm format

# 포맷팅 체크
pnpm format:check
```


## 📦 패키지 구조

### `apps/exchange_switch`

메인 Next.js 애플리케이션으로, App Router를 사용합니다.

- **라우팅**: Next.js App Router 기반
- **인증**:
  - JWT 토큰을 쿠키에 저장 (`packages/shared/lib/server/token-manager.ts`)
  - 미들웨어를 통한 라우트 보호 (`proxy.ts`)
  - 미인증 사용자는 보호된 페이지 접근 시 로그인 페이지로 리다이렉트
- **API 통신**:
  - 서버 컴포넌트: `serverAPI` 인스턴스를 통한 직접 호출
  - 클라이언트 컴포넌트: TanStack Query를 통한 상태 관리
  - 모든 API 요청에 자동으로 Authorization 헤더 포함
- **실시간 데이터 갱신**:
  - 환율 정보: 1분마다 자동 refetch (`refetchInterval: 60000`)
  - 지갑 정보: 1분마다 자동 refetch

### `packages/shared`

다른 패키지에서 공유하는 코드입니다.

- **UI 컴포넌트**: 서버/클라이언트 컴포넌트 분리
- **Hooks**: 재사용 가능한 React Hooks
- **유틸리티**: 공통 유틸리티 함수
- **타입 정의**: 공유 TypeScript 타입

## 🔌 API 정보

### Base URL

- **API 서버**: `https://exchange-example.switchflow.biz`
- **Swagger UI**: [https://exchange-example.switchflow.biz/swagger-ui/index.html](https://exchange-example.switchflow.biz/swagger-ui/index.html)

### 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음을 설정하세요:

```env
NEXT_PUBLIC_API_URL=https://exchange-example.switchflow.biz
```

### 주요 API 엔드포인트

- `POST /auth/login` - 이메일 기반 로그인 (JWT 토큰 발급)
- `GET /exchange-rates/latest` - 최신 환율 조회
- `GET /wallets` - 지갑 목록 조회
- `GET /orders` - 주문 내역 조회
- `POST /orders/quote` - 환전 견적 조회
- `POST /orders` - 환전 주문 실행

### 인증 방식

- 로그인 시 서버로부터 받은 JWT 토큰을 **쿠키에 저장**
- 모든 API 요청 시 `Authorization: Bearer {token}` 헤더 자동 포함
- 인증 실패(401/403) 시 자동으로 토큰 삭제 및 로그인 페이지로 리다이렉트

### API 응답 형식

모든 API는 다음 형식의 응답을 반환합니다:

```typescript
// 성공 응답
{
  "code": "OK",
  "message": "정상적으로 처리되었습니다.",
  "data": { ... }
}

// 에러 응답
{
  "code": "VALIDATION_ERROR" | "UNAUTHORIZED" | "WALLET_INSUFFICIENT_BALANCE" | ...,
  "message": "에러 메시지",
  "data": { ... } | null
}
```

주요 에러 코드:

- `VALIDATION_ERROR`: 요청 데이터 유효성 검사 실패
- `UNAUTHORIZED`: 인증 토큰이 없거나 유효하지 않음
- `WALLET_INSUFFICIENT_BALANCE`: 지갑 잔액 부족
- `EXCHANGE_RATE_MISMATCH`: 환율 정보 불일치

## 🎨 주요 페이지

- `/` - 로그인 페이지
  - 이메일 주소 입력 후 로그인
  - 로그인 성공 시 `/info`로 자동 리다이렉트
- `/info` - 환율 정보 및 환전 페이지 (인증 필요)
  - 실시간 환율 정보 표시 (1분마다 자동 갱신)
  - 지갑 잔액 조회 (1분마다 자동 갱신)
  - 환전 견적 조회 및 환전 실행
  - 환전 성공 시 지갑 잔액 자동 갱신
- `/exchange-history` - 거래 내역 페이지 (인증 필요)
  - 모든 환전 이력을 테이블 형태로 표시

## 🏛️ 아키텍처 결정

### Monorepo 구조 선택

이 프로젝트는 단일 애플리케이션으로도 충분하지만, **의도적으로 Monorepo 구조를 채택**했습니다.

**이유:**
- Switchwon의 주요 업무에 **Monorepo (Turborepo) 환경에서 개발 경험**이 포함되어 있음
- 여러 패키지 관리 및 빌드 최적화 경험을 보여주기 위함
- `packages/shared`를 통해 공용 컴포넌트, 유틸리티, 설정을 분리하여 재사용성과 유지보수성 향상

**구조:**
- `apps/exchange_switch`: 메인 Next.js 애플리케이션
- `packages/shared`: 공유 UI 컴포넌트, Hooks, 유틸리티, 라이브러리
- `packages/config`: 공유 ESLint, Prettier, TypeScript 설정

### Next.js 서버 컴포넌트 활용

**이유:**
- API 서버에서 **CORS 허용이 설정되어 있지 않아** 클라이언트에서 직접 API 호출 불가
- Next.js 서버 컴포넌트를 통해 서버 사이드에서 API를 호출하여 CORS 문제 해결
- 서버 사이드 렌더링을 통한 초기 로딩 성능 향상

**구현 방식:**
- 서버 컴포넌트: `_api` 디렉토리의 함수를 통해 직접 API 호출
- 클라이언트 컴포넌트: TanStack Query를 사용하되, 내부적으로 서버 액션을 통해 API 호출

## 📝 개발 가이드

### 코드 스타일

- TypeScript strict 모드 사용
- Prettier 자동 포맷팅
- ESLint 규칙 준수

### 컴포넌트 구조

- 서버 컴포넌트 우선 사용
- 클라이언트 컴포넌트는 필요한 경우에만 사용 (`"use client"`)
- 공용 컴포넌트는 `packages/shared/ui`에 배치

### API 호출

- **서버 컴포넌트**: `_api` 디렉토리의 함수를 직접 호출
  - `serverAPI` 인스턴스 사용 (자동 토큰 포함)
  - 쿠키에서 토큰을 읽어 Authorization 헤더에 자동 추가
  - **CORS 문제 해결**: 서버 사이드에서 API 호출하여 브라우저 CORS 제한 회피
- **클라이언트 컴포넌트**: TanStack Query 사용
  - `useQuery`로 데이터 조회 및 캐싱
  - `useMutation`으로 데이터 변경
  - `refetchInterval`로 주기적 데이터 갱신
  - 내부적으로 서버 액션을 통해 API 호출 (CORS 회피)

### 에러 처리

- API 에러는 `serverAPI`의 `beforeError` 훅에서 처리
- 401/403 에러 시 자동으로 토큰 삭제 및 로그인 페이지로 리다이렉트
- 에러 응답의 `code`와 `message`를 활용한 사용자 친화적 에러 표시

## 📝 구현 상세

### 인증 플로우

1. 사용자가 이메일 주소 입력 후 로그인
2. `POST /auth/login` API 호출
3. 서버로부터 JWT 토큰(`accessToken`) 수신
4. 토큰을 쿠키에 저장 (서버 사이드)
5. 이후 모든 API 요청에 `Authorization: Bearer {token}` 헤더 자동 포함

### 라우트 보호

- Next.js 미들웨어(`proxy.ts`)를 통한 라우트 보호
- 토큰이 없는 사용자가 `/info` 또는 `/exchange-history` 접근 시 `/`로 리다이렉트
- 토큰이 있는 사용자가 `/` 접근 시 `/info`로 리다이렉트

### 실시간 데이터 갱신

- **환율 정보**: `useExchangeRateQuery`에서 `refetchInterval: 60000` 설정
- **지갑 정보**: `useWalletQuery`에서 `refetchInterval: 60000` 설정
- 환전 성공 시 `queryClient.invalidateQueries`로 지갑 데이터 즉시 갱신

### 환전 플로우

1. 사용자가 환전할 통화와 금액 선택
2. `POST /orders/quote`로 환전 견적 조회
3. 견적 확인 후 '환전하기' 버튼 클릭
4. `POST /orders`로 환전 주문 실행
5. 성공 시 지갑 잔액 자동 갱신

## 📄 참고 자료

- [과제 원본 문서](https://github.com/Switchwon-Dev/frontend-developer-challenge)
- [API Swagger 문서](https://exchange-example.switchflow.biz/swagger-ui/index.html)

## 📄 라이선스

이 프로젝트는 Switchwon 프론트엔드 개발자 채용 과제용으로 작성되었습니다.
