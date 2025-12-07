export type { PopoverAnchorProps, PopoverAnchorSlotProps } from './PopoverAnchor.vue'
export { default as PopoverAnchor } from './PopoverAnchor.vue'
export type { PopoverContentEmits, PopoverContentProps, PopoverContentSlotProps } from './PopoverContent.vue'

export { default as PopoverContent } from './PopoverContent.vue'

export type { PopoverContext, PopoverRootProps, PopoverRootSlotProps } from './PopoverRoot.vue'
export { providePopoverContext, usePopoverContext } from './PopoverRoot.vue'
export { default as PopoverRoot } from './PopoverRoot.vue'

import Root from './PopoverRoot.vue'
import Anchor from './PopoverAnchor.vue'
import Content from './PopoverContent.vue'

export const Popover = {
  Root,
  Anchor,
  Content,
}
