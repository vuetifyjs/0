<script setup lang="ts">
  // Components
  import { useDiscoveryRootContext } from './DiscoveryRoot.vue'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'DiscoveryProgress' })

  const root = useDiscoveryRootContext('v0:discovery')

  const current = toRef(() => root.index.value + 1)
  const text = toRef(() => `${current.value} of ${root.total.value}`)
</script>

<template>
  <span
    :aria-label="`Step ${current} of ${root.total.value}`"
    role="status"
  >
    <slot :current :text :total="root.all.value">
      {{ text }}
    </slot>
  </span>
</template>
