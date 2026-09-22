import { downloadZip } from 'client-zip'

// Components
import { usePlayground } from '@/components/playground/app/PlaygroundApp.vue'

import { formatProjectForClipboard, generateProjectFiles } from '@/util/export'

export function useExport () {
  const playground = usePlayground()

  function collectProjectFiles (): Record<string, string> {
    const store = playground.store
    const files: Record<string, string> = {}
    for (const path of Object.keys(store.files)) {
      files[path] = store.files[path]!.code
    }

    return generateProjectFiles({
      files,
      importMap: store.getImportMap(),
    })
  }

  async function downloadProject () {
    const exportFiles = collectProjectFiles()

    try {
      const entries = Object.entries(exportFiles).map(([path, content]) => ({
        name: path,
        input: new Blob([content], { type: 'text/plain' }),
      }))

      saveBlob(await downloadZip(entries).blob(), 'v0play.zip')
    } catch (error) {
      throw new Error('Error when creating Zip', { cause: error })
    }
  }

  /**
   * Copy the full exportable project (same file set as the ZIP, including
   * README + scaffold) to the clipboard as a multi-file text dump —
   * intended for pasting into an agent / LLM chat ("Copy for Agent").
   */
  async function copyProject () {
    const exportFiles = collectProjectFiles()
    const text = formatProjectForClipboard(exportFiles)
    await navigator.clipboard.writeText(text)
  }

  return { copyProject, downloadProject }
}

function saveBlob (blob: Blob, fileName: string) {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)
  document.body.append(link)

  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}
