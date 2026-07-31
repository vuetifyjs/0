<script setup lang="ts">
  import { mdiCheck, mdiChevronDown } from '@mdi/js'

  // Framework
  import { Checkbox, Input, Select } from '@vuetify/v0'

  import { defaultConfig, LOG_LEVELS, LOGGER_ADAPTERS } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { onBeforeUnmount, reactive, watch } from 'vue'

  // Types
  import type { LoggerConfig } from './defaults'

  const store = useBuilderStore()

  const stored = store.pluginConfig.useLogger as LoggerConfig | undefined
  const initial = JSON.parse(JSON.stringify(stored ?? defaultConfig))

  const state = reactive<LoggerConfig>({
    level: initial.level,
    adapter: initial.adapter,
    prefix: initial.prefix,
    enabled: initial.enabled,
  })

  function snapshot (): LoggerConfig {
    return {
      level: state.level,
      adapter: state.adapter,
      prefix: state.prefix,
      enabled: state.enabled,
    }
  }

  function onSave () {
    store.savePluginConfig('useLogger', snapshot())
  }

  watch(state, () => {
    store.setDraft('useLogger', JSON.parse(JSON.stringify(snapshot())))
  }, { deep: true, immediate: true })

  onBeforeUnmount(() => {
    store.clearDraft('useLogger')
  })
</script>

<template>
  <PluginConfigShell plugin-id="useLogger" @save="onSave">
    <template #description>
      <p class="t-body text-on-surface-variant">
        Structured logging with a single global level and a pluggable adapter.
        Pick from the bundled adapters or plug in your own.
      </p>
    </template>

    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="field">
          <span class="field-label">Level</span>

          <Select.Root v-model="state.level">
            <Select.Activator class="field-activator">
              <Select.Value v-slot="{ selectedValue }">
                {{ selectedValue }}
              </Select.Value>

              <Select.Placeholder class="text-on-surface-variant">Choose a level…</Select.Placeholder>

              <Select.Cue class="inline-flex opacity-50 transition-transform data-[state=open]:rotate-180">
                <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiChevronDown" fill="currentColor" /></svg>
              </Select.Cue>
            </Select.Activator>

            <Select.Content class="field-menu" :style="{ minWidth: 'anchor-size(width)' }">
              <Select.Item
                v-for="level in LOG_LEVELS"
                :id="level"
                :key="level"
                :value="level"
              >
                <template #default="{ isSelected, isHighlighted }">
                  <div
                    class="flex items-center gap-2 px-3 py-2 rounded-md cursor-default select-none text-sm"
                    :class="[isHighlighted ? 'bg-primary text-on-primary' : isSelected ? 'text-primary font-medium' : 'text-on-surface hover:bg-surface-variant']"
                  >
                    <svg class="w-4 h-4" :class="isSelected ? 'visible' : 'invisible'" viewBox="0 0 24 24"><path :d="mdiCheck" fill="currentColor" /></svg>
                    {{ level }}
                  </div>
                </template>
              </Select.Item>
            </Select.Content>
          </Select.Root>

          <span class="block mt-1 text-xs text-on-surface-variant">
            Minimum severity to emit. Applies globally to all namespaces.
          </span>
        </label>

        <label class="field">
          <span class="field-label">Adapter</span>

          <Select.Root v-model="state.adapter">
            <Select.Activator class="field-activator">
              <Select.Value v-slot="{ selectedValue }">
                {{ selectedValue }}
              </Select.Value>

              <Select.Placeholder class="text-on-surface-variant">Choose an adapter…</Select.Placeholder>

              <Select.Cue class="inline-flex opacity-50 transition-transform data-[state=open]:rotate-180">
                <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiChevronDown" fill="currentColor" /></svg>
              </Select.Cue>
            </Select.Activator>

            <Select.Content class="field-menu" :style="{ minWidth: 'anchor-size(width)' }">
              <Select.Item
                v-for="adapter in LOGGER_ADAPTERS"
                :id="adapter"
                :key="adapter"
                :value="adapter"
              >
                <template #default="{ isSelected, isHighlighted }">
                  <div
                    class="flex items-center gap-2 px-3 py-2 rounded-md cursor-default select-none text-sm"
                    :class="[isHighlighted ? 'bg-primary text-on-primary' : isSelected ? 'text-primary font-medium' : 'text-on-surface hover:bg-surface-variant']"
                  >
                    <svg class="w-4 h-4" :class="isSelected ? 'visible' : 'invisible'" viewBox="0 0 24 24"><path :d="mdiCheck" fill="currentColor" /></svg>
                    {{ adapter }}
                  </div>
                </template>
              </Select.Item>
            </Select.Content>
          </Select.Root>

          <span class="block mt-1 text-xs text-on-surface-variant">
            Bundled adapter to instantiate.
          </span>
        </label>
      </div>

      <label class="field">
        <span class="field-label">Prefix</span>

        <Input.Root v-model="state.prefix">
          <Input.Control
            class="field-input font-mono"
            placeholder="v0"
          />
        </Input.Root>

        <span class="block mt-1 text-xs text-on-surface-variant">
          Prepended to every log message.
        </span>
      </label>

      <label class="flex items-center gap-2">
        <Checkbox.Root
          v-model="state.enabled"
          class="field-check"
        >
          <Checkbox.Indicator class="text-on-primary">
            <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiCheck" fill="currentColor" /></svg>
          </Checkbox.Indicator>
        </Checkbox.Root>

        <span class="text-sm text-on-surface">Enabled</span>
      </label>

      <div class="inset p-4">
        <div class="field-label mb-2">Advanced</div>

        <p class="text-sm text-on-surface-variant">
          Adapter-specific configuration (e.g.,
          <code class="code-chip">Pino</code> options,
          <code class="code-chip">Consola</code> reporter)
          is passed to the adapter's constructor in code, not from the builder.
        </p>
      </div>
    </div>
  </PluginConfigShell>
</template>
