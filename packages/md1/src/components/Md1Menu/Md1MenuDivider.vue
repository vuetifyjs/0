<script lang="ts">
  // Framework
  import { Menu } from '@vuetify/v0'

  // Context
  import { orphan, useMd1Menu } from './Md1Menu.vue'
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1MenuDivider' })

  orphan('Md1MenuDivider', useMd1Menu())
</script>

<!-- A rule between groups of items: 1 dp at 12% ink, the full width of the sheet, 8 dp above and below (styled in Md1Menu.vue). -->
<template>
  <Menu.Separator as="hr" class="md1-menu__divider" />
</template>
