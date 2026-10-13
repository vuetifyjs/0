<script setup lang="ts">
  import { mdiCheck, mdiChevronDown, mdiClose, mdiPlus } from '@mdi/js'

  // Framework
  import { Button, Checkbox, Input, Select } from '@vuetify/v0'

  import { defaultConfig, FEATURES_ADAPTERS } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { onBeforeUnmount, reactive, watch } from 'vue'

  // Types
  import type { FeaturesAdapter, FeaturesConfig } from './defaults'

  interface FlagRow {
    key: string
    default: boolean
  }

  const store = useBuilderStore()

  const stored = store.pluginConfig.useFeatures as FeaturesConfig | undefined
  const initial = JSON.parse(JSON.stringify(stored ?? defaultConfig))

  const state = reactive({
    adapter: initial.adapter as FeaturesAdapter,
    flags: Object.entries(initial.features).map<FlagRow>(([key, value]) => ({
      key,
      default: !!value,
    })),
  })

  function addFlag () {
    state.flags.push({ key: '', default: false })
  }

  function removeFlag (index: number) {
    state.flags.splice(index, 1)
  }

  function snapshot (): FeaturesConfig {
    const features: Record<string, boolean> = {}
    for (const row of state.flags) {
      if (row.key) features[row.key] = row.default
    }

    return {
      features,
      adapter: state.adapter,
    }
  }

  function onSave () {
    store.savePluginConfig('useFeatures', snapshot())
  }

  watch(state, () => {
    store.setDraft('useFeatures', JSON.parse(JSON.stringify(snapshot())))
  }, { deep: true, immediate: true })

  onBeforeUnmount(() => {
    store.clearDraft('useFeatures')
  })
</script>

<template>
  <PluginConfigShell plugin-id="useFeatures" @save="onSave">
    <template #description>
      <p class="t-body text-on-surface-variant">
        Toggle features on or off at runtime. Use static defaults alone, or pair with
        a third-party adapter for remote-controlled flags.
      </p>
    </template>

    <div class="space-y-6">
      <label class="field">
        <span class="field-label">Adapter</span>

        <Select.Root v-model="state.adapter">
          <Select.Activator class="field-activator">
            <Select.Value v-slot="{ selectedValue }">
              {{ selectedValue === 'none' ? 'None (static flags only)' : selectedValue }}
            </Select.Value>

            <Select.Placeholder class="text-on-surface-variant">Choose an adapter…</Select.Placeholder>

            <Select.Cue class="inline-flex opacity-50 transition-transform data-[state=open]:rotate-180">
              <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiChevronDown" fill="currentColor" /></svg>
            </Select.Cue>
          </Select.Activator>

          <Select.Content class="field-menu" :style="{ minWidth: 'anchor-size(width)' }">
            <Select.Item
              v-for="adapter in FEATURES_ADAPTERS"
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
                  {{ adapter === 'none' ? 'None (static flags only)' : adapter }}
                </div>
              </template>
            </Select.Item>
          </Select.Content>
        </Select.Root>

        <span class="block mt-1 text-xs text-on-surface-variant">
          Features work statically without an adapter. Pick one to source flags remotely.
        </span>
      </label>

      <div v-if="state.adapter !== 'none'" class="note">
        <div class="field-label mb-2">Adapter configuration</div>

        <p class="text-sm text-on-surface-variant">
          API keys, environments, and other provider-specific options are passed to the
          <code class="code-chip">{{ state.adapter }}</code>
          constructor in code, not from this form.
        </p>
      </div>

      <div>
        <div class="field-label mb-2">Static flags</div>

        <div class="space-y-2">
          <div
            v-for="(flag, index) in state.flags"
            :key="index"
            class="flex items-center gap-2"
          >
            <Input.Root v-model="flag.key" class="flex-1">
              <Input.Control
                class="field-input font-mono"
                placeholder="my-feature"
              />
            </Input.Root>

            <label class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-divider bg-surface">
              <Checkbox.Root
                v-model="flag.default"
                class="field-check"
              >
                <Checkbox.Indicator class="text-on-primary">
                  <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiCheck" fill="currentColor" /></svg>
                </Checkbox.Indicator>
              </Checkbox.Root>

              <span class="text-sm text-on-surface">on</span>
            </label>

            <Button.Root
              :aria-label="`Remove flag ${flag.key || index + 1}`"
              class="inline-flex items-center justify-center w-8 h-8 rounded-md text-on-surface-variant hover:text-error hover:bg-surface-variant transition-colors duration-150"
              :title="`Remove ${flag.key}`"
              @click="removeFlag(index)"
            >
              <Button.Icon>
                <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiClose" fill="currentColor" /></svg>
              </Button.Icon>
            </Button.Root>
          </div>
        </div>

        <Button.Root
          class="btn-outline mt-3 h-9 px-3 text-[0.8125rem]"
          @click="addFlag"
        >
          <Button.Icon>
            <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
          </Button.Icon>

          <Button.Content>Add flag</Button.Content>
        </Button.Root>
      </div>
    </div>
  </PluginConfigShell>
</template>
