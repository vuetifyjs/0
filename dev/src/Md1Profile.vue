<script lang="ts">
  // Framework
  import { Md1Button, Md1Card, Md1Dialog, Md1List, Md1Snackbar, Md1Tabs, Md1TextField } from '@paper/md1'

  // Context
  import { activity, profile } from './Md1Data'

  // Utilities
  import { shallowRef, toRef, watch } from 'vue'

  /**
   * The Location card's media: a hand-drawn street grid as an inline SVG data
   * URI, the imagery treatment for a map — no tiles, no raster. Media is
   * imagery, so like a photo it keeps its own colours on both themes.
   */
  const map = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 688 387">',
    '<rect width="688" height="387" fill="#ECE9E2"/>',
    '<rect x="430" y="36" width="160" height="110" rx="4" fill="#CDE8C9"/>',
    '<path d="M0 332 C120 304 230 352 364 332 S600 302 688 322 L688 387 L0 387 Z" fill="#BFD9E8"/>',
    '<g stroke="#D8D3C8" stroke-width="14" fill="none">',
    '<path d="M0 80 H688 M0 180 H688 M0 272 H688 M110 0 V387 M230 0 V387 M350 0 V387 M470 0 V387 M590 0 V387 M0 36 L688 244"/>',
    '</g>',
    '<g stroke="#FFFFFF" stroke-width="10" fill="none">',
    '<path d="M0 80 H688 M0 180 H688 M0 272 H688 M110 0 V387 M230 0 V387 M350 0 V387 M470 0 V387 M590 0 V387 M0 36 L688 244"/>',
    '</g>',
    '<g stroke="#FFFFFF" stroke-width="5" fill="none">',
    '<path d="M0 130 H688 M290 0 V387 M530 0 V387"/>',
    '</g>',
    '<ellipse cx="344" cy="238" rx="16" ry="5" fill="rgba(0,0,0,0.2)"/>',
    '<path d="M344 158 c-18 0 -31 14 -31 31 0 23 31 49 31 49 s31 -26 31 -49 c0 -17 -13 -31 -31 -31 z" fill="#F44336"/>',
    '<circle cx="344" cy="189" r="10" fill="#FFFFFF"/>',
    '</svg>',
  ].join('')

  const media = `data:image/svg+xml,${encodeURIComponent(map)}`

  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  function filled (value: unknown) {
    return String(value).trim().length > 0 || 'Error: enter a name'
  }

  function valid (value: unknown) {
    return EMAIL.test(String(value)) || 'Error: enter an address like name@example.com'
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'Md1Profile' })

  const me = toRef(() => profile.me.value)

  /** The latest entries of the account's feed, newest first as the store keeps them. */
  const recent = toRef(() => activity.all.value.slice(0, 6))

  const tab = shallowRef('about')
  const saved = shallowRef(false)

  // The edit-profile draft
  const editing = shallowRef(false)
  const name = shallowRef('')
  const email = shallowRef('')
  const role = shallowRef('')
  const location = shallowRef('')
  const bio = shallowRef('')

  // Every opening starts from what is saved on the account.
  watch(editing, value => {
    if (!value) return

    name.value = me.value.name
    email.value = me.value.email
    role.value = me.value.role
    location.value = me.value.location
    bio.value = me.value.bio
  })

  /** A draft the shared profile may take: Save stays disabled while the name is blank or the address malformed. */
  const savable = toRef(() => name.value.trim().length > 0 && EMAIL.test(email.value.trim()))

  /** Unsaved changes: the full-screen dialog asks before discarding them. */
  const dirty = toRef(() =>
    name.value !== me.value.name
    || email.value !== me.value.email
    || role.value !== me.value.role
    || location.value !== me.value.location
    || bio.value !== me.value.bio,
  )

  function onSave () {
    profile.update({
      name: name.value.trim(),
      email: email.value.trim(),
      role: role.value.trim(),
      location: location.value.trim(),
      bio: bio.value.trim(),
    })

    saved.value = true
  }
</script>

