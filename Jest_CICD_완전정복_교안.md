# Jest 테스트와 GitHub Actions CI/CD 완전 정복 교안

## 🎯 학습 목표
비전공자도 이해할 수 있도록 테스트 작성부터 자동 배포까지 단계별로 학습합니다.

---

## 📚 목차
1. [테스트란 무엇인가?](#1-테스트란-무엇인가)
2. [Jest 설치 및 환경 설정](#2-jest-설치-및-환경-설정)
3. [첫 번째 테스트 작성하기](#3-첫-번째-테스트-작성하기)
4. [React 컴포넌트 테스트](#4-react-컴포넌트-테스트)
5. [CI/CD란 무엇인가?](#5-cicd란-무엇인가)
6. [GitHub Actions + Vercel 자동 배포 구축](#6-github-actions--vercel-자동-배포-구축)

---

## 1. 테스트란 무엇인가?

### 테스트의 필요성

프로그래밍에서 **테스트**는 우리가 작성한 코드가 제대로 동작하는지 자동으로 확인하는 것입니다.

**비유로 이해하기:**
- 자동차 공장에서 차를 만든 후 브레이크가 제대로 작동하는지 검사하는 것
- 요리를 한 후 간을 보는 것
- 제품을 출시하기 전 품질 검사를 하는 것

**코드 테스트의 장점:**
1. 버그를 미리 발견
2. 코드 수정 시 기존 기능이 깨지지 않는지 확인
3. 24시간 자동으로 검사 가능
4. 팀원들이 코드를 믿고 사용 가능

### Jest란?

**Jest**는 Facebook(현 Meta)에서 만든 JavaScript 테스트 도구입니다.

**특징:**
- 설정이 간단함
- 실행 속도가 빠름
- React와 잘 맞음
- 다양한 테스트 기능 제공

---

## 2. Jest 설치 및 환경 설정

### 2.1 필요한 패키지 설치

터미널에서 다음 명령어를 실행합니다:

```bash
# Jest와 관련 라이브러리 설치
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom @types/jest
```

**각 패키지 설명:**
- `jest`: 테스트 실행 도구
- `@testing-library/react`: React 컴포넌트를 테스트하기 위한 도구
- `@testing-library/jest-dom`: HTML 요소를 쉽게 테스트하는 도구
- `jest-environment-jsdom`: 브라우저 환경을 흉내내는 도구
- `@types/jest`: TypeScript에서 Jest를 사용하기 위한 타입 정의

### 2.2 Jest 설정 파일 만들기

#### 1) jest.config.mjs 파일 생성

프로젝트 루트에 `jest.config.mjs` 파일을 만들고 다음 내용을 입력합니다:

```javascript
import nextJest from 'next/jest.js'

// Next.js에 맞는 Jest 설정 생성
const createJestConfig = nextJest({
  // Next.js 앱의 위치를 알려줌
  dir: './',
})

// Jest 커스텀 설정
const customJestConfig = {
  // 테스트 실행 전에 실행할 설정 파일
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // 테스트 환경을 브라우저처럼 설정
  testEnvironment: 'jest-environment-jsdom',
  
  // @/ 경로를 src/ 폴더로 연결
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // 테스트하지 않을 폴더들
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
}

export default createJestConfig(customJestConfig)
```

#### 2) jest.setup.js 파일 생성

프로젝트 루트에 `jest.setup.js` 파일을 만들고 다음 내용을 입력합니다:

```javascript
// jest-dom의 추가 기능들을 사용할 수 있게 함
import '@testing-library/jest-dom'
```

#### 3) TypeScript 설정 (tsconfig.json) 수정

`tsconfig.json` 파일에서 `compilerOptions`에 다음을 추가합니다:

```json
{
  "compilerOptions": {
    // ... 기존 설정들
    "types": ["jest", "@testing-library/jest-dom"]
  }
}
```

#### 4) TypeScript 타입 선언 파일 생성

프로젝트 루트에 `jest-dom.d.ts` 파일을 만들고 다음 내용을 입력합니다:

```typescript
import '@testing-library/jest-dom'
```

### 2.3 package.json에 테스트 스크립트 추가

`package.json` 파일의 `scripts` 부분에 다음을 추가합니다:

```json
{
  "scripts": {
    // ... 기존 스크립트들
    "test": "jest",
    "test:watch": "jest --watch",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

**각 스크립트 설명:**
- `npm test`: 모든 테스트를 한 번 실행
- `npm run test:watch`: 파일이 바뀔 때마다 자동으로 테스트 실행
- `npm run test:ci`: CI/CD 환경에서 사용 (커버리지 리포트 포함)

---

## 3. 첫 번째 테스트 작성하기

### 3.1 테스트 폴더 구조 만들기

```bash
src/
  app/
    __tests__/        # 테스트 파일을 넣을 폴더
      simple.test.ts  # 간단한 테스트 파일
```

### 3.2 간단한 테스트 작성

`src/app/__tests__/simple.test.ts` 파일을 만들고 다음 내용을 입력합니다:

```typescript
// 가장 간단한 테스트 - 숫자 더하기
test("1 더하기 1은 2다", () => {
  expect(1 + 1).toBe(2);
});

// 문자열 테스트
test("인사말 만들기", () => {
  const name = "철수";
  const greeting = `안녕하세요, ${name}님!`;
  expect(greeting).toBe("안녕하세요, 철수님!");
});

// 조건 테스트
test("나이가 20살 이상이면 성인이다", () => {
  const age = 25;
  const isAdult = age >= 20;
  expect(isAdult).toBe(true);
});
```

### 3.3 테스트 실행하기

터미널에서 다음 명령어를 실행합니다:

```bash
npm test
```

성공하면 다음과 같은 결과가 나타납니다:
```
PASS  src/app/__tests__/simple.test.ts
  ✓ 1 더하기 1은 2다 (2 ms)
  ✓ 인사말 만들기 (1 ms)
  ✓ 나이가 20살 이상이면 성인이다
```

### 3.4 테스트 문법 이해하기

#### test() 함수
```javascript
test("테스트 설명", () => {
  // 테스트 코드
});
```
- 하나의 테스트를 만드는 함수
- 첫 번째: 테스트가 무엇을 하는지 설명
- 두 번째: 실제 테스트 코드

#### expect() 함수
```javascript
expect(실제값).toBe(예상값);
```
- 값을 검증하는 함수
- "실제값이 예상값과 같아야 한다"는 의미

#### 주요 검증 메서드
- `toBe()`: 정확히 같은지 (1 === 1)
- `toEqual()`: 내용이 같은지 (객체, 배열)
- `toBeTruthy()`: 참인지
- `toBeFalsy()`: 거짓인지
- `toContain()`: 포함하는지

### 3.5 더 복잡한 테스트 예제

```typescript
// 함수를 테스트하기
function multiply(a: number, b: number): number {
  return a * b;
}

test("곱셈 함수가 올바르게 동작한다", () => {
  expect(multiply(3, 4)).toBe(12);
  expect(multiply(5, 0)).toBe(0);
});

// 객체를 테스트하기
test("사용자 객체가 올바른 형태를 가진다", () => {
  const user = {
    name: "김철수",
    age: 25,
    email: "kim@test.com"
  };
  
  expect(user).toEqual({
    name: "김철수",
    age: 25,
    email: "kim@test.com"
  });
});

// 배열을 테스트하기
test("장바구니에 상품이 추가된다", () => {
  const cart = ["사과", "바나나"];
  cart.push("딸기");
  
  expect(cart).toContain("딸기");
  expect(cart.length).toBe(3);
});
```

---

## 4. React 컴포넌트 테스트

### 4.1 React 컴포넌트 테스트가 필요한 이유

- 사용자가 보는 화면이 제대로 나타나는지 확인
- 버튼 클릭 등 상호작용이 잘 동작하는지 확인
- 컴포넌트 수정 시 기능이 깨지지 않는지 확인

### 4.2 홈페이지 컴포넌트 테스트 작성

`src/app/__tests__/page.test.tsx` 파일을 만들고 다음 내용을 입력합니다:

```typescript
// 필요한 도구들 가져오기
import { render, screen } from "@testing-library/react";
import Home from "../page";  // 테스트할 홈페이지 컴포넌트

// 외부 라이브러리를 가짜로 만들기 (모킹)
// Next.js 라우터를 가짜로 만들기
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),      // 페이지 이동 함수 (가짜)
      prefetch: jest.fn(),  // 페이지 미리 로드 함수 (가짜)
    };
  },
}));

