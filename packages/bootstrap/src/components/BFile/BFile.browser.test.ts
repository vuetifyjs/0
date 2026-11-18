import { afterEach, describe, expect, it } from 'vitest'
import { userEvent } from 'vitest/browser'

// Components
import { BFile } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { ShallowRef, VNode } from 'vue'

const teardowns: (() => void)[] = []

function mount (node: () => VNode): HTMLElement {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render: node })
  app.mount(host)
  teardowns.push(() => {
    app.unmount()
    host.remove()
  })
  return host
}

afterEach(() => {
  while (teardowns.length > 0) {
    teardowns.pop()!()
  }
})

async function settle () {
  await nextTick()
  await nextTick()
}

describe('bFile', () => {
  it('should render an input with type file and form-control', async () => {
    const host = mount(() => h(BFile))
    await settle()

    const element = host.querySelector('input')!

    expect(element.type).toBe('file')
    expect(element.classList.contains('form-control')).toBe(true)
    expect(element.classList.contains('form-select')).toBe(false)
    expect(Object.hasOwn(element.dataset, 'bsToggle')).toBe(false)
  })

  it('should expose the FileList from the change event', async () => {
    const files: ShallowRef<FileList | null> = shallowRef(null)
    const host = mount(() => h(BFile, {
      'modelValue': files.value,
      'onUpdate:modelValue': (next: FileList | null) => {
        files.value = next
      },
    }))
    await settle()

    const file = new File(['hello'], 'note.txt', { type: 'text/plain' })
    await userEvent.upload(host.querySelector('input')!, file)

    expect(files.value).not.toBeNull()
    expect(files.value!.length).toBe(1)
    expect(files.value![0]!.name).toBe('note.txt')
  })
})
