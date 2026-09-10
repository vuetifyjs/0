<script setup lang="ts">
  import { mdiWeatherNight, mdiWeatherSunny } from '@mdi/js'

  // Framework
  import { Switch, useTheme } from '@vuetify/v0'

  // Context
  import Icon from './Icon.vue'

  // Utilities
  import { computed } from 'vue'

  const theme = useTheme()

  const isDark = computed({
    get: () => theme.isDark.value,
    set: value => theme.select(value ? 'dark' : 'light'),
  })
</script>

<template>
  <label class="inline-flex items-center gap-2 cursor-pointer select-none">
    <span class="sr-only">Toggle dark mode</span>

    <span class="text-on-surface-variant" :class="{ 'opacity-40': isDark }">
      <Icon :path="mdiWeatherSunny" :size="14" />
    </span>

    <Switch.Root
      v-model="isDark"
      :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
      class="relative inline-flex w-9 h-5 rounded-full bg-surface-variant border border-divider transition-colors data-[state=checked]:bg-primary cursor-pointer focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
    >
      <Switch.Track class="absolute inset-0 rounded-full">
        <Switch.Thumb class="absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-surface shadow transition-transform data-[state=checked]:translate-x-4" />
      </Switch.Track>
    </Switch.Root>

    <span class="text-on-surface-variant" :class="{ 'opacity-40': !isDark }">
      <Icon :path="mdiWeatherNight" :size="14" />
    </span>
  </label>
</template>
