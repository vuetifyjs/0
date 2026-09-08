---
title: OverlayPanel - Position-agnostic floating overlay for Vue 3
meta:
- name: description
  content: Build non-modal floating overlays with teleport, z-index stacking, escape dismissal, and click-outside handling. Position-agnostic design lets you apply custom positioning.
- name: keywords
  content: overlay, panel, floating, drawer, sheet, Vue 3, headless, accessibility, ARIA, teleport
features:
  category: Component
  label: 'C: OverlayPanel'
  github: /components/OverlayPanel/
  renderless: false
  level: 2
related:
  - /components/disclosure/dialog
  - /components/disclosure/popover
  - /components/primitives/portal
---

# OverlayPanel

A position-agnostic, non-modal floating overlay primitive with teleport, z-index coordination, escape dismissal, and click-outside behavior.

<DocsPageFeatures :frontmatter />

## Usage

OverlayPanel combines the overlay behaviors from Dialog (z-index stacking, escape, click-outside) without the modal semantics (native dialog, focus trap, inert backdrop). OverlayPanel teleports its content; Dialog uses native `<dialog showModal()>`. Unlike Popover, OverlayPanel doesn't assume CSS anchor positioning — you control the layout.

Use OverlayPanel when you need floating UI that:
- Doesn't block interaction with the page (non-modal)
- Needs a custom positioning strategy (sidebars, sheets, floating panels)
- Should dismiss on escape or click-outside

::: gn-example
/components/overlay-panel/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { OverlayPanel } from '@vuetify/v0'
</script>

<template>
  <OverlayPanel.Root>
    <OverlayPanel.Activator />

    <OverlayPanel.Content>
      <OverlayPanel.Close />
    </OverlayPanel.Content>
  </OverlayPanel.Root>
</template>
```

## Recipes

### Side Drawer

Use CSS to position the panel as a side drawer:

::: gn-example
/components/overlay-panel/drawer
:::

### Click-Outside Dismissal

By default, clicking outside the panel closes it. Set `closeOnClickOutside` to `false` on `OverlayPanel.Content` to prevent this:

```vue
<template>
  <OverlayPanel.Content :close-on-click-outside="false">
    <!-- Panel won't close on outside click -->
  </OverlayPanel.Content>
</template>
```

### Escape Key Dismissal

By default, pressing Escape closes the panel. Set `closeOnEscape` to `false` to prevent this:

```vue
<template>
  <OverlayPanel.Content :close-on-escape="false">
    <!-- Panel won't close on Escape -->
  </OverlayPanel.Content>
</template>
```

### Blocking

`closeOnClickOutside` stops OverlayPanel's own click-outside listener. `blocking` is what stops the global Scrim. They are independent — `:close-on-click-outside="false"` with `scrim` still dismisses via Scrim unless you also pass `blocking`.

```vue
<template>
  <OverlayPanel.Content blocking scrim>
    <!-- Scrim click will not close — must use OverlayPanel.Close, Escape, or v-model -->
  </OverlayPanel.Content>
</template>
```

### With Scrim

`scrim` only registers a stack ticket so the global scrim can paint a layer. OverlayPanel does not render a backdrop of its own — the app must mount [Scrim](/components/providers/scrim) once at the app root.

```vue
<template>
  <OverlayPanel.Content scrim>
    <!-- Registers a stack ticket; mount Scrim at the app root to paint the backdrop -->
  </OverlayPanel.Content>
</template>
```

### Teleport Target

`to` sets the Teleport destination. Resolution is per-component `to` → `stack.default` (from `createStackPlugin`) → `'body'`.

`disabled` skips Teleport and renders Content inline at its original position in the DOM. It is **not** an interactive-disabled flag — the panel stays operable. Stack registration stays active, so `zIndex` is still provided via slot props.

```vue
<template>
  <OverlayPanel.Content :to="host">
    <!-- Teleports into `host` -->
  </OverlayPanel.Content>

  <OverlayPanel.Content disabled>
    <!-- Renders inline; not teleported -->
  </OverlayPanel.Content>
</template>
```

### Leave Animations

Content unmounts when the panel closes (`v-if` on the Content host). CSS leave animations on Content cannot run. Wrapping OverlayPanel in Presence does not animate the panel — the unmount is inside Content, so Presence never sees a leaving vnode for the panel itself.

### OverlayPanel vs Dialog vs Popover

| Feature | OverlayPanel | Dialog | Popover |
|---------|--------------|--------|---------|
| Modal | ❌ No | ✅ Yes | ❌ No |
| Focus trap | ❌ No | ✅ Yes | ❌ No |
| Positioning | Consumer-controlled | Centered by CSS | CSS anchor positioning |
| Native element | `<div>` | `<dialog>` | Native popover |
| Inert backdrop | ❌ No | ✅ Yes | ❌ No |
| Z-index stacking | ✅ Yes | ✅ Yes | ✅ Yes |
| Click-outside close | ✅ Optional | ✅ Optional | ✅ Yes |
| Escape close | ✅ Optional | ✅ Native | ✅ Native |

**When to use:**
- **Dialog**: Critical actions requiring user attention (confirmations, forms)
- **Popover**: Tooltips, menus, and dropdowns anchored to a trigger
- **OverlayPanel**: Side drawers, sheets, floating panels with custom positioning

## Accessibility

OverlayPanel uses `role="dialog"` with `aria-modal="false"` since it's non-modal.

### ARIA Attributes

| Attribute | Value | Element |
|-----------|-------|---------|
| `aria-haspopup` | `dialog` | Activator |
| `aria-expanded` | `true` / `false` | Activator |
| `aria-controls` | Content element ID | Activator |
| `role` | `dialog` | Content |
| `aria-modal` | `false` | Content |
| `aria-label` / `aria-labelledby` | Consumer-provided accessible name | Content |
| `aria-label` | Localized "Close" string | Close |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` / `Shift + Tab` | Moves focus between focusable elements (not trapped) |
| `Escape` | Closes the panel (when `closeOnEscape` is true) |
| `Enter` / `Space` | Activates the focused control |

### Focus Management

When the panel opens, focus moves to the panel (`tabindex="-1"` on Content). Escape and OverlayPanel.Close restore focus to the previously focused element. Pointer light-dismiss (click-outside) does not restore — focus stays where the pointer landed. Focus is not trapped (unlike Dialog). Consumers must give Content an accessible name (`aria-label` or `aria-labelledby`).

<DocsApi />
