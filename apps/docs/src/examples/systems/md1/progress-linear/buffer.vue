<script setup lang="ts">
  import { Md1Button, Md1ProgressLinear } from '@paper/md1'
  import { useTimer } from '@vuetify/v0'
  import { shallowRef, toRef, watch } from 'vue'

  const played = shallowRef(0)
  const loaded = shallowRef(10)
  const playing = shallowRef(false)

  // The download runs ahead of playback; playback never passes what has loaded.
  const clock = useTimer(() => {
    loaded.value = Math.min(loaded.value + 3, 100)
    played.value = Math.min(played.value + 1, loaded.value)
  }, { duration: 150, repeat: true })

  // A repeating timer re-arms after its handler returns, so a stop() inside the
  // handler does nothing; the end is watched from outside instead.
  watch(played, value => {
    if (value < 100) return

    clock.stop()
    playing.value = false
  })

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
  <div class="md1-docs-progress-video">
    <div class="md1-docs-progress-frame">
      <span class="md1-docs-progress-caption">Big Buck Bunny, 9:56</span>
    </div>

    <Md1ProgressLinear aria-label="Playback" :buffer="loaded" :value="played" />

    <div class="md1-docs-progress-controls">
      <Md1Button @click="onToggle">{{ label }}</Md1Button>
    </div>
  </div>
</template>

<style>
  .md1-docs-progress-video {
    max-width: 360px;
    overflow: hidden;
    border-radius: var(--md1-radius, 2px);
    background: var(--md1-surface, #FFFFFF);
    box-shadow: var(--md1-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  }

  .md1-docs-progress-frame {
    display: flex;
    align-items: flex-end;
    aspect-ratio: 16 / 9;
    padding: var(--md1-spacing-2, 16px);
    box-sizing: border-box;
    background: var(--md1-grey-900, #212121);
  }

  .md1-docs-progress-caption {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-white, #FFFFFF);
  }

  .md1-docs-progress-controls {
    padding: var(--md1-spacing-1, 8px);
  }
</style>
