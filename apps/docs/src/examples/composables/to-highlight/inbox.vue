<script setup lang="ts">
  import { Input, Switch, Toggle } from '@vuetify/v0'
  import { computed, ref, shallowRef } from 'vue'
  import MessageRow from './MessageRow.vue'
  import { messages } from './messages'

  const query = shallowRef('search')
  const serverMode = shallowRef(false)

  const filters = ['budget', 'review', 'urgent'] as const
  const active = ref<Record<string, boolean>>({})

  const terms = computed(() => {
    const out: string[] = []
    if (query.value.trim()) out.push(query.value.trim())
    for (const f of filters) {
      if (active.value[f] && !out.some(t => t.toLowerCase() === f)) out.push(f)
    }
    return out
  })

  const matching = computed(() => {
    if (terms.value.length === 0) return messages
    return messages.filter(m => {
      const haystack = (m.subject + ' ' + m.body).toLowerCase()
      return terms.value.some(t => haystack.includes(t.toLowerCase()))
    })
  })
</script>

<template>
  <div class="flex flex-col gap-3 p-4 max-w-2xl mx-auto">
    <Input.Root id="inbox-search" v-model="query" label="Search inbox">
      <Input.Control
        class="w-full px-3 py-2 rounded-lg border border-divider bg-surface text-on-surface placeholder:text-on-surface/40 outline-none data-[focused]:border-primary transition-colors"
        placeholder="Search by sender, subject, or body…"
      />
    </Input.Root>

    <div class="flex flex-wrap items-center gap-2">
      <span class="text-xs font-medium text-on-surface/60">Saved filters:</span>

      <Toggle.Root
        v-for="f in filters"
        :key="f"
        v-model="active[f]"
        class="px-2.5 py-1 rounded-full border border-divider text-xs font-medium text-on-surface/70 transition-colors data-[state=on]:border-primary data-[state=on]:bg-primary/15 data-[state=on]:text-on-surface hover:bg-surface-tint"
      >
        {{ f }}
      </Toggle.Root>

      <label class="ml-auto inline-flex items-center gap-2 text-xs text-on-surface/70 cursor-pointer">
        <Switch.Root
          v-model="serverMode"
          class="inline-flex items-center border-none bg-transparent p-0 outline-none"
        >
          <Switch.Track class="relative inline-flex items-center w-9 h-5 rounded-full bg-surface-variant transition-colors data-[state=checked]:bg-success">
            <Switch.Thumb class="block size-3.5 rounded-full bg-white shadow-sm transition-transform translate-x-0.5 data-[state=checked]:translate-x-5" />
          </Switch.Track>
        </Switch.Root>
        Server snippets
      </label>
    </div>

    <div class="flex items-baseline justify-between text-xs text-on-surface/60 px-1">
      <span>{{ matching.length }} of {{ messages.length }} threads</span>

      <span v-if="terms.length > 0">
        Highlighting
        <span class="font-mono">{{ JSON.stringify(terms.length === 1 ? terms[0] : terms) }}</span>
      </span>
    </div>

    <div class="flex flex-col rounded-lg border border-divider bg-surface divide-y divide-divider">
      <MessageRow
        v-for="message in matching"
        :key="message.id"
        :message
        :server-mode
        :terms
      />

      <p v-if="matching.length === 0" class="p-6 text-center text-sm text-on-surface/60">
        No threads match the active filters.
      </p>
    </div>
  </div>
</template>
