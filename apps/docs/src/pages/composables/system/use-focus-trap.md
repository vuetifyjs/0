---
title: useFocusTrap - Focus Containment for Vue 3
meta:
- name: description
  content: Vue 3 composable that confines Tab and Shift+Tab to a root element, focuses into it on activate, and restores the previously focused element on deactivate.
- name: keywords
  content: useFocusTrap, focus trap, focus containment, modal, dialog, drawer, accessibility, Vue 3, composable
features:
  category: Composable
  label: 'E: useFocusTrap'
  github: /composables/useFocusTrap/
  level: 2
related:
  - /components/disclosure/dialog
  - /composables/system/use-click-outside
  - /composables/plugins/use-stack
---

# useFocusTrap

A composable that confines keyboard focus to a root element for as long as the trap is active.

<DocsPageFeatures :frontmatter />

## Usage

A native `<dialog>` opened with `showModal()` is trapped by the browser, so it needs nothing here. Everything else does: a `Dialog.Content` rendered `as="div"`, a drawer, a command palette. `useFocusTrap` wraps Tab and Shift+Tab at the first and last tabbable descendant, focuses into the root on activate, and hands focus back to the trigger on deactivate.

```vue collapse no-filename useFocusTrap
<script setup lang="ts">
  import { useFocusTrap } from '@vuetify/v0'
  import { shallowRef, useTemplateRef } from 'vue'

  const isOpen = shallowRef(false)
  const panel = useTemplateRef<HTMLElement>('panel')

  useFocusTrap(panel, { active: isOpen })
</script>

<template>
  <button @click="isOpen = true">Open</button>

  <div v-if="isOpen" ref="panel" tabindex="-1" role="dialog" aria-modal="true">
    <input>
    <button @click="isOpen = false">Close</button>
  </div>
</template>
```

## Architecture

`useFocusTrap` composes `useEventListener` and `useToggleScope`, binding a single document-level listener only while the trap is engaged:

```mermaid "Focus Trap Composition"
flowchart TD
  useEventListener --> useFocusTrap
  useToggleScope --> useFocusTrap
  useFocusTrap --> Dialogs
  useFocusTrap --> Drawers
  useFocusTrap --> Palettes
```

The keydown listener is bound to `document` in the capture phase, not to the root. A root-bound listener stops firing the moment focus leaves the subtree — a backdrop click that blurs to `<body>`, or a stray programmatic `focus()` — and the trap is then dead with no way back. Binding at the document means an escaped focus is recovered on the next Tab, and containment survives an inner `stopPropagation()`.

Only the boundaries are intercepted. A Tab press in the middle of the list passes through untouched, so a nested widget keeps full control of its own Tab handling everywhere except the first and last stop.

## Options

| Option | Type | Default | Description |
| - | - | - | - |
| `active` | `MaybeRefOrGetter<boolean>` | `undefined` | Reactive activation source. Omit it to drive the trap imperatively |
| `initial` | `false \| MaybeElementRef` | `undefined` | Where focus lands on activate. `false` skips autofocus; an element focuses that node instead of the first tabbable one |
| `restore` | `boolean` | `true` | Return focus to the previously focused element on deactivate |
| `onEscape` | `(event: KeyboardEvent) => void` | `undefined` | Called on Escape while the trap owns focus. Opt-in — the trap never closes anything itself |

```ts
import { useFocusTrap } from '@vuetify/v0'

const cancel = useTemplateRef<HTMLElement>('cancel')

// Destructive dialogs should land on the safe action
useFocusTrap(panel, { active: isOpen, initial: cancel })
```

## Reactivity

| Property/Method | Reactive | Notes |
| - | :-: | - |
| `isActive` | <AppSuccessIcon /> | ShallowRef, readonly. The trap's state — `active` is only its source |
| `activate()` | - | Captures the restore target and engages containment |
| `deactivate()` | - | Releases containment and restores focus |
| `onKeydown()` | - | The handler, for consumers that already own a listener |

## Examples

::: gn-example
/composables/use-focus-trap/basic

### Panel with Trapped Focus

