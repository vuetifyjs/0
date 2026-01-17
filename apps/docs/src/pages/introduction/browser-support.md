---
title: Browser Support - Vuetify0 Compatibility
meta:
  - name: description
    content: Browser compatibility matrix for Vuetify0 headless UI. Learn which browsers support v0 features and recommended browsers for the documentation site.
  - name: keywords
    content: vuetify0, browser support, compatibility, Chrome, Firefox, Safari, Edge
features:
  order: 3
  level: 1
related:
  - /introduction/getting-started
  - /introduction/frequently-asked
  - /components/disclosure/popover
---

# Browser Support

Vuetify0 targets modern evergreen browsers. Some features require newer browser versions or degrade gracefully when unavailable.

<DocsPageFeatures :frontmatter />

## Baseline Support

Vuetify0 requires Vue 3.5+, which targets browsers with native [ES2016 support](https://caniuse.com/es6):

| Browser | Minimum Version |
|---------|----------------:|
| <AppBrowserIcon browser="chrome" /> Chrome | 52+ |
| <AppBrowserIcon browser="edge" /> Edge | 79+ |
| <AppBrowserIcon browser="firefox" /> Firefox | 52+ |
| <AppBrowserIcon browser="safari" /> Safari | 10.1+ |
| <AppBrowserIcon browser="opera" /> Opera | 39+ |

> [!WARNING]
> Internet Explorer is not supported and never will be.

## Feature Compatibility

Some v0 features use modern browser APIs that have varying levels of support. The library includes feature detection and graceful degradation where possible.

### Cutting-Edge Features

These features require the latest browser versions and may not work in all browsers:

| Feature | <AppBrowserIcon browser="chrome" /> | <AppBrowserIcon browser="firefox" /> | <AppBrowserIcon browser="safari" /> | <AppBrowserIcon browser="edge" /> | Fallback |
|---------|---:|---:|---:|---:|----------|
| [CSS Anchor Positioning](https://caniuse.com/css-anchor-positioning) | 125+ | 147+ | — | 125+ | Properties ignored |
| [Popover API](https://developer.mozilla.org/en-US/docs/Web/API/Popover_API) | 114+ | 125+ | 17+ | 114+ | Optional chaining |
| [Scrollend Event](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollend_event) | 112+ | 109+ | 18+ | 112+ | Falls back to scroll |

> [!TIP]
> CSS Anchor Positioning is currently only available in <AppBrowserIcon browser="chrome" /> Chrome 125+, <AppBrowserIcon browser="edge" /> Edge 125+, and <AppBrowserIcon browser="firefox" /> Firefox 147 beta. Safari support is not yet available.

### Well-Supported Features

These features have broad browser support with proper feature detection:

| Feature | <AppBrowserIcon browser="chrome" /> | <AppBrowserIcon browser="firefox" /> | <AppBrowserIcon browser="safari" /> | <AppBrowserIcon browser="edge" /> | Fallback |
|---------|---:|---:|---:|---:|----------|
| [Native Dialog](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal) | 37+ | 98+ | 15.4+ | 79+ | Optional chaining |
| [ResizeObserver](https://caniuse.com/resizeobserver) | 64+ | 69+ | 13.1+ | 79+ | Feature detection |
| [IntersectionObserver](https://caniuse.com/intersectionobserver) | 51+ | 55+ | 12.1+ | 79+ | Feature detection |
| [MutationObserver](https://caniuse.com/mutationobserver) | 26+ | 14+ | 6+ | 12+ | Feature detection |
| [matchMedia](https://caniuse.com/matchmedia) | 10+ | 6+ | 5.1+ | 12+ | Feature detection |
| [Pointer Events](https://caniuse.com/pointer) | 55+ | 59+ | 13.1+ | 79+ | Assumed available |

### SSR & Hydration Safety

All composables use the `IN_BROWSER` constant and `useHydration` composable to ensure safe server-side rendering:

```ts
import { IN_BROWSER } from '#v0/constants/globals'
import { useHydration } from '#v0/composables'

const { isHydrated } = useHydration()

// Browser APIs are only accessed after hydration
if (isHydrated.value && IN_BROWSER) {
  // Safe to use browser APIs
}
```

## Feature Detection Constants

v0 exposes feature detection constants for conditional logic:

```ts
import {
  IN_BROWSER,
  SUPPORTS_TOUCH,
  SUPPORTS_MATCH_MEDIA,
  SUPPORTS_OBSERVER,
  SUPPORTS_INTERSECTION_OBSERVER,
  SUPPORTS_MUTATION_OBSERVER,
} from '#v0/constants/globals'
```

## Documentation Site

The documentation site you're viewing uses additional modern features for the best experience. For optimal documentation browsing:

| Browser | Recommended Version |
|---------|--------------------:|
| <AppBrowserIcon browser="chrome" /> Chrome | 123+ |
| <AppBrowserIcon browser="edge" /> Edge | 123+ |
| <AppBrowserIcon browser="firefox" /> Firefox | 120+ |
| <AppBrowserIcon browser="safari" /> Safari | 17.5+ |
| <AppBrowserIcon browser="opera" /> Opera | 109+ |

### Docs-Specific Features

The documentation site uses these modern CSS and browser features:

- **`color-mix()`** — Theme color blending and glass effects
- **`light-dark()`** — Native CSS theme switching
- **`inert` attribute** — Modal focus management
- **CSS Nesting** — Organized stylesheets
- **Backdrop Filter** — Glass morphism effects
- **Service Workers** — Offline support (PWA)

> [!TIP]
> If you experience visual issues or missing features while browsing the docs, try updating to the latest version of your browser.

## Known Limitations

### CSS Anchor Positioning

The [Popover](/components/disclosure/popover) component uses CSS Anchor Positioning for automatic placement relative to trigger elements. This is a new CSS feature with limited support:

- <AppBrowserIcon browser="chrome" /> **Chrome 125+**: Full support
- <AppBrowserIcon browser="edge" /> **Edge 125+**: Full support
- <AppBrowserIcon browser="firefox" /> **Firefox 147+**: Beta support only
- <AppBrowserIcon browser="safari" /> **Safari**: Not yet supported

When anchor positioning is unavailable, the CSS properties are simply ignored. Consider using a JavaScript positioning library like [Floating UI](https://floating-ui.com) for broader browser support.

### Popover API

The native Popover API provides built-in light dismiss behavior and top-layer rendering. Support is growing but not universal:

- <AppBrowserIcon browser="chrome" /> **Chrome 114+**: Full support
- <AppBrowserIcon browser="edge" /> **Edge 114+**: Full support
- <AppBrowserIcon browser="firefox" /> **Firefox 125+**: Full support
- <AppBrowserIcon browser="safari" /> **Safari 17+**: Full support
- <AppBrowserIcon browser="opera" /> **Opera 100+**: Full support

The v0 Popover component uses optional chaining (`element.showPopover?.()`) to gracefully handle missing API support.

### Native Dialog

The `<dialog>` element with `showModal()` is well-supported in modern browsers but older Safari versions lack support:

- <AppBrowserIcon browser="safari" /> **Safari 15.4+**: Full support
- <AppBrowserIcon browser="safari" /> **Safari < 15.4**: No support, no fallback

Consider a dialog polyfill if you need to support older Safari versions.

## Polyfills

Vuetify0 does not include polyfills to keep bundle sizes small. If you need to support older browsers, consider adding polyfills for:

- **ResizeObserver**: [resize-observer-polyfill](https://www.npmjs.com/package/resize-observer-polyfill) · [caniuse](https://caniuse.com/resizeobserver)
- **IntersectionObserver**: [intersection-observer](https://www.npmjs.com/package/intersection-observer) · [caniuse](https://caniuse.com/intersectionobserver)
- **Dialog**: [dialog-polyfill](https://www.npmjs.com/package/dialog-polyfill) · [caniuse](https://caniuse.com/dialog)

## Testing Your Browser

You can check your browser's feature support using these resources:

- [Can I Use](https://caniuse.com) — Browser compatibility tables
- [MDN Web Docs](https://developer.mozilla.org) — Feature documentation and support info
- [Baseline](https://web.dev/baseline) — Web platform feature availability
