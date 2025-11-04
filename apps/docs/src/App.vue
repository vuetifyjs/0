<script lang="ts" setup>
  import { useTheme } from '@vuetify/v0'

  const theme = useTheme()
</script>

<template>
  <div :class="`v0-theme--${theme.selectedId.value}`">
    <router-view />
  </div>
</template>

<style>
  #app > div {
    background-color: var(--v0-background);

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
    }

    ul:not(:last-child),
    ol:not(:last-child) {
      margin-bottom: 1rem;
    }

    li:not(:last-child) {
      margin-bottom: 0.5rem;
    }

    .shiki, .skiki span {
      background-color: var(--v0-pre) !important;
      overflow-x: auto;
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
