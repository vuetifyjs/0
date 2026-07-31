<script setup lang="ts">
  // Framework
  import { clamp, isNumber, Slider } from '@vuetify/v0'

  import { defaultConfig } from '@/plugins/breakpoints/defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { ref, toRef } from 'vue'

  // Types
  import type { BreakpointsConfig } from '@/plugins/breakpoints/defaults'

  const FLOOR = 320

  const store = useBuilderStore()

  const config = toRef(() => {
    if (store.draft?.id === 'useBreakpoints') return store.draft.config as BreakpointsConfig
    return (store.pluginConfig.useBreakpoints as BreakpointsConfig | undefined) ?? defaultConfig
  })

  const width = ref([840])

  const px = toRef(() => width.value[0] ?? 840)

  const scale = toRef(() => {
    return Object.entries(config.value.breakpoints ?? {})
      .filter(([, value]) => isNumber(value) && Number.isFinite(value))
      .map(([name, value]) => ({ name, value }))
      .toSorted((a, b) => a.value - b.value)
  })

  const ceiling = toRef(() => {
    const last = scale.value.at(-1)?.value ?? 1920
    return Math.max(last + 400, 1280)
  })

  const segments = toRef(() => {
    return scale.value.map((entry, index) => {
      const next = scale.value[index + 1]?.value ?? ceiling.value
      const size = Math.max(((next - entry.value) / ceiling.value) * 100, 0)
      return { name: entry.name, value: entry.value, size }
    })
  })

  const active = toRef(() => {
    let current = scale.value[0] ?? null
    for (const entry of scale.value) {
      if (px.value >= entry.value) current = entry
    }
    return current
  })

  const cutoff = toRef(() => {
    const raw = config.value.mobileBreakpoint
    if (isNumber(raw)) return raw
    const named = config.value.breakpoints?.[raw]
    return isNumber(named) ? named : 0
  })

  const mobile = toRef(() => px.value < cutoff.value)

  const needle = toRef(() => `${clamp((px.value / ceiling.value) * 100, 0, 100)}%`)

  const frame = toRef(() => {
    const fraction = clamp((px.value - FLOOR) / (ceiling.value - FLOOR), 0, 1)
    return `${Math.round(30 + fraction * 70)}%`
  })
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-3">
      <Slider.Root
        v-model="width"
        class="relative flex items-center flex-1 h-5"
        :max="ceiling"
        :min="FLOOR"
        :step="1"
      >
        <Slider.Track class="relative h-1 w-full rounded-full bg-surface-variant">
          <Slider.Range class="absolute h-full rounded-full bg-primary" />
        </Slider.Track>

        <Slider.Thumb class="absolute size-4 rounded-full bg-primary shadow-sm -translate-x-1/2 focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2" />
      </Slider.Root>

      <span class="w-16 text-right font-mono text-xs text-on-surface-variant">{{ px }}px</span>
    </div>

    <div class="relative flex h-10 rounded-lg border border-divider overflow-hidden">
      <div
        v-for="segment in segments"
        :key="segment.name"
        class="flex flex-col items-center justify-center min-w-0 transition-colors"
        :class="segment.name === active?.name ? 'bg-primary/15 text-primary' : 'bg-surface text-on-surface-variant'"
        :style="{ width: `${segment.size}%` }"
      >
        <span class="text-[10px] font-semibold leading-tight truncate">{{ segment.name }}</span>
        <span class="text-[9px] font-mono leading-tight truncate">{{ segment.value }}</span>
      </div>

      <div class="absolute inset-y-0 w-px bg-primary transition-all" :style="{ left: needle }" />
    </div>

    <div class="flex items-center gap-2 text-xs">
      <span class="px-2 py-0.5 rounded-full bg-primary text-on-primary font-bold">{{ active?.name ?? '—' }}</span>

      <span class="px-2 py-0.5 rounded-full border border-divider text-on-surface-variant">
        {{ mobile ? 'mobile' : 'desktop' }}
      </span>

      <span class="ml-auto text-on-surface-variant">mobile below {{ cutoff }}px</span>
    </div>

    <div class="mx-auto transition-all" :style="{ width: frame }">
      <MiniFrame :title="`${px}px`">
        <div v-if="mobile" class="space-y-2">
          <div class="h-5 rounded-md bg-surface-variant" />
          <div class="h-14 rounded-md bg-primary/15" />
          <div class="h-8 rounded-md bg-surface-variant/70" />
          <div class="h-8 rounded-md bg-surface-variant/70" />
        </div>

        <div v-else class="flex gap-2">
          <div class="w-1/4 space-y-2">
            <div class="h-5 rounded-md bg-surface-variant" />
            <div class="h-20 rounded-md bg-surface-variant/70" />
          </div>

          <div class="flex-1 space-y-2">
            <div class="h-5 rounded-md bg-surface-variant" />
            <div class="h-14 rounded-md bg-primary/15" />

            <div class="grid grid-cols-2 gap-2">
              <div class="h-8 rounded-md bg-surface-variant/70" />
              <div class="h-8 rounded-md bg-surface-variant/70" />
            </div>
          </div>
        </div>
      </MiniFrame>
    </div>
  </div>
</template>
