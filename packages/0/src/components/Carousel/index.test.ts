import { describe, expect, it } from 'vitest'
import { renderToString } from 'vue/server-renderer'

import { Carousel } from './index'

// Utilities
import { mount } from '@vue/test-utils'
import { createSSRApp, defineComponent, h, nextTick, ref } from 'vue'

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
          h(Carousel.Root as any, { namespace: 'carousel-1', mandatory: false }, () => [
            h(Carousel.Item as any, { value: 'slide-a', namespace: 'carousel-1' }, {
              default: (props: any) => {
                carousel1Slide1Props = props
                return h('div', 'Carousel 1 Slide A')
              },
            }),
            h(Carousel.Item as any, { value: 'slide-b', namespace: 'carousel-1' }, {
              default: (props: any) => {
                carousel1Slide2Props = props
                return h('div', 'Carousel 1 Slide B')
              },
            }),
          ]),
          h(Carousel.Root as any, { namespace: 'carousel-2' }, () => [
            h(Carousel.Item as any, { value: 'slide-a', namespace: 'carousel-2' }, {
              default: (props: any) => {
                carousel2Slide1Props = props
                return h('div', 'Carousel 2 Slide A')
              },
            }),
            h(Carousel.Item as any, { value: 'slide-b', namespace: 'carousel-2' }, {
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

  describe('sSR / Hydration', () => {
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
