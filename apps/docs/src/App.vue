<script lang="ts" setup>
  import { useHead, useSeoMeta } from '@unhead/vue'

  useHead({
    title: 'Vuetify0',
    titleTemplate: '%s — Vuetify0',
  })

  useSeoMeta({
    description: 'Headless components and composables for building modern applications and design systems',
    ogTitle: 'Vuetify0',
    ogDescription: 'Headless components and composables for building modern applications and design systems',
    ogType: 'website',
    ogUrl: 'https://0.vuetifyjs.com',
    twitterCard: 'summary',
    twitterTitle: 'Vuetify0',
    twitterDescription: 'Headless components and composables for building modern applications and design systems',
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
      radial-gradient(at 40% 20%, rgba(124, 58, 237, 0.4) 0px, transparent 50%),
      radial-gradient(at 80% 0%, rgba(14, 165, 233, 0.35) 0px, transparent 50%),
      radial-gradient(at 0% 50%, rgba(236, 72, 153, 0.25) 0px, transparent 50%),
      radial-gradient(at 80% 50%, rgba(45, 212, 191, 0.3) 0px, transparent 50%),
      radial-gradient(at 20% 80%, rgba(251, 146, 60, 0.2) 0px, transparent 50%);
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
