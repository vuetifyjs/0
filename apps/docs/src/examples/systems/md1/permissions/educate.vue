<script setup lang="ts">
  import { Md1Button, Md1Card, Md1Icon } from '@paper/md1'
  import { IN_BROWSER } from '@vuetify/v0'
  import { shallowRef } from 'vue'

  type State = 'idle' | 'explain' | 'locating' | 'tagged' | 'denied' | 'failed'

  const state = shallowRef<State>('idle')
  const place = shallowRef('')

  async function granted () {
    try {
      const status = await navigator.permissions?.query({ name: 'geolocation' })

      return status?.state === 'granted'
    } catch {
      // A browser without the Permissions API cannot tell: educate first, as for a first request.
      return false
    }
  }

  // The feature is invoked: explain the permission in context, unless it is already allowed and no prompt will appear.
  async function onAdd () {
    if (await granted()) onContinue()
    else state.value = 'explain'
  }

  // Continue is the only path to the browser's prompt, so the request always follows the explanation.
  function onContinue () {
    if (!IN_BROWSER || !('geolocation' in navigator)) {
      state.value = 'failed'
      return
    }

    state.value = 'locating'

    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords

      place.value = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
      state.value = 'tagged'
    }, error => {
      state.value = error.code === error.PERMISSION_DENIED ? 'denied' : 'failed'
    }, { timeout: 10_000 })
  }

  function onDismiss () {
    state.value = 'idle'
  }

  const MESSAGES: Record<State, string> = {
    idle: '',
    explain: '',
    locating: 'Finding where you are',
    tagged: '',
    denied: 'Location is blocked for this site, so the photo stays untagged. Allow location in the browser\'s site settings to tag photos; everything else keeps working.',
    failed: 'Your location could not be found. Try again in a moment.',
  }
</script>

<template>
  <div class="md1-docs-permission-educate">
    <Md1Card>
      <Md1Card.Media src="https://picsum.photos/seed/md1-permission-harbour/688/387" />

      <Md1Card.Title>Lunch on the terrace</Md1Card.Title>

      <Md1Card.Subtitle>{{ state === 'tagged' ? `Taken at ${place}` : 'No location' }}</Md1Card.Subtitle>

      <Md1Card.Actions>
        <Md1Button :disabled="state === 'explain' || state === 'locating' || state === 'tagged'" icon="place" @click="onAdd">Add location</Md1Button>
      </Md1Card.Actions>
    </Md1Card>

    <!-- The explanation appears where the feature was invoked, before the browser asks. -->
    <Md1Card v-if="state === 'explain'" class="md1-docs-permission-educate-why">
      <div class="md1-docs-permission-educate-body">
        <Md1Icon class="md1-docs-permission-educate-icon" name="place" />

        <div>
          <p class="md1-type-subheading md1-docs-permission-educate-heading">Tag photos with where you took them</p>

          <p class="md1-type-body-1 md1-docs-permission-educate-text">Photos reads your location once, when you add it to a photo, and saves only the place on that photo. Your browser asks next.</p>
        </div>
      </div>

      <Md1Card.Actions>
        <Md1Button @click="onDismiss">Not now</Md1Button>

        <Md1Button @click="onContinue">Continue</Md1Button>
      </Md1Card.Actions>
    </Md1Card>

    <p class="md1-type-caption md1-docs-permission-educate-status" role="status">{{ MESSAGES[state] }}</p>
  </div>
</template>

<style>
  .md1-docs-permission-educate {
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-1, 8px);
    width: 100%;
    max-width: 344px;
  }

  .md1-docs-permission-educate-body {
    display: flex;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-2, 16px) var(--md1-spacing-2, 16px) 0;
  }

  .md1-docs-permission-educate-icon {
    flex: none;
    color: var(--md1-primary-ink, #3F51B5);
  }

  .md1-docs-permission-educate-heading,
  .md1-docs-permission-educate-text {
    margin: 0;
  }

  .md1-docs-permission-educate-text {
    margin-block-start: var(--md1-spacing-1, 8px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /* Always rendered, so the live region exists before its first message. */
  .md1-docs-permission-educate-status {
    min-height: 20px;
    margin: 0;
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }
</style>
