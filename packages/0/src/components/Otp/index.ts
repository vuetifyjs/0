export { default as OtpHiddenInput } from './OtpHiddenInput.vue'

export { default as OtpItem } from './OtpItem.vue'

export { default as OtpRoot } from './OtpRoot.vue'
export { provideOtpRoot, useOtpRoot } from './OtpRoot.vue'

export type { OtpHiddenInputProps } from './OtpHiddenInput.vue'
export type { OtpItemProps, OtpItemSlotProps, OtpItemState } from './OtpItem.vue'
export type { OtpRootContext, OtpRootExpose, OtpRootProps, OtpRootSlotProps } from './OtpRoot.vue'

// Context
import HiddenInput from './OtpHiddenInput.vue'
import Item from './OtpItem.vue'
import Root from './OtpRoot.vue'

/**
 * Otp component with sub-components for building one-time-password /
 * verification-code inputs.
 *
 * Provides a headless, accessible OTP field with auto-advance on input,
 * backspace-back and arrow-key navigation between boxes, paste
 * distribution across boxes, per-character pattern matching, and a
 * decisional async `onComplete` hook. Uses `createOtp` internally for
 * value management.
 *
 * @see https://0.vuetifyjs.com/components/forms/otp
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { Otp } from '@vuetify/v0'
 *   import { shallowRef } from 'vue'
 *
 *   const code = shallowRef('')
 * </script>
 *
 * <template>
 *   <Otp.Root v-model="code" :length="6">
 *     <Otp.Item
 *       v-for="i in 6"
 *       :key="i"
 *       :index="i - 1"
 *     />
 *   </Otp.Root>
 * </template>
 * ```
 */
export const Otp = {
  /**
   * Root component for OTP fields.
   *
   * Creates OTP context via `createOtp`, provides it to child
   * components, and bridges v-model. Tracks per-item element refs so
   * Item can move focus between boxes. When `name` prop is provided,
   * automatically renders a hidden input for form submission.
   *
   * @see https://0.vuetifyjs.com/components/forms/otp
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Otp } from '@vuetify/v0'
   *   import { shallowRef } from 'vue'
   *
   *   const code = shallowRef('')
   *
   *   const verify = async (value: string) => {
   *     const res = await fetch('/verify', { method: 'POST', body: value })
   *     return res.ok
   *   }
   * </script>
   *
   * <template>
   *   <Otp.Root v-model="code" :length="6" :on-complete="verify">
   *     <Otp.Item v-for="i in 6" :key="i" :index="i - 1" />
   *   </Otp.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * A single character box within an OTP field.
   *
   * Consumes Otp context and renders its character from the value at
   * `index`. Handles auto-advance to the next box on input,
   * backspace-back when empty, arrow-key movement between boxes, and
   * paste distribution across siblings starting at this box. Exposes
   * fill state via `data-state` for CSS-only styling.
   *
   * @see https://0.vuetifyjs.com/components/forms/otp#anatomy
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Otp } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Otp.Item
   *     :index="0"
   *     class="w-10 text-center [&[data-state=filled]]:border-primary"
   *   />
   * </template>
   * ```
   */
  Item,
  /**
   * Hidden native input for form submission.
   *
   * Auto-rendered by Root when the `name` prop is provided. Submits
   * the current joined OTP value as part of the form. Can also be
   * used explicitly for custom form integration scenarios where you
   * need manual control over the hidden input placement.
   *
   * @see https://0.vuetifyjs.com/components/forms/otp
   * @internal
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Otp } from '@vuetify/v0'
   *   import { shallowRef } from 'vue'
   *
   *   const code = shallowRef('')
   * </script>
   *
   * <template>
   *   <Otp.Root v-model="code" name="verification-code" :length="6">
   *     <Otp.Item v-for="i in 6" :key="i" :index="i - 1" />
   *   </Otp.Root>
   * </template>
   * ```
   */
  HiddenInput,
}
