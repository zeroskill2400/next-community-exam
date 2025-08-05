// Jest 설정 파일 - Next.js 프로젝트를 위한 Jest 구성
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Next.js 앱 경로 제공 - next.config.js와 .env 파일을 테스트 환경에서 로드
  dir: './',
})

// Jest에 전달할 커스텀 설정
const customJestConfig = {
  // 테스트 실행 전 설정 파일
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // 테스트 환경을 jsdom으로 설정 (브라우저 환경 시뮬레이션)
  testEnvironment: 'jest-environment-jsdom',
  // 모듈 경로 매핑 - @/ 를 src/ 로 매핑
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // 테스트에서 제외할 경로
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
}

// Next.js가 비동기 설정을 로드할 수 있도록 이 방식으로 export
export default createJestConfig(customJestConfig)