import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'

// Framework
import { createReducedMotionPlugin } from '@vuetify/v0'

// Components
import { QuStepper, QuStepperActions, QuStepperBar, QuStepperContent, QuStepperStep } from './index'

// Utilities
import { createApp, h, nextTick, shallowRef } from 'vue'

// Types
import type { QuStepperProps } from './QuStepper.vue'
import type { QuStepperStepProps } from './QuStepperStep.vue'
import type { App, Ref, VNode } from 'vue'

// Theme
import { QuantumStyleSheetAdapter } from '../../adapter'
import { quantumColors, quantumDarkColors } from '../../colors'
// Icons
import { quantumIcons } from '../../icons'

interface Spec extends Partial<QuStepperStepProps<string>> {
  value: string
  body?: string
  actions?: boolean
}

const STEPS: Spec[] = [
  { value: 'settings', label: 'Campaign settings' },
  { value: 'group', label: 'Ad group' },
  { value: 'ad', label: 'Create an ad' },
]

const ELEVATION_2 = '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12)'

const teardowns: (() => void)[] = []

function mount (node: () => VNode, setup?: (app: App) => void): HTMLElement {
  const host = document.createElement('div')
  host.style.padding = '24px'
  host.style.width = '720px'
  document.body.append(host)
  const app = createApp({ render: node })
  setup?.(app)
  app.mount(host)
  teardowns.push(() => {
    app.unmount()
    host.remove()
  })
  return host
}

function step (spec: Spec): VNode {
  const { body = `${spec.label} body`, actions, ...props } = spec

  return h(QuStepper.Step, { label: 'Label', ...props }, () => h(QuStepper.Content, () => [
    body,
    actions ? h(QuStepper.Actions) : null,
  ]))
}

interface Options {
  props?: QuStepperProps & Record<string, unknown>
  steps?: Spec[]
  model?: Ref<string | undefined>
  bar?: boolean
  setup?: (app: App) => void
}

function stepper ({ props = {}, steps = STEPS, model, bar = false, setup }: Options = {}): HTMLElement {
  const host = mount(() => h(QuStepper, {
    ...props,
    ...(model
      ? { 'modelValue': model.value, 'onUpdate:modelValue': (value: unknown) => {
          model.value = value as string
        } }
      : {}),
  }, () => [
    ...steps.map(spec => step(spec)),
    bar ? h(QuStepper.Bar) : null,
  ]), setup)

  return host.querySelector<HTMLElement>('.quantum-stepper')!
}

function items (root: ParentNode): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>('.quantum-stepper__step')]
}

function labels (root: ParentNode): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>('.quantum-stepper__label')]
}

function contents (root: ParentNode): HTMLElement[] {
  return [...root.querySelectorAll<HTMLElement>('.quantum-stepper__content')]
}

function visible (root: ParentNode): HTMLElement[] {
  return contents(root).filter(el => !el.hidden)
}

function paths (el: Element): (string | null)[] {
  return [...el.querySelectorAll('path')].map(p => p.getAttribute('d'))
}

/** A document-level sheet standing in for the host app's stylesheet. */
function style (css: string) {
  const el = document.createElement('style')
  el.textContent = css
  document.head.append(el)
  teardowns.push(() => el.remove())
}

/** The browser's own serialization of a value, so assertions never guess at colour or shadow formatting. */
function serialize (property: 'backgroundColor' | 'boxShadow', value: string): string {
  const probe = document.createElement('div')
  probe.style[property] = value
  document.body.append(probe)
  const result = getComputedStyle(probe)[property]
  probe.remove()
  return result
}

function down (el: HTMLElement) {
  const rect = el.getBoundingClientRect()
  el.dispatchEvent(new PointerEvent('pointerdown', {
    bubbles: true,
    button: 0,
    clientX: rect.left + 10,
    clientY: rect.top + 10,
    pointerType: 'mouse',
  }))
}

function inks (el: HTMLElement): HTMLElement[] {
  return [...el.querySelectorAll<HTMLElement>('.quantum-ripple__ink')]
}

afterEach(() => {
  while (teardowns.length > 0) {
    teardowns.pop()!()
  }

  delete document.body.dataset.reducedMotion
  vi.restoreAllMocks()
})

async function settle () {
  await nextTick()
  await nextTick()
  await nextTick()
}

