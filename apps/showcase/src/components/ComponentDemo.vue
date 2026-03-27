<script setup lang="ts">
  import * as codexComponents from '@paper/codex'
  import { CxCodeBlock } from '@paper/codex'

  // Components
  import PropControls from './PropControls.vue'

  // Utilities
  import { ref, toRef } from 'vue'

  // Types
  import type { DSComponent } from '@paper/codex'

  const { component } = defineProps<{
    component: DSComponent
    dsSlug: string
  }>()

  const propValues = ref<Record<string, unknown>>({})

  const resolved = toRef(() => {
    return (codexComponents as Record<string, unknown>)[component.name]
  })

  const source = toRef(() => generateSource())

  function generateSource (): string {
    const attrs = Object.entries(propValues.value)
      .filter(([key, val]) => {
        const def = component.props?.find(p => p.name === key)
        return def && String(val) !== def.default
      })
      .map(([key, val]) => {
        if (typeof val === 'boolean') return val ? key : `:${key}="false"`
        return `${key}="${val}"`
      })
      .join(' ')
    const tag = component.name
    return attrs ? `<${tag} ${attrs} />` : `<${tag} />`
  }

  function onValues (values: Record<string, unknown>) {
    propValues.value = values
  }
</script>

<template>
  <div class="flex flex-col border border-divider rounded-lg overflow-hidden">
    <!-- Preview + controls row -->
    <div class="flex min-h-48">
      <!-- Preview pane -->
      <div
        class="flex-1 flex items-center justify-center p-8"
        style="background-image: repeating-conic-gradient(var(--cx-color-surface-variant, #f0f0f0) 0% 25%, transparent 0% 50%); background-size: 16px 16px;"
      >
        <component
          :is="resolved"
          v-if="resolved"
          v-bind="propValues"
        />
        <div v-else class="text-xs text-on-surface-variant font-mono opacity-50">
          {{ component.name }} (not resolved)
        </div>
      </div>

      <!-- Controls pane -->
      <div
        v-if="component.props?.length"
        class="w-260px border-l border-divider overflow-y-auto"
      >
        <PropControls :props="component.props" @update:values="onValues" />
      </div>
    </div>

    <!-- Code block -->
    <div class="border-t border-divider">
      <CxCodeBlock :code="source" language="html" />
    </div>
  </div>
</template>
