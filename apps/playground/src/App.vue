<script setup lang="ts">
</script>

<template>
  <router-view />
</template>

<style>
  .markdown-body {
    a {
      color: var(--v0-primary);
      transition: color 0.2s;

      &:hover {
        text-decoration: underline;
      }
    }

    h1, h2, h3, h4, h5, h6 {
      position: relative;
      scroll-margin-top: 5rem;
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

    > .overflow-x-auto {
      margin-bottom: 1rem;
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

  /* Shiki theme switching */
  .shiki {
    --shiki-light-bg: var(--v0-surface) !important;
    --shiki-dark-bg: var(--v0-surface) !important;
    background-color: var(--shiki-light-bg);
    border: thin solid var(--v0-divider);
    border-radius: 0.5rem;
  }

  .shiki span {
    color: var(--shiki-light);
  }

  [data-theme="light"] .shiki {
    background-color: var(--shiki-light-bg);
  }

  [data-theme="dark"] .shiki {
    background-color: var(--shiki-dark-bg);
  }

  [data-theme="light"] .shiki span {
    color: var(--shiki-light);
  }

  [data-theme="dark"] .shiki span {
    color: var(--shiki-dark);
  }
</style>
