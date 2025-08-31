import vuetify from 'eslint-config-vuetify'
import storybook from 'eslint-plugin-storybook'

export default vuetify({
  vue: true,
  perfectionist: {
    import: false,
  },
  autoimports: false,
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
    'func-style': ['error', 'declaration'],
  },
},
{
  files: ['**/*.vue'],
  rules: {
    'vue/block-order': ['warn', { order: ['script', 'template', 'style'] }],
  },
},
...storybook.configs['flat/recommended'],
)
