<script setup lang="ts">
  import { BCard } from '@paper/bootstrap'
</script>

<template>
  <BCard style="max-width: 320px">
    <svg
      aria-label="Placeholder: Image cap"
      class="bd-placeholder-img card-img-top"
      height="180"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      style="font-size: 1.125rem; text-anchor: middle; user-select: none"
      width="100%"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Placeholder</title>

      <rect
        fill="var(--bs-bg-2)"
        height="100%"
        width="100%"
      />

      <text
        dy=".3em"
        fill="var(--bs-fg-4)"
        x="50%"
        y="50%"
      >Image cap</text>
    </svg>

    <BCard.Body>
      <BCard.Title>Card title</BCard.Title>

      <BCard.Text>Some quick example text to build on the card title and make up the bulk of the card's content.</BCard.Text>

      <a
        class="btn-solid theme-primary"
        href="#"
      >Go somewhere</a>
    </BCard.Body>
  </BCard>
</template>
