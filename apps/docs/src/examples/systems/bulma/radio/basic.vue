<script setup lang="ts">
  import { BuControl, BuRadio } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const answer = shallowRef<string | undefined>()
</script>

<template>
  <BuControl>
    <BuRadio v-model="answer" name="answer" value="yes">Yes</BuRadio>
    <BuRadio v-model="answer" name="answer" value="no">No</BuRadio>
    <BuRadio v-model="answer" name="answer" value="maybe">Maybe</BuRadio>
  </BuControl>
</template>
