// Types
import type { Component } from 'vue'

const modules = import.meta.glob('@/examples/**/*.vue', { eager: true })

// Glob all source files (vue, ts, js)
const rawVue = import.meta.glob('@/examples/**/*.vue', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const rawTs = import.meta.glob('@/examples/**/*.ts', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const rawJs = import.meta.glob('@/examples/**/*.js', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

const raw = { ...rawVue, ...rawTs, ...rawJs }

export interface ResolvedExample {
  component: Component | undefined
  code: string | undefined
}

export interface ResolvedFile {
  name: string
  code: string
  language: string
}

export interface ResolvedMultiExample {
  component: Component | undefined
  files: ResolvedFile[]
}

function getLanguage (path: string): string {
  const ext = path.split('.').pop() || ''
  if (ext === 'vue') return 'vue'
  if (ext === 'ts') return 'ts'
  if (ext === 'js') return 'js'
  return 'text'
}

// Find a key that ends with the given path suffix
function findKey (keys: string[], pathSuffix: string): string | undefined {
  // Normalize: ensure path starts with /
  const suffix = pathSuffix.startsWith('/') ? pathSuffix : `/${pathSuffix}`
  return keys.find(k => k.endsWith(suffix))
}

const moduleKeys = Object.keys(modules)
const rawKeys = Object.keys(raw)

export function useExamples () {
  function resolve (path: string): ResolvedExample {
    // Normalize path: remove leading slash if present
    const normalized = path.startsWith('/') ? path.slice(1) : path
    const suffix = `/${normalized}.vue`

    const moduleKey = findKey(moduleKeys, suffix)
    const rawKey = findKey(rawKeys, suffix)

    return {
      component: moduleKey ? (modules[moduleKey] as { default: Component })?.default : undefined,
      code: rawKey ? raw[rawKey] : undefined,
    }
  }

  function resolveMultiple (paths: string[]): ResolvedMultiExample {
    const files: ResolvedFile[] = []
    let component: Component | undefined
    let lastVueKey: string | undefined

    for (const path of paths) {
      const normalized = path.startsWith('/') ? path.slice(1) : path
      const suffix = `/${normalized}`
      const isExtensionless = !normalized.includes('.')

      // Try exact match first, then with .vue extension for extensionless paths
      const rawKey = findKey(rawKeys, suffix) ?? (isExtensionless ? findKey(rawKeys, `${suffix}.vue`) : undefined)
      const code = rawKey ? raw[rawKey] : undefined

      if (code) {
        const fileName = normalized.split('/').pop() || normalized
        files.push({
          name: rawKey?.split('/').pop() || fileName,
          code,
          language: getLanguage(rawKey || normalized),
        })
      }

      // Track last .vue file as the component (entry point)
      const vueSuffix = normalized.endsWith('.vue') ? suffix : (isExtensionless ? `${suffix}.vue` : undefined)
      if (vueSuffix) {
        const moduleKey = findKey(moduleKeys, vueSuffix)
        if (moduleKey) lastVueKey = moduleKey
      }
    }

    if (lastVueKey) {
      component = (modules[lastVueKey] as { default: Component })?.default
    }

    return { component, files }
  }

  return { resolve, resolveMultiple }
}
