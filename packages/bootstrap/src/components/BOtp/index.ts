export type { BOtpProps } from './BOtp.vue'

/**
 * Bootstrap 6 one-time password field. `.otp` of `.otp-input` boxes.
 * `v-model` is the joined string.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { BOtp } from '@paper/bootstrap'
 *   import { shallowRef } from 'vue'
 *
 *   const code = shallowRef('')
 * </script>
 *
 * <template>
 *   <BOtp v-model="code" />
 * </template>
 * ```
 */
export { default as BOtp } from './BOtp.vue'
