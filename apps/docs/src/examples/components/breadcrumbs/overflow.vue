<script setup lang="ts">
  import { Breadcrumbs } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const width = shallowRef(300)

  const items = [
    { text: 'Home', href: '#' },
    { text: 'Documents', href: '#' },
    { text: 'Projects', href: '#' },
    { text: 'Vuetify', href: '#' },
    { text: 'Components', href: '#' },
    { text: 'Breadcrumbs' },
  ]
</script>

<template>
  <div>
    <label class="flex items-center gap-3 mb-4 text-sm">
      <span class="text-on-surface-variant shrink-0">Container width:</span>

      <input
        v-model.number="width"
        class="grow"
        max="600"
        min="100"
        type="range"
      >

      <span class="text-on-surface font-mono w-12 text-right">{{ width }}px</span>
    </label>

    <div
      class="border border-divider rounded-lg p-4 overflow-hidden"
      :style="{ width: `${width}px` }"
    >
      <Breadcrumbs.Root v-slot="{ isOverflowing, capacity, total }" divider="/">
        <Breadcrumbs.List class="flex items-center gap-2 list-none m-0 p-0 text-sm">
          <template v-for="(item, index) in items" :key="item.text">
            <Breadcrumbs.Divider
              v-if="index > 0"
              class="text-on-surface-variant list-none shrink-0 flex items-center m-0"
            />

            <Breadcrumbs.Ellipsis
              v-if="index === 1"
              class="text-on-surface-variant list-none shrink-0 flex items-center m-0"
            />

            <Breadcrumbs.Item class="list-none shrink-0 m-0" :text="item.text">
              <Breadcrumbs.Link
                v-if="item.href"
                class="text-primary hover:underline whitespace-nowrap"
                :href="item.href"
              >
                {{ item.text }}
              </Breadcrumbs.Link>

              <Breadcrumbs.Page
                v-else
                class="text-on-surface-variant whitespace-nowrap"
              >
                {{ item.text }}
              </Breadcrumbs.Page>
            </Breadcrumbs.Item>
          </template>
        </Breadcrumbs.List>

        <p class="mt-3 text-xs font-medium" :class="isOverflowing ? 'text-warning' : 'text-success'">
          {{ isOverflowing ? `${total - capacity} of ${total} hidden` : `All ${total} visible` }}
        </p>
      </Breadcrumbs.Root>
    </div>
  </div>
</template>