// 사용자 정보 저장소를 가짜로 만들기
jest.mock("@/lib/userStore", () => ({
  useUserStore: () => ({
    user: null,           // 로그인 안 한 상태
    isLoading: false,     // 로딩 중 아님
    setUser: jest.fn(),   // 사용자 설정 함수 (가짜)
    clearUser: jest.fn(), // 로그아웃 함수 (가짜)
  }),
}));

// 사용자 데이터 가져오기를 가짜로 만들기
jest.mock("@/lib/useUserData", () => ({
  useUserData: () => ({
    getUserData: jest.fn(), // 데이터 가져오기 함수 (가짜)
  }),
}));

// 테스트 그룹 만들기
describe("홈페이지 테스트", () => {
  
  // 각 테스트 전에 실행되는 설정
  beforeEach(() => {
    jest.clearAllMocks(); // 이전 테스트의 흔적을 지움
  });

  // 테스트 1: 제목이 잘 나타나는지
  test("홈페이지 제목이 표시된다", () => {
    // 1. 홈페이지를 화면에 그리기
    render(<Home />);
    
    // 2. "Next.js 커뮤니티"라는 텍스트 찾기
    const heading = screen.getByText("Next.js 커뮤니티");
    
    // 3. 찾은 텍스트가 화면에 있는지 확인
    expect(heading).toBeInTheDocument();
  });

  // 테스트 2: 메뉴들이 잘 나타나는지
  test("주요 서비스 메뉴들이 표시된다", () => {
    render(<Home />);
    
    // 각 메뉴가 화면에 있는지 확인
    expect(screen.getByText("상품 쇼핑")).toBeInTheDocument();
    expect(screen.getByText("장바구니")).toBeInTheDocument();
    expect(screen.getByText("커뮤니티")).toBeInTheDocument();
  });

  // 테스트 3: 링크가 올바른 주소를 가지는지
  test("메뉴 링크가 올바른 페이지로 연결된다", () => {
    render(<Home />);
    
    // 각 링크의 주소가 맞는지 확인
    const productLink = screen.getByText("상품 보러가기");
    expect(productLink).toHaveAttribute("href", "/products");
    
    const cartLink = screen.getByText("장바구니 확인");
    expect(cartLink).toHaveAttribute("href", "/cart");
  });
});
```

### 4.3 모킹(Mocking)이란?

**모킹**은 실제 기능을 가짜로 대체하는 것입니다.

**왜 필요한가요?**
1. 테스트 환경에는 브라우저가 없음
2. 데이터베이스 연결이 없음
3. 외부 서비스(결제, 이메일 등)를 실제로 호출하면 안 됨

**비유:**
- 소방 훈련 시 실제 불 대신 가짜 연기 사용
- 운전 연습 시 실제 도로 대신 연습장 사용

### 4.4 React Testing Library 주요 함수

#### render()
```javascript
render(<Component />)
```
- React 컴포넌트를 가상의 화면에 그림
- 실제 브라우저 없이 테스트 가능

#### screen
```javascript
screen.getByText("텍스트")
screen.getByRole("button")
```
- 화면에서 요소를 찾는 도구 모음
- 텍스트, 역할, 속성 등으로 찾기 가능

#### 주요 찾기 메서드
- `getByText()`: 텍스트로 찾기
- `getByRole()`: 역할로 찾기 (button, link 등)
- `getByTestId()`: 테스트 ID로 찾기
- `queryByText()`: 없어도 에러 안 남 (null 반환)

---

## 5. CI/CD란 무엇인가?

### CI/CD의 개념

**CI (Continuous Integration - 지속적 통합)**
- 코드를 자주 합치고 자동으로 테스트
- 여러 개발자가 함께 일할 때 충돌 방지

**CD (Continuous Deployment - 지속적 배포)**
- 테스트를 통과한 코드를 자동으로 배포
- 수동 배포의 실수와 시간 낭비 방지

### 비유로 이해하기

**전통적인 방식 (수동):**
1. 개발자가 코드 작성
2. 수동으로 테스트
3. 수동으로 서버에 업로드
4. 문제 발생 시 밤늦게 수정

**CI/CD 방식 (자동):**
1. 개발자가 코드 작성
2. GitHub에 업로드하면 자동 테스트
3. 테스트 통과하면 자동 배포
4. 문제 발생 시 자동으로 알림

### CI/CD의 장점

1. **시간 절약**: 반복 작업 자동화
2. **실수 방지**: 사람의 실수 최소화
3. **빠른 피드백**: 문제를 즉시 발견
4. **안정적 배포**: 항상 같은 방식으로 배포

---

## 6. GitHub Actions + Vercel 자동 배포 구축

### 6.1 사전 준비

#### 1단계: Vercel 토큰 생성

1. [Vercel 웹사이트](https://vercel.com) 로그인
2. 계정 설정으로 이동
3. [Tokens 페이지](https://vercel.com/account/tokens) 접속
4. "Create Token" 버튼 클릭
5. 토큰 이름 입력 (예: "GitHub Actions")
6. "Create" 클릭
7. **생성된 토큰을 안전한 곳에 복사** (다시 볼 수 없음!)

#### 2단계: GitHub에 시크릿 추가

1. GitHub 레포지토리 페이지로 이동
2. Settings 탭 클릭
3. 왼쪽 메뉴에서 "Secrets and variables" → "Actions" 클릭
4. "New repository secret" 버튼 클릭
5. 다음 정보 입력:
   - Name: `VERCEL_TOKEN`
   - Secret: 복사한 Vercel 토큰 붙여넣기
6. "Add secret" 클릭

#### 3단계: Vercel 프로젝트 설정

1. 터미널에서 Vercel CLI 설치:
   ```bash
   npm install -g vercel
   ```

2. Vercel 로그인:
   ```bash
   vercel login
   ```

3. 프로젝트 연결:
   ```bash
   vercel link
   ```
   - 프로젝트 선택 또는 새로 생성
   - 설정 확인

4. Vercel 자동 배포 끄기:
   - Vercel 대시보드 → 프로젝트 선택
   - Settings → Git
   - GitHub 연동 비활성화 또는 자동 배포 끄기

### 6.2 GitHub Actions 워크플로우 파일 만들기

#### 폴더 구조 생성

```bash
mkdir -p .github/workflows
```

#### 워크플로우 파일 작성

`.github/workflows/ci-cd.yml` 파일을 만들고 다음 내용을 입력합니다:

```yaml
# 워크플로우 이름
name: Test and Deploy

