<script setup lang="ts">
  // Composables
  import { useClipboard } from '@/composables/useClipboard'

  // Utilities
  import { shallowRef, toRef } from 'vue'
  import { useRoute } from 'vue-router'

  import metrics from '@/data/metrics.json'

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
        renderless?: boolean
        ssrSafe?: boolean
      }
    }
  }>()

  const base = 'https://github.com/vuetifyjs/0'
  const loading = shallowRef(false)
  const copyError = shallowRef(false)
  const { copied, copy } = useClipboard()

  function scrollToAnchor (id: string) {
    const el = document.querySelector(`#${id}`)
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

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
  <div class="my-2 flex flex-col gap-2 mb-8">
    <!-- Action chips -->
    <div class="inline-flex gap-2 flex-wrap">
      <a
        :href="edit"
        rel="noopener noreferrer"
        target="_blank"
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
      >
        <AppChip
          color="text-error"
          icon="bug"
          text="Report a Bug"
        />
      </a>

      <a
        v-if="label"
        :href="label"
        rel="noopener noreferrer"
        target="_blank"
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

    <!-- Metric chips -->
    <div
      v-if="coverage || benchmark || renderless !== undefined || ssrSafe"
      class="inline-flex gap-2 flex-wrap"
    >
      <a
        v-if="coverage"
        :href="testFileLink"
        rel="noopener noreferrer"
        target="_blank"
      >
        <AppChip
          :color="coverage.color"
          icon="test"
          :text="coverage.label"
          :title="`Statements: ${itemMetrics?.coverage?.statements}%${itemMetrics?.coverage?.functions != null ? `, Functions: ${itemMetrics.coverage.functions}%` : ''}, Branches: ${itemMetrics?.coverage?.branches}%`"
        />
      </a>

      <a
        v-if="benchmark"
        href="#benchmarks"
        @click.prevent="scrollToAnchor('benchmarks')"
      >
        <AppChip
          :color="benchmark.color"
          :icon="benchmark.icon"
          :text="benchmark.label"
          :title="benchmark.title"
        />
      </a>

      <AppChip
        v-if="renderless === true"
        color="text-secondary"
        icon="renderless"
        text="Renderless"
        title="Component renders no DOM element by default"
      />

      <AppChip
        v-if="renderless === false"
        color="text-secondary"
        icon="layers"
        text="Renders element"
        title="Component renders a DOM element by default"
      />

      <AppChip
        v-if="ssrSafe"
        color="text-info"
        icon="ssr"
        text="SSR Safe"
        title="Safe for server-side rendering"
      />
    </div>
  </div>
</template>
