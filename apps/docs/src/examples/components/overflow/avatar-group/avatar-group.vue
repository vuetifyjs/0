<script setup lang="ts">
  import { Overflow } from '@vuetify/v0'

  import { users } from './users'
</script>

<template>
  <div class="space-y-2">
    <p class="text-xs font-medium text-on-surface-variant">
      {{ users.length }} contributors
    </p>

    <Overflow.Root
      aria-label="Project contributors"
      as="ul"
      class="flex items-center overflow-hidden p-1 pl-0 list-none"
    >
      <Overflow.Item
        v-for="user in users"
        :key="user.id"
        as="li"
        class="size-8 inline-flex items-center justify-center rounded-full ring-2 ring-surface text-xs font-medium text-on-primary shrink-0"
        :style="{
          backgroundColor: `oklch(0.62 0.14 ${user.hue})`,
          marginInlineStart: '-8px',
        }"
        :title="user.name"
        :value="user.id"
      >
        <span aria-hidden="true">{{ user.initials }}</span>
        <span class="sr-only">{{ user.name }}</span>
      </Overflow.Item>

      <Overflow.Indicator
        v-slot="{ count }"
        :aria-label="`${count} more contributors`"
        as="li"
        class="size-8 inline-flex items-center justify-center rounded-full ring-2 ring-surface text-xs font-medium bg-surface-variant text-on-surface-variant shrink-0"
        :style="{ marginInlineStart: '-8px' }"
      >
        +{{ count }}
      </Overflow.Indicator>
    </Overflow.Root>
  </div>
</template>
