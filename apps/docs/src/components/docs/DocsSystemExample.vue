<script lang="ts">
  // Framework
  import { useTheme } from '@vuetify/v0'

  // Context
  import DocsGenesisExample from './DocsGenesisExample.vue'

  // Utilities
  import { toRef } from 'vue'

  export interface DocsSystemExampleProps {
    /** Auto-resolve example by path (extensionless; .vue assumed) */
    filePath?: string
    /** Auto-resolve multi-file example by paths (extensions required) */
    filePaths?: string[]
    /** Display order for files (indices match filePaths) */
    fileOrders?: (number | undefined)[]
    /** Description title */
    title?: string
    /** Anchor id for deep linking */
    id?: string
    /** Enable description collapse toggle */
    collapse?: boolean
    /** Peek mode for single-file */
    peek?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'DocsSystemExample' })

  const {
    filePath,
    filePaths,
    fileOrders,
    title,
    id,
    collapse,
    peek,
  } = defineProps<DocsSystemExampleProps>()

  const theme = useTheme()
  const scheme = toRef(() => theme.isDark.value ? 'emerald-dark' : 'emerald-light')
</script>

<template>
  <DocsGenesisExample
    :id
    :collapse
    :file-orders
    :file-path
    :file-paths
    :peek
    :theme="scheme"
    :title
  >
    <template v-if="$slots.description" #description>
      <slot name="description" />
    </template>
  </DocsGenesisExample>
</template>
