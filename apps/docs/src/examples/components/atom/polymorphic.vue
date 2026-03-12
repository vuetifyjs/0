<script setup lang="ts">
  import AppButton from './AppButton.vue'
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="space-y-2">
      <p class="text-sm text-secondary">Rendered — AppButton outputs a &lt;button&gt; and applies attrs for you</p>
      <div class="flex gap-2">
        <AppButton>Primary</AppButton>
        <AppButton variant="secondary">Secondary</AppButton>
        <AppButton variant="outline">Outline</AppButton>
      </div>
    </div>

    <div class="space-y-2">
      <p class="text-sm text-secondary">Renderless — same component, but you control the element and bind attrs yourself</p>
      <AppButton v-slot="{ attrs }" renderless variant="outline">
        <a v-bind="attrs" href="#">
          I'm an anchor, styled by AppButton
        </a>
      </AppButton>
    </div>
  </div>
</template>