# 언제 이 워크플로우를 실행할지 정의
on:
  push:
    branches: [ main ]      # main 브랜치에 코드를 푸시할 때
  pull_request:
    branches: [ main ]      # main 브랜치로 PR을 만들 때

# 실행할 작업들
jobs:
  # 작업 1: 테스트 실행
  test:
    runs-on: ubuntu-latest  # Ubuntu 최신 버전 컴퓨터에서 실행
    
    steps:
      # 1. 코드 가져오기
      - name: 코드 체크아웃
        uses: actions/checkout@v3

      # 2. Node.js 설치
      - name: Node.js 설정
        uses: actions/setup-node@v3
        with:
          node-version: '20'      # Node.js 20 버전 사용
          cache: 'npm'            # npm 캐시 사용 (속도 향상)

      # 3. 패키지 설치
      - name: 의존성 설치
        run: npm ci              # package-lock.json 기준으로 설치

      # 4. 테스트 실행
      - name: 테스트 실행
        run: npm run test:ci     # CI용 테스트 명령어 실행

  # 작업 2: Vercel 배포
  deploy:
    needs: test                   # test가 성공해야 실행
    runs-on: ubuntu-latest
    # main 브랜치에 직접 푸시했을 때만 배포
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    
    steps:
      # 1. 코드 가져오기
      - name: 코드 체크아웃
        uses: actions/checkout@v3
      
      # 2. Vercel CLI 설치
      - name: Vercel CLI 설치
        run: npm install --global vercel@latest
      
      # 3. Vercel 프로젝트 정보 가져오기
      - name: Vercel 환경 정보 가져오기
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      
      # 4. 프로젝트 빌드
      - name: 프로젝트 빌드
        run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      # 5. Vercel에 배포
      - name: Vercel 배포
        run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### 6.3 환경변수 설정 (필요한 경우)

