<script setup lang="ts">
  import { BuPagination } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const page = shallowRef(46)
</script>

<template>
  <p class="is-size-7 has-text-grey mb-3">Page {{ page }} of 86 — five links visible</p>

  <BuPagination v-model="page" :pages="86" :visible="5" />
</template>
