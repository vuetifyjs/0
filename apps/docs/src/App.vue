<script lang="ts" setup>
  //
</script>

<template>
  <div id="app" class="grid grid-cols-[220px_1fr] v0-theme--slate">
    <div />
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
      opacity: 0.8;

      &:hover {
        opacity: 1;
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
      background-color: #f6f8fa;
      padding: 0.2rem 0.4rem;
    }

    p {
      margin-bottom: .5rem;
    }

    ul, ol {
      list-style-type: disc;
      padding-left: 1.5rem;
      margin-bottom: 1rem;
    }

    pre {
      font-size: 0.875rem;
      line-height: 1.5rem;
      background-color: #f6f8fa;
      padding: 0.5rem;
      overflow-x: auto;
      border: 1px solid #d1d5db;
      display: flex;
      margin-bottom: 1rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;
    }

    th, td {
      padding: 0.25rem 0.5rem;
      border: 1px solid #d1d5db;
      text-align: left;
    }

    code.language-ts {
      font-size: 0.875rem;
      line-height: 1.5rem;
      padding: 0.2rem 0.4rem;
      border-radius: 6px;
    }
  }
</style>
