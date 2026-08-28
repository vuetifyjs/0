<script setup lang="ts">
  import { BuPagination } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const page = shallowRef(46)
</script>

<template>
  <p class="is-size-7 has-text-grey mb-3">Page {{ page }} of 86 — five links visible</p>

  <BuPagination v-slot="{ items }" v-model="page" :pages="86" :visible="5">
    <BuPagination.Prev>Previous</BuPagination.Prev>

    <BuPagination.Next>Next page</BuPagination.Next>

    <BuPagination.List>
      <template v-for="(item, index) in items" :key="index">
        <BuPagination.Item v-if="item.type === 'page'" :value="item.value" />

        <BuPagination.Ellipsis v-else />
      </template>
    </BuPagination.List>
  </BuPagination>
</template>
