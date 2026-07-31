<script setup lang="ts">
  import { Button, Overflow, Popover } from '@vuetify/v0'
  import type { OverflowTicket } from '@vuetify/v0'
  import type { ToolbarAction } from './useToolbarItems'

  const { actions, run } = defineProps<{
    actions: ToolbarAction[]
    run: (action: ToolbarAction) => void
  }>()

  function resolve (hidden: OverflowTicket[]) {
    return hidden
      .map(ticket => actions.find(action => action.id === ticket.value))
      .filter((action): action is ToolbarAction => !!action)
  }
</script>

<template>
  <Overflow.Root
    class="flex items-center gap-1 overflow-hidden rounded-lg border border-divider bg-surface p-1.5"
    :gap="4"
  >
    <Overflow.Item
      v-for="action in actions"
      :key="action.id"
      as="button"
      class="shrink-0 whitespace-nowrap rounded-md px-3 py-1.5 text-sm text-on-surface hover:bg-surface-variant"
      type="button"
      :value="action.id"
      @click="run(action)"
    >
      {{ action.label }}
    </Overflow.Item>

    <Overflow.Indicator v-slot="{ count, hidden }">
      <Popover.Root v-slot="{ toggle }">
        <Popover.Activator
          as="button"
          class="shrink-0 whitespace-nowrap rounded-md bg-primary/10 px-3 py-1.5 text-sm text-primary hover:bg-primary/20"
          type="button"
        >
          +{{ count }} more
        </Popover.Activator>

        <Popover.Content class="rounded-lg border border-divider bg-surface p-1 shadow-lg min-w-40">
          <div class="flex flex-col gap-0.5">
            <Button.Root
              v-for="action in resolve(hidden)"
              :key="action.id"
              as="button"
              class="whitespace-nowrap rounded-md px-3 py-1.5 text-left text-sm text-on-surface hover:bg-surface-variant"
              type="button"
              @click="run(action); toggle()"
            >
              {{ action.label }}
            </Button.Root>
          </div>
        </Popover.Content>
      </Popover.Root>
    </Overflow.Indicator>
  </Overflow.Root>
</template>
