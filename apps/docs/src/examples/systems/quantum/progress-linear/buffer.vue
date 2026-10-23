<script setup lang="ts">
  import { QuButton, QuProgressLinear } from '@paper/quantum'
  import { useTimer } from '@vuetify/v0'
  import { shallowRef, toRef } from 'vue'

  const played = shallowRef(0)
  const loaded = shallowRef(10)
  const playing = shallowRef(false)

  // The download runs ahead of playback; playback never passes what has loaded.
  const clock = useTimer(() => {
    loaded.value = Math.min(loaded.value + 3, 100)
    played.value = Math.min(played.value + 1, loaded.value)

    if (played.value === 100) {
      clock.stop()
      playing.value = false
    }
  }, { duration: 150, repeat: true })

  const label = toRef(() => playing.value ? 'Pause' : (played.value === 100 ? 'Replay' : 'Play'))

  function onToggle () {
    if (playing.value) {
      clock.stop()
      playing.value = false

      return
    }

    if (played.value === 100) {
      played.value = 0
    }

    playing.value = true
    clock.start()
  }
</script>

<template>
  <div class="quantum-docs-progress-video">
    <div class="quantum-docs-progress-frame">
      <span class="quantum-docs-progress-caption">Big Buck Bunny, 9:56</span>
    </div>

    <QuProgressLinear aria-label="Playback" :buffer="loaded" :value="played" />

    <div class="quantum-docs-progress-controls">
      <QuButton @click="onToggle">{{ label }}</QuButton>
    </div>
  </div>
</template>

<style>
  .quantum-docs-progress-video {
    max-width: 360px;
    overflow: hidden;
    border-radius: var(--quantum-radius, 2px);
    background: var(--quantum-surface, #FFFFFF);
    box-shadow: var(--quantum-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }

  .quantum-docs-progress-frame {
    display: flex;
    align-items: flex-end;
    aspect-ratio: 16 / 9;
    padding: var(--quantum-spacing-2, 16px);
    box-sizing: border-box;
    background: var(--quantum-grey-900, #212121);
  }

  .quantum-docs-progress-caption {
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    color: var(--quantum-white, #FFFFFF);
  }

  .quantum-docs-progress-controls {
    padding: var(--quantum-spacing-1, 8px);
  }
</style>
