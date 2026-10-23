<script setup lang="ts">
  import { BFormAdorn } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const amount = shallowRef('')
  const user = shallowRef('')
</script>

<template>
  <div class="d-flex flex-column gap-5">
    <BFormAdorn>
      <BFormAdorn.Text>$</BFormAdorn.Text>
      <BFormAdorn.Control v-model="amount" placeholder="0.00" />
    </BFormAdorn>

    <BFormAdorn end>
      <BFormAdorn.Text>@example.com</BFormAdorn.Text>
      <BFormAdorn.Control v-model="user" placeholder="username" />
    </BFormAdorn>
  </div>
</template>
