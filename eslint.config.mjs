import vuetify from 'eslint-config-vuetify'

import storybook from 'eslint-plugin-storybook'

export default vuetify(
  {
    vue: {
      a11y: true,
    },
  },
  storybook.configs['flat/recommended'],
)
