<script setup lang="ts">
  // Components
  import { useDiscoveryRootContext } from './DiscoveryRoot.vue'

  // Composables
  import { useDiscovery } from '@/composables/useDiscovery'

  // Utilities
  import { toRef } from 'vue'

  defineOptions({ name: 'DiscoveryNext' })

  const { disabled } = defineProps<{ disabled?: boolean }>()

  const root = useDiscoveryRootContext('v0:discovery')
  const discovery = useDiscovery()

  const isDisabled = toRef(() => disabled ?? false)

  function next () {
    if (isDisabled.value) return
    root.next()
  }
</script>

<template>
  <button
    v-if="!discovery.isInteractive.value"
    :aria-label="root.isLast.value ? 'Complete tour' : 'Go to next step'"
    :disabled="isDisabled"
    type="button"
    @click="next"
  >
    <slot :is-disabled="isDisabled" :is-last="root.isLast.value" />
  </button>
</template>
