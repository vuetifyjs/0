<script setup lang="ts">
  import { BSpinner } from '@paper/bootstrap'
</script>

<template>
  <div class="d-flex align-items-center gap-3">
    <BSpinner class="fg-primary" />
    <BSpinner class="fg-primary" grow />
    <BSpinner class="fg-primary" small />
    <BSpinner class="fg-primary" height="1em" variant="rotate" width="1em" />
  </div>
</template>
