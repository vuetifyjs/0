<script setup lang="ts">
  import { BuPanel } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const selected = shallowRef('bulma')
</script>

<template>
  <BuPanel v-model="selected">
    <BuPanel.Heading>Repositories</BuPanel.Heading>

    <BuPanel.Block value="bulma">
      <BuPanel.Icon icon="fas fa-book" />
      bulma
    </BuPanel.Block>

    <BuPanel.Block value="marksheet">
      <BuPanel.Icon icon="fas fa-book" />
      marksheet
    </BuPanel.Block>

    <BuPanel.Block value="minireset.css">
      <BuPanel.Icon icon="fas fa-book" />
      minireset.css
    </BuPanel.Block>

    <BuPanel.Block value="mojs">
      <BuPanel.Icon icon="fas fa-code-branch" />
      mojs
    </BuPanel.Block>
  </BuPanel>
</template>
