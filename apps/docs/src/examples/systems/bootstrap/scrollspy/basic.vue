<script setup lang="ts">
  import { BScrollSpy } from '@paper/bootstrap'
</script>

<template>
  <BScrollSpy class="overflow-auto p-3" style="height: 16rem" tabindex="0">
    <nav class="nav nav-pills mb-3">
      <BScrollSpy.Link id="one">First</BScrollSpy.Link>
      <BScrollSpy.Link id="two">Second</BScrollSpy.Link>
    </nav>

    <BScrollSpy.Section id="one" class="py-5">
      <h4>First heading</h4>
      <p class="mb-3">This is some placeholder content for the scrollspy page. Scroll this box and the matching link picks up the active class.</p>
      <p class="mb-3">The first section starts active. It stays active while most of it is inside the box.</p>
    </BScrollSpy.Section>

    <BScrollSpy.Section id="two" class="py-5">
      <h4>Second heading</h4>
      <p class="mb-3">This is some placeholder content for the scrollspy page. The second section is tall enough that intersection can change.</p>
      <p class="mb-3">Scroll until this heading is the one in view. Second picks up the active class.</p>
    </BScrollSpy.Section>
  </BScrollSpy>
</template>
