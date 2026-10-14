<script setup lang="ts">
  import { Menu } from '@vuetify/v0'
  import { menus } from './menus'

  const activator = 'rounded px-3 py-1.5 text-sm text-on-surface data-[highlighted]:bg-surface-variant data-[state=open]:bg-surface-variant'
  const item = 'rounded px-3 py-2 text-sm text-on-surface data-[highlighted]:bg-surface-variant'
</script>

<template>
  <Menu.Root v-slot="{ layer }">
    <Menu.Bar class="flex w-fit gap-1 rounded-md border border-divider bg-surface p-1">
      <Menu.Activator
        v-for="menu in menus"
        :key="menu.id"
        :class="activator"
        :value="menu.id"
      >
        {{ menu.label }}
      </Menu.Activator>
    </Menu.Bar>

    <Menu.Content
      v-for="menu in menus"
      :key="menu.id"
      class="min-w-40 rounded-md border border-divider bg-surface p-1 shadow-lg"
      :value="menu.id"
    >
      <Menu.Item
        v-for="label in menu.items"
        :key="label"
        :class="item"
      >
        {{ label }}
      </Menu.Item>
    </Menu.Content>

    <p class="mt-3 text-sm text-on-surface-variant">
      <template v-if="layer">Showing {{ menus.find(menu => menu.id === layer)?.label }}</template>
      <template v-else>Showing nothing</template>
    </p>
  </Menu.Root>
</template>
