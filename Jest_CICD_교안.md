# Jest 테스트 및 GitHub Actions CI/CD 구축 교안

## 목차
1. [Jest 기초 - 간단한 테스트 이해하기](#1-jest-기초---간단한-테스트-이해하기)
2. [React 컴포넌트 테스트](#2-react-컴포넌트-테스트)
3. [GitHub Actions + Vercel CI/CD 파이프라인](#3-github-actions--vercel-cicd-파이프라인)

---

## 1. Jest 기초 - 간단한 테스트 이해하기

### 1.1 테스트란 무엇인가?
테스트는 작성한 코드가 의도한 대로 동작하는지 자동으로 검증하는 코드입니다.

### 1.2 가장 기초적인 테스트 예제

```typescript
// src/app/__tests__/simple.test.ts

// 1. 숫자 계산 테스트
test("1 더하기 1은 2다", () => {
  expect(1 + 1).toBe(2);
});

// 2. 문자열 테스트
test("Hello와 World를 합치면 Hello World가 된다", () => {
  const greeting = "Hello" + " " + "World";
  expect(greeting).toBe("Hello World");
});

// 3. 참/거짓 테스트
test("빈 문자열은 거짓이다", () => {
  expect("").toBeFalsy();      // 거짓인지 확인
  expect("안녕").toBeTruthy();  // 참인지 확인
});

// 4. 배열 테스트
test("배열에 특정 값이 포함되어 있다", () => {
  const fruits = ["사과", "바나나", "딸기"];
  expect(fruits).toContain("바나나");  // 배열에 '바나나'가 있는지
  expect(fruits.length).toBe(3);        // 배열 길이가 3인지
});
```

### 1.3 핵심 개념 설명

#### test() 함수
```javascript
test("테스트 설명", () => {
  // 테스트할 코드
});
```
- 개별 테스트를 정의하는 함수
- 첫 번째 인자: 테스트 설명
- 두 번째 인자: 실제 테스트 코드를 담은 함수

#### expect() 함수
```javascript
expect(실제값).toBe(기대값);
```
- 값을 검증하는 함수
- 다양한 매처(matcher)와 함께 사용

#### 주요 매처(Matcher)
- `toBe()`: 정확히 같은지 비교 (===)
- `toEqual()`: 객체나 배열의 내용이 같은지 비교
- `toBeTruthy()`: 참인지 확인
- `toBeFalsy()`: 거짓인지 확인
- `toContain()`: 배열이나 문자열에 특정 값 포함 여부
- `toBeGreaterThan()`: 큰지 비교

### 1.4 describe로 테스트 그룹화

```javascript
describe("계산기 테스트", () => {
  test("더하기가 동작한다", () => {
    expect(2 + 3).toBe(5);
  });
  
  test("빼기가 동작한다", () => {
    expect(10 - 4).toBe(6);
  });
});
```
- 관련된 테스트들을 논리적으로 그룹화
- 테스트 결과를 더 읽기 쉽게 정리

---

## 2. React 컴포넌트 테스트

### 2.1 필요한 패키지 설치

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom @types/jest
```

### 2.2 Jest 설정 파일

#### jest.config.mjs
```javascript
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Next.js 앱 경로 - next.config.js와 .env 파일 로드
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',  // @ 경로 매핑
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
}

export default createJestConfig(customJestConfig)
```

#### jest.setup.js
```javascript
import '@testing-library/jest-dom'
```

### 2.3 React 컴포넌트 테스트 작성

```typescript
// src/app/__tests__/page.test.tsx

import { render, screen } from "@testing-library/react";
import Home from "../page";

// 모킹(Mocking) - 테스트 환경에서 실제 기능을 가짜로 대체
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),      // 가짜 push 함수
      prefetch: jest.fn(),  // 가짜 prefetch 함수
    };
  },
}));

jest.mock("@/lib/userStore", () => ({
  useUserStore: () => ({
    user: null,           // 로그인하지 않은 상태
    isLoading: false,
    setUser: jest.fn(),
    clearUser: jest.fn(),
  }),
}));

