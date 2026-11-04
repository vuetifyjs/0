<script setup lang="ts">
  import { BButton, BCard, BPlaceholder } from '@paper/bootstrap'
</script>

<template>
  <div class="d-flex flex-nowrap align-items-start gap-4">
    <BCard class="min-w-0" style="flex: 1 1 0">
      <div
        class="card-img-top"
        style="height: 180px; background: #20c997"
      />

      <BCard.Body>
        <BCard.Title>Card title</BCard.Title>

        <BCard.Text>
          Some quick example text to build on the card title and make up the bulk of the card’s content.
        </BCard.Text>

        <BButton
          href="#"
          theme="primary"
          variant="solid"
        >
          Go somewhere
        </BButton>
      </BCard.Body>
    </BCard>

    <BCard aria-hidden="true" class="min-w-0" style="flex: 1 1 0">
      <div
        class="card-img-top placeholder"
        style="height: 180px"
      />

      <BCard.Body>
        <BCard.Title class="placeholder-wave">
          <BPlaceholder class="col-6" />
        </BCard.Title>

        <BCard.Text class="placeholder-wave d-flex flex-wrap gap-1">
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
  </div>
</template>
