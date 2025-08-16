<script lang="ts" setup>
  import { provideAppContext } from '@/composables/useApp'
  import { shallowRef } from 'vue'

  provideAppContext({
    nav: shallowRef(false),
  })
</script>

<template>
  <div class="v0-theme--slate">
    <router-view />
  </div>
</template>

<style>
  #app {
    background-color: var(--v0-background);
  }

  .markdown-body {
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

    a {
      color: var(--v0-primary);
      text-decoration: underline;
      transition: color 0.2s;
        opacity: 1;

      &:hover {
        opacity: 0.8;
      }
    }

    blockquote {
      margin: 1rem 0;
      padding: 0.5rem 1rem;
      background-color: var(--v0-surface);
      border-left: 4px solid #d1d5db;
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
      margin-bottom: 1rem;
    }

    li {
      margin-bottom: 0.5rem;
    }

    pre.shiki {
      border: thin solid var(--v0-divider);
      border-radius: 6px;
      margin-bottom: 1rem;
      padding: 0.5rem;
      overflow-x: auto;
    }

    pre[class*="language-"] {
      background-color: #f6f8fa;
      padding: 0.5rem;
      overflow-x: auto;
      display: flex;
      border-radius: 6px;
      margin-bottom: 1rem;
      border: thin solid var(--v0-divider);
    }

    table {
      width: 100%;
      border-collapse: collapse;
      border-radius: 6px;
      margin-bottom: 1rem;
    }

    th, td {
      padding: 0.25rem 0.5rem;
      border: 1px solid #d1d5db;
      text-align: left;
    }
  }
</style>
