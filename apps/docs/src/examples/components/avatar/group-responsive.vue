<script setup lang="ts">
  import { Avatar } from '@vuetify/v0'

  const users = [
    { id: 1, initials: 'AL', hue: 0 },
    { id: 2, initials: 'GH', hue: 45 },
    { id: 3, initials: 'AT', hue: 90 },
    { id: 4, initials: 'LT', hue: 135 },
    { id: 5, initials: 'EL', hue: 180 },
    { id: 6, initials: 'SH', hue: 225 },
    { id: 7, initials: 'BT', hue: 270 },
    { id: 8, initials: 'CW', hue: 315 },
  ]
</script>

<template>
  <Avatar.Group
    class="flex items-center overflow-hidden"
    :gap="-8"
    label="Team members"
    responsive
  >
    <Avatar.Root
      v-for="user in users"
      :key="user.id"
      class="size-8 inline-flex items-center justify-center rounded-full ring-2 ring-surface text-xs font-medium text-on-primary shrink-0"
      :style="{
        backgroundColor: `oklch(0.62 0.14 ${user.hue})`,
        marginInlineStart: '-8px',
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
