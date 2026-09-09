/**
 * @module BuFileName
 *
 * @remarks
 * Bulma `span.file-name` — selected-file label from the `bulma:file` context.
 * `has-name` is Root's `filename` boolean; composing Name without it leaves
 * the CSS wrong.
 */

<script lang="ts">
  // Utilities
  import { orphan } from '../../utilities/context'
  import { toRef } from 'vue'

  // Context
  import { useBuFile } from '../BuFile/BuFile.vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuFileName' })

  defineSlots<{
    /** Override the selected-file label */
    default?: () => any
  }>()

  const file = useBuFile()

  orphan('BuFileName', 'BuFile', file)

  const filename = toRef(() => file?.filename() ?? '')
</script>

<template>
  <span class="file-name">
    <slot>{{ filename }}</slot>
  </span>
</template>
