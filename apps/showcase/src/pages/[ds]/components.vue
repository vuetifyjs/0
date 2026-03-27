<script setup lang="ts">
  import { CxBadge, CxCard, CxSearchInput } from '@paper/codex'

  // Composables
  import { useCoverage } from '../../composables/useCoverage'
  import { useShowcase } from '../../composables/useShowcase'

  // Utilities
  import { shallowRef, toRef } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const { getDS, getCategories } = useShowcase()
  const { get: getCoverage } = useCoverage()

  const slug = toRef(() => route.params.ds as string)
  const ds = toRef(() => getDS(slug.value))

  const query = shallowRef('')

  const filtered = toRef(() => {
    const q = query.value.trim().toLowerCase()
    if (!q) return ds.value?.components ?? []
    return ds.value?.components.filter(c => c.name.toLowerCase().includes(q)) ?? []
  })

  const categories = toRef(() => [...new Set(filtered.value.map(c => c.category))])

  function byCategory (category: string) {
    return filtered.value.filter(c => c.category === category)
  }

  function coverageStatus (name: string): 'documented' | 'stub' | 'missing' | null {
    const report = getCoverage(slug.value)
    if (!report) return null
    if (report.documented.includes(name)) return 'documented'
    if (report.stubs.includes(name)) return 'stub'
    if (report.missing.includes(name)) return 'missing'
    return null
  }
</script>

<template>
  <div v-if="ds" class="p-8 max-w-5xl">
    <div class="mb-6">
      <h1 class="text-3xl font-bold mb-1">{{ ds.name }} — Components</h1>
      <p class="text-on-surface-variant">
        {{ ds.components.length }} components across {{ getCategories(slug).length }} categories
      </p>
    </div>

    <CxSearchInput
      v-model:query="query"
      class="mb-8 max-w-sm"
      placeholder="Filter components..."
    />

    <p v-if="filtered.length === 0" class="text-on-surface-variant">
      No components match "{{ query }}".
    </p>

    <template v-for="category in categories" :key="category">
      <h2 class="text-lg font-semibold mb-3 mt-6 first:mt-0">{{ category }}</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
        <router-link
          v-for="component in byCategory(category)"
          :key="component.name"
          class="no-underline text-on-surface"
          :to="`/${slug}/components/${component.name}`"
        >
          <CxCard class="p-4 h-full" hoverable>
            <div class="flex items-start justify-between gap-2 mb-1">
              <span class="font-semibold font-mono text-sm">{{ component.name }}</span>
              <div class="flex items-center gap-1 shrink-0">
                <CxBadge v-if="component.subComponents?.length" color="primary" variant="subtle">
                  +{{ component.subComponents.length }}
                </CxBadge>
                <CxBadge
                  v-if="coverageStatus(component.name) === 'stub'"
                  color="warning"
                  variant="subtle"
                >
                  stub
                </CxBadge>
                <CxBadge
                  v-else-if="coverageStatus(component.name) === 'missing'"
                  color="error"
                  variant="subtle"
                >
                  missing
                </CxBadge>
                <CxBadge
                  v-else-if="coverageStatus(component.name) === 'documented'"
                  color="success"
                  variant="subtle"
                >
                  docs
                </CxBadge>
              </div>
            </div>
            <p v-if="component.description" class="text-on-surface-variant text-xs">
              {{ component.description }}
            </p>
          </CxCard>
        </router-link>
      </div>
    </template>
  </div>

  <div v-else class="p-8">
    <p class="text-on-surface-variant">Design system not found.</p>
  </div>
</template>
