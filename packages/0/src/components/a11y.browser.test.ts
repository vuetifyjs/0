import { afterAll, describe, expect, it } from 'vitest'

// Context
import AlertDialogFixture from './fixtures/AlertDialog.vue'
import AspectRatioFixture from './fixtures/AspectRatio.vue'
import AtomFixture from './fixtures/Atom.vue'
import AvatarFixture from './fixtures/Avatar.vue'
import BreadcrumbsFixture from './fixtures/Breadcrumbs.vue'
import ButtonFixture from './fixtures/Button.vue'
import CarouselFixture from './fixtures/Carousel.vue'
import CheckboxFixture from './fixtures/Checkbox.vue'
import CollapsibleFixture from './fixtures/Collapsible.vue'
import ComboboxFixture from './fixtures/Combobox.vue'
import DialogFixture from './fixtures/Dialog.vue'
import ExpansionPanelFixture from './fixtures/ExpansionPanel.vue'
import FormFixture from './fixtures/Form.vue'
import GroupFixture from './fixtures/Group.vue'
import ImageFixture from './fixtures/Image.vue'
import InputFixture from './fixtures/Input.vue'
import LocaleFixture from './fixtures/Locale.vue'
import NumberFieldFixture from './fixtures/NumberField.vue'
import OverflowFixture from './fixtures/Overflow.vue'
import PaginationFixture from './fixtures/Pagination.vue'
import PopoverFixture from './fixtures/Popover.vue'
import PortalFixture from './fixtures/Portal.vue'
import PresenceFixture from './fixtures/Presence.vue'
import ProgressFixture from './fixtures/Progress.vue'
import RadioFixture from './fixtures/Radio.vue'
import RatingFixture from './fixtures/Rating.vue'
import ScrimFixture from './fixtures/Scrim.vue'
import SelectFixture from './fixtures/Select.vue'
import SelectionFixture from './fixtures/Selection.vue'
import SingleFixture from './fixtures/Single.vue'
import SliderFixture from './fixtures/Slider.vue'
import SnackbarFixture from './fixtures/Snackbar.vue'
import SplitterFixture from './fixtures/Splitter.vue'
import StepFixture from './fixtures/Step.vue'
import SwitchFixture from './fixtures/Switch.vue'
import TabsFixture from './fixtures/Tabs.vue'
import ThemeFixture from './fixtures/Theme.vue'
import ToggleFixture from './fixtures/Toggle.vue'
import TooltipFixture from './fixtures/Tooltip.vue'
import TreeviewFixture from './fixtures/Treeview.vue'

// Composables
import { createStackPlugin } from '#v0/composables/useStack'

import {
  createLocalePlugin,
  createNotificationsPlugin,
  createRtlPlugin,
  createThemePlugin,
  createTooltipPlugin,
} from '#v0/composables'
import maturity from '#v0/maturity.json'

import { audit, REPORT_END, REPORT_START, summarize } from './fixtures/audit'

// Utilities
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'

// Types
import type { AxeViolation } from './fixtures/audit'

/**
 * Advisory accessibility sweep.
 *
 * Every shipped component is mounted in the shape its own `@example` JSDoc
 * tells users to write, then handed to axe-core running in real Chromium. The
 * 35 test files that already assert `aria-*` by hand are not replaced by this —
 * they check the attribute the author remembered; this checks the ones nobody
 * thought to.
 *
 * The sweep does not fail on violations. The first pass is red by design: the
 * open a11y batch (#608, #611-#616) was found by manual audit *after* those 35
 * files passed, and #608 and #613 map onto stock axe rules. Gating on day one
 * buys either a red master or a pile of rule suppressions written to deadline,
 * and a suppression written to get CI green is a permanently invisible
 * violation. This reports; the burn-down happens in its own PRs; the gate goes
 * on by deleting `continue-on-error` from the `a11y` job in pr-checks.yml and
 * asserting on `violations` here.
 *
 * axe-core direct rather than `vitest-axe`, which the accessibility guide
 * recommends to users: `vitest-axe` reaches for `node:module` at import time
 * and cannot load in browser mode at either 0.1.0 or 1.0.0-pre.5. It is a
 * jsdom/happy-dom tool. Running the audit where layout is simulated is the
 * thing this sweep exists to avoid, so the wrapper goes and the engine stays.
 */

