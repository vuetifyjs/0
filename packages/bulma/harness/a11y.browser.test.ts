import { afterAll, describe, expect, it } from 'vitest'

// Framework
import { createStackPlugin, InputRoot } from '@vuetify/v0'

// Components
import { BuBreadcrumb } from '#bulma/components/BuBreadcrumb'
import { BuBreadcrumbItem } from '#bulma/components/BuBreadcrumbItem'
import { BuCheckbox } from '#bulma/components/BuCheckbox'
import { BuControl } from '#bulma/components/BuControl'
import { BuDropdown } from '#bulma/components/BuDropdown'
import { BuDropdownMenu } from '#bulma/components/BuDropdownMenu'
import { BuDropdownTrigger } from '#bulma/components/BuDropdownTrigger'
import { BuField } from '#bulma/components/BuField'
import { BuFile } from '#bulma/components/BuFile'
import { BuHelp } from '#bulma/components/BuHelp'
import { BuInput } from '#bulma/components/BuInput'
import { BuLabel } from '#bulma/components/BuLabel'
import { BuMenu } from '#bulma/components/BuMenu'
import { BuMessage } from '#bulma/components/BuMessage'
import { BuMessageBody } from '#bulma/components/BuMessageBody'
import { BuMessageHeader } from '#bulma/components/BuMessageHeader'
import { BuModal } from '#bulma/components/BuModal'
import { BuModalBody } from '#bulma/components/BuModalBody'
import { BuModalCard } from '#bulma/components/BuModalCard'
import { BuModalFoot } from '#bulma/components/BuModalFoot'
import { BuModalHead } from '#bulma/components/BuModalHead'
import { BuModalTitle } from '#bulma/components/BuModalTitle'
import { BuNavbar } from '#bulma/components/BuNavbar'
import { BuNavbarBrand } from '#bulma/components/BuNavbarBrand'
import { BuNavbarMenu } from '#bulma/components/BuNavbarMenu'
import { BuNotification } from '#bulma/components/BuNotification'
import { BuNumberField } from '#bulma/components/BuNumberField'
import { BuNumberFieldDecrement } from '#bulma/components/BuNumberFieldDecrement'
import { BuNumberFieldIncrement } from '#bulma/components/BuNumberFieldIncrement'
import { BuNumberFieldInput } from '#bulma/components/BuNumberFieldInput'
import { BuPagination } from '#bulma/components/BuPagination'
import { BuPaginationEllipsis } from '#bulma/components/BuPaginationEllipsis'
import { BuPaginationItem } from '#bulma/components/BuPaginationItem'
import { BuPaginationList } from '#bulma/components/BuPaginationList'
import { BuPaginationNext } from '#bulma/components/BuPaginationNext'
import { BuPaginationPrev } from '#bulma/components/BuPaginationPrev'
import { BuPanel } from '#bulma/components/BuPanel'
import { BuPanelBlock } from '#bulma/components/BuPanelBlock'
import { BuPanelHeading } from '#bulma/components/BuPanelHeading'
import { BuPanelIcon } from '#bulma/components/BuPanelIcon'
import { BuPanelTab } from '#bulma/components/BuPanelTab'
import { BuPanelTabs } from '#bulma/components/BuPanelTabs'
import { BuRadio } from '#bulma/components/BuRadio'
import { BuSelect } from '#bulma/components/BuSelect'
import { BuTab } from '#bulma/components/BuTab'
import { BuTabList } from '#bulma/components/BuTabList'
import { BuTabPanel } from '#bulma/components/BuTabPanel'
import { BuTabs } from '#bulma/components/BuTabs'
import { BuTextarea } from '#bulma/components/BuTextarea'
// The audit helper is test-infrastructure shared with packages/0's canonical
// sweep — not part of the @vuetify/v0 public surface, so the barrel cannot
// serve it. The `#v0` alias exists in this package's tsconfig/vitest config
// for exactly this tooling parity; package *source* still never uses it.
import { audit, REPORT_END, REPORT_START, summarize } from '#v0/components/fixtures/audit'

// Utilities
import { createApp, h, nextTick } from 'vue'

