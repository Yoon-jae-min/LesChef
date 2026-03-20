const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Next.js 앱의 경로를 제공하여 next.config.js와 .env 파일을 로드
  dir: "./",
});

// Jest에 추가할 커스텀 설정
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testMatch: ["**/__tests__/**/*.test.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  collectCoverageFrom: ["src/utils/**/*.{ts,tsx}", "!src/utils/**/*.d.ts", "!src/**/__tests__/**"],
};

// createJestConfig는 이렇게 내보내집니다
module.exports = createJestConfig(customJestConfig);
