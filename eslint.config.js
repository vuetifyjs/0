import vuetify from 'eslint-config-vuetify'

// Shared selectors. `ts` applies to packages/0/src non-test TypeScript.
// `vue` applies to packages/0/src Vue SFCs. `both` applies to each.
// Line-level eslint-disable comments are the allowlist for the few legal sites
// (guard implementations, IN_BROWSER, the listener primitives, createContext).
const nullGuardMessage = 'Use #v0/utilities guards (isNull, isUndefined, isNullOrUndefined) instead of a raw null or undefined comparison (PHILOSOPHY §2.3).'

const syntaxSelectors = [
  { appliesTo: 'both', selector: 'BinaryExpression[operator="==="][right.raw=/^null$/]', message: nullGuardMessage },
  { appliesTo: 'both', selector: 'BinaryExpression[operator="!=="][right.raw=/^null$/]', message: nullGuardMessage },
  { appliesTo: 'both', selector: 'BinaryExpression[operator="=="][right.raw=/^null$/]', message: nullGuardMessage },
  { appliesTo: 'both', selector: 'BinaryExpression[operator="!="][right.raw=/^null$/]', message: nullGuardMessage },
  { appliesTo: 'both', selector: 'BinaryExpression[operator="==="][left.raw=/^null$/]', message: nullGuardMessage },
  { appliesTo: 'both', selector: 'BinaryExpression[operator="!=="][left.raw=/^null$/]', message: nullGuardMessage },
  { appliesTo: 'both', selector: 'BinaryExpression[operator="=="][left.raw=/^null$/]', message: nullGuardMessage },
  { appliesTo: 'both', selector: 'BinaryExpression[operator="!="][left.raw=/^null$/]', message: nullGuardMessage },
  { appliesTo: 'both', selector: 'BinaryExpression[operator="==="][left.name=/^undefined$/]', message: nullGuardMessage },
  { appliesTo: 'both', selector: 'BinaryExpression[operator="==="][right.name=/^undefined$/]', message: nullGuardMessage },
  { appliesTo: 'both', selector: 'BinaryExpression[operator="!=="][left.name=/^undefined$/]', message: nullGuardMessage },
  { appliesTo: 'both', selector: 'BinaryExpression[operator="!=="][right.name=/^undefined$/]', message: nullGuardMessage },
  {
    appliesTo: 'both',
    selector: 'UnaryExpression[operator="typeof"][argument.name=/^(?:window|document)$/]',
    message: 'Use IN_BROWSER and SUPPORTS_* from #v0/constants/globals instead of typeof window/document (PHILOSOPHY §2.10).',
  },
  {
    appliesTo: 'both',
    selector: 'UnaryExpression[operator="typeof"][argument.object.name=/^(?:window|document)$/]',
    message: 'Use IN_BROWSER and SUPPORTS_* from #v0/constants/globals instead of typeof window/document (PHILOSOPHY §2.10).',
  },
  {
    appliesTo: 'both',
    selector: 'CallExpression[callee.object.name="Math"][callee.property.name="random"]',
    message: 'Do not use Math.random() for ids. Use useId() from #v0/utilities (PHILOSOPHY §2.8).',
  },
  {
    appliesTo: 'both',
    selector: 'CallExpression[callee.name=/^(?:inject|provide)$/]',
    message: 'Do not call Vue inject/provide directly. Use createContext (PHILOSOPHY §6.5).',
  },
  {
    appliesTo: 'ts',
    selector: 'CallExpression[callee.property.name="addEventListener"]',
    message: 'Composables do not bind DOM events. The listener primitives are useEventListener, useHotkey, useClickOutside, and useMediaQuery (PHILOSOPHY §2.5).',
  },
  {
    appliesTo: 'ts',
    selector: 'CallExpression[callee.property.name="querySelector"]',
    message: 'Composables must not querySelector. Pass an element in, or look it up from a component (PHILOSOPHY §2.5).',
  },
  {
    appliesTo: 'ts',
    selector: 'CallExpression[callee.property.name="querySelectorAll"]',
    message: 'Composables must not querySelector. Pass an element in, or look it up from a component (PHILOSOPHY §2.5).',
  },
  {
    appliesTo: 'ts',
    selector: String.raw`ExportAllDeclaration[source.value=/\.vue$/]`,
    message: 'Never export * from a .vue file. It breaks Volar slot inference (PHILOSOPHY §8.8).',
  },
]