// Types
import type { BuDropdownMenuSlotProps } from '#bulma/components/BuDropdownMenu'
import type { BuDropdownTriggerSlotProps } from '#bulma/components/BuDropdownTrigger'
import type { BuMenuSection } from '#bulma/components/BuMenu'
import type { AxeViolation } from '#v0/components/fixtures/audit'
import type { Plugin } from 'vue'

/**
 * Accessibility sweep for @paper/bulma, mirroring the canonical sweep at
 * packages/0/src/components/a11y.browser.test.ts.
 *
 * Every Bu component is mounted in the representative shape its own browser
 * test documents — interactive components in their OPEN state (modal open,
 * dropdown open with menu items, navbar burger expanded, tabs with panels) —
 * then handed to axe-core in real Chromium.
 *
 * Unlike the advisory v0 sweep, this one GATES: a compat package whose entire
 * product is upstream markup fidelity must know, per component, whether that
 * fidelity ships an axe violation. Deliberate fidelity deltas documented in
 * SPEC.md ("Known limitations" / "Declared deviations") are absorbed via the
 * EXCEPTIONS allowlist below — each entry cites the SPEC.md passage that owns
 * it. Anything not on that list fails the component's test and belongs to the
 * fix agent, not to a new allowlist entry.
 *
 * Implementation-flagged risks, as audited:
 * - BuPagination `role="button"` + `tabindex` on anchors inside nav — axe
 *   clean (role=button on href-less anchors is valid ARIA).
 * - BuNavbar burger carrying both `aria-pressed` and `aria-expanded` — axe
 *   clean (both are allowed on role=button; whether pressed belongs on a
 *   disclosure trigger is an APG question, not an axe rule).
 * - `label[disabled]` on BuCheckbox/BuRadio (SPEC.md "Known limitations") —
 *   axe does not inspect non-ARIA attribute validity; never flagged, so no
 *   EXCEPTIONS entry is needed.
 * - `aria-selected` on BuPanel/BuMenu anchors without a selectable role —
 *   was `aria-allowed-attr` (critical); FIXED: selection anchors bind
 *   hand-picked state (`is-active` + `data-selected` + `@click`), never the
 *   raw Item attrs spread (see CANON).
 * - BuTabs `<li>` interposed between `role="tablist"` and `role="tab"` —
 *   was `aria-required-children` / `aria-required-parent` / `listitem`;
 *   FIXED: the `<li>` carries `role="presentation"` so the tablist directly
 *   owns the tab anchors.
 */

interface Subject {
  plugins?: Plugin[]
  node: () => unknown
}

interface Exception {
  rule: string
  /** SPEC.md citation — an exception without one is a suppression, not a policy. */
  reason: string
}

function icon (side: string, glyph: string) {
  return h('span', { class: `icon is-small is-${side}` }, h('i', { 'class': `fas fa-${glyph}`, 'aria-hidden': 'true' }))
}

function button (props: BuDropdownTriggerSlotProps) {
  return h('button', { class: 'button', ...props.attrs }, [
    h('span', 'Dropdown button'),
    h('span', { class: 'icon is-small' }, [
      h('i', { 'class': 'fas fa-angle-down', 'aria-hidden': 'true' }),
    ]),
  ])
}

function items (props: BuDropdownMenuSlotProps) {
  return [
    h('a', { class: 'dropdown-item', href: '#', ...props.item }, ' Dropdown item '),
    h('a', { class: 'dropdown-item is-active', href: '#', ...props.item }, ' Active dropdown item '),
    h('hr', { class: 'dropdown-divider' }),
    h('a', { class: 'dropdown-item', href: '#', ...props.item }, ' With a divider '),
  ]
}

const sections: BuMenuSection<string>[] = [
  { label: 'General', items: [{ label: 'Dashboard' }, { label: 'Customers' }] },
  {
    label: 'Administration',
    items: [
      { label: 'Team Settings' },
      { label: 'Manage Your Team', children: [{ label: 'Members' }, { label: 'Plugins' }] },
      { label: 'Invitations' },
    ],
  },
]

const repos = [
  { label: 'bulma', icon: 'fas fa-book' },
  { label: 'marksheet', icon: 'fas fa-book' },
  { label: 'mojs', icon: 'fas fa-code-branch' },
]

