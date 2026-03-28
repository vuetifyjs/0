<script setup lang="ts">
  import { HxInput, HxSwitch } from '@paper/helix'

  // Utilities
  import { ref, watch } from 'vue'

  // Types
  import type { DSProp } from '@paper/helix'

  const { props: propDefs = [] } = defineProps<{
    props?: DSProp[]
  }>()

  const emit = defineEmits<{
    'update:values': [values: Record<string, unknown>]
  }>()

  const values = ref<Record<string, unknown>>(
    Object.fromEntries(propDefs.map(p => [p.name, parseDefault(p)])),
  )

  function parseDefault (prop: DSProp): unknown {
    if (prop.type === 'boolean') return prop.default === 'true'
    if (prop.type === 'number') return Number(prop.default ?? 0)
    return prop.default ?? ''
  }

  function update (name: string, value: unknown) {
    values.value = { ...values.value, [name]: value }
  }

  watch(values, v => emit('update:values', v), { immediate: true })
</script>

<template>
  <div class="flex flex-col gap-3 p-3">
    <div
      v-for="prop in propDefs"
      :key="prop.name"
      class="flex flex-col gap-1"
    >
      <label class="text-xs text-on-surface-variant font-medium font-mono">{{ prop.name }}</label>

      <!-- enum: row of toggle buttons -->
      <div v-if="prop.type === 'enum'" class="flex flex-wrap gap-1">
        <button
          v-for="option in prop.options"
          :key="option"
          class="px-2 py-0.5 text-xs rounded border cursor-pointer transition-colors"
          :class="values[prop.name] === option
            ? 'bg-primary text-on-primary border-primary'
            : 'bg-transparent text-on-surface border-divider hover:border-primary'"
          @click="update(prop.name, option)"
        >
          {{ option }}
        </button>
      </div>

      <!-- boolean: switch -->
      <HxSwitch
        v-else-if="prop.type === 'boolean'"
        :model-value="values[prop.name] as boolean"
        small
        @update:model-value="update(prop.name, $event)"
      />

      <!-- number -->
      <HxInput
        v-else-if="prop.type === 'number'"
        :model-value="String(values[prop.name] ?? '')"
        type="number"
        @update:model-value="update(prop.name, Number($event))"
      />

      <!-- string (default) -->
      <HxInput
        v-else
        :model-value="String(values[prop.name] ?? '')"
        @update:model-value="update(prop.name, $event)"
      />
    </div>
  </div>
</template>
