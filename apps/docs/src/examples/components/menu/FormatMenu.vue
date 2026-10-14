<script setup lang="ts">
  import { Menu } from '@vuetify/v0'

  const bold = defineModel<boolean>('bold', { required: true })
  const align = defineModel<string>('align', { required: true })

  const row = 'group flex items-center gap-2 rounded px-3 py-2 text-sm text-on-surface data-[highlighted]:bg-surface-variant'
  const box = 'inline-flex size-4 shrink-0 items-center justify-center rounded border border-divider text-on-primary group-data-[state=checked]:border-primary group-data-[state=checked]:bg-primary'
  const radio = 'inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-divider group-data-[state=checked]:border-primary'
</script>

<template>
  <Menu.Root>
    <Menu.Activator class="rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary">
      Format
    </Menu.Activator>

    <Menu.Content class="min-w-44 rounded-md border border-divider bg-surface p-1 shadow-lg">
      <Menu.CheckboxItem v-model:checked="bold" :class="row">
        <span aria-hidden="true" :class="box">
          <svg
            class="size-3 opacity-0 group-data-[state=checked]:opacity-100"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            viewBox="0 0 24 24"
          >
            <path d="m5 13 4 4L19 7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        Bold
      </Menu.CheckboxItem>

      <Menu.Separator class="my-1 h-px bg-divider" />

      <Menu.RadioGroup v-model="align" label="Alignment">
        <Menu.RadioItem :class="row" value="left">
          <span aria-hidden="true" :class="radio">
            <span class="size-2 rounded-full bg-primary opacity-0 group-data-[state=checked]:opacity-100" />
          </span>
          Left
        </Menu.RadioItem>

        <Menu.RadioItem :class="row" value="right">
          <span aria-hidden="true" :class="radio">
            <span class="size-2 rounded-full bg-primary opacity-0 group-data-[state=checked]:opacity-100" />
          </span>
          Right
        </Menu.RadioItem>
      </Menu.RadioGroup>
    </Menu.Content>
  </Menu.Root>
</template>
