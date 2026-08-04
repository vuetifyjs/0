<!--
  Form validation showcase. Real validation throughout: EmTextField / EmTextarea
  wrap v0's Input.Root, which accepts `rules` (FormValidationRule[]) and
  `validateOn` directly and auto-registers with an ancestor v0 `Form` via
  createValidation/createForm — no hand-rolled error state anywhere on this
  page. See GAPS.md: "no gap, this is a real-build page" for Form validation.

  Read top to bottom the page goes real form → when validation fires → the rule
  catalogue, so the working example leads and the reference material follows it.

  Near-miss (recorded in gaps-pages.md): EmSelect / EmCheckbox / EmRadio /
  EmSwitch accept `namespace` for their own compound context but do NOT wrap
  Input.Root, so they don't auto-register with createForm the way EmTextField
  / EmTextarea do — the target, region, catalogue checkboxes, alert switches
  and listing-plan radios carry real local state but sit outside the vendor
  form's aggregate `isValid`.
-->
<script setup lang="ts">
  import {
    EmButton,
    EmCard,
    EmCardBody,
    EmCardHeader,
    EmCardTitle,
    EmCheckbox,
    EmRadio,
    EmRadioGroup,
    EmSelect,
    EmSelectActivator,
    EmSelectContent,
    EmSelectItem,
    EmSelectPlaceholder,
    EmSelectValue,
    EmSwitch,
    EmTextField,
    EmTextarea,
  } from '@paper/emerald'

  // Framework
  import { Form } from '@vuetify/v0'

  // Context
  import EmeraldShell from './EmeraldShell.vue'

  // Utilities
  import { nextTick, ref, shallowRef, toRef } from 'vue'

  function required (v: unknown): boolean | string {
    return (!!v && String(v).trim().length > 0) || 'This field is required'
  }

  function email (v: unknown): boolean | string {
    return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)) || 'Needs one @ and a dotted domain'
  }

  function url (v: unknown): boolean | string {
    return !v || /^https?:\/\/.+/.test(String(v)) || 'Start with http:// or https://'
  }

  function slug (v: unknown): boolean | string {
    return !v || /^[a-z0-9][a-z0-9-]{2,31}$/.test(String(v)) || 'Lowercase letters, numbers and dashes, 3–32 characters'
  }

  function semver (v: unknown): boolean | string {
    return !v || /^\d+\.\d+\.\d+(-[\da-z.-]+)?$/i.test(String(v)) || 'Use major.minor.patch, e.g. 2.4.0 or 3.0.0-beta.1'
  }

  function hex (v: unknown): boolean | string {
    return !v || /^#?[\da-f]{6}$/i.test(String(v)) || 'Six hex digits, with or without the leading hash'
  }

  function alpha (v: unknown): boolean | string {
    return !v || /^[A-Za-z]+$/.test(String(v)) || 'Letters only — no spaces or punctuation'
  }

  function pattern (v: unknown): boolean | string {
    return !v || /^[A-Z]{2}-\d{4}$/.test(String(v)) || String.raw`Must match ^[A-Z]{2}-\d{4}$, e.g. VX-2048`
  }

  function digits (v: unknown): boolean | string {
    return !v || /^\d{4}$/.test(String(v)) || 'Digits only, exactly four of them'
  }

  function exact (v: unknown): boolean | string {
    return !v || String(v).length === 3 || 'Exactly three characters'
  }

  function between (v: unknown): boolean | string {
    return !v || (String(v).length >= 5 && String(v).length <= 40) || 'Between 5 and 40 characters'
  }

  function range (v: unknown): boolean | string {
    return !v || (Number(v) >= 10 && Number(v) <= 500) || 'A number from 10 to 500'
  }

  // The rule catalogue: one live field per rule, each with the signature it is
  // registered under and the constraint stated in prose.
  const checks = [
    { key: 'required', sig: 'required', desc: 'Rejects empty strings and whitespace-only input.', placeholder: 'Leave me blank to see it fire', rules: [required] },
    { key: 'email', sig: 'email', desc: 'One @, a dotted domain, no whitespace anywhere.', placeholder: 'vendor@studio.dev', rules: [email] },
    { key: 'url', sig: 'url', desc: 'An absolute http or https address.', placeholder: 'https://studio.dev', rules: [url] },
    { key: 'slug', sig: 'slug()', desc: 'Publisher handles: lowercase letters, numbers and dashes, 3 to 32 characters.', placeholder: 'northwind-labs', rules: [slug] },
    { key: 'semver', sig: 'semver()', desc: 'A release version — major.minor.patch, optionally with a pre-release tag.', placeholder: '3.0.0-beta.1', rules: [semver] },
    { key: 'hex', sig: 'hex()', desc: 'A six-digit hex colour for a token override, hash optional.', placeholder: '#1fae60', rules: [hex] },
    { key: 'alpha', sig: 'alpha', desc: 'Letters and nothing else.', placeholder: 'Emerald', rules: [alpha] },
    { key: 'pattern', sig: 'pattern(re)', desc: 'Anything you can express as a regular expression.', placeholder: 'VX-2048', rules: [pattern] },
    { key: 'digits', sig: 'digits(4)', desc: 'Only digits, and exactly the count you asked for.', placeholder: '2048', rules: [digits] },
    { key: 'exact', sig: 'length(3)', desc: 'A string of exactly this length.', placeholder: 'USD', rules: [exact] },
    { key: 'between', sig: 'between(5, 40)', desc: 'A length inside an inclusive window.', placeholder: 'A short catalogue title', rules: [between] },
    { key: 'range', sig: 'range(10, 500)', desc: 'A number inside an inclusive window.', placeholder: '250', rules: [range] },
  ] as const

  const values = ref<Record<string, string>>(Object.fromEntries(checks.map(check => [check.key, ''])))

  // Same four validateOn values the Input contract ships, read as a timeline.
  const modes = [
    { key: 'input', sig: 'input', fires: 'On every keystroke.', reach: 'Live feedback where the answer is obvious as you type — handles, slugs, colours.', validateOn: 'input' as const },
    { key: 'blur', sig: 'blur', fires: 'When focus leaves the field.', reach: 'The quiet default. Nobody is scolded mid-word.', validateOn: 'blur' as const },
    { key: 'submit', sig: 'submit', fires: 'Only when the form is submitted.', reach: 'Short forms where interrupting costs more than a late error.', validateOn: 'submit' as const },
    { key: 'eager', sig: 'blur eager', fires: 'First on blur, then on every change after that.', reach: 'Long forms — silent until you have had a go, then live while you fix it.', validateOn: 'blur eager' as const },
  ]

  const probes = ref<Record<string, string>>(Object.fromEntries(modes.map(mode => [mode.key, ''])))

  const targets = ['Vuetify 4', 'Vuetify 3', 'Vuetify0 (headless)', 'Nuxt module']
  const regions = ['United States', 'European Union', 'United Kingdom', 'Australia', 'Singapore']

  const studio = shallowRef('')
  const handle = shallowRef('')
  const contact = shallowRef('')
  const site = shallowRef('')
  const hours = shallowRef('')
  const summary = shallowRef('')
  const target = shallowRef<string>()
  const region = shallowRef<string>()
  const count = toRef(() => summary.value.length)

  const catalogue = ref({ themes: false, components: false, icons: false, starters: false })
  const alerts = ref({ releases: true, beta: false, approval: false })
  const plan = shallowRef<'solo' | 'studio' | 'agency'>()

  function windowRule (v: unknown): boolean | string {
    return !v || (Number(v) >= 1 && Number(v) <= 72) || 'Between 1 and 72 hours'
  }

  function summaryRule (v: unknown): boolean | string {
    return String(v).length <= 400 || 'Keep the summary to 400 characters or fewer'
  }

  const result = shallowRef<'idle' | 'valid' | 'invalid'>('idle')

  async function onApply (submit: () => Promise<boolean>) {
    const valid = await submit()
    result.value = valid ? 'valid' : 'invalid'
  }

  // v0's Form.reset() clears validation state across the registry but does not
  // restore field values — the page owns those models, so it clears them here.
  // Values are cleared first and flushed, so the live `input` validators run
  // before reset() wipes the state they would otherwise repopulate.
  async function onApplyReset (reset: () => void) {
    studio.value = ''
    handle.value = ''
    contact.value = ''
    site.value = ''
    hours.value = ''
    summary.value = ''
    target.value = undefined
    region.value = undefined
    plan.value = undefined
    catalogue.value = { themes: false, components: false, icons: false, starters: false }
    alerts.value = { releases: true, beta: false, approval: false }
    result.value = 'idle'
    await nextTick()
    reset()
  }

  async function onProbeReset (reset: () => void, key: string) {
    probes.value[key] = ''
    await nextTick()
    reset()
  }

  async function onChecksReset (reset: () => void) {
    for (const check of checks) values.value[check.key] = ''
    await nextTick()
    reset()
  }
