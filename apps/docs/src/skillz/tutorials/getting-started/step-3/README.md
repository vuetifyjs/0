# Disabled steps and skipping

`createStep` can handle **disabled items** automatically. When you call `next()` or `prev()`, disabled steps are skipped.

## Adding disabled steps

Pass `disabled: true` in the ticket input to mark a step as disabled:

```ts
stepper.onboard([
  { id: 'a', value: 0 },
  { id: 'b', value: 1, disabled: true },
  { id: 'c', value: 2 },
])
```

When navigating from step A, calling `next()` will skip step B and land on step C.

## What changed

In this step, we added a **Payment** step that is disabled. Try navigating through the steps — notice how Payment is automatically skipped!

## What's next

This is just the beginning. `@vuetify/v0` provides many more composables:

- **createSelection** — multi-select state management
- **createGroup** — tri-state selection with mixed states
- **useTheme** — reactive theme switching
- **createForm** — async form validation

Explore the [documentation](/) to learn more!
