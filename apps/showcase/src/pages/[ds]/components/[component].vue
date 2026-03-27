<script setup lang="ts">
  import {
    CxBadge,
    CxBreadcrumbs,
    CxLink,
    CxPageNavigator,
    CxTabPanel,
    CxTabs,
  } from '@paper/codex'

  // Components
  import ComponentDemo from '../../../components/ComponentDemo.vue'

  // Composables
  import { useShowcase } from '../../../composables/useShowcase'

  // Utilities
  import { shallowRef, toRef } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const { getComponent, getDS } = useShowcase()

  const slug = toRef(() => route.params.ds as string)
  const name = toRef(() => route.params.component as string)

  const ds = toRef(() => getDS(slug.value))
  const component = toRef(() => getComponent(slug.value, name.value))

  const breadcrumbs = toRef(() => [
    { label: 'Home', to: '/' },
    { label: ds.value?.name ?? slug.value, to: `/${slug.value}` },
    { label: 'Components', to: `/${slug.value}/components` },
    { label: component.value?.category ?? '', to: `/${slug.value}/components` },
    { label: name.value },
  ])

  const tabItems = toRef(() => {
    const items = []
    if (component.value?.props?.length) items.push({ value: 'api', label: 'API' })
    if (component.value?.subComponents?.length) items.push({ value: 'sub-components', label: 'Sub-components' })
    if (component.value?.examples?.length) items.push({ value: 'examples', label: 'Examples' })
    return items
  })

  const activeTab = shallowRef<string>('')

  const siblings = toRef(() => {
    const components = ds.value?.components ?? []
    const index = components.findIndex(c => c.name === name.value)
    return {
      prev: index > 0 ? components[index - 1] : undefined,
      next: index < components.length - 1 ? components[index + 1] : undefined,
    }
  })

  const prev = toRef(() => {
    const p = siblings.value.prev
    if (!p) return undefined
    return { label: p.name, to: `/${slug.value}/components/${p.name}` }
  })

  const next = toRef(() => {
    const n = siblings.value.next
    if (!n) return undefined
    return { label: n.name, to: `/${slug.value}/components/${n.name}` }
  })
</script>

<template>
  <div v-if="component" class="p-8 max-w-4xl">
    <CxBreadcrumbs class="mb-6" :items="breadcrumbs" />

    <!-- Header -->
    <div class="mb-8">
      <div class="flex flex-wrap items-center gap-3 mb-2">
        <h1 class="text-3xl font-bold font-mono">{{ component.name }}</h1>
        <CxBadge color="primary" variant="subtle">{{ component.category }}</CxBadge>
        <CxLink
          v-if="component.v0"
          class="no-underline"
          :to="component.v0"
        >
          <CxBadge color="secondary" variant="outlined">v0</CxBadge>
        </CxLink>
      </div>
      <p v-if="component.description" class="text-on-surface-variant">{{ component.description }}</p>
    </div>

    <!-- Interactive demo -->
    <ComponentDemo
      v-if="component.props"
      class="mb-8"
      :component
      :ds-slug="slug"
    />

    <!-- Tabs -->
    <CxTabs
      v-if="tabItems.length > 0"
      v-model="activeTab"
      class="mb-6"
      :items="tabItems"
    >
      <!-- API tab -->
      <CxTabPanel value="api">
        <div class="mt-4 overflow-x-auto">
          <table class="w-full text-sm border-collapse">
            <thead>
              <tr class="border-b border-divider text-left">
                <th class="pb-2 pr-6 font-semibold text-on-surface-variant">Name</th>
                <th class="pb-2 pr-6 font-semibold text-on-surface-variant">Type</th>
                <th class="pb-2 pr-6 font-semibold text-on-surface-variant">Default</th>
                <th class="pb-2 font-semibold text-on-surface-variant">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="prop in component.props"
                :key="prop.name"
                class="border-b border-divider last:border-0"
              >
                <td class="py-2 pr-6 font-mono text-xs">{{ prop.name }}</td>
                <td class="py-2 pr-6 font-mono text-xs text-on-surface-variant">{{ prop.type }}</td>
                <td class="py-2 pr-6 font-mono text-xs text-on-surface-variant">{{ prop.default ?? '—' }}</td>
                <td class="py-2 text-on-surface-variant">{{ prop.description ?? '' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CxTabPanel>

      <!-- Sub-components tab -->
      <CxTabPanel value="sub-components">
        <div class="mt-4 flex flex-wrap gap-2">
          <CxBadge
            v-for="sub in component.subComponents"
            :key="sub"
            color="primary"
            variant="outlined"
          >
            {{ sub }}
          </CxBadge>
        </div>
      </CxTabPanel>

      <!-- Examples tab -->
      <CxTabPanel value="examples">
        <div class="mt-4">
          <div
            v-for="example in component.examples"
            :key="example.title"
            class="mb-8"
          >
            <h3 class="text-lg font-semibold mb-1">{{ example.title }}</h3>
            <p v-if="example.description" class="text-on-surface-variant text-sm mb-4">{{ example.description }}</p>
            <component :is="example.component" />
          </div>
        </div>
      </CxTabPanel>
    </CxTabs>

    <CxPageNavigator class="mt-10" :next :prev />
  </div>

  <div v-else class="p-8">
    <p class="text-on-surface-variant">Component not found.</p>
  </div>
</template>
