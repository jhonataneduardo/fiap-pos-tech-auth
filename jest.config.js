module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    testMatch: [
        '**/__tests__/**/*.+(ts|tsx|js)',
        '**/?(*.)+(spec|test).+(ts|tsx|js)'
    ],
    transform: {
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    transformIgnorePatterns: [
        'node_modules/(?!(uuid)/)',
    ],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/server.ts',
        '!src/app.ts',
        '!src/config/**',
        '!src/**/index.ts',
        '!src/types/**',
        '!src/core/infrastructure/di/**',
        '!src/core/infrastructure/swagger/**',
        '!src/**/*.routes.ts',
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    coverageReporters: ['text', 'lcov', 'html'],
};
