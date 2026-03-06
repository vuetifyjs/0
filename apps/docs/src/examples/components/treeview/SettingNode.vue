<script setup lang="ts">
  import { Treeview } from '@vuetify/v0'

  interface Setting {
    label: string
    description?: string
    type?: 'toggle' | 'select'
    options?: string[]
    value?: boolean | string
    disabled?: boolean
    children?: Setting[]
  }

  const { node } = defineProps<{
    node: Setting
  }>()

  const emit = defineEmits<{
    activate: [setting: Setting]
    update: [setting: Setting, value: boolean | string]
  }>()

  function onToggle (setting: Setting) {
    emit('update', setting, !setting.value)
  }

  function onSelect (setting: Setting, event: Event) {
    emit('update', setting, (event.target as HTMLSelectElement).value)
  }
</script>

<template>
  <!-- Category with children -->
  <Treeview.Item v-if="node.children" v-slot="{ isOpen }" :disabled="node.disabled" :value="node.label">
    <Treeview.Activator class="row flex items-center gap-2 w-full border-none bg-transparent text-inherit cursor-pointer rounded py-1.5 pr-3 hover:bg-surface-tint">
      <svg
        class="size-3.5 shrink-0 opacity-50 transition-transform duration-150"
        :class="isOpen && 'rotate-90'"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      ><path d="M9 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" /></svg>

      <span class="font-medium text-sm">{{ node.label }}</span>
    </Treeview.Activator>

    <Treeview.Content>
      <Treeview.Group>
        <SettingNode
          v-for="child in node.children"
          :key="child.label"
          :node="child"
          @activate="emit('activate', $event)"
          @update="(setting, value) => emit('update', setting, value)"
        />
      </Treeview.Group>
    </Treeview.Content>
  </Treeview.Item>

  <!-- Leaf setting -->
  <Treeview.Item v-else v-slot="{ activate }" :value="node.label">
    <button
      class="row flex items-center gap-2 w-full border-none bg-transparent text-inherit cursor-pointer rounded py-1.5 pr-3 hover:bg-surface-tint"
      @click="() => { activate(); emit('activate', node) }"
    >
      <span class="text-sm flex-1 text-left">{{ node.label }}</span>

      <!-- Toggle -->
      <span
        v-if="node.type === 'toggle'"
        :aria-checked="!!node.value"
        class="relative inline-flex items-center w-8 h-4.5 rounded-full shrink-0 transition-colors duration-150"
        :class="node.value ? 'bg-primary' : 'bg-surface-variant'"
        role="switch"
        @click.stop="onToggle(node)"
      >
        <span
          class="absolute size-3.5 rounded-full bg-white shadow-sm transition-transform duration-150"
          :class="node.value ? 'translate-x-3.75' : 'translate-x-0.5'"
        />
      </span>

      <!-- Select -->
      <select
        v-else-if="node.type === 'select'"
        class="bg-transparent border border-divider rounded px-1.5 py-0.5 text-xs text-on-surface cursor-pointer"
        :value="node.value"
        @change="onSelect(node, $event)"
        @click.stop
      >
        <option v-for="opt in node.options" :key="opt" class="bg-surface text-on-surface" :value="opt">{{ opt }}</option>
      </select>
    </button>
  </Treeview.Item>
</template>
