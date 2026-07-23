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
  font-weight: var(--emerald-text-b3-bold-weight, 600);
  font-size: var(--emerald-text-b3-size, 12px);
  line-height: var(--emerald-text-b3-height, 18px);
  color: var(--emerald-neutral-700, #757e85);
  white-space: nowrap;
}

.emerald-progress__value[data-inside] {
  color: var(--emerald-on-secondary, #fefefe);
}
</style>
