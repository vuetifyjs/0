<script setup lang="ts">
  import { BToggler } from '@paper/bootstrap'
</script>

<template>
  <div class="d-flex flex-column gap-2">
    <BToggler
      as="button"
      class="btn-solid theme-primary align-self-start"
      target="toggler-box"
      value="bg-2"
    >
      Toggle
    </BToggler>

    <div id="toggler-box" class="w-100 p-3 rounded border">
      Use button to change bg-2
    </div>
  </div>
</template>
