<script lang="ts">
  // Framework
  import { useInputRoot } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { InputRootContext } from '@vuetify/v0'

  export interface EmTextFieldCounterProps {
    current?: number
    max?: number
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextFieldCounter' })

  const { current, max } = defineProps<EmTextFieldCounterProps>()

  let root: InputRootContext | null = null
  try {
    root = useInputRoot('v0:input:root')
  } catch {
    // standalone usage, no root context
  }

  const count = toRef(() => current ?? root?.value.value.length ?? 0)
</script>

<template>
  <div class="emerald-text-field__counter">
    <span>{{ count }}</span>

    <template v-if="max != null">
      <span class="emerald-text-field__counter-divider">/</span>
      <span>{{ max }}</span>
    </template>
  </div>
</template>

<style>
.emerald-text-field__counter {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 11px;
  line-height: 16px;
  color: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.55);
  align-self: flex-end;
}

.emerald-text-field__counter-divider {
  opacity: 0.5;
}
</style>
