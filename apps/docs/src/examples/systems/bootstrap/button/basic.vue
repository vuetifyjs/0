<script setup lang="ts">
  import { BButton } from '@paper/bootstrap'
</script>

<template>
  <div class="d-flex flex-wrap align-items-center gap-2">
    <BButton>Base</BButton>

    <BButton
      theme="primary"
      variant="solid"
    >
      Solid
    </BButton>

    <BButton
      theme="primary"
      variant="outline"
    >
      Outline
    </BButton>

    <BButton
      theme="primary"
      variant="subtle"
    >
      Subtle
    </BButton>

    <BButton
      theme="primary"
      variant="link"
    >
      Link
    </BButton>

    <BButton
      theme="primary"
      variant="text"
    >
      Text
    </BButton>

    <BButton
      href="#save"
      theme="primary"
      variant="solid"
    >
      Anchor
    </BButton>

    <BButton
      aria-label="Confirm"
      icon
      theme="primary"
      variant="solid"
    >
      <svg
        aria-hidden="true"
        class="bi"
        fill="currentColor"
        height="16"
        viewBox="0 0 16 16"
        width="16"
      >
        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
      </svg>
    </BButton>
  </div>
</template>
