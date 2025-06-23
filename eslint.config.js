import vuetify from 'eslint-config-vuetify'

export default vuetify({
  perfectionist: {
    import: false,
  },
},
{
  rules: {
    'import/first': 'off',
    'curly': 'off',
    '@stylistic/operator-linebreak': 'off',
  },
})
