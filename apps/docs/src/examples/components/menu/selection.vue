<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { Menu } from '@vuetify/v0'

  const bold = shallowRef(false)
  const align = shallowRef('left')
</script>

<template>
  <div class="flex justify-center">
    <Menu.Root>
      <Menu.Activator class="px-4 py-2 bg-primary text-on-primary rounded-md text-sm font-medium">
        Format
      </Menu.Activator>

      <Menu.Content class="min-w-44 rounded-md border border-divider bg-surface p-1 shadow-lg">
        <Menu.CheckboxItem
          v-model:checked="bold"
          class="rounded px-3 py-2 text-sm text-on-surface data-[highlighted]:bg-surface-variant data-[state=checked]:font-medium"
        >
          Bold
        </Menu.CheckboxItem>

        <Menu.Separator class="my-1 h-px bg-divider" />

        <Menu.RadioGroup
          v-model="align"
          label="Alignment"
        >
          <Menu.RadioItem
            class="rounded px-3 py-2 text-sm text-on-surface data-[highlighted]:bg-surface-variant data-[state=checked]:font-medium"
            value="left"
          >
            Left
          </Menu.RadioItem>

          <Menu.RadioItem
            class="rounded px-3 py-2 text-sm text-on-surface data-[highlighted]:bg-surface-variant data-[state=checked]:font-medium"
            value="right"
          >
            Right
          </Menu.RadioItem>
        </Menu.RadioGroup>
      </Menu.Content>
    </Menu.Root>
  </div>
</template>
