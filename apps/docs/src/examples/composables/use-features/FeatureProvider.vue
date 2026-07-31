<script setup lang="ts">
  import { createFeaturesContext } from '@vuetify/v0'
  import { flags, NAMESPACE, toConfig } from './context'

  const [, provideFeatures] = createFeaturesContext({
    namespace: NAMESPACE,
    features: toConfig(flags),
  })

  provideFeatures()
</script>

<template>
  <slot />
</template>
