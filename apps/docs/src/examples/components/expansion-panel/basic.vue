<script lang="ts" setup>
  import { ExpansionPanel } from '@vuetify/v0'
  import { ref } from 'vue'

  const expanded = ref(['panel-1'])

  const panels = [
    { id: 'panel-1', title: 'Panel 1', content: 'This is the content for panel 1.' },
    { id: 'panel-2', title: 'Panel 2', content: 'This is the content for panel 2.' },
    { id: 'panel-3', title: 'Panel 3', content: 'This is the content for panel 3.' },
  ]

  function isLast (index: number) {
    return index === panels.length - 1
  }
</script>

<template>
  <ExpansionPanel.Root v-model="expanded" multiple>
    <div class="border border-gray-300 rounded-lg overflow-hidden">
      <ExpansionPanel.Item
        v-for="(item, index) in panels"
        :key="item.id"
        :title="item.title"
        :value="item.id"
      >
        <template #header="{ toggle, isSelected, ariaExpanded, ariaControls, tabindex }">
          <button
            :aria-controls="ariaControls"
            :aria-expanded="ariaExpanded"
            class="w-full px-6 py-2 bg-white border-none border-b border-gray-300 flex items-center gap-3 cursor-pointer transition-all text-base text-left"
            :class="isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'"
            :tabindex="tabindex"
            @click="toggle"
          >
            <span class="inline-flex items-center justify-center w-5 text-sm text-gray-600 transition-transform">
              {{ isSelected ? '−' : '+' }}
            </span>
            <span class="flex-1 font-medium text-gray-900">{{ item.title }}</span>
          </button>
        </template>

        <template #content="{ isSelected, ariaLabelledby, id }">
          <div
            v-show="isSelected"
            :id="id"
            :aria-labelledby="ariaLabelledby"
            class="px-6 py-6 bg-white"
            :class="{ 'border-b border-gray-300': !isLast(index) }"
            role="region"
          >
            <p class="m-0 text-gray-800 leading-relaxed">
              {{ item.content }}
            </p>
          </div>
        </template>
      </ExpansionPanel.Item>
    </div>
  </ExpansionPanel.Root>

  <p class="mt-4 text-sm text-gray-600">
    Expanded: {{ expanded.join(', ') }}
  </p>
</template>
