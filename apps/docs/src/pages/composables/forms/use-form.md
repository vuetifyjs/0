---
meta:
  title: useForm
  description: A composable for building reactive forms with validation, field registration, and submission handling. Built on top of the registry system for managing form fields.
  keywords: useForm, form, validation, composable, Vue, registry
category: Forms
performance: 0
---

<script setup>
  import Mermaid from '@/components/Mermaid.vue'
</script>

# useForm

A composable for building reactive forms with validation, field registration, and submission handling. Built on top of the registry system for managing form fields.

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

## API

### `useForm`

- **Type**

  ```ts
  interface FormTicket extends RegistryTicket {
    validate: (silent?: boolean) => Promise<boolean>
    reset: () => void
    validateOn: 'submit' | 'change' | string
    disabled: boolean
    errors: ShallowRef<string[]>
    rules: FormValidationRule[]
    isPristine: ShallowRef<boolean>
    isValid: ShallowRef<boolean | null>
    isValidating: ShallowRef<boolean>
  }

  interface FormContext<Z extends FormTicket = FormTicket> extends RegistryContext<Z> {
    submit: (id?: ID | ID[]) => Promise<boolean>
    reset: () => void
    validateOn: 'submit' | 'change' | string
    isValid: ShallowRef<boolean | null>
    isValidating: ShallowRef<boolean>
  }

  interface FormOptions extends RegistryOptions {
    validateOn?: 'submit' | 'change' | string
  }

  function useForm<
    Z extends FormTicket = FormTicket,
    E extends FormContext<Z> = FormContext<Z>,
  > (options?: FormOptions): E
  ```

- **Details**

- `register(registrant: Partial<Z>)`: Registers a new form field with validation rules and reactive state
- `validate(id?: ID | ID[])`: Validates specific fields
- `submit()`: Validates all inputs
- `reset()`: Resets all form fields to their initial values
- `validateOn`: Global validation trigger setting ('submit', 'change', or combination)
- `isValid`: Overall form validity state (true/false/null for unknown)
- `isValidating`: Whether any field is currently validating

- **Options**

  - `validateOn`: When to trigger validation. Defaults to `'submit'`. Can be `'change'`, `'submit'`, or space-separated combination.

### Form Field Properties

Each registered field returns a `FormTicket` with:

- `value`: Reactive field value with getter/setter
- `errors`: Array of current validation error messages
- `isValid`: Field validity state (true/false/null)
- `isPristine`: Whether field value has changed from initial
- `isValidating`: Whether field is currently validating
- `validate(silent?)`: Manually validate field
- `reset()`: Reset field to initial value
- `rules`: Array of validation functions
- `disabled`: Whether field is disabled

## Basic Example

```vue
<script setup>
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

const password = form.register({
  id: 'password',
  value: '',
  rules: [(value) => value.length >= 8 || 'Password must be at least 8 characters']
})

async function onSubmit () {
  const isValid = await form.submit()

  if (isValid) {
    console.log('Form is valid!')
  }
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <input
      v-model="email.value"
      type="email"
      :class="{ error: email.errors.value.length > 0 }"
    />

    <div v-for="error in email.errors.value" :key="error">
      {{ error }}
    </div>

    <input
      v-model="password.value"
      type="password"
      :class="{ error: password.errors.value.length > 0 }"
    />

    <div v-for="error in password.errors.value" :key="error">
      {{ error }}
    </div>

    <button type="submit" :disabled="form.isValidating.value">
      {{ form.isValidating.value ? 'Validating...' : 'Submit' }}
    </button>
  </form>
</template>
```

## Validation Triggers

```typescript
// Validate only on submit (default)
const form = useForm({ validateOn: 'submit' })

// Validate on field changes
const form = useForm({ validateOn: 'change' })

// Multiple triggers
const form = useForm({ validateOn: 'submit change' })

// Field-level override
const field = form.register({
  id: 'username',
  validateOn: 'change', // Override form-level setting
  rules: [(value) => value.length > 0 || 'Required']
})
```

## Advanced Usage

### Async Validation

```typescript
const field = form.register({
  id: 'username',
  rules: [
    async (value) => {
      const exists = await checkUsernameExists(value)
      return exists ? 'Username already taken' : true
    }
  ]
})
```

### Conditional Validation

```typescript
const confirmPassword = form.register({
  id: 'confirmPassword',
  rules: [
    (value) => value === password.value || 'Passwords must match'
  ]
})
```

### Partial Submission

```typescript
// Submit specific fields only
await form.validate(['email', 'password'])

// Submit single field
await form.validate('email')
```

Here is a mermaid diagram showing the relationship between `useForm` and `useRegistry`:

<Mermaid code="
flowchart TD
  A(useForm) --> B(useRegistry)
  B --> C(FormTicket)
  C --> D[validate]
  C --> E[reset]
  C --> F[errors]
  C --> G[isValid]
  A --> H[submit]
  A --> I[reset all]
" />

## Features

- **Registry-based**: Built on [`useRegistry`](/composables/registration/use-registry) for field management
- **Flexible validation**: Support for sync/async validation rules
- **Configurable triggers**: Validate on submit, change, or custom events
- **Field-level control**: Override validation settings per field
- **Type safety**: Full TypeScript support with proper generics
- **Reactive state**: All form and field state is reactive
- **Partial operations**: Submit or validate