A panel holding two text inputs and two buttons. Opening it moves focus to the first input; Tab from the Confirm button wraps back to that input rather than continuing into the page, and Shift+Tab from the first input wraps to Confirm. Escape and Cancel both close the panel, and focus returns to the trigger that opened it.

The root carries `tabindex="-1"` because that is the consumer's responsibility, not the composable's — v0 never writes attributes onto elements it did not render. It matters in one case: when the root holds no tabbable descendants at all, the trap falls back to focusing the root itself, and without a `tabindex` that call is a silent no-op. Containment still holds either way, since the Tab is swallowed before the fallback is attempted.

Reach for this whenever an overlay is not a native `<dialog>`. Pair it with `useStack` for z-index and dismissal ordering, and with `useClickOutside` for pointer dismissal — the trap deliberately owns focus order and nothing else.

:::

## Recipes

### Escape Only for the Top Overlay

`onEscape` fires on every engaged trap, so nested overlays need a stacking guard. `useStack` already tracks which overlay is topmost:

```ts
import { useFocusTrap, useStack } from '@vuetify/v0'

const stack = useStack()
const ticket = stack.register({ onDismiss: () => (isOpen.value = false) })

useFocusTrap(panel, {
  active: isOpen,
  onEscape: event => {
    if (!ticket.globalTop.value) return
    event.preventDefault()
    isOpen.value = false
  },
})
```

### Releasing Tab to an Inner Widget

A code editor or grid inside the trap needs Tab for itself. Because only the boundaries are intercepted, this works without configuration — Tab presses between the first and last stop are never touched. Only a widget that sits *at* a boundary needs to handle its own Tab and call `preventDefault()`, which the trap honours.

## Accessibility

A focus trap is one half of a modal contract. The trap manages focus order; you still supply the rest:

| Responsibility | Where it lives |
| - | - |
| `role="dialog"` and `aria-modal="true"` | Your markup, or `Dialog.Content` |
| An accessible name | `aria-label`, or `Dialog.Title` with `aria-labelledby` |
| Escape to dismiss | `onEscape`, or the stack ticket's `onDismiss` |
| Pointer dismissal | `useClickOutside` |
| Inerting the rest of the page | Native `<dialog>`, or the `inert` attribute |
| `tabindex="-1"` on the root | Your markup |

`aria-disabled="true"` controls are treated as tabbable, per [APG](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/): an aria-disabled control stays in the tab order, and skipping it would let the browser walk past the computed boundary and out of the trap. This is a deliberate divergence from roving-focus composables like [useRovingFocus](/composables/system/use-roving-focus), which must skip disabled items.

## FAQ

::: faq

??? Do I need this for a `Dialog` component?

Not with the default `as="dialog"`. `Dialog.Content` calls `showModal()`, and the browser supplies the top layer, focus trapping, page inerting, and Escape. You need `useFocusTrap` when you render `as="div"` — that call is optional-chained away, so a `div` host gets none of it.

??? Why does focus not land anywhere when the panel opens?

The root has no tabbable descendants and no `tabindex`. The trap falls back to focusing the root, but an element without a `tabindex` cannot take focus, so the call is a silent no-op. Add `tabindex="-1"` to the root. Containment is unaffected either way — Tab is swallowed before the fallback runs.

??? I called `deactivate()` but the trap will not reopen.

`active` is a *source*, `isActive` is the state. The source's transitions drive the trap; an imperative call writes the state directly and never writes back. So `deactivate()` while `active` still reads `true` stays deactivated until `active` next goes false then true. Drive it from one side or the other, not both.

??? Focus escapes past a control inside a custom element.

Containment pierces open shadow roots, but discovery cannot — `querySelectorAll` does not cross the boundary, so a tab stop inside a descendant's shadow root is invisible to the trap. If it is the *last* stop, Tab leaves. The same applies to `<iframe>` content, which no JavaScript trap can contain.

??? Can two traps be active at once?

Nested ones, yes: an inner root sits inside the outer, and the inner trap's listener binds later so its wrap wins at a shared boundary. Two *disjoint* active traps are not supported — each reads the other's focus as outside and they fight over every Tab. Deactivate one first.

:::

<DocsApi />
