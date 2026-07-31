<script setup vapor lang="ts">
  // Atom is a classic (vdom) v0 SFC; mounting it from a Vapor root exercises vdom-in-Vapor interop (requires vaporInteropPlugin).

  // Framework
  import { Atom } from '@vuetify/v0/components'
</script>

<template>
  <Atom as="section" data-interop="host">
    <span data-child>child</span>
  </Atom>
</template>
