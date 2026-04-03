<script setup lang="ts">
  import { Toggle } from '@vuetify/v0'
  import { ref } from 'vue'

  const formatting = ref<string[]>([])
</script>

<template>
  <div class="flex flex-col gap-6">
    <Toggle.Group v-model="formatting" class="inline-flex rounded-lg border border-divider" multiple>
      <Toggle.Root
        class="px-3 py-2 font-bold border-r border-divider transition-colors data-[state=on]:bg-primary data-[state=on]:text-on-primary"
        value="bold"
      >
        B
      </Toggle.Root>

      <Toggle.Root
        class="px-3 py-2 italic border-r border-divider transition-colors data-[state=on]:bg-primary data-[state=on]:text-on-primary"
        value="italic"
      >
        I
      </Toggle.Root>

      <Toggle.Root
        class="px-3 py-2 underline border-r border-divider transition-colors data-[state=on]:bg-primary data-[state=on]:text-on-primary"
        value="underline"
      >
        U
      </Toggle.Root>

      <Toggle.Root
        class="px-3 py-2 line-through transition-colors data-[state=on]:bg-primary data-[state=on]:text-on-primary"
        value="strikethrough"
      >
        S
      </Toggle.Root>
    </Toggle.Group>

    <p
      class="text-base leading-relaxed"
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