describe('quStepper', () => {
  describe('anatomy', () => {
    it('should render an ordered list of steps with a numbered circle, a label and a connector each', async () => {
      const root = stepper()
      await settle()

      const header = root.querySelector('.quantum-stepper__header')!

      expect(root.tagName).toBe('DIV')
      expect(header.tagName).toBe('OL')
      expect(items(root).length).toBe(3)

      for (const [index, item] of items(root).entries()) {
        expect(item.tagName).toBe('LI')
        expect(item.parentElement).toBe(header)
        expect(item.querySelector('.quantum-stepper__circle')!.textContent!.trim()).toBe(String(index + 1))
        // The list numbers the steps; the circle is decoration, so the number is not read twice.
        expect(item.querySelector('.quantum-stepper__circle')!.getAttribute('aria-hidden')).toBe('true')
        expect(item.querySelector('.quantum-stepper__name')!.textContent).toBe(STEPS[index]!.label)
        expect(item.querySelector('.quantum-stepper__connector')!.getAttribute('aria-hidden')).toBe('true')
      }
    })

    it('should activate the first step when the model is unset, and mark it aria-current="step"', async () => {
      const root = stepper()
      await settle()

      const [first, second, third] = items(root)

      expect(first!.getAttribute('aria-current')).toBe('step')
      expect(first!.dataset.state).toBe('active')
      expect(second!.hasAttribute('aria-current')).toBe(false)
      expect(second!.dataset.state).toBe('inactive')
      expect(third!.dataset.state).toBe('inactive')
    })

    it('should publish the root hooks for every prop, and none for the defaults it does not set', async () => {
      const plain = stepper()
      await settle()

      expect(Object.hasOwn(plain.dataset, 'linear')).toBe(true)
      expect(Object.hasOwn(plain.dataset, 'vertical')).toBe(false)
      expect(Object.hasOwn(plain.dataset, 'alternative')).toBe(false)
      expect(Object.hasOwn(plain.dataset, 'mobile')).toBe(false)
      expect(Object.hasOwn(plain.dataset, 'feedback')).toBe(false)

      const set = stepper({ props: { linear: false, vertical: true, alternativeLabels: true, mobile: 'dots', feedback: 'Saving' } })
      await settle()

      expect(Object.hasOwn(set.dataset, 'linear')).toBe(false)
      expect(Object.hasOwn(set.dataset, 'vertical')).toBe(true)
      expect(Object.hasOwn(set.dataset, 'alternative')).toBe(true)
      expect(set.dataset.mobile).toBe('dots')
      expect(Object.hasOwn(set.dataset, 'feedback')).toBe(true)
    })

    it('should show the active step\'s content under the header as a region named by its label', async () => {
      const root = stepper()
      await settle()

      const panels = root.querySelector('.quantum-stepper__panels')!
      const shown = visible(root)

      expect(contents(root).length).toBe(3)
      expect(contents(root).every(el => el.parentElement === panels)).toBe(true)
      expect(shown.length).toBe(1)
      expect(shown[0]!.textContent).toContain('Campaign settings body')
      expect(shown[0]!.getAttribute('role')).toBe('region')

      const label = document.getElementById(shown[0]!.getAttribute('aria-labelledby')!)!

      expect(label.classList.contains('quantum-stepper__label')).toBe(true)
      expect(label.textContent).toContain('Campaign settings')
    })

    it('should number the steps by registration order and follow a step removed at runtime', async () => {
      const list = shallowRef(STEPS)
      const host = mount(() => h(QuStepper, () => list.value.map(spec => step(spec))))
      await settle()

      list.value = STEPS.slice(1)
      await settle()

      const root = host.querySelector('.quantum-stepper')!
      const circles = [...root.querySelectorAll('.quantum-stepper__circle')].map(el => el.textContent!.trim())

      expect(circles).toEqual(['1', '2'])
    })
  })

  describe('metrics', () => {
    it('should sit on a 72 dp header bar with 24 dp circles, 24 dp padding and 8 dp from circle to label', async () => {
      const root = stepper()
      await settle()

      const header = root.querySelector<HTMLElement>('.quantum-stepper__header')!
      const label = labels(root)[0]!
      const circle = root.querySelector<HTMLElement>('.quantum-stepper__circle')!
      const computed = getComputedStyle(circle)

      expect(header.getBoundingClientRect().height).toBe(72)
      expect(circle.getBoundingClientRect().width).toBe(24)
      expect(circle.getBoundingClientRect().height).toBe(24)
      expect(computed.borderRadius).toBe('50%')
      expect(computed.fontSize).toBe('12px')
      expect(computed.fontWeight).toBe('400')
      expect(computed.marginRight).toBe('8px')
      expect(getComputedStyle(label).paddingLeft).toBe('24px')
      expect(getComputedStyle(label).paddingTop).toBe('24px')
    })

    it('should draw a 1 dp Grey 400 connector 8 dp clear of the label and of the next circle, none after the last step', async () => {
      const root = stepper()
      await settle()

      const [first, second, third] = items(root)
      const connector = first!.querySelector<HTMLElement>('.quantum-stepper__connector')!
      const rect = connector.getBoundingClientRect()
      const text = first!.querySelector('.quantum-stepper__text')!.getBoundingClientRect()
      const next = second!.querySelector('.quantum-stepper__circle')!.getBoundingClientRect()

      expect(rect.height).toBe(1)
      expect(getComputedStyle(connector).backgroundColor).toBe('rgb(189, 189, 189)')
      expect(rect.left - text.right).toBe(8)
      expect(next.left - rect.right).toBe(8)
      expect(getComputedStyle(third!.querySelector('.quantum-stepper__connector')!).display).toBe('none')
    })

    it('should set the label in 14 sp, Medium while active and Regular otherwise', async () => {
      const root = stepper()
      await settle()

      const [active, inactive] = [...root.querySelectorAll<HTMLElement>('.quantum-stepper__name')]

      expect(getComputedStyle(active!).fontSize).toBe('14px')
      expect(getComputedStyle(active!).fontWeight).toBe('500')
      expect(getComputedStyle(active!).fontFamily).toContain('Roboto')
      expect(getComputedStyle(inactive!).fontWeight).toBe('400')
    })

    it('should rest the stepper and its header at 2 dp on the surface colour', async () => {
      const root = stepper()
      await settle()

      expect(getComputedStyle(root).backgroundColor).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(root).boxShadow).toBe(serialize('boxShadow', ELEVATION_2))
      expect(getComputedStyle(root.querySelector('.quantum-stepper__header')!).boxShadow).toBe(serialize('boxShadow', ELEVATION_2))
    })

    it('should pad the horizontal content 24 dp on every side', async () => {
      const root = stepper()
      await settle()

      const computed = getComputedStyle(visible(root)[0]!)

      expect(computed.paddingTop).toBe('24px')
      expect(computed.paddingLeft).toBe('24px')
      expect(computed.fontSize).toBe('14px')
    })
  })

  describe('linear', () => {
    it('should paint the active circle primary with white ink, inactive circles and labels at 38%', async () => {
      const root = stepper()
      await settle()

      const [active, inactive] = items(root)
      const circle = active!.querySelector('.quantum-stepper__circle')!

      expect(getComputedStyle(circle).backgroundColor).toBe('rgb(63, 81, 181)')
      expect(getComputedStyle(circle).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(active!.querySelector('.quantum-stepper__name')!).color).toBe('rgba(0, 0, 0, 0.87)')
      expect(getComputedStyle(inactive!.querySelector('.quantum-stepper__circle')!).backgroundColor).toBe('rgba(0, 0, 0, 0.38)')
      expect(getComputedStyle(inactive!.querySelector('.quantum-stepper__name')!).color).toBe('rgba(0, 0, 0, 0.38)')
    })

    it('should lock every header: no buttons, no ripple, and a click on a future step changes nothing', async () => {
      const model = shallowRef<string>()
      const root = stepper({ model })
      await settle()

      expect(root.querySelector('button.quantum-stepper__label')).toBeNull()
      expect(root.querySelector('.quantum-ripple')).toBeNull()

      labels(root)[2]!.click()
      await settle()

      expect(items(root)[0]!.dataset.state).toBe('active')
    })

    it('should complete every step before the active one with a check in a primary circle and an 87% Regular label', async () => {
      const model = shallowRef<string | undefined>('ad')
      const root = stepper({ model })
      await settle()

      const [first, second, third] = items(root)
      const circle = first!.querySelector('.quantum-stepper__circle')!
      const name = first!.querySelector('.quantum-stepper__name')!

      expect(first!.dataset.state).toBe('complete')
      expect(second!.dataset.state).toBe('complete')
      expect(third!.dataset.state).toBe('active')
      expect(paths(circle)).toEqual(quantumIcons.check)
      expect(getComputedStyle(circle).backgroundColor).toBe('rgb(63, 81, 181)')
      expect(getComputedStyle(circle.querySelector('svg')!).width).toBe('18px')
      expect(getComputedStyle(name).color).toBe('rgba(0, 0, 0, 0.87)')
      expect(getComputedStyle(name).fontWeight).toBe('400')
      // Not editable: a completed step is locked.
      expect(first!.querySelector('button')).toBeNull()
    })

    it('should follow the model in both directions', async () => {
      const model = shallowRef<string | undefined>('group')
      const root = stepper({ model, steps: STEPS.map(spec => ({ ...spec, actions: true })) })
      await settle()

      expect(items(root)[1]!.dataset.state).toBe('active')

      model.value = 'settings'
      await settle()

      expect(items(root)[0]!.dataset.state).toBe('active')

      const raised = visible(root)[0]!.querySelector<HTMLButtonElement>('.quantum-button[data-variant="raised"]')!

      await userEvent.click(raised)
      await settle()

      expect(model.value).toBe('group')
      expect(visible(root)[0]!.textContent).toContain('Ad group body')
    })
  })

  describe('non-linear', () => {
    it('should make every step not active a native button at 54%, and select it on click', async () => {
      const model = shallowRef<string>()
      const root = stepper({ model, props: { linear: false } })
      await settle()

      const [active, second] = labels(root)

      expect(active!.tagName).toBe('DIV')
      expect(second!.tagName).toBe('BUTTON')
      expect((second as HTMLButtonElement).type).toBe('button')
      // v0 Button.Root renders the header, not a hand-built button.
      expect(second!.getAttribute('role')).toBe('button')
      expect(second!.getAttribute('aria-disabled')).toBe('false')
      expect(second!.firstElementChild!.classList.contains('quantum-ripple')).toBe(true)
      expect(getComputedStyle(second!.querySelector('.quantum-stepper__name')!).color).toBe('rgba(0, 0, 0, 0.54)')

      await userEvent.click(second!)
      await settle()

      expect(model.value).toBe('group')
      expect(items(root)[1]!.getAttribute('aria-current')).toBe('step')
      // Non-linear steps complete only when marked; the step left behind is inactive again.
      expect(items(root)[0]!.dataset.state).toBe('inactive')
    })

    it('should take complete as the completion state and lock a completed step that is not editable', async () => {
      const root = stepper({
        props: { linear: false },
        steps: [STEPS[0]!, { ...STEPS[1]!, complete: true }, { ...STEPS[2]!, complete: true, editable: true }],
      })
      await settle()

      const [, done, editable] = items(root)

      expect(done!.dataset.state).toBe('complete')
      expect(done!.querySelector('button')).toBeNull()
      expect(editable!.dataset.state).toBe('complete')
      expect(editable!.querySelector('button.quantum-stepper__label')).not.toBeNull()
    })

    it('should let complete=false keep a passed step of a linear stepper inactive', async () => {
      const root = stepper({
        model: shallowRef<string | undefined>('ad'),
        steps: [{ ...STEPS[0]!, complete: false }, STEPS[1]!, STEPS[2]!],
      })
      await settle()

      expect(items(root)[0]!.dataset.state).toBe('inactive')
      expect(items(root)[1]!.dataset.state).toBe('complete')
    })

    it('should shade the whole step cell 6% on hover', async () => {
      const root = stepper({ props: { linear: false } })
      await settle()

      const label = labels(root)[1]!

      expect(getComputedStyle(label).backgroundColor).toBe('rgba(0, 0, 0, 0)')

      await userEvent.hover(label)

      await expect.poll(() => getComputedStyle(label).backgroundColor).toBe('rgba(0, 0, 0, 0.06)')

      await userEvent.unhover(label)
    })

    it('should draw the 12% focus overlay for keyboard focus', async () => {
      const root = stepper({ props: { linear: false } })
      await settle()

      const label = labels(root)[1]!

      // The active step is not a button, so the first Tab from the page lands on the second header.
      const focused = document.activeElement as HTMLElement | null

      focused?.blur()
      await userEvent.tab()

      expect(document.activeElement).toBe(label)
      await expect.poll(() => getComputedStyle(label).backgroundColor).toBe('rgba(0, 0, 0, 0.12)')
    })

    it('should press a 6% ink from the press point, not the buttons\' grey', async () => {
      const root = stepper({ props: { linear: false }, setup: app => app.use(createReducedMotionPlugin({ mode: 'never' })) })
      await settle()

      const label = labels(root)[1]!

      down(label)
      await settle()

      const list = inks(label)

      expect(list.length).toBe(1)
      expect(getComputedStyle(list[0]!).backgroundColor).toBe('rgba(0, 0, 0, 0.06)')

      label.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, button: 0 }))

      await expect.poll(() => inks(label).length).toBe(0)
    })

    it('should open a step with Enter and with Space', async () => {
      const model = shallowRef<string>()
      const root = stepper({ model, props: { linear: false } })
      await settle()

      labels(root)[1]!.focus()
      await userEvent.keyboard('{Enter}')
      await settle()

      expect(model.value).toBe('group')

      labels(root)[2]!.focus()
      await userEvent.keyboard(' ')
      await settle()

      expect(model.value).toBe('ad')
    })

    it('should keep only reachable headers in the tab order', async () => {
      const root = stepper({ props: { linear: false } })
      await settle()

      const focusable = labels(root).filter(el => el.tabIndex >= 0)

      expect(focusable.map(el => el.tagName)).toEqual(['BUTTON', 'BUTTON'])
    })
  })

  describe('step types', () => {
    it('should draw the pencil in an editable completed step and keep its header a button that reopens it', async () => {
      const model = shallowRef<string | undefined>('ad')
      const root = stepper({ model, steps: [{ ...STEPS[0]!, editable: true }, STEPS[1]!, STEPS[2]!] })
      await settle()

      const [editable] = items(root)
      const label = editable!.querySelector<HTMLButtonElement>('button.quantum-stepper__label')!

      expect(Object.hasOwn(editable!.dataset, 'editable')).toBe(true)
      expect(paths(editable!.querySelector('.quantum-stepper__circle')!)).toEqual(quantumIcons.edit)
      expect(label).not.toBeNull()

      await userEvent.click(label)
      await settle()

      expect(model.value).toBe('settings')
      expect(editable!.dataset.state).toBe('active')
      // Active again: the header is no longer a button.
      expect(editable!.querySelector('button.quantum-stepper__label')).toBeNull()
    })

    it('should mark an optional step with the 12 sp Optional sub-label at 54%', async () => {
      const root = stepper({ steps: [STEPS[0]!, { ...STEPS[1]!, optional: true }, STEPS[2]!] })
      await settle()

      const optional = items(root)[1]!
      const note = optional.querySelector<HTMLElement>('small.quantum-stepper__note')!

      expect(Object.hasOwn(optional.dataset, 'optional')).toBe(true)
      expect(Object.hasOwn(items(root)[0]!.dataset, 'optional')).toBe(false)
      expect(note.textContent).toBe('Optional')
      expect(getComputedStyle(note).fontSize).toBe('12px')
      expect(getComputedStyle(note).fontWeight).toBe('400')
      expect(getComputedStyle(note).color).toBe('rgba(0, 0, 0, 0.54)')
    })

    it('should put a summary in the sub-label, ahead of the optional mark', async () => {
      const root = stepper({ steps: [{ ...STEPS[0]!, optional: true, summary: 'Two markets' }, STEPS[1]!] })
      await settle()

      expect(items(root)[0]!.querySelector('.quantum-stepper__note')!.textContent).toBe('Two markets')
    })

    it('should replace the circle with the red warning glyph and turn the label red Medium with the message under it', async () => {
      const root = stepper({ steps: [STEPS[0]!, { ...STEPS[1]!, error: 'Budget too low' }, STEPS[2]!] })
      await settle()

      const failed = items(root)[1]!
      const circle = failed.querySelector<HTMLElement>('.quantum-stepper__circle')!
      const name = failed.querySelector('.quantum-stepper__name')!
      const note = failed.querySelector('.quantum-stepper__note')!

      expect(Object.hasOwn(failed.dataset, 'error')).toBe(true)
      expect(Object.hasOwn(items(root)[0]!.dataset, 'error')).toBe(false)
      expect(paths(circle)).toEqual(quantumIcons.warning)
      expect(getComputedStyle(circle).backgroundColor).toBe('rgba(0, 0, 0, 0)')
      expect(getComputedStyle(circle).color).toBe('rgb(255, 23, 68)')
      expect(getComputedStyle(circle.querySelector('svg')!).width).toBe('24px')
      expect(getComputedStyle(name).color).toBe('rgb(255, 23, 68)')
      expect(getComputedStyle(name).fontWeight).toBe('500')
      expect(note.textContent).toBe('Budget too low')
      expect(getComputedStyle(note).color).toBe('rgb(255, 23, 68)')
      // Two lines, still inside the 72 dp bar.
      expect(root.querySelector('.quantum-stepper__header')!.getBoundingClientRect().height).toBe(72)
    })
  })

  describe('alternative labels', () => {
    it('should centre the labels under their circles in a 104 dp bar of equal parts', async () => {
      const root = stepper({ props: { alternativeLabels: true } })
      await settle()

      const header = root.querySelector('.quantum-stepper__header')!
      const [first, second, third] = items(root)
      const circle = first!.querySelector<HTMLElement>('.quantum-stepper__circle')!
      const text = first!.querySelector('.quantum-stepper__text')!.getBoundingClientRect()
      const ring = circle.getBoundingClientRect()

      expect(header.getBoundingClientRect().height).toBe(104)
      expect(first!.getBoundingClientRect().width).toBe(second!.getBoundingClientRect().width)
      expect(third!.getBoundingClientRect().width).toBe(second!.getBoundingClientRect().width)
      expect(ring.top - header.getBoundingClientRect().top).toBe(24)
      expect(text.top - ring.bottom).toBe(16)
      expect(Math.abs((ring.left + ring.right) / 2 - (text.left + text.right) / 2)).toBeLessThan(1)
    })

    it('should run each connector between circles, 8 dp clear of both', async () => {
      const root = stepper({ props: { alternativeLabels: true } })
      await settle()

      const [first, second] = items(root)
      const connector = first!.querySelector('.quantum-stepper__connector')!.getBoundingClientRect()
      const a = first!.querySelector('.quantum-stepper__circle')!.getBoundingClientRect()
      const b = second!.querySelector('.quantum-stepper__circle')!.getBoundingClientRect()

      expect(connector.height).toBe(1)
      expect(connector.top).toBe(a.top + 12)
      expect(Math.round(connector.left - a.right)).toBe(8)
      expect(Math.round(b.left - connector.right)).toBe(8)
    })
  })

  describe('vertical', () => {
    it('should keep each step\'s content inside its step, indented to the 60 dp keyline', async () => {
      const root = stepper({ props: { vertical: true }, steps: STEPS.map(spec => ({ ...spec, actions: true })) })
      await settle()

      const [first, second] = items(root)
      const content = first!.querySelector<HTMLElement>('.quantum-stepper__content')!
      const body = content.querySelector('.quantum-stepper__body')!.getBoundingClientRect()

      expect(content.hidden).toBe(false)
      expect(second!.querySelector<HTMLElement>('.quantum-stepper__content')!.hidden).toBe(true)
      expect(body.left - first!.getBoundingClientRect().left).toBe(60)
      expect(getComputedStyle(content).paddingRight).toBe('24px')
      expect(getComputedStyle(root.querySelector('.quantum-stepper__panels')!).display).toBe('none')
      expect(getComputedStyle(root.querySelector('.quantum-stepper__header')!).boxShadow).toBe('none')
    })

    it('should set the label 24 dp from the top, 12 dp from the circle, 16 dp above the content', async () => {
      const root = stepper({ props: { vertical: true } })
      await settle()

      const [first] = items(root)
      const label = first!.querySelector<HTMLElement>('.quantum-stepper__label')!
      const circle = first!.querySelector('.quantum-stepper__circle')!.getBoundingClientRect()
      const text = first!.querySelector('.quantum-stepper__text')!.getBoundingClientRect()

      expect(circle.top - first!.getBoundingClientRect().top).toBe(24)
      expect(circle.left - first!.getBoundingClientRect().left).toBe(24)
      expect(text.left - circle.right).toBe(12)
      expect(getComputedStyle(label).paddingBottom).toBe('16px')
    })

    it('should run the connector down from each circle, 8 dp clear of it and of the next circle', async () => {
      const root = stepper({ props: { vertical: true } })
      await settle()

      const [first, second] = items(root)
      const connector = first!.querySelector('.quantum-stepper__connector')!.getBoundingClientRect()
      const a = first!.querySelector('.quantum-stepper__circle')!.getBoundingClientRect()
      const b = second!.querySelector('.quantum-stepper__circle')!.getBoundingClientRect()

      expect(connector.width).toBe(1)
      expect(connector.left).toBe(a.left + 12)
      expect(connector.top - a.bottom).toBe(8)
      expect(b.top - connector.bottom).toBe(8)
    })

    it('should move the content between the step and the panel host when vertical changes at runtime', async () => {
      const vertical = shallowRef(true)
      const host = mount(() => h(QuStepper, { vertical: vertical.value }, () => STEPS.map(spec => step(spec))))
      await settle()

      const root = host.querySelector('.quantum-stepper')!

      expect(contents(root)[0]!.closest('.quantum-stepper__step')).not.toBeNull()

      vertical.value = false
      await settle()

      expect(contents(root)[0]!.closest('.quantum-stepper__step')).toBeNull()
      expect(contents(root)[0]!.parentElement!.classList.contains('quantum-stepper__panels')).toBe(true)
    })
  })

  describe('actions', () => {
    it('should render CONTINUE raised and CANCEL flat, 16 dp under the content and 8 dp apart', async () => {
      const root = stepper({ steps: STEPS.map(spec => ({ ...spec, actions: true })) })
      await settle()

      const row = visible(root)[0]!.querySelector<HTMLElement>('.quantum-stepper__actions')!
      const [go, cancel] = [...row.querySelectorAll<HTMLButtonElement>('.quantum-button')]

      expect(go!.dataset.variant).toBe('raised')
      expect(go!.textContent!.trim()).toBe('Continue')
      expect(cancel!.dataset.variant).toBe('flat')
      expect(cancel!.textContent!.trim()).toBe('Cancel')
      expect(getComputedStyle(row).marginTop).toBe('16px')
      expect(getComputedStyle(row).columnGap).toBe('8px')
      expect(row.getBoundingClientRect().height).toBe(48)
    })

    it('should emit continue after moving on, and cancel without moving', async () => {
      const model = shallowRef<string>()
      const events: string[] = []
      const host = mount(() => h(QuStepper, {
        'modelValue': model.value,
        'onUpdate:modelValue': (value: unknown) => {
          model.value = value as string
        },
      }, () => STEPS.map(spec => h(QuStepper.Step, { label: spec.label!, value: spec.value }, () => h(QuStepper.Content, () => h(QuStepper.Actions, {
        onContinue: () => events.push(`continue:${model.value}`),
        onCancel: () => events.push(`cancel:${model.value}`),
      }))))))
      await settle()

      const row = () => visible(host)[0]!.querySelectorAll<HTMLButtonElement>('.quantum-button')

      await userEvent.click(row()[1]!)
      await settle()
      await userEvent.click(row()[0]!)
      await settle()

      // mandatory: 'force' writes the first step back to the unset model on mount.
      expect(events).toEqual(['cancel:settings', 'continue:group'])
    })

    it('should let the default slot replace both buttons', async () => {
      const host = mount(() => h(QuStepper, () => h(QuStepper.Step, { label: 'One', value: 'one' }, () => h(QuStepper.Content, () => h(QuStepper.Actions, () => h('button', { class: 'own' }, 'Save'))))))
      await settle()

      const row = host.querySelector('.quantum-stepper__actions')!

      expect(row.querySelector('.own')).not.toBeNull()
      expect(row.querySelector('.quantum-button')).toBeNull()
    })
  })

  describe('feedback', () => {
    it('should replace the active step\'s content with an indeterminate circle and the message while set', async () => {
      const feedback = shallowRef<string | undefined>('Saving settings')
      const host = mount(() => h(QuStepper, { feedback: feedback.value }, () => STEPS.map(spec => step(spec))))
      await settle()

      const root = host.querySelector<HTMLElement>('.quantum-stepper')!
      const content = visible(root)[0]!
      const status = content.querySelector<HTMLElement>('.quantum-stepper__feedback')!

      expect(Object.hasOwn(root.dataset, 'feedback')).toBe(true)
      expect(content.querySelector<HTMLElement>('.quantum-stepper__body')!.hidden).toBe(true)
      expect(status.getAttribute('role')).toBe('status')
      expect(status.querySelector<HTMLElement>('[role="progressbar"]')!.dataset.state).toBe('indeterminate')
      expect(status.textContent).toContain('Saving settings')
      expect(getComputedStyle(status).color).toBe('rgba(0, 0, 0, 0.54)')
      // Only the active step shows it.
      expect(contents(root).filter(el => el.querySelector('.quantum-stepper__feedback')).length).toBe(1)

      feedback.value = undefined
      await settle()

      expect(root.querySelector('.quantum-stepper__feedback')).toBeNull()
      expect(visible(root)[0]!.querySelector<HTMLElement>('.quantum-stepper__body')!.hidden).toBe(false)
      expect(Object.hasOwn(root.dataset, 'feedback')).toBe(false)
    })
  })

  describe('mobile', () => {
    it('should replace the header with the 56 dp bottom bar, BACK disabled on the first step', async () => {
      const root = stepper({ props: { mobile: 'dots' }, bar: true })
      await settle()

      const bar = root.querySelector<HTMLElement>('.quantum-stepper__bar')!
      const [back, next] = [...bar.querySelectorAll<HTMLButtonElement>(':scope > .quantum-button')]

      expect(getComputedStyle(root.querySelector('.quantum-stepper__header')!).display).toBe('none')
      expect(bar.parentElement!.classList.contains('quantum-stepper__outlet')).toBe(true)
      expect(bar.getBoundingClientRect().height).toBe(56)
      expect(getComputedStyle(bar).backgroundColor).toBe('rgb(238, 238, 238)')
      expect(back!.textContent!.trim()).toBe('Back')
      expect(back!.disabled).toBe(true)
      expect(paths(back!.querySelector('.quantum-button__icon')!)).toEqual(quantumIcons['chevron-left'])
      expect(next!.textContent!.trim()).toBe('Next')
      expect(next!.disabled).toBe(false)
      expect(paths(next!)).toEqual(quantumIcons['chevron-right'])
      // The steps stay mounted, so the label still names the visible region.
      expect(document.getElementById(visible(root)[0]!.getAttribute('aria-labelledby')!)).not.toBeNull()
    })

    it('should step with NEXT and BACK and disable NEXT on the last step', async () => {
      const model = shallowRef<string>()
      const root = stepper({ model, props: { mobile: 'text' }, bar: true })
      await settle()

      const buttons = () => [...root.querySelectorAll<HTMLButtonElement>('.quantum-stepper__bar > .quantum-button')]

      await userEvent.click(buttons()[1]!)
      await settle()
      await userEvent.click(buttons()[1]!)
      await settle()

      expect(model.value).toBe('ad')
      expect(buttons()[1]!.disabled).toBe(true)

      await userEvent.click(buttons()[0]!)
      await settle()

      expect(model.value).toBe('group')
    })

    it('should emit next and back after moving', async () => {
      const model = shallowRef<string>()
      const order: string[] = []
      const host = mount(() => h(QuStepper, {
        'mobile': 'dots',
        'modelValue': model.value,
        'onUpdate:modelValue': (value: unknown) => {
          model.value = value as string
        },
      }, () => [
        ...STEPS.map(spec => step(spec)),
        h(QuStepper.Bar, {
          onNext: () => order.push(`next:${model.value}`),
          onBack: () => order.push(`back:${model.value}`),
        }),
      ]))
      await settle()

      const [back, next] = [...host.querySelectorAll<HTMLButtonElement>('.quantum-stepper__bar > .quantum-button')]

      await userEvent.click(next!)
      await settle()
      await userEvent.click(back!)
      await settle()

      expect(order).toEqual(['next:group', 'back:settings'])
    })

    it('should set BACK and NEXT 16 dp from the edges of the bar', async () => {
      const root = stepper({ props: { mobile: 'dots' }, bar: true })
      await settle()

      const bar = root.querySelector<HTMLElement>('.quantum-stepper__bar')!
      const [back, next] = [...bar.querySelectorAll<HTMLElement>(':scope > .quantum-button')]
      const edges = bar.getBoundingClientRect()

      expect(back!.querySelector('.quantum-button__icon')!.getBoundingClientRect().left - edges.left).toBe(16)
      expect(edges.right - next!.querySelector('.quantum-stepper__chevron')!.getBoundingClientRect().right).toBe(16)
    })

    it('should print "Step N of M" in a 48 dp bar above the content for the text form', async () => {
      const model = shallowRef<string | undefined>('group')
      const root = stepper({ model, props: { mobile: 'text' }, bar: true })
      await settle()

      const counter = root.querySelector<HTMLElement>('.quantum-stepper__counter')!

      expect(root.firstElementChild).toBe(counter)
      expect(counter.textContent).toBe('Step 2 of 3')
      expect(counter.getBoundingClientRect().height).toBe(48)
      expect(getComputedStyle(counter).paddingLeft).toBe('16px')
      expect(getComputedStyle(counter).fontSize).toBe('14px')
      expect(root.querySelector('.quantum-stepper__progress')).toBeNull()
    })

    it('should draw 8 dp dots at a 16 dp pitch as one progressbar valued "Step N of M"', async () => {
      const model = shallowRef<string | undefined>('group')
      const root = stepper({ model, props: { mobile: 'dots' }, bar: true })
      await settle()

      const bar = root.querySelector<HTMLElement>('.quantum-stepper__progress')!
      const dots = [...bar.querySelectorAll<HTMLElement>('.quantum-stepper__dot')]

      expect(bar.getAttribute('role')).toBe('progressbar')
      expect(bar.getAttribute('aria-valuenow')).toBe('2')
      expect(bar.getAttribute('aria-valuemax')).toBe('3')
      expect(bar.getAttribute('aria-valuetext')).toBe('Step 2 of 3')
      expect(bar.getAttribute('aria-label')).toBe('Steps')
      expect(dots.length).toBe(3)
      expect(dots[0]!.getBoundingClientRect().width).toBe(8)
      expect(dots[1]!.getBoundingClientRect().left - dots[0]!.getBoundingClientRect().left).toBe(16)
      expect(Object.hasOwn(dots[1]!.dataset, 'active')).toBe(true)
      expect(getComputedStyle(dots[1]!).backgroundColor).toBe('rgb(63, 81, 181)')
      expect(getComputedStyle(dots[0]!).backgroundColor).toBe('rgba(0, 0, 0, 0.38)')
    })

    it('should draw a 3 by 112 dp bar filled to the current step\'s share', async () => {
      const model = shallowRef<string | undefined>('group')
      const root = stepper({ model, props: { mobile: 'progress' }, bar: true })
      await settle()

      const progress = root.querySelector<HTMLElement>('.quantum-stepper__progress')!
      const track = progress.querySelector<HTMLElement>('.quantum-stepper__track')!
      const fill = track.querySelector<HTMLElement>('.quantum-stepper__fill')!

      expect(progress.getAttribute('role')).toBe('progressbar')
      expect(progress.getAttribute('aria-valuetext')).toBe('Step 2 of 3')
      expect(track.getBoundingClientRect().width).toBe(112)
      expect(track.getBoundingClientRect().height).toBe(3)
      expect(Math.round(fill.getBoundingClientRect().width)).toBe(Math.round(112 * 2 / 3))
      expect(getComputedStyle(fill).backgroundColor).toBe('rgb(63, 81, 181)')
    })
  })

  describe('orphans', () => {
    it('should warn once and render nothing for a step outside QuStepper', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = mount(() => h(QuStepperStep, { label: 'Lost' }))
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('QuStepperStep'))
      expect(host.querySelector('.quantum-stepper__step')).toBeNull()
    })

    it('should warn once and render the body in place for content outside a step', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = mount(() => h(QuStepperContent, () => 'Body'))
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('QuStepperContent'))
      expect(host.querySelector('.quantum-stepper__content')!.textContent).toBe('Body')
    })

    it('should warn once for actions outside QuStepper and keep the buttons inert', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = mount(() => h(QuStepperActions))
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('QuStepperActions'))

      await userEvent.click(host.querySelector<HTMLButtonElement>('.quantum-button')!)
    })

    it('should warn once and render nothing for a bar outside QuStepper', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const host = mount(() => h(QuStepperBar))
      await settle()

      expect(warn).toHaveBeenCalledTimes(1)
      expect(warn).toHaveBeenCalledWith(expect.stringContaining('QuStepperBar'))
      expect(host.querySelector('.quantum-stepper__bar')).toBeNull()
    })

    it('should not warn when every part sits in the compound', async () => {
      using warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      stepper({ props: { mobile: 'dots' }, bar: true, steps: STEPS.map(spec => ({ ...spec, actions: true })) })
      await settle()

      expect(warn).toHaveBeenCalledTimes(0)
    })
  })

  describe('theme', () => {
    it('should take its ink from the adapter sheet and switch the connector and bar on the dark theme', async () => {
      style(new QuantumStyleSheetAdapter().generate({
        'quantum-light': quantumColors,
        'quantum-dark': quantumDarkColors,
      }))

      const host = mount(() => h('div', { 'data-theme': 'quantum-dark' }, [
        h(QuStepper, { mobile: undefined }, () => STEPS.map(spec => step(spec))),
        h(QuStepper, { mobile: 'dots' }, () => [...STEPS.map(spec => step(spec)), h(QuStepper.Bar)]),
      ]))
      await settle()

      const [plain, mobile] = host.querySelectorAll<HTMLElement>('.quantum-stepper')

      expect(getComputedStyle(plain!).backgroundColor).toBe('rgb(66, 66, 66)')
      expect(getComputedStyle(plain!.querySelector('.quantum-stepper__connector')!).backgroundColor).toBe('rgba(255, 255, 255, 0.12)')
      expect(getComputedStyle(plain!.querySelector('.quantum-stepper__name')!).color).toBe('rgb(255, 255, 255)')
      expect(getComputedStyle(mobile!.querySelector('.quantum-stepper__bar')!).backgroundColor).toBe('rgb(33, 33, 33)')
    })
  })
})
