---
"@vuetify/v0": patch
---

fix(useResizeObserver): report border-box measurements so the `box` option is no longer a silent no-op (#724)

`useResizeObserver` accepted `box: 'border-box'` but every entry it reported was content-box, so any element with padding or a border measured short by exactly that amount — with no type error and no warning. Entries now also carry `borderBoxSize` and `contentBoxSize`, matching the native `ResizeObserverEntry`:

```ts
useResizeObserver(el, ([entry]) => {
  entry.contentRect.height          // 30 — content box, as before
  entry.borderBoxSize[0].blockSize  // 40 — with 4px padding and a 1px border
}, { box: 'border-box' })
```

Both arrays are present on every entry regardless of `box`, so you can read the border box without changing any option. Unlike `getBoundingClientRect()`, they are layout values and are not scaled by CSS transforms.

`contentRect` is unchanged — existing callbacks keep working as-is.
