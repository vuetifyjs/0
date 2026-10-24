/**
 * Extensions New File accepts.
 *
 * The Bin language picker (vuetifyjs/bin `supportedLanguages`) saves as
 * vue, js, ts, html, css, sass, sh, py, php, json, yaml, xml, sql, go, rs,
 * java, cpp, md, and txt. The rest are spellings of those same languages:
 * jsx/tsx (the REPL compiles them), htm, markdown, yml, bash/shell/zsh,
 * scss, and text.
 */
const CREATABLE_EXT = new Set([
  'bash',
  'cpp',
  'css',
  'go',
  'htm',
  'html',
  'java',
  'js',
  'json',
  'jsx',
  'markdown',
  'md',
  'php',
  'py',
  'rs',
  'sass',
  'scss',
  'sh',
  'shell',
  'sql',
  'text',
  'ts',
  'tsx',
  'txt',
  'vue',
  'xml',
  'yaml',
  'yml',
  'zsh',
])

/** True when New File should create `filename`. Folders and unknown types are false. */
export function isCreatableFile (filename: string): boolean {
  const slash = filename.lastIndexOf('/')
  const base = slash === -1 ? filename : filename.slice(slash + 1)
  const dot = base.lastIndexOf('.')
  if (dot <= 0) return false
  return CREATABLE_EXT.has(base.slice(dot + 1).toLowerCase())
}
