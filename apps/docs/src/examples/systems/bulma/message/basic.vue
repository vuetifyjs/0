<script setup lang="ts">
  import { BuMessage, BuMessageBody, BuMessageDelete, BuMessageHeader } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const open = shallowRef(true)
</script>

<template>
  <button
    v-if="!open"
    class="button"
    type="button"
    @click="open = true"
  >
    Show message
  </button>

  <BuMessage v-model="open">
    <BuMessageHeader>
      <p>Hello World</p>
      <BuMessageDelete />
    </BuMessageHeader>

    <BuMessageBody>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec
      nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus
      diam, et dictum <a>felis venenatis</a> efficitur.
    </BuMessageBody>
  </BuMessage>
</template>
