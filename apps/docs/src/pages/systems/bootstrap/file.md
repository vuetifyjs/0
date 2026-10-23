---
title: BFile - Bootstrap 6 file input for Vue
meta:
- name: description
  content: Bootstrap 6 file input for Vue. A form-control with type file. The model is the selected FileList, or null. File contents are never read. Styled by your CSS.
- name: keywords
  content: bootstrap 6 file input, vue file, form-control, FileList, paper bootstrap
features:
  category: Component
  label: 'C: BFile'
  level: 2
  renderless: false
  group: forms
related:
  - /systems/bootstrap
  - /systems/bootstrap/form-control
  - /systems/bootstrap/form-label
  - /systems/bootstrap/form-field
  - /composables/forms/create-input
---

# BFile

An `<input type="file" class="form-control">`. `v-model` is the `FileList`, or `null`.

<DocsPageFeatures :frontmatter />

> [!NOTE]
> Reference: [Form control on the Bootstrap 6 preview](https://v6-dev--twbs-bootstrap.netlify.app/docs/6.0/forms/form-control/). The file input is documented on that page. Classes and visual variants. This page is Vue.

## Usage

The model updates from the native `change` event. It is the browser's `FileList`. This component does not read the bytes. `multiple` and `accept` fall through as attributes.

::: ds-example
/systems/bootstrap/file/basic
:::

### The markup Bootstrap documents

The file input uses the same `.form-control` class as a text input. `type="file"` is the whole difference.

::: code-group no-filename

```html Bootstrap collapse
<label for="formFile" class="form-label mb-2">Choose a file</label>
<input type="file" class="form-control" id="formFile">
```

```vue Vue collapse
<template>
  <BFormLabel class="mb-2" for="formFile">Choose a file</BFormLabel>
  <BFile id="formFile" v-model="files" />
</template>
```

:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { BFile } from '@paper/bootstrap'
</script>

<template>
  <BFile />
</template>
```

## Composed on v0

The `FileList` ref is held by [createInput](/composables/forms/create-input), which also tracks dirty, focus, and touched. Dirty means the list has at least one file. The component renders the input and assigns `event.target.files` on `change`. It does not open the file.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `v-model` | `FileList \| null` | `null` | The selected files, from the native change event. |
| `id` | `string` | generated | Control id. Passed through to the label's `for`. |
| `disabled` | `boolean` | `false` | Native disabled. |

## Accessibility

The host is a native file input. Name it with [BFormLabel](/systems/bootstrap/form-label) and `for`. The browser provides the button and the chosen-file announcement. This component does not emit `data-bs-toggle`.
