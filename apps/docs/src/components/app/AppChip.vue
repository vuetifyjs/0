<script setup lang="ts">
  interface AppChipProps {
    color?: string
    icon?: string
    text?: string
  }

  defineProps<AppChipProps>()
</script>

<template>
  <div class="border cursor-pointer inline-flex items-center rounded-2xl px-2 text-xs py-1 gap-1 bg-surface hover:bg-surface-tint">
    <AppIcon
      v-if="icon"
      :class="color"
      :icon="icon"
      size="1.2em"
    />

    <slot>
      {{ text }}
    </slot>
  </div>
</template>
