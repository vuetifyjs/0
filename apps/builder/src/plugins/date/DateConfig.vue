<script setup lang="ts">
  import { mdiClose, mdiPlus } from '@mdi/js'

  import { DATE_ADAPTERS, defaultConfig } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { reactive } from 'vue'

  // Types
  import type { DateConfig } from './defaults'

  interface LocaleRow {
    code: string
    intl: string
  }

  const store = useBuilderStore()

  const stored = store.pluginConfig.useDate as DateConfig | undefined
  const initial = structuredClone(stored ?? defaultConfig)

  const state = reactive({
    adapter: initial.adapter,
    locale: initial.locale,
    firstDayOfWeek: initial.firstDayOfWeek,
    locales: Object.entries(initial.locales).map<LocaleRow>(([code, intl]) => ({ code, intl })),
  })

  function addLocale () {
    state.locales.push({ code: '', intl: '' })
  }

  function removeLocale (index: number) {
    state.locales.splice(index, 1)
  }

  function onSave () {
    const locales: Record<string, string> = {}
    for (const row of state.locales) {
      const code = row.code.trim()
      const intl = row.intl.trim()
      if (code && intl) locales[code] = intl
    }

    const config: DateConfig = {
      adapter: state.adapter,
      locale: state.locale,
      locales,
      firstDayOfWeek: state.firstDayOfWeek,
    }
    store.savePluginConfig('useDate', config)
  }
</script>

<template>
  <PluginConfigShell plugin-id="useDate" @save="onSave">
    <template #description>
      <p class="text-on-surface-variant mb-8">
        Format and manipulate dates through a pluggable adapter. The bundled
        <code class="text-xs px-1.5 py-0.5 rounded bg-surface-variant">V0DateAdapter</code>
        uses the Temporal API; custom adapters can wrap date-fns, dayjs, luxon, etc.
      </p>
    </template>

    <div class="space-y-6">
      <label class="block">
        <span class="text-xs uppercase tracking-wide text-on-surface-variant">Adapter</span>

        <select
          v-model="state.adapter"
          class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm"
        >
          <option v-for="kind in DATE_ADAPTERS" :key="kind" :value="kind">
            {{ kind === 'V0DateAdapter' ? 'V0DateAdapter (default — Temporal-based, bundled)' : 'Custom (bring your own)' }}
          </option>
        </select>
      </label>

      <div v-if="state.adapter === 'custom'" class="border border-divider rounded-lg p-4 bg-surface-variant/50">
        <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Custom adapter</div>

        <p class="text-sm text-on-surface-variant">
          Implement a <code class="text-xs px-1.5 py-0.5 rounded bg-surface">DateAdapter</code>
          subclass and pass it to
          <code class="text-xs px-1.5 py-0.5 rounded bg-surface">createDatePlugin()</code>
          in code — date-fns / dayjs / luxon adapters are not bundled in v0 today.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span class="text-xs uppercase tracking-wide text-on-surface-variant">Active locale</span>

          <input
            v-model="state.locale"
            class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
            placeholder="en"
          >

          <span class="block mt-1 text-xs text-on-surface-variant">
            Short code matching a key in the locales table below.
          </span>
        </label>

        <label class="block">
          <span class="text-xs uppercase tracking-wide text-on-surface-variant">First day of week</span>

          <input
            v-model.number="state.firstDayOfWeek"
            class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
            max="6"
            min="0"
            type="number"
          >

          <span class="block mt-1 text-xs text-on-surface-variant">
            0 = Sun, 1 = Mon, ... 6 = Sat
          </span>
        </label>
      </div>

      <div>
        <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Locales (short → Intl)</div>

        <div class="space-y-2">
          <div
            v-for="(row, index) in state.locales"
            :key="index"
            class="grid grid-cols-[1fr_1fr_auto] gap-2 items-center"
          >
            <input
              v-model="row.code"
              class="px-3 py-1.5 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
              placeholder="en"
            >

            <input
              v-model="row.intl"
              class="px-3 py-1.5 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
              placeholder="en-US"
            >

            <button
              class="text-on-surface-variant hover:text-error p-1"
              title="Remove locale"
              type="button"
              @click="removeLocale(index)"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiClose" fill="currentColor" /></svg>
            </button>
          </div>
        </div>

        <button
          class="mt-3 text-sm text-primary hover:opacity-80 inline-flex items-center gap-1"
          type="button"
          @click="addLocale"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
          Add locale
        </button>
      </div>
    </div>
  </PluginConfigShell>
</template>
