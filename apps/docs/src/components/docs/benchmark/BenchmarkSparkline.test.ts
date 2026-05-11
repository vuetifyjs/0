import { describe, expect, it } from 'vitest'

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

  it('should render one polyline with 4 coordinate pairs', () => {
    const wrapper = mount(BenchmarkSparkline, { props: { points } })
    const polyline = wrapper.find('polyline')
    expect(polyline.exists()).toBe(true)
    const coords = polyline.attributes('points')!.trim().split(/\s+/)
    expect(coords).toHaveLength(4)
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

  it('should wrap each circle with a title element for native tooltip', () => {
    const wrapper = mount(BenchmarkSparkline, { props: { points } })
    const titles = wrapper.findAll('title')
    expect(titles).toHaveLength(4)
    expect(titles[0].text()).toContain('0.1.0')
    expect(titles[3].text()).toContain('current')
  })
})
