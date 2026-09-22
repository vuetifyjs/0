<script setup lang="ts">
  // Utilities
  import { ref } from 'vue'

  import { Radio } from '../../Radio/index'

  const selected = ref<string>()
</script>

<template>
  <Radio.Group v-model="selected">
    <Radio.Root value="a">
      <Radio.Indicator>&#9679;</Radio.Indicator>
    </Radio.Root>

    <Radio.Root value="b">
      <Radio.Indicator>&#9679;</Radio.Indicator>
    </Radio.Root>
  </Radio.Group>
</template>
