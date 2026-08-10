<script setup vapor lang="ts">
  // Framework
// Probes the REAL Atom.vue compiled in Vapor mode (vitest.spike.config.ts):
  // attrs -> slotProps forwarding, reactive class updates, defineExpose
  // element contract, renderless mode, self-closing tags.

  import { Atom } from '@vuetify/v0/components'

  // Utilities
  import { onMounted, shallowRef, useTemplateRef } from 'vue'

  // Types
  import type { AtomExpose } from '@vuetify/v0/components'

  const cls = shallowRef('alpha')
  const atomRef = useTemplateRef<AtomExpose>('atom')
  const tag = shallowRef('PENDING')
  const unwrapped = shallowRef('PENDING')

  onMounted(() => {
    const exposed = atomRef.value?.element as unknown
    if (!exposed) {
      tag.value = 'MISSING'
      unwrapped.value = 'MISSING'
      return
    }
    const direct = exposed as { tagName?: string, value?: { tagName?: string } }
    if (direct.tagName) {
      tag.value = direct.tagName
      unwrapped.value = 'true'
    } else {
      tag.value = direct.value?.tagName ?? 'MISSING'
      unwrapped.value = 'false'
    }
  })

  function onSwap () {
    cls.value = 'beta'
  }
</script>

<template>
  <div :data-expose-tag="tag" :data-expose-unwrapped="unwrapped" data-probe>
    <Atom
      ref="atom"
      v-slot="p"
      as="button"
      :class="cls"
      data-atom="host"
    >
      <span data-slot-keys>{{ Object.keys(p).sort().join(',') }}</span>
    </Atom>

    <Atom v-slot="p" data-r="yes" renderless>
      <span :data-forwarded="(p as Record<string, string>)['data-r']" data-renderless>r</span>
    </Atom>

    <Atom alt="probe" as="img" data-img />

    <button data-swap @click="onSwap">swap</button>
  </div>
</template>
