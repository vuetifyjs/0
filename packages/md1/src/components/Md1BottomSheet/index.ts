export type { Md1BottomSheetContext, Md1BottomSheetLayout } from './context'
export { useMd1BottomSheet } from './context'
export type { Md1BottomSheetProps, Md1BottomSheetSlotProps } from './Md1BottomSheet.vue'
export type { Md1BottomSheetActivatorSlotProps } from './Md1BottomSheetActivator.vue'
export { default as Md1BottomSheetActivator } from './Md1BottomSheetActivator.vue'
export type { Md1BottomSheetItemProps } from './Md1BottomSheetItem.vue'
export { default as Md1BottomSheetItem } from './Md1BottomSheetItem.vue'
export { default as Md1BottomSheetTitle } from './Md1BottomSheetTitle.vue'

// Context
import Root from './Md1BottomSheet.vue'
import Activator from './Md1BottomSheetActivator.vue'
import Item from './Md1BottomSheetItem.vue'
import Title from './Md1BottomSheetTitle.vue'

/**
 * The Material Design 1 bottom sheet. Modal by default: a native `<dialog>`
 * at 16 dp against the bottom edge over a 20% black scrim, on v0 `Dialog`.
 * `persistent` makes it the non-modal sheet on v0 `Portal`, with the
 * expanded state on `Collapsible`. The root owns `v-model` (open) and
 * `v-model:expanded` (full height) and provides the `md1:bottom-sheet`
 * context its parts read.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`Md1BottomSheetItem`) remain exported and valid.
 * `Activator` must be a direct child of the root: the root renders it outside
 * the sheet and everything else inside.
 *
 * @example
 * ```vue
 * <Md1BottomSheet v-model="open">
 *   <Md1BottomSheet.Activator v-slot="{ attrs }">
 *     <Md1Button v-bind="attrs">Share</Md1Button>
 *   </Md1BottomSheet.Activator>
 *
 *   <Md1BottomSheet.Title>Share with</Md1BottomSheet.Title>
 *
 *   <Md1BottomSheet.Item icon="email">Email</Md1BottomSheet.Item>
 * </Md1BottomSheet>
 * ```
 */
export const Md1BottomSheet = Object.assign(Root, {
  /** Renderless trigger host: spread its `attrs` slot prop onto an `Md1Button`. */
  Activator,
  /** The 56 dp header row, Regular 16 sp at 54%, with its 1 dp divider; names the sheet. */
  Title,
  /** A 48 dp action row, or a 48 dp icon tile with its label under `grid`; a button or, with `href`, a link. */
  Item,
})
