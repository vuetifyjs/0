<script setup lang="ts">
  import { Atom, type AtomProps } from '@vuetify/v0'
  import { toRef } from 'vue'

  const {
    as = 'article',
    renderless,
    title,
    description,
    image,
    href,
  } = defineProps<AtomProps & {
    title: string
    description: string
    image: string
    href?: string
  }>()

  const element = toRef(() => href ? 'a' : as)
</script>

<template>
  <Atom
    :as="element"
    class="block rounded-lg border overflow-hidden max-w-xs no-underline text-inherit hover:border-primary transition-colors"
    :href
    :renderless
  >
    <Atom :alt="title" as="img" class="w-full h-40 object-cover" :src="image" />

    <div class="p-4 space-y-2">
      <h3 class="text-lg font-semibold">{{ title }}</h3>
      <p class="text-sm text-secondary">{{ description }}</p>

      <slot>
        <button v-if="!href" class="px-3 py-1.5 bg-primary text-on-primary rounded text-sm cursor-pointer">
          Read more
        </button>
      </slot>
    </div>
  </Atom>
</template>
