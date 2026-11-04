<script setup lang="ts">
  import { BButton, BButtonGroup } from '@paper/bootstrap'
</script>

<template>
  <div class="d-flex flex-wrap align-items-center justify-content-center gap-3">
    <BButtonGroup label="Basic example">
      <BButton
        theme="primary"
        variant="solid"
      >
        Left
      </BButton>

      <BButton
        theme="primary"
        variant="solid"
      >
        Middle
      </BButton>

      <BButton
        theme="primary"
        variant="solid"
      >
        Right
      </BButton>
    </BButtonGroup>

    <BButtonGroup
      divider
      label="Vertical example"
      vertical
    >
      <BButton
        theme="secondary"
        variant="solid"
      >
        Top
      </BButton>

      <BButton
        active
        theme="secondary"
        variant="solid"
      >
        Middle
      </BButton>

      <BButton
        theme="secondary"
        variant="solid"
      >
        Bottom
      </BButton>
    </BButtonGroup>
  </div>
</template>
