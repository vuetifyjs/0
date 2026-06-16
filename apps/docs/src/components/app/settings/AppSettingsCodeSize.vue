<script setup lang="ts">
  // Framework
  import { Button } from '@vuetify/v0'

  // Composables
  import { useSettings, type CodeSize } from '@/composables/useSettings'

  const settings = useSettings()

  const sizes: { value: CodeSize, label: string, icon: string }[] = [
    { value: 'small', label: 'Small', icon: 'size-small' },
    { value: 'medium', label: 'Medium', icon: 'size-medium' },
    { value: 'large', label: 'Large', icon: 'size-large' },
  ]
</script>

<template>
  <section>
    <AppSettingsHeader icon="size-medium" title="Code Size" />

    <Button.Group
      v-model="settings.codeSize.value"
      class="flex items-center gap-0.5 border border-divider rounded-lg p-0.5 bg-surface"
      label="Code size"
      mandatory
    >
      <Button.Root
        v-for="option in sizes"
        :key="option.value"
        class="flex-1 flex items-center justify-center gap-2 px-2.5 py-1 text-xs font-medium rounded-md transition-colors text-on-surface-variant hover:text-on-surface data-[selected]:bg-primary data-[selected]:text-on-primary"
        :value="option.value"
      >
        <AppIcon :icon="option.icon" :size="16" />
        <span>{{ option.label }}</span>
      </Button.Root>
    </Button.Group>

    <p class="text-xs text-on-surface-variant/60 mt-2">
      Font size for code blocks
    </p>
  </section>
</template>
