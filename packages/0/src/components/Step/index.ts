export type { StepItemProps, StepItemSlotProps } from './StepItem.vue'
export { default as StepItem } from './StepItem.vue'

export type { StepRootProps, StepRootSlotProps } from './StepRoot.vue'

export { provideStepRoot, useStepRoot } from './StepRoot.vue'
export { default as StepRoot } from './StepRoot.vue'

import Root from './StepRoot.vue'
import Item from './StepItem.vue'

export const Step = {
  Root,
  Item,
}
