<script setup lang="ts">
  import { InferSeoMetaPlugin } from '@unhead/addons'
  import { injectHead, useHead } from '@unhead/vue'

  // Framework
  import { IN_BROWSER, useWindowEventListener } from '@vuetify/v0'

  // Components
  import DocsHighlight from '@/components/docs/DocsHighlight.vue'

  // Composables
  import { useScrollPersist } from './composables/useScrollPersist'
  import { useSettings } from './composables/useSettings'
  import { useThemeToggle } from './composables/useThemeToggle'

  // Utilities
  import { shallowRef, toRef, watch } from 'vue'
  import { useRoute } from 'vue-router'

  useScrollPersist()
  const { prefersReducedMotion, showDotGrid, showMeshTransition } = useSettings()

  const route = useRoute()
  watch(() => route.fullPath, (to, from) => {
    if (!IN_BROWSER) return
    if (to.includes('#') || history.state?.scroll) return
    if (to === from) return
    window.scrollTo({ top: 0, behavior: prefersReducedMotion.value ? 'auto' : 'smooth' })
  })

  const { preference } = useThemeToggle()
  const showMesh = toRef(() => preference.value !== 'high-contrast')
  const showBottomMesh = shallowRef(false)

  useWindowEventListener('scroll', () => {
    if (!IN_BROWSER) return
    showBottomMesh.value = showMeshTransition.value && window.scrollY > 200
  }, { passive: true })

  const head = injectHead()
  head.use(InferSeoMetaPlugin())

  useHead({
    title: 'Vuetify0',
    titleTemplate: '%s — Vuetify0',
    link: [
      { rel: 'preconnect', href: 'https://api.github.com' },
      { rel: 'preconnect', href: 'https://cdn.vuetifyjs.com' },
      { rel: 'dns-prefetch', href: 'https://api.npmjs.org' },
    ],
    meta: [
      { key: 'description', name: 'description', content: 'Headless components and composables for building modern applications and design systems' },
      { key: 'og:type', property: 'og:type', content: 'website' },
      { key: 'og:url', property: 'og:url', content: 'https://0.vuetifyjs.com' },
      { key: 'og:image', property: 'og:image', content: 'https://cdn.vuetifyjs.com/docs/images/one/logos/vzero-logo-og.png' },
      { key: 'twitter:card', name: 'twitter:card', content: 'summary' },
    ],
  })
</script>

<template>
  <div v-if="showMesh" aria-hidden="true" class="mesh-bg mesh-bg-top" />
  <div v-if="showMesh" aria-hidden="true" class="mesh-bg mesh-bg-bottom" :class="{ visible: showBottomMesh }" />
  <main class="min-h-screen pt-[72px] text-on-background" :class="{ 'dot-grid': showDotGrid }">
    <router-view />
  </main>

  <!-- API hover popovers for code blocks (v0 and Vue APIs) -->
  <DocsApiHover />

  <!-- Discovery overlay -->
  <DocsHighlight />
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

  .mesh-bg {
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
  }

  .mesh-bg-top {
    background:
      radial-gradient(at 40% 20%, color-mix(in srgb, var(--v0-primary) 40%, transparent) 0px, transparent 50%),
      radial-gradient(at 80% 0%, color-mix(in srgb, var(--v0-info) 35%, transparent) 0px, transparent 50%),
      radial-gradient(at 0% 50%, color-mix(in srgb, var(--v0-error) 25%, transparent) 0px, transparent 50%),
      radial-gradient(at 80% 50%, color-mix(in srgb, var(--v0-success) 30%, transparent) 0px, transparent 50%),
      radial-gradient(at 20% 80%, color-mix(in srgb, var(--v0-warning) 20%, transparent) 0px, transparent 50%);
  }

  .mesh-bg-bottom {
    opacity: 0;
    transition: opacity 0.5s ease-out;
    background:
      radial-gradient(at 60% 80%, color-mix(in srgb, var(--v0-primary) 40%, transparent) 0px, transparent 50%),
      radial-gradient(at 20% 100%, color-mix(in srgb, var(--v0-info) 35%, transparent) 0px, transparent 50%),
      radial-gradient(at 100% 50%, color-mix(in srgb, var(--v0-error) 25%, transparent) 0px, transparent 50%),
      radial-gradient(at 20% 50%, color-mix(in srgb, var(--v0-success) 30%, transparent) 0px, transparent 50%),
      radial-gradient(at 80% 20%, color-mix(in srgb, var(--v0-warning) 20%, transparent) 0px, transparent 50%);

    &.visible {
      opacity: 1;
    }
  }

  #app > main {
    position: relative;
    background: color-mix(in srgb, var(--v0-background) 85%, transparent);

    &.dot-grid::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100vh;
      z-index: 0;
      pointer-events: none;
      background:
        radial-gradient(circle, color-mix(in srgb, var(--v0-on-background) 10%, transparent) 1px, transparent 1px);
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

    &.dot-grid > * {
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

    > h1, > h2, > h3, > h4, > h5, > h6 {
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

    ul, ol {
      list-style-type: disc;
      padding-left: 1.5rem;
    }

    ul:not(:last-child),
    ol:not(:last-child) {
      margin-bottom: 1rem;
    }

    li:not(:last-child) {
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

  /* Shiki theme switching */
  .shiki {
    --shiki-light-bg: var(--v0-surface) !important;
    --shiki-dark-bg: var(--v0-surface) !important;
    background-color: var(--shiki-light-bg);
    border: thin solid var(--v0-divider);
    border-radius: 0.5rem;
  }

  /* Focus indicator for keyboard scrolling (inset to avoid clipping by overflow-hidden parent) */
  .shiki:focus-visible {
    outline: none;
    box-shadow: inset 0 0 0 2px var(--v0-primary);
  }

  .shiki span {
    color: var(--shiki-light);
  }

  [data-theme] .shiki {
    background-color: light-dark(var(--shiki-light-bg), var(--shiki-dark-bg));
  }

  [data-theme] .shiki span {
    color: light-dark(var(--shiki-light), var(--shiki-dark));
  }
</style>
