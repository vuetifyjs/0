<script setup lang="ts">
  import { mdiClose, mdiPlus } from '@mdi/js'

  import { defaultConfig, SAMPLE_SCHEMA_JSON } from './defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { reactive, shallowRef } from 'vue'

  // Types
  import type { RuleAliasDef, RulesConfig } from './defaults'

  const store = useBuilderStore()

  const stored = store.pluginConfig.useRules as RulesConfig | undefined
  const initial = structuredClone(stored ?? defaultConfig)

  const state = reactive({
    aliases: initial.aliases.map<RuleAliasDef>(alias => ({ ...alias })),
  })

  const schemaText = shallowRef(initial.customSchemaJson ?? '')
  const schemaError = shallowRef('')

  function addAlias () {
    state.aliases.push({ name: '', description: '' })
  }

  function removeAlias (index: number) {
    state.aliases.splice(index, 1)
  }

  function onSave () {
    const trimmed = schemaText.value.trim()

    if (trimmed) {
      try {
        JSON.parse(trimmed)
        schemaError.value = ''
      } catch (error) {
        schemaError.value = (error as Error).message
        return
      }
    } else {
      schemaError.value = ''
    }

    const aliases = state.aliases
      .map(alias => ({ name: alias.name.trim(), description: alias.description.trim() }))
      .filter(alias => alias.name)

    const config: RulesConfig = {
      aliases,
      customSchemaJson: trimmed || undefined,
    }
    store.savePluginConfig('useRules', config)
  }
</script>

<template>
  <PluginConfigShell plugin-id="useRules" @save="onSave">
    <template #description>
      <p class="text-on-surface-variant mb-8">
        Register named validation aliases and optional Standard Schema definitions.
        Predicate functions are wired in code; this form captures the aliases your
        forms will reference by name.
      </p>
    </template>

    <div class="space-y-6">
      <div class="border border-divider rounded-lg p-4 bg-surface-variant/50">
        <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">No built-ins</div>

        <p class="text-sm text-on-surface-variant">
          v0's <code class="text-xs px-1.5 py-0.5 rounded bg-surface">createRules</code>
          ships <strong>no built-in rule aliases</strong>. Every alias you want —
          <code class="text-xs px-1.5 py-0.5 rounded bg-surface">required</code>,
          <code class="text-xs px-1.5 py-0.5 rounded bg-surface">email</code>,
          <code class="text-xs px-1.5 py-0.5 rounded bg-surface">min</code>,
          <code class="text-xs px-1.5 py-0.5 rounded bg-surface">pattern</code>, etc. —
          must be defined by you. Names you list here become the placeholders the form
          designer will eventually wire to predicate functions in code.
        </p>
      </div>

      <div>
        <div class="text-xs uppercase tracking-wide text-on-surface-variant mb-2">Aliases</div>

        <div class="space-y-2">
          <div
            v-for="(alias, index) in state.aliases"
            :key="index"
            class="grid grid-cols-[1fr_2fr_auto] gap-2 items-center"
          >
            <input
              v-model="alias.name"
              class="px-3 py-1.5 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
              placeholder="required"
            >

            <input
              v-model="alias.description"
              class="px-3 py-1.5 rounded-lg border border-divider bg-surface text-on-surface text-sm"
              placeholder="value must not be empty"
            >

            <button
              class="text-on-surface-variant hover:text-error p-1"
              title="Remove alias"
              type="button"
              @click="removeAlias(index)"
            >
              <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiClose" fill="currentColor" /></svg>
            </button>
          </div>
        </div>

        <button
          class="mt-3 text-sm text-primary hover:opacity-80 inline-flex items-center gap-1"
          type="button"
          @click="addAlias"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiPlus" fill="currentColor" /></svg>
          Add alias
        </button>
      </div>

      <div>
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs uppercase tracking-wide text-on-surface-variant">Custom schema (JSON)</span>

          <button
            class="text-xs text-primary hover:opacity-80"
            type="button"
            @click="schemaText = SAMPLE_SCHEMA_JSON"
          >
            Load sample
          </button>
        </div>

        <textarea
          v-model="schemaText"
          class="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm font-mono"
          placeholder="{}"
          rows="10"
          spellcheck="false"
        />

        <p v-if="schemaError" class="mt-1 text-xs text-error">{{ schemaError }}</p>

        <p class="mt-1 text-xs text-on-surface-variant">
          For Standard Schema consumers (Zod, Valibot, ArkType). Parsed only — the actual
          schema is wired in code.
        </p>
      </div>
    </div>
  </PluginConfigShell>
</template>
