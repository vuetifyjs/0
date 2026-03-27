<script setup lang="ts">
  import { CxNavGroup, CxNavLink } from '@paper/codex'

  // Composables
  import { useShowcase } from '../composables/useShowcase'

  const { designSystems } = useShowcase()
</script>

<template>
  <ul class="list-none p-0 m-0">
    <CxNavLink label="Introduction" to="/" />
    <CxNavLink label="Getting Started" to="/getting-started" />

    <CxNavGroup v-for="ds in designSystems" :key="ds.slug" :label="ds.name">
      <CxNavLink label="Overview" :to="`/${ds.slug}`" />
      <CxNavLink label="Tokens" :to="`/${ds.slug}/tokens`" />
      <CxNavLink label="Components" :to="`/${ds.slug}/components`" />
      <CxNavLink
        v-for="section in ds.sections"
        :key="section.slug"
        :label="section.title"
        :to="`/${ds.slug}/${section.slug}`"
      />
    </CxNavGroup>
  </ul>
</template>
