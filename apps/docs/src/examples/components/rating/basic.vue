<script setup lang="ts">
  import { Rating } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const rating = shallowRef(0)
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <Rating.Root v-slot="{ attrs }" v-model="rating" class="flex gap-1 focus:outline-none">
      <div v-bind="attrs" class="flex gap-0.5">
        <Rating.Item
          v-for="i in 5"
          :key="i"
          as="button"
          class="size-8 text-xl cursor-pointer focus:outline-none [&[data-state=full]]:text-amber-500 [&[data-state=empty]]:text-on-surface-variant/40"
          :index="i"
        >
          <template #default="{ state }">
            {{ state === 'full' ? '★' : '☆' }}
          </template>
        </Rating.Item>
      </div>
    </Rating.Root>

    <p class="text-sm text-on-surface-variant">
      Rating: {{ rating }}
    </p>
  </div>
</template>
