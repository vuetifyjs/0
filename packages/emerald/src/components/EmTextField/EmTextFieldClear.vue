<script lang="ts">
  // Framework
  import { useInputRoot } from '@vuetify/v0'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { InputRootContext } from '@vuetify/v0'

  export interface EmTextFieldClearProps {
    ariaLabel?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmTextFieldClear' })

  const { ariaLabel = 'Clear' } = defineProps<EmTextFieldClearProps>()

  let root: InputRootContext | null = null
  try {
    root = useInputRoot('v0:input:root')
  } catch {
    // standalone usage, no root context
  }

  const isVisible = toRef(() => Boolean(root?.isDirty.value) && !root?.isDisabled.value && !root?.isReadonly.value)

  function onClear () {
    if (!root) return
    root.value.value = ''
  }
</script>

<template>
  <button
    v-if="isVisible"
    :aria-label
    class="emerald-text-field__clear"
    tabindex="-1"
    type="button"
    @click="onClear"
  >
    <svg
      aria-hidden="true"
      fill="none"
      height="14"
      viewBox="0 0 14 14"
      width="14"
    >
      <path
        d="M3.5 3.5l7 7m0-7l-7 7"
        stroke="currentColor"
        stroke-linecap="round"
        stroke-width="1.5"
      />
    </svg>
  </button>
</template>

<style>
.emerald-text-field__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.5);
  cursor: pointer;
  outline: none;
  transition: background-color 120ms ease, color 120ms ease;
}

.emerald-text-field__clear:hover {
  background: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.08);
  color: rgb(var(--emerald-neutral-channels, 26 28 30) / 0.8);
}

.emerald-text-field__clear:focus-visible {
  box-shadow: 0 0 0 2px rgb(var(--emerald-primary-500-channels, 124 92 246) / 0.35);
}
</style>
