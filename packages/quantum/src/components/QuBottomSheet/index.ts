export type { QuBottomSheetContext, QuBottomSheetLayout } from './context'
export { useQuBottomSheet } from './context'
export type { QuBottomSheetProps, QuBottomSheetSlotProps } from './QuBottomSheet.vue'
export type { QuBottomSheetActivatorSlotProps } from './QuBottomSheetActivator.vue'
export { default as QuBottomSheetActivator } from './QuBottomSheetActivator.vue'
export type { QuBottomSheetItemProps } from './QuBottomSheetItem.vue'
export { default as QuBottomSheetItem } from './QuBottomSheetItem.vue'
export { default as QuBottomSheetTitle } from './QuBottomSheetTitle.vue'

// Context
import Root from './QuBottomSheet.vue'
import Activator from './QuBottomSheetActivator.vue'
import Item from './QuBottomSheetItem.vue'
import Title from './QuBottomSheetTitle.vue'

/**
 * The Material Design 1 bottom sheet. Modal by default: a native `<dialog>`
 * at 16 dp against the bottom edge over a 20% black scrim, on v0 `Dialog`.
 * `persistent` makes it the non-modal sheet on v0 `Portal`, with the
 * expanded state on `Collapsible`. The root owns `v-model` (open) and
 * `v-model:expanded` (full height) and provides the `quantum:bottom-sheet`
 * context its parts read.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`QuBottomSheetItem`) remain exported and valid.
 * `Activator` must be a direct child of the root: the root renders it outside
 * the sheet and everything else inside.
 *
 * @example
 * ```vue
 * <QuBottomSheet v-model="open">
 *   <QuBottomSheet.Activator v-slot="{ attrs }">
 *     <QuButton v-bind="attrs">Share</QuButton>
 *   </QuBottomSheet.Activator>
 *
 *   <QuBottomSheet.Title>Share with</QuBottomSheet.Title>
 *
 *   <QuBottomSheet.Item icon="email">Email</QuBottomSheet.Item>
 * </QuBottomSheet>
 * ```
 */
export const QuBottomSheet = Object.assign(Root, {
  /** Renderless trigger host: spread its `attrs` slot prop onto a `QuButton`. */
  Activator,
  /** The 56 dp header row, Regular 16 sp at 54%, with its 1 dp divider; names the sheet. */
  Title,
  /** A 48 dp action row, or a 48 dp icon tile with its label under `grid`; a button or, with `href`, a link. */
  Item,
})
