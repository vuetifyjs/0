---
title: Bootstrap - Vue Behavior for Bootstrap 6 Markup
meta:
- name: description
  content: Vue components that render Bootstrap 6 markup. Load your stylesheet. This package opens, closes, and handles the keyboard.
- name: keywords
  content: bootstrap 6, vue, bootstrap vue components, compat design system, headless, vuetify0, paper
features:
  category: Guide
  label: 'Bootstrap'
  level: 2
  order: 0
related:
  - /systems/bootstrap/button
  - /systems/bootstrap/dialog
  - /systems/bootstrap/form-control
  - /systems/bootstrap/navbar
  - /systems/bootstrap/carousel
---

# Bootstrap

Vue components that render Bootstrap 6 markup. You load the stylesheet. This package opens, closes, and handles the keyboard.

<DocsPageFeatures :frontmatter />

<DocsSystemActivator palette="bootstrap" />

`@paper/bootstrap` renders the elements and classes from the Bootstrap 6 docs, and [Vuetify0](/) supplies the behavior. Your stylesheet does not change. There is no class prefix to learn, and no CSS in this package.

<DocsBootstrapReference
  href="https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/getting-started/install/"
  title="Bootstrap 6"
/>

::: ds-example no-resize
/systems/bootstrap/overview
:::

## Installation

::: code-group no-filename

```bash pnpm
pnpm add @paper/bootstrap
```

```bash npm
npm install @paper/bootstrap
```

```bash yarn
yarn add @paper/bootstrap
```

```bash bun
bun add @paper/bootstrap
```

:::

Bootstrap itself is an **optional** peer once 6.x is published. Until then, load the pinned stylesheet. The package never imports it.

```html
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/gh/twbs/bootstrap@f6cc0f2cde9cbf3d73759ada24a39555d2de3a12/dist/css/bootstrap.min.css"
>
```

Components do not need a plugin. Import one and use it:

```vue collapse
<script setup lang="ts">
  import { BDialog } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <button class="btn-solid theme-primary" type="button" @click="open = true">
    Open dialog
  </button>

  <BDialog v-model="open">
    <BDialog.Header>
      <BDialog.Title>Dialog title</BDialog.Title>
      <BDialog.Close />
    </BDialog.Header>

    <BDialog.Body>
      <p>Your content</p>
    </BDialog.Body>
  </BDialog>
</template>
```

Every region Bootstrap documents is an express part, such as `BDialog.Header`, `BDialog.Body`, and `BMenu.Item`. There are no named slots. Import the parent. The parts hang off it. The flat names (`BDialogHeader`) remain exported and valid.

Do not load `bootstrap.bundle.js` next to this package. The two would both try to own the same dialog.

## Theme

`createBootstrapPlugin()` connects the app theme to Bootstrap. It sets `data-bs-theme` to `light` or `dark`. That is the switch the stylesheet already uses for `light-dark()`. The package still ships no CSS.

A color you pass overrides one variable. `primary` writes `--bs-primary-base`, which is what `theme-primary` reads. `blue-500` writes `--bs-blue-500`. One color does not rebuild the rest of that ramp. Nothing here writes `--v0-*`.

```ts
import { createBootstrapPlugin } from '@paper/bootstrap'

app.use(createBootstrapPlugin())
```

`{ theme: false }` installs nothing. Use that when the app already has a theme plugin and will attach `BootstrapThemeAdapter` itself.

> [!NOTE]
> Bootstrap **6** only. The 5.x line is unsupported. 6 is not on npm yet. The sandbox and the conformance fixtures are pinned to `f6cc0f2` on `v6-dev`.

## What conformance means

Every component is diffed against the markup published in the [Bootstrap 6 docs](https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/) at the pinned commit. The fixtures live beside the source in `packages/bootstrap/harness/fixtures/`, and the conformance suite asserts that the rendered DOM matches, element for element, class for class.

Where the two differ, the difference is deliberate and declared:

| Deviation | Why |
|-----------|-----|
| No owned token namespace | `--bs-*` belongs to upstream. The package owns no prefix |
| Upstream state classes, unprefixed | `.show` and the native `open` attribute, instead of data-attribute hooks. Bootstrap's CSS selects on them |
| Native form controls | Bootstrap styles native `input`, `textarea`, and `select`. A non-native control gets none of your CSS |
| No bundle attributes | `data-bs-toggle` and `data-bs-dismiss` belong to `bootstrap.bundle.js`. This package sets the state itself |
| Dialog and drawer are `<dialog>` | Backdrop is the browser's `::backdrop`. v6 names these dialog and drawer, and the collapse in a navbar is a drawer |

## Components

Every component below is exported from `@paper/bootstrap` and has a page. The middle column is the v0 feature it is built on. `markup` means the component renders Bootstrap's elements itself.

### Overlay

| Component | What it wraps | Page |
|-----------|---------------|------|
| `BDialog` | v0 [Dialog](/components/disclosure/dialog) | [Dialog](/systems/bootstrap/dialog) |
| `BDrawer` | v0 [Dialog](/components/disclosure/dialog) | [Drawer](/systems/bootstrap/drawer) |
| `BMenu` | v0 [usePopover](/composables/system/use-popover) | [Menu](/systems/bootstrap/menu) |
| `BPopover` | v0 [usePopover](/composables/system/use-popover) | [Popover](/systems/bootstrap/popover) |
| `BToast` | v0 [createQueue](/composables/registration/create-queue) + [useTimer](/composables/system/use-timer) | [Toast](/systems/bootstrap/toast) |
| `BTooltip` | v0 [usePopover](/composables/system/use-popover) | [Tooltip](/systems/bootstrap/tooltip) |

