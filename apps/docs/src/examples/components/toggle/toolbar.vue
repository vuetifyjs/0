<script setup lang="ts">
  import { Toggle } from '@vuetify/v0'
  import { ref } from 'vue'

  const formatting = ref<string[]>([])
</script>

<template>
  <div class="rounded-lg border border-divider overflow-hidden">
    <div class="flex items-center gap-1 px-2 py-1.5 border-b border-divider bg-surface-variant/30">
      <Toggle.Group v-model="formatting" class="inline-flex gap-2 rounded overflow-hidden" multiple>
        <Toggle.Root
          class="size-8 flex items-center justify-center py-1 font-bold text-sm text-on-surface-variant rounded data-[state=on]:bg-primary data-[state=on]:text-on-primary"
          value="bold"
        >
          B
        </Toggle.Root>

        <Toggle.Root
          class="size-8 flex items-center justify-center py-1 italic text-sm text-on-surface-variant rounded data-[state=on]:bg-primary data-[state=on]:text-on-primary"
          value="italic"
        >
          I
        </Toggle.Root>

        <Toggle.Root
          class="size-8 flex items-center justify-center py-1 underline text-sm text-on-surface-variant rounded data-[state=on]:bg-primary data-[state=on]:text-on-primary"
          value="underline"
        >
          U
        </Toggle.Root>

        <Toggle.Root
          class="size-8 flex items-center justify-center py-1 line-through text-sm text-on-surface-variant rounded data-[state=on]:bg-primary data-[state=on]:text-on-primary"
          value="strikethrough"
        >
          S
        </Toggle.Root>
      </Toggle.Group>
    </div>

    <p
      class="px-4 py-3 text-sm leading-relaxed"
      :class="{
        'font-bold': formatting.includes('bold'),
        'italic': formatting.includes('italic'),
        'underline': formatting.includes('underline'),
        'line-through': formatting.includes('strikethrough'),
      }"
    >
      The quick brown fox jumps over the lazy dog. This sentence demonstrates how your formatting selections apply in real time.
    </p>
  </div>
</template>
