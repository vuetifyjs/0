<script setup lang="ts">
  import pageDates from 'virtual:page-dates'

  // Framework
  import { isUndefined, useDate, useLogger } from '@vuetify/v0'

  // Components
  import { Discovery } from '@/components/discovery'

  // Composables
  import { useClipboard } from '@/composables/useClipboard'
  import { providePageMeta } from '@/composables/usePageMeta'

  // Data
  import maturityData from '#v0/maturity.json'
  // Constants
  import { MATURITY_MATRIX_HREF, SKILL_LEVELS_DOCS_HREF } from '@/constants/links'

  // Utilities
  import { useScrollToAnchor } from '@/utilities/scroll'
  import { onBeforeUnmount, shallowRef, toRef } from 'vue'
  import { useRoute } from 'vue-router'

  // Types
  import type { PhaseConfig } from '@/composables/usePageMeta'

  const scroll = useScrollToAnchor()
  const logger = useLogger()

  const metricsData = shallowRef<Record<string, MetricEntry> | null>(null)

  let metricsPromise: Promise<Record<string, MetricEntry>> | null = null
  function loadMetrics () {
    if (!metricsPromise) {
      metricsPromise = import('@/data/metrics.json').then(m => m.default as Record<string, MetricEntry>)
    }
    return metricsPromise
  }

  loadMetrics().then(m => {
    metricsData.value = m
  }).catch(() => {})

  interface MetricCoverage {
    overall: number
    statements: number
    functions?: number
    branches: number
  }

  interface MetricBenchmark {
    tier: 'blazing' | 'fast' | 'good' | 'slow'
  }

  interface MetricEntry {
    coverage?: MetricCoverage
    benchmarks?: {
      _fastest?: MetricBenchmark
    }
  }

  const props = defineProps<{
    frontmatter?: {
      meta: {
        description: string
        keywords: string
        title: string
      }
      features: {
        github: string
        label: string
        level?: 1 | 2 | 3
        renderless?: boolean
      }
    }
  }>()

  const base = 'https://github.com/vuetifyjs/0'
  const loading = shallowRef(false)
  const copyError = shallowRef(false)
  const clipboard = useClipboard()

  let errorTimeout: ReturnType<typeof setTimeout>

  onBeforeUnmount(() => {
    clearTimeout(errorTimeout)
  })

  const route = useRoute()

  const link = toRef(() => route.path.split('/').slice(1).filter(Boolean).join('/'))
  const edit = toRef(() => `${base}/edit/master/apps/docs/src/pages/${link.value}.md`)

  const github = toRef(() => {
    const github = props.frontmatter?.features?.github

    if (!github) return false

    return `${base}/tree/master/packages/0/src${github}`
  })

  const label = toRef(() => {
    const label = props.frontmatter?.features?.label

    if (!label) return false

    const original = encodeURIComponent(label)

    return `${base}/labels/${original}`
  })

  const reportBugLink = toRef(() => {
    const label = props.frontmatter?.features?.label
    const baseUrl = 'https://issues.vuetifyjs.com/?repo=vuetify0&type=bug'

    if (!label) return baseUrl

    return `${baseUrl}&label=${encodeURIComponent(label)}`
  })

  // Extract name from github path (e.g., /composables/createRegistry/ -> createRegistry)
  const itemName = toRef(() => {
    const github = props.frontmatter?.features?.github
    if (!github) return null

    // Match composables: /composables/createRegistry/
    const composableMatch = github.match(/\/composables\/([^/]+)\/?$/)
    if (composableMatch) return composableMatch[1]

    // Match components: /components/Atom/
    const componentMatch = github.match(/\/components\/([^/]+)\/?$/)
    if (componentMatch) return componentMatch[1]

    return null
  })

  const itemType = toRef(() => {
    const github = props.frontmatter?.features?.github
    if (!github) return null

    if (github.startsWith('/composables/')) return 'composables' as const
    if (github.startsWith('/components/')) return 'components' as const

    return null
  })

  // Get metrics for this item
  const itemMetrics = toRef(() => {
    const name = itemName.value
    if (!name || !metricsData.value) return null
    return metricsData.value[name] ?? null
  })

  // Coverage data
  const coverage = toRef(() => {
    const m = itemMetrics.value
    if (!m?.coverage) return null

    const overall = m.coverage.overall
    return {
      value: overall,
      label: `${overall}% coverage`,
      color: overall >= 80 ? 'text-success' : (overall >= 60 ? 'text-warning' : 'text-error'),
    }
  })

  // Tier display config (temperature metaphor: blazing hot → warm → cool)
  const tierConfig = {
    blazing: { icon: 'benchmark-blazing', color: 'text-error', label: 'Blazing Fast' },
    fast: { icon: 'benchmark-fast', color: 'text-warning', label: 'Fast' },
    good: { icon: 'benchmark-good', color: 'text-info', label: 'Good' },
    slow: { icon: 'benchmark-slow', color: 'text-on-surface-variant', label: 'Slow' },
  } as const

  // Benchmark data (fastest operation)
  const benchmark = toRef(() => {
    const m = itemMetrics.value
    if (!m?.benchmarks?._fastest) return null

    const fastest = m.benchmarks._fastest
    const tier = fastest.tier as keyof typeof tierConfig | null
    const config = tier ? tierConfig[tier] : null

    return {
      label: config?.label ?? 'Benchmarked',
      title: 'This feature includes performance benchmarking',
      icon: config?.icon ?? 'benchmark',
      color: config?.color ?? 'text-accent',
    }
  })

  // GitHub links for test/bench files
  const testFileLink = toRef(() => {
    const github = props.frontmatter?.features?.github
    if (!github || !itemMetrics.value?.coverage) return null
    return `${base}/blob/master/packages/0/src${github}index.test.ts`
  })

  // Static badges from frontmatter
  // renderless: true = "Renderless", false = "Renders element", undefined = no chip
  const renderless = toRef(() => props.frontmatter?.features?.renderless)

  // Level display config
  const levelConfig = {
    1: { icon: 'level-beginner', color: 'text-success', label: 'Beginner' },
    2: { icon: 'level-intermediate', color: 'text-info', label: 'Intermediate' },
    3: { icon: 'level-advanced', color: 'text-warning', label: 'Advanced' },
  } as const

  const level = toRef(() => {
    const l = props.frontmatter?.features?.level
    if (!l || !(l in levelConfig)) return null
    return levelConfig[l]
  })

  // Phase display config (from maturity.json)
  const phaseConfig = {
    draft: { icon: 'pencil', color: 'text-on-surface-variant', label: 'Draft' },
    preview: { icon: 'flask', color: 'text-warning', label: 'Preview' },
    stable: { icon: 'check-circle', color: 'text-info', label: 'Stable' },
    mature: { icon: 'shield-check', color: 'text-success', label: 'Mature' },
    deprecated: { icon: 'archive', color: 'text-error', label: 'Deprecated' },
  } as const

  interface MaturityEntry {
    level: keyof typeof phaseConfig
    since: string | null
    category?: string
    notes?: string
  }

  const phase = toRef((): PhaseConfig | null => {
    const type = itemType.value
    const name = itemName.value
    if (!type || !name) return null

    const bucket = (maturityData as Record<string, Record<string, MaturityEntry>>)[type]
    const entry = bucket?.[name]
    if (!entry) return null

    const config = phaseConfig[entry.level]
    if (!config) return null

    let title: string
    switch (entry.level) {
      case 'draft': {
        title = 'Planned — not yet implemented'
        break
      }
      case 'preview': {
        title = entry.since
          ? `Implemented — API may change. Since ${entry.since}`
          : 'Implemented — API may change. Not yet released'
        break
      }
      case 'stable': {
        title = entry.since ? `Production-ready. Stable since ${entry.since}` : 'Production-ready'
        break
      }
      case 'mature': {
        title = entry.since ? `API frozen. Mature since ${entry.since}` : 'API frozen'
        break
      }
      case 'deprecated': {
        title = entry.notes ?? 'Scheduled for removal'
        break
      }
    }

    return {
      level: entry.level,
      since: entry.since,
      notes: entry.notes,
      icon: config.icon,
      color: config.color,
      label: config.label,
      title,
    }
  })

  // Deep-link the stability chip into the roadmap's maturity matrix, carrying
  // the feature's category + name so the matrix auto-expands that group and
  // highlights this feature's row instead of stranding the reader.
  const maturityHref = toRef(() => {
    const type = itemType.value
    const name = itemName.value
    if (!type || !name) return MATURITY_MATRIX_HREF

    const bucket = (maturityData as Record<string, Record<string, MaturityEntry>>)[type]
    const category = bucket?.[name]?.category
    if (!category) return MATURITY_MATRIX_HREF

    return `/roadmap?category=${encodeURIComponent(category)}&feature=${encodeURIComponent(name)}#maturity-matrix`
  })

  // Last updated date from git history
  const date = useDate()
  const pageDate = toRef(() => {
    const path = route.path.replace(/\/$/, '') || '/'
    return pageDates[path] ?? null
  })
  const lastUpdated = toRef(() => {
    const updated = pageDate.value?.updated
    if (!updated) return null

    const d = date.adapter.date(updated)
    if (!date.adapter.isValid(d)) return null

    return date.adapter.format(d, 'normalDate')
  })
  const lastCommit = toRef(() => {
    const hash = pageDate.value?.hash
    return hash ? { hash, url: `${base}/commit/${hash}` } : null
  })

  // Provide page metadata context for child components
  providePageMeta({
    edit,
    github,
    label,
    testFileLink,
    phase,
    level,
    coverage,
    benchmark,
    renderless,
    lastUpdated,
    lastCommit,
  })

  async function onClickCopy () {
    if (loading.value) return

    function replace (element: string, value: string) {
      const regexp = new RegExp(`<${element}[\\s\\S]*?>([\\s\\S]*?\\/>\n\n)?`, 'g')

      return value.replace(regexp, '')
    }

    try {
      loading.value = true
      copyError.value = false

      const { request } = await import('@/plugins/octokit').then(m => m.default || m)
      const { data: { content } } = await request('GET /repos/vuetifyjs/0/contents/apps/docs/src/pages/{link}.md', {
        link: link.value,
      })

      let raw = atob(content)
      raw = replace('DocsPageFeatures', raw)

      await clipboard.copy(raw)
    } catch (error) {
      logger.error('Failed to copy page', error)
      copyError.value = true
      errorTimeout = setTimeout(() => {
        copyError.value = false
      }, 3000)
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <div class="mt-4 mb-8 flex flex-col gap-4">
    <Discovery.Activator class="rounded-lg" :padding="8" step="breadcrumbs">
      <AppBreadcrumbs />
    </Discovery.Activator>

    <!-- Action chips -->
    <Discovery.Activator class="rounded-lg" :padding="8" step="page-actions">
      <div class="inline-flex gap-2 flex-wrap">
        <DocsActionChip
          color="text-info"
          :href="edit"
          icon="pencil"
          text="Edit this page"
          title="Edit documentation page"
        />

        <DocsActionChip
          color="text-error"
          :href="reportBugLink"
          icon="vuetify-issues"
          text="Report a Bug"
          title="Open Vuetify Issues"
        />

        <DocsActionChip
          v-if="label"
          color="text-warning"
          :href="label"
          icon="alert"
          text="Open issues"
          title="View Issues on GitHub"
        />

        <DocsActionChip
          v-if="github"
          :href="github"
          icon="github"
          text="View on GitHub"
          title="View source code on GitHub"
        />

        <DocsActionChip
          :color="copyError ? 'text-error' : clipboard.copied.value ? 'text-success' : 'text-on-surface'"
          :icon="loading ? 'loading' : copyError ? 'alert' : clipboard.copied.value ? 'success' : 'markdown'"
          :text="loading ? 'Copying...' : copyError ? 'Failed to copy' : clipboard.copied.value ? 'Copied' : 'Copy Markdown'"
          title="Copy Markdown"
          @click="onClickCopy"
        />
      </div>
    </Discovery.Activator>

    <hr>

    <!-- Inline metadata -->
    <!-- Order: Stability → Classification → Skill Level → Quality → Performance → Reference -->
    <Discovery.Activator class="rounded-lg" :padding="8" step="page-metadata">
      <div
        v-if="phase || !isUndefined(renderless) || level || coverage || benchmark || lastUpdated"
        class="flex items-center flex-wrap text-xs text-on-surface-variant gap-3 md:gap-2"
      >
        <!-- 1. Phase - Stability (can I depend on it?) -->
        <DocsMetaItem
          v-if="phase"
          :color="phase.color"
          :href="maturityHref"
          :icon="phase.icon"
          :text="phase.label"
          :title="phase.title"
        />

        <!-- 2. Renderless - Feature classification (what is it?) -->
        <DocsMetaItem
          v-if="renderless === true"
          color="text-secondary"
          icon="renderless"
          text="Renderless"
          title="Component renders no DOM element by default"
        />

        <DocsMetaItem
          v-if="renderless === false"
          color="text-secondary"
          icon="layers"
          text="Renders element"
          title="Component renders a DOM element by default"
        />

        <!-- 3. Level - Skill level (should I use it?) -->
        <DocsMetaItem
          v-if="level"
          :color="level.color"
          :href="SKILL_LEVELS_DOCS_HREF"
          :icon="level.icon"
          :text="level.label"
          :title="`${level.label} skill level — filter by level`"
        />

        <!-- 4. Coverage - Quality signal (is it tested?) -->
        <DocsMetaItem
          v-if="coverage && testFileLink"
          :color="coverage.color"
          :href="testFileLink"
          icon="test"
          :text="coverage.label"
          :title="`Statements: ${itemMetrics?.coverage?.statements}%${itemMetrics?.coverage?.functions != null ? `, Functions: ${itemMetrics.coverage.functions}%` : ''}, Branches: ${itemMetrics?.coverage?.branches}%`"
        />

        <!-- 5. Benchmark - Performance (is it fast?) -->
        <DocsMetaItem
          v-if="benchmark"
          :color="benchmark.color"
          href="#benchmarks"
          :icon="benchmark.icon"
          :text="benchmark.label"
          title="View performance benchmarks"
          @click.prevent="scroll.scrollToAnchor('benchmarks')"
        />

        <!-- 6. Last Updated - Reference (is it maintained?) -->
        <DocsMetaItem
          v-if="lastUpdated"
          color="text-secondary"
          :href="lastCommit?.url"
          icon="calendar-clock"
          :text="lastUpdated"
          :title="lastCommit ? `Last updated in: ${lastCommit.hash}` : 'Last updated'"
        />
      </div>
    </Discovery.Activator>
  </div>
</template>
