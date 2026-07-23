<script lang="ts">
  export interface EmCardTitleProps {
    as?: string
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'EmCardTitle' })

  const { as = 'h3' } = defineProps<EmCardTitleProps>()
</script>

<template>
  <component :is="as" class="emerald-card__title">
    <slot />
  </component>
</template>

<style scoped>
.emerald-card__title {
  margin: 0;
  font: var(--emerald-text-h4-weight) var(--emerald-text-h4-size) / var(--emerald-text-h4-height) var(--emerald-font-sans);
  letter-spacing: 0;
  color: var(--emerald-on-surface);
}
</style>
