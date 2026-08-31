<script setup lang="ts">
  // Baked theme.css must not be imported here — it paints `--v0-*` on `:root`.
  import { EmeraldStyleSheetAdapter, emeraldColors, emeraldDarkColors } from '@paper/emerald'
  import { useHead } from '@unhead/vue'
  import faqs from 'virtual:faqs'
  import mdRoutes from 'virtual:md-routes'
  import pageDates from 'virtual:page-dates'

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

  const emeraldAdapter = new EmeraldStyleSheetAdapter({
    v0Aliases: true,
    stylesheetId: 'emerald-docs-tokens',
  })

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

  const url = toRef(() => `https://0.vuetifyjs.com${route.path}`)
  const breadcrumbs = useBreadcrumbItems()

  // Advertise the page's markdown twin so agent fetchers and AI crawlers can
  // retrieve source markdown instead of scraping rendered HTML. Only emitted for
  // routes that actually have a twin — see build/md-routes.ts.
  const markdown = toRef(() => {
    const twin = mdRoutes[route.path] ?? mdRoutes[route.path.replace(/\/$/, '')]
    if (!twin) return []

    return [{
      key: 'alternate-markdown',
      rel: 'alternate',
      type: 'text/markdown',
      href: `https://0.vuetifyjs.com${twin}`,
    }]
  })

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

  // Documentation pages are TechArticle, not bare WebSite nodes — it carries the
  // headline and dateModified that AI answer engines use to judge freshness.
  // `dateModified` is the page's last git commit, already collected for the
  // freshness badge.
  const articleScript = toRef(() => {
    const items = breadcrumbs.value
    if (items.length <= 1) return []

    const headline = items.at(-1)?.text
    if (!headline) return []

    const dates = pageDates[route.path]

    return [{
      key: 'article-schema',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'TechArticle',
        headline,
        'url': url.value,
        'isPartOf': { '@type': 'WebSite', 'name': 'Vuetify0', 'url': 'https://0.vuetifyjs.com' },
        'about': { '@type': 'SoftwareSourceCode', 'name': '@vuetify/v0', 'programmingLanguage': 'TypeScript' },
        'publisher': { '@type': 'Organization', 'name': 'Vuetify', 'url': 'https://vuetifyjs.com' },
        ...dates?.updated ? { dateModified: dates.updated } : {},
      }),
    }]
  })

  // FAQPage markup must mirror content the reader can see, so these come from
  // the same `::: faq` blocks the page renders — see build/generate-faqs.ts.
  const faqScript = toRef(() => {
    const items = faqs[route.path] ?? faqs[route.path.replace(/\/$/, '')]
    if (!items?.length) return []

    return [{
      key: 'faq-schema',
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': items.map(item => ({
          '@type': 'Question',
          'name': item.question,
          'acceptedAnswer': { '@type': 'Answer', 'text': item.answer },
        })),
      }),
    }]
  })

  useHead({
    title: 'Vuetify0',
    titleTemplate: '%s — Vuetify0',
    link: toRef(() => [
      { rel: 'preconnect', href: 'https://api.github.com' },
      { rel: 'preconnect', href: 'https://cdn.vuetifyjs.com' },
      { rel: 'dns-prefetch', href: 'https://api.npmjs.org' },
      { key: 'canonical', rel: 'canonical', href: url.value },
      // Site-wide LLM context bundles. Documented for humans on
      // /guide/tooling/ai-tools; these make them machine-discoverable.
      { key: 'llms', rel: 'alternate', type: 'text/plain', href: 'https://0.vuetifyjs.com/llms.txt', title: 'llms.txt' },
      { key: 'llms-full', rel: 'alternate', type: 'text/plain', href: 'https://0.vuetifyjs.com/llms-full.txt', title: 'llms-full.txt' },
      ...markdown.value,
    ]),
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
    style: [{
      key: 'emerald-docs-tokens',
      id: 'emerald-docs-tokens',
      innerHTML: emeraldAdapter.generate({
        'emerald-light': emeraldColors,
        'emerald-dark': emeraldDarkColors,
      }),
    }],
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
      ...articleScript.value,
      ...faqScript.value,
    ]),
  })
