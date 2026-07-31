<script setup lang="ts">
  import { mdiCheck } from '@mdi/js'

  // Framework
  import { Button, Checkbox, Input } from '@vuetify/v0'

  import { defaultConfig, SAMPLE_MESSAGES } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { onBeforeUnmount, reactive, shallowRef, toRef, watch } from 'vue'

  // Types
  import type { LocaleConfig } from './defaults'

  const store = useBuilderStore()

  const stored = store.pluginConfig.useLocale as LocaleConfig | undefined
  const initial: LocaleConfig = JSON.parse(JSON.stringify(stored ?? defaultConfig))

  const state = reactive({
    default: initial.default,
    fallback: initial.fallback,
    persist: !!initial.persist,
  })

  const messagesText = shallowRef(JSON.stringify(initial.messages, null, 2))
  const messagesError = shallowRef('')
  const messages = shallowRef<Record<string, Record<string, unknown>>>(initial.messages)

  // The registered languages are the keys of `messages` — createLocale has no separate list.
  const languages = toRef(() => Object.keys(messages.value))

  function parse (): Record<string, Record<string, unknown>> | null {
    try {
      return messagesText.value.trim() ? JSON.parse(messagesText.value) : {}
    } catch (error) {
      messagesError.value = (error as Error).message
      return null
    }
  }

  function snapshot (): LocaleConfig {
    return {
      default: state.default,
      fallback: state.fallback,
      messages: messages.value,
      persist: state.persist,
    }
  }

  function onSave () {
    const parsed = parse()
    if (!parsed) return

    messagesError.value = ''
    messages.value = parsed

    store.savePluginConfig('useLocale', snapshot())
  }

  watch([state, messagesText], () => {
    const parsed = parse()
    if (!parsed) return

    messagesError.value = ''
    messages.value = parsed

    store.setDraft('useLocale', JSON.parse(JSON.stringify(snapshot())))
  }, { deep: true, immediate: true })

  onBeforeUnmount(() => store.clearDraft('useLocale'))
</script>

<template>
  <PluginConfigShell plugin-id="useLocale" @save="onSave">
    <template #description>
      <p class="text-on-surface-variant mb-8">
        Configure translation messages and the default locale. Each top-level key in
        Messages registers a language; additional languages can be lazy-loaded at runtime
        via <code class="text-xs px-1.5 py-0.5 rounded bg-surface-variant">locale.register()</code>.
      </p>
    </template>

    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span class="text-xs uppercase tracking-wide text-on-surface-variant">Default locale</span>

          <Input.Root v-model="state.default">
            <Input.Control
              class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
              placeholder="en"
            />
          </Input.Root>

          <span class="block mt-1 text-xs text-on-surface-variant">
            Selected on startup. Must match a key in Messages.
          </span>
        </label>

        <label class="block">
          <span class="text-xs uppercase tracking-wide text-on-surface-variant">Fallback locale</span>

          <Input.Root v-model="state.fallback">
            <Input.Control
              class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
              placeholder="en"
            />
          </Input.Root>

          <span class="block mt-1 text-xs text-on-surface-variant">
            Used when a key is missing from the active locale.
          </span>
        </label>
      </div>

      <label class="flex items-center gap-2">
        <Checkbox.Root
          v-model="state.persist"
          class="size-5 border rounded inline-flex items-center justify-center border-divider data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        >
          <Checkbox.Indicator class="text-on-primary">
            <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiCheck" fill="currentColor" /></svg>
          </Checkbox.Indicator>
        </Checkbox.Root>

        <span class="text-sm text-on-surface">Persist selection to storage</span>
      </label>

      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs uppercase tracking-wide text-on-surface-variant">Messages (JSON)</span>

          <Button.Root
            class="text-xs text-primary hover:opacity-80"
            @click="messagesText = SAMPLE_MESSAGES"
          >
            Load sample
          </Button.Root>
        </div>

        <!-- v0 has no multi-line text input; native textarea is the documented exception -->
        <textarea
          v-model="messagesText"
          aria-label="Locale messages as JSON"
          class="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
          rows="10"
          spellcheck="false"
        />

        <p v-if="messagesError" class="mt-1 text-xs text-error">{{ messagesError }}</p>

        <p v-else class="mt-1 text-xs text-on-surface-variant">
          <template v-if="languages.length > 0">
            Registers {{ languages.length }} {{ languages.length === 1 ? 'language' : 'languages' }}:
            <span class="font-mono">{{ languages.join(', ') }}</span>
          </template>

          <template v-else>
            No languages yet — add a top-level key such as <span class="font-mono">en</span>.
          </template>
        </p>
      </div>
    </div>
  </PluginConfigShell>
</template>
