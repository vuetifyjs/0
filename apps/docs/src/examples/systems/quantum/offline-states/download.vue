<script setup lang="ts">
  import { createQuantumIconsContext, QuButton, QuIcon, QuList, QuProgressCircular } from '@paper/quantum'
  import { isUndefined, useTimer } from '@vuetify/v0'
  import { shallowRef, toRef, watch } from 'vue'

  // The pinned icon set has no offline-pin role yet, so this example registers
  // it for its own subtree, the way an app extends the set through
  // createQuantumIconsPlugin({ icons }).
  const [, provideIcons] = createQuantumIconsContext({
    icons: {
      // Material Icons action/offline_pin, filled, 24px, commit 49d4db35 (Apache License 2.0)
      'offline-pin': ['M12,2C6.5,2,2,6.5,2,12s4.5,10,10,10s10-4.5,10-10S17.5,2,12,2z M17,18H7v-2h10V18z M10.3,14L7,10.7l1.4-1.4l1.9,1.9 l5.3-5.3L17,7.3L10.3,14z'],
    },
  })

  provideIcons()

  // Three states for one episode: not downloaded, downloading, available offline.
  const progress = shallowRef<number>()
  const saved = shallowRef(false)
  const downloading = toRef(() => !isUndefined(progress.value))

  const timer = useTimer(() => {
    progress.value = Math.min(100, (progress.value ?? 0) + 10)

    if (progress.value < 100) return

    progress.value = undefined
    saved.value = true
  }, { duration: 200, repeat: true })

  // A repeating timer re-arms after its handler returns, so stopping it inside
  // the handler does nothing; it stops once the download has settled instead.
  watch(saved, done => {
    if (done) timer.stop()
  })

  function onDownload () {
    progress.value = 0
    timer.start()
  }
</script>

<template>
  <div class="quantum-docs-offline-sheet">
    <QuList :lines="2">
      <QuList.Item>
        <QuList.Content>
          <QuList.Primary>Episode 12</QuList.Primary>

          <QuList.Secondary>48 min</QuList.Secondary>
        </QuList.Content>

        <QuList.Action>
          <span v-if="saved" class="quantum-docs-offline-status" role="status">
            <QuIcon class="quantum-docs-offline-icon" name="offline-pin" />

            Offline
          </span>

          <QuProgressCircular
            v-else-if="downloading"
            aria-label="Downloading episode 12"
            :size="24"
            :value="progress"
          />

          <QuButton v-else icon="download" @click="onDownload">Download 32 MB</QuButton>
        </QuList.Action>
      </QuList.Item>
    </QuList>
  </div>
</template>

<style>
  .quantum-docs-offline-sheet {
    box-sizing: border-box;
    width: 100%;
    max-width: 400px;
    background: var(--quantum-surface, #FFFFFF);
    border-radius: var(--quantum-radius, 2px);
    box-shadow: var(--quantum-elevation-2);
  }

  .quantum-docs-offline-status {
    display: inline-flex;
    align-items: center;
    gap: var(--quantum-spacing-1, 8px);
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    font-size: var(--quantum-type-caption-size, 12px);
    letter-spacing: var(--quantum-type-caption-tracking, 0.02em);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .quantum-docs-offline-icon {
    color: var(--quantum-icon-active, rgba(0, 0, 0, 0.54));
  }
</style>
