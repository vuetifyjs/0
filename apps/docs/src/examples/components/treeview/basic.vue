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
  <Treeview.Root multiple>
    <Treeview.List class="text-sm text-on-surface select-none">
      <Treeview.Item
        v-for="item in items"
        :key="item.name"
        class="py-0.5"
        :value="item.name"
      >
        <div class="inline-flex items-center gap-1.5">
          <Treeview.Activator
            v-if="item.children"
            class="inline-flex items-center border-none bg-transparent p-0 cursor-pointer text-on-surface hover:text-primary"
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
          </Treeview.Activator>

          <span v-else class="inline-block w-3.5" />

          <Treeview.Checkbox v-slot="{ attrs, isSelected, isMixed }" renderless>
            <span
              v-bind="attrs"
              class="size-4 inline-flex items-center justify-center border rounded-sm text-xs leading-none cursor-pointer shrink-0"
              :class="isSelected || isMixed ? 'bg-primary text-on-primary border-primary' : 'border-on-surface/40'"
            >{{ isMixed ? '−' : isSelected ? '✓' : '\u00A0' }}</span>
          </Treeview.Checkbox>

          <span>{{ item.name }}</span>
        </div>

        <Treeview.Content v-if="item.children">
          <Treeview.Group class="pl-5">
            <Treeview.Item
              v-for="child in item.children"
              :key="child.name"
              class="py-0.5"
              :value="child.name"
            >
              <div class="inline-flex items-center gap-1.5">
                <span class="inline-block w-3.5" />

                <Treeview.Checkbox v-slot="{ attrs, isSelected }" renderless>
                  <span
                    v-bind="attrs"
                    class="size-4 inline-flex items-center justify-center border rounded-sm text-xs leading-none cursor-pointer shrink-0"
                    :class="isSelected ? 'bg-primary text-on-primary border-primary' : 'border-on-surface/40'"
                  >{{ isSelected ? '✓' : '\u00A0' }}</span>
                </Treeview.Checkbox>

                <span>{{ child.name }}</span>
              </div>
            </Treeview.Item>
          </Treeview.Group>
        </Treeview.Content>
      </Treeview.Item>
    </Treeview.List>
  </Treeview.Root>
</template>
