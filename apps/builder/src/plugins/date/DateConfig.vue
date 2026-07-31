<script setup lang="ts">
  import { mdiCheck, mdiChevronDown, mdiClose, mdiMinus, mdiPlus } from '@mdi/js'

  // Framework
  import { Button, Input, NumberField, Select } from '@vuetify/v0'

  import { DATE_ADAPTERS, defaultConfig } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { onBeforeUnmount, reactive, watch } from 'vue'

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

  function snapshot (): DateConfig {
    const locales: Record<string, string> = {}
    for (const row of state.locales) {
      const code = row.code.trim()
      const intl = row.intl.trim()
      if (code && intl) locales[code] = intl
    }

    return {
      adapter: state.adapter,
      locale: state.locale,
      locales,
      firstDayOfWeek: state.firstDayOfWeek,
    }
  }

  function onSave () {
    store.savePluginConfig('useDate', snapshot())
  }

  watch(state, () => {
    store.setDraft('useDate', JSON.parse(JSON.stringify(snapshot())))
  }, { deep: true, immediate: true })

  onBeforeUnmount(() => {
    store.clearDraft('useDate')
  })
</script>

<template>
  <PluginConfigShell plugin-id="useDate" @save="onSave">
    <template #description>
      <p class="t-body text-on-surface-variant">
        Format and manipulate dates through a pluggable adapter. The bundled
        <code class="code-chip">V0DateAdapter</code>
        uses the Temporal API; custom adapters can wrap date-fns, dayjs, luxon, etc.
      </p>
    </template>

    <div class="space-y-6">
      <label class="field">
        <span class="field-label">Adapter</span>

        <Select.Root v-model="state.adapter">
          <Select.Activator class="field-activator">
            <Select.Value v-slot="{ selectedValue }">
              {{ adapterLabel(selectedValue as DateAdapterKind) }}
            </Select.Value>

            <Select.Placeholder class="text-on-surface-variant">Choose an adapter…</Select.Placeholder>

            <Select.Cue class="inline-flex opacity-50 transition-transform data-[state=open]:rotate-180">
              <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiChevronDown" fill="currentColor" /></svg>
            </Select.Cue>
          </Select.Activator>

          <Select.Content class="field-menu" :style="{ minWidth: 'anchor-size(width)' }">
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

      <div v-if="state.adapter === 'custom'" class="note">
        <div class="field-label mb-2">Custom adapter</div>

        <p class="text-sm text-on-surface-variant">
          Implement a <code class="code-chip">DateAdapter</code>
          subclass and pass it to
          <code class="code-chip">createDatePlugin()</code>
          in code — date-fns / dayjs / luxon adapters are not bundled in v0 today.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="field">
          <span class="field-label">Active locale</span>

          <Input.Root v-model="state.locale">
            <Input.Control
              class="field-input font-mono"
              placeholder="en"
            />
          </Input.Root>

          <span class="block mt-1 text-xs text-on-surface-variant">
            Short code matching a key in the locales table below.
          </span>
        </label>

        <label class="field">
          <span class="field-label">First day of week</span>

          <NumberField.Root
            v-model="state.firstDayOfWeek"
            class="flex w-full"
            label="First day of week, 0 is Sunday"
            :max="6"
            :min="0"
          >
            <NumberField.Decrement class="field-stepper-cap mt-1 rounded-l-md">
              <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiMinus" fill="currentColor" /></svg>
            </NumberField.Decrement>

            <NumberField.Control class="mt-1 flex-1 min-w-0 text-center border-y border-divider py-2 outline-none bg-surface text-on-surface text-sm font-mono" />

            <NumberField.Increment class="field-stepper-cap mt-1 rounded-r-md">
              <svg aria-hidden="true" class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
            </NumberField.Increment>
          </NumberField.Root>

          <span class="block mt-1 text-xs text-on-surface-variant">
            0 = Sun, 1 = Mon, ... 6 = Sat
          </span>
        </label>
      </div>

      <div>
        <div class="field-label mb-2">Locales (short → Intl)</div>

        <div class="space-y-2">
          <div
            v-for="(row, index) in state.locales"
            :key="index"
            class="grid grid-cols-[1fr_1fr_auto] gap-2 items-center"
          >
            <Input.Root v-model="row.code">
              <Input.Control
                class="field-input font-mono"
                placeholder="en"
              />
            </Input.Root>

            <Input.Root v-model="row.intl">
              <Input.Control
                class="field-input font-mono"
                placeholder="en-US"
              />
            </Input.Root>

            <Button.Root
              :aria-label="`Remove locale ${row.code || index + 1}`"
              class="inline-flex items-center justify-center w-8 h-8 rounded-md text-on-surface-variant hover:text-error hover:bg-surface-variant transition-colors duration-150"
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
          class="btn-outline mt-3 h-9 px-3 text-[0.8125rem]"
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
