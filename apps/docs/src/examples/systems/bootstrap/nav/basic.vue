<script setup lang="ts">
  import { BNav } from '@paper/bootstrap'
</script>

<template>
  <BNav>
    <BNav.Item>
      <BNav.Link active href="#">Active</BNav.Link>
    </BNav.Item>

    <BNav.Item>
      <BNav.Link href="#">Link</BNav.Link>
    </BNav.Item>

    <BNav.Item>
      <BNav.Link href="#">Link</BNav.Link>
    </BNav.Item>

    <BNav.Item>
      <BNav.Link disabled>Disabled</BNav.Link>
    </BNav.Item>
  </BNav>
</template>
