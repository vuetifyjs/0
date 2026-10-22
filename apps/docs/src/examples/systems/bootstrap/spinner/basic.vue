<script setup lang="ts">
  import { BSpinner } from '@paper/bootstrap'
</script>

<template>
  <div class="d-flex align-items-center gap-3">
    <BSpinner />
    <BSpinner grow />
    <BSpinner small />
    <BSpinner height="1em" variant="rotate" width="1em" />
  </div>
</template>
