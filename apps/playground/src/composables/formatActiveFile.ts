// Framework
import { IN_BROWSER } from '@vuetify/v0'

interface MonacoEditor {
  hasTextFocus?: () => boolean
  getAction: (id: string) => { run: () => void | Promise<void> } | null
}

interface MonacoApi {
  editor: {
    getEditors: () => MonacoEditor[]
  }
}

function getMonaco (): MonacoApi | undefined {
  if (!IN_BROWSER) return undefined
  return (globalThis as { monaco?: MonacoApi }).monaco
}

/** Format the active Monaco buffer via the editor's registered document formatter. */
export async function formatActiveFile () {
  const monaco = getMonaco()
  if (!monaco) return

  const editors = monaco.editor.getEditors()
  const editor = editors.find(item => item.hasTextFocus?.()) ?? editors[0]
  const action = editor?.getAction('editor.action.formatDocument')
  if (!action) return

  await action.run()
}
