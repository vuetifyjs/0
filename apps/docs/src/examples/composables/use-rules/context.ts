import { createRules, createValidation } from '@vuetify/v0'

export const rules = createRules({
  aliases: {
    required: v => (v === 0 || !!v) || 'Required',
    email: v => !v || /^.+@\S+\.\S+$/.test(String(v)) || 'Invalid email',
    slug: v => !v || /^[a-z][a-z0-9-]*$/.test(String(v)) || 'Lowercase letters, numbers, and hyphens only',
    prefix: v => !v || /^[A-Z]{4}$/.test(String(v)) || 'Must be exactly 4 uppercase letters',
  },
})

export const validation = createValidation({ rules, standalone: true })

export const fields = [
  {
    label: 'Key Name',
    placeholder: 'e.g. production-api',
    ticket: validation.register({
      id: 'name',
      value: '',
      rules: ['required', 'slug'],
    }),
  },
  {
    label: 'Owner Email',
    placeholder: 'e.g. ops@company.com',
    ticket: validation.register({
      id: 'email',
      value: '',
      rules: ['required', 'email'],
    }),
  },
  {
    label: 'Rate Limit (req/s)',
    placeholder: '1–10000',
    ticket: validation.register({
      id: 'rate',
      value: '',
      rules: [
        'required',
        (v: unknown) => !v || !Number.isNaN(Number(v)) || 'Must be a number',
      ],
    }),
  },
  {
    label: 'Prefix',
    placeholder: 'e.g. PROD',
    ticket: validation.register({
      id: 'prefix',
      value: '',
      rules: ['required', 'prefix'],
    }),
  },
]
