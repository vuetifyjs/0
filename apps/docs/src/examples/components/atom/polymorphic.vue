<script setup lang="ts">
  import AppButton from './AppButton.vue'
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="space-y-2">
      <p class="text-sm text-secondary">Element mode — AppButton renders the &lt;button&gt;</p>
      <div class="flex gap-2">
        <AppButton>Primary</AppButton>
        <AppButton variant="secondary">Secondary</AppButton>
        <AppButton variant="outline">Outline</AppButton>
      </div>
    </div>

    <div class="space-y-2">
      <p class="text-sm text-secondary">Element override — as="a" swaps to &lt;a&gt;</p>
      <AppButton as="a" href="#">Link styled as button</AppButton>
    </div>

    <div class="space-y-2">
      <p class="text-sm text-secondary">Renderless — consumer controls the DOM, applies attrs from slot</p>
      <AppButton v-slot="{ attrs }" renderless variant="outline">
        <a v-bind="attrs" href="#">
          Renderless link with button styling
        </a>
      </AppButton>
    </div>
  </div>
</template>
