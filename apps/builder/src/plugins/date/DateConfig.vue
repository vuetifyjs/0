<script setup lang="ts">
  import { mdiCheck, mdiChevronDown, mdiClose, mdiMinus, mdiPlus } from '@mdi/js'

  // Framework
  import { Button, Input, NumberField, Select } from '@vuetify/v0'

  import { DATE_ADAPTERS, defaultConfig } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { reactive } from 'vue'

  // Types
  import type { DateAdapterKind, DateConfig } from './defaults'

  interface LocaleRow {
    code: string
    intl: string
  }

  const store = useBuilderStore()

  const stored = store.pluginConfig.useDate as DateConfig | undefined
  const initial: DateConfig = JSON.parse(JSON.stringify(stored ?? defaultConfig))

  const state = reactive({
    adapter: initial.adapter,
    locale: initial.locale,
    firstDayOfWeek: initial.firstDayOfWeek,
    locales: Object.entries(initial.locales).map<LocaleRow>(([code, intl]) => ({ code, intl })),
  })

  function adapterLabel (kind: DateAdapterKind): string {
    return kind === 'V0DateAdapter'
      ? 'V0DateAdapter (default — Temporal-based, bundled)'
      : 'Custom (bring your own)'
  }

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

        <Select.Root v-model="state.adapter">
          <Select.Activator class="mt-1 flex items-center justify-between w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
            <Select.Value v-slot="{ selectedValue }">
              {{ adapterLabel(selectedValue as DateAdapterKind) }}
            </Select.Value>

            <Select.Placeholder class="text-on-surface-variant">Choose an adapter…</Select.Placeholder>

            <Select.Cue class="inline-flex opacity-50 transition-transform data-[state=open]:rotate-180">
              <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiChevronDown" fill="currentColor" /></svg>
            </Select.Cue>
          </Select.Activator>

          <Select.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
            <Select.Item
              v-for="kind in DATE_ADAPTERS"
              :id="kind"
              :key="kind"
              :value="kind"
            >
              <template #default="{ isSelected, isHighlighted }">
                <div
                  class="flex items-center gap-2 px-3 py-2 rounded-md cursor-default select-none text-sm"
                  :class="[isHighlighted ? 'bg-primary text-on-primary' : isSelected ? 'text-primary font-medium' : 'text-on-surface hover:bg-surface-variant']"
                >
                  <svg class="w-4 h-4" :class="isSelected ? 'visible' : 'invisible'" viewBox="0 0 24 24"><path :d="mdiCheck" fill="currentColor" /></svg>
                  {{ adapterLabel(kind) }}
                </div>
              </template>
            </Select.Item>
          </Select.Content>
        </Select.Root>
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

          <Input.Root v-model="state.locale">
            <Input.Control
              class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
              placeholder="en"
            />
          </Input.Root>

          <span class="block mt-1 text-xs text-on-surface-variant">
            Short code matching a key in the locales table below.
          </span>
        </label>

        <label class="block">
          <span class="text-xs uppercase tracking-wide text-on-surface-variant">First day of week</span>

          <NumberField.Root v-model="state.firstDayOfWeek" :max="6" :min="0">
            <NumberField.Decrement class="mt-1 px-3 py-2 border border-divider rounded-l-lg hover:bg-surface-tint disabled:opacity-50">
              <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiMinus" fill="currentColor" /></svg>
            </NumberField.Decrement>

            <NumberField.Control class="mt-1 w-full text-center border-y border-divider py-2 outline-none bg-surface text-on-surface text-sm font-mono" />

            <NumberField.Increment class="mt-1 px-3 py-2 border border-divider rounded-r-lg hover:bg-surface-tint disabled:opacity-50">
              <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
            </NumberField.Increment>
          </NumberField.Root>

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
            <Input.Root v-model="row.code">
              <Input.Control
                class="px-3 py-1.5 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
                placeholder="en"
              />
            </Input.Root>

            <Input.Root v-model="row.intl">
              <Input.Control
                class="px-3 py-1.5 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
                placeholder="en-US"
              />
            </Input.Root>

            <Button.Root
              :aria-label="`Remove locale ${row.code || index + 1}`"
              class="text-on-surface-variant hover:text-error p-1"
              title="Remove locale"
              @click="removeLocale(index)"
            >
              <Button.Icon>
                <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiClose" fill="currentColor" /></svg>
              </Button.Icon>
            </Button.Root>
          </div>
        </div>

        <Button.Root
          class="mt-3 text-sm text-primary hover:opacity-80 inline-flex items-center gap-1"
          @click="addLocale"
        >
          <Button.Icon>
            <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
          </Button.Icon>

          <Button.Content>Add locale</Button.Content>
        </Button.Root>
      </div>
    </div>
  </PluginConfigShell>
</template>
