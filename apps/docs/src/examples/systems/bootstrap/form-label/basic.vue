<script setup lang="ts">
  import { BFormControl, BFormLabel } from '@paper/bootstrap'

  import { shallowRef } from 'vue'

  const first = shallowRef('')
  const second = shallowRef('')
</script>

<template>
  <div>
    <div class="mb-3">
      <BFormLabel for="formGroupExampleInput">Example label</BFormLabel>

      <BFormControl
        id="formGroupExampleInput"
        v-model="first"
        placeholder="Example input placeholder"
      />
    </div>

    <div class="mb-3">
      <BFormLabel for="formGroupExampleInput2">Another label</BFormLabel>

      <BFormControl
        id="formGroupExampleInput2"
        v-model="second"
        placeholder="Another input placeholder"
      />
    </div>
  </div>
</template>