function navbarMenu () {
  return [
    h('div', { class: 'navbar-start' }, [
      h('a', { class: 'navbar-item' }, 'Home'),
      h('a', { class: 'navbar-item' }, 'Documentation'),
      h('div', { class: 'navbar-item has-dropdown is-hoverable' }, [
        h('a', { class: 'navbar-link' }, 'More'),
        h('div', { class: 'navbar-dropdown' }, [
          h('a', { class: 'navbar-item' }, 'About'),
          h('a', { class: 'navbar-item is-selected' }, 'Jobs'),
          h('hr', { class: 'navbar-divider' }),
          h('a', { class: 'navbar-item' }, 'Report an issue'),
        ]),
      ]),
    ]),
    h('div', { class: 'navbar-end' }, [
      h('div', { class: 'navbar-item' }, [
        h('div', { class: 'buttons' }, [
          h('a', { class: 'button is-primary' }, [h('strong', 'Sign up')]),
          h('a', { class: 'button is-light' }, 'Log in'),
        ]),
      ]),
    ]),
  ]
}

// One subject per Bu component, mounted per its own browser test's
// representative shape. BuTab and BuTabPanel are exercised inside BuTabs —
// they are the compound's members, not separately mountable widgets.
const SWEEP: Record<string, Subject> = {
  BuBreadcrumb: {
    node: () => h(BuBreadcrumb, null, () => [
      h(BuBreadcrumbItem, { href: '#' }, () => 'Bulma'),
      h(BuBreadcrumbItem, { href: '#' }, () => 'Documentation'),
      h(BuBreadcrumbItem, { href: '#' }, () => 'Components'),
      h(BuBreadcrumbItem, { href: '#', current: true }, () => 'Breadcrumb'),
    ]),
  },
  BuCheckbox: {
    node: () => [
      h(BuCheckbox, () => ' Remember me '),
      // SPEC.md "Known limitations": label[disabled] is deliberate fidelity.
      h(BuCheckbox, { disabled: true }, () => ' Save my preferences '),
    ],
  },
  BuControl: {
    node: () => h(BuField, null, () => h(BuControl, { icons: 'both' }, () => [
      h(BuInput, { type: 'email', placeholder: 'Email' }),
      icon('left', 'envelope'),
      icon('right', 'check'),
    ])),
  },
  BuDropdown: {
    node: () => h(BuDropdown, { modelValue: true, menu: true }, () => [
      h(BuDropdownTrigger, null, { default: button }),
      h(BuDropdownMenu, null, { default: items }),
    ]),
  },
  BuField: {
    node: () => h(BuField, null, () => [
      h(BuLabel, null, () => 'Label'),
      h(BuControl, null, () => h(BuInput, { placeholder: 'Text input' })),
      h(BuHelp, null, () => 'This is a help text'),
    ]),
  },
  BuFile: {
    node: () => h(BuFile, { filename: true, name: 'resume' }),
  },
  BuHelp: {
    node: () => h(BuField, null, () => [
      h(BuLabel, null, () => 'Email'),
      h(BuControl, { icons: 'both' }, () => [
        h(BuInput, { color: 'danger', type: 'email', placeholder: 'Email input' }),
        icon('left', 'envelope'),
        icon('right', 'exclamation-triangle'),
      ]),
      h(BuHelp, { color: 'danger' }, () => 'This email is invalid'),
    ]),
  },
  BuInput: {
    node: () => h(BuControl, null, () => h(BuInput, { placeholder: 'Text input' })),
  },
  BuLabel: {
    // Real wiring usage: `for` resolves from an ambient Input.Root context.
    node: () => h(InputRoot, { renderless: true, id: 'a11y-email' }, () => [
      h(BuLabel, null, () => 'Email'),
      h(BuControl, null, () => h(BuInput)),
    ]),
  },
  BuMenu: {
    node: () => h(BuMenu as any, { items: sections, modelValue: 'Manage Your Team' }),
  },
  BuMessage: {
    node: () => h(BuMessage, {}, () => [
      h(BuMessageHeader, null, () => h('p', 'Hello World')),
      h(BuMessageBody, null, () => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
    ]),
  },
  BuModal: {
    plugins: [createStackPlugin()],
    node: () => h(BuModal, { modelValue: true }, () => h(BuModalCard, null, () => [
      h(BuModalHead, null, () => h(BuModalTitle, null, () => 'Modal title')),
      h(BuModalBody, null, () => 'Modal body content'),
      h(BuModalFoot, null, () => h('div', { class: 'buttons' }, [
        h('button', { class: 'button is-success' }, 'Save changes'),
        h('button', { class: 'button' }, 'Cancel'),
      ])),
    ])),
  },
  BuNavbar: {
    // Open state: burger expanded, menu shown.
    node: () => h(BuNavbar, { id: 'navbarBasicExample', modelValue: true }, () => [
      h(BuNavbarBrand, null, () => h('a', { class: 'navbar-item', href: 'https://bulma.io' }, [
        h('img', { src: 'logo.png', alt: 'Logo' }),
      ])),
      h(BuNavbarMenu, null, () => navbarMenu()),
    ]),
  },
  BuNotification: {
    node: () => h(BuNotification, {}, () => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'),
  },
  BuNumberField: {
    // Mounted LABELLED: the spinbutton is a real <input>, so axe's `label` rule
    // applies to it like any other input and a bare mount would fail on naming
    // alone. Two rules that look like they should fire here do not, verified in
    // axe-core 4.12.1's bundle:
    // - `aria-required-attr` does not demand aria-valuenow on a null value —
    //   it reads standards.ariaRoles.spinbutton, whose entry defines
    //   allowedAttrs only. A second, legacy role table in the same bundle does
    //   list required: ['aria-valuenow'], but the rule never reads it. Re-check
    //   on an axe-core major bump: if that ever flips, an empty BuNumberField
    //   becomes a critical violation and aria-valuenow would have to be emitted
    //   for null upstream in v0.
    // - `aria-input-field-name` does not apply — its matcher is
    //   no-naming-method-matches, which excludes any element whose spec has
    //   native naming methods, and <input> has one.
    // tabindex="-1" on the steppers is the APG spinbutton pattern (keyboard
    // access is via the input), not a violation; button-name is satisfied by
    // v0's localized aria-label.
    node: () => h(BuField, null, () => [
      h(BuLabel, { for: 'a11y-quantity' }, () => 'Quantity'),
      h(BuNumberField, { id: 'a11y-quantity', min: 0, max: 10 }, () => [
        h(BuNumberFieldDecrement),
        h(BuNumberFieldInput, { expanded: true }),
        h(BuNumberFieldIncrement),
      ]),
    ]),
  },
  BuPagination: {
    node: () => h(BuPagination, { pages: 86, modelValue: 46, visible: 7 }, {
      default: ({ items }: { items: { type: string, value: number }[] }) => [
        h(BuPaginationPrev, null, () => 'Previous'),
        h(BuPaginationNext, null, () => 'Next page'),
        h(BuPaginationList, null, () => items.map((item, index) =>
          item.type === 'page'
            ? h(BuPaginationItem, { key: index, value: item.value })
            : h(BuPaginationEllipsis, { key: index }),
        )),
      ],
    }),
  },
  BuPanel: {
    node: () => h(BuPanel as any, { modelValue: 'bulma' }, () => [
      h(BuPanelHeading, null, () => 'Repositories'),
      h('div', { class: 'panel-block' }, [
        h('p', { class: 'control has-icons-left' }, [
          h('input', { 'class': 'input', 'type': 'text', 'placeholder': 'Search', 'aria-label': 'Search' }),
          h('span', { class: 'icon is-left' }, [
            h('i', { 'class': 'fas fa-search', 'aria-hidden': 'true' }),
          ]),
        ]),
      ]),
      h(BuPanelTabs as any, null, () => ['All', 'Public', 'Private'].map(label =>
        h(BuPanelTab as any, { key: label, value: label }, () => label),
      )),
      repos.map(repo => h(BuPanelBlock as any, { key: repo.label, value: repo.label }, () => [
        h(BuPanelIcon, { icon: repo.icon }),
        repo.label,
      ])),
      h('label', { class: 'panel-block' }, [h('input', { type: 'checkbox' }), ' remember me ']),
      h('div', { class: 'panel-block' }, [
        h('button', { class: 'button is-link is-outlined is-fullwidth' }, ' Reset all filters '),
      ]),
    ]),
  },
  BuRadio: {
    node: () => h('div', { class: 'control' }, [
      h(BuRadio, { name: 'answer', value: 'yes' }, () => ' Yes '),
      h(BuRadio, { name: 'answer', value: 'no' }, () => ' No '),
      // SPEC.md "Known limitations": label[disabled] is deliberate fidelity.
      h(BuRadio, { disabled: true, name: 'answer', value: 'maybe' }, () => ' Maybe '),
    ]),
  },
  BuSelect: {
    // Named via userland `<label for>` against the `id` prop — the only path
    // to an accessible name: fallthrough attrs (incl. `aria-label`) land on
    // the `.select` wrapper div, never the native select (recorded finding).
    node: () => h(BuField, null, () => [
      h('label', { class: 'label', for: 'a11y-country' }, 'Country'),
      h(BuControl, null, () => h(BuSelect, { id: 'a11y-country' }, () => [
        h('option', 'Select dropdown'),
        h('option', 'With options'),
      ])),
    ]),
  },
  BuTabs: {
    node: () => h(BuTabs as any, null, () => [
      h(BuTabList, null, () => [
        h(BuTab as any, { value: 'pictures' }, () => 'Pictures'),
        h(BuTab as any, { value: 'music' }, () => 'Music'),
      ]),
      h(BuTabPanel as any, { value: 'pictures' }, () => 'Pictures panel'),
      h(BuTabPanel as any, { value: 'music' }, () => 'Music panel'),
    ]),
  },
  BuTextarea: {
    node: () => h(BuControl, null, () => h(BuTextarea, { placeholder: 'e.g. Hello world' })),
  },
}

/**
 * Violations absorbed as documented, deliberate markup — every entry must cite
 * SPEC.md. An empty list means the package currently ships zero axe-visible
 * deviations; keep it that way unless SPEC.md grows a new documented one.
 */
const EXCEPTIONS: Record<string, Exception[]> = {}

/** Let Vue flush, then let the browser paint, so axe sees settled layout. */
function settle () {
  return nextTick().then(() => new Promise(resolve => requestAnimationFrame(resolve)))
}

const collected: AxeViolation[] = []

afterAll(() => {
  console.log(`\n${REPORT_START}\n${summarize(collected)}\n${REPORT_END}\n`)
})

/**
 * Mount one subject into a `<main>` landmark (a bare div off `<body>` is not a
 * page — see the canonical sweep's docblock), audit the whole body so any
 * teleported content is covered, and return what axe found plus how many
 * elements rendered — a subject that renders nothing passes every rule silently.
 */
async function sweep (subject: string, entry: Subject) {
  const container = document.createElement('main')
  document.body.append(container)

  const before = document.body.querySelectorAll('*').length

  const app = createApp({ render: entry.node })
  for (const plugin of entry.plugins ?? []) app.use(plugin)

  try {
    app.mount(container)

    await settle()

    const rendered = document.body.querySelectorAll('*').length - before
    const violations = await audit(subject, document.body)

    return { rendered, violations }
  } finally {
    // Unconditional: a leaked `<main>` corrupts every later audit with
    // landmark-unique / landmark-no-duplicate-main noise.
    app.unmount()
    container.remove()
  }
}

describe('accessibility sweep', () => {
  for (const [name, entry] of Object.entries(SWEEP)) {
    it(`should pass axe for ${name}`, async () => {
      const { rendered, violations } = await sweep(name, entry)

      expect(rendered).toBeGreaterThan(0)

      collected.push(...violations)

      const excepted = EXCEPTIONS[name] ?? []
      const outstanding = violations.filter(violation =>
        !excepted.some(exception => exception.rule === violation.rule),
      )

      expect(
        outstanding.map(violation => `${violation.rule} (${violation.impact}): ${violation.nodes.join(' | ')}`),
      ).toEqual([])
    })
  }
})
