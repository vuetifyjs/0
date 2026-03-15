<script setup lang="ts">
  // Utilities
  import { onMounted, onUnmounted, shallowRef, toRef, useTemplateRef } from 'vue'

  // Types
  import type { ThemePreference } from '@/composables/useThemeToggle'
  import type { ThemeId } from '@/themes'

  // Themes
  import { themes } from '@/themes'

  interface ThemeOption {
    id: ThemePreference
    label: string
    icon: string
    theme?: ThemeId
  }

  const { label, options, preference } = defineProps<{
    label: string
    options: ThemeOption[]
    preference: ThemePreference
  }>()

  const emit = defineEmits<{
    select: [id: ThemePreference]
  }>()

  const container = useTemplateRef<HTMLElement>('container')
  const active = shallowRef(0)
  const dots = toRef(() => Math.ceil(options.length / 2))

  function colors (id: ThemeId | undefined) {
    if (!id) return null
    const t = themes[id]
    if (!t) return null
    return t.colors
  }

  function onScroll () {
    const el = container.value
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    if (max <= 0) {
      active.value = 0
      return
    }
    const ratio = el.scrollLeft / max
    active.value = Math.min(Math.round(ratio * (dots.value - 1)), dots.value - 1)
  }

  let observer: ResizeObserver | undefined

  onMounted(() => {
    const el = container.value
    if (!el) return
    observer = new ResizeObserver(onScroll)
    observer.observe(el)
  })

  onUnmounted(() => {
    observer?.disconnect()
  })
</script>

<template>
  <div>
    <div class="text-xs font-medium text-on-surface-variant mb-2">{{ label }}</div>

    <div
      ref="container"
      class="flex gap-2 overflow-x-auto snap-x snap-mandatory scrollbar-none"
      @scroll.passive="onScroll"
    >
      <button
        v-for="option in options"
        :key="option.id"
        :aria-pressed="preference === option.id"
        :class="[
          'flex-none w-[44%] snap-start flex flex-col gap-1.5 px-3 py-2 rounded-lg border text-sm transition-colors',
          preference === option.id
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-divider hover:border-primary/50 text-on-surface',
        ]"
        type="button"
        @click="emit('select', option.id)"
      >
        <div class="flex items-center gap-2">
          <AppIcon :icon="option.icon" size="14" />
          <span class="font-medium truncate">{{ option.label }}</span>
        </div>

        <div v-if="option.theme && colors(option.theme)" class="w-full">
          <div class="flex gap-0.5 mb-0.5">
            <span
              class="flex-1 h-5 rounded-sm"
              :style="{ background: colors(option.theme)!.primary }"
            />
            <span
              class="flex-1 h-5 rounded-sm"
              :style="{ background: colors(option.theme)!.secondary }"
            />
            <span
              class="flex-1 h-5 rounded-sm"
              :style="{ background: colors(option.theme)!.accent }"
            />
          </div>
          <div class="flex gap-0.5">
            <span
              class="flex-1 h-2.5 rounded-sm"
              :style="{ background: colors(option.theme)!.background }"
            />
            <span
              class="flex-1 h-2.5 rounded-sm"
              :style="{ background: colors(option.theme)!.surface }"
            />
            <span
              class="flex-1 h-2.5 rounded-sm"
              :style="{ background: colors(option.theme)!['on-surface'] }"
            />
          </div>
        </div>
      </button>
    </div>

    <div v-if="dots > 1" class="flex gap-1 justify-center mt-2">
      <span
        v-for="i in dots"
        :key="i"
        :class="[
          'w-1.5 h-1.5 rounded-full transition-colors',
          active === i - 1 ? 'bg-primary' : 'bg-divider',
        ]"
      />
    </div>
  </div>
</template>
