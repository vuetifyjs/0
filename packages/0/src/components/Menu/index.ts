export { default as MenuActivator } from './MenuActivator.vue'
export { default as MenuBar } from './MenuBar.vue'
export { default as MenuCheckboxItem } from './MenuCheckboxItem.vue'
export { default as MenuContent } from './MenuContent.vue'
export { default as MenuContext } from './MenuContext.vue'
export { default as MenuItem } from './MenuItem.vue'
export { default as MenuRadioGroup } from './MenuRadioGroup.vue'
export { default as MenuRadioItem } from './MenuRadioItem.vue'
export { provideMenuRoot, useMenuRoot } from './MenuRoot.vue'
export { default as MenuRoot } from './MenuRoot.vue'
export { default as MenuSeparator } from './MenuSeparator.vue'
export { default as MenuSub } from './MenuSub.vue'
export { default as MenuSubActivator } from './MenuSubActivator.vue'
export { default as MenuSubContent } from './MenuSubContent.vue'
export type { MenuActivatorProps, MenuActivatorSlotProps } from './MenuActivator.vue'
export type { MenuBarProps, MenuBarSlotProps } from './MenuBar.vue'
export type { MenuCheckboxItemProps, MenuCheckboxItemSlotProps } from './MenuCheckboxItem.vue'
export type { MenuContentProps, MenuContentSlotProps } from './MenuContent.vue'
export type { MenuContextProps, MenuContextSlotProps } from './MenuContext.vue'
export type { MenuItemProps, MenuItemSlotProps } from './MenuItem.vue'
export type { MenuRadioGroupProps, MenuRadioGroupSlotProps } from './MenuRadioGroup.vue'
export type { MenuRadioItemProps, MenuRadioItemSlotProps } from './MenuRadioItem.vue'
export type {
  MenuActivatorInput,
  MenuActivatorTicket,
  MenuEdge,
  MenuItemInput,
  MenuItemTicket,
  MenuKind,
  MenuRootContext,
  MenuRootProps,
  MenuRootSlotProps,
  MenuSource,
} from './MenuRoot.vue'
export type { MenuSeparatorProps, MenuSeparatorSlotProps } from './MenuSeparator.vue'
export type { MenuSubProps } from './MenuSub.vue'
export type { MenuSubActivatorProps, MenuSubActivatorSlotProps } from './MenuSubActivator.vue'
export type { MenuSubContentProps, MenuSubContentSlotProps } from './MenuSubContent.vue'

// Context
import Activator from './MenuActivator.vue'
import Bar from './MenuBar.vue'
import CheckboxItem from './MenuCheckboxItem.vue'
import Content from './MenuContent.vue'
import Context from './MenuContext.vue'
import Item from './MenuItem.vue'
import RadioGroup from './MenuRadioGroup.vue'
import RadioItem from './MenuRadioItem.vue'
import Root from './MenuRoot.vue'
import Separator from './MenuSeparator.vue'
import Sub from './MenuSub.vue'
import SubActivator from './MenuSubActivator.vue'
import SubContent from './MenuSubContent.vue'

/**
 * Menu compound for a button, a right-click, and a menubar.
 *
 * @see https://0.vuetifyjs.com/components/disclosure/menu
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { Menu } from '@vuetify/v0'
 * </script>
 *
 * <template>
 *   <Menu.Root>
 *     <Menu.Activator>Actions</Menu.Activator>
 *
 *     <Menu.Content>
 *       <Menu.Item>Copy</Menu.Item>
 *     </Menu.Content>
 *   </Menu.Root>
 * </template>
 * ```
 */
export const Menu = {
  /**
   * Owns one open path for every layer of the menu.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/menu
   *
   * @example
   * ```vue
   * <template>
   *   <Menu.Root>
   *     <Menu.Activator>Actions</Menu.Activator>
   *     <Menu.Content>
   *       <Menu.Item>Copy</Menu.Item>
   *     </Menu.Content>
   *   </Menu.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Horizontal bar of activators. Arrow keys move between them.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/menu
   *
   * @example
   * ```vue
   * <template>
   *   <Menu.Bar>
   *     <Menu.Activator value="file">File</Menu.Activator>
   *   </Menu.Bar>
   * </template>
   * ```
   */
  Bar,
  /**
   * Opens one top-level menu. A button by default, a menuitem inside Menu.Bar.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/menu
   *
   * @example
   * ```vue
   * <template>
   *   <Menu.Activator>Actions</Menu.Activator>
   * </template>
   * ```
   */
  Activator,
  /**
   * Popup list for one top-level activator.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/menu
   *
   * @example
   * ```vue
   * <template>
   *   <Menu.Content>
   *     <Menu.Item>Copy</Menu.Item>
   *   </Menu.Content>
   * </template>
   * ```
   */
  Content,
  /**
   * An action. Activating it closes the menu.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/menu
   *
   * @example
   * ```vue
   * <template>
   *   <Menu.Item>Copy</Menu.Item>
   * </template>
   * ```
   */
  Item,
  /**
   * A checkable item. Toggling it leaves the menu open.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/menu
   *
   * @example
   * ```vue
   * <template>
   *   <Menu.CheckboxItem v-model:checked="bold">Bold</Menu.CheckboxItem>
   * </template>
   * ```
   */
  CheckboxItem,
  /**
   * Groups radio items. Choosing one leaves the menu open.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/menu
   *
   * @example
   * ```vue
   * <template>
   *   <Menu.RadioGroup v-model="align">
   *     <Menu.RadioItem value="left">Left</Menu.RadioItem>
   *   </Menu.RadioGroup>
   * </template>
   * ```
   */
  RadioGroup,
  /**
   * One choice inside Menu.RadioGroup.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/menu
   *
   * @example
   * ```vue
   * <template>
   *   <Menu.RadioItem value="left">Left</Menu.RadioItem>
   * </template>
   * ```
   */
  RadioItem,
  /**
   * Visual separator. It is not an item and it is not focusable.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/menu
   *
   * @example
   * ```vue
   * <template>
   *   <Menu.Separator />
   * </template>
   * ```
   */
  Separator,
  /**
   * Names a nested menu. Place it inside Menu.Content.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/menu
   *
   * @example
   * ```vue
   * <template>
   *   <Menu.Sub>
   *     <Menu.SubActivator>Share</Menu.SubActivator>
   *     <Menu.SubContent>
   *       <Menu.Item>Email</Menu.Item>
   *     </Menu.SubContent>
   *   </Menu.Sub>
   * </template>
   * ```
   */
  Sub,
  /**
   * Item that opens the surrounding Menu.Sub.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/menu
   *
   * @example
   * ```vue
   * <template>
   *   <Menu.SubActivator>Share</Menu.SubActivator>
   * </template>
   * ```
   */
  SubActivator,
  /**
   * Popup for a Menu.Sub. Renders inside the parent menu.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/menu
   *
   * @example
   * ```vue
   * <template>
   *   <Menu.SubContent>
   *     <Menu.Item>Email</Menu.Item>
   *   </Menu.SubContent>
   * </template>
   * ```
   */
  SubContent,
  /**
   * Right-click target. Opens the menu at the pointer.
   *
   * @see https://0.vuetifyjs.com/components/disclosure/menu
   *
   * @example
   * ```vue
   * <template>
   *   <Menu.Context>Right-click</Menu.Context>
   * </template>
   * ```
   */
  Context,
}
