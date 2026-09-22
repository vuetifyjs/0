export type { BuFieldProps } from './BuField.vue'

// Context
import Root from './BuField.vue'

import Body from '../BuFieldBody/BuFieldBody.vue'
import Label from '../BuFieldLabel/BuFieldLabel.vue'

/**
 * Form field. Renders `.field`; horizontal columns are composed as parts.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`BuFieldLabel`) remain exported and valid.
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { BuField } from '@paper/bulma'
 * </script>
 *
 * <template>
 *   <BuField horizontal>
 *     <BuField.Label />
 *
 *     <BuField.Body />
 *   </BuField>
 * </template>
 * ```
 */
export const BuField = Object.assign(Root, {
  /** `.field-label` column when the field is horizontal. */
  Label,
  /** `.field-body` column when the field is horizontal. */
  Body,
})
