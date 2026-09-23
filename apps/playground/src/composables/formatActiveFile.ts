// Utilities
import { format } from 'prettier/standalone'

// Framework
import { IN_BROWSER } from '@vuetify/v0'

// Types
import type { Plugin } from 'prettier'

export interface MonacoEditor {
  hasTextFocus?: () => boolean
  getAction: (id: string) => { run: () => void | Promise<void> } | null
  getModel?: () => MonacoModel | null
  onDidBlurEditorText?: (listener: () => void) => { dispose: () => void }
  updateOptions?: (options: { wordWrap: 'on' | 'off' }) => void
}

interface MonacoRange {
  startLineNumber: number
  startColumn: number
  endLineNumber: number
  endColumn: number
}

interface MonacoModel {
  getValue: () => string
  setValue: (value: string) => void
  uri: { path: string }
  getFullModelRange: () => MonacoRange
}

interface MonacoApi {
  editor: {
    getEditors: () => MonacoEditor[]
    onDidCreateEditor?: (listener: (editor: MonacoEditor) => void) => { dispose: () => void }
  }
  languages?: {
    registerDocumentFormattingEditProvider: (
      languageId: string,
      provider: {
        provideDocumentFormattingEdits: (model: MonacoModel) => Promise<Array<{ range: MonacoRange, text: string }>>
      },
    ) => { dispose: () => void }
  }
}

function getMonaco (): MonacoApi | undefined {
  if (!IN_BROWSER) return undefined
  return (globalThis as { monaco?: MonacoApi }).monaco
}

export function readMonaco (): MonacoApi | undefined {
  return getMonaco()
}

let plugins: Plugin[] | undefined

async function loadPlugins (): Promise<Plugin[]> {
  if (plugins) return plugins

  const modules = await Promise.all([
    import('prettier/plugins/html'),
    import('prettier/plugins/babel'),
    import('prettier/plugins/estree'),
    import('prettier/plugins/postcss'),
    import('prettier/plugins/typescript'),
  ])

  plugins = modules.map(mod => ('default' in mod ? mod.default : mod))
  return plugins
}

/** Prettier, with the same quote/semi choices Play uses. Parser follows the filename. */
export async function formatSource (code: string, filename: string): Promise<string> {
  return format(code, {
    filepath: filename,
    plugins: await loadPlugins(),
    semi: false,
    singleQuote: true,
    arrowParens: 'avoid',
  })
}

/** Store key for a Monaco model URI (`/src/App.vue` → `src/App.vue`). */
export function fileNameFromUri (path: string): string {
  return path.startsWith('/') ? path.slice(1) : path
}

/**
 * Format a snapshot. Unchanged text and Prettier parse errors return undefined
 * so the buffer is left alone. Any other failure rejects.
 */
export async function formatSnapshot (code: string, filename: string): Promise<string | undefined> {
  try {
    const text = await formatSource(code, filename)
    return text === code ? undefined : text
  } catch (error) {
    if (error instanceof SyntaxError) return undefined
    throw error
  }
}

let formatterRegistered = false

/**
 * Monaco has no formatter for `vue`. Register Prettier so Format and
 * auto-format share one path. A parse error leaves the buffer alone —
 * blur fires while the file is still incomplete.
 */
export function registerVueFormatter (monaco: MonacoApi) {
  if (formatterRegistered || !monaco.languages) return
  formatterRegistered = true

  monaco.languages.registerDocumentFormattingEditProvider('vue', {
    async provideDocumentFormattingEdits (model) {
      const current = model.getValue()
      const filename = fileNameFromUri(model.uri.path.length > 0 ? model.uri.path : 'App.vue')
      const text = await formatSnapshot(current, filename)
      if (!text) return []
      return [{ range: model.getFullModelRange(), text }]
    },
  })
}

/** Format one Monaco buffer via its registered document formatter. */
export async function formatEditor (editor: MonacoEditor) {
  const monaco = getMonaco()
  if (monaco) registerVueFormatter(monaco)

  const action = editor.getAction('editor.action.formatDocument')
  if (!action) return

  await action.run()
}

/**
 * Format the model that just blurred, then hand the result to `write`.
 * Does not call `formatDocument`: that action formats whatever model is
 * current when Prettier returns, and vue-repl's 250ms change handler would
 * assign that string to whichever file is active at flush time.
 */
export function attachFormatOnBlur (
  editor: MonacoEditor,
  enabled: () => boolean,
  write: (filename: string, code: string) => void,
) {
  return editor.onDidBlurEditorText?.(() => {
    if (!enabled()) return
    const model = editor.getModel?.()
    if (!model) return

    const filename = fileNameFromUri(model.uri.path)
    const snapshot = model.getValue()

    void formatSnapshot(snapshot, filename).then(text => {
      if (!text || model.getValue() !== snapshot) return
      write(filename, text)
      // A detached model does not emit the editor's content event, so a file
      // switch during the format cannot receive this string through the debounce.
      if (editor.getModel?.() === model) model.setValue(text)
    }).catch((error: unknown) => {
      console.error('[playground] format failed', error)
    })
  }) ?? { dispose () {} }
}

/** Format the active Monaco buffer via the editor's registered document formatter. */
export async function formatActiveFile () {
  const monaco = getMonaco()
  if (!monaco) return

  const editors = monaco.editor.getEditors()
  const editor = editors.find(item => item.hasTextFocus?.()) ?? editors[0]
  if (!editor) return

  await formatEditor(editor)
}