<template>
  <section class="md1-demo-profile">
    <div class="md1-demo-profile__sheet md1-elevation-2">
      <header class="md1-demo-profile__header">
        <!-- Sized attributes reserve the box before the image decodes, so a cold load never shifts. -->
        <img
          v-if="me.avatar"
          alt=""
          class="md1-demo-profile__avatar"
          height="64"
          :src="me.avatar"
          width="64"
        >

        <div v-else aria-hidden="true" class="md1-demo-profile__initial">{{ me.name.charAt(0) }}</div>

        <div class="md1-demo-profile__identity">
          <h1 class="md1-demo-profile__name">{{ me.name }}</h1>

          <p class="md1-demo-profile__role">{{ me.role }} · {{ me.email }}</p>
        </div>

        <Md1Button variant="raised" @click="editing = true">Edit profile</Md1Button>
      </header>

      <Md1Tabs v-model="tab">
        <Md1Tabs.List label="Profile sections">
          <Md1Tabs.Item label="About" value="about" />

          <Md1Tabs.Item label="Activity" value="activity" />
        </Md1Tabs.List>

        <Md1Tabs.Panel class="md1-demo-profile__panel" value="about">
          <p class="md1-demo-profile__bio">{{ me.bio }}</p>

          <Md1List aria-label="Details" :lines="2">
            <Md1List.Item>
              <Md1List.Icon name="email" />

              <Md1List.Content>
                <Md1List.Primary>{{ me.email }}</Md1List.Primary>

                <Md1List.Secondary>Email</Md1List.Secondary>
              </Md1List.Content>
            </Md1List.Item>

            <Md1List.Item>
              <Md1List.Icon name="person" />

              <Md1List.Content>
                <Md1List.Primary>{{ me.role }}</Md1List.Primary>

                <Md1List.Secondary>Role</Md1List.Secondary>
              </Md1List.Content>
            </Md1List.Item>

            <Md1List.Item>
              <Md1List.Icon name="place" />

              <Md1List.Content>
                <Md1List.Primary>{{ me.location }}</Md1List.Primary>

                <Md1List.Secondary>Location</Md1List.Secondary>
              </Md1List.Content>
            </Md1List.Item>
          </Md1List>

          <Md1Card class="md1-demo-profile__map">
            <Md1Card.Media :src="media">
              <Md1Card.Title>{{ me.location }}</Md1Card.Title>
            </Md1Card.Media>
          </Md1Card>
        </Md1Tabs.Panel>

        <Md1Tabs.Panel class="md1-demo-profile__panel" value="activity">
          <Md1List aria-label="Recent activity" :lines="2">
            <Md1List.Item v-for="entry in recent" :key="entry.id">
              <Md1List.Avatar>{{ entry.actor.charAt(0) }}</Md1List.Avatar>

              <Md1List.Content>
                <Md1List.Primary>{{ entry.action }}</Md1List.Primary>

                <Md1List.Secondary>{{ entry.detail }}</Md1List.Secondary>
              </Md1List.Content>

              <Md1List.Action>
                <span class="md1-demo-profile__time">{{ entry.time }}</span>
              </Md1List.Action>
            </Md1List.Item>
          </Md1List>
        </Md1Tabs.Panel>
      </Md1Tabs>
    </div>

    <Md1Dialog v-slot="{ close }" v-model="editing" :dirty variant="full-screen">
      <Md1Dialog.Content>
        <div class="md1-demo-profile__bar">
          <Md1Button aria-label="Discard" icon="close" @click="close" />

          <Md1Dialog.Title>Edit profile</Md1Dialog.Title>

          <Md1Dialog.Confirm :disabled="!savable" @confirm="onSave">Save</Md1Dialog.Confirm>
        </div>

        <div class="md1-demo-profile__form">
          <Md1TextField v-model="name" label="Name" required :rules="[filled]" />

          <Md1TextField
            v-model="email"
            inputmode="email"
            label="Email"
            required
            :rules="[valid]"
            type="email"
          />

          <Md1TextField v-model="role" label="Role" />

          <Md1TextField v-model="location" label="Location" />

          <Md1TextField v-model="bio" label="Bio" multiline />
        </div>
      </Md1Dialog.Content>
    </Md1Dialog>

    <Md1Snackbar.Portal :teleport="false">
      <Md1Snackbar v-model="saved">Profile updated</Md1Snackbar>
    </Md1Snackbar.Portal>
  </section>
