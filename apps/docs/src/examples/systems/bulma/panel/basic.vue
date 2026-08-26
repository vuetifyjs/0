<script setup lang="ts">
  import { BuPanel, BuPanelBlock, BuPanelHeading, BuPanelIcon } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const selected = shallowRef('bulma')
</script>

<template>
  <BuPanel v-model="selected">
    <BuPanelHeading>Repositories</BuPanelHeading>

    <BuPanelBlock value="bulma">
      <BuPanelIcon icon="fas fa-book" />
      bulma
    </BuPanelBlock>

    <BuPanelBlock value="marksheet">
      <BuPanelIcon icon="fas fa-book" />
      marksheet
    </BuPanelBlock>

    <BuPanelBlock value="minireset.css">
      <BuPanelIcon icon="fas fa-book" />
      minireset.css
    </BuPanelBlock>

    <BuPanelBlock value="mojs">
      <BuPanelIcon icon="fas fa-code-branch" />
      mojs
    </BuPanelBlock>
  </BuPanel>
</template>
