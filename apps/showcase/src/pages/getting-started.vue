<script setup lang="ts">
  import {
    CxBreadcrumbs,
    CxCallout,
    CxCalloutHeader,
    CxCodeBlock,
    CxHeaderAnchor,
    CxPackageManagerTabs,
  } from '@paper/codex'

  const breadcrumbs = [
    { label: 'Home', to: '/' },
    { label: 'Getting Started' },
  ]
</script>

<template>
  <div class="p-8 max-w-3xl">
    <CxBreadcrumbs class="mb-6" :items="breadcrumbs" />

    <h1 class="text-3xl font-bold mb-2">Getting Started</h1>
    <p class="text-on-surface-variant mb-8">Learn how Paper design systems work and how to use them.</p>

    <CxHeaderAnchor id="what-is-paper" tag="h2">
      What is Paper?
    </CxHeaderAnchor>
    <p class="mb-4">
      Paper is a layered design system architecture. At the bottom is
      <strong>v0</strong> — headless, unstyled UI primitives. On top of v0,
      <strong>Paper</strong> adds styling tokens and layout primitives. Design
      systems like <strong>Emerald</strong> and <strong>Codex</strong> build on
      Paper to provide fully styled, ready-to-use component libraries.
    </p>

    <CxHeaderAnchor id="how-design-systems-work" tag="h2">
      How Design Systems Work
    </CxHeaderAnchor>
    <p class="mb-4">
      Each design system is a complete framework: tokens for colors, spacing,
      and typography; a full set of components; and optional plugins for
      features like theming and locale. Design systems share the same
      headless core, so switching between them means changing the visual
      layer without rewriting logic.
    </p>

    <CxCallout class="mb-6" type="tip">
      <CxCalloutHeader type="tip" />
      <p class="mt-2">
        You can register multiple design systems in the showcase to compare
        them side by side.
      </p>
    </CxCallout>

    <CxHeaderAnchor id="installation" tag="h2">
      Installing a Design System
    </CxHeaderAnchor>

    <p class="mb-4">Install the package:</p>
    <CxPackageManagerTabs class="mb-6" package="@paper/emerald" />

    <p class="mb-4">Create the plugin and register it with your app:</p>
    <CxCodeBlock
      class="mb-4"
      :code="`import { createApp } from 'vue'
import { createEmeraldPlugin } from '@paper/emerald'

const app = createApp(App)
app.use(createEmeraldPlugin())
app.mount('#app')`"
      language="ts"
    />

    <p class="mb-4">Import and use components:</p>
    <CxCodeBlock
      class="mb-6"
      :code="`<script setup lang=&quot;ts&quot;>
  import { EmButton } from '@paper/emerald'
</script>

<template>
  <EmButton>Click me</EmButton>
</template>`"
      language="vue"
    />

    <CxCallout class="mb-6" type="info">
      <CxCalloutHeader type="info" />
      <p class="mt-2">
        Each design system ships its own plugin factory. Check the
        overview page for the exact import path and package name.
      </p>
    </CxCallout>
  </div>
</template>
