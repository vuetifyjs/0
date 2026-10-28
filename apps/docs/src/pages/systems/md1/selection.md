---
title: Selection - Material Design 1 Selection Pattern for Vue
meta:
- name: description
  content: The Material Design 1 selection pattern. Selected lists, grid lists, cards and table rows, the contextual action bar, and text selection in the accent colour.
- name: keywords
  content: md1 selection, material design 1 selection, multi select list, contextual action bar, selected state, text selection color, vue selection, paper md1
features:
  category: Guide
  label: 'Selection'
  level: 2
  renderless: false
  group: 'patterns'
  order: 4
related:
  - /systems/md1
  - /systems/md1/list
  - /systems/md1/toolbar
  - /systems/md1/data-table
  - /composables/selection/create-selection
---

# Selection

<DocsPageFeatures :frontmatter />

Selection lets the reader pick items and then act on them together, or highlight a run of text. Material Design 1 draws the selected state on lists, grid lists, cards and table rows, and turns the app bar into a contextual action bar while anything is selected.

<DocsMd1Reference
  href="https://m1.material.io/patterns/selection.html"
  title="Selection"
/>

> [!NOTE]
> Read with the [Navigation](https://m1.material.io/patterns/navigation.html) page for the Back rule and [Gestures](https://m1.material.io/patterns/gestures.html) for the selection gestures.

## Usage

`select="multiple"` turns an `Md1List` into a selectable set bound to an array with `v-model`. A selected item shows a check mark in place of its avatar and the selection scrim over its row.

::: ds-example
/systems/md1/selection/list

The check mark takes the avatar's 40 dp slot, so `Md1List` always has the room the guidelines ask for when the mark replaces the icon or avatar. `select="single"` gives the same selected state with one value.
:::

## Item selection

| Surface | How to select | Selected state |
|---------|---------------|----------------|
| List | `Md1List select="multiple"` (or `"single"`) with `v-model` | Check mark in place of the avatar or icon, `--md1-selection` scrim on the row |
| Grid list | `selected` on `Md1GridList.Tile`, toggled from the tile's click | Scrim and check mark over the image |
| Card | `selected` on `Md1Card` | Scrim and check mark, in place of the header avatar when there is one |
| Data table | `selectable` on `Md1DataTable` with `v-model:selected` | A checkbox column; selected rows turn Grey 100 in the light theme |
| Actions on the selection | `Md1Toolbar.Contextual` (app bar) or `Md1DataTable.Contextual` (table header) | Replaces the bar's normal content while anything is selected |

The selection scrim is `--md1-selection`: the accent at 30%, Pink A200 in the default theme, the same in both themes. The guidelines name the accent for selection and state no opacity; 30% is Material Design 1's decision.[^selection-alpha]

### How selection starts

The guidelines' gesture is a long press, or a press held in place, on touch, and a check mark revealed on hover on desktop. Material Design 1 keeps the desktop rule as the default for every pointer, because a long press on the web collides with the browser's context menu and text selection[^desktop-rule]:

| Rule | Material Design 1 |
|------|---------|
| Hovering an item reveals a single check mark you can click (desktop) | Under `(pointer: fine)`, `Md1List` shows the mark on the hovered or focused item |
| After one item is selected, check marks appear on every remaining item in the set | `Md1List` marks every item while the selection is not empty |
| Once an item is selected, a tap toggles it | Every option toggles on click, Enter or Space |
| Avoid showing a checkbox on every item at all times | Lists, grid lists and cards draw marks only on demand; the data table keeps its checkbox column, as its own page's figures do |
| Long press, two-finger touch and drag to select a range | Not shipped; gestures are the app's, if it wants them |

### Leaving selection mode

Selection mode ends when the reader deselects every item or performs an action from the contextual bar. The Back button dismisses the contextual action bar and clears the highlight; in Material Design 1 the bar's close button and Escape inside the bar do the same, and an app adds Escape on the selectable content.

## Text selection

Text selection is the browser's: a contiguous highlight, with handles and a floating Cut, Copy, Paste toolbar on mobile. Those are browser chrome and Material Design 1 does not draw them. The guidelines ask only that the highlight use the accent colour and keep the text legible.

```css
::selection {
  background: var(--md1-selection, rgba(255, 64, 129, 0.3));
  color: var(--md1-text-primary, rgba(0, 0, 0, 0.87));
}
```

Put the rule in your app stylesheet, on the root or on the subtree you want themed. The keyboard shortcuts the guidelines list (Shift with the arrows to extend, Ctrl or Command with A to select all) are the browser's own.

## Examples

::: ds-example
/systems/md1/selection/drag

### Dragging across checkboxes

On desktop, people can press on one checkbox and drag across the others to select a run of items in one motion. The first checkbox toggles as usual, and every checkbox the pointer crosses while the button is held takes the same state, so the same drag also clears a run.[^drag-paint] Releasing the button anywhere ends it.

The drag is a mouse convenience only: touch keeps scrolling, and each checkbox still toggles alone by click, tap or Space. Text selection is suspended while the drag runs so the rows do not highlight.
:::

::: ds-example
/systems/md1/selection/contextual

### Contextual action bar

While items are selected, the app bar becomes a contextual action bar. Set `contextual` on `Md1Toolbar` while the selection is not empty and put `Md1Toolbar.Contextual` in it: the bar's navigation and title give way to a close button, the count ("2 selected") in the title's place and style, and the actions that apply to the selection.

The close button, and Escape pressed anywhere inside the bar, emit `clear`; clearing the array ends selection mode and the normal bar returns. Focus usually sits in the list rather than the bar, so the example also clears on Escape from the list, the in-page counterpart of Back. Performing an action ends it too: Delete here removes the selected files and empties the selection. The count is a polite live region, so each change is announced. The count reads from the `Md1.selectedCount` locale key.
:::

::: ds-example
/systems/md1/selection/grid-list

### Grid lists

A grid list tile takes `selected` and draws the selection scrim and a check mark over its image. The tile becomes a button when it has a click listener, so the example toggles membership in an array from each tile's click and reads `selected` back from it. Use the same model for a contextual action bar over the grid.

Tiles have no hover-revealed mark of their own; when the reader needs to see that tiles are selectable before choosing one, enter selection mode from an action ("Select") and show the count.
:::

::: ds-example
/systems/md1/selection/card

### Cards

`selected` on `Md1Card` lays the selection scrim over the card and draws the check mark in place of the header's avatar, the selection pattern's rule that the mark replaces the avatar when there is space. A card has no selection gesture of its own; the example toggles it from a flat button whose label, Select or Deselect, names the next action. The button is not a toggle button: `Md1Button` reserves `aria-pressed` for v0's button groups, so the label carries the state, and the check mark is announced as "Selected".

Select cards when the collection supports acting on several at once, such as archiving. A card's own primary action still leads to its detail.
:::

::: ds-example
/systems/md1/selection/data-table

### Data tables

`selectable` adds a checkbox column with a select-all box in the header row; `v-model:selected` holds the selected row records. A selected row turns Grey 100, the data tables page's value; the page gives no dark value, so the dark theme takes Vuetify 1.5's near-`#505050`.[^dark-row] While rows are selected, `Md1DataTable.Contextual` replaces the title header: "2 items selected" on the accent's 50 (`--md1-accent-light`), the data tables page's fill, with the actions that apply to the rows.

The data tables page draws the checkbox column at all times, and Material Design 1 follows that page rather than the selection pattern's hover-only check mark. Escape inside the contextual header clears the selection, the keyboard counterpart of Back.
:::

::: ds-example
/systems/md1/selection/text

### Text selection

Select some of the paragraph, or press the button to select its second sentence. The highlight is the selection token, the accent at 30%, under the primary text ink, so selected text stays legible on both themes. The example scopes the rule to its paragraph; an app puts it on the root.

The guidelines also allow outlines, text treatments, motion or check marks as alternatives when the highlight alone would not contrast. The floating toolbar and the handles stay the browser's.
:::

## Accessibility

A selectable `Md1List` is a listbox with one tab stop: arrow keys move between options, Space or Enter toggles one, and `aria-multiselectable` marks a multiple-select list. Name the list with `aria-label`. A grid list tile with a click listener is a button that points `aria-describedby` at its check mark, so a selected tile is announced with "Selected". A card's toggle is an ordinary button; let its label say what it does (Select, Deselect), because `Md1Button` keeps `aria-pressed` for v0's button groups. Data table checkboxes are named "Select all" and "Select row", and select-all reports `aria-checked="mixed"` for a partial page.

The contextual bar's count is announced through a polite live region. Its close button is named "Close" by default.

| Key | Behavior |
|-----|----------|
| Arrow Down, Arrow Up | Moves focus between options in a selectable list |
| Space, Enter | Toggles the focused option, tile or row checkbox |
| Escape | Clears the selection when focus is in a contextual action bar or a table's contextual header (and, in the example, in the list) |
| Shift with the arrow keys | Extends a text selection by character or by line |
| Ctrl+A, Command+A | Selects all text |

[^selection-alpha]: Our call: the selection page names the accent and states no opacity.

[^desktop-rule]: Our call: the long-press gesture is not shipped, so the hover-revealed check mark serves every pointer.

[^drag-paint]: Our call: the guidelines show the drag without saying what state crossed boxes take; painting the first box's new state is ours.

[^dark-row]: Vuetify 1.5.24, stylus/settings/_theme.styl:189-190. The dark table's `#505050` selected row and Grey 700 hover.
