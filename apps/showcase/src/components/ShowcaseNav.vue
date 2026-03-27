<script setup lang="ts">
  import { CxNavGroup, CxNavLink } from '@paper/codex'

  // Composables
  import { useShowcase } from '../composables/useShowcase'

  const { designSystems } = useShowcase()
</script>

<template>
  <ul class="list-none p-0 m-0">
    <CxNavGroup v-for="ds in designSystems" :key="ds.name" :label="ds.name">
      <CxNavLink label="Tokens" :to="`/${ds.slug}/tokens`" />
      <CxNavLink label="Components" :to="`/${ds.slug}/components`" />
    </CxNavGroup>
  </ul>
</template>
