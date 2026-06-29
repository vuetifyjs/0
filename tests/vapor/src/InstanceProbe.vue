<script setup vapor lang="ts">
  // Utilities
  import { instanceExists, instanceName, useId } from '#v0/utilities'
  import { getCurrentInstance } from 'vue'

  // Under real Vapor, getCurrentInstance() returns null by design
  // (vuejs/core v3.6.0-beta.1 release notes).
  const rawNull = getCurrentInstance() === null

  // ...but v0's shim (utilities/instance.ts) reads the `currentInstance`
  // export directly, so it must still detect the active component. This is the
  // exact branch instance.test.ts can only simulate with a mock.
  const shimDetects = instanceExists()
  const shimName = instanceName() ?? '<none>'

  // useId() routes through instanceExists() → Vue's own useId() in component
  // context. Capture whether that survives Vapor (genuine unknown).
  let id = ''
  let idError = ''
  try {
    id = useId()
  } catch (error) {
    idError = (error as Error).message
  }
</script>

<template>
  <div
    :data-id="id"
    :data-id-error="idError"
    :data-raw-null="String(rawNull)"
    :data-shim-detects="String(shimDetects)"
    :data-shim-name="shimName"
  />
</template>
