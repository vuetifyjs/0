<script setup lang="ts">
  import { clamp, useTooltip } from '@vuetify/v0'
  import { useRegionSettings } from './context'

  const region = useTooltip()
  const settings = useRegionSettings()

  type DelayKey = 'openDelay' | 'closeDelay' | 'skipDelay'

  const rows: { key: DelayKey, label: string, desc: string }[] = [
    { key: 'openDelay', label: 'Open delay', desc: 'Wait before the first tooltip appears' },
    { key: 'closeDelay', label: 'Close delay', desc: 'Wait before a tooltip hides' },
    { key: 'skipDelay', label: 'Skip window', desc: 'Idle grace period for instant reopen' },
  ]

  function step (key: DelayKey, amount: number) {
    settings[key].value = clamp(settings[key].value + amount, 0, 2000)
  }
</script>

<template>
  <section class="space-y-4 rounded-xl border border-divider bg-surface p-4">
    <div class="flex items-center justify-between gap-3">
      <h3 class="text-sm font-semibold text-on-surface">Region settings</h3>

      <span
        class="rounded px-2 py-0.5 text-xs font-medium"
        :class="region.isAnyOpen.value
          ? 'bg-success text-on-success'
          : 'bg-surface-variant text-on-surface-variant'"
      >
        {{ region.isAnyOpen.value ? 'tooltip open' : 'idle' }}
      </span>
    </div>

    <div class="space-y-3">
      <div
        v-for="row in rows"
        :key="row.key"
        class="flex items-center justify-between gap-3"
      >
        <div class="min-w-0">
          <p class="text-sm text-on-surface">{{ row.label }}</p>
          <p class="text-xs text-on-surface-variant">{{ row.desc }}</p>
        </div>

        <div class="flex shrink-0 items-center gap-1">
          <button
            class="size-7 rounded-md border border-divider text-on-surface transition-colors hover:bg-surface-variant disabled:opacity-40"
            :disabled="settings[row.key].value <= 0"
            type="button"
            @click="step(row.key, -100)"
          >
            -
          </button>

          <span class="w-14 text-center text-sm tabular-nums text-on-surface">
            {{ settings[row.key].value }}ms
          </span>

          <button
            class="size-7 rounded-md border border-divider text-on-surface transition-colors hover:bg-surface-variant disabled:opacity-40"
            :disabled="settings[row.key].value >= 2000"
            type="button"
            @click="step(row.key, 100)"
          >
            +
          </button>
        </div>
      </div>
    </div>

    <button
      :aria-pressed="settings.disabled.value"
      class="flex w-full items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm transition-colors"
      :class="settings.disabled.value
        ? 'border-primary text-primary'
        : 'border-divider text-on-surface-variant'"
      type="button"
      @click="settings.disabled.value = !settings.disabled.value"
    >
      Disable all tooltips in this region

      <span
        class="flex h-4 w-7 items-center rounded-full px-0.5 transition-colors"
        :class="settings.disabled.value ? 'justify-end bg-primary' : 'justify-start bg-surface-variant'"
      >
        <span class="size-3 rounded-full bg-surface shadow-sm" />
      </span>
    </button>

    <p class="text-xs text-on-surface-variant">
      Every change feeds the shared region, so the resolved delays the toolbar reads are
      {{ region.openDelay.value }}ms open / {{ region.closeDelay.value }}ms close, with a
      {{ region.skipDelay.value }}ms skip window.
    </p>
  </section>
</template>
