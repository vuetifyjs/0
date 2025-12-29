<script lang="ts" setup>
  // Types
  import type { ComponentApi, ComposableApi } from '../../../build/generate-api'

  defineProps<{
    /** Component APIs to display */
    componentApis?: ComponentApi[]
    /** Composable API to display */
    composableApi?: ComposableApi | null
  }>()

  function toKebab (str: string): string {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
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
        :to="`/api/${toKebab(api.name)}`"
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
          <template v-if="composableApi.options.length > 0">{{ composableApi.options.length }} option{{ composableApi.options.length === 1 ? '' : 's' }}</template>
          <template v-if="composableApi.properties.length > 0"><template v-if="composableApi.options.length > 0">, </template>{{ composableApi.properties.length }} propert{{ composableApi.properties.length === 1 ? 'y' : 'ies' }}</template>
          <template v-if="composableApi.methods.length > 0"><template v-if="composableApi.options.length > 0 || composableApi.properties.length > 0">, </template>{{ composableApi.methods.length }} method{{ composableApi.methods.length === 1 ? '' : 's' }}</template>
        </div>
      </router-link>
    </template>
  </div>
</template>
