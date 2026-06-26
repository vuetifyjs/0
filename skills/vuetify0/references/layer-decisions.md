# Layer Decisions

When to use composables, components, or both.

## The stack

```
Vuetify 4 (design system consumer)
    ↑
Design Systems (Emerald, Helix, …)
    ↑
Paper (styling primitives)
    ↑
v0 — components (WAI-ARIA wrappers)
v0 — composables (state, logic, registries)
```

v0 ships **two layers**: composables (headless logic) and components (headless UI). Knowing which to reach for is the primary architectural decision.

---

## Decision table

| Goal | Use |
|------|-----|
| Drop in a standard UI pattern with full accessibility | Component — `<Dialog.Root>`, `<Tabs.Root>`, etc. |
| Add selection / step / form logic to a custom component | Composable — `createSingle`, `createSelection`, etc. |
| Build a new reusable compound component on top of v0 | Both — composable for state inside a Root component |
| Build a design system (Emerald, Helix, …) | Both — components as reference, composables as foundation |

---

## Components — the "just works" path

Reach for components when the built-in compound structure fits your UI.

Every v0 component ships:
- Correct `role`, `aria-*`, and `aria-disabled` semantics
- Keyboard navigation and roving tabindex where appropriate
- Focus management and `useRovingFocus` wiring
- `data-state`, `data-disabled`, `data-orientation` for consumer styling
- `<Atom :as :renderless>` so consumers can swap the tag or go renderless

```vue
<!-- Consumer owns all styling; v0 owns all behavior -->
<Tabs.Root v-model="active">
  <Tabs.List class="flex border-b border-gray-200">
    <Tabs.Item value="a" class="px-4 py-2 data-[selected]:border-b-2 data-[selected]:border-blue-600">
      Tab A
    </Tabs.Item>
  </Tabs.List>
  <Tabs.Panel value="a" class="p-4">Panel A</Tabs.Panel>
</Tabs.Root>
```

---

## Composables — the "build it yourself" path

Reach for composables when:
- You're wiring state into a custom component that doesn't match any compound pattern
- You need the logic to live in a parent that isn't a v0 compound root
- You're authoring a new v0-style component (see [authoring-guide.md](authoring-guide.md))

```ts
// Custom tab bar that uses your own markup
const tabs = createSingle({ mandatory: 'force' })

tabs.register({ id: 'overview', value: 'Overview' })
tabs.register({ id: 'details', value: 'Details' })

tabs.select('overview')
tabs.isSelected('overview') // true
```

Composables carry zero DOM opinion. They expose state and methods — your component owns the markup and events.

---

## Using both — compound component authoring

When building a new reusable compound component, you combine both layers:

- **Root** uses a composable to hold state and provides context via `createContext`
- **Sub-components** consume that context and register themselves

This is exactly how every v0 component is built internally. See [authoring-guide.md](authoring-guide.md) for a complete walkthrough.

---

## Common mistakes

**Reaching for a composable when a component is enough**

If `<Dialog.Root>` fits, use it. Rolling your own focus trap and ARIA contract from `createContext` alone saves nothing and loses accessibility correctness.

**Reaching for a component when you need raw logic**

If you need selection state shared across siblings that don't form a compound hierarchy, `createSingle` is the right tool — not wrapping everything in a synthetic `<Tabs.Root>`.

**Skipping v0 entirely**

Before writing a `ref<string | null>(null)` + toggle pattern, check the [decision table in the main skill](../SKILL.md). v0 almost certainly has the composable you need.
