<script setup lang="ts">
  import { Rating } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const rating = shallowRef(2.5)
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <Rating.Root v-slot="{ attrs }" v-model="rating" class="flex gap-1 focus:outline-none" half>
      <div v-bind="attrs" class="flex gap-0.5">
        <Rating.Item
          v-for="i in 5"
          :key="i"
          as="button"
          class="relative size-8 text-xl cursor-pointer focus:outline-none"
          :index="i"
        >
          <template #default="{ state }">
            <span v-if="state === 'half'" class="relative inline-flex">
              <span class="text-on-surface-variant/40">☆</span>
              <span class="absolute inset-0 overflow-hidden w-1/2 text-amber-500">★</span>
            </span>
            <span v-else :class="state === 'full' ? 'text-amber-500' : 'text-on-surface-variant/40'">
              {{ state === 'full' ? '★' : '☆' }}
            </span>
          </template>
        </Rating.Item>
      </div>
    </Rating.Root>

    <p class="text-sm text-on-surface-variant">
      Rating: {{ rating }}
    </p>
  </div>
</template>
