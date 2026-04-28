<script lang="ts">
  export interface EmProgressValueProps {
    inside?: boolean
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmProgressValue' })

  const { inside = false } = defineProps<EmProgressValueProps>()
</script>

<template>
  <span
    class="emerald-progress__value"
    :data-inside="inside || undefined"
  >
    <slot />
  </span>
</template>

<style>
.emerald-progress__value {
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-weight: 600;
  font-size: 10px;
  line-height: 10px;
  color: var(--emerald-secondary-500, #94a3b8);
  white-space: nowrap;
  padding-inline: 2px;
}

.emerald-progress__value[data-inside] {
  color: var(--emerald-secondary-700, #6f7a93);
}
</style>
