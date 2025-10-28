---
meta:
  title: useForm
  description: A composable for building reactive forms with validation, field registration, and submission handling. Built on top of the registry system for managing form fields.
  keywords: useForm, form, validation, composable, Vue, registry
features:
  category: Composable
  label: 'E: useForm'
  github: /composables/useForm/
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

## API


| Composable | Description |
|---|---|
| [useRegistry](/composables/registration/use-registry) | Base registry system that useForm extends |
| [useProxyModel](/composables/forms/use-proxy-model) | Two-way binding for forms |
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

- `register(registration: Partial<Z>)`: Registers a new form field with validation rules and reactive state
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
