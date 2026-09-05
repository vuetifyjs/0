---
title: BuFile - Bulma File Upload for Vue
meta:
- name: description
  content: Bulma's file upload for Vue — composed Cta/Icon/Name parts, boxed, named and colored variants, selected files on a change event, and Vuetify0 validation.
- name: keywords
  content: bulma file, vue file upload, file-cta, has-name, is-boxed, bulma vue, paper bulma
features:
  category: Component
  label: 'C: BuFile'
  level: 2
  renderless: false
  order: 18
related:
  - /systems/bulma
  - /systems/bulma/field
  - /composables/forms/create-input
---

# BuFile

<DocsPageFeatures :frontmatter />

Bulma's `.file` call-to-action. The native file input is visually hidden by Bulma's CSS; the label is the hit target. Selected files arrive on `change` — there is no `v-model`.

> [!NOTE]
> Reference: [File on bulma.io](https://bulma.io/documentation/form/file/) — classes and visual variants. This page is the JavaScript.

## Usage

Compose `BuFileCta`, `BuFileIcon`, and optionally `BuFileName`. Root owns the native input and the `has-name` modifier (`filename`). The default slot is the CTA/name tree, not the CTA text.

`filename` is the class switch; `BuFileName` is the span. Compose Name without `filename` and the CSS is wrong — Root does not infer `has-name` from Name's presence. Until a file is picked, Name shows `placeholder` (`No file uploaded`).

Boxed, centered, right, fullwidth, color and size all land on the root `.file`. Native attributes (`multiple`, `accept`, `capture`) fall through to the hidden input.

::: ds-example
/systems/bulma/file/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BuFile, BuFileCta, BuFileIcon, BuFileName } from '@paper/bulma'
</script>

<template>
  <BuFile>
    <BuFileCta>
      <BuFileIcon />
    </BuFileCta>

    <BuFileName />
  </BuFile>
</template>
```

## Composed on v0

`BuFile` calls [createInput](/composables/forms/create-input) for validation, form registration, the generated id and `aria-invalid`. The value is a `FileList | null`, dirtied once at least one file is selected. The element is a native `<input type="file">` inside the documented `.file` / `.file-label` tree; Cta, Icon, and Name are composed parts.

It does **not** wrap a v0 file compound — v0 does not ship one — and it does not wrap Input.Control either. Bulma's file CSS is written for this exact tree, including the class collision it ships: `.file-label` is both the outer `<label>` and the inner CTA `<span>`. Compose that inner span as markup inside `BuFileCta`. A restyled text input would not produce that markup.

Fallthrough is split. `class` and `style` merge onto `div.file`; every other attribute lands on the native input.

## The markup you know

The Bulma tab is the markup [published on bulma.io](https://bulma.io/documentation/form/file/), captured verbatim in the conformance fixture. The Vue tab is the component that renders it. The conformance suite diffs the two on every test run — element for element, class for class.

::: code-group no-filename

```html Bulma
<div class="file">
  <label class="file-label">
    <input class="file-input" type="file" name="resume" />
    <span class="file-cta">
      <span class="file-icon">
        <i class="fas fa-upload"></i>
      </span>
      <span class="file-label"> Choose a file… </span>
    </span>
  </label>
</div>
```

```vue Vue
<template>
  <BuFile name="resume">
    <BuFileCta>
      <BuFileIcon>
        <i class="fas fa-upload" />
      </BuFileIcon>
      <span class="file-label">Choose a file…</span>
    </BuFileCta>
  </BuFile>