### Disclosure

| Component | What it wraps | Page |
|-----------|---------------|------|
| `BAccordion` | v0 [createContext](/composables/foundation/create-context) | [Accordion](/systems/bootstrap/accordion) |
| `BCollapse` | markup | [Collapse](/systems/bootstrap/collapse) |
| `BNav` | markup | [Nav](/systems/bootstrap/nav) |
| `BNavbar` | v0 [Dialog](/components/disclosure/dialog) | [Navbar](/systems/bootstrap/navbar) |
| `BNavOverflow` | v0 [createOverflow](/composables/semantic/create-overflow) + [usePopover](/composables/system/use-popover) | [Nav overflow](/systems/bootstrap/nav-overflow) |
| `BScrollSpy` | v0 [useIntersectionObserver](/composables/system/use-intersection-observer) | [Scrollspy](/systems/bootstrap/scrollspy) |
| `BTabs` | v0 [createSingle](/composables/selection/create-single) + [useRovingFocus](/composables/system/use-roving-focus) | [Tabs](/systems/bootstrap/tabs) |

### Forms

| Component | What it wraps | Page |
|-----------|---------------|------|
| `BCheck` | markup | [Check](/systems/bootstrap/check) |
| `BChips` | v0 [createSelection](/composables/selection/create-selection) | [Chips](/systems/bootstrap/chips) |
| `BCombobox` | v0 [createCombobox](/composables/forms/create-combobox) + [usePopover](/composables/system/use-popover) | [Combobox](/systems/bootstrap/combobox) |
| `BFile` | v0 [createInput](/composables/forms/create-input) | [File](/systems/bootstrap/file) |
| `BFormAdorn` | markup | [Form adorn](/systems/bootstrap/form-adorn) |
| `BFormControl` | v0 [createInput](/composables/forms/create-input) | [Form control](/systems/bootstrap/form-control) |
| `BFormFeedback` | markup | [Form feedback](/systems/bootstrap/form-feedback) |
| `BFormField` | markup | [Form field](/systems/bootstrap/form-field) |
| `BFormLabel` | markup | [Form label](/systems/bootstrap/form-label) |
| `BFormText` | markup | [Form text](/systems/bootstrap/form-text) |
| `BInputGroup` | markup | [Input group](/systems/bootstrap/input-group) |
| `BOtp` | v0 [Otp](/components/forms/otp) | [Otp](/systems/bootstrap/otp) |
| `BRadio` | markup | [Radio](/systems/bootstrap/radio) |
| `BRange` | v0 [createSlider](/composables/forms/create-slider) | [Range](/systems/bootstrap/range) |
| `BStrength` | markup | [Strength](/systems/bootstrap/strength) |
| `BSwitch` | markup | [Switch](/systems/bootstrap/switch) |
| `BToggler` | markup | [Toggler](/systems/bootstrap/toggler) |

### Content

| Component | What it wraps | Page |
|-----------|---------------|------|
| `BAlert` | v0 [Alert](/components/semantic/alert) + [usePresence](/composables/system/use-presence) | [Alert](/systems/bootstrap/alert) |
| `BAvatar` | markup | [Avatar](/systems/bootstrap/avatar) |
| `BBadge` | markup | [Badge](/systems/bootstrap/badge) |
| `BBreadcrumb` | markup | [Breadcrumb](/systems/bootstrap/breadcrumb) |
| `BButton` | markup | [Button](/systems/bootstrap/button) |
| `BButtonGroup` | markup | [Button group](/systems/bootstrap/button-group) |
| `BCard` | markup | [Card](/systems/bootstrap/card) |
| `BCarousel` | v0 [Carousel](/components/semantic/carousel) | [Carousel](/systems/bootstrap/carousel) |
| `BClose` | v0 [useLocale](/composables/plugins/use-locale) | [Close](/systems/bootstrap/close) |
| `BListGroup` | markup | [List group](/systems/bootstrap/list-group) |
| `BPagination` | v0 [Pagination](/components/semantic/pagination) | [Pagination](/systems/bootstrap/pagination) |
| `BPlaceholder` | markup | [Placeholder](/systems/bootstrap/placeholder) |
| `BProgress` | v0 [createProgress](/composables/semantic/create-progress) | [Progress](/systems/bootstrap/progress) |
| `BSpinner` | markup | [Spinner](/systems/bootstrap/spinner) |
| `BStepper` | v0 [Step](/components/providers/step) | [Stepper](/systems/bootstrap/stepper) |

### Layout

| Component | What it wraps | Page |
|-----------|---------------|------|
| `BCol` | markup | [Col](/systems/bootstrap/col) |
| `BContainer` | markup | [Container](/systems/bootstrap/container) |
| `BRow` | markup | [Row](/systems/bootstrap/row) |

`BDatepicker` is specified and does not ship yet. The date picker it needs is not in Vuetify0. Tables are not a Bootstrap component, so there is no `BTable`.
