<script setup lang="ts">
  import { InferSeoMetaPlugin } from '@unhead/addons'
  import { injectHead, useHead } from '@unhead/vue'

  // Framework
  import { IN_BROWSER, Scrim, useBreakpoints, useStack } from '@vuetify/v0'

  // Components
  import AppMeshBg from '@/components/app/AppMeshBg.vue'

  // Composables
  import { useAsk } from '@/composables/useAsk'
  import { useBreadcrumbItems } from '@/composables/useBreadcrumbItems'
  import { createLevelFilter } from '@/composables/useLevelFilter'
  import { createNavConfig } from '@/composables/useNavConfig'
  import { useScrollLock } from '@/composables/useScrollLock'
  import { useScrollPersist } from '@/composables/useScrollPersist'
  import { useSearch } from '@/composables/useSearch'
  import { useSettings } from '@/composables/useSettings'

  // Stores
  import { useAppStore } from '@/stores/app'

  // Utilities
  import { defineAsyncComponent, toRef, watch } from 'vue'
  import { useRoute } from 'vue-router'

  const AppSettingsSheet = defineAsyncComponent(() => import('@/components/app/AppSettingsSheet.vue'))
  const DocsSearch = defineAsyncComponent(() => import('@/components/docs/DocsSearch.vue'))

  useScrollPersist()
  const settings = useSettings()
  const route = useRoute()

  watch(() => route.fullPath, (to, from) => {
    if (!IN_BROWSER) return
    if (to.includes('#') || history.state?.scroll) return
    if (to === from) return
    window.scrollTo({ top: 0, behavior: settings.prefersReducedMotion.value ? 'auto' : 'smooth' })
  })

  // Provider plumbing — lifted from layouts
  const app = useAppStore()
  const levelFilter = createLevelFilter(() => app.nav)
  levelFilter.provide()

  const navConfig = createNavConfig(levelFilter.filteredNav)
  navConfig.provide()

  // Modals & global state
  const ask = useAsk()
  const search = useSearch()
  const stack = useStack()
  const breakpoints = useBreakpoints()

  // Unified body scroll lock — replaces the three per-layout impls
  useScrollLock(() => stack.isActive.value)

  const slideTransition = toRef(() => settings.prefersReducedMotion.value ? undefined : 'slide')

  const isModalOpen = toRef(() => {
    if (search.isOpen.value) return true
    if (settings.isOpen.value) return true
    if (ask.isOpen.value && !breakpoints.lgAndUp.value) return true
    return false
  })

  // Head / SEO scaffolding (unchanged)
  const head = injectHead()
  head.use(InferSeoMetaPlugin())

  const url = toRef(() => `https://0.vuetifyjs.com${route.path}`)
  const breadcrumbs = useBreadcrumbItems()

  const breadcrumbScript = toRef(() => {
    if (route.path === '/') return []

    const items = breadcrumbs.value
    if (items.length <= 1) return []

    return [{
      key: 'breadcrumb-schema',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': items.map((item, index) => {
          const isLast = index === items.length - 1
          const name = index === 0 ? 'Vuetify0' : item.text
          const entry: Record<string, unknown> = {
            '@type': 'ListItem',
            'position': index + 1,
            name,
          }
          if (!isLast && item.to) entry.item = `https://0.vuetifyjs.com${item.to}`
          return entry
        }),
      }),
    }]
  })

  useHead({
    title: 'Vuetify0',
    titleTemplate: '%s — Vuetify0',
    link: [
      { rel: 'preconnect', href: 'https://api.github.com' },
      { rel: 'preconnect', href: 'https://cdn.vuetifyjs.com' },
      { rel: 'dns-prefetch', href: 'https://api.npmjs.org' },
      { key: 'canonical', rel: 'canonical', href: url },
    ],
    meta: [
      { key: 'description', name: 'description', content: 'Headless components and composables for building modern applications and design systems' },
      { key: 'og:type', property: 'og:type', content: 'website' },
      { key: 'og:site_name', property: 'og:site_name', content: 'Vuetify0' },
      { key: 'og:locale', property: 'og:locale', content: 'en_US' },
      { key: 'og:url', property: 'og:url', content: url },
      { key: 'og:image', property: 'og:image', content: 'https://cdn.vuetifyjs.com/docs/images/one/logos/vzero-logo-og.png' },
      { key: 'twitter:card', name: 'twitter:card', content: 'summary_large_image' },
      { key: 'twitter:site', name: 'twitter:site', content: '@VuetifyJS' },
    ],
    script: toRef(() => [
      {
        key: 'website-schema',
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'name': 'Vuetify0',
          'url': 'https://0.vuetifyjs.com',
          'description': 'Headless components and composables for building modern applications and design systems',
          'publisher': {
            '@type': 'Organization',
            'name': 'Vuetify',
            'url': 'https://vuetifyjs.com',
            'logo': 'https://cdn.vuetifyjs.com/docs/images/one/logos/vzero-logo-og.png',
          },
        }),
      },
      ...breadcrumbScript.value,
    ]),
  })
