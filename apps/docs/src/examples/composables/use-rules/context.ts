import { createForm, createRules } from '@vuetify/v0'

export const rules = createRules({
  aliases: {
    slug: (err?) => v => {
      return !v || /^[a-z][a-z0-9-]*$/.test(String(v)) || (err ?? 'Lowercase letters, numbers, and hyphens only')
    },
  },
})

export const form = createForm({ rules })

export const fields = [
  {
    label: 'Key Name',
    placeholder: 'e.g. production-api',
    ticket: form.register({
      id: 'name',
      value: '',
      rules: ['required', ['minLength', 3], ['maxLength', 30], 'slug'],
      validateOn: 'change',
    }),
  },
  {
    label: 'Owner Email',
    placeholder: 'e.g. ops@company.com',
    ticket: form.register({
      id: 'email',
      value: '',
      rules: ['required', 'email'],
      validateOn: 'change',
    }),
  },
  {
    label: 'Rate Limit (req/s)',
    placeholder: '1–10000',
    ticket: form.register({
      id: 'rate',
      value: '',
      rules: ['required', 'number'],
      validateOn: 'change',
    }),
  },
  {
    label: 'Prefix',
    placeholder: 'e.g. PROD',
    ticket: form.register({
      id: 'prefix',
      value: '',
      rules: ['required', 'capital', ['strictLength', 4]],
      validateOn: 'change',
    }),
  },
]
