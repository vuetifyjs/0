<script setup lang="ts">
  import { useBreakpoints } from '@vuetify/v0'
  import { IN_BROWSER } from '@vuetify/v0/constants'
  import { shallowRef, toRef, watch } from 'vue'

  const {
    name,
    width,
    height,
    isMobile,
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
    breakpoints,
  } = useBreakpoints()

  const sizes = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as const

  const cssBreakpoint = shallowRef('')
  const innerWidth = shallowRef(0)

  // Check CSS media queries whenever the composable updates
  watch(name, () => {
    if (!IN_BROWSER) return

    innerWidth.value = window.innerWidth

    let css = 'xs'
    for (let i = sizes.length - 1; i >= 0; i--) {
      if (window.matchMedia(`(min-width: ${breakpoints[sizes[i]]}px)`).matches) {
        css = sizes[i]
        break
      }
    }
    cssBreakpoint.value = css
  }, { immediate: true })

  const matched = toRef(() => !cssBreakpoint.value || cssBreakpoint.value === name.value)
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-wrap items-center gap-4">
      <div class="px-4 py-2 rounded-lg bg-primary text-on-primary font-medium">
        {{ name }}
      </div>

      <span class="text-sm text-on-surface-variant font-mono">
        {{ width }} x {{ height }}
      </span>

      <span
        class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
        :class="isMobile ? 'bg-warning/15 text-warning' : 'bg-success/15 text-success'"
      >
        <span class="w-2 h-2 rounded-full" :class="isMobile ? 'bg-warning' : 'bg-success'" />
        {{ isMobile ? 'Mobile' : 'Desktop' }}
      </span>
    </div>

    <div class="flex gap-1">
      <div
        v-for="size in sizes"
        :key="size"
        class="flex-1 py-2 text-center text-xs font-mono rounded transition-colors"
        :class="name === size ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface-variant'"
      >
        {{ size }}
        <div class="text-[10px] opacity-70">{{ breakpoints[size] }}px</div>
      </div>
    </div>

    <div class="grid gap-3" :class="isMobile ? 'grid-cols-1' : 'grid-cols-3'">
      <div
        v-for="(active, label) in { xs, sm, md, lg, xl, xxl }"
        :key="label"
        class="flex items-center gap-3 px-3 py-2 rounded-lg border transition-colors"
        :class="active ? 'border-primary bg-primary/5' : 'border-divider'"
      >
        <span class="w-2 h-2 rounded-full" :class="active ? 'bg-primary' : 'bg-surface-variant'" />
        <span class="font-mono text-sm">{{ label }}</span>
        <span class="ml-auto text-xs text-on-surface-variant">{{ active }}</span>
      </div>
    </div>

    <div class="rounded-lg border border-divider overflow-hidden">
      <div class="px-3 py-2 bg-surface-variant text-xs font-medium text-on-surface-variant">
        Zoom alignment
      </div>

      <div class="p-3 flex flex-col gap-2 text-sm font-mono">
        <div class="flex justify-between">
          <span class="text-on-surface-variant">JS breakpoint</span>
          <span class="font-medium">{{ name }}</span>
        </div>

        <div class="flex justify-between">
          <span class="text-on-surface-variant">CSS @media</span>
          <span class="font-medium">{{ cssBreakpoint }}</span>
        </div>

        <div class="flex justify-between">
          <span class="text-on-surface-variant">window.innerWidth</span>
          <span>{{ innerWidth }}px</span>
        </div>

        <div class="flex justify-between">
          <span class="text-on-surface-variant">Precise width</span>
          <span>{{ width }}px</span>
        </div>

        <div
          class="mt-1 flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium"
          :class="matched ? 'bg-success/10 text-success' : 'bg-error/10 text-error'"
        >
          <span class="w-2 h-2 rounded-full" :class="matched ? 'bg-success' : 'bg-error'" />
          {{ matched ? 'JS and CSS agree' : 'Mismatch detected — zoom rounding issue' }}
        </div>
      </div>
    </div>

    <p class="text-xs text-on-surface-variant text-center">
      Zoom your browser and resize to test alignment between JS and CSS breakpoints
    </p>
  </div>
</template>
