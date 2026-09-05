<script setup lang="ts">
  import { mdiCheck, mdiChevronDown } from '@mdi/js'

  // Framework
  import { Button, isNumber, NumberField, Radio, Select } from '@vuetify/v0'

  import { BREAKPOINT_NAMES, defaultConfig, PRESETS } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { computed, onBeforeUnmount, reactive, shallowRef, watch } from 'vue'

  // Types
  import type { BreakpointsConfig } from './defaults'

  const store = useBuilderStore()

  const stored = store.pluginConfig.useBreakpoints as BreakpointsConfig | undefined
  const initial = JSON.parse(JSON.stringify(stored ?? defaultConfig))

  const state = reactive<BreakpointsConfig>({
    mobileBreakpoint: initial.mobileBreakpoint,
    breakpoints: { ...initial.breakpoints },
  })

  const mode = shallowRef<'named' | 'pixels'>(
    typeof state.mobileBreakpoint === 'number' ? 'pixels' : 'named',
  )

  const pixels = computed<number | null | undefined>({
    get: () => isNumber(state.mobileBreakpoint) ? state.mobileBreakpoint : 0,
    set: value => {
      state.mobileBreakpoint = value ?? 0
    },
  })

  function applyPreset (name: keyof typeof PRESETS) {
    state.breakpoints = { ...PRESETS[name] }
  }

  function onModeChange (next: 'named' | 'pixels') {
    mode.value = next
    if (next === 'named' && typeof state.mobileBreakpoint === 'number') {
      state.mobileBreakpoint = 'lg'
    } else if (next === 'pixels' && typeof state.mobileBreakpoint === 'string') {
      state.mobileBreakpoint = state.breakpoints[state.mobileBreakpoint] ?? 1145
    }
  }

  function snapshot (): BreakpointsConfig {
    return {
      mobileBreakpoint: state.mobileBreakpoint,
      breakpoints: { ...state.breakpoints },
    }
  }

  function onSave () {
    store.savePluginConfig('useBreakpoints', snapshot())
  }

  watch(state, () => {
    store.setDraft('useBreakpoints', JSON.parse(JSON.stringify(snapshot())))
  }, { deep: true, immediate: true })

  onBeforeUnmount(() => store.clearDraft('useBreakpoints'))
</script>

<template>
  <PluginConfigShell plugin-id="useBreakpoints" @save="onSave">
    <template #description>
      <p class="t-body text-on-surface-variant">
        Define pixel thresholds for named breakpoints
        (<code class="code-chip">xs</code>,
        <code class="code-chip">sm</code>,
        <code class="code-chip">md</code>,
        <code class="code-chip">lg</code>,
        <code class="code-chip">xl</code>,
        <code class="code-chip">xxl</code>)
        and pick the cutoff for mobile layouts.
      </p>
    </template>

    <div class="space-y-6">
      <div>
        <div class="field-label mb-2">Presets</div>

        <div class="flex flex-wrap gap-2">
          <Button.Root
            v-for="name in Object.keys(PRESETS)"
            :key="name"
            class="pick pick-off h-9 px-3 inline-flex items-center text-[0.8125rem] font-medium"
            @click="applyPreset(name as keyof typeof PRESETS)"
          >
            {{ name }}
          </Button.Root>
        </div>
      </div>

      <div>
        <div class="field-label mb-2">Breakpoints (px)</div>

        <div class="space-y-2">
          <div
            v-for="name in BREAKPOINT_NAMES"
            :key="name"
            class="flex items-center gap-3"
          >
            <span class="w-12 font-mono text-sm text-on-surface">{{ name }}</span>

            <NumberField.Root
              v-model="state.breakpoints[name]"
              class="flex-1"
              :label="`${name} breakpoint in pixels`"
              :min="0"
            >
              <NumberField.Control class="field-input font-mono" />
            </NumberField.Root>
          </div>
        </div>
      </div>

      <div>
        <div class="field-label mb-2">Mobile breakpoint</div>

        <Radio.Group aria-label="Mobile breakpoint mode" class="flex items-center gap-3 mb-3" :model-value="mode" @update:model-value="onModeChange($event as 'named' | 'pixels')">
          <label class="flex items-center gap-2">
            <Radio.Root
              class="size-5 border rounded-full inline-flex items-center justify-center border-divider data-[state=checked]:border-primary"
              value="named"
            >
              <Radio.Indicator class="size-2.5 rounded-full bg-primary" />
            </Radio.Root>

            <span class="text-sm">Named</span>
          </label>

          <label class="flex items-center gap-2">
            <Radio.Root
              class="size-5 border rounded-full inline-flex items-center justify-center border-divider data-[state=checked]:border-primary"
              value="pixels"
            >
              <Radio.Indicator class="size-2.5 rounded-full bg-primary" />
            </Radio.Root>

            <span class="text-sm">Pixels</span>
          </label>
        </Radio.Group>

        <Select.Root v-if="mode === 'named'" v-model="state.mobileBreakpoint">
          <Select.Activator aria-label="Mobile breakpoint" class="field-activator">
            <Select.Value v-slot="{ selectedValue }">
              {{ selectedValue }}
            </Select.Value>

            <Select.Placeholder class="text-on-surface-variant">Choose…</Select.Placeholder>

            <Select.Cue class="inline-flex opacity-50 transition-transform data-[state=open]:rotate-180">
              <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiChevronDown" fill="currentColor" /></svg>
            </Select.Cue>
          </Select.Activator>

          <Select.Content class="field-menu" :style="{ minWidth: 'anchor-size(width)' }">
            <Select.Item
              v-for="name in BREAKPOINT_NAMES"
              :id="name"
              :key="name"
              :value="name"
            >
              <template #default="{ isSelected, isHighlighted }">
                <div
                  class="flex items-center gap-2 px-3 py-2 rounded-md cursor-default select-none text-sm"
                  :class="[
                    isHighlighted
                      ? 'bg-primary text-on-primary'
                      : isSelected
                        ? 'text-primary font-medium'
                        : 'text-on-surface hover:bg-surface-variant',
                  ]"
                >
                  <svg class="w-4 h-4" :class="isSelected ? 'visible' : 'invisible'" viewBox="0 0 24 24"><path :d="mdiCheck" fill="currentColor" /></svg>
                  {{ name }}
                </div>
              </template>
            </Select.Item>
          </Select.Content>
        </Select.Root>

        <NumberField.Root v-else v-model="pixels" label="Mobile breakpoint in pixels" :min="0">
          <NumberField.Control
            class="field-input font-mono"
            placeholder="1145"
          />
        </NumberField.Root>
      </div>
    </div>
  </PluginConfigShell>
</template>
