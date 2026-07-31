<script setup lang="ts">
  import { mdiClose, mdiPlus } from '@mdi/js'

  // Framework
  import { Button, Input } from '@vuetify/v0'

  import { defaultConfig, KNOWN_ALIASES } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { onBeforeUnmount, ref, shallowRef, toRef, watch } from 'vue'

  // Types
  import type { RulesConfig } from './defaults'

  const store = useBuilderStore()

  const stored = store.pluginConfig.useRules as RulesConfig | undefined
  const initial: RulesConfig = JSON.parse(JSON.stringify(stored ?? defaultConfig))

  const aliases = ref<string[]>([...initial.aliases])
  const draft = shallowRef('')

  const suggestions = toRef(() => KNOWN_ALIASES.filter(name => !aliases.value.includes(name)))

  function add (name: string) {
    const trimmed = name.trim()
    if (!trimmed || aliases.value.includes(trimmed)) return
    aliases.value = [...aliases.value, trimmed]
  }

  function remove (name: string) {
    aliases.value = aliases.value.filter(alias => alias !== name)
  }

  function onAdd () {
    add(draft.value)
    draft.value = ''
  }

  function snapshot (): RulesConfig {
    return { aliases: [...aliases.value] }
  }

  function onSave () {
    store.savePluginConfig('useRules', snapshot())
  }

  watch(aliases, () => {
    store.setDraft('useRules', JSON.parse(JSON.stringify(snapshot())))
  }, { deep: true, immediate: true })

  onBeforeUnmount(() => {
    store.clearDraft('useRules')
  })
</script>

<template>
  <PluginConfigShell plugin-id="useRules" @save="onSave">
    <template #description>
      <p class="text-on-surface-variant mb-8">
        Name the validation aliases your forms will reference, then use them as strings:
        <code class="text-xs px-1.5 py-0.5 rounded bg-surface-variant">rules.resolve(['required', 'email'])</code>.
      </p>
    </template>

    <div class="space-y-6">
      <div class="border border-divider rounded-lg p-4 bg-surface-variant/50">
        <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">How aliases are generated</div>

        <p class="text-sm text-on-surface-variant">
          v0's <code class="text-xs px-1.5 py-0.5 rounded bg-surface">createRules</code>
          ships <strong>no built-in aliases</strong> — every predicate is supplied by you.
          The names below are scaffolded into your generated setup: the ones offered as
          suggestions come out as working predicates, and any other name comes out as a
          stub for you to fill in.
        </p>
      </div>

      <div>
        <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Aliases</div>

        <div v-if="aliases.length > 0" class="flex flex-wrap gap-2 mb-3">
          <span
            v-for="alias in aliases"
            :key="alias"
            class="inline-flex items-center gap-1 pl-3 pr-1 py-1 rounded-full border border-primary/40 bg-primary/5 text-sm font-mono text-on-surface"
          >
            {{ alias }}

            <Button.Root
              :aria-label="`Remove ${alias} alias`"
              class="text-on-surface-variant hover:text-error p-0.5 rounded-full"
              @click="remove(alias)"
            >
              <Button.Icon>
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24"><path :d="mdiClose" fill="currentColor" /></svg>
              </Button.Icon>
            </Button.Root>
          </span>
        </div>

        <p v-else class="text-sm text-on-surface-variant italic mb-3">
          No aliases yet.
        </p>

        <div class="flex items-center gap-2">
          <Input.Root v-model="draft" class="flex-1">
            <Input.Control
              aria-label="New alias name"
              class="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono outline-none data-[focused]:border-primary transition-colors"
              placeholder="phone"
              @keydown.enter.prevent="onAdd"
            />
          </Input.Root>

          <Button.Root
            class="px-3 py-2 rounded-lg border border-divider text-sm hover:bg-surface-variant inline-flex items-center gap-1"
            :disabled="!draft.trim()"
            @click="onAdd"
          >
            <Button.Icon>
              <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
            </Button.Icon>

            <Button.Content>Add</Button.Content>
          </Button.Root>
        </div>
      </div>

      <div v-if="suggestions.length > 0">
        <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Quick add</div>

        <div class="flex flex-wrap gap-2">
          <Button.Root
            v-for="name in suggestions"
            :key="name"
            class="px-3 py-1.5 rounded-full border border-divider text-sm font-mono hover:bg-surface-variant hover:border-primary/40 transition-colors"
            @click="add(name)"
          >
            + {{ name }}
          </Button.Root>
        </div>

        <p class="mt-2 text-xs text-on-surface-variant">
          These generate working predicates.
        </p>
      </div>
    </div>
  </PluginConfigShell>
</template>