</template>

<style>
  .md1-demo-profile {
    max-width: 840px;
    margin-inline: auto;
  }

  .md1-demo-profile__sheet {
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  .md1-demo-profile__header {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--md1-spacing-2, 16px);
    padding: var(--md1-spacing-3, 24px) var(--md1-keyline-margin, 16px) var(--md1-spacing-1, 8px);
  }

  /*
   * On a handset the header stacks deterministically. Left to flex-wrap, the
   * identity line sits beside the avatar until the web font's metrics land,
   * then wraps under it — a cold-load layout shift the fixed stack removes.
   */
  @media (width < 600px) {
    .md1-demo-profile__header {
      flex-direction: column;
      align-items: flex-start;
    }

    .md1-demo-profile__identity {
      flex: none;
      width: 100%;
    }
  }

  .md1-demo-profile__avatar,
  .md1-demo-profile__initial {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
  }

  /* The initials fallback when the account has no picture: Grey 400 under white ink, like the list avatar. */
  .md1-demo-profile__initial {
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--md1-grey-400, #BDBDBD);
    color: var(--md1-white, #FFFFFF);
    font-size: var(--md1-type-headline-size, 24px);
  }

  .md1-demo-profile__identity {
    flex: 1 1 auto;
    min-width: 0;
  }

  .md1-demo-profile__name {
    margin: 0;
    font-size: var(--md1-type-headline-size, 24px);
    font-weight: var(--md1-type-headline-weight, 400);
    line-height: var(--md1-type-headline-leading, 32px);
  }

  .md1-demo-profile__role {
    margin: 0;
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
    overflow-wrap: anywhere;
  }

  /* Both panels reserve the same height, so changing tabs never moves the page. */
  .md1-demo-profile__panel {
    min-height: 480px;
    padding-bottom: var(--md1-spacing-2, 16px);
  }

  .md1-demo-profile__bio {
    margin: 0;
    padding: var(--md1-spacing-2, 16px) var(--md1-keyline-margin, 16px) 0;
    font-size: var(--md1-type-body-1-size, 14px);
    line-height: var(--md1-type-body-1-leading, 20px);
  }

  .md1-demo-profile__map {
    max-width: 480px;
    margin: var(--md1-spacing-1, 8px) var(--md1-keyline-margin, 16px) 0;
  }

  .md1-demo-profile__time {
    font-size: var(--md1-type-caption-size, 12px);
    color: var(--md1-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /*
   * The full-screen dialog's app bar, as the dialog docs draw it: a 56 dp
   * primary bar with the discard X at the left (its 48 dp target starting
   * 4 dp in), the title on the 72 dp keyline and the verb at the right.
   */
  .md1-demo-profile__bar {
    position: sticky;
    top: 0;
    z-index: 2;
    display: flex;
    align-items: center;
    height: 56px;
    padding-block: 0;
    padding-inline: 4px var(--md1-spacing-1, 8px);
    background: var(--md1-primary, #3F51B5);
    color: var(--md1-on-primary, #FFFFFF);
    box-shadow: var(--md1-elevation-4, 0px 2px 4px -1px rgba(0, 0, 0, 0.2), 0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12));
  }

  .md1-demo-profile__bar .md1-button[data-variant] {
    color: var(--md1-on-primary, #FFFFFF);
  }

  .md1-demo-profile__bar .md1-dialog__title {
    flex: 1 1 auto;
    padding-block: 0;
    padding-inline: 20px 0;
    color: var(--md1-on-primary, #FFFFFF);
  }

  /* The form on the sheet's 24 dp content keyline, under the bar. */
  .md1-demo-profile__form {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: var(--md1-spacing-2, 16px);
    width: 480px;
    max-width: 100%;
    padding: var(--md1-spacing-3, 24px);
  }
</style>
