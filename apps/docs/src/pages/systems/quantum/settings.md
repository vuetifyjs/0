---
title: Settings - Quantum Material Design 1 Settings Pattern for Vue
meta:
- name: description
  content: The Material Design 1 settings pattern in Quantum. Settings lists with switches, checkboxes and status text, grouped by subheaders and dividers, with choice dialogs and subscreens.
- name: keywords
  content: quantum settings, material design 1 settings, settings screen, settings list, switch list, preferences pattern, vue settings, paper quantum
features:
  category: Guide
  label: 'Settings'
  level: 2
  renderless: false
  group: 'patterns'
  order: 7
related:
  - /systems/quantum
  - /systems/quantum/list
  - /systems/quantum/switch
  - /systems/quantum/subheader
  - /systems/quantum/dialog
---

# Settings

<DocsPageFeatures :frontmatter />

A settings screen is a list of the preferences that shape how an app behaves, each with its current value in view. Quantum has no settings component; the screen is a `QuList` with controls in its action column, `QuSubheader` and `QuDivider` for grouping, and `QuDialog` for the settings that take a choice.

> [!NOTE]
> Reference: [Settings, Material Design 1 guidelines](http://web.archive.org/web/20181225002157/https://material.io/archive/guidelines/patterns/settings.html), the archived page Quantum is pinned to, with the [navigation drawer](http://web.archive.org/web/20181225002300/https://material.io/archive/guidelines/patterns/navigation-drawer.html) and [help and feedback](http://web.archive.org/web/20181225002233/https://material.io/archive/guidelines/patterns/help-feedback.html) pages for placement. Placement, grouping, labels and status text. This page is the Vue.

## Usage

Each setting is one list row: the label as the primary line, the current status as the secondary line, and the control in `QuList.Action`. A switch or checkbox setting shows "On" or "Off" under its label, so the value reads without looking at the control.

::: ds-example
/systems/quantum/settings/basic
:::

## Building blocks

| Part of the screen | Quantum surface | Guideline |
|--------------------|-----------------|-----------|
| Setting row | `QuList.Item` with `:lines="2"` | Label plus optional single-line secondary text; labels wrap when needed |
| Label | `QuList.Primary` | Brief and meaningful; sentence case; no generic verbs (Set, Change, Manage) |
| Status | `QuList.Secondary` | The setting's current state, or for a switch or checkbox a short description that starts with a verb |
| On and off control | `QuSwitch` or `QuCheckbox` in `QuList.Action` | Switches and checkboxes are the two list controls the settings page names |
| One-of-many value | `QuDialog variant="confirmation"` holding a `QuRadio.Group` | The choice opens from the row; the row's status text shows the chosen value |
| Section title | `QuSubheader` | Optional; specific, never "Other" or "Miscellaneous" |
| Group boundary | `QuDivider` | Between groups of related settings, never between every row |
| Subscreen | A second screen whose `QuToolbar.Title` repeats the row's label | For 15 or more related settings |

Settings save preferences, are visited rarely, and matter to most users or are essential to a few. Frequently used controls belong on a toolbar instead; version and licence information belongs on a Help screen; account management belongs in the main flow, such as the navigation drawer.

Defaults should be the choice most users would make: neutral, low risk, light on battery and data, and interrupting only when it matters.

## Placement

Every setting is reached through one destination labelled "Settings". The guidelines reject synonyms such as "Options" or "Preferences".

| App shape | Where "Settings" goes |
|-----------|----------------------|
| Has a navigation drawer | In the drawer, below every other item except Help & feedback |
| No navigation | In the toolbar overflow menu, below every other item except Help & feedback |

The help and feedback page adds the tail of both lists: "Send feedback" directly above "Help", "Help" last, unless "Sign out" is present, which is always last.

## Examples

::: ds-example
/systems/quantum/settings/groups

### Groups and alignment

Show the most important or most used settings first, then group the rest. A full-bleed `QuDivider` closes a group of several related settings; the guidelines warn against a divider between every row. A group may open with a `QuSubheader` section title. Keep titles specific: "Wireless and networks", not "Other". The subheader here sets `:sticky="false"` because a short settings screen has nothing to pin.

All labels align with the left edge of the screen title. The app bar title sits on the content keyline, 72 dp on handsets and 80 dp from 600 px, because the up arrow occupies the space before it. A settings row has no icon or avatar, so `inset` on `QuList.Item` moves its text to that same keyline, and `inset` on `QuSubheader` does the same for the section title. Without `inset` the labels would start at the 16 dp margin and the screen would have two left edges.

Rows are two-line list tiles, 72 dp tall, with the label in Regular 16 sp at 87% ink and the status in Regular 14 sp at 54%. The switch sits in the 56 dp action column at the end of the row.
:::

::: ds-example
/systems/quantum/settings/status

### Status text

Secondary text tells the reader the current state of a setting. When the label is enough on its own, leave the secondary line out; never repeat the label's words in it.

A switch shows "On" or "Off" under its label. A switch or checkbox that needs a precise description may carry one line under the label instead: start it with a verb and say what happens when the setting is on, as "Plays a short vibration on every key press" does here. Longer explanations move to a second screen.

Every other setting shows only its status, with specific details: "Hotspot off", "After 10 minutes of inactivity". The guidelines' counterexample describes the setting ("Adjust the delay before the screen automatically turns off") and is the thing to avoid. Labels follow the same writing rules: impersonal ("Notifications", not "Notify me"), neutral rather than negative ("Block", not "Never"), and plain unless an acronym such as NFC is better known than its expansion.
:::

::: ds-example
/systems/quantum/settings/choice

### Choice dialog

A setting with several exclusive values opens a confirmation dialog from its row. The row is a `QuList.Item` with a click listener, so its tile renders as a button; it sets `aria-haspopup="dialog"` and opens the dialog through `v-model`. The dialog holds a `QuRadio.Group` bound to the dialog's working value, so nothing changes until OK commits it and Cancel discards it.

The confirmation dialog is the dialogs page's form for this job: the title names the setting, the choices are radio rows 48 dp tall, and the action row holds Cancel and OK. After OK, the row's status text shows the new value, "After 10 minutes of inactivity" becoming "After 1 minute of inactivity". OK is disabled while the dialog holds no choice.
:::

::: ds-example
/systems/quantum/settings/subscreen

### Subscreens

When a screen reaches 15 or more settings, move related ones to a subscreen. The row that opens it is a `QuList.Item` whose label matches the subscreen's title exactly, here "Languages & input" in both places, so the reader knows where they arrived. The row's status line previews what is inside.

The subscreen's app bar carries `QuToolbar.Nav icon="up"`, which returns to the parent Settings screen; the up arrow is named after the screen it leads to. The example swaps the two screens in place; an app routes between them, and the browser's Back follows the same path through history.
:::

::: ds-example
/systems/quantum/settings/drawer

### In the navigation drawer

An app with a navigation drawer lists "Settings" in it, below every destination and above only Help & feedback. Settings and support sit at the bottom of the scrolling list, inline with the rest of it, after a full-bleed divider with 8 dp above and below.

The drawer here is the permanent type, and every row is a `QuList.Item` with an icon on the 16 dp keyline and its label on the 72 dp keyline. The current destination takes the primary colour for its text and icon, the navigation drawer page's selected state.
:::

::: ds-example
/systems/quantum/settings/menu

### In the overflow menu

An app without navigation puts "Settings" in the toolbar's overflow menu, again below every other item except Help & feedback. The overflow menu is a `QuMenu` opened from the `more-vert` icon button at the end of `QuToolbar.Actions`.
:::

## Accessibility

A control in `QuList.Action` sits beside the tile, not inside it, so it is its own target and needs its own accessible name. Give each `QuSwitch`, `QuCheckbox` and `QuRadio` an `aria-label` that repeats the row's label, as the examples do; the status line is visible text the reader sees next to it, and the control's own `aria-checked` already announces on or off.

A row that opens a dialog is a button; mark it `aria-haspopup="dialog"`. The dialog is a native modal `<dialog>`: focus moves into it, Tab stays inside, Escape cancels, and focus returns to the row on close. The radio group in it needs a name, here the setting's label through `aria-label`.

A subscreen's up arrow is a button named after its destination ("Settings"), so its purpose is clear without the glyph. `QuToolbar.Nav` names an up arrow "Back" when it has no `aria-label`, so pass the destination every time.

| Key | Behavior |
|-----|----------|
| Tab, Shift+Tab | Moves between the row buttons and the controls in the action column |
| Space | Toggles a focused switch or checkbox |
| Enter, Space | Opens a choice dialog or a subscreen from its row |
| Arrow keys | Move the choice between radios inside the dialog |
| Escape | Closes a choice dialog without changing the setting |
