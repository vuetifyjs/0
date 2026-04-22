<script setup lang="ts">
  import { toElement } from '@vuetify/v0'
  import { shallowRef, toRef, useTemplateRef } from 'vue'

  type SourceType = 'ref' | 'getter' | 'raw' | 'null'

  const source = shallowRef<SourceType>('ref')
  const target = useTemplateRef<HTMLElement>('target')

  const sources: Record<SourceType, { label: string, code: string }> = {
    ref: { label: 'Ref', code: 'useTemplateRef(\'target\')' },
    getter: { label: 'Getter', code: '() => document.getElementById(...)' },
    raw: { label: 'Raw Element', code: 'document.querySelector(...)' },
    null: { label: 'null', code: 'null' },
  }

  function resolve () {
    switch (source.value) {
      case 'ref': { return toElement(target)
      }
      case 'getter': { return toElement(() => target.value)
      }
      case 'raw': { return toElement(target.value)
      }
      case 'null': { return toElement(null)
      }
    }
  }

  const resolved = toRef(() => resolve())
  const tagName = toRef(() => resolved.value?.tagName.toLowerCase() ?? 'undefined')
  const id = toRef(() => resolved.value?.id ?? 'none')
</script>

<template>
  <div class="space-y-4">
    <div class="flex flex-wrap gap-1.5">
      <button
        v-for="(config, key) in sources"
        :key
        class="px-3 py-1.5 text-xs rounded-lg border transition-all"
        :class="source === key
          ? 'border-primary bg-primary/10 text-primary font-medium'
          : 'border-divider text-on-surface-variant hover:border-primary/50'"
        @click="source = key as SourceType"
      >
        {{ config.label }}
      </button>
    </div>

    <div
      id="to-element-target"
      ref="target"
      class="px-4 py-3 rounded-lg border-2 border-dashed border-divider text-sm text-on-surface-variant"
    >
      Target element (div#to-element-target)
    </div>

    <div class="rounded-lg border border-divider bg-surface-variant/30 p-3 space-y-2">
      <div class="text-xs font-medium text-on-surface-variant/60 uppercase tracking-wider">
        toElement() result
      </div>

      <div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-xs">
        <span class="text-on-surface-variant/60">Input</span>
        <span class="font-mono text-on-surface">{{ sources[source].code }}</span>

        <span class="text-on-surface-variant/60">Resolved</span>
        <span
          class="font-mono font-medium"
          :class="resolved ? 'text-primary' : 'text-warning'"
        >
          {{ resolved ? `Element <${tagName}>` : 'undefined' }}
        </span>

        <span class="text-on-surface-variant/60">Tag</span>
        <span class="font-mono text-on-surface">{{ tagName }}</span>

        <span class="text-on-surface-variant/60">ID</span>
        <span class="font-mono text-on-surface">{{ id }}</span>
      </div>
    </div>
  </div>
</template>
