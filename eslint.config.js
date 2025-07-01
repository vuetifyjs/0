import storybook from 'eslint-plugin-storybook'

import vuetify from 'eslint-config-vuetify'

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
  files: ['**/*.vue'],
  rules: {
    'vue/block-order': ['warn', { order: ['script', 'template', 'style'] }],
  },
},
...storybook.configs['flat/recommended'],
)
