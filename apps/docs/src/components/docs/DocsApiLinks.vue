<script setup lang="ts">
  // Utilities
  import { toKebab } from '@/utilities/strings'
  import { computed } from 'vue'

  // Types
  import type { ComponentApi, ComposableApi } from '@build/generate-api'

  const props = defineProps<{
    /** Component APIs to display */
    componentApis?: ComponentApi[]
    /** Composable API to display */
    composableApi?: ComposableApi | null
  }>()

  // Extract parent name from compound component (e.g., "Pagination" from "Pagination.Root")
  const parentName = computed(() => {
    const first = props.componentApis?.[0]?.name
    if (!first) return null
    const dotIndex = first.indexOf('.')
    return dotIndex > 0 ? first.slice(0, dotIndex) : first
  })

  // Generate link for a component API card
  function getComponentLink (api: ComponentApi) {
    const dotIndex = api.name.indexOf('.')
    if (dotIndex > 0 && parentName.value) {
      // Compound component: link to parent page with anchor
      return `/api/${toKebab(parentName.value)}#${toKebab(api.name)}`
    }
    // Simple component: link to its own page
    return `/api/${toKebab(api.name)}`
  }
</script>

<template>
  <div class="grid gap-4 md:grid-cols-2 mt-4">
    <!-- Component API links -->
    <template v-if="componentApis?.length">
      <router-link
        v-for="api in componentApis"
        :key="api.name"
        class="border border-divider rounded-lg p-4 hover:border-primary hover:bg-surface-tint transition-colors no-underline"
        :to="getComponentLink(api)"
      >
        <div class="font-semibold text-on-surface">{{ api.name }}</div>
        <div class="text-sm text-on-surface-variant mt-1">
          {{ api.props.length }} prop{{ api.props.length === 1 ? '' : 's' }}<template v-if="api.events.length > 0">, {{ api.events.length }} event{{ api.events.length === 1 ? '' : 's' }}</template><template v-if="api.slots.length > 0">, {{ api.slots.length }} slot{{ api.slots.length === 1 ? '' : 's' }}</template>
        </div>
      </router-link>
    </template>

    <!-- Composable API link -->
    <template v-else-if="composableApi">
      <router-link
        class="border border-divider rounded-lg p-4 hover:border-primary hover:bg-surface-tint transition-colors no-underline"
        :to="`/api/${toKebab(composableApi.name)}`"
      >
        <div class="font-semibold text-on-surface">{{ composableApi.name }}</div>
        <div class="text-sm text-on-surface-variant mt-1">
          <template v-if="composableApi.functions.length > 0">{{ composableApi.functions.length }} function{{ composableApi.functions.length === 1 ? '' : 's' }}</template>
          <template v-if="composableApi.options.length > 0"><template v-if="composableApi.functions.length > 0">, </template>{{ composableApi.options.length }} option{{ composableApi.options.length === 1 ? '' : 's' }}</template>
          <template v-if="composableApi.properties.length > 0"><template v-if="composableApi.functions.length > 0 || composableApi.options.length > 0">, </template>{{ composableApi.properties.length }} propert{{ composableApi.properties.length === 1 ? 'y' : 'ies' }}</template>
          <template v-if="composableApi.methods.length > 0"><template v-if="composableApi.functions.length > 0 || composableApi.options.length > 0 || composableApi.properties.length > 0">, </template>{{ composableApi.methods.length }} method{{ composableApi.methods.length === 1 ? '' : 's' }}</template>
        </div>
      </router-link>
    </template>
  </div>
</template>
