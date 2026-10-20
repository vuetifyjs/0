<script setup lang="ts">
  // Framework
  import { Button, useTimer } from '@vuetify/v0'

  // Components
  import AppIcon from '@/components/app/AppIcon.vue'

  // Globals
  import { IN_BROWSER } from '#v0/constants/globals'
  // Data
  import { browserLabel, buildReport, buildRows } from '@/data/build'

  // Utilities
  import { shallowRef } from 'vue'

  // Types
  import type { BuildRow } from '@/data/build'

  const agent = IN_BROWSER ? navigator.userAgent : ''

  const rows: BuildRow[] = [
    ...buildRows(),
    {
      label: 'Browser',
      value: agent ? browserLabel(agent) : 'server',
      detail: agent || undefined,
    },
  ]

  const copied = shallowRef(false)

  const { start: clearCopied } = useTimer(() => {
    copied.value = false
  }, { duration: 1500 })

  async function onCopy () {
    try {
      await navigator.clipboard.writeText(buildReport(rows))
      copied.value = true
      clearCopied()
    } catch {
      copied.value = false
    }
  }
</script>

<template>
  <div class="flex flex-col gap-4 h-full min-h-0">
    <div class="flex items-center gap-3">
      <AppIcon class="shrink-0 text-primary" icon="vuetify-0" :size="32" />

      <div class="min-w-0">
        <div class="text-sm font-medium text-on-surface">Vuetify0 Play</div>
        <div class="text-xs text-on-surface-variant">Interactive playground for Vuetify0</div>
      </div>
    </div>

    <dl class="border border-divider rounded-lg overflow-hidden">
      <div
        v-for="row in rows"
        :key="row.label"
        class="flex items-baseline justify-between gap-3 px-3 py-2 border-b border-divider last:border-b-0"
      >
        <dt class="text-xs text-on-surface-variant shrink-0">{{ row.label }}</dt>

        <dd class="text-xs font-mono text-on-surface text-right min-w-0 truncate" :title="row.detail || row.value">
          <a
            v-if="row.href"
            class="hover:underline underline-offset-2"
            :href="row.href"
            rel="noopener noreferrer"
            target="_blank"
          >{{ row.value }}</a>

          <template v-else>{{ row.value }}</template>
        </dd>
      </div>
    </dl>

    <div class="mt-auto">
      <Button.Root
        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border border-divider text-on-surface hover:bg-surface-tint"
        type="button"
        @click="onCopy"
      >
        <AppIcon :icon="copied ? 'check' : 'copy'" :size="14" />
        <span>{{ copied ? 'Copied' : 'Copy' }}</span>
      </Button.Root>
    </div>
  </div>
</template>
