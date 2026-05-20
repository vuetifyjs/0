<script setup lang="ts">
  import { mdiClose, mdiPlus } from '@mdi/js'

  import { ADAPTERS, defaultConfig, SAMPLE_MESSAGES } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { reactive, shallowRef } from 'vue'

  // Types
  import type { LocaleConfig } from './defaults'

  const store = useBuilderStore()

  const stored = store.pluginConfig.useLocale as LocaleConfig | undefined
  const initial = structuredClone(stored ?? defaultConfig)

  const state = reactive<LocaleConfig>({
    default: initial.default,
    fallback: initial.fallback,
    locales: [...initial.locales],
    adapter: initial.adapter,
    messages: { ...initial.messages },
    persist: !!initial.persist,
  })

  const messagesText = shallowRef(JSON.stringify(state.messages, null, 2))
  const messagesError = shallowRef('')

  function addLocale () {
    state.locales.push('')
  }

  function removeLocale (index: number) {
    state.locales.splice(index, 1)
  }

  function onSave () {
    let parsed: Record<string, Record<string, unknown>>
    try {
      parsed = messagesText.value.trim() ? JSON.parse(messagesText.value) : {}
      messagesError.value = ''
    } catch (error) {
      messagesError.value = (error as Error).message
      return
    }

    const config: LocaleConfig = {
      default: state.default,
      fallback: state.fallback,
      locales: state.locales.filter(Boolean),
      adapter: state.adapter,
      messages: parsed,
      persist: state.persist,
    }
    store.savePluginConfig('useLocale', config)
  }
</script>

<template>
  <PluginConfigShell plugin-id="useLocale" @save="onSave">
    <template #description>
      <p class="text-on-surface-variant mb-8">
        Configure translation messages, default locale, and adapter. Messages can
        be lazy-loaded at runtime via <code class="text-xs px-1.5 py-0.5 rounded bg-surface-variant">locale.register()</code>.
      </p>
    </template>

    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span class="text-xs uppercase tracking-wide text-on-surface-variant">Default locale</span>

          <input
            v-model="state.default"
            class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
            placeholder="en"
          >
        </label>

        <label class="block">
          <span class="text-xs uppercase tracking-wide text-on-surface-variant">Fallback locale</span>

          <input
            v-model="state.fallback"
            class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
            placeholder="en"
          >
        </label>
      </div>

      <div>
        <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Supported locales</div>

        <div class="space-y-2">
          <div
            v-for="(_, index) in state.locales"
            :key="index"
            class="flex items-center gap-2"
          >
            <input
              v-model="state.locales[index]"
              class="flex-1 px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
              placeholder="en"
            >

            <button
              class="text-on-surface-variant hover:text-error p-1"
              type="button"
              @click="removeLocale(index)"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiClose" fill="currentColor" /></svg>
            </button>
          </div>
        </div>

        <button
          class="mt-3 text-sm text-primary hover:opacity-80 inline-flex items-center gap-1"
          type="button"
          @click="addLocale"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
          Add locale
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span class="text-xs uppercase tracking-wide text-on-surface-variant">Adapter</span>

          <select
            v-model="state.adapter"
            class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm"
          >
            <option v-for="kind in ADAPTERS" :key="kind" :value="kind">{{ kind }}</option>
          </select>
        </label>

        <label class="flex items-center gap-2 mt-5">
          <input v-model="state.persist" class="w-4 h-4" type="checkbox">
          <span class="text-sm text-on-surface">Persist selection to storage</span>
        </label>
      </div>

      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs uppercase tracking-wide text-on-surface-variant">Messages (JSON)</span>

          <button
            class="text-xs text-primary hover:opacity-80"
            type="button"
            @click="messagesText = SAMPLE_MESSAGES"
          >
            Load sample
          </button>
        </div>

        <textarea
          v-model="messagesText"
          class="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
          rows="10"
          spellcheck="false"
        />

        <p v-if="messagesError" class="mt-1 text-xs text-error">{{ messagesError }}</p>
      </div>
    </div>
  </PluginConfigShell>
</template>
