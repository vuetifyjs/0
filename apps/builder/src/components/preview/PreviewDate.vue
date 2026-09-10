<script setup lang="ts">
  import { defaultConfig } from '@/plugins/date/defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { DateConfig } from '@/plugins/date/defaults'

  const store = useBuilderStore()

  const today = new Date()

  const config = toRef(() => {
    if (store.draft?.id === 'useDate') return store.draft.config as DateConfig

    return (store.pluginConfig.useDate as DateConfig | undefined) ?? defaultConfig
  })

  // Intl throws on malformed tags while the user is still typing one.
  function safe<T> (fallback: T, produce: () => T): T {
    try {
      return produce()
    } catch {
      return fallback
    }
  }

  const tag = toRef(() => config.value.locales?.[config.value.locale] || config.value.locale || 'en-US')

  const first = toRef(() => {
    const day = config.value.firstDayOfWeek

    return Number.isFinite(day) ? ((day % 7) + 7) % 7 : 0
  })

  const weekdays = toRef(() => safe(['S', 'M', 'T', 'W', 'T', 'F', 'S'], () => {
    const format = new Intl.DateTimeFormat(tag.value, { weekday: 'narrow' })

    // 2024-09-01 was a Sunday, so index 0 lines up with getDay() === 0.
    return Array.from({ length: 7 }, (_, index) => format.format(new Date(2024, 8, 1 + ((index + first.value) % 7))))
  }))

  const label = toRef(() => safe('', () => new Intl.DateTimeFormat(tag.value, {
    month: 'long',
    year: 'numeric',
  }).format(today)))

  const full = toRef(() => safe(today.toDateString(), () => new Intl.DateTimeFormat(tag.value, {
    dateStyle: 'full',
  }).format(today)))

  const cells = toRef(() => {
    const start = new Date(today.getFullYear(), today.getMonth(), 1)
    const total = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
    const lead = (start.getDay() - first.value + 7) % 7

    // Day numbers go through the locale's own numbering system so they match the header.
    const number = safe(new Intl.NumberFormat(), () => new Intl.NumberFormat(tag.value))

    return [
      ...Array.from({ length: lead }, () => null),
      ...Array.from({ length: total }, (_, index) => ({ day: index + 1, label: number.format(index + 1) })),
    ]
  })

  const RTL = new Set(['ar', 'fa', 'he', 'ur'])

  const rtl = toRef(() => RTL.has(tag.value.split('-')[0]?.toLowerCase() ?? ''))
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2 text-xs">
      <span class="px-2 py-0.5 rounded-full bg-primary text-on-primary font-mono">{{ tag }}</span>

      <span class="px-2 py-0.5 rounded-full border border-divider text-on-surface-variant">
        week starts {{ weekdays[0] }}
      </span>

      <span class="ml-auto text-on-surface-variant font-mono">{{ config.adapter }}</span>
    </div>

    <MiniFrame title="calendar">
      <div class="space-y-3" :dir="rtl ? 'rtl' : 'ltr'">
        <p class="text-sm font-semibold text-on-surface capitalize">{{ label }}</p>

        <div class="grid grid-cols-7 gap-1 text-center">
          <span
            v-for="(day, index) in weekdays"
            :key="index"
            class="text-[10px] font-semibold uppercase text-on-surface-variant py-1"
          >
            {{ day }}
          </span>

          <span
            v-for="(cell, index) in cells"
            :key="`cell-${index}`"
            class="aspect-square inline-flex items-center justify-center rounded-md text-[11px] transition-colors"
            :class="cell?.day === today.getDate()
              ? 'bg-primary text-on-primary font-semibold'
              : cell === null ? '' : 'text-on-surface hover:bg-surface-variant'"
          >
            {{ cell?.label ?? '' }}
          </span>
        </div>

        <p class="pt-1 border-t border-divider text-[11px] text-on-surface-variant">{{ full }}</p>
      </div>
    </MiniFrame>

    <p class="text-xs text-on-surface-variant">
      Weekday order and formatting come from the locale mapped to
      <span class="font-mono text-on-surface">{{ config.locale }}</span>.
    </p>
  </div>
</template>
