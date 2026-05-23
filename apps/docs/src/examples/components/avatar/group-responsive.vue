<script setup lang="ts">
  import { Avatar } from '@vuetify/v0'

  const initials = ['AL', 'GH', 'AT', 'LT', 'EL', 'SH', 'BT', 'CW', 'JD', 'KW', 'AP', 'MR', 'PL', 'FN', 'RG', 'OS', 'YM', 'TZ', 'XW', 'CJ', 'DR', 'HB', 'VK', 'NQ', 'EF', 'IU', 'SP', 'MO', 'GA', 'WL']

  const users = initials.map((initial, index) => ({
    id: index + 1,
    initials: initial,
    hue: Math.trunc(index * 360 / initials.length),
  }))
</script>

<template>
  <Avatar.Group
    class="flex items-center overflow-hidden"
    :gap="-8"
    label="Team members"
    responsive
  >
    <Avatar.Root
      v-for="(user, index) in users"
      :key="user.id"
      class="size-8 inline-flex items-center justify-center rounded-full ring-2 ring-surface text-xs font-medium text-on-primary shrink-0"
      :style="{
        backgroundColor: `oklch(0.62 0.14 ${user.hue})`,
        marginInlineStart: index === 0 ? undefined : '-8px',
      }"
      :value="user.id"
    >
      <Avatar.Fallback>{{ user.initials }}</Avatar.Fallback>
    </Avatar.Root>

    <Avatar.Indicator
      v-slot="{ count }"
      class="size-8 inline-flex items-center justify-center rounded-full ring-2 ring-surface text-xs font-medium bg-surface-variant text-on-surface-variant shrink-0"
      :style="{ marginInlineStart: '-8px' }"
    >
      +{{ count }}
    </Avatar.Indicator>
  </Avatar.Group>
</template>
