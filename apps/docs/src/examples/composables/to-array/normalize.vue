<script setup lang="ts">
  import { toArray } from '@vuetify/v0'
  import { ref, shallowRef, toRef } from 'vue'

  type InputType = 'string' | 'number' | 'array' | 'null' | 'undefined'

  const inputType = shallowRef<InputType>('string')
  const text = shallowRef('hello')
  const number = shallowRef(42)
  const items = ref(['a', 'b', 'c'])

  const inputs: Record<InputType, { label: string, value: () => unknown }> = {
    string: { label: 'String', value: () => text.value },
    number: { label: 'Number', value: () => number.value },
    array: { label: 'Array', value: () => items.value },
    null: { label: 'null', value: () => null },
    undefined: { label: 'undefined', value: () => undefined },
  }

  const raw = toRef(() => inputs[inputType.value].value())
  const result = toRef(() => toArray(raw.value))
</script>

<template>
  <div class="space-y-4">
    <!-- Input type selector -->
    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="(config, key) in inputs"
        :key
        class="px-3 py-1.5 text-xs rounded-lg border transition-all"
        :class="inputType === key
          ? 'border-primary bg-primary/10 text-primary font-medium'
          : 'border-divider text-on-surface-variant hover:border-primary/50'"
        @click="inputType = key as InputType"
      >
        {{ config.label }}
      </button>
    </div>

    <!-- Editable inputs -->
    <div v-if="inputType === 'string'" class="flex items-center gap-2">
      <label class="text-xs text-on-surface-variant">Value:</label>
      <input
        v-model="text"
        class="flex-1 px-3 py-1.5 text-sm rounded-lg border border-divider bg-surface text-on-surface font-mono outline-none focus:border-primary"
      >
    </div>

    <div v-else-if="inputType === 'number'" class="flex items-center gap-2">
      <label class="text-xs text-on-surface-variant">Value:</label>
      <input
        v-model.number="number"
        class="flex-1 px-3 py-1.5 text-sm rounded-lg border border-divider bg-surface text-on-surface font-mono outline-none focus:border-primary"
        type="number"
      >
    </div>

    <div v-else-if="inputType === 'array'" class="space-y-2">
      <div class="flex items-center gap-2">
        <label class="text-xs text-on-surface-variant">Items:</label>
        <div class="flex flex-wrap gap-1">
          <span
            v-for="(item, index) in items"
            :key="index"
            class="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-mono bg-primary/10 text-primary rounded"
          >
            {{ item }}
            <button
              class="text-primary/60 hover:text-primary"
              @click="items.splice(index, 1)"
            >
              &times;
            </button>
          </span>
        </div>
        <button
          class="text-xs px-2 py-0.5 rounded border border-divider text-on-surface-variant hover:bg-surface-tint transition-colors"
          @click="items.push(String.fromCharCode(97 + items.length))"
        >
          + Add
        </button>
      </div>
    </div>

    <!-- Result -->
    <div class="rounded-lg border border-divider bg-surface-variant/30 p-3 space-y-2">
      <div class="text-xs font-medium text-on-surface-variant/60 uppercase tracking-wider">
        toArray() result
      </div>

      <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
        <span class="text-on-surface-variant/60">Input</span>
        <span class="font-mono text-on-surface">{{ raw === null ? 'null' : raw === undefined ? 'undefined' : JSON.stringify(raw) }}</span>

        <span class="text-on-surface-variant/60">Type</span>
        <span class="font-mono text-on-surface-variant">{{ raw === null ? 'null' : raw === undefined ? 'undefined' : Array.isArray(raw) ? 'array' : typeof raw }}</span>

        <span class="text-on-surface-variant/60">Output</span>
        <span class="font-mono text-primary font-medium">{{ JSON.stringify(result) }}</span>

        <span class="text-on-surface-variant/60">Length</span>
        <span class="font-mono text-on-surface">{{ result.length }}</span>
      </div>
    </div>
  </div>
</template>
