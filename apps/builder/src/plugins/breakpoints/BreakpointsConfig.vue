<script setup lang="ts">
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
          <button
            v-for="name in Object.keys(PRESETS)"
            :key="name"
            class="px-3 py-1.5 rounded-lg border border-divider text-sm hover:bg-surface-variant"
            type="button"
            @click="applyPreset(name as keyof typeof PRESETS)"
          >
            {{ name }}
          </button>
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

            <input
              v-model.number="state.breakpoints[name]"
              class="flex-1 px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
              min="0"
              type="number"
            >
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

        <select
          v-if="mode === 'named'"
          v-model="state.mobileBreakpoint"
          class="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm"
        >
          <option v-for="name in BREAKPOINT_NAMES" :key="name" :value="name">{{ name }}</option>
        </select>

        <input
          v-else
          v-model.number="state.mobileBreakpoint"
          class="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
          min="0"
          placeholder="1145"
          type="number"
        >
      </div>
    </div>
  </PluginConfigShell>
</template>
