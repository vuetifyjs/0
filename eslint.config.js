import vuetify from 'eslint-config-vuetify'

export default vuetify({
  vue: true,
  perfectionist: {
    import: false,
  },
  autoimports: false,
  test: {
    runner: 'vitest',
  },
},
{
  rules: {
    'import/first': 'off',
    'curly': 'off',
    '@stylistic/operator-linebreak': 'off',
  },
},
{
  files: ['**/*.ts', '**/*.vue'],
  rules: {
    // TODO: re-enable once existing violations are resolved
    // '@typescript-eslint/no-explicit-any': 'warn',
    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-unreadable-array-destructuring': 'off',
    'func-style': ['error', 'declaration'],
    'perfectionist/sort-exports': 'off',
    'perfectionist/sort-imports': ['error', {
      type: 'natural',
      order: 'asc',
      ignoreCase: true,
      newlinesBetween: 'always',
      groups: [
        'builtin',
        'external',
        { newlinesBetween: 'always', commentAbove: 'Framework' },
        'framework',
        { newlinesBetween: 'always', commentAbove: 'Components' },
        'components',
        { newlinesBetween: 'ignore' },
        'context',
        { newlinesBetween: 'always', commentAbove: 'Composables' },
        'composables',
        { newlinesBetween: 'always', commentAbove: 'Adapters' },
        'adapters',
        { newlinesBetween: 'always', commentAbove: 'Utilities' },
        'utilities',
        { newlinesBetween: 'always', commentAbove: 'Transformers' },
        'transformers',
        { newlinesBetween: 'always', commentAbove: 'Types' },
        'type',
        { newlinesBetween: 'always' },
        'internal',
        'sibling',
        'index',
      ],
      customGroups: {
        value: {
          framework: '^@vuetify/v0',
          adapters: '/adapters',
          components: ['/components/'],
          context: [String.raw`^\./.*\.vue$`],
          transformers: ['/to[A-Z]'],
          composables: ['/composables/', '/use[A-Z]'],
          utilities: ['/utilities', '/utils', '/helpers', '^vue$', '^vue-router$', '^pinia$', '^@vue/'],
        },
      },
    }],
  },
},
{
  files: ['**/*.test.ts', '**/*.bench.ts'],
  rules: {
    'vitest/prefer-lowercase-title': 'error',
    'vitest/prefer-hooks-in-order': 'error',
    'vitest/prefer-hooks-on-top': 'error',
    'vitest/max-nested-describe': ['error', { max: 3 }],
    'vitest/consistent-test-it': ['error', { fn: 'it' }],
  },
},
{
  files: ['**/*.vue'],
  rules: {
    'vue/block-order': ['warn', { order: ['script', 'template', 'style'] }],
    'vue/v-bind-style': ['error', 'shorthand', { sameNameShorthand: 'always' }],
  },
},
{
  files: ['apps/docs/src/examples/**/*.vue', 'apps/docs/src/examples/**/*.ts'],
  rules: {
    'perfectionist/sort-imports': 'off',
  },
},
{
  name: 'pnpm/pnpm-workspace-yaml',
  files: ['pnpm-workspace.yaml'],
  rules: {
    'pnpm/yaml-no-unused-catalog-item': 'error',
    'pnpm/yaml-no-duplicate-catalog-item': 'error',
  },
},
{
  ignores: ['**/node_modules/**', '**/dist/**'],
  files: ['package.json', '**/package.json'],
  rules: {
    'pnpm/json-enforce-catalog': 'error',
  },
},
{
  name: 'vuetify/no-v0-imports',
  files: ['packages/paper/**/*.{ts,js,vue}', 'app/**/*.{ts,js,vue}'],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [{
        group: [String.raw`\#v0/**`],
        message: 'Use @vuetify/v0 import',
      }],
    }],
  },
},
)
