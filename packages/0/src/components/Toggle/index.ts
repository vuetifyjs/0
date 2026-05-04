export { default as ToggleGroup } from './ToggleGroup.vue'
export { provideToggleGroup, useToggleGroup } from './ToggleGroup.vue'

export { default as ToggleIndicator } from './ToggleIndicator.vue'

export { default as ToggleRoot } from './ToggleRoot.vue'
export { provideToggleRoot, useToggleRoot } from './ToggleRoot.vue'

export type { ToggleGroupContext, ToggleGroupProps, ToggleGroupSlotProps, ToggleOrientation } from './ToggleGroup.vue'
export type { ToggleIndicatorProps, ToggleIndicatorSlotProps } from './ToggleIndicator.vue'
export type { ToggleRootContext, ToggleRootProps, ToggleRootSlotProps } from './ToggleRoot.vue'

// Context
import Group from './ToggleGroup.vue'
import Indicator from './ToggleIndicator.vue'
import Root from './ToggleRoot.vue'

/**
 * Toggle component with sub-components for pressable on/off buttons.
 *
 * @see https://0.vuetifyjs.com/components/actions/toggle
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { Toggle } from '@vuetify/v0'
 * </script>
 *
 * <template>
 *   <Toggle.Root>
 *     <Toggle.Indicator>✓</Toggle.Indicator>
 *     Bold
 *   </Toggle.Root>
 * </template>
 * ```
 */
export const Toggle = {
  /**
   * Group container managing selection across child Toggle.Root components.
   *
   * @see https://0.vuetifyjs.com/components/actions/toggle
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Toggle } from '@vuetify/v0'
   *   import { ref } from 'vue'
   *
   *   const alignment = ref('left')
   * </script>
   *
   * <template>
   *   <Toggle.Group v-model="alignment">
   *     <Toggle.Root value="left">Left</Toggle.Root>
   *     <Toggle.Root value="center">Center</Toggle.Root>
   *     <Toggle.Root value="right">Right</Toggle.Root>
   *   </Toggle.Group>
   * </template>
   * ```
   */
  Group,
  /**
   * Visual indicator for the pressed state.
   *
   * Renders as a span and only displays when pressed.
   * Must be used within a Toggle.Root component.
   *
   * @see https://0.vuetifyjs.com/components/actions/toggle
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Toggle } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Toggle.Root>
   *     <Toggle.Indicator>✓</Toggle.Indicator>
   *   </Toggle.Root>
   * </template>
   * ```
   */
  Indicator,
  /**
   * Pressable toggle button with on/off state.
   *
   * Supports standalone mode with v-model (boolean) or group mode
   * within Toggle.Group where pressed state is derived from selection.
   *
   * @see https://0.vuetifyjs.com/components/actions/toggle
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Toggle } from '@vuetify/v0'
   *   import { ref } from 'vue'
   *
   *   const bold = ref(false)
   * </script>
   *
   * <template>
   *   <Toggle.Root v-model="bold">Bold</Toggle.Root>
   * </template>
   * ```
   */
  Root,
}
