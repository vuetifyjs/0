---
title: Constants - Environment Detection for Vue 3
meta:
- name: description
  content: SSR-safe environment detection constants from Vuetify0. Browser checks, touch support, observer availability, and more.
- name: keywords
  content: constants, SSR, browser detection, IN_BROWSER, SUPPORTS_TOUCH, environment, Vue 3
features:
  order: 6
  level: 2
related:
  - /guide/features/utilities
  - /guide/features/types
---

# Constants

SSR-safe boolean constants for environment detection. All evaluate at module load time and are tree-shakeable.

<DocsPageFeatures :frontmatter />

```ts
import { IN_BROWSER, SUPPORTS_TOUCH } from '@vuetify/v0/constants'
```

## IN_BROWSER

`true` when running in a browser context. Use this instead of raw `typeof window !== 'undefined'` checks.

```ts
import { IN_BROWSER } from '@vuetify/v0/constants'

if (IN_BROWSER) {
  // Safe to access window, document, localStorage, etc.
  window.addEventListener('resize', onResize)
}
```

## SUPPORTS_TOUCH

`true` when the device supports touch input. Checks for `ontouchstart` on `window` or `navigator.maxTouchPoints > 0`.

```ts
import { SUPPORTS_TOUCH } from '@vuetify/v0/constants'

if (SUPPORTS_TOUCH) {
  // Bind touch-specific handlers
}
```

## SUPPORTS_MATCH_MEDIA

`true` when `window.matchMedia` is available. Required by `useMediaQuery` and `useBreakpoints`.

```ts
import { SUPPORTS_MATCH_MEDIA } from '@vuetify/v0/constants'

if (SUPPORTS_MATCH_MEDIA) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)')
}
```

## SUPPORTS_OBSERVER

`true` when `ResizeObserver` is available. Required by `useResizeObserver`.

```ts
import { SUPPORTS_OBSERVER } from '@vuetify/v0/constants'

if (SUPPORTS_OBSERVER) {
  const observer = new ResizeObserver(onResize)
}
```

## SUPPORTS_INTERSECTION_OBSERVER

`true` when `IntersectionObserver` is available. Required by `useIntersectionObserver`.

```ts
import { SUPPORTS_INTERSECTION_OBSERVER } from '@vuetify/v0/constants'

if (SUPPORTS_INTERSECTION_OBSERVER) {
  const observer = new IntersectionObserver(onIntersect)
}
```

## SUPPORTS_MUTATION_OBSERVER

`true` when `MutationObserver` is available. Required by `useMutationObserver`.

```ts
import { SUPPORTS_MUTATION_OBSERVER } from '@vuetify/v0/constants'

if (SUPPORTS_MUTATION_OBSERVER) {
  const observer = new MutationObserver(onMutate)
}
```

## version

The current package version string. Resolves to the build-time version in production, or `'0.0.0'` in development:

```ts
import { version } from '@vuetify/v0/constants'

console.log(version)  // e.g. '0.4.2'
```

## HTML Elements

`SELF_CLOSING_TAGS` and `COMMON_ELEMENTS` are exported for component and renderer authoring.

### SELF_CLOSING_TAGS

A `Set<string>` of all HTML void elements that cannot have children:

```ts
import { SELF_CLOSING_TAGS, isSelfClosingTag } from '@vuetify/v0/constants'

SELF_CLOSING_TAGS.has('input')  // true
SELF_CLOSING_TAGS.has('div')    // false

isSelfClosingTag('br')   // true
isSelfClosingTag('span') // false
```

### COMMON_ELEMENTS

An object of uppercase constants mapping to lowercase HTML tag strings. Useful for polymorphic components:

```ts
import { COMMON_ELEMENTS } from '@vuetify/v0/constants'

// COMMON_ELEMENTS.DIV === 'div'
// COMMON_ELEMENTS.BUTTON === 'button'
// COMMON_ELEMENTS.A === 'a'

const { tag = COMMON_ELEMENTS.DIV } = defineProps<{ tag?: string }>()
```

## Reference

| Constant | Checks |
| - | - |
| `IN_BROWSER` | `typeof window !== 'undefined'` |
| `SUPPORTS_TOUCH` | `ontouchstart` or `maxTouchPoints > 0` |
| `SUPPORTS_MATCH_MEDIA` | `window.matchMedia` exists and is a function |
| `SUPPORTS_OBSERVER` | `window.ResizeObserver` exists |
| `SUPPORTS_INTERSECTION_OBSERVER` | `window.IntersectionObserver` exists |
| `SUPPORTS_MUTATION_OBSERVER` | `window.MutationObserver` exists |

> [!TIP]
> All `SUPPORTS_*` constants depend on `IN_BROWSER`—they are always `false` during SSR. You don't need to check `IN_BROWSER` separately when using them.
