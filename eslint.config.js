import vuetify from 'eslint-config-vuetify'
import storybook from 'eslint-plugin-storybook'

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
  files: ['**/*.ts'],
  rules: {
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
        { newlinesBetween: 'always', commentAbove: 'Foundational' },
        'foundation',
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
          components: ['/components/', String.raw`\.vue$`],
          foundation: ['/create(Context|Plugin|Trinity)'],
          transformers: ['/to[A-Z]'],
          composables: ['/composables/', '/use[A-Z]'],
          utilities: ['/utilities', '/utils', '/helpers', '^vue$', '^vue-router$', '^pinia$', '^@vue/'],
        },
      },
    }],
  },
},
{
  files: ['**/*.test.ts'],
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
...storybook.configs['flat/recommended'],
)
