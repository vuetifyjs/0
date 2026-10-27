<script setup lang="ts">
  import { Md1List, Md1Menu } from '@paper/md1'
  import { shallowRef } from 'vue'

  const RINGTONES = ['Ariel', 'Beebeep', 'Carousel', 'Dione', 'Luna', 'Pixie Dust']
  const VIBRATIONS = ['Never', 'Always', 'Only when silent']

  const ringtone = shallowRef<unknown>('Ariel')
  const vibrate = shallowRef<unknown>('Only when silent')
</script>

<template>
  <div class="md1-docs-menu-settings md1-elevation-2">
    <Md1List :lines="2">
      <Md1Menu v-model:selected="ringtone">
        <Md1Menu.Activator v-slot="{ attrs }">
          <Md1List.Item v-bind="attrs">
            <Md1List.Content>
              <Md1List.Primary>Phone ringtone</Md1List.Primary>

              <Md1List.Secondary>{{ ringtone }}</Md1List.Secondary>
            </Md1List.Content>
          </Md1List.Item>
        </Md1Menu.Activator>

        <li class="md1-docs-menu-settings-sheet" role="none">
          <Md1Menu.Content>
            <Md1Menu.Item v-for="item in RINGTONES" :key="item" :value="item">{{ item }}</Md1Menu.Item>
          </Md1Menu.Content>
        </li>
      </Md1Menu>

      <Md1Menu v-model:selected="vibrate">
        <Md1Menu.Activator v-slot="{ attrs }">
          <Md1List.Item v-bind="attrs">
            <Md1List.Content>
              <Md1List.Primary>Vibrate for calls</Md1List.Primary>

              <Md1List.Secondary>{{ vibrate }}</Md1List.Secondary>
            </Md1List.Content>
          </Md1List.Item>
        </Md1Menu.Activator>

        <li class="md1-docs-menu-settings-sheet" role="none">
          <Md1Menu.Content>
            <Md1Menu.Item v-for="item in VIBRATIONS" :key="item" :value="item">{{ item }}</Md1Menu.Item>
          </Md1Menu.Content>
        </li>
      </Md1Menu>
    </Md1List>
  </div>
</template>

<style>
  /*
   * A settings sheet a handset wide. The rows carry no icon, so their text
   * starts on the same 16 dp keyline as the menu's, and the menu laid over a
   * row lines its selected item's text up with the row's.
   */
  .md1-docs-menu-settings {
    box-sizing: border-box;
    width: 100%;
    max-width: 360px;
    background: var(--md1-surface, #FFFFFF);
    border-radius: var(--md1-radius, 2px);
  }

  /* A list may only hold rows, so the sheet rides in a row of its own that takes no space: it opens in the top layer anyway. */
  .md1-docs-menu-settings-sheet {
    display: contents;
  }
</style>
