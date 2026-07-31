<script setup lang="ts">
  import { mdiArrowLeft, mdiArrowRight, mdiChevronLeft, mdiChevronRight } from '@mdi/js'

  import { defaultConfig } from '@/plugins/rtl/defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { RtlConfig } from '@/plugins/rtl/defaults'

  const store = useBuilderStore()

  const config = toRef(() => {
    if (store.draft?.id === 'useRtl') return store.draft.config as RtlConfig

    return (store.pluginConfig.useRtl as RtlConfig | undefined) ?? defaultConfig
  })

  const rtl = toRef(() => !!config.value.default)

  // The mirrored frame carries real RTL script — English inside dir="rtl" only mirrors
  // the layout and reads wrong, which hides the bugs this preview exists to surface.
  const copy = toRef(() => rtl.value
    ? {
      brand: 'أكمي',
      body: 'يتدفق المحتوى من اليمين إلى اليسار، وتنعكس المحاذاة والمسافات وترتيب القراءة تبعًا للإعداد الافتراضي.',
      next: 'الخطوة التالية',
    }
    : {
      brand: 'Acme',
      body: 'Content flows left to right; alignment, spacing, and reading order mirror with the configured default.',
      next: 'Next step',
    })
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2 text-xs text-on-surface-variant">
      <Icon :path="rtl ? mdiArrowLeft : mdiArrowRight" :size="14" />
      <span>Direction: {{ rtl ? 'RTL' : 'LTR' }}</span>
    </div>

    <MiniFrame title="direction">
      <div class="space-y-4" :dir="rtl ? 'rtl' : 'ltr'">
        <header class="flex items-center justify-between gap-3 pb-3 border-b border-divider transition-all">
          <span class="text-sm font-semibold text-on-surface">{{ copy.brand }}</span>

          <nav class="flex items-center gap-1.5 transition-all">
            <span
              v-for="stub in 3"
              :key="stub"
              class="h-2 w-8 rounded-full bg-surface-variant"
            />
          </nav>
        </header>

        <p class="text-xs leading-relaxed text-on-surface-variant">{{ copy.body }}</p>

        <div class="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-divider transition-all">
          <span class="text-xs text-on-surface">{{ copy.next }}</span>

          <Icon class="text-on-surface-variant" :path="rtl ? mdiChevronLeft : mdiChevronRight" :size="16" />
        </div>
      </div>
    </MiniFrame>

    <p class="text-xs text-on-surface-variant">
      {{ rtl
        ? 'Arabic sample copy — the frame mirrors its layout, icons, and reading order.'
        : 'Turn the default on to mirror the frame and swap in right-to-left sample copy.' }}
    </p>
  </div>
</template>
