<script setup lang="ts">
  import { Treeview } from '@vuetify/v0'

  const items = [
    {
      name: 'Fruits',
      children: [
        { name: 'Apple' },
        { name: 'Banana' },
        { name: 'Orange' },
      ],
    },
    {
      name: 'Vegetables',
      children: [
        { name: 'Carrot' },
        { name: 'Broccoli' },
      ],
    },
    { name: 'Bread' },
  ]
</script>

<template>
  <Treeview.Root>
    <Treeview.List class="text-sm text-on-surface">
      <Treeview.Item
        v-for="item in items"
        :key="item.name"
        class="py-0.5"
        :value="item.name"
      >
        <Treeview.Activator
          v-if="item.children"
          class="inline-flex items-center gap-1.5 border-none bg-transparent p-0 cursor-pointer text-on-surface hover:text-primary"
        >
          <Treeview.Cue v-slot="{ attrs }">
            <svg
              v-bind="attrs"
              class="size-3.5 opacity-60 transition-transform data-[state=open]:rotate-90"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            ><path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /></svg>
          </Treeview.Cue>

          {{ item.name }}
        </Treeview.Activator>

        <span v-else class="pl-5">{{ item.name }}</span>

        <Treeview.Content v-if="item.children">
          <Treeview.Group class="pl-5">
            <Treeview.Item
              v-for="child in item.children"
              :key="child.name"
              class="py-0.5"
              :value="child.name"
            >
              {{ child.name }}
            </Treeview.Item>
          </Treeview.Group>
        </Treeview.Content>
      </Treeview.Item>
    </Treeview.List>
  </Treeview.Root>
</template>
