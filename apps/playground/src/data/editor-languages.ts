/**
 * Monaco language id for a filename the Bin copy path can create.
 *
 * Vue, JavaScript, TypeScript, and CSS stay on vue-repl's highlighter.
 * Plain text has no grammar. Everything else Bin can store is colored here.
 */
const EXT_LANG: Record<string, string> = {
  md: 'markdown',
  markdown: 'markdown',
  sass: 'sass',
  sh: 'shellscript',
  bash: 'shellscript',
  shell: 'shellscript',
  py: 'python',
  php: 'php',
  yaml: 'yaml',
  yml: 'yaml',
  xml: 'xml',
  sql: 'sql',
  go: 'go',
  rs: 'rust',
  java: 'java',
  cpp: 'cpp',
  json: 'json',
  html: 'html',
  htm: 'html',
}

/** Shiki / Monaco id for a Bin file, or undefined when vue-repl already colors it. */
export function editorLanguage (filename: string): string | undefined {
  const slash = filename.lastIndexOf('/')
  const base = (slash === -1 ? filename : filename.slice(slash + 1)).toLowerCase()
  const dot = base.lastIndexOf('.')
  if (dot <= 0) return undefined
  return EXT_LANG[base.slice(dot + 1)]
}