</script>

<template>
  <EmeraldShell>
    <div class="adm-forms">
      <header class="adm-forms__head">
        <h1 class="adm-forms__title">Marketplace vendor onboarding</h1>
        <p class="adm-forms__sub">Every field below validates for real via v0's <code>rules</code> and <code>validateOn</code> on <code>EmTextField</code> / <code>EmTextarea</code>, aggregated by v0's <code>Form</code>.</p>
      </header>

      <EmCard variant="simple">
        <EmCardHeader>
          <EmCardTitle>Apply to publish</EmCardTitle>
          <p class="adm-forms__panel-sub">Tell us who you are, what you intend to list, and how quickly you answer your buyers.</p>
        </EmCardHeader>

        <Form v-slot="{ isValid, submit, reset }">
          <EmCardBody class="adm-forms__sections">
            <section class="adm-forms__section">
              <div class="adm-forms__section-lede">
                <h3 class="adm-forms__section-title">Studio</h3>
                <p class="adm-forms__section-sub">Who is behind the listings, and where buyers can look you up.</p>
              </div>

              <div class="adm-forms__fields">
                <EmTextField
                  v-model="studio"
                  description="Shown on every listing you publish"
                  label="Studio name"
                  placeholder="Northwind Labs"
                  :rules="[required]"
                  validate-on="blur lazy"
                />

                <EmTextField
                  v-model="handle"
                  description="Becomes your marketplace URL — it cannot be changed later"
                  label="Publisher handle"
                  placeholder="northwind-labs"
                  :rules="[required, slug]"
                  validate-on="input lazy"
                />

                <EmTextField
                  v-model="contact"
                  description="Where release approvals and buyer escalations are sent"
                  label="Contact email"
                  placeholder="team@northwind.dev"
                  :rules="[required, email]"
                  validate-on="blur lazy"
                />

                <EmTextField
                  v-model="site"
                  description="A portfolio, repository, or existing storefront"
                  label="Website"
                  placeholder="https://northwind.dev"
                  :rules="[url]"
                  validate-on="blur lazy"
                />
              </div>
            </section>

            <section class="adm-forms__section">
              <div class="adm-forms__section-lede">
                <h3 class="adm-forms__section-title">Catalogue</h3>
                <p class="adm-forms__section-sub">What you plan to list, and which layer of the stack it targets.</p>
              </div>

              <div class="adm-forms__fields">
                <div class="adm-forms__group">
                  <span class="adm-forms__group-label">Listing types</span>
                  <p class="adm-forms__group-sub">Pick everything you expect to publish in your first year</p>

                  <div class="adm-forms__checks">
                    <EmCheckbox v-model="catalogue.themes">Themes</EmCheckbox>
                    <EmCheckbox v-model="catalogue.components">Component packs</EmCheckbox>
                    <EmCheckbox v-model="catalogue.icons">Icon sets</EmCheckbox>
                    <EmCheckbox v-model="catalogue.starters">Starter templates</EmCheckbox>
                  </div>
                </div>

                <EmSelect v-model="target" label="Primary target">
                  <EmSelectActivator>
                    <EmSelectValue />
                    <EmSelectPlaceholder>Choose the layer you build against</EmSelectPlaceholder>

                    <svg
                      aria-hidden="true"
                      class="emerald-select__icon"
                      fill="none"
                      height="16"
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      viewBox="0 0 16 16"
                      width="16"
                    ><path d="M4 6l4 4 4-4" /></svg>
                  </EmSelectActivator>

                  <EmSelectContent>
                    <EmSelectItem v-for="item in targets" :key="item" :value="item">{{ item }}</EmSelectItem>
                  </EmSelectContent>
                </EmSelect>

                <EmTextarea
                  v-model="summary"
                  :description="`What a buyer sees before they open a listing (${count}/400 characters)`"
                  label="Catalogue summary"
                  placeholder="Dense data-heavy screens for logistics teams, built on the headless table primitives…"
                  :rules="[summaryRule]"
                  validate-on="input lazy"
                />
              </div>
            </section>

            <section class="adm-forms__section">
              <div class="adm-forms__section-lede">
                <h3 class="adm-forms__section-title">Operations</h3>
                <p class="adm-forms__section-sub">How you get paid, how fast you answer, and how releases leave your hands.</p>
              </div>

              <div class="adm-forms__fields">
                <div class="adm-forms__pair">
                  <EmTextField
                    v-model="hours"
                    description="The response time published on your storefront"
                    label="Support window (hours)"
                    placeholder="24"
                    :rules="[required, windowRule]"
                    type="number"
                    validate-on="blur lazy"
                  />

                  <EmSelect v-model="region" label="Payout region">
                    <EmSelectActivator>
                      <EmSelectValue />
                      <EmSelectPlaceholder>Select a region</EmSelectPlaceholder>

                      <svg
                        aria-hidden="true"
                        class="emerald-select__icon"
                        fill="none"
                        height="16"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        viewBox="0 0 16 16"
                        width="16"
                      ><path d="M4 6l4 4 4-4" /></svg>
                    </EmSelectActivator>

                    <EmSelectContent>
                      <EmSelectItem v-for="item in regions" :key="item" :value="item">{{ item }}</EmSelectItem>
                    </EmSelectContent>
                  </EmSelect>
                </div>

                <div class="adm-forms__group">
                  <span class="adm-forms__group-label">Release handling</span>
                  <p class="adm-forms__group-sub">Applies to every package under this publisher handle</p>

                  <div class="adm-forms__switch-row">
                    <span>Release announcements<small>Post to the marketplace changelog when you publish</small></span>
                    <EmSwitch v-model="alerts.releases" aria-label="Release announcements" size="sm" />
                  </div>

                  <div class="adm-forms__switch-row">
                    <span>Beta channel access<small>Test against pre-release builds before they ship</small></span>
                    <EmSwitch v-model="alerts.beta" aria-label="Beta channel access" size="sm" />
                  </div>

                  <div class="adm-forms__switch-row">
                    <span>Two-person release approval<small>A second maintainer must sign off before anything publishes</small></span>
                    <EmSwitch v-model="alerts.approval" aria-label="Two-person release approval" size="sm" />
                  </div>
                </div>

                <div class="adm-forms__group">
                  <span class="adm-forms__group-label">Listing plan</span>
                  <p class="adm-forms__group-sub">Sets your revenue share and how many listings you may keep live</p>

                  <EmRadioGroup v-model="plan" class="adm-forms__plans" label="Listing plan">
                    <label class="adm-forms__plan" :data-selected="plan === 'solo' || undefined">
                      <EmRadio value="solo" />
                      <span><strong>Solo</strong><small>One maintainer, up to three live listings</small></span>
                    </label>

                    <label class="adm-forms__plan" :data-selected="plan === 'studio' || undefined">
                      <EmRadio value="studio" />
                      <span><strong>Studio</strong><small>Up to eight maintainers, unlimited listings</small></span>
                    </label>

                    <label class="adm-forms__plan" :data-selected="plan === 'agency' || undefined">
                      <EmRadio value="agency" />
                      <span><strong>Agency</strong><small>White-label listings and reseller terms</small></span>
                    </label>
                  </EmRadioGroup>
                </div>
              </div>
            </section>
          </EmCardBody>

          <div class="adm-forms__actions">
            <EmButton variant="primary" @click="onApply(submit)">Submit application</EmButton>
            <EmButton variant="tertiary" @click="onApplyReset(reset)">Reset</EmButton>

            <span v-if="result !== 'idle'" class="adm-forms__status" :data-state="result">
              {{ result === 'valid' ? 'Application is ready to send' : 'Please fix the highlighted fields' }}
            </span>

            <span v-else class="adm-forms__status" :data-state="isValid === null ? 'idle' : isValid ? 'valid' : 'invalid'">
              {{ isValid === null ? 'Not yet validated' : isValid ? 'All fields valid' : 'Some fields need attention' }}
            </span>
          </div>
        </Form>
      </EmCard>

      <EmCard variant="simple">
        <EmCardHeader>
          <EmCardTitle>When validation fires</EmCardTitle>
          <p class="adm-forms__panel-sub">The four <code>validate-on</code> values, ordered from loudest to most patient. Type in each field to feel the difference.</p>
        </EmCardHeader>

        <EmCardBody class="adm-forms__timeline">
          <Form
            v-for="(mode, index) in modes"
            :key="mode.key"
            v-slot="{ submit, reset }"
            class="adm-forms__stage"
          >
            <span aria-hidden="true" class="adm-forms__marker">{{ index + 1 }}</span>

            <code class="adm-forms__stage-sig">{{ mode.sig }}</code>
            <p class="adm-forms__stage-fires">{{ mode.fires }}</p>

            <EmTextField
              v-model="probes[mode.key]"
              label="Try it"
              placeholder="Type, then tab away…"
              :rules="[required]"
              :validate-on="mode.validateOn"
            />

            <p class="adm-forms__stage-reach">{{ mode.reach }}</p>

            <div class="adm-forms__actions">
              <EmButton size="sm" variant="primary" @click="submit()">Submit</EmButton>
              <EmButton size="sm" variant="tertiary" @click="onProbeReset(reset, mode.key)">Reset</EmButton>
            </div>
          </Form>
        </EmCardBody>
      </EmCard>

      <EmCard variant="simple">
        <EmCardHeader>
          <EmCardTitle>Rule catalogue</EmCardTitle>
          <p class="adm-forms__panel-sub">Every rule the onboarding form draws on, with a live field beside it. All of these validate on <code>input</code> so the failure message is never more than a keystroke away.</p>
        </EmCardHeader>

        <Form v-slot="{ isValid, submit, reset }">
          <EmCardBody class="adm-forms__glossary">
            <div v-for="check in checks" :key="check.key" class="adm-forms__entry">
              <div class="adm-forms__entry-lede">
                <code class="adm-forms__entry-sig">{{ check.sig }}</code>
                <p class="adm-forms__entry-desc">{{ check.desc }}</p>
              </div>

              <EmTextField
                v-model="values[check.key]"
                :aria-label="check.sig"
                :placeholder="check.placeholder"
                :rules="[...check.rules]"
                validate-on="input"
              />
            </div>
          </EmCardBody>

          <div class="adm-forms__actions">
            <EmButton variant="primary" @click="submit()">Validate all</EmButton>
            <EmButton variant="tertiary" @click="onChecksReset(reset)">Reset</EmButton>

            <span class="adm-forms__status" :data-state="isValid === null ? 'idle' : isValid ? 'valid' : 'invalid'">
              {{ isValid === null ? 'Not yet validated' : isValid ? 'Every rule passes' : 'Some rules are failing' }}
            </span>
          </div>
        </Form>
      </EmCard>
    </div>
  </EmeraldShell>
