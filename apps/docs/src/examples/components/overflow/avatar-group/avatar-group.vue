<script setup lang="ts">
  import { Overflow } from '@vuetify/v0'

  import { users } from './users'
</script>

<template>
  <Overflow.Root
    class="flex items-center overflow-hidden p-3"
    :gap="-8"
  >
    <Overflow.Item
      v-for="user in users"
      :key="user.id"
      as="span"
      class="size-8 inline-flex items-center justify-center rounded-full ring-2 ring-surface text-xs font-medium text-on-primary shrink-0"
      :style="{
        backgroundColor: `oklch(0.62 0.14 ${user.hue})`,
        marginInlineStart: '-8px',
      }"
      :title="user.name"
      :value="user.id"
    >
      {{ user.initials }}
    </Overflow.Item>

    <Overflow.Indicator
      v-slot="{ count }"
      as="span"
      class="size-8 inline-flex items-center justify-center rounded-full ring-2 ring-surface text-xs font-medium bg-surface-variant text-on-surface-variant shrink-0"
      :style="{ marginInlineStart: '-8px' }"
    >
      +{{ count }}
    </Overflow.Indicator>
  </Overflow.Root>
</template>
