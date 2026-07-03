<script setup lang="ts">
  import { createPermissionsContext } from '@vuetify/v0'
  import { NAMESPACE, permissions } from './context'

  const [, providePermissions] = createPermissionsContext({
    namespace: NAMESPACE,
    permissions,
  })

  providePermissions()
</script>

<template>
  <slot />
</template>
