---
title: Md1TextField - Material Design 1 Text Field for Vue
meta:
- name: description
  content: The Material Design 1 text field with its floating label, helper and error text, counter, prefix and suffix, box, dense, multi-line, text area, full-width, solo and dropdown forms. Built on Vuetify0's Input.
- name: keywords
  content: md1 text field, material design 1 text field, floating label, text field box, dropdown field, input mask, vue text field, vuetify0 input, paper md1
features:
  category: Component
  label: 'C: Md1TextField'
  level: 2
  renderless: false
  group: forms
  order: 1
related:
  - /systems/md1
  - /systems/md1/dialog
  - /systems/md1/icon
  - /components/forms/input
  - /components/forms/select
---

# Md1TextField

<DocsPageFeatures :frontmatter />

The Material Design 1 text field. A label that floats above the input, a line that takes the accent colour on focus, and helper, error and counter text beneath it.

<DocsMd1Reference
  href="https://m1.material.io/components/text-fields.html"
  title="Text fields"
/>

> [!NOTE]
> Reference: [Text fields, Material Design 1 guidelines](https://m1.material.io/components/text-fields.html), the archived page Material Design 1 is pinned to. Anatomy, metrics, the light and dark state tables, and the formatted inputs. This page is the Vue.

## Usage

`Md1TextField` is a shell component: fixed anatomy, props for everything, and `v-model` is the text. `label` is required by the guidelines; every other part appears when its prop is set. Under `dropdown` the field becomes a compound and its `Md1TextField.Item` children fill the menu.

::: ds-example
/systems/md1/text-field/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Md1TextField } from '@paper/md1'
</script>

<template>
  <Md1TextField />

  <Md1TextField dropdown>
    <Md1TextField.Item />
  </Md1TextField>
</template>
```

## Composed on Vuetify0

`Md1TextField` renders v0's [Input](/components/forms/input) compound renderless: `Input.Root` owns the value, validation and form registration, `Input.Control` is the editable `<input>` (a `<textarea>` under `multiline` and `textarea`), and `Input.Description` and `Input.Error` carry the helper and the error. The visible label is a native `<label for>`; `label` is never passed to `Input.Root`, which would repeat the name as an `aria-label`. `Input.Root` publishes `data-state`, `data-dirty`, `data-disabled` and `data-readonly`, and Material Design 1's stylesheet hangs the floating label, the line and the error colours off them. `data-focused` is Material Design 1's own: it also counts the dropdown's activator and its open menu, which `Input.Root` never sees.

The clear, visibility and voice glyphs and the picker signifier are each a v0 [Button](/components/actions/button) `Button.Root` with a [Md1Ripple](/systems/md1/ripple) as its first child and the glyph drawn through [Md1Icon](/systems/md1/icon). Under `dropdown` the field composes v0's [Select](/components/forms/select): `Select.Activator` is the readonly control with the arrow, `Select.Content` is the menu and each `Md1TextField.Item` is a `Select.Item`, so typeahead, the virtual highlight and the listbox semantics are v0's. Under `picker` the signifier opens a [Md1Dialog](/systems/md1/dialog) in its confirmation variant.

The stable classes are the field's anatomy, and `Md1Autocomplete` and `Md1SearchBar` reuse them: `md1-text-field`, `__icon`, `__picker`, `__body`, `__field`, `__label`, `__required`, `__optional`, `__prefix`, `__input`, `__suffix`, `__button`, `__clear`, `__visibility`, `__voice`, `__dropdown`, `__value`, `__placeholder`, `__line`, `__list`, `__item`, `__details`, `__helper`, `__error`, `__counter` and `__dialog`.

## Examples

::: ds-example
/systems/md1/text-field/placeholder

### Placeholder and helper text

`placeholder` is hint text inside the field: it appears once the label floats, so focus a field to read it, and typing replaces it. Helper text under the line supports it, the guidelines' "helper text can support placeholder text in guiding the user": the placeholder shows the shape of an answer, the helper the rule it must meet. The placeholder is 42% black (50% white on the dark theme); helper text is 12 sp at the secondary ink.
:::

::: ds-example
/systems/md1/text-field/validation

### Validation and errors

Errors show when focus leaves the field, the guidelines' "when the user shifts focus to another element", which is v0's default `validateOn="blur"`. Until the error is fixed it replaces the helper text, and the line and the label turn to Red A400 (`--md1-error`, `#FF1744`) with the line thickened to 2 dp. The message itself is Red A400 at 87% on the light theme and 100% on the dark one, the state tables' error text. Pass `validateOn="input"` to check on every keystroke instead, or `'blur eager'` to check on blur first and on every keystroke after the first error.

