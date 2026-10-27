<script setup vapor lang="ts">
  // Exposes without `$el`: the ref is a proxy over this object, with no path
  // back to the instance or its DOM.
  defineExpose({ name: 'child' })
</script>

<template>
  <section>hidden</section>
</template>
