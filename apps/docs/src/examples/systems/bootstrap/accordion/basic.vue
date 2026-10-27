<script setup lang="ts">
  import { BAccordion } from '@paper/bootstrap'
</script>

<template>
  <BAccordion name="accordionExample">
    <BAccordion.Item open>
      <BAccordion.Header>Accordion Item #1</BAccordion.Header>

      <BAccordion.Body>
        <strong>This is the first item's accordion body.</strong> It is shown by default because the <code>open</code> attribute is present. The native <code>&lt;details&gt;</code> element handles all the show/hide logic without any JavaScript. You can put any HTML content within the <code>.accordion-body</code>.
      </BAccordion.Body>
    </BAccordion.Item>

    <BAccordion.Item>
      <BAccordion.Header>Accordion Item #2</BAccordion.Header>

      <BAccordion.Body>
        <strong>This is the second item's accordion body.</strong> The <code>name</code> attribute groups this with other accordion items. When you open this item, any other open item in the same group will close automatically.
      </BAccordion.Body>
    </BAccordion.Item>

    <BAccordion.Item>
      <BAccordion.Header>Accordion Item #3</BAccordion.Header>

      <BAccordion.Body>
        <strong>This is the third item's accordion body.</strong> This exclusive accordion behavior is built into the browser—no Bootstrap JavaScript required. Just use matching <code>name</code> attributes on your <code>&lt;details&gt;</code> elements.
      </BAccordion.Body>
    </BAccordion.Item>
  </BAccordion>
</template>