`rules` takes v0's rule functions, rule aliases or a Standard Schema; a rule returns `true` or the message to show. Start each message with "Error:" or let an error icon carry it, and say how to fix the problem rather than only what is wrong. `required` adds the asterisk the guidelines put after the label, sets `aria-required`, and registers v0's presence rule. When most fields in a form are required, mark the few optional ones with `optional` instead, which appends "(optional)" to the label.

Inside a v0 `Form` every field registers itself, so the form's submit validates them all and reports the aggregate validity. The error text sits in a polite live region and is tied to the input with `aria-errormessage`, and the input carries `aria-invalid` while the field is in error.
:::

::: ds-example
/systems/md1/text-field/error-icon

### Error icon

`error-icon` precedes the error message with the `error-outline` glyph, the guidelines' alternative to the word "Error:": either one keeps the error state distinct for readers who cannot tell red from the line's resting grey. The glyph is 12 dp, level with the start of the line, 8 dp before the message, and takes the message's red. It is decorative; the message is still the live-region text. Here the message tracks the value, so finish the address to clear it.
:::

::: ds-example
/systems/md1/text-field/themes

### States on light and dark

The same five fields on each theme: empty, filled, in error, disabled and a text area. On the dark theme the line and the label are 70% white, the input 100% white and the placeholder 50% white; hover thickens the line to 2 dp at 100% white, and focus draws it in the accent. A disabled field keeps its value but drops it to the disabled ink, 38% black or 50% white, over a 1 dp dotted line, and leaves the tab order. Hover, press and focus the fields on either side to compare the states.
:::

::: ds-example
/systems/md1/text-field/counter

### Character and word counters

`counter` puts "used / limit" at the end of the details row in the 12 sp Caption style: a number is a character limit, `{ words: n }` a word limit that counts whitespace-separated words. Over the limit the counter, the line and the label take the error colour, the state the errors page draws with a red line; the field reports `data-state="invalid"` and `aria-invalid`, but no message replaces the helper, because the count already says what is wrong.

The guidelines suggest hiding a counter until the user approaches the limit. That is a presentation choice the app makes by binding `counter` conditionally; the field always shows the counter it is given.
:::

::: ds-example
/systems/md1/text-field/prefix-suffix

### Prefix and suffix

`prefix` sits before the input and `suffix` after it, for units and pre-filled text: a currency sign, a weight, an email domain. Both are drawn at the input size in the secondary ink and stay out of the value. The guidelines show formatting only "when the field is pressed, focused, or filled", so both are hidden while the label rests and appear as it floats.

The suffix does not become part of `v-model`. A field that collects the local part of an address returns only what the user typed; join the domain in the app when the value is used.
:::

::: ds-example
/systems/md1/text-field/mask

### Grouped characters

`mask` formats input into groups as it is typed, the guidelines' phone number with hyphens added "in appropriate places". In the pattern `#` takes a digit, `A` a letter and `*` either; every other character is a separator the field inserts on its own. When a group fills, the following separators are written at once and the caret jumps past them, so "once the first special character is reached, the cursor automatically jumps to the next group".

`v-model` holds only the characters in the slots (`5551234567`, not `(555) 123-4567`), and `rules` receive that unformatted value too. A value set from outside is formatted for display. Characters beyond the last slot are dropped, and deleting does not re-insert the separator it just removed, so Backspace walks back across a group boundary normally.
:::

::: ds-example
/systems/md1/text-field/password

### Password

`type="password"` disguises the text, which the browser renders as the midline ellipses the guidelines describe, and adds the visibility toggle at the end of the field. The glyph reads 38% while the text is hidden and 54% while it shows, the 2016 page's two opacities, and the toggle's accessible name changes between "Show password" and "Hide password" so the current state is announced without a pressed state.

