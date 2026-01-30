<script setup lang="ts">
  import pageDates from 'virtual:page-dates'

  // Framework
  import { isUndefined, useDate, useLogger } from '@vuetify/v0'

  // Components
  import { Discovery } from '@/components/discovery'

  // Composables
  import { useClipboard } from '@/composables/useClipboard'
  import { providePageMeta } from '@/composables/usePageMeta'

  // Utilities
  import { useScrollToAnchor } from '@/utilities/scroll'
  import { onBeforeUnmount, shallowRef, toRef } from 'vue'
  import { useRoute } from 'vue-router'

  // Data
  import metrics from '@/data/metrics.json'

  const scroll = useScrollToAnchor()
  const logger = useLogger()

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
  const date = useDate()
  const lastUpdated = toRef(() => {
    // Try exact path, then without trailing slash
    const path = route.path.replace(/\/$/, '') || '/'
    const pageDate = pageDates[path]
    if (!pageDate?.updated) return null

    const d = date.adapter.date(pageDate.updated)
    if (!date.adapter.isValid(d)) return null

    return date.adapter.format(d, 'normalDate')
  })

  // Provide page metadata context for child components
  providePageMeta({
    edit,
    github,
    label,
    testFileLink,
    level,
    coverage,
    benchmark,
    renderless,
    lastUpdated,
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
          :text="loading ? 'Copying...' : copyError ? 'Failed to copy' : clipboard.copied.value ? 'Copied' : 'Copy Page as Markdown'"
          title="Copy Page as Markdown"
          @click="onClickCopy"
        />
      </div>
    </Discovery.Activator>

    <hr>

    <!-- Inline metadata -->
    <!-- Order: Classification → Skill Level → Quality → Performance → Reference -->
    <Discovery.Activator class="rounded-lg" :padding="8" step="page-metadata">
      <div
        v-if="!isUndefined(renderless) || level || coverage || benchmark || lastUpdated"
        class="flex items-center flex-wrap text-xs text-on-surface-variant gap-3 md:gap-2"
      >
        <!-- 1. Renderless - Feature classification (what is it?) -->
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

        <!-- 2. Level - Skill level (should I use it?) -->
        <DocsMetaItem
          v-if="level"
          :color="level.color"
          :icon="level.icon"
          :text="level.label"
          :title="`${level.label} skill level`"
        />

        <!-- 3. Coverage - Quality signal (is it tested?) -->
        <DocsMetaItem
          v-if="coverage && testFileLink"
          :color="coverage.color"
          :href="testFileLink"
          icon="test"
          :text="coverage.label"
          :title="`Statements: ${itemMetrics?.coverage?.statements}%${itemMetrics?.coverage?.functions != null ? `, Functions: ${itemMetrics.coverage.functions}%` : ''}, Branches: ${itemMetrics?.coverage?.branches}%`"
        />

        <!-- 4. Benchmark - Performance (is it fast?) -->
        <DocsMetaItem
          v-if="benchmark"
          :color="benchmark.color"
          href="#benchmarks"
          :icon="benchmark.icon"
          :text="benchmark.label"
          title="View performance benchmarks"
          @click.prevent="scroll.scrollToAnchor('benchmarks')"
        />

        <!-- 5. Last Updated - Reference (is it maintained?) -->
        <DocsMetaItem
          v-if="lastUpdated"
          color="text-secondary"
          icon="calendar-clock"
          :text="lastUpdated"
          title="Last updated"
        />
      </div>
    </Discovery.Activator>
  </div>
</template>
