<script setup lang="ts">
  import { ExpansionPanel } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  const model = shallowRef<string>()

  const panels = Array.from({ length: 3 }, (_, i) => ({
    id: `panel-${i + 1}`,
    title: `Panel ${i + 1}`,
    rows: Array.from({ length: 5 }, (_, j) => ({
      id: j + 1,
      name: `Item ${j + 1 + i * 5}`,
      sku: `SKU-${String(j + 1 + i * 5).padStart(5, '0')}`,
      price: ((j + 1 + i * 5) * 12.99).toFixed(2),
    })),
  }))
</script>

<template>
  <ExpansionPanel.Group
    v-model="model"
    class="border border-divider rounded-lg border-solid overflow-hidden divide-y divide-divider"
  >
    <ExpansionPanel.Root
      v-for="panel in panels"
      :key="panel.id"
      :value="panel.id"
    >
      <ExpansionPanel.Activator
        class="w-full px-4 py-3 border-none flex items-center gap-3 text-left cursor-pointer bg-surface hover:bg-surface-tint"
      >
        <ExpansionPanel.Cue
          class="inline-flex items-center justify-center w-5 text-on-surface opacity-60 transition-transform duration-200 ease-in-out data-[state=open]:rotate-90 data-[state=open]:text-primary"
        >
          <i aria-hidden="true" class="inline-flex items-center justify-center">
            <svg
              aria-hidden="true"
              class="inline-block align-middle"
              fill="none"
              height="14"
              viewBox="0 0 24 24"
              width="14"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" fill="currentColor" />
            </svg>
          </i>
        </ExpansionPanel.Cue>

        <span class="font-medium text-on-surface">{{ panel.title }}</span>
      </ExpansionPanel.Activator>

      <ExpansionPanel.Content v-slot="{ isSelected, attrs }" renderless>
        <Transition name="expand">
          <div v-if="isSelected" v-bind="attrs">
            <div class="p-4">
              <table class="w-full text-sm border-collapse">
                <thead>
                  <tr class="border-b border-divider">
                    <th class="text-left p-2 font-semibold text-on-surface">ID</th>
                    <th class="text-left p-2 font-semibold text-on-surface">Name</th>
                    <th class="text-left p-2 font-semibold text-on-surface">SKU</th>
                    <th class="text-left p-2 font-semibold text-on-surface">Price</th>
                  </tr>
                </thead>

                <tbody>
                  <tr
                    v-for="row in panel.rows"
                    :key="row.id"
                    class="border-b border-divider hover:bg-surface-tint"
                  >
                    <td class="p-2 text-on-surface">{{ row.id }}</td>
                    <td class="p-2 text-on-surface">{{ row.name }}</td>
                    <td class="p-2 text-on-surface">{{ row.sku }}</td>
                    <td class="p-2 text-on-surface">${{ row.price }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </Transition>
      </ExpansionPanel.Content>
    </ExpansionPanel.Root>
  </ExpansionPanel.Group>
</template>

<style scoped>
  .expand-enter-active,
  .expand-leave-active {
    interpolate-size: allow-keywords;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }

  .expand-enter-from,
  .expand-leave-to {
    max-height: 0;
  }

  .expand-enter-to,
  .expand-leave-from {
    max-height: max-content;
  }
</style>
