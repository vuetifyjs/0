<script setup lang="ts">
  // Framework
  import { useWindowEventListener } from '@vuetify/v0'

  // Composables
  import { useSettings } from '@/composables/useSettings'
  import { useThemeToggle } from '@/composables/useThemeToggle'

  // Utilities
  import { shallowRef, toRef } from 'vue'

  const settings = useSettings()
  const toggle = useThemeToggle()
  const { isDark } = toggle

  const showMesh = toRef(() => settings.showMeshGrid.value && toggle.preference.value !== 'high-contrast')
  const showBottomMesh = shallowRef(false)

  useWindowEventListener('scroll', () => {
    showBottomMesh.value = settings.showMeshTransition.value && window.scrollY > 200
  }, { passive: true })
</script>

<template>
  <div v-if="showMesh" aria-hidden="true" class="mesh-bg mesh-bg-top" :class="isDark ? 'mesh-dark' : 'mesh-light'" />
  <div v-if="showMesh" aria-hidden="true" class="mesh-bg mesh-bg-bottom" :class="[isDark ? 'mesh-dark' : 'mesh-light', { visible: showBottomMesh }]" />
</template>

<style>
  .mesh-bg {
    position: fixed;
    inset: 0;
    z-index: -1;
    pointer-events: none;
  }

  .mesh-dark.mesh-bg-top {
    background:
      radial-gradient(at 40% 20%, color-mix(in srgb, var(--v0-primary) 40%, transparent) 0px, transparent 50%),
      radial-gradient(at 80% 0%, color-mix(in srgb, var(--v0-info) 35%, transparent) 0px, transparent 50%),
      radial-gradient(at 0% 50%, color-mix(in srgb, var(--v0-error) 25%, transparent) 0px, transparent 50%),
      radial-gradient(at 80% 50%, color-mix(in srgb, var(--v0-success) 30%, transparent) 0px, transparent 50%),
      radial-gradient(at 20% 80%, color-mix(in srgb, var(--v0-warning) 20%, transparent) 0px, transparent 50%);
  }

  .mesh-dark.mesh-bg-bottom {
    opacity: 0;
    transition: opacity 0.5s ease-out;
    background:
      radial-gradient(at 60% 80%, color-mix(in srgb, var(--v0-primary) 40%, transparent) 0px, transparent 50%),
      radial-gradient(at 20% 100%, color-mix(in srgb, var(--v0-info) 35%, transparent) 0px, transparent 50%),
      radial-gradient(at 100% 50%, color-mix(in srgb, var(--v0-error) 25%, transparent) 0px, transparent 50%),
      radial-gradient(at 20% 50%, color-mix(in srgb, var(--v0-success) 30%, transparent) 0px, transparent 50%),
      radial-gradient(at 80% 20%, color-mix(in srgb, var(--v0-warning) 20%, transparent) 0px, transparent 50%);

    &.visible {
      opacity: 1;
    }
  }

  .mesh-light.mesh-bg-top {
    inset: -40px;
    opacity: 0.7;
    filter: blur(80px);
    background: conic-gradient(
      from 325deg at 50% 40%,
      color-mix(in oklch, var(--v0-primary) 50%, var(--v0-background)),
      color-mix(in oklch, var(--v0-info) 45%, var(--v0-background)),
      color-mix(in oklch, var(--v0-success) 45%, var(--v0-background)),
      color-mix(in oklch, var(--v0-warning) 45%, var(--v0-background)),
      color-mix(in oklch, var(--v0-error) 45%, var(--v0-background)),
      color-mix(in oklch, var(--v0-primary) 50%, var(--v0-background))
    );
  }

  .mesh-light.mesh-bg-bottom {
    inset: -40px;
    opacity: 0;
    filter: blur(80px);
    transition: opacity 0.5s ease-out;
    background: conic-gradient(
      from 225deg at 60% 60%,
      color-mix(in oklch, var(--v0-primary) 50%, var(--v0-background)),
      color-mix(in oklch, var(--v0-info) 45%, var(--v0-background)),
      color-mix(in oklch, var(--v0-success) 45%, var(--v0-background)),
      color-mix(in oklch, var(--v0-warning) 45%, var(--v0-background)),
      color-mix(in oklch, var(--v0-error) 45%, var(--v0-background)),
      color-mix(in oklch, var(--v0-primary) 30%, var(--v0-background))
    );

    &.visible {
      opacity: 0.7;
    }
  }
</style>