Pressing the toggle keeps focus and the caret in the input. Set `autocomplete` to `current-password` or `new-password` on the field; every attribute other than `class` and `style` lands on the input itself.
:::

::: ds-example
/systems/md1/text-field/icons

### Icon signifier, clear and voice

`icon` draws a 24 dp signifier 16 dp before the field, level with the input text, at the 54% active icon ink. `clearable` adds the clear button at the end of the field, enabled only while it has characters; it empties the value, emits `clear` and leaves the caret in the input. `voice` adds the microphone, which the guidelines keep always enabled; it emits `voice` and the speech capture is the app's.

Each trailing glyph is 24 dp inside a 48 dp touch target, 8 dp apart and 8 dp above the line, with the 12% focus overlay as a 48 dp disc for keyboard focus and an unbounded ripple on press.
:::

::: ds-example
/systems/md1/text-field/box

### Text field box

`box` encloses the label and input in a 56 dp rectangular fill with 4 dp corners that mask the ends of the line, 6% black on the light theme and 10% white on the dark one, with 16 dp of padding at each side. The resting label is centred in the fill and floats to 8 dp from its top; the helper row keeps the same 16 dp inset. The guidelines add the box to make a field easier to identify and scan, and give it a ripple on press.

`box` combines with `dense` for the 44 dp box.
:::

::: ds-example
/systems/md1/text-field/box-areas

### Multi-line boxes and text box areas

`box` combines with `multiline` and `textarea`. A multi-line box grows downward as the text wraps, the listing form's description; a text box area keeps a fixed height and scrolls once the text passes its last line, the message box. Both keep the box's fill, its 4 dp top corners and the line along the bottom, and the label stays 8 dp from the top of the fill as the content grows.
:::

::: ds-example
/systems/md1/text-field/dense

### Dense

For forms with many or crowded fields, `dense` shortens the field: 13 sp text, 8 dp above the label, 4 dp between the label and the input, and 4 dp between the line and the helper, half the standard spacing. Glyphs drop to the 20 dp dense size.

The guidelines tie the dense field to mouse-and-keyboard layouts, so Material Design 1 makes it an explicit prop rather than switching on the pointer type:[^dense] the same app can hold a dense settings form beside a standard sign-in form.
:::

::: ds-example
/systems/md1/text-field/multiline

### Multi-line

`multiline` wraps text onto new lines and grows the field downward, "shifting screen elements downward" so the user sees everything they typed at once. The field starts one line tall; the trailing buttons stay level with the first line as it grows. Use it where an answer may run past one line but rarely to a paragraph.
:::

::: ds-example
/systems/md1/text-field/textarea

### Text area

`textarea` is the taller field for long input: a fixed height of five 20 px lines with 8 dp of padding,[^five] scrolling vertically once the text overflows. The guidelines give it "a visible border, using the same color and thickness as the input line": 1 dp at 42% black (70% white), turning 2 dp in the accent on focus and in red on error. The label stays floated above the border, so the placeholder shows from the start.
:::

::: ds-example
/systems/md1/text-field/full-width

### Full width

`fullWidth` spans its container for in-depth entry such as composing a message: 56 dp tall with the text 20 dp from the top and bottom, 48 dp with `dense`. Fields are separated by the 1 dp divider rather than an input line, and the label behaves as a hint that clears once the field is in use.

The second sheet is the same message with `dense`: 48 dp rows with 16 dp above and below the text, for denser desktop layouts.
:::

::: ds-example
/systems/md1/text-field/solo

### Solo

`solo` is the guidelines' field "for a single action such as search": the text field elevated on its own 2 dp sheet, with no input line and no floating label, its icons placed inside. The sheet is 48 dp tall with 2 dp corners, and rises to 3 dp when `scrolled` marks the content beneath it as scrolled, the quick entry and search bar rows of the elevation page. Under a fine pointer both sit 2 dp lower, 0 dp and 1 dp, the desktop rule every resting elevation follows and the values `Md1SearchBar` draws. The label is kept for assistive technology and hidden visually, so the placeholder carries the visible prompt.

`Md1SearchBar` composes this field for the persistent search pattern.
:::

::: ds-example
/systems/md1/text-field/heading

### Labels as headings

