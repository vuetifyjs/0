<script setup lang="ts">
  import AppButton from './AppButton.vue'
  import { shallowRef } from 'vue'

  const variant = shallowRef<'solid' | 'soft' | 'outline' | 'ghost'>('solid')
  const size = shallowRef<'sm' | 'md' | 'lg'>('md')
  const renderless = shallowRef(false)

  const variants = ['solid', 'soft', 'outline', 'ghost'] as const
  const sizes = ['sm', 'md', 'lg'] as const
</script>

<template>
  <div class="space-y-6">
    <div class="flex flex-wrap gap-6 text-sm">
      <fieldset class="flex items-center gap-2">
        <legend class="text-secondary mr-1">Variant</legend>
        <button
          v-for="v in variants"
          :key="v"
          class="px-2 py-0.5 rounded border text-xs"
          :class="variant === v ? 'bg-primary text-on-primary border-primary' : 'border-divider'"
          @click="variant = v"
        >
          {{ v }}
        </button>
      </fieldset>

      <fieldset class="flex items-center gap-2">
        <legend class="text-secondary mr-1">Size</legend>
        <button
          v-for="s in sizes"
          :key="s"
          class="px-2 py-0.5 rounded border text-xs"
          :class="size === s ? 'bg-primary text-on-primary border-primary' : 'border-divider'"
          @click="size = s"
        >
          {{ s }}
        </button>
      </fieldset>

      <fieldset class="flex items-center gap-2">
        <legend class="text-secondary mr-1">Mode</legend>
        <button
          class="px-2 py-0.5 rounded border text-xs"
          :class="!renderless ? 'bg-primary text-on-primary border-primary' : 'border-divider'"
          @click="renderless = false"
        >
          rendered
        </button>
        <button
          class="px-2 py-0.5 rounded border text-xs"
          :class="renderless ? 'bg-primary text-on-primary border-primary' : 'border-divider'"
          @click="renderless = true"
        >
          renderless
        </button>
      </fieldset>
    </div>

    <div class="p-6 border border-dashed rounded-lg min-h-20 flex items-center justify-center">
      <AppButton
        v-if="!renderless"
        :size
        :variant
      >
        AppButton
      </AppButton>

      <AppButton
        v-else
        v-slot="{ attrs }"
        renderless
        :size
        :variant
      >
        <a v-bind="attrs" href="#">
          AppButton as &lt;a&gt;
        </a>
      </AppButton>
    </div>

    <p class="text-xs text-secondary">
      {{ renderless ? 'Renderless — attrs from slot applied to your <a>. Inspect the DOM.' : 'Rendered — Atom outputs a <button> with attrs applied.' }}
    </p>
  </div>
</template>
