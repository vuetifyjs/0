---
title: TimePicker - Segmented hour, minute, and second fields
meta:
- name: description
  content: Headless hour, minute, and optional second spinbuttons. 12-hour mode adds AM and PM. The submitted value is a 24-hour time string.
- name: keywords
  content: time picker, spinbutton, hour, minute, second, meridiem, Vue 3, headless, accessible
features:
  category: Component
  label: 'C: TimePicker'
  github: /components/TimePicker/
  renderless: false
  level: 2
related:
  - /composables/forms/create-time-picker
  - /components/forms/number-field
---

# TimePicker

<DocsPageFeatures :frontmatter />

Edit a time as hour, minute, and optional second fields. The control stores a 24-hour string, and 12-hour mode adds an AM/PM field.

## Usage

Each field is a spinbutton, moved from the keyboard with the arrow, Page, Home, and End keys. The model stays null until the hour and the minute are both set.

::: gn-example
/components/time-picker/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { TimePicker } from '@vuetify/v0'
</script>

<template>
  <TimePicker.Root>
    <TimePicker.Hour />

    <TimePicker.Minute />

    <TimePicker.Second />

    <TimePicker.Period />

    <TimePicker.HiddenInput />
  </TimePicker.Root>
</template>
```

## Architecture

Root owns the time value. Hour, Minute, Second, and Period each read and edit one field of it. Second renders only when `seconds` is set. Period renders only when `hour-cycle` is `h12`. HiddenInput carries the value into a form, and Root renders it when `name` is set.

```mermaid "TimePicker Architecture"
flowchart TD
  Picker["createTimePicker"]
  Root["TimePicker.Root"]:::primary
  Hour["TimePicker.Hour"]
  Minute["TimePicker.Minute"]
  Second["TimePicker.Second"]
  Period["TimePicker.Period"]
  HiddenInput["TimePicker.HiddenInput"]

  Picker --> Root
  Root --> Hour
  Root --> Minute
  Root --> Second
  Root --> Period
  Root --> HiddenInput
```

## Examples

::: gn-example
/components/time-picker/office.ts 1
/components/time-picker/office.vue 2

### Office hours

A 12-hour picker bounded to a workday. The hour field shows 1 through 12, and the period field shows AM or PM. The model is still a 24-hour string, so 9 AM is `09:00` and 5 PM is `17:00`.

`min` and `max` clamp a complete value. The bounds live in `office.ts` as `09:00` and `17:00`. Step the hour up from 5 PM and the next hour is `18:00`, then the upper bound pulls the value back to `17:00`. Switch 9 AM to PM and the stored hour shifts by 12, from `09:00` to `21:00`, and the same bound pulls it back to `17:00`. The hour stays inside its half of the day, so ArrowUp on 11 AM wraps to 12 AM, which is `00:00`, and the lower bound pulls that up to `09:00`.

Seconds stay off, so the second field is not in the tree. Focus a field and use the keys listed under [Keyboard Navigation](#keyboard-navigation). On the period field, either arrow toggles AM and PM.

| File | Role |
|------|------|
| `office.ts` | Open and close bounds |
| `office.vue` | 12-hour picker and the stored value |
:::

## Recipes

### Quarter hours

`minute-step` keeps the minute on the multiples of the step. With a step of 15, ArrowUp moves 00, 15, 30, 45 and wraps to 00, and ArrowDown runs the other way. A value that arrives off the grid moves to the nearest multiple without wrapping and is written back, so `09:50` becomes `09:45`. `hour-step` and `second-step` work the same way.

```vue
<template>
  <TimePicker.Root v-model="value" :minute-step="15">
    <TimePicker.Hour v-slot="{ text }">{{ text }}</TimePicker.Hour>
    <TimePicker.Minute v-slot="{ text }">{{ text }}</TimePicker.Minute>
  </TimePicker.Root>
</template>
```

### Submit with a form

Set `name` and Root renders `TimePicker.HiddenInput` with the 24-hour value. You do not place it yourself. The input submits an empty string while the value is incomplete, and it is left out of the submission while the picker is disabled.

```vue
<template>
  <form>
    <TimePicker.Root v-model="value" name="alarm">
      <TimePicker.Hour v-slot="{ text }">{{ text }}</TimePicker.Hour>
      <TimePicker.Minute v-slot="{ text }">{{ text }}</TimePicker.Minute>
    </TimePicker.Root>
  </form>
</template>
```

### Clear the value

The Root slot exposes `clear`, which empties every field and sets the model to null. It does nothing while the picker is disabled or readonly.

```vue
<template>
  <TimePicker.Root v-slot="{ clear }" v-model="value">
    <TimePicker.Hour v-slot="{ text }">{{ text }}</TimePicker.Hour>
    <TimePicker.Minute v-slot="{ text }">{{ text }}</TimePicker.Minute>

    <Button.Root @click="clear">Clear</Button.Root>
  </TimePicker.Root>
