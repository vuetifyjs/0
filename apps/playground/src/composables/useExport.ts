import { downloadZip } from 'client-zip'

// Components
import { usePlayground } from '@/components/playground/app/PlaygroundApp.vue'

import { generateProjectFiles } from '@/util/export'

export function useExport () {
  const playground = usePlayground()

  async function downloadProject () {
    const store = playground.store
    const files: Record<string, string> = {}
    for (const path of Object.keys(store.files)) {
      files[path] = store.files[path]!.code
    }

    const exportFiles = generateProjectFiles({
      files,
      importMap: store.getImportMap(),
    })

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

  return { downloadProject }
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
