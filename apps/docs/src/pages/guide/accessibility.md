---
title: Accessibility Guide - WCAG and ARIA Best Practices
meta:
  - name: description
    content: Build accessible Vue 3 applications with Vuetify0. Learn ARIA patterns, keyboard navigation, focus management, and WCAG compliance for headless UI components.
  - name: keywords
    content: vuetify0, accessibility, a11y, ARIA, WCAG, keyboard navigation, focus management, screen reader, Vue 3
related:
  - /composables/plugins/use-locale
  - /guide/components
---

# Accessibility

v0 provides ARIA attributes out-of-the-box through the `attrs` pattern. You provide styling and visual feedback.

<DocsPageFeatures :frontmatter />

## The `attrs` Pattern

Every v0 component exposes an `attrs` object containing all accessibility attributes. Spread it onto your elements:

```vue playground
<script setup>
import { Selection } from '@vuetify/v0'
</script>

<template>
  <Selection.Root v-slot="{ attrs }">
    <div v-bind="attrs.root">
      <Selection.Item v-for="item in items" :key="item" v-slot="{ attrs }">
        <button v-bind="attrs">{{ item }}</button>
      </Selection.Item>
    </div>
  </Selection.Root>
</template>
```

### What's Included in `attrs`

| Component | ARIA Attributes Provided |
| - | - |
| Selection.Item | `aria-selected`, `aria-disabled`, `data-selected`, `data-disabled` |
| Group.Item | `role="checkbox"`, `aria-checked`, `aria-disabled`, `data-selected`, `data-disabled`, `data-mixed` |
| ExpansionPanel.Activator | `id`, `role`, `tabindex`, `aria-expanded`, `aria-controls`, `aria-disabled` |
| Pagination.Root | `aria-label`, `role="navigation"` (when not using `<nav>`) |
| Popover.Anchor | `popovertarget`, `data-popover-open` (uses native popover API) |

## Developer Responsibilities

v0 provides the ARIA plumbing. You must provide:

| Responsibility | Example |
| - | - |
| Visual focus indicators | `:focus-visible { outline: 2px solid blue }` |
| Color contrast | Ensure 4.5:1 ratio minimum |
| Visible labels | Add `<label>` or `aria-label` for inputs |
| Skip links | Navigation landmarks for keyboard users |

### Focus Trapping

v0 does **not** provide focus trapping. Use external solutions:

- [focus-trap](https://github.com/focus-trap/focus-trap)
- Native `inert` attribute for siblings
- [vue-final-modal](https://vue-final-modal.org/)

### Roving Tabindex

v0 does **not** provide roving tabindex. This keeps the library headless - implement in your design system layer if needed for arrow key navigation between items.

## Keyboard Navigation

### What v0 Handles

- `tabindex` management (-1 when disabled, 0 when enabled)
- ARIA state synchronization (`aria-expanded`, `aria-selected`)
- Data attributes for styling (`data-selected`, `data-disabled`)

### What You Implement

| Pattern | Keys to Handle |
| - | - |
| List selection | Arrow keys, Home/End |
| Menus | Arrow keys, Escape, Enter |
| Dialogs | Escape to close, focus trap |
| Tabs | Arrow keys, Home/End |

```ts
function onKeydown(e: KeyboardEvent) {
  switch (e.key) {
    case 'ArrowDown': selection.select(next()); break
    case 'ArrowUp': selection.select(prev()); break
    case 'Home': selection.first(); break
    case 'End': selection.last(); break
  }
}
```

## Testing Strategies

### Automated Testing

```ts
import { axe } from 'vitest-axe'

it('passes accessibility audit', async () => {
  const { container } = render(MyComponent)
  expect(await axe(container)).toHaveNoViolations()
})
```

### Manual Testing Checklist

- [ ] Tab through all interactive elements
- [ ] Verify focus visibility
- [ ] Test with keyboard only (no mouse)
- [ ] Check color contrast with DevTools
- [ ] Validate with browser accessibility tree

### Recommended Tools

| Tool | Purpose |
| - | - |
| axe DevTools | Browser extension for WCAG scanning |
| Lighthouse | Built-in Chrome audit |
| NVDA/VoiceOver | Screen reader verification |

## Internationalization

v0's `useLocale` handles RTL and translated labels. See [useLocale](/composables/plugins/use-locale) for accessibility label translations.

