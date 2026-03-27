<script setup lang="ts">
  import {
    CxBadge,
    CxBreadcrumbs,
    CxCodeBlock,
    CxLink,
    CxPageNavigator,
  } from '@paper/codex'

  // Composables
  import { useShowcase } from '../../../composables/useShowcase'

  // Utilities
  import { toRef } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const { getComposable, getDS } = useShowcase()

  const slug = toRef(() => route.params.ds as string)
  const name = toRef(() => route.params.composable as string)

  const ds = toRef(() => getDS(slug.value))
  const composable = toRef(() => getComposable(slug.value, name.value))

  const breadcrumbs = toRef(() => [
    { label: 'Home', to: '/' },
    { label: ds.value?.name ?? slug.value, to: `/${slug.value}` },
    { label: 'Composables', to: `/${slug.value}/composables` },
    { label: composable.value?.category ?? '', to: `/${slug.value}/composables` },
    { label: name.value },
  ])

  const siblings = toRef(() => {
    const composables = ds.value?.composables ?? []
    const index = composables.findIndex(c => c.name === name.value)
    return {
      prev: index > 0 ? composables[index - 1] : undefined,
      next: index < composables.length - 1 ? composables[index + 1] : undefined,
    }
  })

  const prev = toRef(() => {
    const p = siblings.value.prev
    if (!p) return undefined
    return { label: p.name, to: `/${slug.value}/composables/${p.name}` }
  })

  const next = toRef(() => {
    const n = siblings.value.next
    if (!n) return undefined
    return { label: n.name, to: `/${slug.value}/composables/${n.name}` }
  })
</script>

<template>
  <div v-if="composable" class="p-8 max-w-4xl">
    <CxBreadcrumbs class="mb-6" :items="breadcrumbs" />

    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-wrap items-center gap-3 mb-2">
        <h1 class="text-3xl font-bold font-mono">{{ composable.name }}</h1>
        <CxBadge color="primary" variant="subtle">{{ composable.category }}</CxBadge>
        <CxLink
          v-if="composable.v0"
          class="no-underline"
          :to="composable.v0"
        >
          <CxBadge color="secondary" variant="outlined">v0</CxBadge>
        </CxLink>
      </div>
      <p v-if="composable.description" class="text-on-surface-variant">{{ composable.description }}</p>
    </div>

    <!-- Signature -->
    <template v-if="composable.signature">
      <h2 class="text-xl font-semibold mb-3">Signature</h2>
      <CxCodeBlock
        class="mb-8"
        :code="composable.signature"
        language="ts"
      />
    </template>

    <!-- Returns -->
    <template v-if="composable.returns?.length">
      <h2 class="text-xl font-semibold mb-3">Returns</h2>
      <div class="mb-8 overflow-x-auto">
        <table class="w-full text-sm border-collapse">
          <thead>
            <tr class="border-b border-divider text-left">
              <th class="pb-2 pr-6 font-semibold text-on-surface-variant">Name</th>
              <th class="pb-2 pr-6 font-semibold text-on-surface-variant">Type</th>
              <th class="pb-2 font-semibold text-on-surface-variant">Description</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="ret in composable.returns"
              :key="ret.name"
              class="border-b border-divider last:border-0"
            >
              <td class="py-2 pr-6 font-mono text-xs">{{ ret.name }}</td>
              <td class="py-2 pr-6 font-mono text-xs text-on-surface-variant">{{ ret.type }}</td>
              <td class="py-2 text-on-surface-variant">{{ ret.description ?? '' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>

    <!-- Examples -->
    <template v-if="composable.examples?.length">
      <h2 class="text-xl font-semibold mb-4">Examples</h2>
      <div
        v-for="example in composable.examples"
        :key="example.title"
        class="mb-8"
      >
        <h3 class="text-lg font-semibold mb-1">{{ example.title }}</h3>
        <p v-if="example.description" class="text-on-surface-variant text-sm mb-4">{{ example.description }}</p>
        <component :is="example.component" />
      </div>
    </template>

    <CxPageNavigator class="mt-10" :next :prev />
  </div>

  <div v-else class="p-8">
    <p class="text-on-surface-variant">Composable not found.</p>
  </div>
</template>
