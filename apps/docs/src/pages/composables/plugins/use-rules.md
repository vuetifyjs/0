---
title: useRules - Validation Rules for Vue 3
meta:
- name: description
  content: Headless validation composable with Standard Schema support, custom aliases, locale-aware messages, and createValidation integration.
- name: keywords
  content: useRules, validation, rules, form, composable, Vue 3, standard schema, zod, valibot, arktype
features:
  category: Plugin
  label: 'E: useRules'
  github: /composables/useRules/
  level: 2
related:
  - /composables/forms/create-validation
  - /composables/forms/create-form
---

# useRules

Headless validation composable that resolves rules from multiple sources — [Standard Schema](https://standardschema.dev/) objects, custom aliases, and raw functions — into `FormValidationRule[]` for use with `createValidation`. No built-in validators are included; bring your own via a schema library or register custom aliases at the plugin level.

<DocsPageFeatures :frontmatter />

## Installation

Register the plugin with your app-wide aliases. Aliases are **predicates** — simple functions that return `true` on success or `false` on failure. When a predicate returns `false`, the error message is resolved via locale lookup using the key `rules.<name>`:

```ts main.ts
import { createApp } from 'vue'
import { createRulesPlugin } from '@vuetify/v0'
import App from './App.vue'

const app = createApp(App)

app.use(
  createRulesPlugin({
    aliases: {
      required: v => (v === 0 || !!v) || false,
      email: v => !v || /^.+@\S+\.\S+$/.test(String(v)) || false,
      slug: v => !v || /^[a-z][a-z0-9-]*$/.test(String(v)) || false,
    },
    messages: {
      required: 'Required',
      email: 'Invalid email',
      slug: 'Lowercase letters, numbers, and hyphens only',
    },
  })
)

app.mount('#app')
```

> [!TIP]
> When `useLocale` is installed, messages are resolved through the locale system using the key `$rules.<name>`. Without locale, the `messages` option provides fallback strings via the token registry.

## Usage

### In a Component

Access the shared rules context and use it with `createValidation`:

```vue
<script setup lang="ts">
  import { useRules, createValidation } from '@vuetify/v0'

  const rules = useRules()
  const validation = createValidation({ rules })

  const name = validation.register({
    id: 'name',
    value: '',
    rules: ['required', 'slug'],
  })
</script>
```

### Standalone

`createRules` works without a plugin for use outside component scope:

```ts
import { createRules } from '@vuetify/v0'

const rules = createRules({
  aliases: {
    required: v => !!v || false,
  },
  messages: {
    required: 'Required',
  },
})

rules.resolve(['required'])
```

### Custom Aliases

An alias is a **predicate** — a `FormValidationRule` that returns `true` when valid, `false` when invalid, or a string for a custom error message. When the predicate returns `false`, the error message is looked up from the token registry or locale using the key `rules.<name>`:

```ts
app.use(
  createRulesPlugin({
    aliases: {
      // Returns false on failure → message from locale/tokens
      required: v => !!v || false,

      // Domain-specific predicate
      slug: v => !v || /^[a-z][a-z0-9-]*$/.test(String(v)) || false,

      // Return a string for inline error messages (bypasses locale)
      positive: v => Number(v) > 0 || 'Must be positive',
    },
    messages: {
      required: 'This field is required',
      slug: 'Only lowercase letters, numbers, and hyphens',
    },
  })
)
```

## Adapters

`useRules` supports [Standard Schema](https://standardschema.dev/) — a universal interface for validation libraries. Pass schema objects directly in `rules` arrays alongside alias strings and inline functions — `resolve()` auto-detects and wraps them.

### Zod

```vue
<script setup lang="ts">
  import { z } from 'zod'
  import { useRules, createValidation } from '@vuetify/v0'

  const rules = useRules()
  const validation = createValidation({ rules })

  const email = validation.register({
    id: 'email',
    value: '',
    rules: ['required', z.string().email('Invalid email')],
  })

  const age = validation.register({
    id: 'age',
    value: '',
    rules: [z.coerce.number().int().min(18, 'Must be 18+').max(120)],
  })
</script>
```

### Valibot

```vue
<script setup lang="ts">
  import * as v from 'valibot'
  import { useRules, createValidation } from '@vuetify/v0'

  const rules = useRules()
  const validation = createValidation({ rules })

  const username = validation.register({
    id: 'username',
    value: '',
    rules: ['required', v.pipe(v.string(), v.minLength(3), v.maxLength(20))],
  })
</script>
```

### ArkType

```vue
<script setup lang="ts">
  import { type } from 'arktype'
  import { useRules, createValidation } from '@vuetify/v0'

  const rules = useRules()
  const validation = createValidation({ rules })

  const score = validation.register({
    id: 'score',
    value: '',
    rules: [type('1 <= number <= 100')],
  })
</script>
```

> [!TIP]
> Schema objects produce async rules. `createValidation` handles this transparently — no special handling needed in components.

### Compatible Libraries

Any library that implements the [Standard Schema v1 spec](https://standardschema.dev/) works out of the box:

| Library | Version | Import |
| - | - | - |
| [Zod](https://zod.dev/) | v3.24+ | `import { z } from 'zod'` |
| [Valibot](https://valibot.dev/) | v1.0+ | `import * as v from 'valibot'` |
| [ArkType](https://arktype.io/) | v2.0+ | `import { type } from 'arktype'` |

## Examples

::: example
/composables/use-rules/context.ts 1
/composables/use-rules/FormField.vue 2
/composables/use-rules/dashboard.vue 3

### API Key Manager

This example registers 4 custom aliases (`required`, `email`, `slug`, `prefix`) as predicates and wires them into `createValidation`. Error messages are provided via the `messages` option. A rate limit field uses an inline function rule to show that aliases and functions can coexist.

The controls let you trigger validation, prefill valid or invalid data, and reset the form. The state panel reflects each field's `isValid`, `isPristine`, and error count in real time — showing the tri-state validation lifecycle (`null` → `true`/`false`) and how reset returns everything to its initial state.

| File | Role |
|------|------|
| `context.ts` | Defines predicate aliases with messages, creates validation, registers fields |
| `FormField.vue` | Reusable field component — binds ticket value, errors, and border state |
| `dashboard.vue` | Entry point — renders fields, action buttons, and live state panel |

**Key patterns:**

- `createRules({ aliases, messages })` registers predicate validators with error messages
- Aliases return `false` on failure — error messages resolve via `rules.<name>` token key
- `createValidation({ rules })` links the rules context so `resolve()` runs during `register()`
- Each ticket exposes `isValid`, `isPristine`, `errors` as reactive refs
- Components decide when to call `validate()` — validation triggers are a UI concern

:::

## Architecture

`useRules` resolves aliases, functions, and Standard Schema objects into `FormValidationRule[]` for use with `createValidation`:

```mermaid "Rules Architecture"
flowchart TD
  aliases[Predicate Aliases] --> resolve
  functions[Inline Functions] --> resolve
  StandardSchema[Standard Schema] --> resolve
  useRules --> resolve[resolve rules]
  resolve --> createValidation
```

## Reactivity

`useRules` has no reactive state. Aliases are plain predicate functions — `resolve()` wraps them with locale-aware error message lookup.

| Property | Reactive | Notes |
| - | :-: | - |
| `aliases` | <AppErrorIcon /> | Static map of predicate functions |
| `resolve()` | <AppErrorIcon /> | Pure function, returns array of rule functions |

<DocsApi />
