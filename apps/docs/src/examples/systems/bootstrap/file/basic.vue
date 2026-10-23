<script setup lang="ts">
  import { BFile, BFormLabel } from '@paper/bootstrap'

  import { ref } from 'vue'

  const files = ref<FileList | null>(null)
</script>

<template>
  <div>
    <BFormLabel class="mb-2" for="formFile">Choose a file</BFormLabel>
    <BFile id="formFile" v-model="files" />
  </div>
</template>
