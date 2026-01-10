<script setup lang="ts">
  // Framework
  import { createSingle } from '@vuetify/v0'

  // Composables
  import { useSettings, type PackageManager } from '@/composables/useSettings'

  // Utilities
  import { watch } from 'vue'

  const { packageManager } = useSettings()

  const packageManagerOptions = [
    { id: 'pnpm', value: 'pnpm' as PackageManager, label: 'pnpm' },
    { id: 'npm', value: 'npm' as PackageManager, label: 'npm' },
    { id: 'yarn', value: 'yarn' as PackageManager, label: 'yarn' },
    { id: 'bun', value: 'bun' as PackageManager, label: 'bun' },
  ]

  const packageManagerSingle = createSingle({ mandatory: true })
  packageManagerSingle.onboard(packageManagerOptions)
  packageManagerSingle.select(packageManager.value)

  watch(() => packageManagerSingle.selectedValue.value, val => {
    if (val) packageManager.value = val as PackageManager
  })
</script>

<template>
  <section>
    <h3 class="flex items-center gap-2 text-sm font-medium text-on-surface-variant mb-3">
      <AppIcon icon="download" size="16" />
      <span>Package Manager</span>
    </h3>
    <div aria-label="Package manager" class="grid grid-cols-4 gap-2" role="radiogroup">
      <button
        v-for="option in packageManagerOptions"
        :key="option.id"
        :aria-checked="packageManagerSingle.selectedId.value === option.id"
        :class="[
          'flex items-center justify-center px-2 py-2 rounded-lg border transition-colors text-sm font-mono',
          packageManagerSingle.selectedId.value === option.id
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-divider hover:border-primary/50 text-on-surface',
        ]"
        role="radio"
        type="button"
        @click="packageManagerSingle.select(option.id)"
      >
        {{ option.label }}
      </button>
    </div>
    <p class="text-xs text-on-surface-variant/60 mt-2">
      Default for code examples
    </p>
  </section>
</template>
