<script setup lang="ts">
  import { useBreakpoints } from '@vuetify/v0'

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

    <p class="text-xs text-on-surface-variant text-center">
      Resize the browser window to see breakpoints change
    </p>
  </div>
</template>
