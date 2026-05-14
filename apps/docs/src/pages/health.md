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
  import DocsFreshnessSparkline from '@/components/docs/DocsFreshnessSparkline.vue'
  import DocsFreshnessTable from '@/components/docs/DocsFreshnessTable.vue'
  import { useDate } from '@vuetify/v0'
  import { useFreshness, scoreToColor, scoreToFilter } from '@/composables/useFreshness'
  import { toRef } from 'vue'

  const { overall, pages } = useFreshness()
  const tint = toRef(() => scoreToColor(overall.value))
  const date = useDate()
  const subtitle = toRef(() => {
    const now = date.adapter.date(new Date())
    const formatted = date.adapter.isValid(now) ? date.adapter.format(now, 'normalDate') : ''
    return `${overall.value} out of 100 · ${pages.value.length} pages averaged${formatted ? ` · recomputed on ${formatted}` : ''}`
  })

  const legend = [
    { score: 100, label: '≤7d', tone: 'Fresh' },
    { score: 75, label: '≤30d', tone: 'Aging' },
    { score: 50, label: '≤90d', tone: 'Browning' },
    { score: 25, label: '≤180d', tone: 'Stale' },
    { score: 0, label: '>180d', tone: 'Overripe' },
  ]
</script>

<h1 class="sr-only">Docs Health</h1>

<div class="flex flex-col items-center gap-4 py-12">
  <div :style="{ filter: scoreToFilter(overall) }" class="inline-flex">
    <AppIcon icon="freshness-avocado" :size="220" />
  </div>

  <div :style="{ color: tint }" class="font-mono font-bold text-6xl leading-none">
    {{ overall }}
  </div>

  <div class="text-sm text-on-surface-variant">
    {{ subtitle }}
  </div>
</div>

<DocsFreshnessSparkline class="my-12" />

<div class="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mb-8 text-xs">
  <div
    v-for="stop in legend"
    :key="stop.score"
    class="flex items-center gap-2"
  >
    <span :style="{ filter: scoreToFilter(stop.score) }" class="inline-flex">
      <AppIcon icon="freshness-avocado" :size="20" />
    </span>
    <span :style="{ color: scoreToColor(stop.score) }" class="font-medium">{{ stop.tone }}</span>
    <span class="font-mono text-on-surface-variant tabular-nums">{{ stop.label }}</span>
  </div>
</div>

<DocsFreshnessTable />
