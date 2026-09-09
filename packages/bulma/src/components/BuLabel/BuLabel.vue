/**
 * @module BuLabel
 *
 * @remarks
 * Bulma `.label` — hand-rolled markup (v0 ships no Input.Label part). When an
 * ambient `Input.Root` context exists, `for` falls back to the input's id.
 */

<script lang="ts">
  // Framework
  import { useInputRoot } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { InputRootContext } from '@vuetify/v0'

  export type BuLabelSize = 'small' | 'normal' | 'medium' | 'large'

  export interface BuLabelProps {
    /** Explicit target id — falls back to the ambient Input.Root id */
    for?: string
    /** Namespace of the ambient Input.Root context */
    namespace?: string
    /** Size modifier: `is-{size}` */
    size?: BuLabelSize
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'BuLabel' })

  defineSlots<{
    default: () => any
  }>()

  const {
    for: _for,
    namespace = 'v0:input:root',
    size,
  } = defineProps<BuLabelProps>()

  // Optional injection: standalone labels render without a `for` attribute
  // (a null default returns instead of throwing — only undefined throws)
  const root = useInputRoot(namespace, null as unknown as InputRootContext) as InputRootContext | null

  const target = toRef(() => _for ?? (root ? String(root.id) : undefined))
</script>

<template>
  <label class="label" :class="size && `is-${size}`" :for="target">
    <slot />
  </label>
</template>
