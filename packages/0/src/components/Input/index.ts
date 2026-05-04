export { default as InputControl } from './InputControl.vue'
export { default as InputDescription } from './InputDescription.vue'
export { default as InputError } from './InputError.vue'
export { default as InputRoot } from './InputRoot.vue'
export { provideInputRoot, useInputRoot } from './InputRoot.vue'

// Types
export type { InputControlProps, InputControlSlotProps } from './InputControl.vue'
export type { InputDescriptionProps, InputDescriptionSlotProps } from './InputDescription.vue'
export type { InputErrorProps, InputErrorSlotProps } from './InputError.vue'
export type { InputState } from '#v0/composables/createInput'
export type { InputRootContext, InputRootProps, InputRootSlotProps, ValidateEvent, ValidateOn } from './InputRoot.vue'

// Context
import Control from './InputControl.vue'
import Description from './InputDescription.vue'
import Error from './InputError.vue'
import Root from './InputRoot.vue'

/**
 * Input component with sub-components for text input controls.
 *
 * @see https://0.vuetifyjs.com/components/forms/input
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { Input } from '@vuetify/v0'
 *   import { ref } from 'vue'
 *
 *   const email = ref('')
 * </script>
 *
 * <template>
 *   <Input.Root
 *     v-model="email"
 *     label="Email"
 *     :rules="[(v) => !!v || 'Required', (v) => /.+@.+/.test(v) || 'Invalid email']"
 *   >
 *     <Input.Control />
 *     <Input.Description>We'll never share your email.</Input.Description>
 *     <Input.Error v-slot="{ errors }">
 *       <span v-for="error in errors" :key="error">{{ error }}</span>
 *     </Input.Error>
 *   </Input.Root>
 * </template>
 * ```
 */
export const Input = {
  /**
   * Native input element with ARIA bindings and validation triggers.
   *
   * Renders as `<input>` by default. Binds ARIA attributes from Root context
   * and triggers validation on blur or input based on Root's validateOn prop.
   *
   * @see https://0.vuetifyjs.com/components/forms/input
   *
   * @example
   * ```vue
   * <Input.Root v-model="value" label="Name">
   *   <Input.Control />
   * </Input.Root>
   * ```
   */
  Control,
  /**
   * Help text component connected via aria-describedby.
   *
   * Auto-generates an ID that Input.Control references in its
   * aria-describedby attribute for accessibility.
   *
   * @see https://0.vuetifyjs.com/components/forms/input
   *
   * @example
   * ```vue
   * <Input.Root v-model="value" label="Username">
   *   <Input.Control />
   *   <Input.Description>Must be 3-20 characters.</Input.Description>
   * </Input.Root>
   * ```
   */
  Description,
  /**
   * Error message component with aria-live announcements.
   *
   * Renders validation errors from Root's validation context.
   * Connected to Control via aria-errormessage. Uses aria-live="polite"
   * for screen reader announcements when errors appear.
   *
   * @see https://0.vuetifyjs.com/components/forms/input
   *
   * @example
   * ```vue
   * <Input.Root v-model="value" :rules="[(v) => !!v || 'Required']">
   *   <Input.Control />
   *   <Input.Error v-slot="{ errors }">
   *     <span v-for="error in errors" :key="error">{{ error }}</span>
   *   </Input.Error>
   * </Input.Root>
   * ```
   */
  Error,
  /**
   * Root component for text inputs with validation.
   *
   * Creates a validation context, registers a single field, and provides
   * context to child components. Supports v-model for value binding and
   * auto-registers with parent form when used inside createForm.
   *
   * @see https://0.vuetifyjs.com/components/forms/input
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Input } from '@vuetify/v0'
   *   import { ref } from 'vue'
   *
   *   const name = ref('')
   * </script>
   *
   * <template>
   *   <Input.Root v-model="name" label="Full name" :rules="[(v) => !!v || 'Required']">
   *     <Input.Control />
   *     <Input.Error v-slot="{ errors }">
   *       <span v-for="error in errors" :key="error">{{ error }}</span>
   *     </Input.Error>
   *   </Input.Root>
   * </template>
   * ```
   */
  Root,
}
