// Components
export { default as SwitchGroup } from './SwitchGroup.vue'
export { default as SwitchHiddenInput } from './SwitchHiddenInput.vue'
export { default as SwitchRoot } from './SwitchRoot.vue'
export { default as SwitchSelectAll } from './SwitchSelectAll.vue'
export { default as SwitchThumb } from './SwitchThumb.vue'
export { default as SwitchTrack } from './SwitchTrack.vue'

// Context helpers
export { provideSwitchGroup, useSwitchGroup } from './SwitchGroup.vue'
export { provideSwitchRoot, useSwitchRoot } from './SwitchRoot.vue'

// Types
export type { SwitchGroupProps, SwitchGroupSlotProps } from './SwitchGroup.vue'
export type { SwitchHiddenInputProps } from './SwitchHiddenInput.vue'
export type { SwitchRootContext, SwitchRootProps, SwitchRootSlotProps, SwitchState } from './SwitchRoot.vue'
export type { SwitchSelectAllProps, SwitchSelectAllSlotProps } from './SwitchSelectAll.vue'
export type { SwitchThumbProps, SwitchThumbSlotProps } from './SwitchThumb.vue'
export type { SwitchTrackProps, SwitchTrackSlotProps } from './SwitchTrack.vue'

// Context
import Group from './SwitchGroup.vue'
import HiddenInput from './SwitchHiddenInput.vue'
import Root from './SwitchRoot.vue'
import SelectAll from './SwitchSelectAll.vue'
import Thumb from './SwitchThumb.vue'
import Track from './SwitchTrack.vue'

/**
 * Switch component with sub-components for toggle controls.
 *
 * @see https://0.vuetifyjs.com/components/forms/switch
 *
 * @example
 * ```vue
 * <script lang="ts" setup>
 *   import { Switch } from '@vuetify/v0'
 *   import { ref } from 'vue'
 *
 *   const enabled = ref(false)
 * </script>
 *
 * <template>
 *   <label>
 *     <Switch.Root v-model="enabled">
 *       <Switch.Track>
 *         <Switch.Thumb />
 *       </Switch.Track>
 *     </Switch.Root>
 *     Enable notifications
 *   </label>
 * </template>
 * ```
 */
export const Switch = {
  /**
   * Group component for managing multiple switches with tri-state support.
   *
   * @see https://0.vuetifyjs.com/components/forms/switch
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Switch } from '@vuetify/v0'
   *   import { ref } from 'vue'
   *
   *   const selected = ref<string[]>([])
   * </script>
   *
   * <template>
   *   <Switch.Group v-model="selected">
   *     <label>
   *       <Switch.Root value="a">
   *         <Switch.Track><Switch.Thumb /></Switch.Track>
   *       </Switch.Root>
   *       Option A
   *     </label>
   *     <label>
   *       <Switch.Root value="b">
   *         <Switch.Track><Switch.Thumb /></Switch.Track>
   *       </Switch.Root>
   *       Option B
   *     </label>
   *   </Switch.Group>
   * </template>
   * ```
   */
  Group,
  /**
   * Hidden input component for form submission.
   *
   * Auto-rendered by Root when `name` prop is provided.
   * Can also be used explicitly for custom form integration.
   *
   * @see https://0.vuetifyjs.com/components/forms/switch
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Switch } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Switch.Root>
   *     <Switch.Track><Switch.Thumb /></Switch.Track>
   *     <Switch.HiddenInput name="notifications" value="on" />
   *   </Switch.Root>
   * </template>
   * ```
   */
  HiddenInput,
  /**
   * Root component for individual switches.
   *
   * Renders as a button with `role="switch"` and proper ARIA attributes.
   * Handles click/keyboard interactions. Supports standalone mode with
   * v-model or group mode within Switch.Group. When `name` prop is
   * provided, automatically renders a hidden input for form submission.
   *
   * @see https://0.vuetifyjs.com/components/forms/switch
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Switch } from '@vuetify/v0'
   *   import { ref } from 'vue'
   *
   *   const enabled = ref(false)
   * </script>
   *
   * <template>
   *   <label>
   *     <Switch.Root v-model="enabled">
   *       <Switch.Track>
   *         <Switch.Thumb />
   *       </Switch.Track>
   *     </Switch.Root>
   *     Enable notifications
   *   </label>
   * </template>
   * ```
   */
  Root,
  /**
   * Select-all toggle for group multi-selection.
   *
   * Binds to parent Switch.Group's aggregate state. Reflects
   * isAllSelected/isMixed and calls toggleAll on click. Does NOT
   * register as a group item. Must be used within a Switch.Group.
   *
   * @see https://0.vuetifyjs.com/components/forms/switch
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Switch } from '@vuetify/v0'
   *   import { ref } from 'vue'
   *
   *   const selected = ref<string[]>([])
   * </script>
   *
   * <template>
   *   <Switch.Group v-model="selected">
   *     <label>
   *       <Switch.SelectAll label="Toggle all">
   *         <Switch.Track><Switch.Thumb /></Switch.Track>
   *       </Switch.SelectAll>
   *       Select all
   *     </label>
   *
   *     <label>
   *       <Switch.Root value="a">
   *         <Switch.Track><Switch.Thumb /></Switch.Track>
   *       </Switch.Root>
   *       Option A
   *     </label>
   *   </Switch.Group>
   * </template>
   * ```
   */
  SelectAll,
  /**
   * Sliding knob indicator for switches.
   *
   * Renders as a span with `data-state` attribute for CSS styling.
   * Hidden via `visibility: hidden` when unchecked and not mixed.
   * Must be used within a Switch.Root or Switch.SelectAll.
   *
   * @see https://0.vuetifyjs.com/components/forms/switch
   *
   * @example
   * ```vue
   * <Switch.Root v-model="enabled">
   *   <Switch.Track>
   *     <Switch.Thumb />
   *   </Switch.Track>
   * </Switch.Root>
   * ```
   */
  Thumb,
  /**
   * Track/rail component for switches.
   *
   * Always visible, provides `data-state` attribute for CSS styling.
   * Must be used within a Switch.Root or Switch.SelectAll.
   *
   * @see https://0.vuetifyjs.com/components/forms/switch
   *
   * @example
   * ```vue
   * <Switch.Root v-model="enabled">
   *   <Switch.Track>
   *     <Switch.Thumb />
   *   </Switch.Track>
   * </Switch.Root>
   * ```
   */
  Track,
}
