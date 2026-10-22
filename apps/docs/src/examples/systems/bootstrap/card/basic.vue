<script setup lang="ts">
  import { BCard } from '@paper/bootstrap'
</script>

<template>
  <BCard>
    <BCard.Header>Featured</BCard.Header>

    <BCard.Body>
      <BCard.Title>Card title</BCard.Title>

      <BCard.Subtitle class="fg-3">With a card subtitle</BCard.Subtitle>

      <BCard.Text>Some quick example text to build on the card title and make up the bulk of the card's content.</BCard.Text>

      <a
        class="btn-solid theme-primary"
        href="#next"
      >Go somewhere</a>
    </BCard.Body>
  </BCard>
</template>
