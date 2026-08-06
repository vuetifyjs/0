---
title: BuModal - Bulma Modal for Vue
meta:
- name: description
  content: Bulma's modal markup with Vuetify0 behavior — Escape to close, backdrop dismissal, focus trapping and focus return, in both the modal-content and modal-card variants.
- name: keywords
  content: bulma modal, vue modal, modal-card, dialog, focus trap, bulma vue, paper bulma
features:
  category: Component
  label: 'C: BuModal'
  level: 2
  renderless: false
  order: 1
related:
  - /systems/bulma
  - /systems/bulma/dropdown
  - /components/disclosure/dialog
---

# BuModal

Bulma's `.modal` with the JavaScript it never shipped: open state, backdrop dismissal, Escape, focus trapping and focus return.

<DocsPageFeatures :frontmatter />

## Usage

`v-model` owns the open state. The panel is whichever part you compose inside: `BuModalContent` for the plain variant, `BuModalCard` for the head/body/foot one. Everything inside the panel is Bulma's.

::: ds-example
/systems/bulma/modal/basic
:::

## Anatomy

Both panels are shown here for completeness — a modal composes one or the other, never both.

```vue Anatomy no-filename
<script setup lang="ts">
  import {
    BuModal,
    BuModalBody,
    BuModalCard,
    BuModalClose,
    BuModalContent,
    BuModalFoot,
    BuModalHead,
    BuModalTitle,
  } from '@paper/bulma'
</script>

<template>
  <BuModal>
    <BuModalContent />

    <BuModalClose />

    <BuModalCard>
      <BuModalHead>
        <BuModalTitle />
      </BuModalHead>

      <BuModalBody />

      <BuModalFoot />
    </BuModalCard>
  </BuModal>
</template>
```

## The markup you know

The Bulma tab is the markup [published on bulma.io](https://bulma.io/documentation/components/modal/), captured verbatim in the conformance fixture. The Vue tab is the component that renders it. The conformance suite diffs the two on every test run — element for element, class for class.

::: code-group no-filename

```html Bulma
<div class="modal is-active">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Modal title</p>
      <button class="delete" aria-label="close"></button>
    </header>
    <section class="modal-card-body">
      <!-- Content ... -->
    </section>
    <footer class="modal-card-foot">
      <div class="buttons">
        <button class="button is-success">Save changes</button>
        <button class="button">Cancel</button>
      </div>
    </footer>
  </div>
</div>
```

```vue Vue
<template>
  <BuModal v-model="open">
    <BuModalCard>
      <BuModalHead>
        <BuModalTitle>Modal title</BuModalTitle>
      </BuModalHead>

      <BuModalBody>
        Content ...
      </BuModalBody>

      <BuModalFoot>
        <div class="buttons">
          <button class="button is-success">Save changes</button>
          <button class="button">Cancel</button>
        </div>
      </BuModalFoot>
    </BuModalCard>
  </BuModal>
</template>
```

:::

You write no `is-active`, no `.modal-background`, no `.delete` button, and no close handler. The components own those, driven by `v-model`.

## Examples

::: ds-example
/systems/bulma/modal/card

### Card variant

Composing `BuModalCard` instead of `BuModalContent` gives Bulma's three-region layout — a sticky head and foot with a scrollable body, sized to the viewport. `BuModalHead` always renders the documented `.delete` button wired to close, so the only close handlers you write are the ones on your own footer buttons.

Reach for it when the modal has an obvious title and a decision to commit — a form, a confirmation. The plain content variant, with its large corner close button, suits a modal whose body is a single self-contained block.
:::

## Props

`BuModal` renders `.modal` and its backdrop, and owns the open state. Everything else is a part.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `boolean` | `false` | Open state |
| `blocking` | `boolean` | `false` | Ignore clicks on `.modal-background` |

| Part | Renders | Notes |
|------|---------|-------|
| `BuModalContent` | `div.modal-content` | Plain variant panel; carries `role="dialog"` |
| `BuModalClose` | `button.modal-close` | Sibling of the content panel; `size` prop, default `large` |
| `BuModalCard` | `div.modal-card` | Card variant panel; carries `role="dialog"` |
| `BuModalHead` | `header.modal-card-head` | Always renders the `.delete` close button |
| `BuModalTitle` | `p.modal-card-title` | Supplies the panel's accessible name |
| `BuModalBody` | `section.modal-card-body` | Scrollable region |
| `BuModalFoot` | `footer.modal-card-foot` | Action row |

## Accessibility

The panel part — `BuModalContent` or `BuModalCard` — carries `role="dialog"` and `aria-modal`. Tab and Shift+Tab cycle inside the modal, Escape closes it, and focus returns to whatever opened it, including when the modal is unmounted while open.

> [!IMPORTANT]
> `BuModalCard` binds `aria-labelledby` to the id `BuModalTitle` renders. Compose a title, or that reference dangles and the dialog has no accessible name.

> [!NOTE]
> `blocking` gates backdrop clicks only. Escape still closes a blocking modal, matching Vuetify0's Dialog semantics and the native `dialog` element's cancel behavior.
