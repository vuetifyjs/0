export { default as ButtonContent } from './ButtonContent.vue'

export { default as ButtonGroup } from './ButtonGroup.vue'
export { provideButtonGroup, useButtonGroup } from './ButtonGroup.vue'

export { default as ButtonHiddenInput } from './ButtonHiddenInput.vue'

export { default as ButtonIcon } from './ButtonIcon.vue'

export { default as ButtonLoading } from './ButtonLoading.vue'

export { default as ButtonRoot } from './ButtonRoot.vue'
export { provideButtonRoot, useButtonRoot } from './ButtonRoot.vue'

export type { ButtonContentProps, ButtonContentSlotProps } from './ButtonContent.vue'
export type { ButtonGroupProps, ButtonGroupSlotProps } from './ButtonGroup.vue'
export type { ButtonHiddenInputProps } from './ButtonHiddenInput.vue'
export type { ButtonIconProps, ButtonIconSlotProps } from './ButtonIcon.vue'
export type { ButtonLoadingProps, ButtonLoadingSlotProps } from './ButtonLoading.vue'
export type { ButtonRootContext, ButtonRootProps, ButtonRootSlotProps } from './ButtonRoot.vue'

// Context
import Content from './ButtonContent.vue'
import Group from './ButtonGroup.vue'
import HiddenInput from './ButtonHiddenInput.vue'
import Icon from './ButtonIcon.vue'
import Loading from './ButtonLoading.vue'
import Root from './ButtonRoot.vue'

/**
 * Button component with sub-components for interactive button controls.
 *
 * @see https://0.vuetifyjs.com/components/actions/button
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { Button } from '@vuetify/v0'
 * </script>
 *
 * <template>
 *   <Button.Root>
 *     <Button.Content>Click me</Button.Content>
 *   </Button.Root>
 * </template>
 * ```
 */
export const Button = {
  /**
   * Default content area for buttons.
   *
   * Registers with Root's internal selection as the fallback.
   * Always rendered, selected when Loading is not active.
   *
   * @see https://0.vuetifyjs.com/components/actions/button
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Button } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Button.Root>
   *     <Button.Content>Submit</Button.Content>
   *   </Button.Root>
   * </template>
   * ```
   */
  Content,
  /**
   * Selection container for toggle button groups.
   *
   * @see https://0.vuetifyjs.com/components/actions/button
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Button } from '@vuetify/v0'
   *   import { ref } from 'vue'
   *
   *   const selected = ref<string>()
   * </script>
   *
   * <template>
   *   <Button.Group v-model="selected">
   *     <Button.Root value="bold">B</Button.Root>
   *     <Button.Root value="italic">I</Button.Root>
   *   </Button.Group>
   * </template>
   * ```
   */
  Group,
  /**
   * Hidden input component for form submission.
   *
   * @see https://0.vuetifyjs.com/components/actions/button
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Button } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Button.Group>
   *     <Button.Root value="yes">
   *       Yes
   *       <Button.HiddenInput name="answer" />
   *     </Button.Root>
   *   </Button.Group>
   * </template>
   * ```
   */
  HiddenInput,
  /**
   * Icon wrapper with accessibility enforcement.
   *
   * Sets `aria-hidden="true"` on itself. Detects solo buttons
   * and warns when `aria-label` is missing on Root.
   *
   * @see https://0.vuetifyjs.com/components/actions/button
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Button } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Button.Root aria-label="Close">
   *     <Button.Icon>✕</Button.Icon>
   *   </Button.Root>
   * </template>
   * ```
   */
  Icon,
  /**
   * Loading indicator that becomes visible after the grace period.
   *
   * Registers with Root's internal selection. Enabled and selected
   * when Root's isLoading becomes true (after grace period).
   *
   * @see https://0.vuetifyjs.com/components/actions/button
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Button } from '@vuetify/v0'
   *   import { shallowRef } from 'vue'
   *
   *   const loading = shallowRef(false)
   * </script>
   *
   * <template>
   *   <Button.Root :loading @click="loading = true">
   *     <Button.Loading>Saving...</Button.Loading>
   *     <Button.Content>Save</Button.Content>
   *   </Button.Root>
   * </template>
   * ```
   */
  Loading,
  /**
   * Root component for buttons.
   *
   * Renders as a button with proper ARIA attributes. Supports
   * disabled, readonly, passive, and loading states. When inside
   * a Button.Group, registers as a toggle button.
   *
   * @see https://0.vuetifyjs.com/components/actions/button
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Button } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Button.Root>
   *     <Button.Content>Click me</Button.Content>
   *   </Button.Root>
   * </template>
   * ```
   */
  Root,
}
