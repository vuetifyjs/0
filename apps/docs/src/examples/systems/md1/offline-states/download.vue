<script setup lang="ts">
  import { Md1Button, Md1Icon, Md1List, Md1ProgressCircular } from '@paper/md1'
  import { isUndefined, useTimer } from '@vuetify/v0'
  import { shallowRef, toRef, watch } from 'vue'

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
  <div class="md1-docs-offline-sheet">
    <Md1List :lines="2">
      <Md1List.Item>
        <Md1List.Content>
          <Md1List.Primary>Episode 12</Md1List.Primary>

          <Md1List.Secondary>48 min</Md1List.Secondary>
        </Md1List.Content>

        <Md1List.Action>
          <span v-if="saved" class="md1-docs-offline-status" role="status">
            <Md1Icon class="md1-docs-offline-icon" name="offline-pin" />

            Offline
          </span>

          <Md1ProgressCircular
            v-else-if="downloading"
            aria-label="Downloading episode 12"
            :size="24"
            :value="progress"
          />

          <Md1Button v-else icon="download" @click="onDownload">Download 32 MB</Md1Button>
        </Md1List.Action>
      </Md1List.Item>
    </Md1List>
  </div>
</template>

<style>
  .md1-docs-offline-sheet {
    box-sizing: border-box;
    width: 100%;
    max-width: 400px;
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
    box-shadow: var(--md1-elevation-2);
  }

  .md1-docs-offline-status {
    display: inline-flex;
    align-items: center;
    gap: var(--md1-spacing-1, 8px);
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-caption-size, 12px);
    letter-spacing: var(--md1-type-caption-tracking, 0.02em);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  .md1-docs-offline-icon {
    color: var(--md1-icon-active, rgba(0, 0, 0, 0.54));
  }
</style>
