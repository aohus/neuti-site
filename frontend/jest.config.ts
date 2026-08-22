import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './'
})

// react-markdown / remark / micromark 계열은 ESM 전용 패키지라 기본 설정으로는
// node_modules 가 트랜스폼되지 않아 `Unexpected token 'export'` 로 실패한다.
const ESM_PACKAGES = [
  'geist',
  'react-markdown',
  'remark-.*',
  'rehype-.*',
  'unified',
  'bail',
  'is-plain-obj',
  'trough',
  'vfile.*',
  'unist-.*',
  'mdast-.*',
  'micromark.*',
  'hast-.*',
  'property-information',
  'space-separated-tokens',
  'comma-separated-tokens',
  'html-url-attributes',
  'html-void-elements',
  'decode-named-character-reference',
  'character-entities.*',
  'trim-lines',
  'zwitch',
  'longest-streak',
  'ccount',
  'escape-string-regexp',
  'markdown-table',
  'devlop',
  'estree-util-is-identifier-name',
  'style-to-js',
  'style-to-object',
  'inline-style-parser',
  'web-namespaces'
]

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}

const createConfig = createJestConfig(config)

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async.
// next/jest 가 자체 transformIgnorePatterns 를 앞에 붙여 node_modules 를 통째로 제외하므로,
// 해석이 끝난 뒤 ESM 허용 목록으로 덮어써야 한다.
export default async (): Promise<Config> => {
  const resolved = await createConfig()

  return {
    ...resolved,
    transformIgnorePatterns: [
      `/node_modules/(?!(${ESM_PACKAGES.join('|')})/)`,
      '^.+\\.module\\.(css|sass|scss)$'
    ]
  }
}