describe("홈페이지 테스트", () => {
  // 각 테스트 전에 실행 - 이전 테스트의 영향 제거
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("홈페이지가 정상적으로 렌더링되어야 함", () => {
    // 1. 컴포넌트 렌더링
    render(<Home />);
    
    // 2. 특정 텍스트 찾기
    const heading = screen.getByText("Next.js 커뮤니티");
    
    // 3. 찾은 요소가 문서에 있는지 확인
    expect(heading).toBeInTheDocument();
  });

  it("네비게이션 링크들이 올바른 경로를 가져야 함", () => {
    render(<Home />);
    
    // 링크가 올바른 경로를 가지는지 확인
    expect(screen.getByText("상품 보러가기")).toHaveAttribute("href", "/products");
    expect(screen.getByText("장바구니 확인")).toHaveAttribute("href", "/cart");
  });
});
```

### 2.4 핵심 개념 설명

#### 모킹(Mocking)이란?
- 실제 코드 대신 가짜 객체를 만드는 것
- 테스트 환경에는 브라우저나 서버가 없기 때문에 필요
- `jest.fn()`: 가짜 함수를 만드는 Jest 유틸리티

#### React Testing Library 주요 함수
- `render()`: React 컴포넌트를 가상 DOM에 렌더링
- `screen`: 렌더링된 요소를 찾기 위한 쿼리 모음
- `getByText()`: 텍스트로 요소 찾기
- `getByRole()`: 역할(button, link 등)로 요소 찾기

#### 주요 검증 메서드
- `toBeInTheDocument()`: DOM에 존재하는지
- `toHaveAttribute()`: 특정 속성을 가지는지
- `toHaveClass()`: 특정 CSS 클래스를 가지는지

### 2.5 테스트 실행 스크립트

```json
// package.json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  }
}
```

- `npm test`: 모든 테스트 실행
- `npm run test:watch`: 파일 변경 감지하여 자동 재실행
- `npm run test:ci`: CI 환경용 (커버리지 포함)

---

## 3. GitHub Actions + Vercel CI/CD 파이프라인

### 3.1 CI/CD란?
- **CI (Continuous Integration)**: 코드 변경사항을 자동으로 테스트
- **CD (Continuous Deployment)**: 테스트 통과 시 자동으로 배포

### 3.2 사전 준비

#### 1. Vercel Token 생성
1. [Vercel 대시보드](https://vercel.com/account/tokens) 접속
2. "Create Token" 클릭
3. 토큰 이름 입력 (예: "GitHub Actions")
4. 생성된 토큰 복사

#### 2. GitHub Repository Secret 설정
1. GitHub 레포지토리 → Settings → Secrets and variables → Actions
2. "New repository secret" 클릭
3. Name: `VERCEL_TOKEN`
4. Value: 복사한 토큰 붙여넣기

#### 3. Vercel 자동 배포 비활성화
1. Vercel 대시보드 → 프로젝트 선택
2. Settings → Git
3. "Ignored Build Step" 또는 자동 배포 비활성화

### 3.3 GitHub Actions 워크플로우 파일

```yaml
# .github/workflows/ci-cd.yml

name: Test and Deploy

# 워크플로우 실행 조건
on:
  push:
    branches: [ main ]      # main 브랜치에 push할 때
  pull_request:
    branches: [ main ]      # main 브랜치로 PR 생성할 때

jobs:
  # 테스트 작업
  test:
    runs-on: ubuntu-latest  # Ubuntu 최신 버전에서 실행
    
    steps:
      # 레포지토리 코드를 작업 환경으로 가져오기
      - uses: actions/checkout@v3

      # Node.js 환경 설정
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'      # npm 캐시로 설치 속도 향상

      # package-lock.json 기반으로 정확한 패키지 설치
      - run: npm ci

      # Jest 테스트를 CI 모드로 실행
      - run: npm run test:ci

  # Vercel 배포 작업
  deploy:
    needs: test             # test 작업이 성공해야만 실행
    runs-on: ubuntu-latest
    # main 브랜치에 직접 push했을 때만 배포
    if: github.event_name == 'push' && github.ref == 'refs/heads/main'
    
    steps:
      # 코드 가져오기
      - uses: actions/checkout@v3
      
      # Vercel CLI 전역 설치
      - run: npm install --global vercel@latest
      
      # Vercel 프로젝트 환경 정보 가져오기
      - run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      
      # 프로덕션용 빌드 생성
      - run: vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
      
      # 빌드된 결과물을 Vercel에 배포
      - run: vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

### 3.4 워크플로우 동작 과정

#### Push to main 브랜치
1. 코드가 main 브랜치에 push됨
2. GitHub Actions 자동 실행
3. 테스트 실행 (npm run test:ci)
4. 테스트 통과 시 Vercel 배포
5. 배포 완료

#### Pull Request
1. PR 생성
2. 테스트만 실행
3. 테스트 결과를 PR에 표시
4. 배포는 하지 않음 (merge 후 배포)

### 3.5 주요 개념 설명

#### GitHub Actions 구성 요소
- **on**: 워크플로우 실행 조건
- **jobs**: 실행할 작업들
- **steps**: 각 작업의 세부 단계
- **uses**: 미리 만들어진 액션 사용
- **run**: 쉘 명령어 실행

#### 환경 변수와 시크릿
- `${{ secrets.VERCEL_TOKEN }}`: GitHub에 저장된 비밀 값
- 민감한 정보를 안전하게 관리

### 3.6 트러블슈팅

#### 테스트 실패 시
1. GitHub Actions 탭에서 실패한 워크플로우 확인
2. 로그에서 실패한 테스트 확인
3. 로컬에서 `npm test` 실행하여 재현
4. 수정 후 다시 push

#### 배포 실패 시
1. Vercel 토큰이 올바른지 확인
2. Vercel 프로젝트가 연결되어 있는지 확인
3. 환경변수가 Vercel에 설정되어 있는지 확인

### 3.7 장점

1. **품질 보장**: 모든 코드가 테스트를 통과해야 배포
2. **자동화**: 수동 배포 과정 제거
3. **일관성**: 항상 같은 방식으로 빌드/배포
4. **롤백 용이**: 문제 발생 시 이전 버전으로 쉽게 복구

---

## 요약

### 테스트 작성 흐름
1. 기본 Jest 문법 이해 (expect, toBe)
2. React 컴포넌트 테스트 방법 학습
3. 모킹을 통한 외부 의존성 제거
4. 다양한 테스트 케이스 작성

### CI/CD 구축 흐름
1. GitHub Actions 워크플로우 작성
2. Vercel 토큰 및 환경변수 설정
3. 테스트 → 배포 자동화 파이프라인 구축
4. main 브랜치 보호 및 품질 관리

이제 코드 변경 → 테스트 → 배포가 자동으로 이루어집니다!