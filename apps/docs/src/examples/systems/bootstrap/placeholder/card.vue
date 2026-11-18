<script setup lang="ts">
  import { BCard, BPlaceholder } from '@paper/bootstrap'
</script>

<template>
  <BCard aria-hidden="true">
    <BCard.Body>
      <BCard.Title class="placeholder-wave">
        <BPlaceholder class="col-6" />
      </BCard.Title>

      <BCard.Text class="placeholder-wave">
        <BPlaceholder class="col-7" />
        <BPlaceholder class="col-4" />
        <BPlaceholder class="col-4" />
        <BPlaceholder class="col-6" />
        <BPlaceholder class="col-8" />
      </BCard.Text>

      <a
        aria-disabled="true"
        class="btn-solid theme-primary disabled placeholder col-6"
      />
    </BCard.Body>
  </BCard>
</template>
