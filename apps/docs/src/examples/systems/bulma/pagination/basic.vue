<script setup lang="ts">
  import { BuPagination } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const page = shallowRef(2)
</script>

<template>
  <p class="is-size-7 has-text-grey mb-3">Page {{ page }} of 5</p>

  <BuPagination v-model="page" :pages="5" />
</template>