Supabase 등 환경변수가 필요하면 GitHub Secrets에 추가:

1. GitHub 레포지토리 → Settings → Secrets
2. 다음 시크릿들 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DATABASE_URL` (필요시)

### 6.4 워크플로우 동작 확인

#### 1. 코드 커밋 및 푸시

```bash
git add .
git commit -m "feat: GitHub Actions 워크플로우 추가"
git push origin main
```

#### 2. GitHub Actions 확인

1. GitHub 레포지토리 페이지에서 "Actions" 탭 클릭
2. 실행 중인 워크플로우 확인
3. 각 단계별 로그 확인

#### 3. 성공/실패 확인

- ✅ 초록색 체크: 성공
- ❌ 빨간색 X: 실패 (로그 확인 필요)

### 6.5 트러블슈팅

#### 테스트 실패 시
1. Actions 탭에서 실패한 워크플로우 클릭
2. "test" 작업 클릭
3. 실패한 테스트 로그 확인
4. 로컬에서 `npm test`로 재현
5. 코드 수정 후 다시 푸시

#### 배포 실패 시
1. Vercel 토큰이 올바른지 확인
2. Vercel 프로젝트가 연결되어 있는지 확인
3. 환경변수가 모두 설정되어 있는지 확인

### 6.6 전체 플로우 정리

```
개발자가 코드 작성
    ↓
git push (GitHub에 업로드)
    ↓
GitHub Actions 자동 시작
    ↓
테스트 실행 (Jest)
    ↓
테스트 통과?
    ├─ 예 → Vercel 배포
    └─ 아니오 → 실패 알림
```

---

## 🎉 축하합니다!

이제 다음을 할 수 있게 되었습니다:

1. ✅ Jest로 테스트 작성
2. ✅ React 컴포넌트 테스트
3. ✅ GitHub Actions로 자동 테스트
4. ✅ 테스트 통과 시 Vercel 자동 배포

### 추가 학습 자료

- [Jest 공식 문서](https://jestjs.io/docs/getting-started)
- [React Testing Library 문서](https://testing-library.com/docs/react-testing-library/intro/)
- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [Vercel 문서](https://vercel.com/docs)

### 다음 단계

1. 더 복잡한 테스트 작성 (API 테스트, 통합 테스트)
2. 테스트 커버리지 높이기
3. E2E 테스트 추가 (Cypress, Playwright)
4. 성능 테스트 추가

**질문이 있으신가요?** 언제든 문의해주세요!