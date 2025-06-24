import storybook from 'eslint-plugin-storybook'

import vuetify from 'eslint-config-vuetify'

export default vuetify({
  perfectionist: {
    import: false,
  },
  vue: {
    a11y: true,
  },
},
{
  rules: {
    'import/first': 'off',
  },
},
...storybook.configs['flat/recommended'],
)
