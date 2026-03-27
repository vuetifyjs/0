<script setup lang="ts">
  import {
    CxBadge,
    CxBreadcrumbs,
    CxCallout,
    CxCalloutHeader,
    CxCard,
    CxCodeBlock,
    CxPackageManagerTabs,
  } from '@paper/codex'

  // Composables
  import { useCoverage } from '../composables/useCoverage'
  import { useShowcase } from '../composables/useShowcase'

  // Utilities
  import { toRef } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const { getDS } = useShowcase()
  const { score } = useCoverage()

  const slug = toRef(() => route.params.ds as string)
  const ds = toRef(() => getDS(slug.value))

  const breadcrumbs = toRef(() => [
    { label: 'Home', to: '/' },
    { label: ds.value?.name ?? slug.value },
  ])

  const pluginCode = toRef(() => {
    if (!ds.value) return ''
    const pkg = ds.value.package ?? `@paper/${ds.value.slug}`
    const name = ds.value.name
    return `import { create${name}Plugin } from '${pkg}'

const app = createApp(App)
app.use(create${name}Plugin())`
  })

  const tokenCount = toRef(() => {
    if (!ds.value?.tokens) return 0
    return Object.keys(ds.value.tokens).length
  })

  const composableCount = toRef(() => ds.value?.composables?.length ?? 0)

  const coverage = toRef(() => score(slug.value))

  const hasStubs = toRef(() => {
    const report = useCoverage().get(slug.value)
    return (report?.stubs?.length ?? 0) > 0
  })

  const stubCount = toRef(() => {
    const report = useCoverage().get(slug.value)
    return report?.stubs?.length ?? 0
  })
</script>

<template>
  <div v-if="ds" class="p-8 max-w-3xl">
    <CxBreadcrumbs class="mb-6" :items="breadcrumbs" />

    <div class="mb-8">
      <div class="flex items-center gap-3 mb-2">
        <h1 class="text-3xl font-bold">{{ ds.name }}</h1>
        <CxBadge color="primary" variant="outlined">{{ ds.prefix }}</CxBadge>
      </div>
      <p v-if="ds.description" class="text-on-surface-variant">{{ ds.description }}</p>
    </div>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
      <CxCard class="p-4 flex flex-col gap-1">
        <div class="text-2xl font-bold">{{ ds.components.length }}</div>
        <div class="text-sm text-on-surface-variant">Components</div>
      </CxCard>
      <CxCard class="p-4 flex flex-col gap-1">
        <div class="text-2xl font-bold">{{ composableCount }}</div>
        <div class="text-sm text-on-surface-variant">Composables</div>
      </CxCard>
      <CxCard class="p-4 flex flex-col gap-1">
        <div class="text-2xl font-bold">{{ tokenCount }}</div>
        <div class="text-sm text-on-surface-variant">Token Groups</div>
      </CxCard>
      <CxCard class="p-4 flex flex-col gap-1">
        <div class="text-2xl font-bold">{{ coverage }}%</div>
        <div class="text-sm text-on-surface-variant">Coverage</div>
      </CxCard>
    </div>

    <CxCallout v-if="hasStubs" class="mb-8" type="warning">
      <CxCalloutHeader type="warning" />
      <p class="mt-2">
        {{ stubCount }} component{{ stubCount === 1 ? '' : 's' }} in this design system
        {{ stubCount === 1 ? 'is' : 'are' }} placeholder stubs without full documentation.
      </p>
    </CxCallout>

    <h2 class="text-xl font-semibold mb-4">Installation</h2>

    <template v-if="ds.package">
      <p class="mb-3 text-on-surface-variant">Install the package:</p>
      <CxPackageManagerTabs class="mb-6" :package="ds.package" />
    </template>

    <p class="mb-3 text-on-surface-variant">Register the plugin:</p>
    <CxCodeBlock class="mb-10" :code="pluginCode" language="ts" />

    <h2 class="text-xl font-semibold mb-4">Explore</h2>

    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
      <router-link
        class="no-underline text-on-surface"
        :to="`/${ds.slug}/tokens`"
      >
        <CxCard class="p-4 flex flex-col gap-1" hoverable>
          <div class="font-semibold">Tokens</div>
          <div class="text-sm text-on-surface-variant">{{ tokenCount }} groups</div>
        </CxCard>
      </router-link>

      <router-link
        class="no-underline text-on-surface"
        :to="`/${ds.slug}/components`"
      >
        <CxCard class="p-4 flex flex-col gap-1" hoverable>
          <div class="font-semibold">Components</div>
          <div class="text-sm text-on-surface-variant">{{ ds.components.length }} total</div>
        </CxCard>
      </router-link>

      <router-link
        v-if="composableCount > 0"
        class="no-underline text-on-surface"
        :to="`/${ds.slug}/composables`"
      >
        <CxCard class="p-4 flex flex-col gap-1" hoverable>
          <div class="font-semibold">Composables</div>
          <div class="text-sm text-on-surface-variant">{{ composableCount }} total</div>
        </CxCard>
      </router-link>

      <router-link
        class="no-underline text-on-surface"
        :to="`/${ds.slug}/coverage`"
      >
        <CxCard class="p-4 flex flex-col gap-1" hoverable>
          <div class="font-semibold">Coverage</div>
          <div class="text-sm text-on-surface-variant">{{ coverage }}% documented</div>
        </CxCard>
      </router-link>
    </div>

    <template v-if="ds.sections?.length">
      <component
        :is="section.component"
        v-for="section in ds.sections"
        :key="section.slug"
      />
    </template>
  </div>

  <div v-else class="p-8">
    <p class="text-on-surface-variant">Design system not found.</p>
  </div>
</template>
