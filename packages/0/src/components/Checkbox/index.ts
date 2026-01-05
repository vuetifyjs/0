export { default as CheckboxIndicator } from './CheckboxIndicator.vue'
export { provideCheckboxRoot, useCheckboxRoot } from './CheckboxRoot.vue'

export { default as CheckboxRoot } from './CheckboxRoot.vue'

export type { CheckboxIndicatorProps, CheckboxIndicatorSlotProps } from './CheckboxIndicator.vue'
export type { CheckboxRootProps, CheckboxRootSlotProps } from './CheckboxRoot.vue'

// Components
import Indicator from './CheckboxIndicator.vue'
import Root from './CheckboxRoot.vue'

/**
 * Checkbox component with sub-components for checkbox groups.
 *
 * @see https://0.vuetifyjs.com/components/checkbox
 */
export const Checkbox = {
  /**
   * Root component for checkbox groups with tri-state support.
   *
   * @see https://0.vuetifyjs.com/components/checkbox
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Checkbox } from '@vuetify/v0'
   *   import { ref } from 'vue'
   *
   *   const selected = ref<string[]>([])
   * </script>
   *
   * <template>
   *   <Checkbox.Root v-model="selected">
   *     <Checkbox.Indicator value="a">Option A</Checkbox.Indicator>
   *     <Checkbox.Indicator value="b">Option B</Checkbox.Indicator>
   *   </Checkbox.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Checkbox indicator component with dual-mode support.
   *
   * Works standalone with v-model or within a CheckboxRoot for group selection.
   * Renders as `<button>` by default (use `renderless` for custom elements).
   *
   * @see https://0.vuetifyjs.com/components/checkbox#checkboxindicator
   *
   * @example
   * ```vue
   * <script lang="ts" setup>
   *   import { Checkbox } from '@vuetify/v0'
   *   import { ref } from 'vue'
   *
   *   const agreed = ref(false)
   * </script>
   *
   * <template>
   *   <!-- Standalone: renders as button, slot is content inside -->
   *   <Checkbox.Indicator v-model="agreed" v-slot="{ isChecked }">
   *     <CheckIcon v-if="isChecked" />
   *     I agree to terms
   *   </Checkbox.Indicator>
   *
   *   <!-- Renderless: you provide the element -->
   *   <Checkbox.Indicator v-model="agreed" renderless v-slot="{ toggle, attrs }">
   *     <button v-bind="attrs" @click="toggle">I agree</button>
   *   </Checkbox.Indicator>
   * </template>
   * ```
   */
  Indicator,
}
