<script setup lang="ts">
  import {
    HxAccordion,
    HxAccordionItem,
    HxAlert,
    HxBadge,
    HxProgressBar,
    HxProgressBarLabel,
  } from '@paper/helix'

  // Composables
  import { useCoverage } from '../../composables/useCoverage'
  import { useShowcase } from '../../composables/useShowcase'

  // Utilities
  import { toRef } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const { getDS } = useShowcase()
  const { get, score } = useCoverage()

  const slug = toRef(() => route.params.ds as string)
  const ds = toRef(() => getDS(slug.value))
  const report = toRef(() => get(slug.value))
  const coverage = toRef(() => score(slug.value))

  const documented = toRef(() => report.value?.documented ?? [])
  const stubs = toRef(() => report.value?.stubs ?? [])
  const missing = toRef(() => report.value?.missing ?? [])
</script>

<template>
  <div v-if="ds" class="p-8 max-w-3xl">
    <div class="mb-8">
      <h1 class="text-3xl font-bold mb-1">{{ ds.name }} — Coverage</h1>
      <p class="text-on-surface-variant">Documentation coverage report for {{ ds.name }}.</p>
    </div>

    <!-- Overall score -->
    <div class="mb-10">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-semibold text-on-surface-variant">Overall Coverage</span>
        <span class="text-lg font-bold">{{ coverage }}%</span>
      </div>
      <HxProgressBar
        :color="coverage >= 80 ? 'success' : coverage >= 50 ? 'warning' : 'error'"
        size="md"
        :value="coverage"
      >
        <HxProgressBarLabel>{{ coverage }}%</HxProgressBarLabel>
      </HxProgressBar>
    </div>

    <!-- Sections -->
    <HxAccordion>
      <!-- Documented -->
      <HxAccordionItem
        :title="`Documented (${documented.length})`"
      >
        <div class="pt-2 pb-4">
          <div v-if="documented.length === 0" class="text-on-surface-variant text-sm">
            No documented exports yet.
          </div>
          <ul v-else class="flex flex-col gap-1">
            <li
              v-for="name in documented"
              :key="name"
              class="flex items-center gap-2 py-1 border-b border-divider last:border-0"
            >
              <HxBadge color="success" variant="subtle">docs</HxBadge>
              <span class="font-mono text-sm">{{ name }}</span>
            </li>
          </ul>
        </div>
      </HxAccordionItem>

      <!-- Stubs -->
      <HxAccordionItem
        :title="`Stubs (${stubs.length})`"
      >
        <div class="pt-2 pb-4">
          <div v-if="stubs.length === 0" class="text-on-surface-variant text-sm">
            No stubs found.
          </div>
          <ul v-else class="flex flex-col gap-1">
            <li
              v-for="name in stubs"
              :key="name"
              class="flex items-center gap-2 py-1 border-b border-divider last:border-0"
            >
              <HxBadge color="warning" variant="subtle">stub</HxBadge>
              <router-link
                class="font-mono text-sm"
                :to="`/${slug}/components/${name}`"
              >
                {{ name }}
              </router-link>
            </li>
          </ul>
        </div>
      </HxAccordionItem>

      <!-- Missing -->
      <HxAccordionItem
        :title="`Missing (${missing.length})`"
      >
        <div class="pt-2 pb-4">
          <template v-if="missing.length > 0">
            <HxAlert class="mb-4 p-3" type="warning">
              These manifest entries were not found in the package exports. They may have been renamed or removed.
            </HxAlert>
            <ul class="flex flex-col gap-1">
              <li
                v-for="name in missing"
                :key="name"
                class="flex items-center gap-2 py-1 border-b border-divider last:border-0"
              >
                <HxBadge color="error" variant="subtle">missing</HxBadge>
                <span class="font-mono text-sm">{{ name }}</span>
              </li>
            </ul>
          </template>
          <div v-else class="text-on-surface-variant text-sm">
            No missing exports.
          </div>
        </div>
      </HxAccordionItem>
    </HxAccordion>
  </div>

  <div v-else class="p-8">
    <p class="text-on-surface-variant">Design system not found.</p>
  </div>
</template>
