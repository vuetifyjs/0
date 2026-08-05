<script setup lang="ts">
  import { dark, light, neutral } from '@paper/onyx'

  defineOptions({ name: 'OnyxColor' })

  const pairs = Object.keys(light)
    .filter(key => !key.endsWith('-foreground') && `${key}-foreground` in light)
    .map(base => ({ base, fg: `${base}-foreground` }))

  const singles = Object.keys(light)
    .filter(key => !key.endsWith('-foreground') && !pairs.some(pair => pair.base === key))

  const sections = [
    { label: 'Light theme', tokens: light as Record<string, string> },
    { label: 'Dark theme', tokens: dark as Record<string, string> },
  ]

  const notifications = useNotifications()

  function onCopy (name: string) {
    const token = `--onyx-${name}`

    // Fire-and-forget: clipboard permission can hang indefinitely rather than
    // reject, so the toast must never wait on it.
    if (IN_BROWSER) {
      navigator.clipboard?.writeText(token).catch(() => {})
    }

    notifications.send({ subject: 'Copied to clipboard', body: token, severity: 'success' })
  }
</script>

<template>
  <p :style="{ color: 'var(--onyx-muted-foreground, #71717a)', maxWidth: '640px' }">
    Every swatch below is a live token from <code>@paper/onyx</code> — click one to copy
    its CSS variable name.
  </p>

  <section v-for="section in sections" :key="section.label" class="mt-6">
    <h2 class="onyx-color__heading">{{ section.label }}</h2>

    <div class="grid gap-3 mt-3" style="grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));">
      <OnCard
        v-for="pair in pairs"
        :key="pair.base"
        class="p-4"
        role="button"
        :style="{ background: section.tokens[pair.base], color: section.tokens[pair.fg], cursor: 'pointer' }"
        tabindex="0"
        @click="onCopy(pair.base)"
        @keydown.enter="onCopy(pair.base)"
        @keydown.space.prevent="onCopy(pair.base)"
      >
        <strong>{{ pair.base }}</strong>
        <div style="font-size: 12px; opacity: 0.85;">{{ section.tokens[pair.base] }}</div>
      </OnCard>
    </div>

    <div class="grid gap-3 mt-3" style="grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));">
      <OnCard
        v-for="key in singles"
        :key
        class="p-4"
        role="button"
        :style="{ background: section.tokens[key], color: foreground(section.tokens[key]), cursor: 'pointer' }"
        tabindex="0"
        @click="onCopy(key)"
        @keydown.enter="onCopy(key)"
        @keydown.space.prevent="onCopy(key)"
      >
        <strong>{{ key }}</strong>
        <div style="font-size: 12px; opacity: 0.85;">{{ section.tokens[key] }}</div>
      </OnCard>
    </div>
  </section>

  <section class="mt-8">
    <h2 class="onyx-color__heading">Neutral ramp</h2>

    <div class="flex flex-wrap gap-2 mt-3">
      <OnCard v-for="[shade, hex] in Object.entries(neutral)" :key="shade" class="p-3" :style="{ background: hex, color: foreground(hex), minWidth: '90px' }">
        <strong>{{ shade }}</strong>
        <div style="font-size: 11px;">{{ hex }}</div>
      </OnCard>
    </div>
  </section>
</template>

<!-- Unscoped: page-local heading style, layout scaffolding only. -->
<style>
  .onyx-color__heading {
    font-size: var(--onyx-text-lg-size, 18px);
    font-weight: 600;
    margin: 0;
  }
</style>
