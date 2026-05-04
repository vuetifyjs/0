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
    '@typescript-eslint/no-explicit-any': 'warn',
    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-unreadable-array-destructuring': 'off',
    'func-style': ['error', 'declaration'],
    'one-var': ['error', 'never'],
    'no-restricted-syntax': ['error',
      {
        selector: 'CallExpression[callee.name="withDefaults"]',
        message: 'Use destructuring with defaults instead of withDefaults.',
      },
    ],
    'perfectionist/sort-exports': 'off',
    'perfectionist/sort-imports': ['error', {
      type: 'natural',
      order: 'asc',
      ignoreCase: true,
      newlinesBetween: 1,
      groups: [
        'builtin',
        'external',
        { newlinesBetween: 1 },
        { group: 'framework', commentAbove: 'Framework' },
        { newlinesBetween: 1 },
        { group: 'components', commentAbove: 'Components' },
        { newlinesBetween: 1 },
        { group: 'context', commentAbove: 'Context' },
        { newlinesBetween: 1 },
        { group: 'composables', commentAbove: 'Composables' },
        { newlinesBetween: 1 },
        { group: 'adapters', commentAbove: 'Adapters' },
        { newlinesBetween: 1 },
        { group: 'transformers', commentAbove: 'Transformers' },
        { newlinesBetween: 1 },
        'internal',
        'sibling',
        'index',
        { newlinesBetween: 1 },
        { group: 'stores', commentAbove: 'Stores' },
        { newlinesBetween: 1 },
        { group: 'utilities', commentAbove: 'Utilities' },
        { newlinesBetween: 1 },
        { group: 'type', commentAbove: 'Types' },
      ],
      customGroups: [
        { groupName: 'framework', modifiers: ['value'], elementNamePattern: '^@vuetify/v0' },
        { groupName: 'adapters', modifiers: ['value'], elementNamePattern: '/adapters' },
        { groupName: 'components', modifiers: ['value'], elementNamePattern: '/components/' },
        { groupName: 'context', modifiers: ['value'], elementNamePattern: String.raw`^\./.*\.vue$` },
        { groupName: 'transformers', modifiers: ['value'], elementNamePattern: '/to[A-Z]' },
        { groupName: 'composables', modifiers: ['value'], elementNamePattern: ['/composables/', '/use[A-Z]'] },
        { groupName: 'stores', modifiers: ['value'], elementNamePattern: ['/stores/', '/stores$', '^@vuetify/auth$'] },
        { groupName: 'utilities', modifiers: ['value'], elementNamePattern: ['/utilities', '/utils', '/helpers', '^vue$', '^vue-router$', '^pinia$', '^@vue/'] },
      ],
    }],
  },
},
{
  files: ['**/*.test.ts'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'vitest/prefer-lowercase-title': 'error',
    'vitest/prefer-hooks-in-order': 'error',
    'vitest/prefer-hooks-on-top': 'error',
    'vitest/max-nested-describe': ['error', { max: 3 }],
    'vitest/consistent-test-it': ['error', { fn: 'it' }],
  },
},
{
  files: ['**/scripts/**/*.ts', '**/build/**/*.ts'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
  },
},
{
  files: ['**/*.vue'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/block-order': ['error', { order: ['script', 'template', 'style'] }],
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
