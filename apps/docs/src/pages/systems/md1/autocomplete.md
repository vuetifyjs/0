---
title: Md1Autocomplete - Material Design 1 Autocomplete for Vue
meta:
- name: description
  content: The Material Design 1 auto-complete text field, with suggestions in a menu under the field or completed in-line, free text or a strict choice, and contact chips for several values. Built on Vuetify0's Combobox.
- name: keywords
  content: md1 autocomplete, material design 1 autocomplete, inline autocomplete, contact chips, vue autocomplete, vuetify0 combobox, paper md1
features:
  category: Component
  label: 'C: Md1Autocomplete'
  level: 2
  renderless: false
  group: forms
  order: 6
related:
  - /systems/md1
  - /systems/md1/text-field
  - /systems/md1/chip
  - /systems/md1/menu
  - /components/forms/combobox
---

# Md1Autocomplete

<DocsPageFeatures :frontmatter />

The Material Design 1 auto-complete text field. Suggestions refresh with each keystroke, either in a menu under the field or completed in-line to the right of the cursor.

<DocsMd1Reference
  href="https://m1.material.io/components/text-fields.html"
  title="Text fields"
/>

> [!NOTE]
> From the auto-complete section of the text field page, with the menu sheet the suggestions sit on.

## Usage

`Md1Autocomplete` is a compound: the root is a text field with every `Md1TextField` text prop, and its `Md1Autocomplete.Item` children are the suggestions. `v-model` holds the chosen value, or an array of values under `multiple`.

::: ds-example
/systems/md1/autocomplete/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1Autocomplete } from '@paper/md1'
</script>

<template>
  <Md1Autocomplete>
    <Md1Autocomplete.Item />

    <Md1Autocomplete.Empty />
  </Md1Autocomplete>
