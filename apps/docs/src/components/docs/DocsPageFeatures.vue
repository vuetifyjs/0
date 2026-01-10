<script setup lang="ts">
  import pageDates from 'virtual:page-dates'

  // Framework
  import { isUndefined, useDate } from '@vuetify/v0'

  // Composables
  import { useClipboard } from '@/composables/useClipboard'

  // Utilities
  import { useScrollToAnchor } from '@/utilities/scroll'
  import { shallowRef, toRef } from 'vue'
  import { useRoute } from 'vue-router'

  // Data
  import metrics from '@/data/metrics.json'

  const { scrollToAnchor } = useScrollToAnchor()

  interface MetricCoverage {
    overall: number
    statements: number
    functions?: number
    branches: number
  }

  interface MetricBenchmark {
    tier: 'blazing' | 'fast' | 'good'
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
        ssrSafe?: boolean
      }
    }
  }>()

  const base = 'https://github.com/vuetifyjs/0'
  const loading = shallowRef(false)
  const copyError = shallowRef(false)
  const { copied, copy } = useClipboard()

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

  // Extract name from github path (e.g., /composables/useRegistry/ -> useRegistry)
  const itemName = toRef(() => {
    const github = props.frontmatter?.features?.github
    if (!github) return null

    // Match composables: /composables/useRegistry/
    const composableMatch = github.match(/\/composables\/([^/]+)\/?$/)
    if (composableMatch) return composableMatch[1]

    // Match components: /components/Atom/
    const componentMatch = github.match(/\/components\/([^/]+)\/?$/)
    if (componentMatch) return componentMatch[1]

    return null
  })

  // Get metrics for this item
  const itemMetrics = toRef(() => {
    const name = itemName.value
    if (!name) return null
    return (metrics as Record<string, MetricEntry>)[name] ?? null
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
  const ssrSafe = toRef(() => props.frontmatter?.features?.ssrSafe ?? false)

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

  // Last updated date from git history
  const { adapter } = useDate()
  const lastUpdated = toRef(() => {
    // Try exact path, then without trailing slash
    const path = route.path.replace(/\/$/, '') || '/'
    const pageDate = pageDates[path]
    if (!pageDate?.updated) return null

    const date = adapter.date(pageDate.updated)
    if (!adapter.isValid(date)) return null

    return adapter.format(date, 'normalDate')
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

      await copy(raw)
    } catch (error) {
      console.error('Failed to copy page:', error)
      copyError.value = true
      setTimeout(() => {
        copyError.value = false
      }, 3000)
    } finally {
      loading.value = false
    }
  }
</script>

<template>
  <div class="mt-4 mb-8 flex flex-col gap-4">
    <!-- Action chips -->
    <div class="inline-flex gap-2 flex-wrap">
      <a
        :href="edit"
        rel="noopener noreferrer"
        target="_blank"
        title="Edit documentation page"
      >
        <AppChip
          color="text-info"
          icon="pencil"
          text="Edit this page"
        />
      </a>

      <a
        href="https://issues.vuetifyjs.com/?repo=vuetify0&type=bug"
        rel="noopener noreferrer"
        target="_blank"
        title="Open Vuetify Issues"
      >
        <AppChip
          color="text-error"
          icon="vuetify-issues"
          text="Report a Bug"
        />
      </a>

      <a
        v-if="label"
        :href="label"
        rel="noopener noreferrer"
        target="_blank"
        title="View Issues on GitHub"
      >
        <AppChip
          color="text-warning"
          icon="alert"
          text="Open issues"
        />
      </a>

      <a
        v-if="github"
        :href="github"
        rel="noopener noreferrer"
        target="_blank"
        title="View source code on GitHub"
      >
        <AppChip
          icon="github"
          text="View on GitHub"
        />
      </a>

      <AppChip
        :color="copyError ? 'text-error' : copied ? 'text-success' : 'text-on-surface'"
        :icon="loading ? 'loading' : copyError ? 'alert' : copied ? 'success' : 'markdown'"
        :text="loading ? 'Copying...' : copyError ? 'Failed to copy' : copied ? 'Copied' : 'Copy Page as Markdown'"
        title="Copy Page as Markdown"
        @click="onClickCopy"
      />
    </div>

    <!-- Inline metadata -->
    <div
      v-if="level || coverage || benchmark || !isUndefined(renderless) || ssrSafe || lastUpdated"
      class="flex items-center flex-wrap text-xs text-on-surface-variant pt-3 border-t border-divider"
    >
      <a
        v-if="coverage && testFileLink"
        class="inline-flex items-center gap-1 hover:text-on-surface transition-colors"
        :href="testFileLink"
        rel="noopener noreferrer"
        target="_blank"
        :title="`Statements: ${itemMetrics?.coverage?.statements}%${itemMetrics?.coverage?.functions != null ? `, Functions: ${itemMetrics.coverage.functions}%` : ''}, Branches: ${itemMetrics?.coverage?.branches}%`"
      >
        <AppIcon :class="coverage.color" icon="test" size="1em" />
        <span>{{ coverage.label }}</span>
      </a>

      <span v-if="coverage && testFileLink && (level || benchmark || !isUndefined(renderless) || ssrSafe)" class="mx-2 opacity-40">·</span>

      <a
        v-if="benchmark"
        class="inline-flex items-center gap-1 hover:text-on-surface transition-colors"
        href="#benchmarks"
        title="View performance benchmarks"
        @click.prevent="scrollToAnchor('benchmarks')"
      >
        <AppIcon :class="benchmark.color" :icon="benchmark.icon" size="1em" />
        <span>{{ benchmark.label }}</span>
      </a>

      <span v-if="benchmark && (level || !isUndefined(renderless) || ssrSafe)" class="mx-2 opacity-40">·</span>

      <span
        v-if="renderless === true"
        class="inline-flex items-center gap-1"
        title="Component renders no DOM element by default"
      >
        <AppIcon class="text-secondary" icon="renderless" size="1em" />
        <span>Renderless</span>
      </span>

      <span
        v-if="renderless === false"
        class="inline-flex items-center gap-1"
        title="Component renders a DOM element by default"
      >
        <AppIcon class="text-secondary" icon="layers" size="1em" />
        <span>Renders element</span>
      </span>

      <span v-if="!isUndefined(renderless) && (level || ssrSafe)" class="mx-2 opacity-40">·</span>

      <span
        v-if="level"
        class="inline-flex items-center gap-1"
        :title="`${level.label} skill level`"
      >
        <AppIcon :class="level.color" :icon="level.icon" size="1em" />
        <span>{{ level.label }}</span>
      </span>

      <span v-if="level && ssrSafe" class="mx-2 opacity-40">·</span>

      <span
        v-if="ssrSafe"
        class="inline-flex items-center gap-1"
        title="Safe for server-side rendering"
      >
        <AppIcon class="text-info" icon="ssr" size="1em" />
        <span>SSR Safe</span>
      </span>

      <span v-if="lastUpdated && (level || coverage || benchmark || !isUndefined(renderless) || ssrSafe)" class="mx-2 opacity-40">·</span>

      <span
        v-if="lastUpdated"
        class="inline-flex items-center gap-1"
        title="Last updated"
      >
        <AppIcon class="text-secondary" icon="calendar-clock" size="1em" />
        <span>{{ lastUpdated }}</span>
      </span>
    </div>
  </div>
</template>
