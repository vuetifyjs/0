<script setup lang="ts">
  defineProps<{
    icon: string
    title: string
    label: string
    /** Description shown inside the toggle row */
    description?: string
    /** Hint shown below the toggle */
    hint?: string
  }>()

  const model = defineModel<boolean>({ required: true })
</script>

<template>
  <section>
    <AppSettingsHeader :icon :title />
    <AppSettingsToggle v-model="model" :description :label />
    <p v-if="hint" class="text-xs text-on-surface-variant/60 mt-2">
      {{ hint }}
    </p>
  </section>
</template>