</template>
```

## Composed on Vuetify0

`Md1Autocomplete` renders v0's [Combobox](/components/forms/combobox) compound: `Combobox.Root` owns the selection, the query and the open state; `Combobox.Activator` is the field, which anchors the list; `Combobox.Control` is the `<input role="combobox">`; `Combobox.Content` is the `listbox` in a manual popover; `Combobox.Description` and `Combobox.Error` carry the helper and the error. Each `Md1Autocomplete.Item` is a `Combobox.Item` and `Md1Autocomplete.Empty` is `Combobox.Empty`, so filtering, the virtual highlight, `aria-activedescendant`, commit on blur and click-outside dismissal are v0's.

The field draws with [Md1TextField](/systems/md1/text-field)'s anatomy classes (`md1-text-field`, `__field`, `__label`, `__input`, `__line`, `__details` and the rest) and the same `data-focused`, `data-dirty`, `data-state`, `data-box`, `data-dense`, `data-full-width` and `data-solo` hooks, so the floating label, the accent line, the error state and every variant look exactly like a text field. The root adds `data-open` while the list shows and `data-inline` for in-line completion; the list carries `data-empty` while nothing matches; each row carries v0's `data-highlighted` and `data-selected`.

Under `multiple` each value is a [Md1Chip](/systems/md1/chip) in its `contact` form inside the field, ahead of the input. The clear glyph is a v0 [Button](/components/actions/button) with a [Md1Ripple](/systems/md1/ripple), and every row hosts an `Md1Ripple` as its first child.

## Examples

::: ds-example
/systems/md1/autocomplete/basic

### Suggestions under the field

The guidelines' first auto-complete rule: "suggest input as it's typed (refreshing suggestions with each keystroke)". Focus opens the list under the field; each keystroke narrows it to the suggestions that contain the typed text. The arrow keys move a highlight through the rows, Enter chooses the highlighted one, and a press on a row chooses it and keeps the caret in the input.

The list is the menu sheet: 8 dp of elevation (6 dp where the pointer is a mouse, the elevation page's desktop rule), 2 dp corners,[^radius] the surface colour, and 8 dp above the first row and below the last. It is at least as wide as the field. Rows are 48 dp with Subheading text 16 dp from the edges; the highlighted row takes Vuetify 1.5's list hover, 4% black (8% white on the dark theme),[^highlight] and the chosen one the 12% focus shade.

Without `strict`, Enter or leaving the field with text that matches no suggestion keeps that text as the value. Use this form where the suggestions help but do not limit the answer.
:::

::: ds-example
/systems/md1/autocomplete/strict

### Strict choice

`strict` limits the value to the suggestions: text that matches none is discarded on Enter, Tab or blur, and only an exact match or a chosen row is kept. The input reports `aria-autocomplete="both"`.

`Md1Autocomplete.Empty` is the row shown while nothing matches. Its default copy is "No results" (`Md1.noResults`); the slot receives `query` for a message of your own. The row is information, not a choice, so it sits at the secondary ink and has no target. Without an `Empty` part, a query nothing matches draws no sheet at all rather than an empty one.
:::

::: ds-example
/systems/md1/autocomplete/multiple

### Several values as contact chips

`multiple` keeps the list open after each choice and renders every value as a contact chip inside the field, the chips page's "To" field: 32 dp tall, the name at 14 sp, growing to 40 dp while focused. Each chip carries its delete glyph; the Delete key on a focused chip removes it, and Backspace in an empty input moves to the last chip so a second Backspace removes it. Focus returns to the input after a removal.

Without `strict`, Enter on text that matches no suggestion adds it as a chip of its own, the way an address typed in full joins the "To" field. Add `strict` when only listed values may be chosen.
:::

::: ds-example
/systems/md1/autocomplete/icons

### Rows with icons

`icon` on an `Item` draws a 24 dp glyph 16 dp from the start edge at 54% ink (38% when the row is disabled). One iconed row moves every row's text to the 72 dp keyline (80 dp from 600 px), the list rule the menus page measures, so iconed and plain rows still share one text edge.

Use it to tell kinds of suggestion apart, here a saved place and recent searches above plain matches. The glyph is decoration; the row's accessible name is its text.
:::

::: ds-example
/systems/md1/autocomplete/inline

### In-line completion

`inline` is the 2016 page's in-line auto-complete: no menu opens, and the first suggestion that starts with the typed text completes it to the right of the cursor. The text-fields page sets the rule: "autocompleted text is displayed to the right of the cursor, using the same font size and color as placeholder text", 42% black on the light theme and 50% white on the dark one, while the typed text keeps its full ink. "Pressing the return button accepts the current autocomplete suggestion."

The suggestion is drawn for sighted users only; the input reports `aria-autocomplete="inline"` and `aria-expanded="false"`, and the accepted value is announced as the input's new text.
:::

::: ds-example
/systems/md1/autocomplete/display-value

### Values that are not text

`displayValue` maps a value to its text, so suggestions can be objects: the rows, the input after a choice and each chip under `multiple` show the mapped text, while `v-model` holds the object itself. Matching as the user types runs against the values v0 holds; for object values pair `displayValue` with `strict` so free text never stands in for an object.
:::

::: ds-example
/systems/md1/autocomplete/box

### Text field box

Every `Md1TextField` variant applies to the field. `box` is the 56 dp filled rectangle with 4 dp corners at 6% black (10% white on the dark theme), with a ripple on press; `solo`, `fullWidth`, `icon`, `prefix`, `suffix`, `helper` and `clearable` behave as they do on the text field page.
:::

::: ds-example
/systems/md1/autocomplete/dense

### Dense

`dense` condenses the field to 13 sp text with halved spacings, and the list follows: 40 dp rows at 14 sp, the dense list tile and the menus page's dense type size. Use it in crowded forms laid out for mouse and keyboard.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1Autocomplete.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | | The visible label: 16 sp at rest, 12 sp floating. Every field needs one; a field without `label` or `aria-label` warns in development |
| `heading` | `boolean` | `false` | The label became a heading elsewhere: hidden visually, still the accessible name |
| `helper` | `string` | | Helper text 8 dp under the line. An error replaces it |
| `placeholder` | `string` | | Hint text, shown once the label floats (always without a visible label) |
| `prefix` | `string` | | Fixed text before the input, shown when focused or filled |
| `suffix` | `string` | | Fixed text after the input, shown when focused or filled |
| `required` | `boolean` | `false` | Asterisk after the label and `aria-required` on the input |
| `optional` | `boolean` | `false` | "(optional)" after the label |
| `icon` | `Md1IconName` | | The 24 dp icon signifier, 16 dp before the field |
| `clearable` | `boolean` | `false` | The clear button, enabled only with text or a value; empties the query and the value |
| `box` | `boolean` | `false` | The 56 dp filled box with 4 dp corners (44 dp dense) |
| `dense` | `boolean` | `false` | 13 sp text, halved spacings, 40 dp suggestion rows |
| `fullWidth` | `boolean` | `false` | Spans the container: 56 dp (48 dp dense), the divider as its line |
| `solo` | `boolean` | `false` | The raised 48 dp sheet with no line and no visible label, 2 dp (0 dp under a fine pointer) |
| `scrolled` | `boolean` | `false` | A solo field over scrolled content: 3 dp (1 dp under a fine pointer) |
| `strict` | `boolean` | `false` | Only suggestions are accepted; unmatched text is discarded on confirm |
| `multiple` | `boolean` | `false` | `v-model` is an array; values render as contact chips in the field and the list stays open after a choice |
| `inline` | `boolean` | `false` | In-line completion: the first matching suggestion completes the typed text at the placeholder colour, Enter accepts it, no menu opens |
| `displayValue` | `(value: unknown) => string` | `String(value)` | The text for a value, in the rows, the input and the chips |
| `disabled` | `boolean` | `false` | Out of the tab order; dotted line, 38% ink, chips inert |
| `error` | `boolean` | `false` | Forces the error state |
| `errorMessages` | `string \| string[]` | | Messages shown under the line in place of the helper |
| `id` | `string` | auto | The root id; the input is `${id}-input` and the label points at it |
| `name` | `string` | | Form field name; v0 renders one hidden input per value |
| `namespace` | `string` | `'v0:combobox'` | The context key `Combobox.Root` provides to its parts; the parts inherit it from the root. Leave it unset unless a surrounding v0 `Combobox` must not collide with this one |

Events: `update:model-value`. The default slot holds the `Item` and `Empty` parts; there are no named slots. `class` and `style` go on the root; every other attribute lands on the input.

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `Md1Autocomplete.Item` | `value: unknown`, `disabled?: boolean`, `icon?: Md1IconName` | One suggestion, a 48 dp row (40 dp dense); the slot is its text and defaults to the root's `displayValue` of `value`. `icon` draws a glyph at 16 dp and moves every row's text to the 72 dp keyline. Outside an `Md1Autocomplete` it warns in development and renders nothing |
| `Md1Autocomplete.Empty` | none | The row shown while no suggestion matches; slot props `{ query }`, default copy `Md1.noResults` ("No results"). Outside an `Md1Autocomplete` it warns in development and renders nothing |

## Accessibility

The input is a `combobox` with `aria-expanded`, `aria-controls` pointing at the `listbox` and `aria-autocomplete` (`list`, `both` under `strict`, `inline` under `inline`), named by the visible `<label for>`. Focus stays in the input while the list is open; the highlighted row is announced through `aria-activedescendant`, and each row carries `aria-selected` and `aria-disabled`. The listbox is `aria-multiselectable` under `multiple`. The helper is linked with `aria-describedby`, the error with `aria-errormessage` and a polite live region.

### Keyboard

| Key | Behavior |
|-----|----------|
| ArrowDown, ArrowUp | Opens the list, then moves the highlight through the enabled rows |
| Enter | Chooses the highlighted row; with none, commits the typed text (discarded under `strict`). Under `inline`, accepts the in-line suggestion |
| Tab | Chooses the highlighted row or commits the typed text, then moves on |
| Escape | Closes the list and keeps the value |
| Home, End | Leaves the highlight for the caret |
| Backspace | In an empty input under `multiple`, moves to the last chip |
| Delete, Backspace | On a focused chip, removes it |

[^radius]: Vuetify 1.5.24, stylus/components/_menus.styl:21. The menu sheet's 2 px radius; the menus page states none.

[^highlight]: Vuetify 1.5.24, stylus/components/_lists.styl:20-23 and stylus/settings/_theme.styl:52,146. A highlighted tile takes `list-tile.hover`, black 4% or white 8%.