When a text field is the primary action on a screen, its label can become the screen's heading. `heading` hides the field's own label visually, keeps it as the accessible name, and shows the placeholder while the field is idle; typing replaces it. The first screen is an onboarding or query step with the line field, the second the same step with a text field box, and the third a dialog whose title asks the question.
:::

::: ds-example
/systems/md1/text-field/dropdown

### Dropdown

`dropdown` makes the field a select, the guidelines' "Nested menus & pickers": the control is readonly, the `arrow-drop-down` glyph sits at its end in a 24 x 24 dp container 8 dp above the line, and pressing the field or the arrow opens a menu of the `Md1TextField.Item` children on an 8 dp sheet at least as wide as the field. Choosing an option writes its `value` to `v-model`, closes the menu and floats the label; the field shows the option's text. Once an option is chosen the menu opens over the field with that option on the field's value, its text lined up with the value's text, the menus page's simple-menu rule that it extends to selects;[^align] near a screen edge the sheet shifts to stay on screen, and a long list opens scrolled to the option. With nothing chosen it opens below the field.[^below]

The keyboard model is v0's Select: Space, Enter and the arrow keys open the menu, the arrows move the highlight, Enter or Space chooses, Escape closes, and typing jumps to the first option that starts with the typed letters. Rows are 48 dp with the text 16 dp from the edges; the highlighted row takes the menu's list hover, 4% black (8% white on the dark theme),[^highlight] and the chosen one the 12% focus overlay.
:::

::: ds-example
/systems/md1/text-field/picker

### Pickers

`picker="date"` or `picker="time"` turns the icon signifier into a button (the `event` or `schedule` glyph) that opens an `Md1Dialog` in its confirmation variant, the guidelines' "a calendar icon may be tapped to reveal a date picker". The default slot is the picker inside the dialog; its slot props are `value`, the value the dialog holds, and `commit`, which holds a new one. OK writes the held value to `v-model` and closes; Cancel discards it. The field takes the date in the long form the data-formats page prefers, so the example keeps the picker's ISO date beside it. A text field box takes a picker the same way; the signifier stays outside the box.
:::

## Props

