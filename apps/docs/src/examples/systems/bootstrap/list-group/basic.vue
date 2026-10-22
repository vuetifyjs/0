<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { BListGroup } from '@paper/bootstrap'

  const current = shallowRef('a')
</script>

<template>
  <div class="d-grid gap-3">
    <BListGroup>
      <BListGroup.Item>An item</BListGroup.Item>
      <BListGroup.Item active>An active item</BListGroup.Item>
      <BListGroup.Item>A third item</BListGroup.Item>
    </BListGroup>

    <BListGroup v-model="current" as="div" selectable>
      <BListGroup.Item action value="a">First</BListGroup.Item>
      <BListGroup.Item action value="b">Second</BListGroup.Item>
    </BListGroup>
  </div>
</template>
