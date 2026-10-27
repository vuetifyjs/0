<script setup vapor lang="ts">
  // Utilities
  import { useTemplateRef } from 'vue'

  // The documented workaround: a Vapor component ref is a proxy over the
  // exposed object, so exposing the root element as `$el` gives toElement's
  // component-instance branch something to read.
  const root = useTemplateRef('root')

  defineExpose({ $el: root })
</script>

<template>
  <section ref="root">exposed</section>
</template>
