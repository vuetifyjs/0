<script setup lang="ts">
  // Framework
  import { Button, isObject, isString } from '@vuetify/v0'

  import { defaultConfig } from '@/plugins/locale/defaults'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { shallowRef, toRef, watch } from 'vue'

  // Types
  import type { LocaleConfig } from '@/plugins/locale/defaults'

  const store = useBuilderStore()

  const config = toRef(() => {
    if (store.draft?.id === 'useLocale') return store.draft.config as LocaleConfig
    return (store.pluginConfig.useLocale as LocaleConfig | undefined) ?? defaultConfig
  })

  const codes = toRef(() => (config.value.locales ?? []).filter(Boolean))

  const demo = shallowRef(config.value.default || codes.value[0] || 'en')

  watch(codes, current => {
    if (current.includes(demo.value)) return
    demo.value = current.includes(config.value.default)
      ? config.value.default
      : (current[0] ?? config.value.default)
  })

  watch(() => config.value.default, value => {
    demo.value = value || codes.value[0] || 'en'
  })

  function leaf (node: unknown, trail: string[]): { text: string, path: string[] } | null {
    if (!isObject(node)) return null
    for (const [key, value] of Object.entries(node)) {
      if (key.startsWith('$')) continue
      if (isString(value)) return { text: value, path: [...trail, key] }
      const nested = leaf(value, [...trail, key])
      if (nested) return nested
    }
    return null
  }

  const greeting = toRef(() => {
    const messages = config.value.messages ?? {}
    const primary = leaf(messages[demo.value], [demo.value])
    if (primary) return { ...primary, missing: false }
    const fallback = leaf(messages[config.value.fallback], [config.value.fallback])
    if (fallback) return { ...fallback, missing: true }
    return { text: 'Hello', path: [] as string[], missing: true }
  })

  const trail = toRef(() => greeting.value.path.join(' → ') || 'no messages found')

  function onSelect (code: string) {
    demo.value = code
  }
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap gap-2">
      <Button.Root
        v-for="code in codes"
        :key="code"
        class="px-3 py-1 rounded-full border text-xs font-mono transition-colors"
        :class="code === demo
          ? 'bg-primary text-on-primary border-primary'
          : 'border-divider text-on-surface-variant hover:bg-surface-variant'"
        @click="onSelect(code)"
      >
        {{ code }}
      </Button.Root>
    </div>

    <MiniFrame title="i18n">
      <div class="flex flex-col items-center gap-3 py-4">
        <span class="px-2 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-mono uppercase tracking-wide">
          {{ demo || '—' }}
        </span>

        <p class="text-2xl font-semibold text-on-surface transition-all">{{ greeting.text }}</p>

        <p class="text-[11px] font-mono text-on-surface-variant">{{ trail }}</p>
      </div>
    </MiniFrame>

    <p
      v-if="greeting.missing && demo && demo !== config.fallback"
      class="px-3 py-2 rounded-lg border border-divider bg-surface-variant/50 text-xs text-on-surface-variant"
    >
      "{{ demo }}" has no display messages yet — falls back to "{{ config.fallback }}"
    </p>
  </div>
</template>
