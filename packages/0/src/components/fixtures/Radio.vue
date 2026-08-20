<script setup lang="ts">
  // Utilities
  import { ref } from 'vue'

  import { Radio } from '../Radio/index'

  const selected = ref<string>()
</script>

<template>
  <Radio.Group v-model="selected">
    <label>
      <Radio.Root value="a">
        <Radio.Indicator>&#9679;</Radio.Indicator>
      </Radio.Root>
      Option A
    </label>

    <label>
      <Radio.Root value="b">
        <Radio.Indicator>&#9679;</Radio.Indicator>
      </Radio.Root>
      Option B
    </label>
  </Radio.Group>
</template>
