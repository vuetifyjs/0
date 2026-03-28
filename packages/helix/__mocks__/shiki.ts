// Mock for shiki (optional peer dependency)
export function createHighlighter () {
  return Promise.resolve({
    codeToHtml: () => '',
    getLoadedLanguages: () => [],
    loadLanguage: () => Promise.resolve(),
  })
}
