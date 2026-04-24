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

  const { overall, pages } = useFreshness()
  const tint = toRef(() => scoreToColor(overall.value))
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
