<script setup lang="ts">
  import { Md1Button, Md1Card, Md1FeatureDiscovery, Md1Toolbar } from '@paper/md1'
  import { createStorage, IN_BROWSER } from '@vuetify/v0'
  import { nextTick, shallowRef } from 'vue'

  // Session storage: a dismissed tip stays dismissed for the visit, across remounts of the example.
  const storage = createStorage({ adapter: IN_BROWSER ? window.sessionStorage : undefined, prefix: 'md1-docs:' })
  const seen = storage.get('crop-tip', false)

  const photo = shallowRef(false)
  const open = shallowRef(false)
  const cropped = shallowRef(false)

  // The trigger is the context, not a button: the crop tip is only relevant once there is an image to crop.
  async function onAdd () {
    photo.value = true
    cropped.value = false

    if (seen.value) return

    await nextTick()
    open.value = true
  }

  function onRemove () {
    photo.value = false
    open.value = false
  }

  function onReset () {
    onRemove()
    seen.value = false
  }
</script>

<template>
  <div class="md1-docs-screen md1-docs-contextual-screen">
    <Md1Toolbar>
      <Md1Toolbar.Title>New post</Md1Toolbar.Title>

      <Md1Toolbar.Actions>
        <Md1Button @click="onReset">Reset tips</Md1Button>
      </Md1Toolbar.Actions>
    </Md1Toolbar>

    <div class="md1-docs-contextual-body">
      <div v-if="photo" class="md1-docs-contextual-card">
        <Md1Card>
          <Md1Card.Media alt="The brick front of Massey Hall, a concert hall with red doors" ratio="16:9" src="https://picsum.photos/seed/md1-discovery-game/688/387" />

          <Md1Card.Title :level="5">Massey Hall</Md1Card.Title>

          <Md1Card.Subtitle>{{ cropped ? 'Cropped to 16:9' : 'Added just now' }}</Md1Card.Subtitle>

          <Md1Card.Actions>
            <Md1FeatureDiscovery v-model="open" @complete="seen = true" @dismiss="seen = true">
              <Md1FeatureDiscovery.Activator>
                <Md1Button @click="cropped = true">Crop</Md1Button>
              </Md1FeatureDiscovery.Activator>

              <Md1FeatureDiscovery.Title>Frame your shot</Md1FeatureDiscovery.Title>

              <Md1FeatureDiscovery.Text>Crop the photo to trim the edges before you post it.</Md1FeatureDiscovery.Text>
            </Md1FeatureDiscovery>

            <Md1Button @click="onRemove">Remove</Md1Button>
          </Md1Card.Actions>
        </Md1Card>
      </div>

      <div v-else class="md1-docs-contextual-empty">
        <span class="md1-docs-contextual-note">{{ seen ? 'You have seen the crop tip; it will not show again this session.' : 'Add a photo to your post.' }}</span>

        <Md1Button variant="raised" @click="onAdd">Add photo</Md1Button>
      </div>
    </div>
  </div>
</template>

<style>
  /* A desktop screen tall enough for a full card under the app bar. */
  .md1-docs-contextual-screen {
    height: 520px;
    background: var(--md1-background, #FAFAFA);
  }

  .md1-docs-contextual-body {
    padding: var(--md1-spacing-2, 16px);
  }

  .md1-docs-contextual-card {
    max-width: 400px;
    margin-inline: auto;
  }

  .md1-docs-contextual-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    margin-block-start: 120px;
    text-align: center;
  }

  .md1-docs-contextual-note {
    font-family: var(--md1-font-family, Roboto, Noto, sans-serif);
    font-size: var(--md1-type-body-1-size, 14px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
