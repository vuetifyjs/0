---
title: Docs Health
meta:
  - name: description
    content: Aggregate freshness across every page of the v0 docs, with a 30-day trend and per-page table.
  - name: keywords
    content: docs health, freshness, last updated, docs rot
features:
  label: 'Docs health'
  level: 1
---

<script setup>
  import AppIcon from '@/components/app/AppIcon.vue'
  import { useDate } from '@vuetify/v0'
  import { useFreshness, scoreToColor } from '@/composables/useFreshness'
  import { toRef } from 'vue'

  const { overall, components, composables, guides, pages } = useFreshness()
  const tint = toRef(() => scoreToColor(overall.value))
  const componentsTint = toRef(() => scoreToColor(components.value))
  const composablesTint = toRef(() => scoreToColor(composables.value))
  const guidesTint = toRef(() => scoreToColor(guides.value))
  const subtitle = toRef(() => {
    const date = useDate().adapter.format(new Date(), 'normalDate')
    return `${overall.value} out of 100 · ${pages.value.length} pages averaged · recomputed on ${date}`
  })
</script>

# Docs Health

<div class="flex flex-col items-center gap-4 py-12">
  <div :style="{ color: tint }" class="inline-flex">
    <AppIcon icon="freshness-avocado" :size="220" />
  </div>

  <div :style="{ color: tint }" class="font-mono font-bold text-6xl leading-none">
    {{ overall }}
  </div>

  <div class="text-sm text-on-surface-variant">
    {{ subtitle }}
  </div>
</div>

<div class="grid grid-cols-3 gap-6 py-8 max-w-3xl mx-auto">
  <router-link to="/health?category=components" class="flex flex-col items-center gap-2 hover:underline">
    <span :style="{ color: componentsTint }" class="inline-flex">
      <AppIcon icon="freshness-avocado" :size="96" />
    </span>
    <span :style="{ color: componentsTint }" class="font-mono font-bold text-2xl">{{ components }}</span>
    <span class="text-xs uppercase tracking-wide text-on-surface-variant">components</span>
  </router-link>

  <router-link to="/health?category=composables" class="flex flex-col items-center gap-2 hover:underline">
    <span :style="{ color: composablesTint }" class="inline-flex">
      <AppIcon icon="freshness-avocado" :size="96" />
    </span>
    <span :style="{ color: composablesTint }" class="font-mono font-bold text-2xl">{{ composables }}</span>
    <span class="text-xs uppercase tracking-wide text-on-surface-variant">composables</span>
  </router-link>

  <router-link to="/health?category=guides" class="flex flex-col items-center gap-2 hover:underline">
    <span :style="{ color: guidesTint }" class="inline-flex">
      <AppIcon icon="freshness-avocado" :size="96" />
    </span>
    <span :style="{ color: guidesTint }" class="font-mono font-bold text-2xl">{{ guides }}</span>
    <span class="text-xs uppercase tracking-wide text-on-surface-variant">guides</span>
  </router-link>
</div>
