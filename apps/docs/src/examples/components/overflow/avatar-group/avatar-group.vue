<script setup lang="ts">
  import { Input, Overflow } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  import { users } from './users'

  const width = shallowRef('70')
</script>

<template>
  <div class="space-y-4">
    <Input.Root v-model="width" type="range">
      <label class="block text-xs font-medium text-on-surface-variant mb-1">
        Container width: {{ width }}%
      </label>

      <Input.Control
        class="w-full accent-primary"
        max="100"
        min="25"
      />
    </Input.Root>

    <Overflow.Root
      class="flex items-center overflow-hidden p-3 transition-all"
      :gap="-8"
      :style="{ width: `${width}%` }"
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
  </div>
</template>
