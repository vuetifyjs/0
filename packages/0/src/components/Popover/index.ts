export type { PopoverAnchorProps } from './PopoverAnchor.vue'
export type { PopoverContentEmits, PopoverContentProps } from './PopoverContent.vue'
export type { PopoverContext, PopoverRootProps } from './PopoverRoot.vue'

export { providePopoverContext, usePopoverContext } from './PopoverRoot.vue'

import Root from './PopoverRoot.vue'
import Anchor from './PopoverAnchor.vue'
import Content from './PopoverContent.vue'

export const Popover = {
  Root,
  Anchor,
  Content,
}
