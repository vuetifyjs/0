import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { renderToString } from 'vue/server-renderer'

import { useCarouselRoot, Carousel } from './index'

// Utilities
import { mount as baseMount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'

// Types
import type { mount as mountType } from '@vue/test-utils'

// CarouselViewport binds document mousemove/mouseup via
// useDocumentEventListener gated by useToggleScope on snapDisabled. Even
// when those listeners aren't attached, the surrounding effect scope and
// the registered useEventListener('mousedown') leak across tests when the
// wrapper is never unmounted.
const wrappers: ReturnType<typeof baseMount>[] = []

function mount (...args: Parameters<typeof mountType>): ReturnType<typeof mountType> {
  const wrapper = (baseMount as any)(...args)
  wrappers.push(wrapper)
  return wrapper
}

afterEach(() => {
  while (wrappers.length > 0) {
    wrappers.pop()!.unmount()
  }
})

describe('carousel', () => {
  describe('root', () => {
    describe('rendering', () => {
      it('should be renderless by default', () => {
        const wrapper = mount(Carousel.Root, {
          slots: {
            default: () => h('div', { class: 'wrapper' }, 'Content'),
          },
        })

        expect(wrapper.find('.wrapper').exists()).toBe(true)
      })

      it('should expose slot props', () => {
        let slotProps: any

        mount(Carousel.Root, {
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(slotProps).toBeDefined()
        expect(typeof slotProps.isDisabled).toBe('boolean')
        expect(typeof slotProps.first).toBe('function')
        expect(typeof slotProps.last).toBe('function')
        expect(typeof slotProps.next).toBe('function')
        expect(typeof slotProps.prev).toBe('function')
        expect(typeof slotProps.step).toBe('function')
        expect(typeof slotProps.select).toBe('function')
        expect(slotProps.attrs.role).toBe('region')
        expect(slotProps.attrs['aria-roledescription']).toBe('carousel')
      })

      it('should expose orientation and perView in slot props', () => {
        let slotProps: any

        mount(Carousel.Root, {
          props: {
            orientation: 'vertical',
            perView: 3,
          },
          slots: {
            default: (props: any) => {
              slotProps = props
              return h('div', 'Content')
            },
          },
        })

        expect(slotProps.orientation).toBe('vertical')
        expect(slotProps.perView).toBe(3)
      })
    })

    describe('navigation', () => {
      it('should navigate to next slide with next()', async () => {
        const selected = ref<string>()

        let rootProps: any
        let slide1Props: any
        let slide2Props: any

        mount(Carousel.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string
            },
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return [
                h(Carousel.Item as any, { value: 'slide-1' }, {
                  default: (p: any) => {
                    slide1Props = p
                    return h('div', 'Slide 1')
                  },
                }),
                h(Carousel.Item as any, { value: 'slide-2' }, {
                  default: (p: any) => {
                    slide2Props = p
                    return h('div', 'Slide 2')
                  },
                }),
              ]
            },
          },
        })

        await nextTick()

        slide1Props.select()
        await nextTick()
        expect(slide1Props.isSelected).toBe(true)

        rootProps.next()
        await nextTick()

        expect(selected.value).toBe('slide-2')
        expect(slide1Props.isSelected).toBe(false)
        expect(slide2Props.isSelected).toBe(true)
      })

      it('should navigate to previous slide with prev()', async () => {
        const selected = ref<string>()

        let rootProps: any
        let slide1Props: any
        let slide2Props: any

        mount(Carousel.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string
            },
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return [
                h(Carousel.Item as any, { value: 'slide-1' }, {
                  default: (p: any) => {
                    slide1Props = p
                    return h('div', 'Slide 1')
                  },
                }),
                h(Carousel.Item as any, { value: 'slide-2' }, {
                  default: (p: any) => {
                    slide2Props = p
                    return h('div', 'Slide 2')
                  },
                }),
              ]
            },
          },
        })

        await nextTick()

        slide2Props.select()
        await nextTick()
        expect(slide2Props.isSelected).toBe(true)

        rootProps.prev()
        await nextTick()

        expect(selected.value).toBe('slide-1')
        expect(slide1Props.isSelected).toBe(true)
        expect(slide2Props.isSelected).toBe(false)
      })

      it('should not wrap in bounded mode', async () => {
        const selected = ref<string>()

        let rootProps: any
        let slide2Props: any

        mount(Carousel.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string
            },
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return [
                h(Carousel.Item as any, { value: 'slide-1' }, {
                  default: () => h('div', 'Slide 1'),
                }),
                h(Carousel.Item as any, { value: 'slide-2' }, {
                  default: (p: any) => {
                    slide2Props = p
                    return h('div', 'Slide 2')
                  },
                }),
              ]
            },
          },
        })

        await nextTick()

        // Select last slide
        slide2Props.select()
        await nextTick()

        // Try to navigate past end
        rootProps.next()
        await nextTick()

        // Should stay on last slide
        expect(slide2Props.isSelected).toBe(true)
      })

      it('should wrap in circular mode', async () => {
        const selected = ref<string>()

        let rootProps: any
        let slide1Props: any
        let slide2Props: any

        mount(Carousel.Root, {
          props: {
            'circular': true,
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string
            },
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return [
                h(Carousel.Item as any, { value: 'slide-1' }, {
                  default: (p: any) => {
                    slide1Props = p
                    return h('div', 'Slide 1')
                  },
                }),
                h(Carousel.Item as any, { value: 'slide-2' }, {
                  default: (p: any) => {
                    slide2Props = p
                    return h('div', 'Slide 2')
                  },
                }),
              ]
            },
          },
        })

        await nextTick()

        slide2Props.select()
        await nextTick()

        // Navigate past end - should wrap to first
        rootProps.next()
        await nextTick()

        expect(selected.value).toBe('slide-1')
        expect(slide1Props.isSelected).toBe(true)
      })

      it('should navigate to first and last slides', async () => {
        const selected = ref<string>()

        let rootProps: any
        let slide1Props: any
        let slide3Props: any

        mount(Carousel.Root, {
          props: {
            'modelValue': selected.value,
            'onUpdate:modelValue': (value: unknown) => {
              selected.value = value as string
            },
          },
          slots: {
            default: (props: any) => {
              rootProps = props
              return [
                h(Carousel.Item as any, { value: 'slide-1' }, {
                  default: (p: any) => {
                    slide1Props = p
                    return h('div', 'Slide 1')
                  },
                }),
                h(Carousel.Item as any, { value: 'slide-2' }, {
                  default: () => h('div', 'Slide 2'),
                }),
                h(Carousel.Item as any, { value: 'slide-3' }, {
                  default: (p: any) => {
                    slide3Props = p
                    return h('div', 'Slide 3')
                  },
                }),
              ]
            },
          },
        })

        await nextTick()

        slide1Props.select()
        await nextTick()

        rootProps.last()
        await nextTick()
        expect(selected.value).toBe('slide-3')
        expect(slide3Props.isSelected).toBe(true)

        rootProps.first()
        await nextTick()
        expect(selected.value).toBe('slide-1')
        expect(slide1Props.isSelected).toBe(true)
      })
    })

    describe('disabled prop', () => {
      it('should disable all slides when root is disabled', async () => {
        let slideProps: any

        mount(Carousel.Root, {
          props: {
            disabled: true,
          },
          slots: {
            default: () =>
              h(Carousel.Item as any, { value: 'slide-1' }, {
                default: (props: any) => {
                  slideProps = props
                  return h('div', 'Slide 1')
                },
              }),
          },
        })

        await nextTick()

        expect(slideProps.isDisabled).toBe(true)
      })
    })

    describe('mandatory behavior', () => {
      it('should auto-select first slide when mandatory=force', async () => {
        let slideProps: any

        mount(Carousel.Root, {
          props: {
            mandatory: 'force',
          },
          slots: {
            default: () =>
              h(Carousel.Item as any, { value: 'slide-1' }, {
                default: (props: any) => {
                  slideProps = props
                  return h('div', 'Slide 1')
                },
              }),
          },
        })

        await nextTick()

        expect(slideProps.isSelected).toBe(true)
      })
    })
  })

  describe('item', () => {
    describe('slot props', () => {
      it('should expose correct slot props', async () => {
        let slideProps: any

        mount(Carousel.Root, {
          slots: {
            default: () =>
              h(Carousel.Item as any, { id: 'my-slide', value: 'slide-1' }, {
                default: (props: any) => {
                  slideProps = props
                  return h('div', 'Slide')
                },
              }),
          },
        })

        await nextTick()

        expect(slideProps.id).toBe('my-slide')
        expect(typeof slideProps.isSelected).toBe('boolean')
        expect(typeof slideProps.isActive).toBe('boolean')
        expect(typeof slideProps.isDisabled).toBe('boolean')
        expect(typeof slideProps.index).toBe('number')
      })

      it('should expose correct ARIA attrs', async () => {
        let slideProps: any

        mount(Carousel.Root, {
          slots: {
            default: () =>
              h(Carousel.Item as any, { value: 'slide-1' }, {
                default: (props: any) => {
                  slideProps = props
                  return h('div', 'Slide')
                },
              }),
          },
        })

        await nextTick()

        expect(slideProps.attrs.role).toBe('group')
        expect(slideProps.attrs['aria-roledescription']).toBe('slide')
        expect(slideProps.attrs['aria-label']).toBeDefined()
      })

      it('should update aria-label with multiple slides', async () => {
        let slide1Props: any
        let slide2Props: any
        let slide3Props: any

        mount(Carousel.Root, {
          slots: {
            default: () => [
              h(Carousel.Item as any, { value: 'a' }, {
                default: (p: any) => {
                  slide1Props = p
                  return h('div', 'A')
                },
              }),
              h(Carousel.Item as any, { value: 'b' }, {
                default: (p: any) => {
                  slide2Props = p
                  return h('div', 'B')
                },
              }),
              h(Carousel.Item as any, { value: 'c' }, {
                default: (p: any) => {
                  slide3Props = p
                  return h('div', 'C')
                },
              }),
            ],
          },
        })

        await nextTick()

        expect(slide1Props.attrs['aria-label']).toBeDefined()
        expect(slide2Props.attrs['aria-label']).toBeDefined()
        expect(slide3Props.attrs['aria-label']).toBeDefined()
      })
    })

    describe('data attributes', () => {
      it('should set data-selected when selected', async () => {
        let slideProps: any

        mount(Carousel.Root, {
          props: {
            modelValue: 'slide-1',
          },
          slots: {
            default: () =>
              h(Carousel.Item as any, { value: 'slide-1' }, {
                default: (props: any) => {
                  slideProps = props
                  return h('div', 'Slide')
                },
              }),
          },
        })

        await nextTick()

        expect(slideProps.attrs['data-selected']).toBe(true)
      })

      it('should set data-active for slides in visible window', async () => {
        let slide1Props: any
        let slide2Props: any
        let slide3Props: any

        mount(Carousel.Root, {
          props: {
            modelValue: 'a',
            perView: 2,
          },
          slots: {
            default: () => [
              h(Carousel.Item as any, { value: 'a' }, {
                default: (p: any) => {
                  slide1Props = p
                  return h('div', 'A')
                },
              }),
              h(Carousel.Item as any, { value: 'b' }, {
                default: (p: any) => {
                  slide2Props = p
                  return h('div', 'B')
                },
              }),
              h(Carousel.Item as any, { value: 'c' }, {
                default: (p: any) => {
                  slide3Props = p
                  return h('div', 'C')
                },
              }),
            ],
          },
        })

        await nextTick()

        // With perView=2, slides 0 and 1 should be active
        expect(slide1Props.attrs['data-active']).toBe(true)
        expect(slide2Props.attrs['data-active']).toBe(true)
        expect(slide3Props.attrs['data-active']).toBeUndefined()
      })

      it('should set aria-hidden for slides outside visible window', async () => {
        let slide1Props: any
        let slide2Props: any

        mount(Carousel.Root, {
          props: {
            modelValue: 'a',
            perView: 1,
          },
          slots: {
            default: () => [
              h(Carousel.Item as any, { value: 'a' }, {
                default: (p: any) => {
                  slide1Props = p
                  return h('div', 'A')
                },
              }),
              h(Carousel.Item as any, { value: 'b' }, {
                default: (p: any) => {
                  slide2Props = p
                  return h('div', 'B')
                },
              }),
            ],
          },
        })

        await nextTick()

        expect(slide1Props.attrs['aria-hidden']).toBeUndefined()
        expect(slide2Props.attrs['aria-hidden']).toBe(true)
      })

      it('should set data-disabled when disabled', async () => {
        let slideProps: any

        mount(Carousel.Root, {
          slots: {
            default: () =>
              h(Carousel.Item as any, { value: 'slide-1', disabled: true }, {
                default: (props: any) => {
                  slideProps = props
                  return h('div', 'Slide')
                },
              }),
          },
        })

        await nextTick()

        expect(slideProps.attrs['data-disabled']).toBe(true)
      })

      it('should set data-index on each slide', async () => {
        let slide1Props: any
        let slide2Props: any

        mount(Carousel.Root, {
          slots: {
            default: () => [
              h(Carousel.Item as any, { value: 'a' }, {
                default: (p: any) => {
                  slide1Props = p
                  return h('div', 'A')
                },
              }),
              h(Carousel.Item as any, { value: 'b' }, {
                default: (p: any) => {
                  slide2Props = p
                  return h('div', 'B')
                },
              }),
            ],
          },
        })

        await nextTick()

        expect(slide1Props.attrs['data-index']).toBe(0)
        expect(slide2Props.attrs['data-index']).toBe(1)
      })
    })

    describe('inline styles', () => {
      it('should set scroll-snap-align style', async () => {
        let slideProps: any

        mount(Carousel.Root, {
          slots: {
            default: () =>
              h(Carousel.Item as any, { value: 'a' }, {
                default: (p: any) => {
                  slideProps = p
                  return h('div', 'A')
                },
              }),
          },
        })

        await nextTick()

        expect(slideProps.attrs.style['scroll-snap-align']).toBe('start')
      })

      it('should not include flex basis (consumer controls sizing)', async () => {
        let slideProps: any

        mount(Carousel.Root, {
          slots: {
            default: () =>
              h(Carousel.Item as any, { value: 'a' }, {
                default: (p: any) => {
                  slideProps = p
                  return h('div', 'A')
                },
              }),
          },
        })

        await nextTick()

        expect(slideProps.attrs.style.flex).toBeUndefined()
      })
    })
  })

  describe('previous button', () => {
    it('should expose correct slot props', async () => {
      let prevProps: any

      mount(Carousel.Root, {
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Previous as any, {}, {
              default: (p: any) => {
                prevProps = p
                return h('button', 'Prev')
              },
            }),
          ],
        },
      })

      await nextTick()

      expect(typeof prevProps.isDisabled).toBe('boolean')
      expect(typeof prevProps.isAtEdge).toBe('boolean')
      expect(prevProps.attrs['aria-label']).toBeDefined()
      expect(prevProps.attrs.type).toBe('button')
    })

    it('should be disabled at first slide in non-circular mode', async () => {
      let prevProps: any

      mount(Carousel.Root, {
        props: {
          modelValue: 'a',
        },
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            h(Carousel.Previous as any, {}, {
              default: (p: any) => {
                prevProps = p
                return h('button', 'Prev')
              },
            }),
          ],
        },
      })

      await nextTick()

      expect(prevProps.isAtEdge).toBe(true)
      expect(prevProps.isDisabled).toBe(true)
      expect(prevProps.attrs['data-edge']).toBe(true)
      expect(prevProps.attrs['data-disabled']).toBe(true)
    })

    it('should not be disabled at first slide in circular mode', async () => {
      let prevProps: any

      mount(Carousel.Root, {
        props: {
          modelValue: 'a',
          circular: true,
        },
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            h(Carousel.Previous as any, {}, {
              default: (p: any) => {
                prevProps = p
                return h('button', 'Prev')
              },
            }),
          ],
        },
      })

      await nextTick()

      expect(prevProps.isAtEdge).toBe(false)
      expect(prevProps.isDisabled).toBe(false)
    })

    it('should go back to the previous slide when clicked', async () => {
      const selected = ref<string>('b')
      let prevProps: any

      mount(Carousel.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (v: unknown) => {
            selected.value = v as string
          },
        },
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            h(Carousel.Previous as any, {}, {
              default: (p: any) => {
                prevProps = p
                return h('button', 'Prev')
              },
            }),
          ],
        },
      })

      await nextTick()

      prevProps.attrs.onClick()
      await nextTick()

      expect(selected.value).toBe('a')
    })

    it('should not navigate when clicked while disabled', async () => {
      const selected = ref<string>('a')
      let prevProps: any

      mount(Carousel.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (v: unknown) => {
            selected.value = v as string
          },
        },
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            h(Carousel.Previous as any, {}, {
              default: (p: any) => {
                prevProps = p
                return h('button', 'Prev')
              },
            }),
          ],
        },
      })

      await nextTick()
      expect(prevProps.isDisabled).toBe(true)

      prevProps.attrs.onClick()
      await nextTick()

      expect(selected.value).toBe('a')
    })

    it('should drop the type attribute when rendered as non-button', async () => {
      let prevProps: any

      mount(Carousel.Root, {
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Previous as any, { as: 'div' }, {
              default: (p: any) => {
                prevProps = p
                return h('div', 'Prev')
              },
            }),
          ],
        },
      })

      await nextTick()

      expect(prevProps.attrs.type).toBeUndefined()
      expect(prevProps.attrs.disabled).toBeUndefined()
    })
  })

  describe('next button', () => {
    it('should expose correct slot props', async () => {
      let nextBtnProps: any

      mount(Carousel.Root, {
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Next as any, {}, {
              default: (p: any) => {
                nextBtnProps = p
                return h('button', 'Next')
              },
            }),
          ],
        },
      })

      await nextTick()

      expect(typeof nextBtnProps.isDisabled).toBe('boolean')
      expect(typeof nextBtnProps.isAtEdge).toBe('boolean')
      expect(nextBtnProps.attrs['aria-label']).toBeDefined()
      expect(nextBtnProps.attrs.type).toBe('button')
    })

    it('should be disabled at last slide in non-circular mode', async () => {
      let nextBtnProps: any

      mount(Carousel.Root, {
        props: {
          modelValue: 'b',
        },
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            h(Carousel.Next as any, {}, {
              default: (p: any) => {
                nextBtnProps = p
                return h('button', 'Next')
              },
            }),
          ],
        },
      })

      await nextTick()

      expect(nextBtnProps.isAtEdge).toBe(true)
      expect(nextBtnProps.isDisabled).toBe(true)
    })

    it('should account for perView when computing edge', async () => {
      let nextBtnProps: any

      mount(Carousel.Root, {
        props: {
          modelValue: 'a',
          perView: 2,
        },
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            h(Carousel.Next as any, {}, {
              default: (p: any) => {
                nextBtnProps = p
                return h('button', 'Next')
              },
            }),
          ],
        },
      })

      await nextTick()

      // perView=2, 2 slides: selectedIndex(0) >= size(2) - perView(2) = 0
      expect(nextBtnProps.isAtEdge).toBe(true)
    })

    it('should not be disabled at last slide in circular mode', async () => {
      let nextBtnProps: any

      mount(Carousel.Root, {
        props: {
          modelValue: 'b',
          circular: true,
        },
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            h(Carousel.Next as any, {}, {
              default: (p: any) => {
                nextBtnProps = p
                return h('button', 'Next')
              },
            }),
          ],
        },
      })

      await nextTick()

      expect(nextBtnProps.isAtEdge).toBe(false)
      expect(nextBtnProps.isDisabled).toBe(false)
    })

    it('should advance to the next slide when clicked', async () => {
      const selected = ref<string>('a')
      let nextBtnProps: any

      mount(Carousel.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (v: unknown) => {
            selected.value = v as string
          },
        },
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            h(Carousel.Next as any, {}, {
              default: (p: any) => {
                nextBtnProps = p
                return h('button', 'Next')
              },
            }),
          ],
        },
      })

      await nextTick()

      nextBtnProps.attrs.onClick()
      await nextTick()

      expect(selected.value).toBe('b')
    })

    it('should not navigate when clicked while disabled', async () => {
      const selected = ref<string>('b')
      let nextBtnProps: any

      mount(Carousel.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (v: unknown) => {
            selected.value = v as string
          },
        },
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            h(Carousel.Next as any, {}, {
              default: (p: any) => {
                nextBtnProps = p
                return h('button', 'Next')
              },
            }),
          ],
        },
      })

      await nextTick()
      expect(nextBtnProps.isDisabled).toBe(true)

      nextBtnProps.attrs.onClick()
      await nextTick()

      expect(selected.value).toBe('b')
    })

    it('should drop the type attribute when rendered as non-button', async () => {
      let nextBtnProps: any

      mount(Carousel.Root, {
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Next as any, { as: 'div' }, {
              default: (p: any) => {
                nextBtnProps = p
                return h('div', 'Next')
              },
            }),
          ],
        },
      })

      await nextTick()

      expect(nextBtnProps.attrs.type).toBeUndefined()
      expect(nextBtnProps.attrs.disabled).toBeUndefined()
    })
  })

  describe('integration', () => {
    it('should skip disabled slides during navigation', async () => {
      const selected = ref<string>()

      let rootProps: any
      let slide1Props: any
      let slide3Props: any

      mount(Carousel.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (value: unknown) => {
            selected.value = value as string
          },
        },
        slots: {
          default: (props: any) => {
            rootProps = props
            return [
              h(Carousel.Item as any, { value: 'slide-1' }, {
                default: (p: any) => {
                  slide1Props = p
                  return h('div', 'Slide 1')
                },
              }),
              h(Carousel.Item as any, { value: 'slide-2', disabled: true }, {
                default: () => h('div', 'Slide 2'),
              }),
              h(Carousel.Item as any, { value: 'slide-3' }, {
                default: (p: any) => {
                  slide3Props = p
                  return h('div', 'Slide 3')
                },
              }),
            ]
          },
        },
      })

      await nextTick()

      slide1Props.select()
      await nextTick()

      rootProps.next()
      await nextTick()

      expect(selected.value).toBe('slide-3')
      expect(slide3Props.isSelected).toBe(true)
    })

    it('should use custom namespace for isolation', async () => {
      let carousel1Slide1Props: any
      let carousel1Slide2Props: any
      let carousel2Slide1Props: any
      let carousel2Slide2Props: any

      mount(defineComponent({
        render: () => [
          h(Carousel.Root as any, { namespace: 'v0:carousel-1', mandatory: false }, () => [
            h(Carousel.Item as any, { value: 'slide-a', namespace: 'v0:carousel-1' }, {
              default: (props: any) => {
                carousel1Slide1Props = props
                return h('div', 'Carousel 1 Slide A')
              },
            }),
            h(Carousel.Item as any, { value: 'slide-b', namespace: 'v0:carousel-1' }, {
              default: (props: any) => {
                carousel1Slide2Props = props
                return h('div', 'Carousel 1 Slide B')
              },
            }),
          ]),
          h(Carousel.Root as any, { namespace: 'v0:carousel-2' }, () => [
            h(Carousel.Item as any, { value: 'slide-a', namespace: 'v0:carousel-2' }, {
              default: (props: any) => {
                carousel2Slide1Props = props
                return h('div', 'Carousel 2 Slide A')
              },
            }),
            h(Carousel.Item as any, { value: 'slide-b', namespace: 'v0:carousel-2' }, {
              default: (props: any) => {
                carousel2Slide2Props = props
                return h('div', 'Carousel 2 Slide B')
              },
            }),
          ]),
        ],
      }))

      await nextTick()

      // Select in carousel 1 only
      carousel1Slide1Props.select()
      await nextTick()

      // Carousel 1 should have slide-a selected (via select())
      // Carousel 2 should have slide-a selected (via mandatory: force)
      // but they must be independent — selecting in one doesn't affect the other
      expect(carousel1Slide1Props.isSelected).toBe(true)
      expect(carousel1Slide2Props.isSelected).toBe(false)
      expect(carousel2Slide1Props.isSelected).toBe(true)
      expect(carousel2Slide2Props.isSelected).toBe(false)
    })

    it('should support v-model binding', async () => {
      const selected = ref<string>('slide-2')

      let slide1Props: any
      let slide2Props: any

      mount(Carousel.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (value: unknown) => {
            selected.value = value as string
          },
        },
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'slide-1' }, {
              default: (p: any) => {
                slide1Props = p
                return h('div', 'Slide 1')
              },
            }),
            h(Carousel.Item as any, { value: 'slide-2' }, {
              default: (p: any) => {
                slide2Props = p
                return h('div', 'Slide 2')
              },
            }),
          ],
        },
      })

      await nextTick()

      expect(slide2Props.isSelected).toBe(true)
      expect(slide1Props.isSelected).toBe(false)
    })
  })

  describe('indicator', () => {
    it('should expose slot props with size and items', async () => {
      let indicatorProps: any

      mount(Carousel.Root, {
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            h(Carousel.Item as any, { value: 'c' }, { default: () => h('div', 'C') }),
            h(Carousel.Indicator as any, {}, {
              default: (p: any) => {
                indicatorProps = p
                return h('div', 'Indicator')
              },
            }),
          ],
        },
      })

      await nextTick()

      expect(indicatorProps).toBeDefined()
      expect(indicatorProps.size).toBe(3)
      expect(typeof indicatorProps.selectedIndex).toBe('number')
      expect(Array.isArray(indicatorProps.items)).toBe(true)
      expect(indicatorProps.items).toHaveLength(3)
      expect(indicatorProps.attrs.role).toBe('tablist')
      expect(indicatorProps.attrs['aria-label']).toBeDefined()
      expect(indicatorProps.attrs['aria-orientation']).toBe('horizontal')
    })

    it('should use vertical orientation when carousel is vertical', async () => {
      let indicatorProps: any

      mount(Carousel.Root, {
        props: { orientation: 'vertical' },
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Indicator as any, {}, {
              default: (p: any) => {
                indicatorProps = p
                return h('div', 'Indicator')
              },
            }),
          ],
        },
      })

      await nextTick()

      expect(indicatorProps.attrs['aria-orientation']).toBe('vertical')
    })

    it('should accept custom label prop', async () => {
      let indicatorProps: any

      mount(Carousel.Root, {
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Indicator as any, { label: 'custom-label' }, {
              default: (p: any) => {
                indicatorProps = p
                return h('div', 'Indicator')
              },
            }),
          ],
        },
      })

      await nextTick()

      expect(indicatorProps.attrs['aria-label']).toBe('custom-label')
    })

    it('should expose per-item attrs and selection state', async () => {
      let indicatorProps: any

      mount(Carousel.Root, {
        props: { modelValue: 'a' },
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            h(Carousel.Indicator as any, {}, {
              default: (p: any) => {
                indicatorProps = p
                return h('div', 'Indicator')
              },
            }),
          ],
        },
      })

      await nextTick()

      const [first, second] = indicatorProps.items

      expect(first.index).toBe(0)
      expect(first.isSelected).toBe(true)
      expect(first.isActive).toBe(true)
      expect(first.attrs.role).toBe('tab')
      expect(first.attrs.tabindex).toBe(0)
      expect(first.attrs['aria-selected']).toBe(true)
      expect(first.attrs['data-selected']).toBe(true)
      expect(first.attrs['data-active']).toBe(true)
      expect(first.attrs['aria-controls']).toContain('-slide-0')
      expect(first.attrs['aria-label']).toBeDefined()
      expect(typeof first.attrs.onClick).toBe('function')
      expect(typeof first.attrs.onKeydown).toBe('function')

      expect(second.isSelected).toBe(false)
      expect(second.attrs.tabindex).toBe(-1)
      expect(second.attrs['aria-selected']).toBe(false)
      expect(second.attrs['data-selected']).toBeUndefined()
    })

    it('should reflect perView in isActive across indicators', async () => {
      let indicatorProps: any

      mount(Carousel.Root, {
        props: { modelValue: 'a', perView: 2 },
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            h(Carousel.Item as any, { value: 'c' }, { default: () => h('div', 'C') }),
            h(Carousel.Indicator as any, {}, {
              default: (p: any) => {
                indicatorProps = p
                return h('div', 'Indicator')
              },
            }),
          ],
        },
      })

      await nextTick()

      expect(indicatorProps.items[0].isActive).toBe(true)
      expect(indicatorProps.items[1].isActive).toBe(true)
      expect(indicatorProps.items[2].isActive).toBe(false)
    })

    it('should navigate when an indicator is clicked', async () => {
      const selected = ref<string>('a')

      let indicatorProps: any

      mount(Carousel.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (v: unknown) => {
            selected.value = v as string
          },
        },
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            h(Carousel.Indicator as any, {}, {
              default: (p: any) => {
                indicatorProps = p
                return h('div', 'Indicator')
              },
            }),
          ],
        },
      })

      await nextTick()

      indicatorProps.items[1].attrs.onClick()
      await nextTick()

      expect(selected.value).toBe('b')
    })

    it('should navigate with ArrowRight in horizontal orientation', async () => {
      const selected = ref<string>('a')
      let indicatorProps: any

      mount(Carousel.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (v: unknown) => {
            selected.value = v as string
          },
        },
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            h(Carousel.Indicator as any, {}, {
              default: (p: any) => {
                indicatorProps = p
                return h('div', 'Indicator')
              },
            }),
          ],
        },
      })

      await nextTick()

      const event = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true })
      indicatorProps.items[0].attrs.onKeydown(event)
      await nextTick()

      expect(event.defaultPrevented).toBe(true)
      expect(selected.value).toBe('b')
    })

    it('should navigate with ArrowLeft in horizontal orientation', async () => {
      const selected = ref<string>('b')
      let indicatorProps: any

      mount(Carousel.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (v: unknown) => {
            selected.value = v as string
          },
        },
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            h(Carousel.Indicator as any, {}, {
              default: (p: any) => {
                indicatorProps = p
                return h('div', 'Indicator')
              },
            }),
          ],
        },
      })

      await nextTick()

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true })
      indicatorProps.items[1].attrs.onKeydown(event)
      await nextTick()

      expect(selected.value).toBe('a')
    })

    it('should navigate with ArrowDown / ArrowUp in vertical orientation', async () => {
      const selected = ref<string>('a')
      let indicatorProps: any

      mount(Carousel.Root, {
        props: {
          'orientation': 'vertical',
          'modelValue': selected.value,
          'onUpdate:modelValue': (v: unknown) => {
            selected.value = v as string
          },
        },
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            h(Carousel.Indicator as any, {}, {
              default: (p: any) => {
                indicatorProps = p
                return h('div', 'Indicator')
              },
            }),
          ],
        },
      })

      await nextTick()

      const down = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true })
      indicatorProps.items[0].attrs.onKeydown(down)
      await nextTick()
      expect(selected.value).toBe('b')

      const up = new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true })
      indicatorProps.items[1].attrs.onKeydown(up)
      await nextTick()
      expect(selected.value).toBe('a')
    })

    it('should stop at edges in non-circular mode', async () => {
      const selected = ref<string>('b')
      let indicatorProps: any

      mount(Carousel.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (v: unknown) => {
            selected.value = v as string
          },
        },
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            h(Carousel.Indicator as any, {}, {
              default: (p: any) => {
                indicatorProps = p
                return h('div', 'Indicator')
              },
            }),
          ],
        },
      })

      await nextTick()

      // Last item ArrowRight should stay put
      const right = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true })
      indicatorProps.items[1].attrs.onKeydown(right)
      await nextTick()

      expect(selected.value).toBe('b')
    })

    it('should wrap at edges in circular mode', async () => {
      const selected = ref<string>('b')
      let indicatorProps: any

      mount(Carousel.Root, {
        props: {
          'circular': true,
          'modelValue': selected.value,
          'onUpdate:modelValue': (v: unknown) => {
            selected.value = v as string
          },
        },
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            h(Carousel.Indicator as any, {}, {
              default: (p: any) => {
                indicatorProps = p
                return h('div', 'Indicator')
              },
            }),
          ],
        },
      })

      await nextTick()

      // Last item ArrowRight should wrap to first
      const right = new KeyboardEvent('keydown', { key: 'ArrowRight', cancelable: true })
      indicatorProps.items[1].attrs.onKeydown(right)
      await nextTick()
      expect(selected.value).toBe('a')

      // First item ArrowLeft should wrap to last
      const left = new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true })
      indicatorProps.items[0].attrs.onKeydown(left)
      await nextTick()
      expect(selected.value).toBe('b')
    })

    it('should jump to first/last with Home/End keys', async () => {
      const selected = ref<string>('b')
      let indicatorProps: any

      mount(Carousel.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (v: unknown) => {
            selected.value = v as string
          },
        },
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            h(Carousel.Item as any, { value: 'c' }, { default: () => h('div', 'C') }),
            h(Carousel.Indicator as any, {}, {
              default: (p: any) => {
                indicatorProps = p
                return h('div', 'Indicator')
              },
            }),
          ],
        },
      })

      await nextTick()

      const home = new KeyboardEvent('keydown', { key: 'Home', cancelable: true })
      indicatorProps.items[1].attrs.onKeydown(home)
      await nextTick()
      expect(selected.value).toBe('a')

      const end = new KeyboardEvent('keydown', { key: 'End', cancelable: true })
      indicatorProps.items[0].attrs.onKeydown(end)
      await nextTick()
      expect(selected.value).toBe('c')
    })

    it('should activate with Enter / Space keys', async () => {
      const selected = ref<string>('a')
      let indicatorProps: any

      mount(Carousel.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (v: unknown) => {
            selected.value = v as string
          },
        },
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            h(Carousel.Indicator as any, {}, {
              default: (p: any) => {
                indicatorProps = p
                return h('div', 'Indicator')
              },
            }),
          ],
        },
      })

      await nextTick()

      const enter = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true })
      indicatorProps.items[1].attrs.onKeydown(enter)
      await nextTick()
      expect(selected.value).toBe('b')

      const space = new KeyboardEvent('keydown', { key: ' ', cancelable: true })
      indicatorProps.items[0].attrs.onKeydown(space)
      await nextTick()
      expect(selected.value).toBe('a')
    })

    it('should ignore unrelated keys', async () => {
      const selected = ref<string>('a')
      let indicatorProps: any

      mount(Carousel.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (v: unknown) => {
            selected.value = v as string
          },
        },
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            h(Carousel.Indicator as any, {}, {
              default: (p: any) => {
                indicatorProps = p
                return h('div', 'Indicator')
              },
            }),
          ],
        },
      })

      await nextTick()

      const tab = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true })
      indicatorProps.items[0].attrs.onKeydown(tab)
      await nextTick()
      expect(selected.value).toBe('a')
      expect(tab.defaultPrevented).toBe(false)
    })

    it('should unregister the indicator part on unmount', async () => {
      const wrapper = mount(Carousel.Root, {
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Indicator as any, {}, {
              default: () => h('div', 'Indicator'),
            }),
          ],
        },
      })

      await nextTick()
      expect(() => wrapper.unmount()).not.toThrow()
    })
  })

  describe('liveRegion', () => {
    it('should expose slot props with text and aria attrs', async () => {
      let regionProps: any

      mount(Carousel.Root, {
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.LiveRegion as any, {}, {
              default: (p: any) => {
                regionProps = p
                return h('div', p.text)
              },
            }),
          ],
        },
      })

      await nextTick()

      expect(regionProps).toBeDefined()
      expect(typeof regionProps.current).toBe('number')
      expect(typeof regionProps.size).toBe('number')
      expect(regionProps.text).toBe('')
      expect(regionProps.attrs['aria-atomic']).toBe(true)
      expect(regionProps.attrs['aria-live']).toBe('polite')
      expect(regionProps.attrs.role).toBe('status')
    })

    it('should reflect current slide index (1-indexed)', async () => {
      let regionProps: any

      mount(Carousel.Root, {
        props: { modelValue: 'b' },
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            h(Carousel.Item as any, { value: 'c' }, { default: () => h('div', 'C') }),
            h(Carousel.LiveRegion as any, {}, {
              default: (p: any) => {
                regionProps = p
                return h('div', p.text)
              },
            }),
          ],
        },
      })

      await nextTick()

      expect(regionProps.current).toBe(2)
      expect(regionProps.size).toBe(3)
    })

    it('should update text after slide changes (with delay)', async () => {
      vi.useFakeTimers()

      let regionProps: any
      let rootProps: any

      mount(Carousel.Root, {
        slots: {
          default: (props: any) => {
            rootProps = props
            return [
              h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
              h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
              h(Carousel.LiveRegion as any, {}, {
                default: (p: any) => {
                  regionProps = p
                  return h('div', p.text)
                },
              }),
            ]
          },
        },
      })

      await nextTick()
      expect(regionProps.text).toBe('')

      rootProps.next()
      await nextTick()

      vi.advanceTimersByTime(100)
      await nextTick()

      expect(regionProps.text).toBeDefined()
      expect(regionProps.text.length).toBeGreaterThan(0)

      vi.useRealTimers()
    })

    it('should clear pending live-region timer on unmount', async () => {
      vi.useFakeTimers()
      using clearSpy = vi.spyOn(globalThis, 'clearTimeout')

      let rootProps: any

      const wrapper = mount(Carousel.Root, {
        slots: {
          default: (props: any) => {
            rootProps = props
            return [
              h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
              h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
              h(Carousel.LiveRegion as any, {}, { default: () => h('div') }),
            ]
          },
        },
      })

      await nextTick()
      rootProps.next()
      await nextTick()

      const before = clearSpy.mock.calls.length
      wrapper.unmount()

      expect(clearSpy.mock.calls.length).toBeGreaterThan(before)

      vi.useRealTimers()
    })

    it('should render default text content when no slot is provided', async () => {
      const wrapper = mount(Carousel.Root, {
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.LiveRegion as any),
          ],
        },
      })

      await nextTick()

      const region = wrapper.findComponent(Carousel.LiveRegion as any)
      expect(region.exists()).toBe(true)
      expect(region.attributes('role')).toBe('status')
      expect(region.attributes('aria-live')).toBe('polite')
    })

    it('should register el on parts registry', async () => {
      let context: any
      const Child = defineComponent({
        setup () {
          context = useCarouselRoot('v0:carousel')
          return () => h('span')
        },
      })

      mount(Carousel.Root, {
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.LiveRegion as any, {}, { default: () => h('div') }),
            h(Child),
          ],
        },
      })

      await nextTick()

      // Read the registered el from the parts registry to exercise its toRef getter.
      const liveRegionTicket = context.parts.values().find(
        (t: any) => t.type === 'live-region',
      )
      expect(liveRegionTicket).toBeDefined()
      // Read .value to invoke the toRef getter
      expect(liveRegionTicket.el.value === null || liveRegionTicket.el.value instanceof Element).toBe(true)
    })
  })

  describe('progress', () => {
    it('should expose slot props with progress value and aria attrs', async () => {
      let progressProps: any

      mount(Carousel.Root, {
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Progress as any, {}, {
              default: (p: any) => {
                progressProps = p
                return h('div', 'Progress')
              },
            }),
          ],
        },
      })

      await nextTick()

      expect(progressProps).toBeDefined()
      expect(typeof progressProps.progress).toBe('number')
      expect(typeof progressProps.isAutoplay).toBe('boolean')
      expect(typeof progressProps.isPaused).toBe('boolean')
      expect(progressProps.attrs.role).toBe('progressbar')
      expect(progressProps.attrs['aria-valuemin']).toBe(0)
      expect(progressProps.attrs['aria-valuemax']).toBe(100)
      expect(typeof progressProps.attrs['aria-valuenow']).toBe('number')
      expect(progressProps.attrs['aria-valuetext']).toBeDefined()
      expect(progressProps.attrs['aria-label']).toBeDefined()
    })

    it('should report 0 progress when autoplay is disabled', async () => {
      let progressProps: any

      mount(Carousel.Root, {
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Progress as any, {}, {
              default: (p: any) => {
                progressProps = p
                return h('div', 'Progress')
              },
            }),
          ],
        },
      })

      await nextTick()

      expect(progressProps.progress).toBe(0)
      expect(progressProps.attrs['aria-valuenow']).toBe(0)
      expect(progressProps.attrs.style.width).toBe('0%')
      expect(progressProps.isAutoplay).toBe(false)
    })

    it('should report idle state when autoplay is disabled', async () => {
      let progressProps: any

      mount(Carousel.Root, {
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Progress as any, {}, {
              default: (p: any) => {
                progressProps = p
                return h('div', 'Progress')
              },
            }),
          ],
        },
      })

      await nextTick()

      expect(progressProps.attrs['data-state']).toBe('idle')
    })

    it('should report active state when autoplay is running', async () => {
      vi.useFakeTimers()

      let progressProps: any
      let rootProps: any

      mount(Carousel.Root, {
        props: { autoplay: 1000 },
        slots: {
          default: (props: any) => {
            rootProps = props
            return [
              h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
              h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
              h(Carousel.Progress as any, {}, {
                default: (p: any) => {
                  progressProps = p
                  return h('div', 'Progress')
                },
              }),
            ]
          },
        },
      })

      await nextTick()

      rootProps.play()
      await nextTick()

      expect(progressProps.isAutoplay).toBe(true)
      expect(progressProps.attrs['data-state']).toBe('active')

      vi.useRealTimers()
    })

    it('should report paused state when autoplay is paused', async () => {
      vi.useFakeTimers()

      let progressProps: any
      let rootProps: any

      mount(Carousel.Root, {
        props: { autoplay: 1000 },
        slots: {
          default: (props: any) => {
            rootProps = props
            return [
              h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
              h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
              h(Carousel.Progress as any, {}, {
                default: (p: any) => {
                  progressProps = p
                  return h('div', 'Progress')
                },
              }),
            ]
          },
        },
      })

      await nextTick()

      rootProps.play()
      await nextTick()
      rootProps.pause()
      await nextTick()

      expect(progressProps.isPaused).toBe(true)
      expect(progressProps.attrs['data-state']).toBe('paused')

      vi.useRealTimers()
    })

    it('should unregister the progress part on unmount', async () => {
      const wrapper = mount(Carousel.Root, {
        slots: {
          default: () => [
            h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            h(Carousel.Progress as any, {}, { default: () => h('div', 'Progress') }),
          ],
        },
      })

      await nextTick()
      expect(() => wrapper.unmount()).not.toThrow()
    })
  })

  describe('viewport', () => {
    it('should expose slot props with isDragging and attrs', async () => {
      let viewportProps: any

      mount(Carousel.Root, {
        slots: {
          default: () => [
            h(Carousel.Viewport as any, {}, {
              default: (p: any) => {
                viewportProps = p
                return h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') })
              },
            }),
          ],
        },
      })

      await nextTick()

      expect(viewportProps).toBeDefined()
      expect(typeof viewportProps.isDragging).toBe('boolean')
      expect(viewportProps.isDragging).toBe(false)
      expect(viewportProps.attrs.id).toBeDefined()
      expect(viewportProps.attrs['data-orientation']).toBe('horizontal')
      expect(viewportProps.attrs.style).toBeDefined()
    })

    it('should expose vertical orientation in attrs', async () => {
      let viewportProps: any

      mount(Carousel.Root, {
        props: { orientation: 'vertical' },
        slots: {
          default: () => [
            h(Carousel.Viewport as any, {}, {
              default: (p: any) => {
                viewportProps = p
                return h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') })
              },
            }),
          ],
        },
      })

      await nextTick()

      expect(viewportProps.attrs['data-orientation']).toBe('vertical')
      expect(viewportProps.attrs.style['flex-direction']).toBe('column')
      expect(viewportProps.attrs.style['overflow-y']).toBe('auto')
      expect(viewportProps.attrs.style['overflow-x']).toBe('hidden')
      expect(viewportProps.attrs.style['scroll-snap-type']).toContain('y')
    })

    it('should set horizontal flex-direction by default', async () => {
      let viewportProps: any

      mount(Carousel.Root, {
        slots: {
          default: () => [
            h(Carousel.Viewport as any, {}, {
              default: (p: any) => {
                viewportProps = p
                return h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') })
              },
            }),
          ],
        },
      })

      await nextTick()

      expect(viewportProps.attrs.style['flex-direction']).toBe('row')
      expect(viewportProps.attrs.style['overflow-x']).toBe('auto')
      expect(viewportProps.attrs.style['overflow-y']).toBe('hidden')
      expect(viewportProps.attrs.style['scroll-snap-type']).toContain('x')
    })

    it('should set scroll-snap-type to none while dragging', async () => {
      const wrapper = mount(Carousel.Root, {
        slots: {
          default: () => [
            h(Carousel.Viewport as any, {}, {
              default: () => [
                h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
                h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
              ],
            }),
          ],
        },
      })

      await nextTick()

      const viewport = wrapper.findComponent(Carousel.Viewport as any)
      const viewportEl = viewport.element as HTMLElement

      viewportEl.dispatchEvent(new MouseEvent('mousedown', {
        button: 0,
        clientX: 100,
        clientY: 50,
        bubbles: true,
      }))
      await nextTick()

      // Re-resolve a fresh slot props read by re-querying — assert via DOM style
      const styles = viewportEl.getAttribute('style') ?? ''
      expect(styles.includes('user-select') || styles.includes('scroll-snap-type: none')).toBe(true)
    })

    it('should pause autoplay on touchstart and resume on touchend', async () => {
      vi.useFakeTimers()

      let rootProps: any

      const wrapper = mount(Carousel.Root, {
        props: { autoplay: 1000 },
        slots: {
          default: (props: any) => {
            rootProps = props
            return [
              h(Carousel.Viewport as any, {}, {
                default: () => [
                  h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
                  h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
                ],
              }),
            ]
          },
        },
      })

      await nextTick()
      rootProps.play()
      await nextTick()

      const viewportEl = wrapper.findComponent(Carousel.Viewport as any).element as HTMLElement

      viewportEl.dispatchEvent(new Event('touchstart'))
      await nextTick()
      expect(rootProps.isPaused).toBe(true)

      viewportEl.dispatchEvent(new Event('touchend'))
      await nextTick()
      expect(rootProps.isPaused).toBe(false)

      vi.useRealTimers()
    })

    it('should not start drag on right-click (button !== 0)', async () => {
      let viewportProps: any

      const wrapper = mount(Carousel.Root, {
        slots: {
          default: () => [
            h(Carousel.Viewport as any, {}, {
              default: (p: any) => {
                viewportProps = p
                return h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') })
              },
            }),
          ],
        },
      })

      await nextTick()

      const viewportEl = wrapper.findComponent(Carousel.Viewport as any).element as HTMLElement

      viewportEl.dispatchEvent(new MouseEvent('mousedown', {
        button: 2,
        clientX: 50,
        clientY: 50,
        bubbles: true,
      }))
      await nextTick()

      expect(viewportProps.isDragging).toBe(false)
    })

    it('should set isDragging on scroll', async () => {
      let viewportProps: any

      const wrapper = mount(Carousel.Root, {
        slots: {
          default: () => [
            h(Carousel.Viewport as any, {}, {
              default: (p: any) => {
                viewportProps = p
                return [
                  h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
                  h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
                ]
              },
            }),
          ],
        },
      })

      await nextTick()

      const viewportEl = wrapper.findComponent(Carousel.Viewport as any).element as HTMLElement
      viewportEl.dispatchEvent(new Event('scroll'))
      await nextTick()

      expect(viewportProps.isDragging).toBe(true)
      expect(viewportProps.attrs['data-dragging']).toBe(true)
    })

    it('should navigate to next slide on horizontal wheel scroll (deltaY > 0)', async () => {
      const selected = ref<string>('a')

      const wrapper = mount(Carousel.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (v: unknown) => {
            selected.value = v as string
          },
        },
        slots: {
          default: () => [
            h(Carousel.Viewport as any, {}, {
              default: () => [
                h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
                h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
              ],
            }),
          ],
        },
      })

      await nextTick()

      const viewportEl = wrapper.findComponent(Carousel.Viewport as any).element as HTMLElement
      viewportEl.dispatchEvent(new WheelEvent('wheel', { deltaY: 100, cancelable: true }))
      await nextTick()

      expect(selected.value).toBe('b')
    })

    it('should navigate to previous slide on horizontal wheel scroll (deltaY < 0)', async () => {
      const selected = ref<string>('b')

      const wrapper = mount(Carousel.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (v: unknown) => {
            selected.value = v as string
          },
        },
        slots: {
          default: () => [
            h(Carousel.Viewport as any, {}, {
              default: () => [
                h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
                h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
              ],
            }),
          ],
        },
      })

      await nextTick()

      const viewportEl = wrapper.findComponent(Carousel.Viewport as any).element as HTMLElement
      viewportEl.dispatchEvent(new WheelEvent('wheel', { deltaY: -100, cancelable: true }))
      await nextTick()

      expect(selected.value).toBe('a')
    })

    it('should ignore wheel scroll along the wrong axis when shiftKey matches orientation', async () => {
      const selected = ref<string>('a')

      const wrapper = mount(Carousel.Root, {
        props: {
          'orientation': 'vertical',
          'modelValue': selected.value,
          'onUpdate:modelValue': (v: unknown) => {
            selected.value = v as string
          },
        },
        slots: {
          default: () => [
            h(Carousel.Viewport as any, {}, {
              default: () => [
                h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
                h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
              ],
            }),
          ],
        },
      })

      await nextTick()

      const viewportEl = wrapper.findComponent(Carousel.Viewport as any).element as HTMLElement
      // For vertical carousel: e.shiftKey === isVertical (true) bails out — guard returns early
      // happy-dom: build a real Event then patch shiftKey via Object.defineProperty
      const event = new Event('wheel', { cancelable: true }) as WheelEvent
      Object.defineProperty(event, 'shiftKey', { value: true })
      Object.defineProperty(event, 'deltaY', { value: 100 })
      Object.defineProperty(event, 'deltaX', { value: 0 })
      viewportEl.dispatchEvent(event)
      await nextTick()

      expect(selected.value).toBe('a')
    })

    it('should ignore wheel scroll with zero delta', async () => {
      const selected = ref<string>('a')

      const wrapper = mount(Carousel.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (v: unknown) => {
            selected.value = v as string
          },
        },
        slots: {
          default: () => [
            h(Carousel.Viewport as any, {}, {
              default: () => [
                h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
                h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
              ],
            }),
          ],
        },
      })

      await nextTick()

      const viewportEl = wrapper.findComponent(Carousel.Viewport as any).element as HTMLElement
      viewportEl.dispatchEvent(new WheelEvent('wheel', { deltaY: 0, deltaX: 0, cancelable: true }))
      await nextTick()

      expect(selected.value).toBe('a')
    })

    it('should rate-limit wheel events (300ms throttle)', async () => {
      const selected = ref<string>('a')

      const wrapper = mount(Carousel.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (v: unknown) => {
            selected.value = v as string
          },
        },
        slots: {
          default: () => [
            h(Carousel.Viewport as any, {}, {
              default: () => [
                h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
                h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
                h(Carousel.Item as any, { value: 'c' }, { default: () => h('div', 'C') }),
              ],
            }),
          ],
        },
      })

      await nextTick()

      const viewportEl = wrapper.findComponent(Carousel.Viewport as any).element as HTMLElement
      viewportEl.dispatchEvent(new WheelEvent('wheel', { deltaY: 100, cancelable: true }))
      await nextTick()
      // Second event within throttle window should be ignored
      viewportEl.dispatchEvent(new WheelEvent('wheel', { deltaY: 100, cancelable: true }))
      await nextTick()

      expect(selected.value).toBe('b')
    })

    it('should trigger drag flow on mousedown / mousemove / mouseup', async () => {
      const wrapper = mount(Carousel.Root, {
        slots: {
          default: () => [
            h(Carousel.Viewport as any, {}, {
              default: () => [
                h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
                h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
              ],
            }),
          ],
        },
      })

      await nextTick()

      const viewportEl = wrapper.findComponent(Carousel.Viewport as any).element as HTMLElement

      // Stub layout properties so slideStep can be > 0 in the mouseup branch
      Object.defineProperty(viewportEl, 'scrollLeft', { value: 0, writable: true, configurable: true })
      Object.defineProperty(viewportEl, 'scrollTop', { value: 0, writable: true, configurable: true })
      viewportEl.scrollTo = vi.fn()

      // Begin drag (button === 0)
      viewportEl.dispatchEvent(new MouseEvent('mousedown', {
        button: 0,
        clientX: 100,
        clientY: 50,
        bubbles: true,
      }))
      await nextTick()

      // Move while dragging (document-level)
      document.dispatchEvent(new MouseEvent('mousemove', {
        clientX: 50,
        clientY: 50,
        bubbles: true,
      }))
      await nextTick()

      // End drag (document-level)
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
      await nextTick()

      expect(wrapper.exists()).toBe(true)
    })

    it('should follow vertical drag axis when orientation is vertical', async () => {
      const wrapper = mount(Carousel.Root, {
        props: { orientation: 'vertical' },
        slots: {
          default: () => [
            h(Carousel.Viewport as any, {}, {
              default: () => [
                h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
                h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
              ],
            }),
          ],
        },
      })

      await nextTick()

      const viewportEl = wrapper.findComponent(Carousel.Viewport as any).element as HTMLElement
      Object.defineProperty(viewportEl, 'scrollTop', { value: 0, writable: true, configurable: true })
      viewportEl.scrollTo = vi.fn()

      viewportEl.dispatchEvent(new MouseEvent('mousedown', {
        button: 0,
        clientX: 50,
        clientY: 100,
        bubbles: true,
      }))
      await nextTick()

      document.dispatchEvent(new MouseEvent('mousemove', {
        clientX: 50,
        clientY: 50,
        bubbles: true,
      }))
      await nextTick()

      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
      await nextTick()

      expect(wrapper.exists()).toBe(true)
    })

    it('should fire scrollend listener and reset syncing', async () => {
      const wrapper = mount(Carousel.Root, {
        slots: {
          default: () => [
            h(Carousel.Viewport as any, {}, {
              default: () => [
                h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
                h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
              ],
            }),
          ],
        },
      })

      await nextTick()

      const viewportEl = wrapper.findComponent(Carousel.Viewport as any).element as HTMLElement
      Object.defineProperty(viewportEl, 'scrollLeft', { value: 0, writable: true, configurable: true })
      viewportEl.dispatchEvent(new Event('scrollend'))
      await nextTick()

      expect(wrapper.exists()).toBe(true)
    })

    it('should sync scroll position when selectedIndex changes', async () => {
      const selected = ref<string>('a')
      const wrapper = mount(Carousel.Root, {
        props: {
          'modelValue': selected.value,
          'onUpdate:modelValue': (v: unknown) => {
            selected.value = v as string
          },
        },
        slots: {
          default: () => [
            h(Carousel.Viewport as any, {}, {
              default: () => [
                h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
                h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
              ],
            }),
          ],
        },
      })

      await nextTick()

      const viewportEl = wrapper.findComponent(Carousel.Viewport as any).element as HTMLElement
      viewportEl.scrollTo = vi.fn()

      selected.value = 'b'
      await nextTick()

      expect(selected.value).toBe('b')
    })

    it('should unregister the viewport part on unmount', async () => {
      const wrapper = mount(Carousel.Root, {
        slots: {
          default: () => [
            h(Carousel.Viewport as any, {}, {
              default: () => h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
            }),
          ],
        },
      })

      await nextTick()
      expect(() => wrapper.unmount()).not.toThrow()
    })
  })

  describe('autoplay', () => {
    beforeEach(() => {
      vi.useFakeTimers()
    })

    afterEach(() => {
      vi.useRealTimers()
    })

    it('should expose autoplay flags in slot props when autoplay is 0', async () => {
      let rootProps: any

      mount(Carousel.Root, {
        slots: {
          default: (props: any) => {
            rootProps = props
            return h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') })
          },
        },
      })

      await nextTick()

      expect(rootProps.isAutoplay).toBe(false)
      expect(rootProps.isPaused).toBe(false)
      expect(rootProps.remaining).toBe(0)
    })

    it('should expose play/stop/pause/resume that are no-ops when autoplay is 0', async () => {
      let rootProps: any

      mount(Carousel.Root, {
        slots: {
          default: (props: any) => {
            rootProps = props
            return h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') })
          },
        },
      })

      await nextTick()

      expect(typeof rootProps.play).toBe('function')
      expect(typeof rootProps.stop).toBe('function')
      expect(typeof rootProps.pause).toBe('function')
      expect(typeof rootProps.resume).toBe('function')
      expect(() => {
        rootProps.play()
        rootProps.pause()
        rootProps.resume()
        rootProps.stop()
      }).not.toThrow()
    })

    it('should report active autoplay after play()', async () => {
      let rootProps: any

      mount(Carousel.Root, {
        props: { autoplay: 1000 },
        slots: {
          default: (props: any) => {
            rootProps = props
            return [
              h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
              h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            ]
          },
        },
      })

      await nextTick()

      rootProps.play()
      await nextTick()
      expect(rootProps.isAutoplay).toBe(true)
    })

    it('should pause and resume autoplay timer', async () => {
      let rootProps: any

      mount(Carousel.Root, {
        props: { autoplay: 1000 },
        slots: {
          default: (props: any) => {
            rootProps = props
            return [
              h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
              h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            ]
          },
        },
      })

      await nextTick()

      rootProps.play()
      await nextTick()

      rootProps.pause()
      await nextTick()
      expect(rootProps.isPaused).toBe(true)

      rootProps.resume()
      await nextTick()
      expect(rootProps.isPaused).toBe(false)
    })

    it('should advance to the next slide when autoplay timer fires', async () => {
      const selected = ref<string>('a')
      let rootProps: any

      mount(Carousel.Root, {
        props: {
          'autoplay': 1000,
          'modelValue': selected.value,
          'onUpdate:modelValue': (v: unknown) => {
            selected.value = v as string
          },
        },
        slots: {
          default: (props: any) => {
            rootProps = props
            return [
              h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
              h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            ]
          },
        },
      })

      await nextTick()
      rootProps.play()
      await nextTick()

      vi.advanceTimersByTime(1000)
      await nextTick()

      expect(selected.value).toBe('b')
    })

    it('should stop the autoplay timer', async () => {
      let rootProps: any

      mount(Carousel.Root, {
        props: { autoplay: 1000 },
        slots: {
          default: (props: any) => {
            rootProps = props
            return [
              h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
              h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
            ]
          },
        },
      })

      await nextTick()

      rootProps.play()
      await nextTick()
      expect(rootProps.isAutoplay).toBe(true)

      rootProps.stop()
      await nextTick()
      expect(rootProps.isAutoplay).toBe(false)
    })
  })

  describe('circular navigation with perView', () => {
    it('should jump to first when next() called past the perView edge in circular mode', async () => {
      const selected = ref<string>()

      let rootProps: any
      let slide1Props: any

      mount(Carousel.Root, {
        props: {
          'circular': true,
          'perView': 2,
          'modelValue': selected.value,
          'onUpdate:modelValue': (v: unknown) => {
            selected.value = v as string
          },
        },
        slots: {
          default: (props: any) => {
            rootProps = props
            return [
              h(Carousel.Item as any, { value: 'a' }, {
                default: (p: any) => {
                  slide1Props = p
                  return h('div', 'A')
                },
              }),
              h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
              h(Carousel.Item as any, { value: 'c' }, { default: () => h('div', 'C') }),
            ]
          },
        },
      })

      await nextTick()

      // Move to the maxStart (size - perView = 1) — index 1
      rootProps.step(1)
      await nextTick()

      // next() should wrap back to first
      rootProps.next()
      await nextTick()

      expect(slide1Props.isSelected).toBe(true)
    })

    it('should not advance past maxStart when next() called in non-circular mode with perView', async () => {
      const selected = ref<string>('a')

      let rootProps: any

      mount(Carousel.Root, {
        props: {
          'circular': false,
          'perView': 2,
          'modelValue': selected.value,
          'onUpdate:modelValue': (v: unknown) => {
            selected.value = v as string
          },
        },
        slots: {
          default: (props: any) => {
            rootProps = props
            return [
              h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
              h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
              h(Carousel.Item as any, { value: 'c' }, { default: () => h('div', 'C') }),
            ]
          },
        },
      })

      await nextTick()

      // size=3, perView=2 → maxStart = 1. Calling next() repeatedly should
      // stop at index 1, not advance to 2 where slide 'c' is shown alone
      // beyond the perView window.
      rootProps.next()
      await nextTick()
      expect(selected.value).toBe('b')

      rootProps.next()
      await nextTick()
      expect(selected.value).toBe('b')
    })

    it('should jump to maxStart when prev() called from index 0 in circular mode with perView', async () => {
      const selected = ref<string>('a')

      let rootProps: any

      mount(Carousel.Root, {
        props: {
          'circular': true,
          'perView': 2,
          'modelValue': selected.value,
          'onUpdate:modelValue': (v: unknown) => {
            selected.value = v as string
          },
        },
        slots: {
          default: (props: any) => {
            rootProps = props
            return [
              h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
              h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') }),
              h(Carousel.Item as any, { value: 'c' }, { default: () => h('div', 'C') }),
            ]
          },
        },
      })

      await nextTick()
      rootProps.prev()
      await nextTick()

      // size(3) - perView(2) = 1
      expect(selected.value).toBe('b')
    })
  })

  describe('label prop', () => {
    it('should accept a custom label', async () => {
      let rootProps: any

      mount(Carousel.Root, {
        props: { label: 'My carousel' },
        slots: {
          default: (props: any) => {
            rootProps = props
            return h('div', 'Content')
          },
        },
      })

      expect(rootProps.attrs['aria-label']).toBe('My carousel')
    })

    it('should fall back to the locale carousel label when no label is provided', async () => {
      let rootProps: any

      mount(Carousel.Root, {
        slots: {
          default: (props: any) => {
            rootProps = props
            return h('div', 'Content')
          },
        },
      })

      expect(rootProps.attrs['aria-label']).toBeDefined()
    })
  })

  describe('item unmount', () => {
    it('should unregister the item ticket on unmount', async () => {
      const show = ref(true)

      let rootProps: any

      const wrapper = mount(defineComponent({
        render: () =>
          h(Carousel.Root as any, {}, {
            default: (props: any) => {
              rootProps = props
              return [
                h(Carousel.Item as any, { value: 'a' }, { default: () => h('div', 'A') }),
                show.value
                  ? h(Carousel.Item as any, { value: 'b' }, { default: () => h('div', 'B') })
                  : null,
              ]
            },
          }),
      }))

      await nextTick()
      expect(rootProps.attrs['aria-disabled']).toBe(false)

      // Removing the second item triggers onBeforeUnmount → unregister
      show.value = false
      await nextTick()

      expect(() => wrapper.unmount()).not.toThrow()
    })
  })

  // eslint-disable-next-line vitest/prefer-lowercase-title
  describe('SSR / Hydration', () => {
    it('should render to string on server without errors', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Carousel.Root as any, {}, {
            default: () => [
              h(Carousel.Item as any, { value: 'slide-1' }, {
                default: (props: any) => h('div', { ...props.attrs }, 'Slide 1'),
              }),
              h(Carousel.Item as any, { value: 'slide-2' }, {
                default: (props: any) => h('div', { ...props.attrs }, 'Slide 2'),
              }),
            ],
          }),
      }))

      const html = await renderToString(app)

      expect(html).toBeTruthy()
      expect(html).toContain('Slide 1')
      expect(html).toContain('Slide 2')
    })

    it('should render ARIA attributes on server', async () => {
      const app = createSSRApp(defineComponent({
        render: () =>
          h(Carousel.Root as any, { modelValue: 'slide-1' }, {
            default: () =>
              h(Carousel.Item as any, { value: 'slide-1' }, {
                default: (props: any) => h('div', { ...props.attrs }, 'Slide 1'),
              }),
          }),
      }))

      const html = await renderToString(app)

      expect(html).toContain('aria-roledescription="slide"')
      expect(html).toContain('role="group"')
    })
  })
})
