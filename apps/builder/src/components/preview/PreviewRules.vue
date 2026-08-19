<script setup lang="ts">
  import { mdiCheck, mdiClose } from '@mdi/js'

  // Framework
  import { Input } from '@vuetify/v0'

  import { defaultConfig } from '@/plugins/rules/defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { shallowRef, toRef } from 'vue'

  // Types
  import type { RulesConfig } from '@/plugins/rules/defaults'

  function parses (value: string) {
    try {
      return !!new URL(value)
    } catch {
      return false
    }
  }

  // Mirrors the predicates the code generator emits for KNOWN_ALIASES; anything else
  // ships as a stub and has nothing to evaluate here either.
  const PREDICATES: Record<string, { test: (value: string) => boolean, hint: string }> = {
    required: { test: value => value.trim().length > 0, hint: 'not empty' },
    email: { test: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), hint: 'name@example.com' },
    min: { test: value => value.length >= 3, hint: 'at least 3 characters' },
    max: { test: value => value.length <= 12, hint: 'at most 12 characters' },
    pattern: { test: value => /^[a-z0-9-]+$/.test(value), hint: 'lowercase, digits, dashes' },
    url: { test: value => parses(value), hint: 'absolute URL' },
    numeric: { test: value => /^-?\d+(\.\d+)?$/.test(value), hint: 'a number' },
  }

  const store = useBuilderStore()

  const config = toRef(() => {
    if (store.draft?.id === 'useRules') return store.draft.config as RulesConfig

    return (store.pluginConfig.useRules as RulesConfig | undefined) ?? defaultConfig
  })

  const value = shallowRef('')

  const checks = toRef(() => (config.value.aliases ?? []).filter(Boolean).map(alias => {
    const predicate = PREDICATES[alias]

    return {
      alias,
      hint: predicate?.hint ?? 'stubbed — supply a predicate in code',
      known: !!predicate,
      passed: predicate ? predicate.test(value.value) : null,
    }
  }))

  const failed = toRef(() => checks.value.filter(check => check.passed === false).length)
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center gap-2 text-xs">
      <span class="px-2 py-0.5 rounded-full bg-primary text-on-primary font-mono">
        {{ checks.length }} alias{{ checks.length === 1 ? '' : 'es' }}
      </span>

      <span
        v-if="checks.length > 0"
        class="px-2 py-0.5 rounded-full border text-on-surface-variant"
        :class="failed > 0 ? 'border-error text-error' : 'border-divider'"
      >
        {{ failed > 0 ? `${failed} failing` : 'all passing' }}
      </span>
    </div>

    <MiniFrame title="sign up">
      <div class="space-y-3">
        <label class="block">
          <span class="text-[10px] uppercase tracking-wide text-on-surface-variant">Username</span>

          <Input.Root v-model="value">
            <Input.Control
              class="mt-1 w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface text-sm outline-none data-[focused]:border-primary transition-colors"
              placeholder="Type to validate…"
            />
          </Input.Root>
        </label>

        <ul v-if="checks.length > 0" class="space-y-1.5">
          <li
            v-for="check in checks"
            :key="check.alias"
            class="flex items-center gap-2 text-[11px]"
          >
            <span
              class="inline-flex size-4 items-center justify-center rounded-full flex-shrink-0"
              :class="check.passed === null
                ? 'border border-dashed border-divider text-on-surface-variant'
                : check.passed ? 'bg-primary text-on-primary' : 'bg-error text-white'"
            >
              <Icon v-if="check.passed !== null" :path="check.passed ? mdiCheck : mdiClose" :size="10" />
            </span>

            <span class="font-mono text-on-surface">{{ check.alias }}</span>

            <span class="text-on-surface-variant truncate">— {{ check.hint }}</span>
          </li>
        </ul>

        <p v-else class="text-[11px] italic text-on-surface-variant">
          No aliases selected — add one on the left to validate this field against it.
        </p>
      </div>
    </MiniFrame>
  </div>
</template>