</script>

<template>
  <AppMeshBg />

  <div
    class="app-shell min-h-screen text-on-background"
    :class="{ 'dot-grid': settings.showDotGrid.value }"
  >
    <a
      class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-on-primary focus:rounded"
      href="#main-content"
    >
      Skip to main content
    </a>

    <div class="app-shell-content pt-[calc(48px+var(--app-banner-h,24px))]">
      <AppBanner />
      <AppBar />

      <div :inert="isModalOpen || undefined">
        <router-view />
      </div>

      <Scrim class="fixed inset-0 bg-black/30 transition-opacity" :teleport="false" />
    </div>

    <DocsSearch />

    <Transition :name="slideTransition">
      <AppSettingsSheet v-if="settings.isOpen.value" />
    </Transition>

    <DocsApiHover />
    <DocsHighlight />
  </div>
</template>

<style>
  /* Scrollbar styling */
  ::-webkit-scrollbar-track {
    background: var(--v0-background);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--v0-scrollbar-thumb);
  }

  ::-webkit-scrollbar-thumb:hover {
    background: color-mix(in srgb, var(--v0-primary) 50%, var(--v0-scrollbar-thumb));
  }

  /* Firefox */
  * {
    scrollbar-color: var(--v0-scrollbar-thumb) var(--v0-background);
  }

  #app > .app-shell {
    position: relative;
    background: color-mix(in srgb, var(--v0-background) 85%, transparent);

    &.dot-grid::before {
      --dot-opacity: 24%;
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100vh;
      z-index: 0;
      pointer-events: none;
      background:
        radial-gradient(circle, color-mix(in srgb, var(--v0-on-background) var(--dot-opacity), transparent) 1px, transparent 1px);
      background-size: 24px 24px;
      background-position: 18px 0;
      mask-image: linear-gradient(
        225deg,
        black 0%,
        black 15%,
        transparent 35%
      );
      -webkit-mask-image: linear-gradient(
        225deg,
        black 0%,
        black 15%,
        transparent 35%
      );
    }

    [data-theme]:not([data-theme="light"]):not([data-theme="odyssey"]):not([data-theme="tailwind-light"]):not([data-theme="material-3-light"]):not([data-theme="ant-design-light"]):not([data-theme="radix-light"]) &.dot-grid::before {
      --dot-opacity: 10%;
    }

    &.dot-grid > .app-shell-content {
      position: relative;
      z-index: 1;
    }

    hr {
      border: none;
      border-top: 1px solid var(--v0-divider);
    }
  }

  .border {
    border-color: var(--v0-divider);
  }

  .markdown-body {
    .v0-link {
      color: var(--v0-primary);
      transition: color 0.2s;

      &:hover {
        text-decoration: underline;
      }
    }

    h1, h2, h3, h4, h5, h6 {
      position: relative;
      scroll-margin-top: 5rem;

      > .header-anchor {
        color: inherit;
        text-decoration: none;
        display: inline-flex;
        align-items: center;
        align-self: center;

        &::before,
        &::after {
          content: '#';
          color: var(--v0-primary);
          transition: opacity 0.2s;
        }

        &::before {
          position: absolute;
          left: -.75em;
          opacity: 0;
        }

        &::after {
          margin-left: 0.25em;
          opacity: 0;
        }

        @media (min-width: 768px) {
          &::after {
            display: none;
          }
        }

        @media (max-width: 767px) {
          &::before {
            display: none;
          }
        }
      }

      &:hover > .header-anchor::before,
      &:hover > .header-anchor::after,
      &:target > .header-anchor::after {
        opacity: 1;
      }
    }

    > h1 {
      font-size: 2.25rem;
      line-height: 2.5rem;
      margin-bottom: 1rem;
    }

    > h2 {
      font-size: 1.875rem;
      line-height: 2.25rem;
      margin-top: 2rem;
      margin-bottom: 0.75rem;
    }

    > h3 {
      font-size: 1.5rem;
      line-height: 2rem;
      margin-top: 1.5rem;
      margin-bottom: 0.5rem;
    }

    > :is(h1,h2,h3) + :is(h2,h3) {
      margin-top: 0;
    }

    blockquote {
      margin: 1rem 0;
      padding: 0.5rem 1rem;
      background-color: var(--v0-surface);
      border-left: 4px solid var(--v0-divider);
    }

    code {
      font-family: 'Courier New', Courier, monospace;
    }

    p {
      margin-bottom: .5rem;
    }

    > ul, > ol {
      list-style-type: disc;
      padding-left: 1.5rem;
    }

    > ul:not(:last-child),
    > ol:not(:last-child) {
      margin-bottom: 1rem;
    }

    > ul > li:not(:last-child),
    > ol > li:not(:last-child) {
      margin-bottom: 0.5rem;
    }

    .shiki {
      overflow: hidden;
    }

    .shiki code {
      display: block;
      overflow-x: auto;
      padding: 0.5rem 1rem;
    }

    table {
      width: 100%;
      background-color: var(--v0-surface);
      border-collapse: separate;
      border-spacing: 0;
      border-radius: 0.5rem;
      border: thin solid var(--v0-divider);
      overflow: hidden;
    }

    th, td {
      padding: 0.5rem 0.75rem;
      border-bottom: thin solid var(--v0-divider);
      border-right: thin solid var(--v0-divider);
    }

    th {
      background-color: var(--v0-surface-tint);
      font-weight: 600;
    }

    th:last-child, td:last-child {
      border-right: none;
    }

    tr:last-child td {
      border-bottom: none;
    }
  }

  /* DocsMarkup code block styling */
  .docs-markup .shiki {
    padding-top: 2rem;
  }

  .docs-markup .shiki code {
    padding-bottom: 1rem;
  }

  @media (max-width: 768px) {
    .docs-markup .shiki code {
      padding-right: 5rem;
    }
  }

  .docs-markup--wrap .shiki code {
    white-space: pre-wrap;
    word-break: break-word;
  }

  /* DocsExample code block styling */
  .docs-example-code .shiki {
    border: none;
    border-top: thin solid var(--v0-divider);
    border-radius: 0;
    margin-bottom: 0;
  }

  .docs-example-code .shiki code {
    padding-right: 5rem;
    line-height: 1.625;
  }

  .docs-example-code--expanded .shiki {
    padding-top: 2rem;
  }

  .docs-example-code--wrap .shiki code {
    white-space: pre-wrap;
    word-break: break-word;
  }

  /* DocsCodeGroup code block styling */
  .docs-code-group .shiki {
    border-top: none;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  /* DocsApiCard code block styling */
  .docs-api-card .shiki {
    border: none;
    border-radius: 0;
    margin: 0;
    padding-top: 2rem;
  }

  .docs-api-card .shiki code {
    padding: 1rem;
    padding-right: 5rem;
    line-height: 1.625;
  }

  .docs-api-card--wrap .shiki code {
    white-space: pre-wrap;
    word-break: break-word;
  }

  /* DocsReleases code block styling */
  .docs-releases pre {
    background-color: var(--v0-pre);
    padding: 1rem;
    border-radius: 0.25rem;
    overflow-x: auto;
    margin: 0.75rem 0;
  }

  .docs-releases code {
    background-color: var(--v0-surface-tint);
    padding: 0 0.25rem;
    border-radius: 0.25rem;
  }

  .docs-releases pre code {
    background-color: transparent;
    padding: 0;
  }

  /* Shiki theme switching — override inline vars to use theme surface color */
  .shiki {
    --shiki-light-bg: var(--v0-surface, #fff) !important;
    --shiki-dark-bg: var(--v0-surface, #1a1a1a) !important;
    --shiki-light: var(--v0-on-surface) !important;
    --shiki-dark: var(--v0-on-surface) !important;
    background-color: var(--v0-surface);
    color: var(--v0-on-surface);
    border: thin solid var(--v0-divider);
    border-radius: 0.5rem;
  }

  /* Focus indicator for keyboard scrolling (inset to avoid clipping by overflow-hidden parent) */
  .shiki:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px var(--v0-primary);
  }
</style>
