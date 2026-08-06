import { describe, expect, it } from 'vitest'

// Components
import { BuFile } from './index'

// Utilities
import { createApp, h, nextTick } from 'vue'

import { conform } from '../../../harness/conform'

function mount (render: () => ReturnType<typeof h>) {
  const host = document.createElement('div')
  document.body.append(host)
  const app = createApp({ render })
  app.mount(host)
  const el = host.firstElementChild!
  function unmount () {
    app.unmount()
    host.remove()
  }
  return { el, unmount }
}

function pick (el: Element, filename: string) {
  const control = el.querySelector('input')!
  const transfer = new DataTransfer()
  transfer.items.add(new File(['content'], filename, { type: 'text/plain' }))
  control.files = transfer.files
  control.dispatchEvent(new Event('change'))
}

describe('buFile', () => {
  it('should conform to the Bulma file fixtures', () => {
    const basic = mount(() => h(BuFile, { name: 'resume' }))
    conform(basic.el, 'form-file')
    basic.unmount()

    const named = mount(() => h(BuFile, { filename: true, id: 'file-js-example', name: 'resume' }))
    // The docs fixture hooks its JS by an id on the root div; BuFile's `id`
    // targets the native input (label association), so skip id here.
    conform(named.el, 'form-file:js example', { ignoreAttrs: ['id'] })
    named.unmount()
  })

  it('should update the file name from the selected file', async () => {
    const selected: (FileList | null)[] = []
    const { el, unmount } = mount(() => h(BuFile, {
      filename: true,
      name: 'resume',
      onChange: (files: FileList | null) => selected.push(files),
    }))

    expect(el.querySelector('.file-name')!.textContent!.trim()).toBe('No file uploaded')

    pick(el, 'hello.txt')
    await nextTick()

    expect(el.querySelector('.file-name')!.textContent!.trim()).toBe('hello.txt')
    expect(selected).toHaveLength(1)
    expect(selected[0]![0].name).toBe('hello.txt')
    unmount()
  })
})
