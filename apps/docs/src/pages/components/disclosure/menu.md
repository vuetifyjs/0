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
/components/menu/submenu

### Submenu

Place `Menu.Sub` inside `Menu.Content`. The submenu renders in the parent menu, so opening it keeps the parent open. Arrow Right on the item opens the submenu and focuses its first action. Arrow Left closes that layer and returns focus to the item.

Resting on `Menu.SubActivator` opens that submenu after `open-delay` (default 100ms), even when `open-on-hover` is off. That open does not start `close-delay`. `open-on-hover` applies only to a top-level `Menu.Activator` and is off by default. When it is on, pointer rest opens after `open-delay`, and pointer leave closes after `close-delay` (default 250ms). `open-delay` covers both `open-on-hover` and submenu pointer-rest. `close-delay` runs only after a hover open, when the pointer leaves. A menu opened by click, keyboard, or right-click stays open when the pointer leaves.

:::

::: gn-example
/components/menu/context

### Context menu

`Menu.Context` listens for a right-click and opens the menu at that point. Put `Menu.Content` next to it, not inside it, so a right-click on an item does not open the menu again.

The opened menu takes keyboard focus. Escape closes every layer and returns focus to the `Menu.Context` element. There is no long-press behavior.

:::

::: gn-example
/components/menu/menubar

### Menubar

`value` names a layer. `v-model` is which layer is open. A single menu sets `value` on `Menu.Root` when the page opens that menu by id, and the activator and content omit it. A menubar sets the same `value` on each `Menu.Activator` and its `Menu.Content`. Arrow keys move across the bar. Arrow Down opens the focused menu on its first item, and Arrow Up opens it on its last item.

Menubar hover is the same rule, not a special case. With `open-on-hover` left off, hovering an activator does nothing until a menu is already open. After one is open, hovering another activator switches to it immediately, with no `open-delay`. If `open-on-hover` is set, a resting pointer opens that activator after `open-delay`. Enter or Space toggles the focused menu.

:::

::: gn-example
/components/menu/selection

### Checkbox and radio

`Menu.CheckboxItem` uses `v-model:checked`. `Menu.RadioGroup` uses `v-model`, and each `Menu.RadioItem` writes its `value`. Activating either kind leaves the menu open. An action item still closes it.

Disabled items ignore the pointer and the keyboard. The model can still be changed from outside.

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