</template>

<style>
  .adm-forms {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-l, 20px);
  }

  /* variant="simple" ships a 2px card inset; these pages need real gutters. */
  .adm-forms .emerald-card__header {
    padding: var(--emerald-spacing-l, 20px) var(--emerald-spacing-l, 20px) 0;
  }

  .adm-forms .emerald-card {
    background: var(--emerald-background, #fefefe);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-xl, 12px);
    box-shadow: var(--emerald-shadow-s, 0 0 2px 0 rgba(51, 51, 51, 0.08));
  }

  .adm-forms__title {
    margin: 0;
    font-size: clamp(1.375rem, 2vw, 1.625rem);
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--emerald-on-surface, #2b2d2e);
  }

  .adm-forms__sub {
    margin: 4px 0 0;
    max-width: 52rem;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-forms__sub code,
  .adm-forms__panel-sub code {
    padding: 1px 5px;
    border-radius: var(--emerald-radius-xs, 4px);
    background: var(--emerald-neutral-200, #f6f8fa);
    font-size: 0.9em;
  }

  .adm-forms__panel-sub {
    margin: 4px 0 0;
    max-width: 56rem;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  /* Reserve the error line on every field so validating a value never reflows
     the layout around it. */
  .adm-forms .emerald-text-field__error,
  .adm-forms .emerald-textarea__error {
    min-height: var(--emerald-text-b3-height, 18px);
  }

  .adm-forms .emerald-text-field__error[data-state='hidden'],
  .adm-forms .emerald-textarea__error[data-state='hidden'] {
    display: block;
    visibility: hidden;
  }

  .adm-forms__actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--emerald-spacing-s, 12px);
    padding: var(--emerald-spacing-l, 20px);
    border-top: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-forms__status {
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    color: var(--emerald-on-surface-variant, #757e85);
  }

  .adm-forms__status[data-state='valid'] {
    color: var(--emerald-primary-700, #027d4c);
  }

  .adm-forms__status[data-state='invalid'] {
    color: var(--emerald-danger-600, #a1000e);
  }

  .adm-forms__sections {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 0;
  }

  /* Section heading in a left rail, fields in a single column beside it —
     the form reads as a sequence of labelled bands rather than a field grid. */
  .adm-forms__section {
    display: grid;
    grid-template-columns: minmax(0, 15rem) minmax(0, 1fr);
    gap: var(--emerald-spacing-xl, 28px);
    padding: var(--emerald-spacing-l, 20px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-forms__section:last-child {
    border-bottom: none;
  }

  .adm-forms__section-lede {
    position: sticky;
    top: var(--emerald-spacing-l, 20px);
    align-self: start;
  }

  .adm-forms__section-title {
    margin: 0;
    font-size: var(--emerald-text-b1-size, 16px);
    font-weight: 700;
  }

  .adm-forms__section-sub {
    margin: 4px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-forms__fields {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
    min-width: 0;
  }

  .adm-forms__pair {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-forms__group {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-forms__group-label {
    font-weight: 700;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-forms__group-sub {
    margin: -4px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-forms__checks {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--emerald-spacing-xs, 8px);
    width: 100%;
  }

  .adm-forms__switch-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--emerald-spacing-m, 16px);
    width: 100%;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-forms__switch-row small {
    display: block;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-forms__plans {
    display: grid !important;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--emerald-spacing-s, 12px);
    width: 100%;
  }

  .adm-forms__plan {
    display: flex;
    align-items: flex-start;
    gap: var(--emerald-spacing-xs, 8px);
    padding: var(--emerald-spacing-s, 12px);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-m, 8px);
    cursor: pointer;
  }

  .adm-forms__plan[data-selected] {
    border-color: var(--emerald-primary-600, #1fae60);
    background: var(--emerald-primary-100, #e7fff2);
  }

  .adm-forms__plan strong {
    display: block;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-forms__plan small {
    display: block;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  /* Four numbered stages on one rail — the connector is drawn on the marker
     row so it survives wrapping at narrow widths. */
  .adm-forms__timeline {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
    padding: var(--emerald-spacing-l, 20px);
  }

  .adm-forms__stage {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xs, 8px);
    padding-top: var(--emerald-spacing-m, 16px);
  }

  /* Runs from this marker's centre to where the next column begins, so the
     rail is exact at any column count and never overflows the card. */
  .adm-forms__stage::before {
    content: '';
    position: absolute;
    top: calc(var(--emerald-spacing-m, 16px) + 13px);
    inset-inline-start: 14px;
    inset-inline-end: calc(-1 * var(--emerald-spacing-m, 16px));
    height: 2px;
    background: var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-forms__stage:last-child::before {
    display: none;
  }

  .adm-forms__marker {
    position: relative;
    z-index: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: var(--emerald-radius-full, 999px);
    background: var(--emerald-primary-100, #e7fff2);
    color: var(--emerald-primary-700, #027d4c);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 800;
  }

  .adm-forms__stage-sig {
    padding: 2px 8px;
    align-self: flex-start;
    border-radius: var(--emerald-radius-xs, 4px);
    background: var(--emerald-neutral-200, #f6f8fa);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 700;
  }

  /* Reserved lines keep the four demo inputs on a shared baseline even though
     the copy above them wraps to different lengths. */
  .adm-forms__stage-fires {
    margin: 0;
    min-height: calc(3 * var(--emerald-text-b3-height, 18px));
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-forms__stage-reach {
    margin: 0;
    min-height: calc(3 * var(--emerald-text-b3-height, 18px));
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-forms__stage .adm-forms__actions {
    margin-top: auto;
    padding: 0;
    border-top: none;
  }

  /* Two columns per entry: the rule on the left, a field proving it on the
     right, stacked as a reference list rather than a form. */
  .adm-forms__glossary {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 0;
  }

  .adm-forms__entry {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 20rem);
    align-items: start;
    gap: var(--emerald-spacing-l, 20px);
    padding: var(--emerald-spacing-m, 16px) var(--emerald-spacing-l, 20px);
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-forms__entry:last-child {
    border-bottom: none;
  }

  .adm-forms__entry-sig {
    display: inline-block;
    padding: 2px 8px;
    border-radius: var(--emerald-radius-xs, 4px);
    background: var(--emerald-neutral-200, #f6f8fa);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 700;
  }

  .adm-forms__entry-desc {
    margin: 6px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  /* Two per row means the rail would point at the row below, not the next
     stage — drop it and let the numbers carry the order. */
  @media (max-width: 1000px) {
    .adm-forms__timeline {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .adm-forms__stage::before {
      display: none;
    }
  }

  @media (max-width: 900px) {
    .adm-forms__section,
    .adm-forms__entry,
    .adm-forms__pair,
    .adm-forms__checks,
    .adm-forms__plans {
      grid-template-columns: 1fr;
    }

    .adm-forms__section-lede {
      position: static;
    }

    .adm-forms__timeline {
      grid-template-columns: 1fr;
    }

    /* Stacked stages have nothing to line up against. */
    .adm-forms__stage-fires,
    .adm-forms__stage-reach {
      min-height: 0;
    }
  }
</style>
