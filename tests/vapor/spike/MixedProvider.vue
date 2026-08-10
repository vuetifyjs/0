<script setup vapor lang="ts">
  // Framework
// Vapor parent provides v0 context (string key) and renders BOTH the
  // vapor-compiled real Atom and a classic consumer in one tree.

  import { Atom } from '@vuetify/v0/components'

  // Context
  import ClassicConsumer from './ClassicConsumer.vue'

  import { provideGreeting } from '../src/context'

  provideGreeting({ text: 'hello-mixed' })
</script>

<template>
  <div data-mixed>
    <Atom as="output" data-vapor-atom>vapor side</Atom>

    <ClassicConsumer />
  </div>
</template>
