<script setup lang="ts">
  import {
    BuPagination,
    BuPaginationEllipsis,
    BuPaginationItem,
    BuPaginationList,
    BuPaginationNext,
    BuPaginationPrev,
  } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const page = shallowRef(46)
</script>

<template>
  <p class="is-size-7 has-text-grey mb-3">Page {{ page }} of 86 — five links visible</p>

  <BuPagination v-slot="{ items }" v-model="page" :pages="86" :visible="5">
    <BuPaginationPrev>Previous</BuPaginationPrev>

    <BuPaginationNext>Next page</BuPaginationNext>

    <BuPaginationList>
      <template v-for="(item, index) in items" :key="index">
        <BuPaginationItem v-if="item.type === 'page'" :value="item.value" />

        <BuPaginationEllipsis v-else />
      </template>
    </BuPaginationList>
  </BuPagination>
</template>
