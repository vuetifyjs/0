<script setup lang="ts">
  import { Avatar } from '@vuetify/v0'

  import { members } from './members'

  import type { Member } from './members'

  function tooltipFor (hidden: readonly { value: unknown }[]) {
    return hidden
      .map(ticket => (ticket.value as Member).name)
      .join(', ')
  }
</script>

<template>
  <div class="flex flex-col gap-3 rounded-lg border border-divider bg-surface p-4">
    <div class="flex items-baseline justify-between gap-3">
      <div class="flex flex-col">
        <span class="text-sm font-semibold text-on-surface">Frontend Platform</span>
        <span class="text-xs text-on-surface-variant">{{ members.length }} members</span>
      </div>

      <button
        class="text-xs text-primary hover:underline"
        type="button"
      >
        Manage
      </button>
    </div>

    <Avatar.Group
      class="flex items-center overflow-hidden"
      :gap="-8"
      label="Frontend Platform members"
      responsive
    >
      <Avatar.Root
        v-for="(member, index) in members"
        :key="member.id"
        class="size-8 inline-flex items-center justify-center rounded-full ring-2 ring-surface text-xs font-medium text-on-primary shrink-0"
        :style="{
          backgroundColor: `oklch(0.62 0.14 ${member.hue})`,
          marginInlineStart: index === 0 ? undefined : '-8px',
        }"
        :title="`${member.name} — ${member.role}`"
        :value="member"
      >
        <Avatar.Fallback>{{ member.initials }}</Avatar.Fallback>
      </Avatar.Root>

      <Avatar.Indicator
        v-slot="{ count, hidden, attrs }"
        renderless
      >
        <span
          v-bind="attrs"
          class="size-8 inline-flex items-center justify-center rounded-full ring-2 ring-surface text-xs font-medium bg-surface-variant text-on-surface-variant shrink-0"
          :style="{ marginInlineStart: '-8px' }"
          :title="tooltipFor(hidden)"
        >
          +{{ count }}
        </span>
      </Avatar.Indicator>
    </Avatar.Group>
  </div>
</template>
