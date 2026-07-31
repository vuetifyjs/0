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
      <p class="text-on-surface-variant mb-8">
        Toggle features on or off at runtime. Use static defaults alone, or pair with
        a third-party adapter for remote-controlled flags.
      </p>
    </template>

    <div class="space-y-6">
      <label class="block">
        <span class="text-xs uppercase tracking-wide text-on-surface-variant">Adapter</span>

        <Select.Root v-model="state.adapter">
          <Select.Activator class="mt-1 flex items-center justify-between w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
            <Select.Value v-slot="{ selectedValue }">
              {{ selectedValue === 'none' ? 'None (static flags only)' : selectedValue }}
            </Select.Value>

            <Select.Placeholder class="text-on-surface-variant">Choose an adapter…</Select.Placeholder>

            <Select.Cue class="inline-flex opacity-50 transition-transform data-[state=open]:rotate-180">
              <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiChevronDown" fill="currentColor" /></svg>
            </Select.Cue>
          </Select.Activator>

          <Select.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
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

      <div v-if="state.adapter !== 'none'" class="border border-divider rounded-lg p-4 bg-surface-variant/50">
        <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Adapter configuration</div>

        <p class="text-sm text-on-surface-variant">
          API keys, environments, and other provider-specific options are passed to the
          <code class="text-xs px-1.5 py-0.5 rounded bg-surface">{{ state.adapter }}</code>
          constructor in code, not from this form.
        </p>
      </div>

      <div>
        <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Static flags</div>

        <div class="space-y-2">
          <div
            v-for="(flag, index) in state.flags"
            :key="index"
            class="flex items-center gap-2"
          >
            <Input.Root v-model="flag.key" class="flex-1">
              <Input.Control
                class="w-full px-3 py-1.5 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono outline-none data-[focused]:border-primary transition-colors"
                placeholder="my-feature"
              />
            </Input.Root>

            <label class="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-divider bg-surface">
              <Checkbox.Root
                v-model="flag.default"
                class="size-5 border rounded inline-flex items-center justify-center border-divider data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              >
                <Checkbox.Indicator class="text-on-primary">
                  <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiCheck" fill="currentColor" /></svg>
                </Checkbox.Indicator>
              </Checkbox.Root>

              <span class="text-sm text-on-surface">on</span>
            </label>

            <Button.Root
              :aria-label="`Remove flag ${flag.key || index + 1}`"
              class="text-on-surface-variant hover:text-error p-1"
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
          class="mt-3 text-sm text-primary hover:opacity-80 inline-flex items-center gap-1"
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
