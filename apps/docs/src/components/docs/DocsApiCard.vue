<script setup lang="ts">
  // Composables
  import { useApiHelpers } from '@/composables/useApiHelpers'
  import { useSettings } from '@/composables/useSettings'
  import { useSyncedRef } from '@/composables/useSyncedRef'

  // Utilities
  import { toRef } from 'vue'

  // Types
  import type { ApiEvent, ApiFunction, ApiMethod, ApiOption, ApiProp, ApiProperty, ApiSlot } from '@build/generate-api'

  type ApiItem = ApiOption | ApiProperty | ApiMethod | ApiProp | ApiEvent | ApiSlot | ApiFunction

  const props = defineProps<{
    item: ApiItem
    kind: 'option' | 'property' | 'method' | 'prop' | 'event' | 'slot' | 'function'
    headingTag?: 'h3' | 'h4'
  }>()

  const api = useApiHelpers()
  const settings = useSettings()

  const lineWrap = useSyncedRef(settings.lineWrap)

  const key = `${props.kind}-${props.item.name}`

  const type = toRef(() => {
    const item = props.item
    if ('signature' in item && item.signature) return item.signature
    if (!item.type) return undefined
    if (['option', 'prop', 'event', 'slot'].includes(props.kind)) return item.type
    return api.formatSignature(item as ApiProperty | ApiMethod)
  })

  const language = toRef(() => {
    if (!('example' in props.item) || !props.item.example) return null
    return /^<(?:template|script)/.test(props.item.example.trim()) ? 'vue' : 'ts'
  })
</script>

<template>
  <HxApiCard
    class="border border-divider rounded-lg"
    :default="('default' in item && item.default) ? String(item.default) : undefined"
    :description="item.description"
    :has-example="'example' in item && !!item.example"
    :heading-tag
    :kind
    :name="item.name"
    :required="('required' in item && item.required) || undefined"
    :type
  >
    <template #heading>
      <a
        class="header-anchor"
        :href="`#${item.name}`"
        @click.prevent="api.scrollToAnchor(item.name)"
      >
        <span class="text-sm font-semibold font-mono text-primary">{{ item.name }}</span>

        <span
          v-if="(kind === 'option' || kind === 'prop') && 'required' in item && item.required"
          class="text-error text-xs ml-2"
        >
          required
        </span>
      </a>
    </template>

    <template #code>
      <div class="border-t border-divider bg-surface-tint">
        <button
          :aria-controls="`${api.uid}-${key}`"
          :aria-expanded="api.expanded.value.has(key)"
          class="w-full px-4 py-3 bg-transparent border-none font-inherit text-sm cursor-pointer flex items-center gap-2 text-on-surface transition-colors focus-visible:bg-surface focus-visible:text-primary"
          :class="!api.expanded.value.has(key) && 'hover:bg-surface hover:text-primary'"
          type="button"
          @click="api.toggle(key, item.example)"
        >
          <AppIcon v-if="api.expanded.value.has(key)" icon="chevron-up" :size="16" />
          <AppIcon v-else icon="code" :size="16" />
        </button>
      </div>

      <div
        v-if="api.expanded.value.has(key) && api.highlighted[key]"
        :id="`${api.uid}-${key}`"
        class="docs-api-card relative bg-pre group"
        :class="{ 'docs-api-card--wrap': lineWrap.value }"
      >
        <span
          v-if="language"
          class="absolute top-3 left-3 z-10 px-1.5 py-0.5 text-xs font-mono opacity-50 uppercase"
        >
          {{ language }}
        </span>

        <DocsCodeActions
          v-model:wrap="lineWrap"
          bin
          class="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
          :code="api.highlighted[key]?.code ?? ''"
          language="typescript"
          show-copy
          show-wrap
          :title="item.name"
        />

        <div v-html="api.highlighted[key]?.html ?? ''" />
      </div>
    </template>
  </HxApiCard>
</template>
