<script setup lang="ts">
  import { BuControl, BuField, BuInput } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const query = shallowRef('')
</script>

<template>
  <BuField addons>
    <BuControl>
      <BuInput v-model="query" placeholder="Find a repository" />
    </BuControl>

    <BuControl>
      <button class="button is-info" type="button">Search</button>
    </BuControl>
  </BuField>
</template>
