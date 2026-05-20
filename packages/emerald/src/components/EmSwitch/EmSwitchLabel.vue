<script lang="ts">
  // Framework
  import { useSwitchRoot } from '@vuetify/v0'

  // Types
  import type { SwitchRootContext } from '@vuetify/v0'

  export interface EmSwitchLabelProps {
    for?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmSwitchLabel' })

  const { for: forProp } = defineProps<EmSwitchLabelProps>()

  // Optional injection — label may sit outside a SwitchRoot
  let root: SwitchRootContext<unknown> | null = null
  try {
    root = useSwitchRoot('v0:switch:root')
  } catch {
    // standalone usage, no root context
  }
</script>

<template>
  <label
    class="emerald-switch__label"
    :for="forProp ?? (root?.id as string | undefined)"
  >
    <slot />
  </label>
</template>

<style>
.emerald-switch__label {
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.4;
  color: var(--emerald-on-background, #1a1c1e);
  cursor: pointer;
  user-select: none;
}

.emerald-switch[data-disabled] .emerald-switch__label,
.emerald-switch__label[data-disabled] {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
