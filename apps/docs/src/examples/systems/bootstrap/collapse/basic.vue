<script setup lang="ts">
  import { BButton, BCollapse } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const open = shallowRef(false)
</script>

<template>
  <div class="d-inline-flex gap-1">
    <BButton
      aria-controls="collapseExample"
      :aria-expanded="open"
      href="#collapseExample"
      theme="primary"
      variant="solid"
      @click.prevent="open = !open"
    >
      Link with href
    </BButton>

    <BButton
      aria-controls="collapseExample"
      :aria-expanded="open"
      theme="primary"
      variant="solid"
      @click="open = !open"
    >
      Button with data-bs-target
    </BButton>
  </div>

  <BCollapse
    id="collapseExample"
    v-model="open"
  >
    <div class="card card-body">
      Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user activates the relevant trigger.
    </div>
  </BCollapse>
</template>
