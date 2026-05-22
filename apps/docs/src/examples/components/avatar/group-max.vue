<script setup lang="ts">
  import { Avatar } from '@vuetify/v0'

  const users = [
    { id: 1, initials: 'AL', hue: 0 },
    { id: 2, initials: 'GH', hue: 60 },
    { id: 3, initials: 'AT', hue: 120 },
    { id: 4, initials: 'LT', hue: 200 },
    { id: 5, initials: 'EL', hue: 280 },
    { id: 6, initials: 'SH', hue: 340 },
  ]
</script>

<template>
  <Avatar.Group
    class="flex items-center"
    label="Team members"
    :max="4"
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
