---
title: Accessibility Guide - WCAG and ARIA Best Practices
features:
  order: 2
  level: 2
meta:
  - name: description
    content: Build accessible Vue 3 applications with Vuetify0. Learn ARIA patterns, keyboard navigation, focus management, and WCAG compliance for headless UI components.
  - name: keywords
    content: vuetify0, accessibility, a11y, ARIA, WCAG, keyboard navigation, focus management, screen reader, Vue 3
related:
  - /composables/plugins/use-locale
  - /composables/plugins/use-rtl
  - /guide/fundamentals/components
---

# Accessibility

v0 provides ARIA attributes out-of-the-box through the `attrs` pattern. You provide styling and visual feedback.

<DocsPageFeatures :frontmatter />

## The attrs Pattern

Every v0 component exposes an `attrs` object containing all accessibility attributes. Spread it onto your elements:

```vue playground
<script setup>
  import { Selection } from '@vuetify/v0'

  const items = ['Apple', 'Banana', 'Cherry']
</script>

<template>
  <Selection.Root v-slot="{ attrs }">
    <div v-bind="attrs">
      <Selection.Item v-for="item in items" :key="item" v-slot="{ attrs }">
        <button v-bind="attrs">{{ item }}</button>
      </Selection.Item>
    </div>
  </Selection.Root>
</template>
```

### What's Included in attrs

| Component | ARIA Attributes Provided |
| - | - |
| Selection.Item | `aria-selected`, `aria-disabled`, `data-selected`, `data-disabled` |
| Group.Item | `role="checkbox"`, `aria-checked`, `aria-disabled`, `data-selected`, `data-disabled`, `data-mixed` |
| ExpansionPanel.Activator | `id`, `role`, `tabindex`, `aria-expanded`, `aria-controls`, `aria-disabled` |
| Pagination.Root | `aria-label`, `role="navigation"`[^pagination-nav] |
| Popover.Activator | `popovertarget`, `data-open`[^popover-native] |

[^pagination-nav]: `role="navigation"` is only added when the root element isn't already a `<nav>`. If you render `Pagination.Root as="nav"`, the role is omitted to avoid redundant landmark roles.

[^popover-native]: `Popover.Activator` wires the [native Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) via the `popovertarget` attribute. See the [Browser Support](/introduction/browser-support) page for fallback behavior in older browsers.

> [!TIP]
> Always spread the `attrs` object from slot props onto your interactive elements. Missing ARIA attributes break screen reader support.

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
// You implement navigation logic - v0 provides selection state
function onKeydown (e: KeyboardEvent, ids: string[], currentIndex: number) {
  switch (e.key) {
    case 'ArrowDown': selection.select(ids[currentIndex + 1]); break
    case 'ArrowUp': selection.select(ids[currentIndex - 1]); break
    case 'Home': selection.select(ids[0]); break
    case 'End': selection.select(ids[ids.length - 1]); break
  }
}
```

## Testing Strategies

### Automated Testing

```ts MyComponent.test.ts
import { axe } from 'vitest-axe'

it('passes accessibility audit', async () => {
  const { container } = render(MyComponent)
  expect(await axe(container)).toHaveNoViolations()
})
```

### Manual Testing Checklist

Use this checklist during manual QA:

```markdown
- [ ] Tab through all interactive elements
- [ ] Verify focus visibility
- [ ] Test with keyboard only (no mouse)
- [ ] Check color contrast with DevTools
- [ ] Validate with browser accessibility tree
```

### Recommended Tools

| Tool | Purpose |
| - | - |
| axe DevTools | Browser extension for WCAG scanning |
| Lighthouse | Built-in Chrome audit |
| NVDA/VoiceOver | Screen reader verification |

## Internationalization

v0's `useLocale` handles translated labels. See `useLocale` for accessibility label translations.

For RTL (right-to-left) support, see `useRtl`. Direction is managed independently from locale — `useRtl` provides a reactive `isRtl` boolean and sets the `dir` attribute on the target element.
