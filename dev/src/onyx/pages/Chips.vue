<script setup lang="ts">
  defineOptions({ name: 'OnyxChips' })

  const teamChips = ref(['Design', 'Engineering', 'Marketing', 'Support'])

  const clicked = shallowRef<string>()

  function onDismiss (label: string) {
    teamChips.value = teamChips.value.filter(chip => chip !== label)
  }

  function onInteractive (label: string) {
    clicked.value = label
  }
</script>

<template>
  <p :style="{ color: 'var(--onyx-muted-foreground, #71717a)', maxWidth: '640px' }">
    Chips and badges are the same visual primitive at different jobs — a chip is an
    interactive or dismissible tag; a badge is a static status indicator. They're merged on
    one page because there's no third component here, only two roles for the same shape.
  </p>

  <h2 class="onyx-chips__heading mt-8">Chips</h2>

  <div class="flex flex-wrap items-center gap-2 mt-3">
    <OnChip>Plain</OnChip>
    <OnChip interactive @click="onInteractive('Interactive')">Interactive</OnChip>
    <OnChip disabled>Disabled</OnChip>
  </div>

  <p style="color: var(--onyx-muted-foreground, #71717a); font-size: 13px; margin-top: 8px;">
    <code>interactive</code> and <code>dismissible</code> are mutually exclusive — an
    interactive chip is itself a <code>&lt;button&gt;</code>, and nesting the dismiss
    button's own <code>&lt;button&gt;</code> inside that would be invalid HTML. Every combo
    shown here is one the component actually supports.
  </p>

  <p v-if="clicked" style="color: var(--onyx-muted-foreground, #71717a); font-size: 13px;">
    Last clicked: <strong>{{ clicked }}</strong>
  </p>

  <div class="mt-4">
    <p style="margin: 0 0 8px;">Dismissible — click × to actually remove it from this list.</p>

    <div class="flex flex-wrap items-center gap-2">
      <OnChip v-for="chip in teamChips" :key="chip" dismissible @dismiss="onDismiss(chip)">{{ chip }}</OnChip>

      <span v-if="teamChips.length === 0" style="color: var(--onyx-muted-foreground, #71717a); font-size: 13px;">
        All dismissed.
      </span>
    </div>
  </div>

  <h2 class="onyx-chips__heading mt-8">Badges</h2>

  <div class="flex flex-wrap items-center gap-2 mt-3">
    <OnBadge>Default</OnBadge>
    <OnBadge variant="secondary">Secondary</OnBadge>
    <OnBadge variant="outline">Outline</OnBadge>
    <OnBadge variant="destructive">Destructive</OnBadge>
  </div>
</template>

<!-- Unscoped: page-local heading, layout scaffolding only. -->
<style>
  .onyx-chips__heading {
    font-size: var(--onyx-text-lg-size, 18px);
    font-weight: 600;
    margin-bottom: 0;
  }
</style>
