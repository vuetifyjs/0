---
title: OverlayPanel - Position-agnostic floating overlay for Vue 3
meta:
- name: description
  content: Build non-modal floating overlays with portal teleportation, z-index stacking, escape dismissal, and click-outside handling. Position-agnostic design lets you apply custom positioning.
- name: keywords
  content: overlay, panel, floating, drawer, sheet, Vue 3, headless, accessibility, ARIA, portal
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

A position-agnostic, non-modal floating overlay primitive with portal teleportation, z-index coordination, escape dismissal, and click-outside behavior.

<DocsPageFeatures :frontmatter />

## Usage

OverlayPanel combines the overlay behaviors from Dialog (portal, z-index stacking, escape, click-outside) without the modal semantics (native dialog, focus trap, inert backdrop). Unlike Popover, it doesn't assume CSS anchor positioning — you control the layout.

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
      <!-- Panel content -->

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

### With Scrim

Set `scrim` to `true` to have the panel register a backdrop with the stack system:

```vue
<template>
  <OverlayPanel.Content scrim>
    <!-- Panel has a scrim/backdrop -->
  </OverlayPanel.Content>
</template>
```

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
| `aria-label` | Localized "Close" string | Close |

### Keyboard Navigation

| Key | Action |
|-----|--------|
| `Tab` / `Shift + Tab` | Moves focus between focusable elements (not trapped) |
| `Escape` | Closes the panel (when `closeOnEscape` is true) |
| `Enter` / `Space` | Activates the focused control |

### Focus Management

When the panel opens, focus stays on the activator by default. When the panel closes, focus returns to the element that was focused before the panel opened. Unlike Dialog, focus is not trapped inside the panel.

## OverlayPanel vs Dialog vs Popover

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

<DocsApi />
