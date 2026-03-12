---
title: useRules - Validation Rule Aliases for Vue 3
meta:
- name: description
  content: Composable for managing validation rule aliases with locale-aware error messages. Supports built-in rules, custom aliases, Standard Schema adapters, and integration with createForm.
- name: keywords
  content: useRules, validation, rules, aliases, form, composable, Vue 3, i18n, locale, standard schema, zod, valibot, arktype
features:
  category: Plugin
  label: 'E: useRules'
  github: /composables/useRules/
  level: 2
related:
  - /composables/forms/create-form
  - /composables/plugins/use-locale
  - /composables/registration/create-tokens
---

# useRules

The `useRules` composable provides a set of named validation rule aliases — such as `required`, `email`, and `minLength` — that resolve to `FormValidationRule` functions. Error messages are stored in a token registry, making them overridable per-instance without touching your locale configuration. When a locale plugin is installed, messages are looked up through it automatically.

<DocsPageFeatures :frontmatter />

## Installation

Install the Rules plugin to make a shared rules context available across your entire app:

```ts main.ts
import { createApp } from 'vue'
import { createRulesPlugin } from '@vuetify/v0'
import App from './App.vue'

const app = createApp(App)

app.use(
  createRulesPlugin({
    messages: {
      required: 'This field cannot be empty',
    },
    aliases: {
      phone: (err?) => v => /^\d{10}$/.test(String(v)) || (err ?? 'Invalid phone number'),
    },
  })
)

app.mount('#app')
```

## Usage

### Standalone

`createRules` works without a plugin. When called outside component scope it returns a fallback instance using default English messages:

```ts
import { createRules } from '@vuetify/v0'

const rules = createRules()

// Use aliases directly to build rule functions
const required = rules.aliases.required()
const minLen = rules.aliases.minLength(8)

required('')        // 'Field is required'
required('hello')   // true
minLen('hi')        // 'Must be at least 8 characters'
minLen('password')  // true
```

### Resolving Aliases

Pass alias strings or tuples to `resolve()` for use with `createForm`:

```ts
import { createRules, createForm } from '@vuetify/v0'

const rules = createRules()
const form = createForm({ rules })

const password = form.register({
  id: 'password',
  value: '',
  rules: ['required', ['minLength', 8]],
})
```

### In a Component

When the plugin is installed, use `useRules` to access the shared context:

```vue
<script setup lang="ts">
  import { useRules } from '@vuetify/v0'

  const rules = useRules()
  const resolved = rules.resolve(['required', ['minLength', 8]])
</script>
```

### Overriding Messages

Pass `messages` to override specific default strings per-instance. Keys correspond to alias names:

```ts
import { createRules } from '@vuetify/v0'

const rules = createRules({
  messages: {
    required: 'Cannot be blank',
    email: 'Enter a valid email address',
  },
})
```

### Custom Aliases

Add custom rule aliases alongside the built-ins:

```ts
import { createRules } from '@vuetify/v0'

const rules = createRules({
  aliases: {
    phone: (err?) => v => /^\d{10}$/.test(String(v)) || (err ?? 'Invalid phone'),
    zip: (err?) => v => /^\d{5}$/.test(String(v)) || (err ?? 'Invalid zip code'),
  },
})

const phoneRule = rules.aliases.phone()
phoneRule('1234567890') // true
phoneRule('abc')        // 'Invalid phone'
```

## Built-in Aliases

| Alias | Signature | Description |
| - | - | - |
| `required` | `(err?)` | Value must be truthy or `0` |
| `email` | `(err?)` | Must match `*@*.*` pattern |
| `number` | `(err?)` | Must be parseable as a number |
| `integer` | `(err?)` | Must contain only digits |
| `capital` | `(err?)` | Must contain only uppercase letters |
| `maxLength` | `(len, err?)` | Length must be ≤ `len` |
| `minLength` | `(len, err?)` | Length must be ≥ `len` |
| `strictLength` | `(len, err?)` | Length must equal `len` |
| `exclude` | `(chars[], err?)` | Must not contain any of the given characters |
| `notEmpty` | `(err?)` | Must have a `length` property greater than `0` |
| `pattern` | `(re, err?)` | Must match the given regular expression |

> [!TIP]
> Migrating from Vuetify 3? Aliases prefixed with `$` (e.g. `$required`, `$email`) are automatically stripped, so existing rule arrays work without changes.

## Adapters

