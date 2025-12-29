---
title: useForm - Reactive Form Validation for Vue 3
meta:
- name: description
  content: Build reactive forms with validation, field registration, and submission handling. Supports async rules, pristine tracking, and multiple validation modes.
- name: keywords
  content: useForm, form, validation, composable, Vue 3, registry, field registration, async validation
features:
  category: Composable
  label: 'E: useForm'
  github: /composables/useForm/
related:
  - /composables/registration/use-registry
---

# useForm

A composable for building reactive forms with validation, field registration, and submission handling. Built on top of the registry system for managing form fields.

<DocsPageFeatures :frontmatter />

## Usage

The `useForm` composable provides a powerful interface for managing form state, validation, and submission. It extends the registry pattern to handle form-specific requirements like validation rules, error states, and field lifecycle management.

```ts
import { useForm } from '@vuetify/v0'

const form = useForm()

const email = form.register({
  id: 'email',
  value: '',
  rules: [
    (value) => value.includes('@') || 'Must be a valid email',
    (value) => value.length > 0 || 'Required'
  ]
})

console.log(email.value) // ''
console.log(email.errors.value) // []
```


<DocsApi />
