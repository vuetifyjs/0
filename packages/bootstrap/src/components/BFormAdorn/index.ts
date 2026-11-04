export type { BFormAdornProps, BFormAdornSize } from './BFormAdorn.vue'

// Context
import Root from './BFormAdorn.vue'

import Control from '../BFormAdornControl/BFormAdornControl.vue'
import Icon from '../BFormAdornIcon/BFormAdornIcon.vue'
import Text from '../BFormAdornText/BFormAdornText.vue'

/**
 * Bootstrap 6 form adorn. `label.form-control.form-adorn` around a ghost input.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { BFormAdorn } from '@paper/bootstrap'
 * </script>
 *
 * <template>
 *   <BFormAdorn>
 *     <BFormAdorn.Icon />
 *     <BFormAdorn.Control placeholder="Search..." type="search" />
 *   </BFormAdorn>
 * </template>
 * ```
 */
export const BFormAdorn = Object.assign(Root, {
  /** `div.form-adorn-icon`. Hidden from the accessibility tree. */
  Icon,
  /** `span.form-adorn-text`. Hidden from the accessibility tree. */
  Text,
  /** `input.form-ghost`. */
  Control,
})
