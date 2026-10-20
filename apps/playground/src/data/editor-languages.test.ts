import { describe, expect, it } from 'vitest'

// Components
import { binFileExt } from '@/components/playground/open/types'

import { editorLanguage } from './editor-languages'

const BIN = [
  'vue',
  'javascript',
  'typescript',
  'css',
  'json',
  'html',
  'markdown',
  'sass',
  'shell',
  'python',
  'php',
  'yaml',
  'xml',
  'sql',
  'go',
  'rust',
  'java',
  'cpp',
  'text',
]

const OWNED = new Set(['vue', 'js', 'ts', 'css', 'txt'])

describe('editorLanguage', () => {
  it('should color every bin language vue-repl does not already color', () => {
    for (const language of BIN) {
      const ext = binFileExt(language)
      const id = editorLanguage(`src/file.${ext}`)
      if (OWNED.has(ext)) expect(id).toBeUndefined()
      else expect(id).toBeTruthy()
    }
  })

  it('should read the last extension', () => {
    expect(editorLanguage('src/notes.md')).toBe('markdown')
    expect(editorLanguage('src/app.py')).toBe('python')
    expect(editorLanguage('src/run.sh')).toBe('shellscript')
    expect(editorLanguage('config.yaml')).toBe('yaml')
    expect(editorLanguage('config.yml')).toBe('yaml')
    expect(editorLanguage('page.html')).toBe('html')
    expect(editorLanguage('data.json')).toBe('json')
    expect(editorLanguage('src/main.cpp')).toBe('cpp')
    expect(editorLanguage('SRC/APP.PY')).toBe('python')
    expect(editorLanguage('src/file.test.py')).toBe('python')
  })

  it('should leave vue-repl languages and dotfiles alone', () => {
    expect(editorLanguage('src/App.vue')).toBeUndefined()
    expect(editorLanguage('src/main.ts')).toBeUndefined()
    expect(editorLanguage('src/app.js')).toBeUndefined()
    expect(editorLanguage('src/style.css')).toBeUndefined()
    expect(editorLanguage('src/notes.txt')).toBeUndefined()
    expect(editorLanguage('.gitignore')).toBeUndefined()
    expect(editorLanguage('Dockerfile')).toBeUndefined()
  })
})
