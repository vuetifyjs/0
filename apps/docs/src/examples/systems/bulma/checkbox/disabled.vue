<script setup lang="ts">
  import { BuCheckbox } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const save = shallowRef(false)
</script>

<template>
  <BuCheckbox v-model="save" disabled>Save my preferences</BuCheckbox>
</template>