function syntaxRules (appliesTo) {
  return syntaxSelectors
    .filter(entry => entry.appliesTo === appliesTo || entry.appliesTo === 'both')
    .map(({ selector, message }) => ({ selector, message }))
}

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
    // eslint-config-vuetify 4.7.2 — flood / unsafe-autofix / AST false positives.
    // Keep the small correctness set (css-escape, empty lookahead, dupe
    // disjunctions, unused capturing groups) and fix those in source.
    'unicorn/no-this-outside-of-class': 'off',
    'unicorn/no-unused-array-method-return': 'off',
    'unicorn/numeric-separators-style': 'off',
    'unicorn/prefer-split-limit': 'off',
    'unicorn/prefer-includes-over-repeated-comparisons': 'off',
    'unicorn/prefer-https': 'off',
    'unicorn/prefer-string-repeat': 'off',
    'unicorn/consistent-compound-words': 'off',
    'unicorn/better-dom-traversing': 'off',
    'regexp/use-ignore-case': 'off',
    'regexp/prefer-w': 'off',
    'regexp/strict': 'off',
    'regexp/no-super-linear-backtracking': 'off',
    'regexp/optimal-quantifier-concatenation': 'off',
    'regexp/prefer-d': 'off',
    'regexp/prefer-character-class': 'off',
    'regexp/match-any': 'off',
    'prefer-regex-literals': 'off',
  },
},
{
  files: ['**/*.ts', '**/*.vue'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
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
  // @paper/bulma conformance tests: conform() throws on mismatch — it IS the assertion
  files: ['packages/bulma/**/*.browser.test.ts'],
  rules: {
    'vitest/expect-expect': ['error', { assertFunctionNames: ['expect', 'conform'] }],
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
  // The vapor test package intentionally pins Vue 3.6 beta + the Vapor runtime.
  // They can't be cataloged: a second catalog entry for `vue` would duplicate
  // the default catalog's 3.5.x and trip pnpm/yaml-no-duplicate-catalog-item.
  // Allow these specifiers to stay un-cataloged in this one package only.
  files: ['tests/vapor/package.json'],
  rules: {
    'pnpm/json-enforce-catalog': ['error', {
      ignores: ['vue', '@vue/runtime-vapor', '@vitejs/plugin-vue'],
    }],
  },
},
{
  ignores: ['**/export-templates/package.json'],
},
{
  // Enforce V0Error over bare Error for throw sites in the core package.
  // This prevents contributors from accidentally bypassing the typed error
  // registry (V0ErrorDetails) that gives consumers a stable code discriminant.
  name: 'vuetify/no-bare-error-throw',
  files: ['packages/0/src/**/*.ts'],
  ignores: ['packages/0/src/**/*.test.ts', 'packages/0/src/**/*.bench.ts'],
  rules: {
    'no-restricted-syntax': ['error',
      {
        selector: 'ThrowStatement > NewExpression[callee.name="Error"]',
        message: 'Use V0Error with a code from V0ErrorDetails instead of bare Error. See packages/0/src/utilities/errors.ts.',
      },
      ...syntaxRules('ts'),
    ],
  },
},
{
  name: 'vuetify/locale-ti-requires-fallback',
  files: ['packages/0/src/**/*.vue'],
  rules: {
    'no-restricted-syntax': ['error',
      {
        selector: 'CallExpression[callee.name="withDefaults"]',
        message: 'Use destructuring with defaults instead of withDefaults.',
      },
      {
        selector: 'CallExpression[callee.property.name="ti"]:not(LogicalExpression[operator="??"] > CallExpression[callee.property.name="ti"])',
        message: 'locale.ti() must be guarded with a `?? \'<inline English default>\'` so unconfigured apps get an accessible name. See packages/0/src/locale/messages/en for canonical strings.',
      },
      {
        selector: 'CallExpression[callee.name="onUnmounted"]',
        message: 'Use onBeforeUnmount for cleanup. onUnmounted runs after the context is gone (PHILOSOPHY §7.3).',
      },
      {
        selector: 'TSAsExpression > TSAnyKeyword',
        message: 'Do not use `as any`. defineSlots `=> any` and Atom\'s Record<string, any> generic are the only allowed any (PHILOSOPHY §2.2).',
      },
      {
        selector: 'TSTypeAnnotation:not(TSFunctionType > TSTypeAnnotation) > TSAnyKeyword',
        message: 'Do not annotate a value as any. Slot return `=> any` is the allowed form (PHILOSOPHY §2.2).',
      },
      ...syntaxRules('vue'),
    ],
  },
},
{
  // Adapter DOM lookup, the createCombobox option-node getter, and useFocusTrap
  // scanning descendants of a root the caller already passed in.
  // TODO(ops#74): remove createCombobox/index.ts once that getter moves to the component.
  name: 'vuetify/query-selector-allowlist',
  files: [
    'packages/0/src/composables/**/adapters/**/*.ts',
    'packages/0/src/composables/createCombobox/index.ts',
    'packages/0/src/composables/useFocusTrap/**/*.ts',
  ],
  ignores: ['packages/0/src/**/*.test.ts', 'packages/0/src/**/*.bench.ts'],
  rules: {
    'no-restricted-syntax': ['error',
      {
        selector: 'ThrowStatement > NewExpression[callee.name="Error"]',
        message: 'Use V0Error with a code from V0ErrorDetails instead of bare Error. See packages/0/src/utilities/errors.ts.',
      },
      ...syntaxRules('ts').filter(entry => !entry.selector.includes('querySelector')),
    ],
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
{
  // PHILOSOPHY §9.2. Ignored files are the console implementation, not callers:
  // createFallbackLogger, V0LoggerAdapter, the Layer-0 context warning, and useId's SSR warning.
  name: 'vuetify/no-console',
  files: ['packages/0/src/**/*.{ts,vue}'],
  ignores: [
    'packages/0/src/**/*.test.ts',
    'packages/0/src/**/*.browser.test.ts',
    'packages/0/src/**/*.bench.ts',
    'packages/0/src/composables/useLogger/index.ts',
    'packages/0/src/composables/useLogger/adapters/v0.ts',
    'packages/0/src/composables/createContext/index.ts',
    'packages/0/src/utilities/helpers.ts',
  ],
  rules: {
    'no-console': 'error',
  },
},
{
  name: 'vuetify/no-cross-feature-relative',
  files: ['packages/0/src/**/*.{ts,vue}'],
  ignores: [
    'packages/0/src/**/adapters/**',
    'packages/0/src/components/fixtures/**',
    'packages/0/src/**/*.bench.ts',
  ],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [{
        group: ['..', '../*', '../**'],
        message: 'Cross-feature relative imports are banned. Use #v0/. Sibling ./ imports stay legal. Adapters may import their parent with ../ (PHILOSOPHY §2.4).',
      }],
    }],
  },
},
{
  name: 'vuetify/adapter-relative-depth',
  files: ['packages/0/src/**/adapters/**/*.{ts,vue}'],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [{
        group: ['../..', '../../*', '../../**'],
        message: 'Adapter files may import their parent feature (../) only. Use #v0/ past that (PHILOSOPHY §2.4).',
      }],
    }],
  },
},
{
  name: 'vuetify/fixture-relative-depth',
  files: ['packages/0/src/components/fixtures/**/*.{ts,vue}'],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [{
        group: ['../../..', '../../../*', '../../../**'],
        message: 'Fixture imports may reach a component barrel (../ or ../../) but not higher. Use #v0/ past that (PHILOSOPHY §2.4).',
      }],
    }],
  },
},
{
  name: 'vuetify/bench-public-imports',
  files: ['packages/0/src/**/*.bench.ts'],
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [
        {
          group: ['#v0', '#v0/*', '#v0/**'],
          message: 'Benchmarks import the public @vuetify/v0 surface so the history harness measures installed versions, not source (benchmarks.md).',
        },
        {
          group: ['./index', './index.ts', './index.js'],
          message: 'Do not import ./index from a bench file. Use @vuetify/v0. Fixture imports (./fixtures) stay relative.',
        },
      ],
    }],
  },
},
{
  name: 'vuetify/sort-barrels',
  files: [
    'packages/0/src/components/index.ts',
    'packages/0/src/composables/index.ts',
  ],
  rules: {
    'perfectionist/sort-exports': ['error', {
      type: 'natural',
      order: 'asc',
      ignoreCase: true,
    }],
  },
},
{
  // Keeps the withDefaults ban from the shared TS/Vue block. A later
  // no-restricted-syntax override replaces the whole selector list.
  name: 'vuetify/test-assertions',
  files: ['**/*.test.ts'],
  rules: {
    'no-restricted-syntax': ['error',
      {
        selector: 'CallExpression[callee.name="withDefaults"]',
        message: 'Use destructuring with defaults instead of withDefaults.',
      },
      {
        selector: 'CallExpression[callee.property.name="toHaveBeenCalledOnce"]',
        message: 'Use toHaveBeenCalledTimes(1) (testing.md).',
      },
    ],
  },
},
{
  name: 'vuetify/no-marked-outside-pipeline',
  files: ['apps/docs/**/*.{ts,vue}'],
  ignores: [
    'apps/docs/src/composables/useMarkdown.ts',
    'apps/docs/src/utilities/markdown.ts',
  ],
  rules: {
    'no-restricted-syntax': ['error',
      {
        selector: 'CallExpression[callee.name="withDefaults"]',
        message: 'Use destructuring with defaults instead of withDefaults.',
      },
      {
        selector: 'NewExpression[callee.name="Marked"]',
        message: 'Instantiate Marked only inside useMarkdown (docs.md). Extend that pipeline instead of constructing another one.',
      },
    ],
  },
},
)
