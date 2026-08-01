<script setup lang="ts">
  defineOptions({ name: 'OnyxProgress' })

  const stepped = shallowRef(40)

  function onStep (delta: number) {
    stepped.value = Math.min(100, Math.max(0, stepped.value + delta))
  }
</script>

<template>
  <p :style="{ color: 'var(--onyx-muted-foreground, #71717a)', maxWidth: '640px' }">
    Determinate progress is a plain <code>v-model</code> number — no separate stepper
    component, just whatever drives the value.
  </p>

  <h2 class="onyx-progress-page__heading mt-8">Determinate</h2>

  <div class="flex flex-col gap-3 mt-3" style="max-width: 320px;">
    <OnProgress v-model="stepped" />

    <div class="flex items-center gap-2">
      <OnButton size="sm" variant="outline" @click="onStep(-10)">−10</OnButton>
      <OnButton size="sm" variant="outline" @click="onStep(10)">+10</OnButton>
      <span style="color: var(--onyx-muted-foreground, #71717a); font-size: 13px;">{{ stepped }}%</span>
    </div>
  </div>

  <h2 class="onyx-progress-page__heading mt-8">Indeterminate</h2>

  <div style="max-width: 320px;">
    <OnProgress class="mt-3" indeterminate />
  </div>

  <h2 class="onyx-progress-page__heading mt-8">Sizes</h2>

  <div class="flex flex-col gap-3 mt-3" style="max-width: 320px;">
    <OnProgress :model-value="60" size="md" />
    <OnProgress :model-value="60" size="sm" />
  </div>
</template>

<!-- Unscoped: page-local heading, layout scaffolding only. -->
<style>
  .onyx-progress-page__heading {
    font-size: var(--onyx-text-lg-size, 18px);
    font-weight: 600;
    margin-bottom: 0;
  }
</style>