</template>
```

### Data Attributes

Style field and interaction states without slot props:

| Attribute | Values | Components |
|-----------|--------|------------|
| `data-part` | `hour`, `minute`, `second`, `period` | Hour, Minute, Second, Period |
| `data-disabled` | `true` | Root, Hour, Minute, Second, Period |
| `data-readonly` | `true` | Root, Hour, Minute, Second, Period |

## Accessibility

Root renders `role="group"` with an accessible name from the `label` prop, or from the locale catalog when `label` is omitted. Each field renders `role="spinbutton"` per the [WAI-ARIA Spinbutton pattern](https://www.w3.org/WAI/ARIA/apg/patterns/spinbutton/).

### ARIA Attributes

| Attribute | Value | Notes |
|-----------|-------|-------|
| `role` | `group` | Root |
| `role` | `spinbutton` | Hour, Minute, Second, Period |
| `aria-label` | Label text | Root takes the `label` prop or the locale string. Each field takes its locale string |
| `aria-valuenow` | Current number | Absent while the field is empty. Period is `0` for AM and `1` for PM |
| `aria-valuemin` | Lowest value the field can show | Follows the step, and in 12-hour mode the current AM or PM half. Period is `0` |
| `aria-valuemax` | Highest value the field can show | Follows the step, and in 12-hour mode the current AM or PM half. Period is `1` |
| `aria-valuetext` | Two-digit text, or `AM` / `PM` | On every field that has a value. Absent while the field is empty |
| `aria-readonly` | `true` | Fields, when Root is `readonly` |
| `aria-disabled` | `true` or `false` | Root and fields on non-button hosts. A native button uses `disabled` and omits `aria-disabled` |

With the default steps the hour runs 0–23, or 1–12 in 12-hour mode, and the minute and second run 0–59. A step narrows the range to its multiples: `minute-step="15"` gives a minute range of 0–45.

Each field is a tab stop. Disabled fields use `tabindex="-1"`. Readonly fields stay focusable.

### Keyboard Navigation

Hour, Minute, and Second:

| Key | Action |
|-----|--------|
| `ArrowUp` | Move up one interval. Wraps past the highest value |
| `ArrowDown` | Move down one interval. Wraps past the lowest value |
| `PageUp` | Move the hour up about 2 hours, or the minute or second up about 15, in whole intervals and never less than one |
| `PageDown` | Move the hour down about 2 hours, or the minute or second down about 15, in whole intervals and never less than one |
| `Home` | Set the lowest value the field can show |
| `End` | Set the highest value the field can show |
| `Backspace` / `Delete` | Clear the field. The model becomes null |

An empty field lands on its first value on any arrow or Page key. In 12-hour mode the hour field counts in display numbers, so `Home` sets 1 and `End` sets 12 with the default step.

Period:

| Key | Action |
|-----|--------|
| `ArrowUp` / `ArrowDown` | Toggle AM and PM |
| `PageUp` / `PageDown` | Toggle AM and PM |
| `Home` | Set AM |
| `End` | Set PM |

`Backspace` and `Delete` do nothing on Period. Typing digits into a field is not supported. Every key is ignored while Root is `disabled` or `readonly`.

## FAQ

::: faq

??? When does v-model get a string?

The model stays null until the hour and the minute are both set. With `seconds`, a time entered field by field also needs the second. A value that arrives as `HH:mm` while `seconds` is on reads as second 00, so `09:30` becomes `09:30:00`, and turning `seconds` on for a picker whose hour and minute are set keeps the time with second 00. Clearing any field sets the model back to null.

??? Why does 12-hour mode still store 15:00?

The stored value is always 24-hour. The hour field shows 1 through 12, and the period field shifts that hour by 12. 12 AM is 00 and 12 PM is 12.

??? What do min and max do?

They clamp a complete value into the window. An incomplete value stays null. A bound wins over the step, so the value can rest on a bound that is not a multiple of the step. Bounds use the same 24-hour form as the model, and their seconds count only when `seconds` is on.

??? What do disabled and readonly do?

Both ignore every key and `clear`, and the picker never emits while either is set. The value is shown as given, without snapping to the step or clamping to `min` and `max`. When the picker is editable again it snaps and clamps the value and emits the result. `disabled` also takes the fields out of the tab order and keeps the hidden input out of form submission. `readonly` keeps the fields focusable and sets `aria-readonly`.

??? Can I type digits into a field?

No. Fields move with the arrow, Page, Home, and End keys, and clear with Backspace or Delete. See [Keyboard Navigation](#keyboard-navigation).

:::

<DocsApi />
