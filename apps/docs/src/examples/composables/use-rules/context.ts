import { createRulesContext } from '@vuetify/v0'

export const [, provideRules] = createRulesContext({
  aliases: {
    required: v => (v === 0 || !!v) || 'Required',
    email: v => !v || /^.+@\S+\.\S+$/.test(String(v)) || 'Invalid email',
    slug: v => !v || /^[a-z][a-z0-9-]*$/.test(String(v)) || 'Lowercase letters, numbers, and hyphens only',
    prefix: v => !v || /^[A-Z]{4}$/.test(String(v)) || 'Must be exactly 4 uppercase letters',
  },
})
