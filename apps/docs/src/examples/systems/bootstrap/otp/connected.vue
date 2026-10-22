<script setup lang="ts">
  import { BOtp } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const code = shallowRef('')
</script>

<template>
  <BOtp v-model="code" connected />
</template>
