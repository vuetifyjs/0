# Snackbar Component Design

Headless compound component for rendering toast/snackbar notifications in @vuetify/v0.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Layer | Pure presentation | v0 is headless — no built-in queue or state management |
| Stacking | Multi-stack | Consumer controls visible items; component renders all |
| Anatomy | Portal + Root + Content + Action + Close | Portal owns container concerns, Root is one snackbar |
| ARIA | Severity-driven roles on Root | Each Root sets its own `role` — no `aria-live` on Portal to avoid nesting conflicts |
| Teleport | To body by default, configurable | Single prop (`teleport`) — cleaner than Scrim's two-prop pattern |
| Z-index | useStack integration | Coordinates with Dialog/Scrim overlays |

## Anatomy

```vue
<Snackbar.Portal>
  <Snackbar.Root v-for="ticket in items" :key="ticket.id" :severity="ticket.severity">
    <Snackbar.Content>{{ ticket.subject }}</Snackbar.Content>
    <Snackbar.Action @click="undo(ticket)">Undo</Snackbar.Action>
    <Snackbar.Close @click="ticket.dismiss()" />
  </Snackbar.Root>
</Snackbar.Portal>
```

## Components

### Snackbar.Portal

Container that teleports to body and manages z-index via useStack.

**Element:** `<Atom>` (renders `<div>`)

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `teleport` | `string \| false` | `'body'` | Teleport target. `false` renders inline. |

**Behavior:**
- Wraps content in `<Teleport :to="teleport">` when teleport is not `false`
- Registers with `useStack` for z-index management — ticket is selected while Portal is mounted, unselected on unmount
- Provides snackbar context to children (stack ticket z-index)
- No `aria-live` on this element — each Root handles its own live region semantics via `role`

**Rendered attributes:**
```html
<div style="z-index: {stackZIndex}">
  <!-- slot -->
</div>
```

### Snackbar.Root

A single snackbar instance. Sets ARIA role based on severity.

**Element:** `<Atom>` (renders `<div>`)

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `severity` | `'info' \| 'warning' \| 'error' \| 'success'` | `'info'` | Drives ARIA role selection |

**Behavior:**
- Sets `role="status"` for `info`/`success` severity (implicit `aria-live="polite"`)
- Sets `role="alert"` for `error`/`warning` severity (implicit `aria-live="assertive"`)
- Exposes `severity` via slot props

**Rendered attributes:**
```html
<div role="status">  <!-- or role="alert" for error/warning -->
  <!-- slot -->
</div>
```

**Slot props:**
```ts
{ severity: NotificationSeverity }
```

### Snackbar.Content

Semantic wrapper for the notification message text.

**Element:** `<Atom>` (renders `<div>`)

**Props:** None (inherits AtomProps)

### Snackbar.Action

Optional action button (undo, retry, view, etc.).

**Element:** `<Atom>` (renders `<button>`)

**Props:** None (inherits AtomProps)

**Behavior:** No built-in click handler. Consumer wires `@click`.

### Snackbar.Close

Dismiss button.

**Element:** `<Atom>` (renders `<button>`)

**Props:** None (inherits AtomProps)

**Behavior:**
- Sets `aria-label="Close"` (overridable)
- No built-in click handler — unlike Dialog.Close which auto-calls `context.close()`, Snackbar.Close cannot auto-dismiss because the dismiss target (ticket) varies per Root instance. Consumer must wire the handler.

## Accessibility

| Concern | Implementation |
|---------|---------------|
| Live region | Each Root sets `role="status"` or `role="alert"` — implicit `aria-live` on the element itself. No `aria-live` on Portal to avoid nesting conflicts. |
| Role escalation | `role="alert"` (assertive) for error/warning interrupts screen reader. `role="status"` (polite) for info/success waits. |
| Close button | `aria-label="Close"` default on Snackbar.Close |
| Focus | No focus trap — snackbars are non-modal |
| Keyboard | No keyboard interaction required — snackbars are informational |

## What the Component Does NOT Do

- **No queue management** — consumer brings createQueue, useNotifications, or manual state
- **No timeout/auto-dismiss** — consumer handles via queue timeout or setTimeout
- **No positioning** — consumer styles with utility classes (e.g., `fixed bottom-4 right-4`)
- **No animation** — consumer adds Vue `<Transition>` / `<TransitionGroup>`
- **No severity styling** — consumer maps severity to CSS classes
- **No v-model / open state** — visibility is controlled by the item list the consumer passes

## File Structure

```
packages/0/src/components/Snackbar/
├── SnackbarPortal.vue
├── SnackbarRoot.vue
├── SnackbarContent.vue
├── SnackbarAction.vue
├── SnackbarClose.vue
├── index.ts
└── index.test.ts
```

The barrel `index.ts` follows the Dialog pattern: individual named exports for each component + type exports for props/slot interfaces + compound `Snackbar` object with JSDoc on each member.

## Integration Examples

### With createQueue (simple toasts)

```vue
<script setup lang="ts">
  import { Snackbar, createQueue, useProxyRegistry } from '@vuetify/v0'

  const queue = createQueue({ timeout: 3000 })
  const proxy = useProxyRegistry(queue)
</script>

<template>
  <Snackbar.Portal>
    <Snackbar.Root v-for="ticket in proxy.values" :key="ticket.id">
      <Snackbar.Content>{{ ticket.value }}</Snackbar.Content>
      <Snackbar.Close @click="ticket.dismiss()" />
    </Snackbar.Root>
  </Snackbar.Portal>
</template>
```

### With useNotifications (full lifecycle)

```vue
<script setup lang="ts">
  import { computed } from 'vue'
  import { Snackbar, useNotifications } from '@vuetify/v0'

  const notifications = useNotifications()
  const toasts = computed(() =>
    notifications.proxy.values.filter(t => t.data?.type === 'toast')
  )
</script>

<template>
  <Snackbar.Portal>
    <Snackbar.Root
      v-for="ticket in toasts"
      :key="ticket.id"
      :severity="ticket.severity"
    >
      <Snackbar.Content>{{ ticket.subject }}</Snackbar.Content>
      <Snackbar.Action v-if="ticket.data?.undo" @click="ticket.data.undo()">
        Undo
      </Snackbar.Action>
      <Snackbar.Close @click="ticket.dismiss()" />
    </Snackbar.Root>
  </Snackbar.Portal>
</template>
```

## Dependencies

| Dependency | Purpose |
|------------|---------|
| `Atom` | Polymorphic element base |
| `useStack` | Z-index coordination with Dialog/Scrim |
| `createContext` | Portal → children context provision |
