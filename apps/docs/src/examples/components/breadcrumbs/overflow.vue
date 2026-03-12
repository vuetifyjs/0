<script setup lang="ts">
  import { ref, toRef } from 'vue'
  import { Breadcrumbs, Slider } from '@vuetify/v0'

  const model = ref([332])
  const width = toRef(() => model.value[0])

  const items = [
    { text: 'Home', href: '/' },
    { text: 'Documents', href: '/documents' },
    { text: 'Projects', href: '/documents/projects' },
    { text: 'Vuetify', href: '/documents/projects/vuetify' },
    { text: 'Components', href: '/documents/projects/vuetify/components' },
    { text: 'Breadcrumbs' },
  ]
</script>

<template>
  <div>
    <label class="flex items-center gap-3 mb-4 text-sm">
      <span class="text-on-surface-variant shrink-0">Container width:</span>

      <Slider.Root v-model="model" class="relative flex grow items-center h-5" :max="600" :min="200">
        <Slider.Track class="relative h-1 w-full rounded-full bg-surface-variant">
          <Slider.Range class="absolute h-full rounded-full bg-primary" />
        </Slider.Track>

        <Slider.Thumb class="absolute size-5 rounded-full bg-primary -translate-x-1/2 focus:outline-2 focus:outline-primary" />
      </Slider.Root>

      <span class="text-on-surface font-mono w-12 text-right">{{ width }}px</span>
    </label>

    <div
      class="border border-divider border-dashed rounded-lg p-4 overflow-hidden"
      :style="{ width: `${width}px` }"
    >
      <Breadcrumbs.Root>
        <Breadcrumbs.List class="flex items-center gap-2 list-none text-sm">
          <template v-for="(item, index) in items" :key="item.text">
            <Breadcrumbs.Divider
              v-if="index > 0"
              class="text-on-surface-variant shrink-0 flex items-center"
            >
              <svg class="size-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
              </svg>
            </Breadcrumbs.Divider>

            <Breadcrumbs.Ellipsis
              v-if="index === 1"
              class="text-on-surface-variant shrink-0"
            />

            <Breadcrumbs.Item class="shrink-0" :text="item.text">
              <Breadcrumbs.Page
                v-if="!item.href"
                class="text-on-surface-variant whitespace-nowrap"
              >
                {{ item.text }}
              </Breadcrumbs.Page>

              <Breadcrumbs.Link
                v-else
                class="text-primary hover:underline whitespace-nowrap"
                :href="item.href"
              >
                {{ item.text }}
              </Breadcrumbs.Link>
            </Breadcrumbs.Item>
          </template>
        </Breadcrumbs.List>
      </Breadcrumbs.Root>
    </div>
  </div>
</template>
