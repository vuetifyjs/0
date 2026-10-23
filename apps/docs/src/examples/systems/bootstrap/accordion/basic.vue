<script setup lang="ts">
  import { BAccordion } from '@paper/bootstrap'
</script>

<template>
  <div>
    <BAccordion theme="primary">
      <BAccordion.Item open>
        <BAccordion.Header>Accordion Item #1</BAccordion.Header>

        <BAccordion.Body>
          This is the first item's accordion body. It is shown because open is set.
        </BAccordion.Body>
      </BAccordion.Item>

      <BAccordion.Item>
        <BAccordion.Header>Accordion Item #2</BAccordion.Header>

        <BAccordion.Body>
          This is the second item's accordion body.
        </BAccordion.Body>
      </BAccordion.Item>
    </BAccordion>
  </div>
</template>
