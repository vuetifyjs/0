<script setup lang="ts">
  // Framework
  import { Checkbox, Input, Select } from '@vuetify/v0'

  import { defaultConfig, LOG_LEVELS, LOGGER_ADAPTERS } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { reactive } from 'vue'

  // Types
  import type { LoggerConfig } from './defaults'

  const store = useBuilderStore()

  const stored = store.pluginConfig.useLogger as LoggerConfig | undefined
  const initial = structuredClone(stored ?? defaultConfig)

  const state = reactive<LoggerConfig>({
    level: initial.level,
    adapter: initial.adapter,
    prefix: initial.prefix,
    enabled: initial.enabled,
  })

  function onSave () {
    const config: LoggerConfig = {
      level: state.level,
      adapter: state.adapter,
      prefix: state.prefix,
      enabled: state.enabled,
    }
    store.savePluginConfig('useLogger', config)
  }
</script>

<template>
  <PluginConfigShell plugin-id="useLogger" @save="onSave">
    <template #description>
      <p class="text-on-surface-variant mb-8">
        Structured logging with a single global level and a pluggable adapter.
        Pick from the bundled adapters or plug in your own.
      </p>
    </template>

    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span class="text-xs uppercase tracking-wide text-on-surface-variant">Level</span>

          <Select.Root v-model="state.level">
            <Select.Activator class="mt-1 flex items-center justify-between w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
              <Select.Value v-slot="{ selectedValue }">
                {{ selectedValue }}
              </Select.Value>

              <Select.Placeholder class="text-on-surface-variant">Choose a level…</Select.Placeholder>

              <Select.Cue v-slot="{ isOpen }" class="text-xs opacity-50">
                {{ isOpen ? '&#x25B4;' : '&#x25BE;' }}
              </Select.Cue>
            </Select.Activator>

            <Select.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
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
                    <span class="w-4 text-xs" :class="isSelected ? 'visible' : 'invisible'">&#x2713;</span>
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

        <label class="block">
          <span class="text-xs uppercase tracking-wide text-on-surface-variant">Adapter</span>

          <Select.Root v-model="state.adapter">
            <Select.Activator class="mt-1 flex items-center justify-between w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
              <Select.Value v-slot="{ selectedValue }">
                {{ selectedValue }}
              </Select.Value>

              <Select.Placeholder class="text-on-surface-variant">Choose an adapter…</Select.Placeholder>

              <Select.Cue v-slot="{ isOpen }" class="text-xs opacity-50">
                {{ isOpen ? '&#x25B4;' : '&#x25BE;' }}
              </Select.Cue>
            </Select.Activator>

            <Select.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
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
                    <span class="w-4 text-xs" :class="isSelected ? 'visible' : 'invisible'">&#x2713;</span>
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

      <label class="block">
        <span class="text-xs uppercase tracking-wide text-on-surface-variant">Prefix</span>

        <Input.Root v-model="state.prefix">
          <Input.Control
            class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
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
          class="size-5 border rounded inline-flex items-center justify-center border-divider data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        >
          <Checkbox.Indicator class="text-on-primary text-sm">✓</Checkbox.Indicator>
        </Checkbox.Root>

        <span class="text-sm text-on-surface">Enabled</span>
      </label>

      <div class="border border-divider rounded-lg p-4 bg-surface-variant/50">
        <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Advanced</div>

        <p class="text-sm text-on-surface-variant">
          Adapter-specific configuration (e.g.,
          <code class="text-xs px-1.5 py-0.5 rounded bg-surface">Pino</code> options,
          <code class="text-xs px-1.5 py-0.5 rounded bg-surface">Consola</code> reporter)
          is passed to the adapter's constructor in code, not from the builder.
        </p>
      </div>
    </div>
  </PluginConfigShell>
</template>