`useRules` supports [Standard Schema](https://standardschema.dev/) — a universal interface implemented by Zod (v3.24+), Valibot, ArkType, and other validation libraries. No per-library adapter imports are needed.

### Auto-detection in resolve()

`resolve()` auto-detects Standard Schema objects and converts them to `FormValidationRule` functions. Pass schemas directly alongside alias strings and tuples:

```ts
import { z } from 'zod'
import { createRules } from '@vuetify/v0'

const rules = createRules()

rules.resolve([
  'required',
  z.string().email('Must be a valid email'),
  ['minLength', 3],
])
```

### With createForm

The most common use case — schemas and aliases together in form field rules:

```ts
import { z } from 'zod'
import { createRules, createForm } from '@vuetify/v0'

const rules = createRules()
const form = createForm({ rules })

const email = form.register({
  id: 'email',
  value: '',
  rules: ['required', z.string().email()],
})
```

### Standalone Conversion

Use `toRule()` to convert a schema to a `FormValidationRule` outside of `resolve()`:

```ts
import { toRule } from '@vuetify/v0'
import { z } from 'zod'

const emailRule = toRule(z.string().email('Must be valid'))

await emailRule('test@example.com') // true
await emailRule('bad')              // 'Must be valid'
```

> [!TIP]
> `toRule()` returns an async rule — it handles both sync and async schema validation automatically.

### Compatible Libraries

Any library that implements the [Standard Schema v1 spec](https://standardschema.dev/) works out of the box:

| Library | Version | Import |
| - | - | - |
| [Zod](https://zod.dev/) | v3.24+ | `import { z } from 'zod'` |
| [Valibot](https://valibot.dev/) | v1.0+ | `import * as v from 'valibot'` |
| [ArkType](https://arktype.io/) | v2.0+ | `import { type } from 'arktype'` |

## Locale Integration

When `createLocalePlugin` is installed, `useRules` automatically routes error message lookups through it using the key pattern `rules.<alias>`. Add rule translations to your locale messages and they will be used instead of the token registry defaults:

```ts main.ts
import { createApp } from 'vue'
import { createLocalePlugin, createRulesPlugin } from '@vuetify/v0'
import App from './App.vue'

const app = createApp(App)

app.use(
  createLocalePlugin({
    default: 'en',
    messages: {
      en: {
        rules: {
          required: 'This field is required',
          email: 'Enter a valid email address',
          minLength: 'Must be at least {0} characters',
        },
      },
      es: {
        rules: {
          required: 'Este campo es obligatorio',
          email: 'Introduce un correo válido',
          minLength: 'Debe tener al menos {0} caracteres',
        },
      },
    },
  })
)

app.use(createRulesPlugin())

app.mount('#app')
```

The message resolution priority is:
1. Explicit `err` string passed to the alias builder — `rules.aliases.required('Cannot be blank')`
2. Locale translation via `useLocale` — `rules.required` key in the active locale
3. Token registry override — `messages` option passed to `createRulesPlugin` or `createRules`
4. Built-in English default

## Examples

::: example
/composables/use-rules/context.ts 1
/composables/use-rules/FormField.vue 2
/composables/use-rules/dashboard.vue 3

### API Key Manager

This example wires `createRules` into `createForm` to build a 4-field key provisioning form. It exercises 7 built-in aliases (`required`, `email`, `number`, `capital`, `minLength`, `maxLength`, `strictLength`) plus a custom `slug` alias that enforces lowercase kebab-case identifiers.

The controls let you trigger validation, prefill valid or invalid data, and reset the form. The state panel reflects each field's `isValid`, `isPristine`, and error count in real time — showing the tri-state validation lifecycle (`null` → `true`/`false`) and how `form.reset()` returns everything to its initial state.

| File | Role |
|------|------|
| `context.ts` | Creates rules instance with custom `slug` alias, registers all form fields |
| `FormField.vue` | Reusable field component — binds ticket value, errors, and border state |
| `dashboard.vue` | Entry point — renders fields, action buttons, and live state panel |

**Key patterns:**

- `createRules({ aliases })` registers the custom `slug` validator alongside built-ins
- `createForm({ rules })` links the rules context so `resolve()` runs during `register()`
- `validateOn: 'change'` triggers validation on every keystroke
- `form.submit()` validates all fields at once
- `form.reset()` clears errors and restores initial values
- Each ticket exposes `isValid`, `isPristine`, `errors` as reactive refs

:::

## Architecture

`useRules` uses `createTokens` for message storage, integrates with `useLocale` for i18n, and auto-detects Standard Schema objects during resolution:

```mermaid "Rules Architecture"
flowchart TD
  createTokens --> useRules
  useLocale --> useRules
  useRules --> resolve[resolve aliases]
  useRules --> createForm
  StandardSchema[Standard Schema] --> resolve
```

## Reactivity

`useRules` has no reactive state. Aliases are plain functions — call them to produce a `FormValidationRule`.

| Property | Reactive | Notes |
| - | :-: | - |
| `aliases` | <AppErrorIcon /> | Static map of builder functions |
| `resolve()` | <AppErrorIcon /> | Pure function, returns array of rule functions |

<DocsApi />