<!-- Hand-authored, temporarily. These pages predate DocsApi extraction for
     @paper/* packages; once the generator covers the design systems this table
     is replaced by <DocsApi />. Keep it in sync with Md1TextField.vue until then. -->

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | | The visible label: 16 sp at rest, 12 sp floating, in the accent at 87% (100% dark) while focused. Every field needs one; a field without `label` or `aria-label` warns in development |
| `heading` | `boolean` | `false` | The label became a heading elsewhere: hidden visually, still the accessible name; the placeholder shows at rest |
| `helper` | `string` | | Helper text 8 dp under the line, 12 sp at the secondary ink. An error replaces it |
| `placeholder` | `string` | | Hint text at the page's 42% black (50% white), shown once the label floats (always without a visible label) |
| `prefix` | `string` | | Fixed text before the input, shown when focused or filled |
| `suffix` | `string` | | Fixed text after the input, shown when focused or filled |
| `counter` | `number \| { words: number }` | | "used / limit" at the end of the details row; over the limit the field is in error |
| `required` | `boolean` | `false` | Asterisk after the label, `aria-required`, and v0's presence rule |
| `optional` | `boolean` | `false` | "(optional)" after the label |
| `icon` | `Md1IconName` | | The 24 dp icon signifier, 16 dp before the field |
| `clearable` | `boolean` | `false` | The clear button, enabled only with text; emits `clear` |
| `voice` | `boolean` | `false` | The microphone button, always enabled; emits `voice` |
| `type` | `string` | `'text'` | The input type; `password` adds the visibility toggle |
| `box` | `boolean` | `false` | The 56 dp filled box with 4 dp corners (44 dp dense) |
| `dense` | `boolean` | `false` | 13 sp text and halved spacings |
| `multiline` | `boolean` | `false` | Wraps and grows downward |
| `textarea` | `boolean` | `false` | Five lines tall with a 1 dp border; scrolls |
| `fullWidth` | `boolean` | `false` | Spans the container: 56 dp (48 dp dense), the divider as its line |
| `solo` | `boolean` | `false` | The raised 48 dp sheet with no line and no visible label, 2 dp (0 dp under a fine pointer) |
| `scrolled` | `boolean` | `false` | A solo field over scrolled content: 3 dp (1 dp under a fine pointer) |
| `dropdown` | `boolean` | `false` | A readonly select whose `Md1TextField.Item` children fill the menu |
| `picker` | `'date' \| 'time'` | | The signifier opens a date or time picker in a confirmation dialog |
| `mask` | `string` | | Grouped characters: `#` digit, `A` letter, `*` either; `v-model` stays unformatted |
| `disabled` | `boolean` | `false` | Out of the tab order; dotted line, 38% ink |
| `readonly` | `boolean` | `false` | Shows the value without allowing edits |
| `rules` | `(FormValidationRule \| RuleAlias \| StandardSchemaV1)[]` | `[]` | v0 validation rules, given the unformatted value under `mask` |
| `validateOn` | `ValidateOn` | `'blur'` | When rules run: `'blur'`, `'input'` or `'submit'`, with `lazy` or `eager` |
| `error` | `boolean` | `false` | Forces the error state |
| `errorMessages` | `string \| string[]` | | Messages shown regardless of the rules |
| `errorIcon` | `boolean` | `false` | Precedes the error message with the 12 dp `error-outline` glyph, 8 dp before the text |
| `id` | `string` | auto | The input id the label points at |
| `name` | `string` | | Form field name |
| `namespace` | `string` | | The context key `Input.Root` provides to its parts. Leave it unset unless a surrounding v0 `Input` must not collide with this one |

Events: `update:model-value`, `clear`, `voice`. The default slot holds the `Md1TextField.Item` children under `dropdown` and the picker under `picker`; there are no named slots. `class` and `style` go on the root; every other attribute lands on the input.

### Parts

| Part | Props | Notes |
|------|-------|-------|
| `Md1TextField.Item` | `value: string`, `disabled?: boolean` | One option of a dropdown field, a 48 dp row; the slot is its text and defaults to `value`. Outside a dropdown field it warns in development and renders nothing |

## Accessibility

The editable element is a native `<input>` or `<textarea>`, so the textbox role, typing, selection and the keyboard come from the platform. The visible `<label for>` names it; the helper is linked with `aria-describedby`, the error with `aria-errormessage` and a polite live region, and the input carries `aria-invalid` while the field is in error and `aria-required` when `required` is set. The asterisk is hidden from assistive technology because `aria-required` already says it.

### Keyboard

| Key | Behavior |
|-----|----------|
| Tab, Shift+Tab | Moves through the input and then each enabled trailing button. A disabled clear button is skipped |
| Enter, Space | On a trailing button: clears, toggles visibility, or presses the microphone |
| Space, Enter, ArrowDown, ArrowUp | On a closed dropdown: opens the menu |
| ArrowDown, ArrowUp, Home, End | On an open dropdown: moves the highlight |
| Enter, Space | On an open dropdown: chooses the highlighted option and closes |
| Escape, Tab | On an open dropdown: closes the menu |
| Letters | On a dropdown: jumps to the first option starting with the typed text |

### Buttons

Every trailing glyph is a native button with an accessible name from the locale (`Md1.clear`, `Md1.showPassword`, `Md1.hidePassword`, `Md1.voice`, `Md1.chooseDate`, `Md1.chooseTime`, with English fallbacks). Pressing one with the pointer keeps focus in the input, so validation does not run in the middle of a clear.

### Dropdown

The dropdown's control is a `combobox` with `aria-expanded`, `aria-controls` pointing at the `listbox`, and `aria-labelledby` pointing at the visible label. Focus stays on the control while the menu is open; the highlighted option is announced through `aria-activedescendant`, and each option carries `aria-selected` and `aria-disabled`.

[^dense]: Our call: the page names a dense field, not a device switch, so one app can mix both.

[^five]: Our call: the page gives the text area no height; five Body 1 lines hold a short paragraph.

[^align]: Vuetify 1.5.24, components/VMenu/mixins/menu-position.js:24-28. `calcLeftAuto` offsets the sheet so its text lines up with the activator's.

[^below]: Our call: the over-the-field rule is written for a chosen option, so an empty select keeps the anchored placement.

[^highlight]: Vuetify 1.5.24, stylus/components/_lists.styl:20-23 and stylus/settings/_theme.styl:52,146. A highlighted tile takes `list-tile.hover`, black 4% or white 8%.
