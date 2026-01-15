<script lang="ts">
  export interface MyAccordionProps {
    modelValue?: string[]
    items: Array<{ value: string, title: string }>
    multiple?: boolean
  }
</script>

<script setup lang="ts">
  import { ExpansionPanel } from '@vuetify/v0'

  const {
    items,
    multiple = false,
  } = defineProps<MyAccordionProps>()

  const model = defineModel<string[]>({ default: () => [] })
</script>

<template>
  <ExpansionPanel.Root v-model="model" class="my-accordion" :multiple="multiple">
    <ExpansionPanel.Item
      v-for="item in items"
      :key="item.value"
      v-slot="{ isSelected }"
      class="my-accordion__item"
      :value="item.value"
    >
      <ExpansionPanel.Header class="my-accordion__header">
        <ExpansionPanel.Activator class="my-accordion__trigger">
          <span class="my-accordion__title">{{ item.title }}</span>
          <svg
            class="my-accordion__icon"
            :class="{ 'my-accordion__icon--open': isSelected }"
            fill="none"
            height="16"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            viewBox="0 0 24 24"
            width="16"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </ExpansionPanel.Activator>
      </ExpansionPanel.Header>

      <ExpansionPanel.Content class="my-accordion__content">
        <slot :name="item.value" />
      </ExpansionPanel.Content>
    </ExpansionPanel.Item>
  </ExpansionPanel.Root>
</template>

<style>
.my-accordion {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.my-accordion__item {
  border: 1px solid var(--v0-divider);
  border-radius: 0.5rem;
  overflow: hidden;
  transition: border-color 150ms;
}

.my-accordion__item[data-selected] {
  border-color: var(--v0-primary);
}

.my-accordion__header {
  background: var(--v0-surface);
}

.my-accordion__trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  font-size: 0.875rem;
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: background 150ms;
}

.my-accordion__trigger:hover {
  background: var(--v0-surface-variant);
}

.my-accordion__trigger:focus-visible {
  outline: 2px solid var(--v0-primary);
  outline-offset: -2px;
}

.my-accordion__title {
  font-weight: 600;
  color: var(--v0-on-surface);
}

.my-accordion__icon {
  color: var(--v0-on-surface-variant);
  transition: transform 200ms;
}

.my-accordion__icon--open {
  transform: rotate(180deg);
}

.my-accordion__content {
  padding: 0 1rem 1rem;
  font-size: 0.875rem;
  color: var(--v0-on-surface-variant);
  line-height: 1.6;
}
</style>
