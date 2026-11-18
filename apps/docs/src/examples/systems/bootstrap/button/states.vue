<script setup lang="ts">
  import { BButton } from '@paper/bootstrap'
</script>

<template>
  <div class="d-flex flex-column align-items-start gap-3">
    <div class="d-flex flex-wrap align-items-center gap-2">
      <BButton
        size="xs"
        theme="primary"
        variant="solid"
      >
        Extra small
      </BButton>

      <BButton
        size="sm"
        theme="primary"
        variant="solid"
      >
        Small
      </BButton>

      <BButton
        theme="primary"
        variant="solid"
      >
        Default
      </BButton>

      <BButton
        size="lg"
        theme="primary"
        variant="solid"
      >
        Large
      </BButton>
    </div>

    <div class="d-flex flex-wrap align-items-center gap-2">
      <BButton
        disabled
        theme="primary"
        variant="solid"
      >
        Disabled
      </BButton>

      <BButton
        disabled
        href="#stop"
        theme="primary"
        variant="solid"
      >
        Disabled link
      </BButton>

      <BButton
        active
        theme="primary"
        variant="solid"
      >
        Active
      </BButton>

      <BButton
        active
        href="#current"
        theme="primary"
        variant="solid"
      >
        Current
      </BButton>
    </div>
  </div>
</template>
