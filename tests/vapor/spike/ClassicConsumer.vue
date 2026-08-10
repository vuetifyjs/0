<script setup lang="ts">
  // Classic (vdom) SFC: injects a context provided by a VAPOR ancestor and
  // renders a classic Atom copy — the mixed-runtime path through interop.

  import AtomClassic from './AtomClassic.vue'

  import { useGreeting } from '../src/context'

  const greeting = useGreeting()
</script>

<template>
  <AtomClassic as="section" data-classic-host>
    <span data-mixed-greeting>{{ greeting.text }}</span>
  </AtomClassic>
</template>
