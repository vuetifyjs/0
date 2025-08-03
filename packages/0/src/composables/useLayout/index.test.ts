import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useLayout } from './index.ts'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'

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
        const context = useLayout()
        return { context }
      },
      template: '<div></div>',
    })

    const mountedComponent = mount(testComponent)
    mountedComponent.vm.context.register({ id: 'Component1', position: 'top', size: 32 })
    mountedComponent.vm.context.register({ id: 'Component2', position: 'left', size: 128 })

    expect(mountedComponent.vm.context.width.value).toEqual(1024)
    expect(mountedComponent.vm.context.height.value).toEqual(768)
  })

  it('correctly calculates main', () => {
    const testComponent = defineComponent({
      setup () {
        const context = useLayout()
        return { context }
      },
      template: '<div></div>',
    })

    const mountedComponent = mount(testComponent)

    mountedComponent.vm.context.register({ id: 'Component1', position: 'top', size: 32 })
    mountedComponent.vm.context.register({ id: 'Component2', position: 'left', size: 128 })

    expect(mountedComponent.vm.context.main.x.value).toEqual(128)
    expect(mountedComponent.vm.context.main.y.value).toEqual(32)
    expect(mountedComponent.vm.context.main.width.value).toEqual(896)
    expect(mountedComponent.vm.context.main.height.value).toEqual(736)
  })
})

describe('useLayout outside component', () => {
  it('registers components', () => {
    const context = useLayout()
    context.register({ id: 'Component1', position: 'top', size: 32 })
    context.register({ id: 'Component2', position: 'bottom', size: 64 })
    expect(context.collection.has('Component1')).toEqual(true)
    expect(context.collection.has('Component2')).toEqual(true)
  })

  it('calculates bound', () => {
    const context = useLayout()
    context.register({ id: 'Component1', position: 'top', size: 32 })
    context.register({ id: 'Component2', position: 'bottom', size: 128 })
    context.register({ id: 'Component3', position: 'left', size: 64 })

    expect(context.bounds.top.value).toEqual(32)
    expect(context.bounds.bottom.value).toEqual(128)
    expect(context.bounds.left.value).toEqual(64)
  })
})
