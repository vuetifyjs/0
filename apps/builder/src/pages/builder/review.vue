<script setup lang="ts">
  import { mdiArrowLeft, mdiDownload, mdiOpenInNew } from '@mdi/js'

  // Framework
  import { Button } from '@vuetify/v0'

  import { PLUGINS } from '@/data/plugins'
  // Engine
  import { toPlaygroundUrl } from '@/engine/manifest'
  import { downloadZip } from '@/engine/zip'

  // Stores
  import { useBuilderStore } from '@/stores/builder'

  // Utilities
  import { shallowRef, toRef } from 'vue'
  import { useRouter } from 'vue-router'

  // Types
  import type { PluginMeta } from '@/data/plugins'

  type Status = 'customized' | 'defaults' | 'no-config'

  interface PluginRow {
    meta: PluginMeta
    status: Status
  }

  const store = useBuilderStore()
  const router = useRouter()

  const isBusy = shallowRef(false)

  function statusFor (meta: PluginMeta): Status {
    if (!meta.hasConfig) return 'no-config'
    const config = store.pluginConfig[meta.id]
    if (config && typeof config === 'object' && Object.keys(config as object).length > 0) {
      return 'customized'
    }
    return 'defaults'
  }

  const pluginRows = toRef((): PluginRow[] =>
    PLUGINS
      .filter(p => store.selectedPlugins.has(p.id))
      .map(meta => ({ meta, status: statusFor(meta) })),
  )

  const componentList = toRef(() => [...store.selectedComponents])
  const autoIncluded = toRef(() => store.resolved.autoIncluded)
  const warnings = toRef(() => store.resolved.warnings)

  const totalPlugins = toRef(() => store.selectedPlugins.size)
  const totalComponents = toRef(() => store.selectedComponents.size)
  const totalAuto = toRef(() => autoIncluded.value.length)

  const STATUS_LABEL: Record<Status, string> = {
    'customized': 'customized',
    'defaults': 'defaults',
    'no-config': 'no config',
  }

  const STATUS_CLASS: Record<Status, string> = {
    'customized': 'text-primary',
    'defaults': 'text-on-surface-variant',
    'no-config': 'text-on-surface-variant/70',
  }

  async function onOpenPlayground () {
    isBusy.value = true
    try {
      const manifest = {
        intent: 'component-library',
        features: [...store.selectedPlugins, ...store.selectedComponents],
        resolved: store.resolved.autoIncluded,
        adapters: {},
        pluginConfig: store.pluginConfig,
      }
      const url = await toPlaygroundUrl(manifest, 'https://v0play.vuetifyjs.com')
      window.open(url, '_blank', 'noopener')
    } finally {
      isBusy.value = false
    }
  }

  function onDownloadZip () {
    downloadZip({
      selectedPlugins: store.selectedPlugins,
      pluginConfig: store.pluginConfig,
      selectedComponents: store.selectedComponents,
      resolved: store.resolved.autoIncluded,
    })
  }

  function onReset () {
    store.reset()
    router.push('/builder')
  }

  function onBack () {
    router.push('/builder/components')
  }
</script>

