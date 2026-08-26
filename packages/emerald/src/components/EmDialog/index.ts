export type { EmDialogActivatorProps } from './EmDialogActivator.vue'
export { default as EmDialogActivator } from './EmDialogActivator.vue'
export type { EmDialogCloseProps } from './EmDialogClose.vue'
export { default as EmDialogClose } from './EmDialogClose.vue'
export type { EmDialogContentProps } from './EmDialogContent.vue'
export { default as EmDialogContent } from './EmDialogContent.vue'
export type { EmDialogDescriptionProps } from './EmDialogDescription.vue'
export { default as EmDialogDescription } from './EmDialogDescription.vue'
export type { EmDialogFooterProps, EmDialogFooterVariant } from './EmDialogFooter.vue'
export { default as EmDialogFooter } from './EmDialogFooter.vue'
export type { EmDialogProps } from './EmDialog.vue'
export type { EmDialogTitleProps } from './EmDialogTitle.vue'
export { default as EmDialogTitle } from './EmDialogTitle.vue'

// Context
import Root from './EmDialog.vue'
import Activator from './EmDialogActivator.vue'
import Close from './EmDialogClose.vue'
import Content from './EmDialogContent.vue'
import Description from './EmDialogDescription.vue'
import Footer from './EmDialogFooter.vue'
import Title from './EmDialogTitle.vue'

/**
 * Modal dialog. Owns the open state, focus trap, and scrim its parts render against.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`EmDialogActivator`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { EmDialog } from '@paper/emerald'
 * </script>
 *
 * <template>
 *   <EmDialog>
 *     <EmDialog.Activator />
 *
 *     <EmDialog.Content>
 *       <EmDialog.Title />
 *
 *       <EmDialog.Description />
 *
 *       <EmDialog.Footer />
 *
 *       <EmDialog.Close />
 *     </EmDialog.Content>
 *   </EmDialog>
 * </template>
 * ```
 */
export const EmDialog = Object.assign(Root, {
  /** Trigger that opens the dialog. */
  Activator,
  /** The dialog surface itself. */
  Content,
  /** Accessible name for the dialog. */
  Title,
  /** Accessible description for the dialog. */
  Description,
  /** Action row at the bottom of the surface. */
  Footer,
  /** Dismisses the dialog. */
  Close,
})
