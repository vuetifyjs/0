---
title: Menu - Headless dropdown, context menu, and menubar
meta:
- name: description
  content: Headless Vue menu for a button, a right-click, or a menubar. Includes nested submenus, checkbox and radio items, typeahead, and full keyboard navigation.
- name: keywords
  content: menu, context menu, menubar, submenu, dropdown, checkbox, radio, typeahead, Vue 3, headless, ARIA
features:
  category: Component
  label: 'C: Menu'
  github: /components/Menu/
  renderless: true
  level: 2
related:
  - /components/disclosure/popover
  - /composables/system/use-popover
---

# Menu

Menu opens a list of actions from a button, a right-click, or a horizontal bar. Submenus, checkable items, and keyboard navigation are part of the same component.

<DocsPageFeatures :frontmatter />

<DocsBrowserSupport
  feature="CSS Anchor Positioning"
  :versions="{ chrome: '125+', edge: '125+', firefox: '147+', safari: '26+' }"
  anchor="css-anchor-positioning"
>

The menu works in every browser. Automatic placement needs CSS Anchor Positioning. Without it, install the popover plugin with the shipped [FloatingUIPopoverAdapter](/composables/system/use-popover#adapters) (`@vuetify/v0/popover/adapters/floating-ui`).

</DocsBrowserSupport>

## Usage

::: gn-example
/components/menu/basic
:::

## Anatomy

```vue Anatomy no-filename
<script setup lang="ts">
  import { Menu } from '@vuetify/v0'
</script>

<template>
  <Menu.Root>
    <Menu.Bar>
      <Menu.Activator />
    </Menu.Bar>

    <Menu.Context />

    <Menu.Content>
      <Menu.Item />

      <Menu.CheckboxItem />

      <Menu.RadioGroup>
        <Menu.RadioItem />
      </Menu.RadioGroup>

      <Menu.Separator />

      <Menu.Sub>
        <Menu.SubActivator />

        <Menu.SubContent>
          <Menu.Item />
        </Menu.SubContent>
      </Menu.Sub>
    </Menu.Content>
  </Menu.Root>
</template>
```

## Examples

::: gn-example
/components/menu/ShareMenu.vue 1
/components/menu/submenu.vue 2

### Submenu

A submenu is one component you place inside `Menu.Content`. `ShareMenu.vue` is only `Menu.Sub`, its activator, and its content. `submenu.vue` puts that component next to New file. The submenu renders inside the parent menu, so it shares the open path: Arrow Left returns to Share, and the File menu stays open. A second `Menu.Root` is a separate menu and does not share that path.

The chevron is part of `ShareMenu`. `Menu.SubActivator` sets `aria-haspopup="menu"` and `aria-expanded`. It does not paint an icon. Draw the indicator yourself so the item shows that it opens another menu. `rtl:-scale-x-100` mirrors the glyph in RTL. The submenu still opens on the inline-end side. The glyph only marks the item.

Resting the pointer on Share opens the submenu after `open-delay` (default 100ms), even when `open-on-hover` is off. Arrow Right opens it and focuses Email. Arrow Left closes that layer and returns focus to Share. Pass `position-area` when the submenu should open somewhere else. The placement example reuses this same component and does that.

| File | Role |
| --- | --- |
| `ShareMenu.vue` | Nested menu, including the chevron |
| `submenu.vue` | File menu that places ShareMenu inside its content |

:::

::: gn-example
/components/menu/DocumentActions.vue 1
/components/menu/context.vue 2

### Context menu

`Menu.Context` is the right-click target. `Menu.Content` is its sibling. A right-click on Copy or Paste then stays a click on that item. Putting the content inside the target would open the menu again from the item.

`DocumentActions.vue` is the list. Each item emits the name of the action it ran. An action item closes the menu, so the page cannot read the choice while the menu is open. `context.vue` stores the name and prints it after the menu is gone. A checkbox or a radio stays open. That pattern is the next example.

Escape closes the menu and returns focus to `Menu.Context`. There is no long-press.

| File | Role |
| --- | --- |
| `DocumentActions.vue` | Copy and Paste. Each emits the action it ran |
| `context.vue` | Right-click target, the menu beside it, and the last-action line |

:::

::: gn-example
/components/menu/menus.ts 1
/components/menu/menubar.vue 2

### Menubar

`value` names a layer. `v-model` is which layer is open. A single menu sets `value` on `Menu.Root` when the page opens that menu by id, and the activator and content omit it.

Each menu on the bar is one record: an id, a label, and its items. `menubar.vue` loops that list twice. The activators live inside `Menu.Bar`. The contents are siblings of the bar. Both use the record's id as `value`, so File opens the File menu and Edit opens the Edit menu. Adding a menu means adding a record. The loops pick it up.

Keep `Menu.Content` outside `Menu.Bar`. The bar is `role="menubar"`. A menu nested inside it would be a menu inside the menubar. The root slot's `layer` is the id of the menu that is open, or null. The line under the bar turns that id back into a label, which is how you show which menu is open without reading the DOM.

Arrow keys move across the bar. Arrow Down opens the focused menu on its first item. Arrow Up opens it on its last. With `open-on-hover` left off, hovering a closed bar does nothing. Once a menu is open, hovering another activator switches to it immediately.

| File | Role |
| --- | --- |
| `menus.ts` | One record per menu: id, label, and items |
| `menubar.vue` | Bar and menus from that list, plus the line that names the open menu |

:::

::: gn-example
/components/menu/FormatMenu.vue 1
/components/menu/selection.vue 2

### Checkbox and radio

`selection.vue` owns the values. `FormatMenu.vue` only binds them. `Menu.CheckboxItem` uses `v-model:checked`. `Menu.RadioGroup` uses `v-model`, and each `Menu.RadioItem` writes its `value`. Checking Bold or Right leaves the menu open, so the line under the button updates while the menu is still up. An action item closes the menu. The context example is that case.

The box and the dot are drawn from `data-state` on the item. The item does not paint a control. Put `group` on the item and `group-data-[state=checked]` on the indicator. `data-state` is `checked` or `unchecked`. A class on an inner element does not see that attribute.

Disabled items ignore the pointer and the keyboard. The page can still change the model, which is why the refs live in `selection.vue`.

| File | Role |
| --- | --- |
| `FormatMenu.vue` | Format menu. Binds bold and align, and draws the box and the dot |
| `selection.vue` | Owns the two values and prints them |

:::

::: gn-example
/components/menu/usePlacement.ts 1
/components/menu/PlacementControls.vue 2
/components/menu/ShareMenu.vue 3
/components/menu/ActionsMenu.vue 4
/components/menu/options.vue 5

### Placement and options

The values, the controls, and the menu are three pieces. `usePlacement` holds the values and `pick()`. `PlacementControls.vue` is ordinary inputs. `ActionsMenu.vue` receives the values as props and passes them to `Menu.Root` and `Menu.Content`. `options.vue` only connects the three. Change a control while the menu is open and the open menu follows it.

`position-area` on `Menu.Content` takes a [CSS position-area](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-area) value. `bottom` opens under the button. `top`, `left`, `right`, and the corners (`top left`, `bottom right`) place the menu in that cell of the anchor. `position-try` is the fallback when that cell does not fit. The default is `most-width bottom`.

`ShareMenu.vue` is the submenu from the first example. `ActionsMenu` passes `position-area` into it, so the submenu side is a prop on the component you already wrote. `Menu.SubContent` defaults to `inline-end span-block-start` when you omit the prop.

The direction buttons sit outside the menu. Clicking one light-dismisses an open menu before the new value is visible, so `pick()` writes the area and opens the menu again on the next turn. Keep those buttons out of the cells the menu will cover. A menu that opens under the pointer highlights the item there, and Share then starts its open delay.

`open-on-hover`, `open-delay`, and `close-delay` are props on `Menu.Root`. With hover open, the pointer rests for `open-delay` before the menu opens, and leaving closes it after `close-delay`. A click or a key still opens immediately. `disabled` blocks every activator and item in that menu.

| File | Role |
| --- | --- |
| `usePlacement.ts` | The values, and the click that reopens after light-dismiss |
| `PlacementControls.vue` | Fallback, submenu side, delays, and the direction grid |
| `ShareMenu.vue` | The submenu from the first example, placed by a prop |
| `ActionsMenu.vue` | The menu. Receives those values and passes them through |
| `options.vue` | Connects the controls to the menu |

:::

## Accessibility

`Menu.Content` and `Menu.SubContent` are `role="menu"`. Items are `menuitem`, `menuitemcheckbox`, or `menuitemradio`. `Menu.Bar` is `role="menubar"`. Separators are `role="separator"`.

A menu opened from an activator is named by that activator. A context menu with no activator uses the locale string `Menu.label`.

A click, a right-click, or a pointer switch opens the menu with no item highlighted. Moving the pointer onto an item highlights that item. Arrow Down then highlights the first item, and Arrow Up highlights the last. Arrow keys on a closed activator still open straight onto the first or last item, and Enter or Space opens onto the first item.

| Key | Menu | Menubar |
| --- | --- | --- |
| Arrow Down / Up | On a closed activator, Arrow Down opens the first item and Arrow Up opens the last. Inside the open menu, Down and Up move between items | On a closed activator, Arrow Down opens the first item and Arrow Up opens the last. Inside the open menu, Down and Up move between items |
| Home / End | Moves to the first or last item | Moves to the first or last activator |
| Arrow Right | Opens a submenu, or moves to the next menu when more than one activator is registered. It does not close the top menu | Opens a submenu, or moves to the next menu when more than one activator is registered. It does not close the top menu |
| Arrow Left | Closes one submenu, or moves to the previous menu when more than one activator is registered. It does not close the top menu | Closes one submenu, or moves to the previous menu when more than one activator is registered. It does not close the top menu |
| Enter / Space | On a closed activator, opens the first item. On a submenu item, opens that submenu and leaves the menu open. On an action item, runs the action and closes. On a checkbox or radio, changes the value and stays open | Toggles the focused menu. On an item, same as Menu |
| Escape | Closes every layer and returns focus to the activator. A context menu has no activator. Focus returns to the `Menu.Context` element | Closes every layer and returns focus to the activator |
| Tab | Closes every layer and moves focus to the next control. It does not return focus to the activator, and it does not prevent the browser's default Tab | Closes every layer and moves focus to the next control. It does not return focus to the activator, and it does not prevent the browser's default Tab |
| Typeahead | Focuses the item whose label starts with the typed text | Same, on the open menu |

Arrow Left and Arrow Right swap in RTL. Typeahead ignores Space, which activates the focused item, and it resets after a short pause.

## FAQ

::: faq

??? How do I add a submenu?

Put `Menu.Sub` inside `Menu.Content`, with `Menu.SubActivator` and `Menu.SubContent`. A second `Menu.Root` is a separate menu and does not share the open path.

??? When does hover open or close a menu?

Resting on `Menu.SubActivator` opens that submenu after `open-delay` (default 100ms), even when `open-on-hover` is off. That open does not start `close-delay`. `open-on-hover` applies only to a top-level `Menu.Activator` and is off by default. When it is on, pointer rest opens after `open-delay`, and pointer leave closes after `close-delay` (default 250ms). `open-delay` covers both `open-on-hover` and submenu pointer-rest. `close-delay` runs only after a hover open, when the pointer leaves. A menu opened by click, keyboard, or right-click stays open when the pointer leaves. Menubar hover is the same rule. With `open-on-hover` left off, hovering an activator does nothing until a menu is already open. After one is open, hovering another activator switches to it immediately, with no `open-delay`. If `open-on-hover` is set, a resting pointer opens that activator after `open-delay`.

??? Can I use this for site navigation?

A nav item that opens a short list of actions is a dropdown. A panel of links, a shared viewport, or a mega menu is not a menu. Build that with [Popover](/components/disclosure/popover).

??? How do I control where the menu opens?

`position-area` on `Menu.Content` defaults to `bottom`. `Menu.SubContent` defaults to `inline-end span-block-start`, so the submenu sits on the inline-end side and lines up with the block start of the item. `position-try` on `Menu.SubContent` defaults to `flip-inline`. When `position-try` is omitted on `Menu.Content`, it falls back to `most-width bottom`. Both props take the CSS value directly.

:::

<DocsApi />
