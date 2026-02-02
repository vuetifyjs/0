<script setup lang="ts">
  // Composables
  import { useSettings, type PackageManager } from '@/composables/useSettings'

  // Types
  import type { SingleSelectOption } from './AppSettingsSingleSelect.vue'

  const settings = useSettings()

  const packageManagerOptions: SingleSelectOption<PackageManager>[] = [
    { id: 'pnpm', value: 'pnpm', label: 'pnpm' },
    { id: 'npm', value: 'npm', label: 'npm' },
    { id: 'yarn', value: 'yarn', label: 'yarn' },
    { id: 'bun', value: 'bun', label: 'bun' },
  ]
</script>

<template>
  <section>
    <AppSettingsHeader icon="download" title="Package Manager" />
    <AppSettingsSingleSelect
      v-model="settings.packageManager.value"
      aria-label="Package manager"
      :columns="4"
      mono
      :options="packageManagerOptions"
    />
    <p class="text-xs text-on-surface-variant/60 mt-2">
      Default for code examples
    </p>
  </section>
</template>
