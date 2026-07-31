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
    'no-config': '(no config)',
  }

  const STATUS_CLASS: Record<Status, string> = {
    'customized': 'text-primary',
    'defaults': 'text-on-surface-variant',
    'no-config': 'text-on-surface-variant italic',
  }

  async function onOpenPlayground () {
    isBusy.value = true
    try {
      const manifest = {
        intent: 'component-library',
        features: [...store.selectedPlugins, ...store.selectedComponents],
        resolved: store.resolved.autoIncluded,
        adapters: {},
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
  <div class="max-w-4xl mx-auto px-6 py-12">
    <Button.Root
      class="text-sm text-on-surface-variant hover:text-on-surface mb-6 inline-flex items-center gap-1"
      @click="onBack"
    >
      <Button.Icon>
        <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiArrowLeft" fill="currentColor" /></svg>
      </Button.Icon>
      Back
    </Button.Root>

    <p class="text-xs text-on-surface-variant uppercase tracking-wide mb-1">
      Review
    </p>

    <h2 class="text-2xl font-bold mb-2">Your framework</h2>

    <p class="text-on-surface-variant mb-8">
      {{ totalPlugins }} {{ totalPlugins === 1 ? 'plugin' : 'plugins' }},
      {{ totalComponents }} {{ totalComponents === 1 ? 'component' : 'components' }},
      {{ totalAuto }} auto-included {{ totalAuto === 1 ? 'dep' : 'deps' }}.
    </p>

    <div class="rounded-lg border border-divider bg-surface p-6 space-y-6">
      <section>
        <h3 class="text-sm font-semibold uppercase tracking-wide mb-3">Plugins</h3>

        <ul v-if="pluginRows.length > 0" class="space-y-2">
          <li
            v-for="row in pluginRows"
            :key="row.meta.id"
            class="flex items-center justify-between gap-3 text-sm"
          >
            <span class="inline-flex items-center gap-2 text-on-surface">
              <svg class="w-4 h-4 text-primary" viewBox="0 0 24 24">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor" />
              </svg>
              {{ row.meta.title }}
            </span>

            <span class="text-xs" :class="STATUS_CLASS[row.status]">
              {{ STATUS_LABEL[row.status] }}
            </span>
          </li>
        </ul>

        <p v-else class="text-sm text-on-surface-variant italic">
          No plugins selected.
        </p>
      </section>

      <section>
        <h3 class="text-sm font-semibold uppercase tracking-wide mb-3">Components</h3>

        <p v-if="componentList.length > 0" class="text-sm text-on-surface leading-relaxed">
          {{ componentList.join(', ') }}
        </p>

        <p v-else class="text-sm text-on-surface-variant italic">
          No components selected.
        </p>
      </section>

      <section v-if="autoIncluded.length > 0">
        <h3 class="text-sm font-semibold uppercase tracking-wide mb-3">Auto-included</h3>

        <p class="text-sm text-on-surface-variant leading-relaxed">
          {{ autoIncluded.join(', ') }}
        </p>
      </section>

      <section v-if="warnings.length > 0">
        <h3 class="text-sm font-semibold uppercase tracking-wide mb-3 text-error">Warnings</h3>

        <ul class="space-y-1">
          <li
            v-for="warning in warnings"
            :key="warning.featureId"
            class="text-xs text-on-surface-variant"
          >
            <strong class="text-error">{{ warning.featureId }}:</strong> {{ warning.message }}
          </li>
        </ul>
      </section>

      <div class="flex flex-wrap items-center gap-3 pt-2">
        <Button.Root
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-on-primary rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="isBusy"
          @click="onOpenPlayground"
        >
          <Button.Icon>
            <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiOpenInNew" fill="currentColor" /></svg>
          </Button.Icon>
          Open in Playground
        </Button.Root>

        <Button.Root
          class="inline-flex items-center gap-2 px-4 py-2.5 border border-divider text-on-surface rounded-lg font-semibold text-sm hover:bg-surface-variant transition-colors"
          @click="onDownloadZip"
        >
          <Button.Icon>
            <svg class="w-4 h-4" viewBox="0 0 24 24"><path :d="mdiDownload" fill="currentColor" /></svg>
          </Button.Icon>
          Download starter (.zip)
        </Button.Root>
      </div>
    </div>

    <div class="mt-6 flex items-center justify-between">
      <Button.Root
        class="text-sm text-on-surface-variant hover:text-error transition-colors"
        @click="onReset"
      >
        Reset all
      </Button.Root>

      <Button.Root
        class="text-sm text-on-surface-variant hover:text-on-surface transition-colors"
        @click="onBack"
      >
        Back
      </Button.Root>
    </div>
  </div>
</template>
