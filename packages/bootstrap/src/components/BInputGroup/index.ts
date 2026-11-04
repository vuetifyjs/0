// Context
import Root from './BInputGroup.vue'

import Text from '../BInputGroupText/BInputGroupText.vue'

/**
 * Bootstrap 6 input group. `div.input-group`. Controls are the default slot.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { BInputGroup } from '@paper/bootstrap'
 * </script>
 *
 * <template>
 *   <BInputGroup>
 *     <BInputGroup.Text>@</BInputGroup.Text>
 *     <input class="form-control" type="text" />
 *   </BInputGroup>
 * </template>
 * ```
 */
export const BInputGroup = Object.assign(Root, {
  /** `span.input-group-text`. */
  Text,
})
