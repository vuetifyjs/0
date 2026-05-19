<script setup lang="ts">
  import { toHighlight } from '@vuetify/v0'
  import { computed, toRef } from 'vue'
  import { snippets } from './messages'
  import type { Message } from './messages'

  const props = defineProps<{
    message: Message
    terms: string[]
    serverMode: boolean
  }>()

  const message = toRef(() => props.message)
  const options = { ignoreCase: true, matchAll: true } as const

  const subject = computed(() => toHighlight(message.value.subject, () => props.terms, options))

  const body = computed(() => {
    if (props.serverMode) {
      return toHighlight(message.value.body, undefined, {
        matches: snippets(message.value.body, props.terms),
      })
    }
    return toHighlight(message.value.body, () => props.terms, options)
  })

  const hits = computed(() =>
    subject.value.filter(c => c.match).length + body.value.filter(c => c.match).length,
  )
</script>

<template>
  <article
    class="flex gap-3 p-3 rounded transition-colors hover:bg-surface-tint data-[hit=false]:opacity-50"
    :data-hit="hits > 0"
  >
    <div class="size-9 shrink-0 rounded-full bg-primary/15 text-primary text-sm font-semibold grid place-items-center">
      {{ message.from.split(' ').map(p => p[0]).join('').slice(0, 2) }}
    </div>

    <div class="min-w-0 flex-1">
      <header class="flex items-baseline gap-2">
        <span class="font-semibold text-on-surface truncate">{{ message.from }}</span>
        <span class="ml-auto shrink-0 text-xs text-on-surface/50">{{ message.time }}</span>
      </header>

      <p class="text-sm font-medium text-on-surface truncate">
        <template v-for="(chunk, i) in subject" :key="i">
          <mark
            v-if="chunk.match"
            class="bg-primary/25 text-on-surface rounded px-0.5 not-italic"
          >{{ chunk.text }}</mark>

          <template v-else>{{ chunk.text }}</template>
        </template>
      </p>

      <p class="text-sm text-on-surface/70 line-clamp-2">
        <template v-for="(chunk, i) in body" :key="i">
          <mark
            v-if="chunk.match"
            :class="serverMode
              ? 'bg-success/25 text-on-surface rounded px-0.5 not-italic decoration-2 underline decoration-success/60'
              : 'bg-primary/20 text-on-surface rounded px-0.5 not-italic'"
          >{{ chunk.text }}</mark>

          <template v-else>{{ chunk.text }}</template>
        </template>
      </p>
    </div>
  </article>
</template>
