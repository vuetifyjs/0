<script setup lang="ts">
  import { BCard } from '@paper/bootstrap'
</script>

<template>
  <div class="d-flex flex-column gap-3">
    <BCard
      class="theme-primary"
      subtle
    >
      <BCard.Header>Primary</BCard.Header>

      <BCard.Body>
        <BCard.Title>Subtle</BCard.Title>

        <BCard.Text>The header uses the subtle fill.</BCard.Text>
      </BCard.Body>

      <div class="card-footer">Footer</div>
    </BCard>

    <div class="bg-primary p-3 rounded">
      <BCard translucent>
        <BCard.Header>Featured</BCard.Header>

        <BCard.Body>
          <BCard.Title as="h3">Translucent</BCard.Title>

          <BCard.Text>The background is mixed with what is behind the card.</BCard.Text>
        </BCard.Body>

        <div class="card-footer fg-2">2 days ago</div>
      </BCard>
    </div>
  </div>
</template>