</script>

<template>
  <AppMeshBg />

  <div
    class="app-shell min-h-screen text-on-background"
    :class="{ 'dot-grid': settings.showDotGrid.value }"
    :data-code-size="settings.codeSize.value"
    :style="{ '--line-opacity': `${settings.dotGridIntensity.value}%`, '--dot-coverage': `${settings.dotGridCoverage.value}%` }"
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
  html {
    scroll-padding-top: calc(48px + var(--app-banner-h, 0px) + 0.5rem);
  }

  #app > .app-shell {
    position: relative;
    background: color-mix(in srgb, var(--v0-background) 85%, transparent);

    /*
     * App-shell dot grid (toggled via Settings → "Dot grid pattern").
     *
     * Intentionally a separate inline implementation from the AppDotGrid
     * component: this is a full-viewport shell background with a diagonal fade
     * and a user toggle, whereas AppDotGrid is a per-section accent with a
     * radial fade from a corner — different roles, so neither is forced onto
     * the other. The dot weight, 20px density, and connecting-line construction
     * (lines offset half a cell so the dots sit on the intersections) are kept
     * deliberately in sync with the GnDotGrid primitive in @paper/genesis;
     * change the look there and mirror it here.
     */
    &.dot-grid::before {
      --dot-opacity: 12%;
      /* --line-opacity is set inline from the "Line intensity" setting (defaults to 0.85%). */
      /* --dot-coverage is set inline from the "Dot coverage" setting (defaults to 15%): the
         diagonal fade stays solid to that stop, then ramps to transparent 20% further out. */
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100vh;
      z-index: 0;
      pointer-events: none;
      background:
        radial-gradient(circle, color-mix(in srgb, var(--v0-on-background) var(--dot-opacity), transparent) 1px, transparent 1px),
        linear-gradient(to right, color-mix(in srgb, var(--v0-on-background) var(--line-opacity, 0.85%), transparent) 1px, transparent 1px),
        linear-gradient(to bottom, color-mix(in srgb, var(--v0-on-background) var(--line-opacity, 0.85%), transparent) 1px, transparent 1px);
      background-size: 20px 20px;
      background-position: 0 0, 10px 10px, 10px 10px;
      mask-image: linear-gradient(
        225deg,
        black 0%,
        black var(--dot-coverage, 15%),
        transparent calc(var(--dot-coverage, 15%) + 20%)
      );
      -webkit-mask-image: linear-gradient(
        225deg,
        black 0%,
        black var(--dot-coverage, 15%),
        transparent calc(var(--dot-coverage, 15%) + 20%)
      );
    }

    [data-theme]:not([data-theme="light"]):not([data-theme="odyssey"]):not([data-theme="tailwind-light"]):not([data-theme="material-3-light"]):not([data-theme="ant-design-light"]):not([data-theme="radix-light"]):not([data-theme="emerald-light"]) &.dot-grid::before {
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
      /* Long API tokens (useIntersectionObserver, SUPPORTS_*) must break
         instead of widening the layout viewport on phones. */
      overflow-wrap: anywhere;

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
          /* Out of flow — an in-flow '#' extends the widest line by ~1em
             and with it the page's scrollWidth on mobile. */
          position: absolute;
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
      /* Inline paths/imports in prose wrap instead of widening the page;
         inert inside pre-formatted (.shiki) blocks. */
      overflow-wrap: anywhere;
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

    /* Prose tables only. Self-styled grid examples opt out via [data-grid] on
       their wrapper — otherwise this rule's specificity (0,1,1) overrides their
       own utility classes (0,1,0) and double-borders the table. Bare example
       tables (no wrapper) still get this default styling. */
    table:not([data-grid] table) {
      width: 100%;
      background-color: var(--v0-surface);

      /* Phones: width:100% resolves to max(container, min-content) and
         squeezes every wrappable column to one word per line. Let the table
         take its natural width (capped so prose cells still wrap) and scroll
         inside the overflow-x-auto wrapper markdown.ts provides. */
      @media (max-width: 767px) {
        width: max-content;
        min-width: 100%;
        max-width: 42rem;
      }
      border-collapse: separate;
      border-spacing: 0;
      border-radius: 0.5rem;
      border: thin solid var(--v0-divider);
      overflow: hidden;

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

    /* Mobile scroll affordance: overlay scrollbars are invisible until
       touched, leaving no signal that a wide table extends past the
       viewport. Fade the clipped edge of an overflowing wrapper — the fade
       tracks scroll position and vanishes at the reached edge (an inactive
       timeline leaves the no-fade base values, so non-overflowing tables are
       untouched). Browsers without scroll timelines keep a thin scrollbar. */
    @media (max-width: 767px) {
      div.overflow-x-auto:has(> table) {
        scrollbar-width: thin;
        scrollbar-color: color-mix(in srgb, var(--v0-on-surface) 40%, transparent) transparent;
        padding-bottom: 2px;
      }

      @supports (animation-timeline: scroll(self x)) {
        div.overflow-x-auto:has(> table) {
          --table-fade-start: 0px;
          --table-fade-end: 0px;
          mask-image: linear-gradient(to right, transparent 0, black var(--table-fade-start), black calc(100% - var(--table-fade-end)), transparent 100%);
          animation: docs-table-edge-fade linear both;
          animation-timeline: scroll(self x);
        }
      }
    }
  }

  /* Registered so the table-wrapper edge fade interpolates smoothly instead
     of flipping mid-scroll (custom properties animate discretely otherwise). */
  @property --table-fade-start {
    syntax: '<length>';
    inherits: false;
    initial-value: 0px;
  }

  @property --table-fade-end {
    syntax: '<length>';
    inherits: false;
    initial-value: 0px;
  }

  @keyframes docs-table-edge-fade {
    0% {
      --table-fade-start: 0px;
      --table-fade-end: 2.5rem;
    }

    100% {
      --table-fade-start: 2.5rem;
      --table-fade-end: 0px;
    }
  }

  /* Markdown footnotes (markdown-it-footnote) */
  .footnote-ref {
    font-size: 0.75em;
    line-height: 0;
    margin-left: 0.125rem;
  }

  .footnote-ref a,
  .footnote-ref a.v0-link {
    color: var(--v0-primary);
    text-decoration: none;
  }

  .footnote-ref a:hover {
    text-decoration: underline;
  }

  .footnotes-sep {
    margin-top: 3rem;
    border: none;
    border-top: 1px solid var(--v0-divider);
  }

  .footnotes {
    margin-top: 1rem;
    font-size: 0.875rem;
    color: var(--v0-on-surface-variant);
  }

  .footnotes-list {
    list-style: decimal;
    padding-left: 1.5rem;
  }

  .footnotes-list li {
    margin-bottom: 0.25rem;
  }

  .footnotes-list li :is(p, ul, ol) {
    margin: 0;
  }

  .footnote-backref,
  .footnote-backref.v0-link {
    margin-left: 0.25rem;
    color: var(--v0-primary);
    text-decoration: none;
    font-size: 0.875em;
  }

  .footnote-backref:hover {
    text-decoration: underline;
  }

  /* Code size — one variable drives every shiki surface (fences, code
     groups, API cards, example panes). The app-shell data attribute is
     bound to the codeSize setting. */
  .app-shell {
    --docs-code-size: 0.8125rem;
  }

  .app-shell[data-code-size='medium'] {
    --docs-code-size: 0.875rem;
  }

  .app-shell[data-code-size='large'] {
    --docs-code-size: 1rem;
  }

  .shiki code {
    font-size: var(--docs-code-size);
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
