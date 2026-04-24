<script setup lang="ts">
  import { shallowRef, toRef } from 'vue'
  import Preview from './Preview.vue'
  import { palette, theme } from './context'

  const colors = toRef(() => theme.colors.value[theme.selectedId.value!] ?? {})
  const copied = shallowRef<string | null>(null)

  const customs = [
    { id: 'coral', primary: '#ff6b6b', accent: '#ffd93d', surface: '#fff5f5', card: '#ffffff', text: '#1a1a2e', muted: '#6c757d', dark: false },
    { id: 'cyber', primary: '#00f5d4', accent: '#f15bb5', surface: '#0b0c10', card: '#1a1b26', text: '#e0e0e0', muted: '#7f8c8d', dark: true },
  ]

  function onCopy (hex: string) {
    navigator.clipboard?.writeText(hex)
    copied.value = hex
    setTimeout(() => {
      copied.value = null
    }, 1000)
  }

  function onRegister (custom: typeof customs[number]) {
    const { id, dark, ...colors } = custom
    if (theme.has(id)) {
      theme.select(id)
      return
    }
    theme.register({ id, dark, colors })
    theme.select(id)
  }
</script>

<template>
  <div class="space-y-5">
    <!-- Theme selector -->
    <div class="flex flex-wrap items-center gap-2">
      <button
        v-for="id in theme.keys()"
        :key="id"
        class="px-3 py-1.5 text-sm rounded-lg border transition-all"
        :class="theme.selectedId.value === id
          ? 'border-primary bg-primary/10 text-primary font-medium'
          : 'border-divider text-on-surface-variant hover:border-primary/50'"
        @click="theme.select(id)"
      >
        {{ id }}
      </button>

      <button
        class="px-3 py-1.5 text-sm rounded-lg border border-divider text-on-surface-variant hover:border-primary/50 transition-colors"
        @click="theme.cycle()"
      >
        Cycle
      </button>
    </div>

    <!-- Live preview -->
    <div
      class="rounded-xl pa-4 transition-colors duration-300"
      :style="{ backgroundColor: colors.surface }"
    >
      <Preview :colors />
    </div>

    <!-- Swatches -->
    <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
      <button
        v-for="(hex, name) in colors"
        :key="name"
        class="group relative rounded-lg overflow-hidden text-left transition-transform hover:scale-105 border border-divider"
        @click="onCopy(hex)"
      >
        <div class="h-8" :style="{ backgroundColor: hex }" />

        <div class="px-2 py-1">
          <div class="text-[11px] font-medium text-on-surface capitalize">{{ name }}</div>
          <div class="text-[10px] text-on-surface-variant font-mono">{{ hex }}</div>
        </div>

        <div
          v-if="copied === hex"
          class="absolute inset-0 flex items-center justify-center bg-black/60 text-white text-xs font-medium rounded-lg"
        >
          Copied
        </div>
      </button>
    </div>

    <!-- Palette tokens -->
    <details class="group">
      <summary class="text-xs font-medium text-on-surface-variant cursor-pointer select-none">
        Palette tokens
      </summary>

      <div class="mt-2 flex flex-wrap gap-1.5">
        <div
          v-for="(shades, name) in palette"
          :key="name"
          class="flex items-center gap-1"
        >
          <div
            v-for="(hex, shade) in shades"
            :key="shade"
            class="size-5 rounded-sm border border-black/10"
            :style="{ backgroundColor: hex }"
            :title="`{palette.${name}.${shade}} → ${hex}`"
          />

          <span class="text-[10px] text-on-surface-variant ml-0.5">{{ name }}</span>
        </div>
      </div>
    </details>

    <!-- Dynamic registration -->
    <div class="flex items-center gap-2">
      <button
        v-for="custom in customs"
        :key="custom.id"
        class="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-dashed border-divider text-on-surface-variant hover:border-primary/50 transition-colors"
        @click="onRegister(custom)"
      >
        <div class="size-3 rounded-full" :style="{ backgroundColor: custom.primary }" />
        Register "{{ custom.id }}"
      </button>
    </div>

    <!-- Meta -->
    <div class="flex items-center justify-between text-xs text-on-surface-variant">
      <span>{{ theme.isDark.value ? 'Dark' : 'Light' }} mode</span>
      <span>{{ theme.size }} themes</span>
    </div>
  </div>
</template>
