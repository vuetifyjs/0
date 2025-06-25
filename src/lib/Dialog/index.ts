import Root from './DialogRoot.vue'
import Trigger from './DialogTrigger.vue'
import Portal from './DialogPortal.vue'
import Content from './DialogContent.vue'
import Close from './DialogClose.vue'
import Backdrop from './DialogBackdrop.vue'

export const Dialog = {
  Backdrop,
  Root,
  Trigger,
  Portal,
  Content,
  Close,
}

export type { DialogBackdropProps } from './DialogBackdrop.vue'
export type { DialogCloseProps } from './DialogClose.vue'
export type { DialogContentProps } from './DialogContent.vue'
export type { DialogPortalProps } from './DialogPortal.vue'
export type { DialogRootProps } from './DialogRoot.vue'
export type { DialogTriggerProps } from './DialogTrigger.vue'
export type { DialogContext } from './useDialog'
