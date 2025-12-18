<script lang="ts" setup>
  import { useHead } from '@unhead/vue'
  import { useScrollPersist } from './composables/useScrollPersist'

  useScrollPersist()

  useHead({
    title: 'Vuetify0',
    titleTemplate: '%s — Vuetify0',
    meta: [
      { key: 'description', name: 'description', content: 'Headless components and composables for building modern applications and design systems' },
      { key: 'og:title', property: 'og:title', content: 'Vuetify0' },
      { key: 'og:description', property: 'og:description', content: 'Headless components and composables for building modern applications and design systems' },
      { key: 'og:type', property: 'og:type', content: 'website' },
      { key: 'og:url', property: 'og:url', content: 'https://0.vuetifyjs.com' },
      { key: 'og:image', property: 'og:image', content: 'https://cdn.vuetifyjs.com/docs/images/one/logos/vzero-logo-og.png' },
      { key: 'twitter:card', name: 'twitter:card', content: 'summary' },
      { key: 'twitter:title', name: 'twitter:title', content: 'Vuetify0' },
      { key: 'twitter:description', name: 'twitter:description', content: 'Headless components and composables for building modern applications and design systems' },
      { key: 'twitter:image', name: 'twitter:image', content: 'https://cdn.vuetifyjs.com/docs/images/one/logos/vzero-logo-og.png' },
    ],
  })
</script>

<template>
  <div aria-hidden="true" class="mesh-bg" />
  <main class="min-h-screen pt-[72px] text-on-background">
    <router-view />
  </main>
</template>

<style>
  .mesh-bg {
    position: fixed;
    inset: 0;
    z-index: -1;
    background:
      radial-gradient(at 40% 20%, color-mix(in srgb, var(--v0-accent) 40%, transparent) 0px, transparent 50%),
      radial-gradient(at 80% 0%, color-mix(in srgb, var(--v0-info) 35%, transparent) 0px, transparent 50%),
      radial-gradient(at 0% 50%, color-mix(in srgb, var(--v0-error) 25%, transparent) 0px, transparent 50%),
      radial-gradient(at 80% 50%, color-mix(in srgb, var(--v0-success) 30%, transparent) 0px, transparent 50%),
      radial-gradient(at 20% 80%, color-mix(in srgb, var(--v0-warning) 20%, transparent) 0px, transparent 50%);
    filter: blur(80px);
    pointer-events: none;
  }

  #app > main {
    background: color-mix(in srgb, var(--v0-background) 85%, transparent);

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

        &::before {
          content: '#';
          position: absolute;
          left: -.75em;
          opacity: 0;
          color: var(--v0-primary);
          transition: opacity 0.2s;
        }
      }

      &:hover > .header-anchor::before {
        opacity: 1;
      }
    }

    h1 {
      font-size: 2.25rem;
      line-height: 2.5rem;
      margin-bottom: 1rem;
    }

    h2 {
      font-size: 1.875rem;
      line-height: 2.25rem;
      margin-bottom: 0.75rem;
    }

    h3 {
      font-size: 1.5rem;
      line-height: 2rem;
      margin-bottom: 0.5rem;
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

    .shiki, .shiki span {
      overflow-x: auto;
    }

    table {
      width: 100%;
      background-color: var(--v0-surface);
      border-collapse: separate;
      border-spacing: 0;
      border-radius: 0.5rem;
      border: thin solid var(--v0-divider);
      margin-bottom: 1rem;
      overflow: hidden;
    }

    th, td {
      padding: 0.5rem 0.75rem;
      border-bottom: thin solid var(--v0-divider);
      border-right: thin solid var(--v0-divider);
      text-align: left;
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

  /* Shiki theme switching */
  .shiki {
    --shiki-light-bg: var(--v0-pre) !important;
    --shiki-dark-bg: var(--v0-pre) !important;
    background-color: var(--shiki-light-bg);
    border: thin solid var(--v0-divider);
    border-radius: 0.5rem;
    padding: 0.5rem 1rem;
    margin-bottom: 1rem;
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
