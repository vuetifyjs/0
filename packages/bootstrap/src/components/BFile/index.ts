export type { BFileProps } from './BFile.vue'

/**
 * Bootstrap 6 file input. `.form-control` with `type="file"`. `v-model` is the `FileList`, or `null`.
 *
 * @example
 * ```vue
 * <script setup lang="ts">
 *   import { shallowRef } from 'vue'
 *   import { BFile } from '@paper/bootstrap'
 *
 *   const files = shallowRef<FileList | null>(null)
 * </script>
 *
 * <template>
 *   <BFile v-model="files" />
 * </template>
 * ```
 */
export { default as BFile } from './BFile.vue'
