import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { createLayout } from './index.ts'
import { mount } from '@vue/test-utils'
import { defineComponent, useTemplateRef } from 'vue'

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
        const context = createLayout()[2]
        return { context }
      },
      template: '<div></div>',
    })

    const mountedComponent = mount(testComponent)
    mountedComponent.vm.context.register({ id: 'Component1', position: 'top', value: 32 })
    mountedComponent.vm.context.register({ id: 'Component2', position: 'left', value: 128 })

    expect(mountedComponent.vm.context.width.value).toEqual(1024)
    expect(mountedComponent.vm.context.height.value).toEqual(768)
  })

  it('correctly calculates main', () => {
    const testComponent = defineComponent({
      setup () {
        const context = createLayout()[2]
        return { context }
      },
      template: '<div></div>',
    })

    const mountedComponent = mount(testComponent)

    mountedComponent.vm.context.register({ id: 'Component1', position: 'top', value: 32 })
    mountedComponent.vm.context.register({ id: 'Component2', position: 'left', value: 128 })

    expect(mountedComponent.vm.context.main.x.value).toEqual(128)
    expect(mountedComponent.vm.context.main.y.value).toEqual(32)
    expect(mountedComponent.vm.context.main.width.value).toEqual(896)
    expect(mountedComponent.vm.context.main.height.value).toEqual(736)
  })

  it('correctly calculates size from component', async () => {
    const testComponent = defineComponent({
      setup () {
        const context = createLayout()[2]
        const element = useTemplateRef<HTMLElement>('element')

        const item = context.register({
          id: 'testdiv',
          position: 'top',
          element,
        })

        return { item, context }
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
    expect(mountedComponent.vm.context.main.y.value).toEqual(50)
  })
})

describe('useLayout outside component', () => {
  it('registers components', () => {
    const context = createLayout()[2]
    context.register({ id: 'Component1', position: 'top', value: 32 })
    context.register({ id: 'Component2', position: 'bottom', value: 64 })
    expect(context.collection.has('Component1')).toEqual(true)
    expect(context.collection.has('Component2')).toEqual(true)
  })

  it('calculates bound', () => {
    const context = createLayout()[2]
    context.register({ id: 'Component1', position: 'top', value: 32 })
    context.register({ id: 'Component2', position: 'bottom', value: 128 })
    context.register({ id: 'Component3', position: 'left', value: 64 })

    expect(context.bounds.top.value).toEqual(32)
    expect(context.bounds.bottom.value).toEqual(128)
    expect(context.bounds.left.value).toEqual(64)
  })
})
