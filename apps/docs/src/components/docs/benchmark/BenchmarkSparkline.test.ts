import { describe, expect, it } from 'vitest'

// Context
import BenchmarkSparkline from './BenchmarkSparkline.vue'

// Utilities
import { mount } from '@vue/test-utils'

const points = [
  { label: '0.1.0', value: 20_000, isCurrent: false },
  { label: '0.2.0', value: 22_000, isCurrent: false },
  { label: '1.0.0-alpha.0', value: 25_000, isCurrent: false },
  { label: 'current', value: 16_000, isCurrent: true },
]

describe('benchmarkSparkline', () => {
  it('should render one circle per point', () => {
    const wrapper = mount(BenchmarkSparkline, { props: { points } })
    expect(wrapper.findAll('circle')).toHaveLength(4)
  })

  it('should render a curve through every point', () => {
    const wrapper = mount(BenchmarkSparkline, { props: { points } })
    const curve = wrapper.find('path')
    expect(curve.exists()).toBe(true)
    const d = curve.attributes('d') ?? ''
    expect(d.startsWith('M ')).toBe(true)
    expect(d.match(/ C /g)).toHaveLength(3)
  })

  it('should mark only the latest point once history is dense', () => {
    const dense = Array.from({ length: 8 }, (_, index) => ({
      label: `1.${index}.0`,
      value: 10_000 + index * 500,
      isCurrent: index === 7,
    }))
    const wrapper = mount(BenchmarkSparkline, { props: { points: dense } })
    const circles = wrapper.findAll('circle')
    expect(circles).toHaveLength(1)
    expect(circles[0]?.attributes('fill')).toBe('none')
    expect(wrapper.find('path').attributes('d')).toContain(' C ')
  })

  it('should render a single marker and no curve for one point', () => {
    const wrapper = mount(BenchmarkSparkline, {
      props: { points: [{ label: '1.0.0', value: 1_000 }] },
    })
    expect(wrapper.find('path').exists()).toBe(false)
    expect(wrapper.findAll('circle')).toHaveLength(1)
  })

  it('should render nothing drawable for an empty series', () => {
    const wrapper = mount(BenchmarkSparkline, { props: { points: [] } })
    expect(wrapper.find('path').exists()).toBe(false)
    expect(wrapper.findAll('circle')).toHaveLength(0)
  })

  it('should hollow out the last circle when it is the current point', () => {
    const wrapper = mount(BenchmarkSparkline, { props: { points } })
    const circles = wrapper.findAll('circle')
    expect(circles[0].attributes('fill')).toBe('currentColor')
    expect(circles[3].attributes('fill')).toBe('none')
    expect(circles[3].attributes('stroke')).toBe('currentColor')
  })

  it('should set tier color class on the root svg', () => {
    const wrapper = mount(BenchmarkSparkline, { props: { points, tier: 'blazing' } })
    expect(wrapper.find('svg').classes()).toContain('text-error')
  })

  it('should fall back to text-on-surface-variant when no tier is supplied', () => {
    const wrapper = mount(BenchmarkSparkline, { props: { points } })
    expect(wrapper.find('svg').classes()).toContain('text-on-surface-variant')
  })
})
