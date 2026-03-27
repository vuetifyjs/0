<script setup lang="ts">
  import {
    CxCallout, CxCalloutHeader,
    CxCodeBlock, CxHeaderAnchor,
  } from '@paper/codex'

  // Composables
  import { useShowcase } from '../composables/useShowcase'

  // Utilities
  import { toRef } from 'vue'
  import { useRoute } from 'vue-router'

  const route = useRoute()
  const { getDS } = useShowcase()

  const ds = toRef(() => getDS(route.params.ds as string))

  const installCode = toRef(() => {
    if (!ds.value?.package) return ''
    return `pnpm add ${ds.value.package}`
  })

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
</script>

<template>
  <div v-if="ds" class="p-8 max-w-3xl">
    <h1 class="text-3xl font-bold mb-2">{{ ds.name }}</h1>
    <p v-if="ds.description" class="text-on-surface-variant mb-8">{{ ds.description }}</p>

    <CxHeaderAnchor id="quick-start" tag="h2">
      Quick Start
    </CxHeaderAnchor>

    <template v-if="ds.package">
      <p class="mb-4">Install the package:</p>
      <CxCodeBlock
        class="mb-4"
        :code="installCode"
        language="bash"
      />
    </template>

    <p class="mb-4">Register the plugin:</p>
    <CxCodeBlock
      class="mb-6"
      :code="pluginCode"
      language="ts"
    />

    <CxCallout class="mb-8" type="tip">
      <CxCalloutHeader type="tip" />
      <p class="mt-2">
        All {{ ds.prefix }}-prefixed components are available after plugin registration.
      </p>
    </CxCallout>

    <CxHeaderAnchor id="stats" tag="h2">
      At a Glance
    </CxHeaderAnchor>

    <div class="grid grid-cols-3 gap-4 mb-8">
      <div class="p-4 rounded-md bg-surface-variant">
        <div class="text-2xl font-bold">{{ ds.components.length }}</div>
        <div class="text-sm text-on-surface-variant">Components</div>
      </div>
      <div class="p-4 rounded-md bg-surface-variant">
        <div class="text-2xl font-bold">{{ tokenCount }}</div>
        <div class="text-sm text-on-surface-variant">Token Groups</div>
      </div>
      <div class="p-4 rounded-md bg-surface-variant">
        <div class="text-2xl font-bold font-mono">{{ ds.prefix }}</div>
        <div class="text-sm text-on-surface-variant">Prefix</div>
      </div>
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
