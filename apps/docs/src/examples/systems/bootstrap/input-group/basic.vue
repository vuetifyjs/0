<script setup lang="ts">
  import { BInputGroup } from '@paper/bootstrap'
</script>

<template>
  <div class="d-flex flex-column gap-5">
    <BInputGroup>
      <BInputGroup.Text id="basic-addon1">@</BInputGroup.Text>

      <input
        aria-describedby="basic-addon1"
        aria-label="Username"
        class="form-control"
        placeholder="Username"
        type="text"
      >
    </BInputGroup>

    <BInputGroup>
      <input
        aria-describedby="basic-addon2"
        aria-label="Recipient's username"
        class="form-control"
        placeholder="Recipient's username"
        type="text"
      >

      <BInputGroup.Text id="basic-addon2">@example.com</BInputGroup.Text>
    </BInputGroup>
  </div>
</template>
