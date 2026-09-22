import { describe, expect, it, vi } from 'vitest'

// Context
import DocsFaq from './DocsFaq.vue'
import DocsFaqItem from './DocsFaqItem.vue'

// Utilities
import { flushPromises, mount } from '@vue/test-utils'
import { h } from 'vue'

vi.mock('./DocsCallout.vue', () => ({
  default: { name: 'DocsCallout', template: '<div />' },
}))

const stubs = {
  DocsCallout: true,
  DocsSearchInput: {
    props: ['modelValue', 'placeholder'],
    emits: ['update:modelValue'],
    template: '<input class="faq-search" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
  },
}

function mountFaq (n: number) {
  return mount(DocsFaq, {
    global: { stubs },
    slots: {
      default: () => Array.from({ length: n }, (_, index) =>
        h(DocsFaqItem, { question: `Question ${index + 1}` }, () => `Answer ${index + 1}`),
      ),
    },
  })
}

function visibleQuestions (wrapper: ReturnType<typeof mountFaq>) {
  return wrapper.findAllComponents(DocsFaqItem).filter(item => {
    return (item.element as HTMLElement).style.display !== 'none'
  })
}

describe('docsFaq', () => {
  it('should not render search or peek below 5 items', () => {
    const wrapper = mountFaq(4)
    expect(wrapper.find('.faq-search').exists()).toBe(false)
    expect(wrapper.find('.genesis-peek').exists()).toBe(false)
    expect(visibleQuestions(wrapper)).toHaveLength(4)
  })

  it('should render search without peek at 5 and 6 items', () => {
    for (const n of [5, 6]) {
      const wrapper = mountFaq(n)
      expect(wrapper.find('.faq-search').exists()).toBe(true)
      expect(wrapper.find('.genesis-peek').exists()).toBe(false)
      expect(visibleQuestions(wrapper)).toHaveLength(n)
    }
  })

  it('should clip to the first 5 questions when there are 7 or more', () => {
    const wrapper = mountFaq(7)
    expect(wrapper.find('.faq-search').exists()).toBe(true)
    expect(visibleQuestions(wrapper)).toHaveLength(5)
    const peek = wrapper.get('.genesis-peek')
    expect(peek.attributes('aria-expanded')).toBe('false')
    expect(peek.attributes('aria-label')).toBe('Expand FAQ')
    expect(peek.text()).toContain('Expand')
  })

  it('should reveal every question when Expand is clicked, and clip again on Collapse', async () => {
    const wrapper = mountFaq(7)
    await wrapper.get('.genesis-peek').trigger('click')
    expect(visibleQuestions(wrapper)).toHaveLength(7)
    expect(wrapper.get('.genesis-peek').attributes('aria-expanded')).toBe('true')
    expect(wrapper.get('.genesis-peek').text()).toContain('Collapse')

    await wrapper.get('.genesis-peek').trigger('click')
    expect(visibleQuestions(wrapper)).toHaveLength(5)
    expect(wrapper.get('.genesis-peek').attributes('aria-expanded')).toBe('false')
  })

  it('should unclip matching items and hide the pill while searching', async () => {
    const wrapper = mountFaq(7)
    await wrapper.get('.faq-search').setValue('Question 7')
    await flushPromises()
    expect(wrapper.find('.genesis-peek').exists()).toBe(false)
    expect(visibleQuestions(wrapper)).toHaveLength(1)
    expect(visibleQuestions(wrapper)[0].props('question')).toBe('Question 7')
  })

  it('should re-clip after the search query is cleared if Expand was never clicked', async () => {
    const wrapper = mountFaq(7)
    await wrapper.get('.faq-search').setValue('Question 7')
    await flushPromises()
    await wrapper.get('.faq-search').setValue('')
    await flushPromises()
    expect(wrapper.find('.genesis-peek').exists()).toBe(true)
    expect(visibleQuestions(wrapper)).toHaveLength(5)
  })

  it('should render inline code in the question instead of raw backticks', () => {
    const wrapper = mount(DocsFaq, {
      global: { stubs },
      slots: {
        default: () => h(DocsFaqItem, { question: 'What is `foo`?' }, () => 'Answer'),
      },
    })
    expect(wrapper.find('code').text()).toBe('foo')
    expect(wrapper.text()).not.toContain('`foo`')
  })

  it('should prefer the question slot over the raw question string', () => {
    const wrapper = mount(DocsFaq, {
      global: { stubs },
      slots: {
        default: () => h(DocsFaqItem, { question: 'What is `foo`?' }, {
          question: () => h('code', { class: 'from-slot' }, 'foo'),
          default: () => 'Answer',
        }),
      },
    })
    expect(wrapper.find('code.from-slot').text()).toBe('foo')
    expect(wrapper.findAll('code')).toHaveLength(1)
  })
})
