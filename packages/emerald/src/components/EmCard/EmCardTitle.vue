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

<style>
.emerald-card__title {
  margin: 0;
  font-family: Manrope, system-ui, -apple-system, sans-serif;
  font-size: 20px;
  font-weight: 600;
  line-height: 26px;
  letter-spacing: -0.2px;
  color: var(--emerald-neutral-700);
}
</style>
