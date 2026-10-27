<script setup lang="ts">
  import { Md1Button, Md1Divider, Md1Icon, Md1List, Md1ProgressCircular, Md1Switch } from '@paper/md1'
  import { useTimer } from '@vuetify/v0'
  import { ref, shallowRef, toRef, watch } from 'vue'

  interface Episode {
    id: number
    title: string
    length: string
    size: number
    state: 'idle' | 'queued' | 'downloading' | 'saved'
    progress: number
  }

  const online = shallowRef(false)

  const episodes = ref<Episode[]>([
    { id: 12, title: 'Episode 12: Night trains', length: '48 min', size: 32, state: 'idle', progress: 0 },
    { id: 13, title: 'Episode 13: The salt road', length: '41 min', size: 27, state: 'idle', progress: 0 },
    { id: 14, title: 'Episode 14: Lighthouse keepers', length: '55 min', size: 36, state: 'idle', progress: 0 },
  ])

  const active = toRef(() => episodes.value.some(episode => episode.state === 'downloading'))

  const timer = useTimer(() => {
    for (const episode of episodes.value) {
      if (episode.state !== 'downloading') continue

      episode.progress = Math.min(100, episode.progress + 10)

      if (episode.progress === 100) episode.state = 'saved'
    }
  }, { duration: 200, repeat: true })

  // A repeating timer re-arms after its handler returns, so it is started and
  // stopped from here, as downloads begin and settle, rather than from inside it.
  watch(active, value => {
    if (value) timer.start()
    else timer.stop()
  })

  // Back online, everything chosen while offline starts; going offline holds
  // a running download in the queue with its progress kept.
  watch(online, value => {
    for (const episode of episodes.value) {
      if (value && episode.state === 'queued') episode.state = 'downloading'
      else if (!value && episode.state === 'downloading') episode.state = 'queued'
    }
  })

  function onDownload (episode: Episode) {
    episode.state = online.value ? 'downloading' : 'queued'
  }
</script>

<template>
  <div class="md1-docs-offline-sheet">
    <Md1List :lines="2">
      <Md1List.Item>
        <Md1List.Content>
          <Md1List.Primary>Connection</Md1List.Primary>

          <Md1List.Secondary>
            <span v-if="online">Online</span>

            <span v-else class="md1-docs-offline-status">
              <Md1Icon class="md1-docs-offline-icon" name="cloud-off" />

              No internet
            </span>
          </Md1List.Secondary>
        </Md1List.Content>

        <Md1List.Action>
          <Md1Switch v-model="online" aria-label="Connected" />
        </Md1List.Action>
      </Md1List.Item>
    </Md1List>

    <Md1Divider />

    <Md1List :lines="2">
      <Md1List.Item v-for="episode in episodes" :key="episode.id">
        <Md1List.Content>
          <Md1List.Primary>{{ episode.title }}</Md1List.Primary>

          <Md1List.Secondary>{{ episode.length }}</Md1List.Secondary>
        </Md1List.Content>

        <Md1List.Action>
          <span v-if="episode.state === 'saved'" class="md1-docs-offline-status" role="status">
            <Md1Icon class="md1-docs-offline-icon" name="offline-pin" />

            Offline
          </span>

          <span v-else-if="episode.state === 'queued'" class="md1-docs-offline-status" role="status">
            <Md1Icon class="md1-docs-offline-icon" name="schedule" />

            Waiting for connection
          </span>

          <Md1ProgressCircular
            v-else-if="episode.state === 'downloading'"
            :aria-label="`Downloading ${episode.title}`"
            :size="24"
            :value="episode.progress"
          />

          <Md1Button v-else icon="download" @click="onDownload(episode)">Download {{ episode.size }} MB</Md1Button>
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

  /* A glyph and its label as one status: Caption text, the glyph at the active icon opacity. */
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
