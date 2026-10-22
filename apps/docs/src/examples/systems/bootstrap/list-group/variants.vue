<script setup lang="ts">
  import { BListGroup } from '@paper/bootstrap'
</script>

<template>
  <div class="d-grid gap-3">
    <BListGroup flush>
      <BListGroup.Item>Flush item</BListGroup.Item>
    </BListGroup>

    <BListGroup numbered>
      <BListGroup.Item>First</BListGroup.Item>
      <BListGroup.Item>Second</BListGroup.Item>
    </BListGroup>

    <BListGroup horizontal>
      <BListGroup.Item>Left</BListGroup.Item>
      <BListGroup.Item>Right</BListGroup.Item>
    </BListGroup>

    <BListGroup as="div">
      <BListGroup.Item
        action
        href="#first"
      >
        First link
      </BListGroup.Item>

      <BListGroup.Item
        action
        disabled
        href="#second"
      >
        Disabled link
      </BListGroup.Item>
    </BListGroup>
  </div>
</template>