// One fixture per shipped component. Listed rather than globbed, matching the
// explicit-array convention in src/surface.test.ts — a component entering or
// leaving the sweep should be a reviewable diff, not a side effect of a glob.
const FIXTURES: Record<string, unknown> = {
  AlertDialog: AlertDialogFixture,
  AspectRatio: AspectRatioFixture,
  Atom: AtomFixture,
  Avatar: AvatarFixture,
  Breadcrumbs: BreadcrumbsFixture,
  Button: ButtonFixture,
  Carousel: CarouselFixture,
  Checkbox: CheckboxFixture,
  Collapsible: CollapsibleFixture,
  Combobox: ComboboxFixture,
  Dialog: DialogFixture,
  ExpansionPanel: ExpansionPanelFixture,
  Form: FormFixture,
  Group: GroupFixture,
  Image: ImageFixture,
  Input: InputFixture,
  Locale: LocaleFixture,
  NumberField: NumberFieldFixture,
  Overflow: OverflowFixture,
  Pagination: PaginationFixture,
  Popover: PopoverFixture,
  Portal: PortalFixture,
  Presence: PresenceFixture,
  Progress: ProgressFixture,
  Radio: RadioFixture,
  Rating: RatingFixture,
  Scrim: ScrimFixture,
  Select: SelectFixture,
  Selection: SelectionFixture,
  Single: SingleFixture,
  Slider: SliderFixture,
  Snackbar: SnackbarFixture,
  Splitter: SplitterFixture,
  Step: StepFixture,
  Switch: SwitchFixture,
  Tabs: TabsFixture,
  Theme: ThemeFixture,
  Toggle: ToggleFixture,
  Tooltip: TooltipFixture,
  Treeview: TreeviewFixture,
}

/**
 * Shipped components, per maturity.json — the same registry that drives the
 * docs badges. `draft` entries are planned components with no source yet.
 * Deriving the expected set from it rather than from this file is what makes
 * the manifest check below load-bearing: promoting a component out of draft
 * without writing it a fixture fails the sweep.
 */
const SHIPPED = Object.entries(maturity.components)
  .filter(([, entry]) => entry.level !== 'draft')
  .map(([name]) => name)
  .toSorted()

/** Let Vue flush, then let the browser paint, so axe sees settled layout. */
function settle () {
  return nextTick().then(() => new Promise(resolve => requestAnimationFrame(resolve)))
}

/** The same violation found in both the collapsed and expanded pass is one violation. */
function dedupe (collected: AxeViolation[]) {
  const seen = new Map<string, AxeViolation>()

  for (const violation of collected) {
    const key = `${violation.rule}::${violation.nodes.join('|')}`
    if (!seen.has(key)) seen.set(key, violation)
  }

  return [...seen.values()]
}

const violations: AxeViolation[] = []

afterAll(() => {
  // Single place the count is published. Fenced by markers so the `a11y` job
  // can lift it out of the run log and into the GitHub step summary without
  // the sweep needing filesystem access it does not have — it runs in Chromium.
  console.log(`\n${REPORT_START}\n${summarize(violations)}\n${REPORT_END}\n`)
})

describe('accessibility sweep', () => {
  it('should have a fixture for every shipped component', () => {
    const covered = Object.keys(FIXTURES)
    const missing = SHIPPED.filter(name => !covered.includes(name))
    const orphaned = covered.filter(name => !SHIPPED.includes(name)).toSorted()

    // The one assertion in this file that is allowed to fail, and what makes
    // the sweep a sweep: a component with no fixture is not a component that
    // passed the audit.
    expect({ missing, orphaned }).toEqual({ missing: [], orphaned: [] })
  })

  for (const [name, fixture] of Object.entries(FIXTURES)) {
    it(`should record axe violations for ${name}`, async () => {
      // A bare `<div>` hung off `<body>` is not a page, and axe is right to say
      // so — every component would otherwise report `region` ("all content must
      // be contained by landmarks") for markup the component does not own. Give
      // the harness a `<main>` landmark instead of turning the rule off, so the
      // published count stays the components' own.
      const container = document.createElement('main')
      document.body.append(container)

      const before = document.body.querySelectorAll('*').length

      const wrapper = mount(fixture as any, {
        attachTo: container,
        global: {
          plugins: [
            createStackPlugin(),
            createLocalePlugin(),
            createRtlPlugin(),
            createTooltipPlugin(),
            createNotificationsPlugin(),
            createThemePlugin({
              default: 'light',
              themes: {
                light: { dark: false, colors: { primary: '#1976d2' } },
                dark: { dark: true, colors: { primary: '#90caf9' } },
              },
            }),
          ],
        },
      })

      await settle()

      // A fixture that renders nothing passes every axe rule, silently. That is
      // the one way this sweep could report a clean component while auditing an
      // empty page, so it is the one thing asserted per fixture. Violations
      // themselves are collected, not asserted — see the header comment.
      expect(document.body.querySelectorAll('*').length).toBeGreaterThan(before)

      // document.body, not wrapper.element: Dialog, Popover, Select, Combobox,
      // Tooltip and Snackbar teleport their content out of the mount point, and
      // that content is where most of their ARIA lives.
      const collected = await audit(name, document.body)

      // Audit the expanded state too. Select and Combobox own their open state
      // internally — there is no prop to start them open — so the only way to
      // see the listbox markup is to press the thing a user would press. Roots
      // that expose an open v-model are already mounted open by their fixture.
      const trigger = document.body.querySelector<HTMLElement>('[aria-expanded="false"]')

      if (trigger) {
        trigger.click()
        await settle()
        collected.push(...await audit(name, document.body))
      }

      violations.push(...dedupe(collected))

      wrapper.unmount()
      container.remove()
    })
  }
})
