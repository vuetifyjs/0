import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createLayout } from './index.ts'
import { mount } from '@vue/test-utils'
import { defineComponent, useTemplateRef } from 'vue'
import { Atom } from '../../components/Atom'
import type { ShallowRef } from 'vue'

describe('useLayout inside component', () => {
  let originalWindow: any
  let mockWindow: any

  beforeEach(() => {
    originalWindow = global.window
    mockWindow = {
      innerWidth: 1024,
      innerHeight: 768,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }
    global.window! = mockWindow
  })

  afterEach(() => {
    global.window! = originalWindow
  })

  it('registers height and width in browser', () => {
    const testComponent = defineComponent({
      setup () {
        const layout = createLayout()[2]
        return { layout }
      },
      template: '<div></div>',
    })

    const mountedComponent = mount(testComponent)
    mountedComponent.vm.layout.register({ id: 'Component1', position: 'top', value: 32 })
    mountedComponent.vm.layout.register({ id: 'Component2', position: 'left', value: 128 })

    expect(mountedComponent.vm.layout.width.value).toEqual(1024)
    expect(mountedComponent.vm.layout.height.value).toEqual(768)
  })

  it('correctly calculates main', () => {
    const testComponent = defineComponent({
      setup () {
        const layout = createLayout()[2]
        return { layout }
      },
      template: '<div></div>',
    })

    const mountedComponent = mount(testComponent)

    mountedComponent.vm.layout.register({ id: 'Component1', position: 'top', value: 32 })
    mountedComponent.vm.layout.register({ id: 'Component2', position: 'left', value: 128 })

    expect(mountedComponent.vm.layout.main.x.value).toEqual(128)
    expect(mountedComponent.vm.layout.main.y.value).toEqual(32)
    expect(mountedComponent.vm.layout.main.width.value).toEqual(896)
    expect(mountedComponent.vm.layout.main.height.value).toEqual(736)
  })

  it('correctly calculates size from component', async () => {
    const testComponent = defineComponent({
      setup () {
        const layout = createLayout()[2]
        const element = useTemplateRef<HTMLElement>('element')

        const item = layout.register({
          id: 'testdiv',
          position: 'top',
          element,
        })

        return { item, layout }
      },
      template: '<div id="testdiv" ref="element" style="height: 50px"></div> <div style="height: 60px"></div>',
    })

    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get () {
        if (this.id === 'testdiv') {
          return 50
        }
      },
    })
    const mountedComponent = mount(testComponent)
    expect(mountedComponent.vm.item.size.value).toEqual(50)
    expect(mountedComponent.vm.layout.main.y.value).toEqual(50)
  })

  it('correctly calculates size from child Atom component', async () => {
    const testComponent = defineComponent({
      setup () {
        const layout = createLayout()[2]
        const element = useTemplateRef('element') as ShallowRef<HTMLElement | null>

        const item = layout.register({
          id: 'testdiv',
          position: 'top',
          element,
        })

        return { item, layout }
      },
      template: '<Atom ref="element" style="height:50px" id="atom"><div></div> </Atom>',
    })

    Object.defineProperty(HTMLElement.prototype, 'offsetHeight', {
      configurable: true,
      get () {
        if (this.id === 'atom') {
          return 50
        }
      },
    })
    const mountedComponent = mount(testComponent, {
      global: {
        components: { Atom },
      },
    })
    expect(mountedComponent.vm.item.size.value).toEqual(50)
    expect(mountedComponent.vm.layout.main.y.value).toEqual(50)
  })
})

describe('useLayout outside component', () => {
  it('registers components', () => {
    const layout = createLayout()[2]
    layout.register({ id: 'Component1', position: 'top', value: 32 })
    layout.register({ id: 'Component2', position: 'bottom', value: 64 })
    expect(layout.collection.has('Component1')).toEqual(true)
    expect(layout.collection.has('Component2')).toEqual(true)
  })

  it('calculates bound', () => {
    const layout = createLayout()[2]
    layout.register({ id: 'Component1', position: 'top', value: 32 })
    layout.register({ id: 'Component2', position: 'bottom', value: 128 })
    layout.register({ id: 'Component3', position: 'left', value: 64 })

    expect(layout.bounds.top.value).toEqual(32)
    expect(layout.bounds.bottom.value).toEqual(128)
    expect(layout.bounds.left.value).toEqual(64)
  })
})
