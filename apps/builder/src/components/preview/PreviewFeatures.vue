<script setup lang="ts">
  // Framework
  import { Switch } from '@vuetify/v0'

  import { defaultConfig } from '@/plugins/features/defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { ref, toRef, watch } from 'vue'

  // Types
  import type { FeaturesConfig } from '@/plugins/features/defaults'

  const store = useBuilderStore()

  const config = toRef(() => {
    if (store.draft?.id === 'useFeatures') return store.draft.config as FeaturesConfig

    return (store.pluginConfig.useFeatures as FeaturesConfig | undefined) ?? defaultConfig
  })

  const flags = toRef(() => Object.entries(config.value.features ?? {}).filter(([key]) => !!key))

  const state = ref<Record<string, boolean>>({})

  // Last configured default seen per flag. A toggle made here is local until the
  // configured default itself changes, at which point the switch re-seeds from config.
  let seeded: Record<string, boolean> = {}

  watch(flags, list => {
    const next: Record<string, boolean> = {}

    for (const [key, value] of list) {
      next[key] = seeded[key] === !!value ? state.value[key] ?? !!value : !!value
    }

    seeded = Object.fromEntries(list.map(([key, value]) => [key, !!value]))
    state.value = next
  }, { immediate: true })

  const on = toRef(() => flags.value.filter(([key]) => state.value[key]).map(([key]) => key))
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2 text-xs">
      <span class="px-2 py-0.5 rounded-full bg-primary text-on-primary font-mono">
        {{ on.length }}/{{ flags.length }} on
      </span>

      <span
        v-if="config.adapter !== 'none'"
        class="ml-auto px-2 py-0.5 rounded-full border border-divider text-on-surface-variant truncate"
      >
        {{ config.adapter }}
      </span>
    </div>

    <MiniFrame title="feature flags">
      <div v-if="flags.length > 0" class="space-y-3">
        <label
          v-for="[key] in flags"
          :key
          class="flex items-center justify-between gap-3"
        >
          <span class="font-mono text-[11px] text-on-surface truncate">{{ key }}</span>

          <Switch.Root
            v-model="state[key]"
            class="inline-flex items-center border-none bg-transparent p-0 outline-none"
            :label="key"
          >
            <Switch.Track class="relative inline-flex items-center w-8 h-4.5 rounded-full bg-on-surface/20 transition-colors data-[state=checked]:bg-primary">
              <Switch.Thumb class="block size-3.5 translate-x-0.5 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-3.75" />
            </Switch.Track>
          </Switch.Root>
        </label>

        <div class="pt-3 border-t border-divider space-y-2">
          <div
            v-for="[key] in flags"
            v-show="state[key]"
            :key
            class="rounded-lg border border-primary/40 bg-primary/10 px-3 py-2"
          >
            <p class="text-[11px] font-medium text-on-surface truncate">{{ key }} panel</p>
            <p class="text-[10px] text-on-surface-variant">Gated UI rendered only while the flag is on.</p>
          </div>

          <p v-if="on.length === 0" class="text-[11px] italic text-on-surface-variant">
            Every flag is off — the app renders without any gated blocks.
          </p>
        </div>
      </div>

      <p v-else class="py-6 text-center text-[11px] italic text-on-surface-variant">
        No flags defined yet — add one on the left to see it gate a block here.
      </p>
    </MiniFrame>
  </div>
</template>
