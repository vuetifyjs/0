<script setup lang="ts">
  import {
    EmAvatar,
    EmAvatarFallback,
    EmList,
    EmListItem,
    EmListItemContent,
    EmListItemMedia,
    EmListItemMeta,
    EmListItemSubtitle,
    EmListItemTitle,
  } from '@paper/emerald'

  import { shallowRef } from 'vue'

  const active = shallowRef<string>()

  const messages = [
    {
      id: 'm1',
      initials: 'AN',
      subject: 'Sponsorship renewal',
      preview: 'The invoice for the next quarter is attached — same tier as last time.',
      time: '09:41',
      unread: true,
    },
    {
      id: 'm2',
      initials: 'KP',
      subject: 'Design review notes',
      preview: 'Left comments on the token naming; the spacing scale looks settled now.',
      time: 'Yesterday',
      unread: false,
    },
    {
      id: 'm3',
      initials: 'RS',
      subject: 'A very long subject line that will not fit and has to truncate somewhere',
      preview: 'Titles and subtitles clip to one line with an ellipsis instead of wrapping.',
      time: 'Mon',
      unread: false,
    },
  ] as const
</script>

<template>
  <div class="emerald-docs-inbox">
    <EmList v-model="active">
      <EmListItem
        v-for="message in messages"
        :key="message.id"
        :data-unread="message.unread || undefined"
        :value="message.id"
      >
        <EmListItemMedia>
          <EmAvatar size="sm"><EmAvatarFallback>{{ message.initials }}</EmAvatarFallback></EmAvatar>
        </EmListItemMedia>

        <EmListItemContent>
          <EmListItemTitle>{{ message.subject }}</EmListItemTitle>

          <EmListItemSubtitle>{{ message.preview }}</EmListItemSubtitle>
        </EmListItemContent>

        <EmListItemMeta>{{ message.time }}</EmListItemMeta>
      </EmListItem>
    </EmList>
  </div>
</template>

<style>
  .emerald-docs-inbox {
    max-width: 420px;
  }
</style>
