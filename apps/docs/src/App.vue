<script lang="ts" setup>
  //
</script>

<template>
  <div class="bg-background text-on-background">
    <router-view />
  </div>
</template>

<style>
  #app > div {
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
