<script setup lang="ts">
  import { BuControl, BuField, BuLabel, BuTextarea } from '@paper/bulma'

  import { shallowRef } from 'vue'

  const notes = shallowRef('')
</script>

<template>
  <BuField>
    <BuLabel>Notes</BuLabel>

    <BuControl>
      <BuTextarea
        v-model="notes"
        fixed
        placeholder="Fixed size textarea"
      />
    </BuControl>
  </BuField>
</template>
