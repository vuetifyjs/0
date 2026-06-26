<script setup lang="ts">
  import { createTooltipContext } from '@vuetify/v0'
  import { shallowRef } from 'vue'
  import { provideRegionSettings } from './context'

  const openDelay = shallowRef(700)
  const closeDelay = shallowRef(150)
  const skipDelay = shallowRef(300)
  const disabled = shallowRef(false)

  provideRegionSettings({ openDelay, closeDelay, skipDelay, disabled })

  const [, provideTooltip] = createTooltipContext({
    openDelay,
    closeDelay,
    skipDelay,
    disabled,
  })

  provideTooltip()
</script>

<template>
  <slot />
</template>
