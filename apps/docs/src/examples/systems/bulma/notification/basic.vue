<script setup lang="ts">
  import { BuNotification } from '@paper/bulma'

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
    Show notification
  </button>

  <BuNotification v-model="open">
    Lorem ipsum dolor sit amet, consectetur adipiscing elit lorem ipsum dolor.
    <strong>Pellentesque risus mi</strong>, tempus quis placerat ut, porta nec
    nulla. Vestibulum rhoncus ac ex sit amet fringilla. Nullam gravida purus diam,
    et dictum <a>felis venenatis</a> efficitur.
  </BuNotification>
</template>
