// Data
import { editorLanguage } from '@/data/editor-languages'

const LINE_LIMIT = 20_000
const TIME_LIMIT = 500

interface LineToken {
  startIndex: number
  scopes: string[]
}

interface LineResult {
  tokens: LineToken[]
  ruleStack: unknown
}

interface Grammar {
  tokenizeLine: (line: string, state: unknown, timeLimit?: number) => LineResult
}

interface Highlighter {
  loadLanguage: (lang: unknown) => Promise<void>
  getLanguage: (id: string) => Grammar
}

interface EditorModel {
  uri: { path: string }
  isDisposed?: () => boolean
  getLanguageId?: () => string
}

interface HighlightMonaco {
  languages: {
    getLanguages: () => Array<{ id: string }>
    register: (language: { id: string }) => void
    setTokensProvider: (id: string, provider: {
      getInitialState: () => StackState
      tokenize: (line: string, state: StackState) => { endState: StackState, tokens: Array<{ startIndex: number, scopes: string }> }
    }) => void
  }
  editor: {
    getModels: () => EditorModel[]
    onDidCreateModel: (listener: (model: EditorModel) => void) => { dispose: () => void }
    setModelLanguage: (model: EditorModel, languageId: string) => void
  }
}

class StackState {
  constructor (readonly stack: unknown) {}

  clone () {
    return new StackState(this.stack)
  }

  equals (other: unknown) {
    return other instanceof StackState && other.stack === this.stack
  }
}

const LOADERS: Record<string, () => Promise<{ default: unknown }>> = {
  markdown: () => import('@shikijs/langs/markdown'),
  sass: () => import('@shikijs/langs/sass'),
  shellscript: () => import('@shikijs/langs/shellscript'),
  python: () => import('@shikijs/langs/python'),
  php: () => import('@shikijs/langs/php'),
  yaml: () => import('@shikijs/langs/yaml'),
  xml: () => import('@shikijs/langs/xml'),
  sql: () => import('@shikijs/langs/sql'),
  go: () => import('@shikijs/langs/go'),
  rust: () => import('@shikijs/langs/rust'),
  java: () => import('@shikijs/langs/java'),
  cpp: () => import('@shikijs/langs/cpp'),
  json: () => import('@shikijs/langs/json'),
  html: () => import('@shikijs/langs/html'),
}

let highlighterPromise: Promise<Highlighter> | undefined
const loading = new Map<string, Promise<Grammar>>()
const provided = new Set<string>()

function highlighter (): Promise<Highlighter> {
  highlighterPromise ??= (async (): Promise<Highlighter> => {
    const [{ createHighlighterCore }, { createJavaScriptRegexEngine }, dark, light] = await Promise.all([
      import('shiki/core'),
      import('shiki/engine/javascript'),
      import('@shikijs/themes/dark-plus'),
      import('@shikijs/themes/light-plus'),
    ])
    return createHighlighterCore({
      themes: [dark.default, light.default],
      langs: [],
      engine: createJavaScriptRegexEngine(),
    }) as unknown as Highlighter
  })()
  return highlighterPromise
}

/** Load one Bin grammar. Later calls for the same id share the first load. */
export function loadGrammar (id: string): Promise<Grammar> {
  const pending = loading.get(id)
  if (pending) return pending

  const loader = LOADERS[id]
  if (!loader) return Promise.reject(new Error(`[playground] no grammar for ${id}`))

  const job = (async () => {
    const mod = await loader()
    const core = await highlighter()
    await core.loadLanguage(mod.default)
    return core.getLanguage(id)
  })()

  loading.set(id, job)
  return job
}

function skip (path: string) {
  return path.includes('/node_modules/') || path.startsWith('/node_modules')
}

function tokensOf (grammar: Grammar, line: string, state: StackState) {
  if (line.length >= LINE_LIMIT) {
    return {
      endState: state,
      tokens: [{ startIndex: 0, scopes: '' }],
    }
  }

  const result = grammar.tokenizeLine(line, state.stack, TIME_LIMIT)
  const tokens = result.tokens.map(token => ({
    startIndex: token.startIndex,
    scopes: token.scopes.at(-1) ?? '',
  }))
  if (tokens.length === 0 || tokens[0]?.startIndex !== 0) {
    tokens.unshift({ startIndex: 0, scopes: '' })
  }
  return {
    endState: new StackState(result.ruleStack),
    tokens,
  }
}

function isFn (value: unknown): boolean {
  return typeof value === 'function'
}

function isHighlightMonaco (monaco: object): monaco is HighlightMonaco {
  const candidate = monaco as Partial<HighlightMonaco>
  return Boolean(
    candidate.languages
    && isFn(candidate.languages.getLanguages)
    && isFn(candidate.languages.register)
    && isFn(candidate.languages.setTokensProvider)
    && candidate.editor
    && isFn(candidate.editor.getModels)
    && isFn(candidate.editor.onDidCreateModel)
    && isFn(candidate.editor.setModelLanguage),
  )
}

/**
 * Color Bin files vue-repl leaves as JavaScript or as an unregistered id.
 * Grammars load the first time a file of that type is opened.
 */
export function highlightBinFiles (input: object): { dispose: () => void } | undefined {
  if (!isHighlightMonaco(input)) return undefined
  const monaco = input

  const known = new Set(monaco.languages.getLanguages().map(language => language.id))

  function provide (id: string, grammar: Grammar) {
    if (provided.has(id)) return
    if (!known.has(id)) {
      monaco.languages.register({ id })
      known.add(id)
    }
    monaco.languages.setTokensProvider(id, {
      getInitialState: () => new StackState(null),
      tokenize: (line, state) => tokensOf(grammar, line, state),
    })
    provided.add(id)
  }

  function paint (model: EditorModel) {
    if (skip(model.uri.path)) return
    const id = editorLanguage(model.uri.path)
    if (!id) return
    void loadGrammar(id).then(grammar => {
      if (model.isDisposed?.()) return
      provide(id, grammar)
      if (model.getLanguageId?.() !== id) monaco.editor.setModelLanguage(model, id)
    }).catch(error => {
      console.warn(`[playground] no highlighter for ${id}`, error)
    })
  }

  for (const model of monaco.editor.getModels()) paint(model)
  return monaco.editor.onDidCreateModel(paint)
}
