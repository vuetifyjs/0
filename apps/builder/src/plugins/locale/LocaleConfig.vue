<script setup lang="ts">
  import { mdiClose, mdiPlus } from '@mdi/js'

  // Framework
  import { Button, Checkbox, Input, Select } from '@vuetify/v0'

  import { ADAPTERS, defaultConfig, SAMPLE_MESSAGES } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { reactive, shallowRef } from 'vue'

  // Types
  import type { LocaleConfig } from './defaults'

  const store = useBuilderStore()

  const stored = store.pluginConfig.useLocale as LocaleConfig | undefined
  const initial = JSON.parse(JSON.stringify(stored ?? defaultConfig))

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

          <Input.Root v-model="state.default">
            <Input.Control
              class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
              placeholder="en"
            />
          </Input.Root>
        </label>

        <label class="block">
          <span class="text-xs uppercase tracking-wide text-on-surface-variant">Fallback locale</span>

          <Input.Root v-model="state.fallback">
            <Input.Control
              class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
              placeholder="en"
            />
          </Input.Root>
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
            <Input.Root v-model="state.locales[index]" class="flex-1">
              <Input.Control
                class="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
                placeholder="en"
              />
            </Input.Root>

            <Button.Root
              class="text-on-surface-variant hover:text-error p-1"
              @click="removeLocale(index)"
            >
              <Button.Icon>
                <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiClose" fill="currentColor" /></svg>
              </Button.Icon>
            </Button.Root>
          </div>
        </div>

        <Button.Root
          class="mt-3 text-sm text-primary hover:opacity-80 inline-flex items-center gap-1"
          @click="addLocale"
        >
          <Button.Icon>
            <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
          </Button.Icon>
          Add locale
        </Button.Root>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span class="text-xs uppercase tracking-wide text-on-surface-variant">Adapter</span>

          <Select.Root v-model="state.adapter">
            <Select.Activator class="mt-1 flex items-center justify-between w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm cursor-pointer focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
              <Select.Value v-slot="{ selectedValue }">
                {{ selectedValue }}
              </Select.Value>

              <Select.Placeholder class="text-on-surface-variant">Choose adapter…</Select.Placeholder>

              <Select.Cue v-slot="{ isOpen }" class="text-xs opacity-50">
                {{ isOpen ? '&#x25B4;' : '&#x25BE;' }}
              </Select.Cue>
            </Select.Activator>

            <Select.Content class="p-1 rounded-lg border border-divider bg-surface shadow-lg" :style="{ minWidth: 'anchor-size(width)' }">
              <Select.Item
                v-for="kind in ADAPTERS"
                :id="kind"
                :key="kind"
                :value="kind"
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
                    {{ kind }}
                  </div>
                </template>
              </Select.Item>
            </Select.Content>
          </Select.Root>
        </label>

        <label class="flex items-center gap-2 mt-5">
          <Checkbox.Root
            v-model="state.persist"
            class="size-5 border rounded inline-flex items-center justify-center border-divider data-[state=checked]:bg-primary data-[state=checked]:border-primary"
          >
            <Checkbox.Indicator class="text-on-primary text-sm">✓</Checkbox.Indicator>
          </Checkbox.Root>

          <span class="text-sm text-on-surface">Persist selection to storage</span>
        </label>
      </div>

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
          class="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
          rows="10"
          spellcheck="false"
        />

        <p v-if="messagesError" class="mt-1 text-xs text-error">{{ messagesError }}</p>
      </div>
    </div>
  </PluginConfigShell>
</template>
