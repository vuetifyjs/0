<script setup lang="ts">
  import { useTheme } from '@vuetify/v0'

  const { selectedId, isDark, colors } = useTheme()
</script>

<template>
  <div class="rounded-lg border border-divider p-4 space-y-3">
    <div class="flex items-center gap-2">
      <span class="font-medium text-on-surface">{{ selectedId.value }}</span>

      <span
        class="text-xs px-2 py-0.5 rounded-full"
        :class="isDark.value ? 'bg-white/10 text-white/70' : 'bg-black/5 text-black/50'"
      >
        {{ isDark.value ? 'dark' : 'light' }}
      </span>
    </div>

    <div class="flex flex-wrap gap-2">
      <div
        v-for="(value, key) in colors.value[selectedId.value]"
        :key
        class="flex items-center gap-1.5"
      >
        <span
          class="size-4 rounded-sm border border-divider shrink-0"
          :style="{ backgroundColor: value }"
        />

        <span class="text-xs font-mono text-on-surface-variant">{{ key }}</span>
      </div>
    </div>
  </div>
</template>
