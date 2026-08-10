<script setup lang="ts">
  // Framework
  import { useTimer } from '@vuetify/v0'

  // Composables
  import { useExport } from '@/composables/useExport'

  // Utilities
  import { shallowRef } from 'vue'

  const { copyProject, downloadProject } = useExport()

  const busy = shallowRef<'copy' | 'zip' | null>(null)
  const done = shallowRef<'copy' | 'zip' | null>(null)

  const { start: startDone } = useTimer(() => {
    done.value = null
  }, { duration: 2000 })

  async function onDownload () {
    if (busy.value) return
    busy.value = 'zip'
    try {
      await downloadProject()
      done.value = 'zip'
      startDone()
    } catch {
      // Zip generation failed
    } finally {
      busy.value = null
    }
  }

  async function onCopy () {
    if (busy.value) return
    busy.value = 'copy'
    try {
      await copyProject()
      done.value = 'copy'
      startDone()
    } catch {
      // Clipboard may be denied
    } finally {
      busy.value = null
    }
  }
</script>

<template>
  <div class="flex flex-col gap-4">
    <p class="text-sm text-on-surface-variant">
      Download or copy your playground as a runnable Vite project. The package includes
      a scaffold (<code>package.json</code>, <code>vite.config.ts</code>,
      <code>index.html</code>, <code>src/uno.config.ts</code>, <code>README.md</code>)
      plus your editor files.
    </p>

    <div class="flex flex-wrap gap-2">
      <button
        class="px-3 py-1.5 rounded text-xs font-medium bg-primary text-on-primary disabled:opacity-60"
        :disabled="busy !== null"
        type="button"
        @click="onDownload"
      >
        {{ busy === 'zip' ? 'Exporting…' : done === 'zip' ? 'Downloaded!' : 'Download ZIP' }}
      </button>

      <button
        class="px-3 py-1.5 rounded text-xs font-medium border border-divider text-on-surface hover:bg-surface-tint disabled:opacity-60"
        :disabled="busy !== null"
        type="button"
        @click="onCopy"
      >
        {{ busy === 'copy' ? 'Copying…' : done === 'copy' ? 'Copied!' : 'Copy to clipboard' }}
      </button>
    </div>

    <p class="text-[11px] text-on-surface-variant leading-relaxed">
      Clipboard format is a multi-file dump (<code>===== path =====</code> headers) —
      the same contents as the ZIP, ready to paste into a chat or editor.
    </p>
  </div>
</template>
