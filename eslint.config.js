import storybook from 'eslint-plugin-storybook'

import vuetify from 'eslint-config-vuetify'

export default vuetify({
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
...storybook.configs['flat/recommended'],
)
