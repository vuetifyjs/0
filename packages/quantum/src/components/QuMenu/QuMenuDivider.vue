<script lang="ts">
  // Framework
  import { Menu } from '@vuetify/v0'

  // Context
  import { orphan, useQuMenu } from './QuMenu.vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuMenuDivider' })

  orphan('QuMenuDivider', useQuMenu())
</script>

<!-- A rule between groups of items: 1 dp at 12% ink, the full width of the sheet, 8 dp above and below (styled in QuMenu.vue). -->
<template>
  <Menu.Separator as="hr" class="quantum-menu__divider" />
</template>