</template>
```

:::

Bulma's docs hook a script on this markup to copy the chosen filename into `.file-name`. `BuFileName` is that script: the span updates from the selected `FileList` via the `bulma:file` context, and `clear()` resets both the v0 value and the native input.

## Examples

::: ds-example
/systems/bulma/file/filename

### File name

`filename` adds `has-name` on Root. `BuFileName` is the `.file-name` span — a sibling of Cta, not the slot. The span shows `placeholder` until a selection exists, then the selected file names joined with `', '`.

The glyph is the Icon slot, not a class string. Pass an `i` (the sandbox already loads Font Awesome) or any other element.

Listen for `change` if the rest of the form needs the `FileList`. The same list is on the exposed `files` ref. Call `clear()` to empty both the model and the native control — assigning `null` to a ref you do not have is not enough, because `<input type="file">` does not accept a programmatic value other than `''`.

`boxed` is the other layout, not shown here: `is-boxed` stacks the icon above the CTA. Combine it with `filename`, `centered` and a color the way the upstream docs do; every modifier is a class on the same root.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with BuFile.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `boxed` | `boolean` | `false` | `is-boxed` — icon above the label |
| `centered` | `boolean` | `false` | `is-centered` |
| `color` | `'primary' \| 'link' \| 'info' \| 'success' \| 'warning' \| 'danger'` | — | `is-{color}` on the root |
| `disabled` | `boolean` | `false` | Disables the native file input |
| `error` | `boolean` | `false` | Force the invalid state — paints `is-danger` on the root |
| `error-messages` | `string \| string[]` | — | Manual errors, merged with rule errors |
| `filename` | `boolean` | `false` | `has-name` on the root. Compose `BuFileName` for the span |
| `form` | `string` | — | Id of the form to associate with. Snapshotted at setup |
| `fullwidth` | `boolean` | `false` | `is-fullwidth` |
| `id` | `string \| number` | auto | Input id; generated when omitted. Snapshotted at setup |
| `name` | `string` | — | Form field name. Snapshotted at setup |
| `placeholder` | `string` | `'No file uploaded'` | Text in `.file-name` before a file is selected |
| `required` | `boolean` | — | Marks the field required. Snapshotted at setup; the DOM attr stays reactive |
| `right` | `boolean` | `false` | `is-right` — CTA on the right of the file name |
| `rules` | `ValidationRule[]` | `[]` | Validation rules. Snapshotted at setup |
| `size` | `'small' \| 'normal' \| 'medium' \| 'large'` | — | `is-{size}` on the root — omitted until passed |
| `validate-on` | `ValidateOn` | `'blur'` | When validation runs |

The default slot is Cta/Name, not the CTA text. Slot props: `files`, `errors`, `isValid`, `isFocused`.

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `BuFileCta` | — | `span.file-cta`. Slot is Icon plus the inner `span.file-label` |
| `BuFileIcon` | — | `span.file-icon`. Slot is the `i` |
| `BuFileName` | — | `span.file-name`. Text from `bulma:file` context; slot overrides |

`filename` on Root is independent of `BuFileName`. Both are required for the named layout.

| Event | Payload | Description |
|-------|---------|-------------|
| `change` | `FileList \| null` | Fired when the selection changes, including on `clear()` |

| Expose | Type | Description |
|--------|------|-------------|
| `files` | `Readonly<ShallowRef<FileList \| null>>` | Current selection; `null` until a file is picked |
| `clear` | `() => void` | Reset the v0 value and the native input |

There is no `v-model`. `id`, `name`, `form`, `required` and `rules` are snapshotted at setup because `createInput` takes plain values for those options.

## Accessibility

The native input is visually hidden. The `<label class="file-label">` is the hit target and the accessible name comes from the CTA text inside the label. The hidden input is still in the tab order — Bulma hides it with CSS, it is not `inert` — so a keyboard user lands on "Choose a file…" and the file picker opens on activation.

### Naming

The inner `span.file-label` is the name. `placeholder` names the empty `.file-name` span, not the control. Pass CTA text that says what file you want (`Upload resume`, `Choose image`).

### Hidden input

Do not add `aria-hidden` on the input to "clean up" the tree. It is the actual widget. The CTA spans are presentational siblings inside the label.

### Validation

`aria-invalid` when `isValid === false`, and `is-danger` on the root `.file`. A sibling `BuHelp validation` is not wired unless you wrap the field in an ambient `Input.Root` — `createInput` here is not that context.

> [!NOTE]
> `.file-label` is used twice in the tree, on the outer `<label>` and the inner CTA `<span>`. That collision is Bulma's. Do not "fix" it in userland; the stylesheet selects on both.
