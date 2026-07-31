<script setup lang="ts">
  import { Button, Popover } from '@vuetify/v0'
  import { toRef, useTemplateRef } from 'vue'

  import NavItem from './NavItem.vue'
  import { useOverflowNav } from './useOverflowNav'

  const container = useTemplateRef<HTMLElement>('container')
  const nav = useOverflowNav(container)

  const shown = toRef(() => Math.min(nav.overflow.capacity.value, nav.items.length))
</script>

<template>
  <div class="space-y-3">
    <nav class="rounded-lg border border-divider bg-surface p-1.5">
      <ul
        ref="container"
        class="flex items-center gap-2 overflow-hidden"
      >
        <NavItem
          v-for="(item, index) in nav.items"
          :key="item.id"
          :index
          :item
          :nav
        />

        <li
          v-if="nav.overflow.isOverflowing.value"
          class="ml-auto shrink-0"
        >
          <Popover.Root v-slot="{ toggle }">
            <Popover.Activator
              as="button"
              class="whitespace-nowrap rounded-md bg-primary/10 px-3 py-1.5 text-sm text-primary transition-colors hover:bg-primary/20"
              type="button"
            >
              +{{ nav.hidden.value.length }} more
            </Popover.Activator>

            <Popover.Content class="flex min-w-40 flex-col gap-0.5 rounded-lg border border-divider bg-surface p-1 shadow-lg">
              <Button.Root
                v-for="item in nav.hidden.value"
                :key="item.id"
                class="whitespace-nowrap rounded-md px-3 py-1.5 text-left text-sm text-on-surface transition-colors hover:bg-surface-variant"
                @click="nav.select(item.id); toggle()"
              >
                {{ item.label }}
              </Button.Root>
            </Popover.Content>
          </Popover.Root>
        </li>
      </ul>
    </nav>

    <dl class="grid grid-cols-3 gap-2 text-xs">
      <div class="rounded-md bg-surface-variant/40 px-3 py-2">
        <dt class="text-on-surface-variant">Visible</dt>
        <dd class="font-medium text-on-surface tabular-nums">{{ shown }} / {{ nav.items.length }}</dd>
      </div>

      <div class="rounded-md bg-surface-variant/40 px-3 py-2">
        <dt class="text-on-surface-variant">Overflowing</dt>

        <dd
          class="font-medium"
          :class="nav.overflow.isOverflowing.value ? 'text-warning' : 'text-success'"
        >
          {{ nav.overflow.isOverflowing.value }}
        </dd>
      </div>

      <div class="rounded-md bg-surface-variant/40 px-3 py-2">
        <dt class="text-on-surface-variant">Container</dt>
        <dd class="font-medium text-on-surface tabular-nums">{{ Math.round(nav.overflow.width.value) }}px</dd>
      </div>
    </dl>
  </div>
</template>
