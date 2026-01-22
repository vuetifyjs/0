<script setup lang="ts">
  // Components
  import { useDiscoveryRootContext } from './DiscoveryRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'DiscoveryPrev' })

  const { disabled } = defineProps<{ disabled?: boolean }>()

  const root = useDiscoveryRootContext('v0:discovery')

  const isDisabled = toRef(() => disabled || root.isFirst.value)

  function prev () {
    if (isDisabled.value) return
    root.prev()
  }
</script>

<template>
  <button
    aria-label="Go to previous step"
    :disabled="isDisabled"
    type="button"
    @click="prev"
  >
    <slot :is-disabled="isDisabled" />
  </button>
</template>
