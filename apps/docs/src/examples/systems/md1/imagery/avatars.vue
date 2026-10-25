<script setup lang="ts">
  import { Md1GridList, Md1Icon, Md1List, Md1Subheader } from '@paper/md1'

  const THUMBNAILS = ['harbour', 'market', 'ridge', 'lagoon', 'tram', 'tiles']
</script>

<template>
  <div class="md1-docs-imagery-avatars">
    <div class="md1-docs-imagery-avatars-sheet md1-elevation-2">
      <Md1Subheader>People</Md1Subheader>

      <Md1List :lines="2">
        <Md1List.Item>
          <Md1List.Avatar alt="" src="https://cdn.vuetifyjs.com/images/john.jpg" />

          <Md1List.Content>
            <Md1List.Primary>John Leider</Md1List.Primary>

            <Md1List.Secondary>Personal avatar</Md1List.Secondary>
          </Md1List.Content>
        </Md1List.Item>

        <Md1List.Item>
          <Md1List.Avatar>
            <Md1Icon name="person" />
          </Md1List.Avatar>

          <Md1List.Content>
            <Md1List.Primary>Ana Ruiz</Md1List.Primary>

            <Md1List.Secondary>Default avatar</Md1List.Secondary>
          </Md1List.Content>
        </Md1List.Item>
      </Md1List>

      <Md1Subheader>Places</Md1Subheader>

      <Md1List :lines="2">
        <Md1List.Item>
          <Md1List.Avatar class="md1-docs-imagery-brand">
            <Md1Icon name="place" />
          </Md1List.Avatar>

          <Md1List.Content>
            <Md1List.Primary>Harbour Café</Md1List.Primary>

            <Md1List.Secondary>Brand avatar</Md1List.Secondary>
          </Md1List.Content>
        </Md1List.Item>
      </Md1List>
    </div>

    <div class="md1-docs-imagery-avatars-sheet md1-elevation-2">
      <Md1Subheader>Thumbnails</Md1Subheader>

      <div class="md1-docs-imagery-thumbnails">
        <Md1GridList :columns="3" ratio="1:1">
          <Md1GridList.Tile
            v-for="name in THUMBNAILS"
            :key="name"
            :src="`https://picsum.photos/seed/md1-thumb-${name}/240/240`"
          />
        </Md1GridList>
      </div>
    </div>
  </div>
</template>

<style>
  .md1-docs-imagery-avatars {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
    gap: var(--md1-spacing-3, 24px);
    width: 100%;
    align-items: start;
  }

  .md1-docs-imagery-avatars-sheet {
    overflow: clip;
    background: var(--md1-surface, #FFFFFF);
  }

  /* A brand avatar takes the brand's own colour; Teal 500 stands in for one. */
  .md1-docs-imagery-brand .md1-list__face {
    background: var(--md1-teal-500, #009688);
  }

  .md1-docs-imagery-thumbnails {
    padding: 0 var(--md1-keyline-margin, 16px) var(--md1-keyline-margin, 16px);
  }
</style>
