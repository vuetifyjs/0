export { default as ProgressBuffer } from './ProgressBuffer.vue'

export { default as ProgressFill } from './ProgressFill.vue'

export { default as ProgressHiddenInput } from './ProgressHiddenInput.vue'

export { default as ProgressLabel } from './ProgressLabel.vue'

export { default as ProgressRoot } from './ProgressRoot.vue'
export { provideProgressRoot, useProgressRoot } from './ProgressRoot.vue'

export { default as ProgressTrack } from './ProgressTrack.vue'

export { default as ProgressValue } from './ProgressValue.vue'

export type { ProgressBufferProps, ProgressBufferSlotProps } from './ProgressBuffer.vue'
export type { ProgressFillProps, ProgressFillSlotProps } from './ProgressFill.vue'
export type { ProgressHiddenInputProps } from './ProgressHiddenInput.vue'
export type { ProgressLabelProps, ProgressLabelSlotProps } from './ProgressLabel.vue'
export type { ProgressRootContext, ProgressRootProps, ProgressRootSlotProps } from './ProgressRoot.vue'
export type { ProgressTrackProps, ProgressTrackSlotProps } from './ProgressTrack.vue'
export type { ProgressValueProps, ProgressValueSlotProps } from './ProgressValue.vue'

// Context
import Buffer from './ProgressBuffer.vue'
import Fill from './ProgressFill.vue'
import HiddenInput from './ProgressHiddenInput.vue'
import Label from './ProgressLabel.vue'
import Root from './ProgressRoot.vue'
import Track from './ProgressTrack.vue'
import Value from './ProgressValue.vue'

/**
 * Progress component with sub-components for building progress bars and indicators.
 *
 * Provides a headless, accessible progress indicator with determinate,
 * indeterminate, and buffer modes. Supports segmented tracks, custom
 * value formatting, and full ARIA compliance. Uses `createProgress`
 * internally for value management and exposes state via data attributes
 * for CSS-only styling.
 *
 * @see https://0.vuetifyjs.com/components/progress
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { Progress } from '@vuetify/v0'
 *   import { shallowRef } from 'vue'
 *
 *   const value = shallowRef(60)
 * </script>
 *
 * <template>
 *   <Progress.Root :model-value="value">
 *     <Progress.Track>
 *       <Progress.Fill />
 *     </Progress.Track>
 *     <Progress.Value />
 *   </Progress.Root>
 * </template>
 * ```
 */
export const Progress = {
  /**
   * Root component for progress indicators.
   *
   * Creates progress context, provides it to child components, and
   * bridges v-model. Manages value clamping, percentage calculation,
   * and ARIA attributes. Supports determinate, indeterminate, and
   * buffer modes. When `name` prop is provided, automatically renders
   * a hidden input for form submission.
   *
   * @see https://0.vuetifyjs.com/components/progress
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Progress } from '@vuetify/v0'
   *   import { shallowRef } from 'vue'
   *
   *   const value = shallowRef(60)
   * </script>
   *
   * <template>
   *   <Progress.Root :model-value="value" :max="100">
   *     <Progress.Track>
   *       <Progress.Fill />
   *     </Progress.Track>
   *   </Progress.Root>
   * </template>
   * ```
   */
  Root,
  /**
   * Track container for the progress bar.
   *
   * Renders the background track that contains the fill and buffer
   * elements. Supports segmented mode via the `segments` prop on Root.
   * Exposes segment data through its slot for custom rendering.
   *
   * @see https://0.vuetifyjs.com/components/progress#anatomy
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Progress } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Progress.Track>
   *     <Progress.Fill />
   *   </Progress.Track>
   * </template>
   * ```
   */
  Track,
  /**
   * Fill element representing the current progress value.
   *
   * Renders inside the Track and sizes itself to reflect the current
   * percentage. Applies `--v0-progress-fill` CSS variable for styling.
   * In indeterminate mode, omits inline sizing to allow CSS animations.
   *
   * @see https://0.vuetifyjs.com/components/progress#anatomy
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Progress } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Progress.Fill class="bg-blue-500 h-full transition-all" />
   * </template>
   * ```
   */
  Fill,
  /**
   * Buffer indicator for streaming or loading progress.
   *
   * Renders a secondary fill representing buffered content ahead of
   * the primary progress. Applies `--v0-progress-buffer` CSS variable
   * for styling. Useful for media players and file uploads.
   *
   * @see https://0.vuetifyjs.com/components/progress#buffer
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Progress } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Progress.Track>
   *     <Progress.Buffer class="bg-blue-200 h-full" />
   *     <Progress.Fill class="bg-blue-500 h-full" />
   *   </Progress.Track>
   * </template>
   * ```
   */
  Buffer,
  /**
   * Text display for the current progress value.
   *
   * Renders the formatted progress value as text. Uses the `format`
   * function from Root context if provided, otherwise displays the
   * raw percentage. Supports custom formatting via the default slot.
   *
   * @see https://0.vuetifyjs.com/components/progress#value-display
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Progress } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Progress.Value v-slot="{ percent }">
   *     {{ Math.round(percent) }}%
   *   </Progress.Value>
   * </template>
   * ```
   */
  Value,
  /**
   * Accessible label for the progress indicator.
   *
   * Associates a visible label with the progress Root via `aria-labelledby`.
   * Renders as a `<label>` element by default. Exposes progress state
   * through its slot for dynamic label content.
   *
   * @see https://0.vuetifyjs.com/components/progress#accessibility
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Progress } from '@vuetify/v0'
   * </script>
   *
   * <template>
   *   <Progress.Label>Loading...</Progress.Label>
   * </template>
   * ```
   */
  Label,
  /**
   * Hidden native input for form submission.
   *
   * Auto-rendered by Root when the `name` prop is provided. Submits
   * the current numeric progress value as part of the form. Can also
   * be used explicitly for custom form integration scenarios where
   * you need manual control over the hidden input placement.
   *
   * @see https://0.vuetifyjs.com/components/progress#form-integration
   * @internal
   *
   * @example
   * ```vue
   * <script setup lang="ts">
   *   import { Progress } from '@vuetify/v0'
   *   import { shallowRef } from 'vue'
   *
   *   const value = shallowRef(75)
   * </script>
   *
   * <template>
   *   <Progress.Root :model-value="value" name="upload-progress">
   *     <Progress.Track>
   *       <Progress.Fill />
   *     </Progress.Track>
   *   </Progress.Root>
   * </template>
   * ```
   */
  HiddenInput,
}