<template>
  <div class="max-w-3xl mx-auto px-6 py-10 sm:py-12">
    <Button.Root class="btn-quiet mb-8" @click="onBack">
      <Button.Icon>
        <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiArrowLeft" fill="currentColor" /></svg>
      </Button.Icon>

      <Button.Content>Back</Button.Content>
    </Button.Root>

    <header class="mb-8">
      <p class="t-eyebrow text-primary mb-3">Step 4 · Review</p>

      <h2 class="t-title mb-3">Your framework</h2>

      <p class="t-body text-on-surface-variant">
        Everything below is what the starter will contain. Nothing else ships.
      </p>
    </header>

    <!-- The build sheet: what you configured, itemised, before you take delivery of it. -->
    <div class="panel overflow-hidden">
      <div class="grid grid-cols-3 divide-x divide-divider border-b border-divider bg-surface-variant/50">
        <div class="px-4 py-4 text-center">
          <p class="text-2xl font-bold tabular-nums leading-none">{{ totalPlugins }}</p>
          <p class="t-eyebrow text-on-surface-variant mt-2">{{ totalPlugins === 1 ? 'Plugin' : 'Plugins' }}</p>
        </div>

        <div class="px-4 py-4 text-center">
          <p class="text-2xl font-bold tabular-nums leading-none">{{ totalComponents }}</p>
          <p class="t-eyebrow text-on-surface-variant mt-2">{{ totalComponents === 1 ? 'Component' : 'Components' }}</p>
        </div>

        <div class="px-4 py-4 text-center">
          <p class="text-2xl font-bold tabular-nums leading-none">{{ totalAuto }}</p>
          <p class="t-eyebrow text-on-surface-variant mt-2">Auto-included</p>
        </div>
      </div>

      <section>
        <div class="flex items-center min-h-10 py-2 px-5 border-b border-divider bg-surface-variant/50">
          <h3 class="t-eyebrow text-on-surface">Plugins</h3>
        </div>

        <ul v-if="pluginRows.length > 0" class="divide-y divide-divider">
          <li
            v-for="row in pluginRows"
            :key="row.meta.id"
            class="flex items-center justify-between gap-3 px-5 py-2.5"
          >
            <span class="inline-flex items-baseline gap-2.5 min-w-0">
              <span class="text-sm text-on-surface">{{ row.meta.title }}</span>
              <span class="font-mono text-[0.6875rem] text-on-surface-variant truncate">{{ row.meta.id }}</span>
            </span>

            <span class="t-eyebrow flex-shrink-0" :class="STATUS_CLASS[row.status]">
              {{ STATUS_LABEL[row.status] }}
            </span>
          </li>
        </ul>

        <p v-else class="px-5 py-4 t-meta text-on-surface-variant">
          No plugins selected.
        </p>
      </section>

      <section class="border-t border-divider">
        <div class="flex items-center min-h-10 py-2 px-5 border-b border-divider bg-surface-variant/50">
          <h3 class="t-eyebrow text-on-surface">Components</h3>
        </div>

        <div v-if="componentList.length > 0" class="flex flex-wrap gap-1.5 px-5 py-4">
          <span v-for="id in componentList" :key="id" class="chip-quiet">{{ id }}</span>
        </div>

        <p v-else class="px-5 py-4 t-meta text-on-surface-variant">
          No components selected.
        </p>
      </section>

      <section v-if="autoIncluded.length > 0" class="border-t border-divider">
        <div class="flex flex-wrap items-baseline gap-x-3 min-h-10 py-2 px-5 border-b border-divider bg-surface-variant/50">
          <h3 class="t-eyebrow text-on-surface">Auto-included</h3>
          <p class="t-meta text-on-surface-variant">Pulled in by your selection</p>
        </div>

        <div class="flex flex-wrap gap-1.5 px-5 py-4">
          <span v-for="id in autoIncluded" :key="id" class="chip-quiet">{{ id }}</span>
        </div>
      </section>

      <section v-if="warnings.length > 0" class="border-t border-divider">
        <div class="flex items-center min-h-10 py-2 px-5 border-b border-divider bg-surface-variant/50">
          <h3 class="t-eyebrow text-error">Warnings</h3>
        </div>

        <ul class="divide-y divide-divider">
          <li
            v-for="warning in warnings"
            :key="warning.featureId"
            class="px-5 py-2.5 t-meta text-on-surface-variant"
          >
            <span class="font-mono text-[0.75rem] text-error">{{ warning.featureId }}</span>
            — {{ warning.message }}
          </li>
        </ul>
      </section>
    </div>

    <div class="mt-6 flex flex-wrap items-center gap-3">
      <Button.Root
        class="btn-primary"
        :disabled="isBusy"
        @click="onOpenPlayground"
      >
        <Button.Icon>
          <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiOpenInNew" fill="currentColor" /></svg>
        </Button.Icon>

        <Button.Content>Open in playground</Button.Content>
      </Button.Root>

      <Button.Root class="btn-outline" @click="onDownloadZip">
        <Button.Icon>
          <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiDownload" fill="currentColor" /></svg>
        </Button.Icon>

        <Button.Content>Download starter (.zip)</Button.Content>
      </Button.Root>
    </div>

    <div class="mt-8 flex items-center justify-between border-t border-divider pt-5">
      <Button.Root
        class="btn-quiet hover:text-error"
        @click="onReset"
      >
        Reset all
      </Button.Root>

      <Button.Root class="btn-quiet" @click="onBack">
        Back
      </Button.Root>
    </div>
  </div>
</template>
