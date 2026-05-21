<script setup lang="ts">
  // Framework
  import { Button, NumberField, Select } from '@vuetify/v0'

  import { BREAKPOINT_NAMES, defaultConfig, PRESETS } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { reactive, shallowRef } from 'vue'

  // Types
  import type { BreakpointsConfig } from './defaults'

  const store = useBuilderStore()

  const stored = store.pluginConfig.useBreakpoints as BreakpointsConfig | undefined
  const initial = structuredClone(stored ?? defaultConfig)

  const state = reactive<BreakpointsConfig>({
    mobileBreakpoint: initial.mobileBreakpoint,
    breakpoints: { ...initial.breakpoints },
  })

  const mode = shallowRef<'named' | 'pixels'>(
    typeof state.mobileBreakpoint === 'number' ? 'pixels' : 'named',
  )

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

  function onSave () {
    const config: BreakpointsConfig = {
      mobileBreakpoint: state.mobileBreakpoint,
      breakpoints: { ...state.breakpoints },
    }
    store.savePluginConfig('useBreakpoints', config)
  }
</script>

<template>
  <PluginConfigShell plugin-id="useBreakpoints" @save="onSave">
    <template #description>
      <p class="text-on-surface-variant mb-8">
        Define pixel thresholds for named breakpoints
        (<code class="text-xs px-1.5 py-0.5 rounded bg-surface-variant">xs</code>,
        <code class="text-xs px-1.5 py-0.5 rounded bg-surface-variant">sm</code>,
        <code class="text-xs px-1.5 py-0.5 rounded bg-surface-variant">md</code>,
        <code class="text-xs px-1.5 py-0.5 rounded bg-surface-variant">lg</code>,
        <code class="text-xs px-1.5 py-0.5 rounded bg-surface-variant">xl</code>,
        <code class="text-xs px-1.5 py-0.5 rounded bg-surface-variant">xxl</code>)
        and pick the cutoff for mobile layouts.
      </p>
    </template>

    <div class="space-y-6">
      <div>
        <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Presets</div>

        <div class="flex flex-wrap gap-2">
          <Button.Root
            v-for="name in Object.keys(PRESETS)"
            :key="name"
            class="px-3 py-1.5 rounded-lg border border-divider text-sm hover:bg-surface-variant"
            @click="applyPreset(name as keyof typeof PRESETS)"
          >
            {{ name }}
          </Button.Root>
        </div>
      </div>

      <div>
        <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Breakpoints (px)</div>

        <div class="space-y-2">
          <div
            v-for="name in BREAKPOINT_NAMES"
            :key="name"
            class="flex items-center gap-3"
          >
            <span class="w-12 font-mono text-sm text-on-surface">{{ name }}</span>

            <NumberField.Root v-model="state.breakpoints[name]" :min="0">
              <NumberField.Control class="flex-1 px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono" />
            </NumberField.Root>
          </div>
        </div>
      </div>

      <div>
        <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Mobile breakpoint</div>

        <div class="flex items-center gap-3 mb-3">
          <label class="flex items-center gap-2">
            <input
              :checked="mode === 'named'"
              name="bp-mode"
              type="radio"
              value="named"
              @change="onModeChange('named')"
            >

            <span class="text-sm">Named</span>
          </label>

          <label class="flex items-center gap-2">
            <input
              :checked="mode === 'pixels'"
              name="bp-mode"
              type="radio"
              value="pixels"
              @change="onModeChange('pixels')"
            >

            <span class="text-sm">Pixels</span>
          </label>
        </div>

        <Select.Root v-if="mode === 'named'" v-model="state.mobileBreakpoint">
          <Select.Activator class="w-full flex items-center justify-between px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
            <Select.Value v-slot="{ selectedValue }">
              {{ selectedValue }}
            </Select.Value>

            <Select.Placeholder class="text-on-surface-variant">Choose…</Select.Placeholder>

            <Select.Cue v-slot="{ isOpen }" class="text-xs opacity-50">
              {{ isOpen ? '&#x25B4;' : '&#x25BE;' }}
            </Select.Cue>
          </Select.Activator>

          <Select.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
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
                  <span class="w-4 text-xs" :class="isSelected ? 'visible' : 'invisible'">&#x2713;</span>
                  {{ name }}
                </div>
              </template>
            </Select.Item>
          </Select.Content>
        </Select.Root>

        <NumberField.Root v-else v-model="state.mobileBreakpoint" :min="0">
          <NumberField.Control class="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono" placeholder="1145" />
        </NumberField.Root>
      </div>
    </div>
  </PluginConfigShell>
</template>
