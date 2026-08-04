<!--
  Form validation showcase. Real validation throughout: EmTextField / EmTextarea
  wrap v0's Input.Root, which accepts `rules` (FormValidationRule[]) and
  `validateOn` directly and auto-registers with an ancestor v0 `Form` via
  createValidation/createForm — no hand-rolled error state anywhere on this
  page. See GAPS.md: "no gap, this is a real-build page" for Form validation.

  Near-miss (recorded in gaps-pages.md): EmSelect / EmCheckbox / EmRadio /
  EmSwitch accept `namespace` for their own compound context but do NOT wrap
  Input.Root, so they don't auto-register with createForm the way EmTextField
  / EmTextarea do — Country, Preferred language, the topic checkboxes, the
  notification switches, and the account-type radios carry real local state
  but sit outside the Registration Form's aggregate `isValid`.
-->
<script setup lang="ts">
  import {
    EmButton,
    EmCard,
    EmCardBody,
    EmCardHeader,
    EmCardTitle,
    EmCheckbox,
    EmDivider,
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
  import AdminShell from './AdminShell.vue'

  // Utilities
  import { ref, shallowRef, toRef } from 'vue'

  function required (v: unknown): boolean | string {
    return (!!v && String(v).trim().length > 0) || 'This field is required'
  }

  function numeric (v: unknown): boolean | string {
    return !v || /^\d+$/.test(String(v)) || 'Must only consist of numbers'
  }

  function alphabetic (v: unknown): boolean | string {
    return !v || /^[A-Za-z]+$/.test(String(v)) || 'Only alphabetic characters'
  }

  function password (v: unknown): boolean | string {
    return !v || String(v).length >= 8 || 'Must be at least 8 characters'
  }

  function email (v: unknown): boolean | string {
    return !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)) || 'Must be a valid email'
  }

  function minMaxLength (v: unknown): boolean | string {
    return !v || (String(v).length >= 5 && String(v).length <= 10) || 'Must be between 5 and 10 characters'
  }

  function numberRange (v: unknown): boolean | string {
    return !v || (Number(v) >= 10 && Number(v) <= 20) || 'Enter a number between 10 & 20'
  }

  function regexPattern (v: unknown): boolean | string {
    return !v || /^[0-9]+$/.test(String(v)) || 'Must match regular expression: ^([0-9]+)$ — numbers only'
  }

  function exactLength (v: unknown): boolean | string {
    return !v || String(v).length === 3 || 'Length must be exactly 3 characters.'
  }

  function digits (v: unknown): boolean | string {
    return !v || /^\d{3}$/.test(String(v)) || 'Must be numeric and exactly 3 digits'
  }

  function alphanumericSymbols (v: unknown): boolean | string {
    return !v || /^[A-Za-z0-9_-]+$/.test(String(v)) || 'Only letters, numbers, dashes or underscores'
  }

  function url (v: unknown): boolean | string {
    return !v || /^https?:\/\/.+/.test(String(v)) || 'Must be a valid url'
  }

  const typeDemos = [
    { key: 'required', label: 'Required Field', placeholder: 'This field is required', rules: [required], type: 'text' },
    { key: 'numeric', label: 'Numeric Only', placeholder: 'Must only consist of numbers', rules: [numeric], type: 'text' },
    { key: 'alphabetic', label: 'Alphabetic Only', placeholder: 'Only alphabetic characters', rules: [alphabetic], type: 'text' },
    { key: 'password', label: 'Password', placeholder: 'Password input field', rules: [password], type: 'password' },
    { key: 'minMax', label: 'Min & Max Length', placeholder: 'Must be between 5 and 10 characters', rules: [minMaxLength], type: 'text' },
    { key: 'email', label: 'Email', placeholder: 'Must be a valid email', rules: [email], type: 'text' },
    { key: 'range', label: 'Number Range', placeholder: 'Enter a number between 10 & 20', rules: [numberRange], type: 'text' },
    { key: 'regex', label: 'Regex Pattern', placeholder: 'Numbers only, matched via regex', rules: [regexPattern], type: 'text' },
    { key: 'exact', label: 'Exact Length', placeholder: 'Length must be exactly 3 characters', rules: [exactLength], type: 'text' },
    { key: 'digits', label: 'Digits', placeholder: 'Exactly 3 digits', rules: [digits], type: 'text' },
    { key: 'symbols', label: 'Alphanumeric & Symbols', placeholder: 'Letters, numbers, dashes or underscores', rules: [alphanumericSymbols], type: 'text' },
    { key: 'url', label: 'URL', placeholder: 'Must be a valid url', rules: [url], type: 'text' },
  ] as const

  const typeValues = ref<Record<string, string>>(Object.fromEntries(typeDemos.map(d => [d.key, ''])))

  const modes = [
    { key: 'change', title: 'onChange Mode', desc: 'Validates on every keystroke.', hint: 'Error appears instantly as you type.', validateOn: 'input' as const },
    { key: 'blur', title: 'onBlur Mode', desc: 'Validates when you leave the field.', hint: 'Error appears after you leave the field.', validateOn: 'blur' as const },
    { key: 'submit', title: 'onSubmit Mode', desc: 'Validates only when you click submit.', hint: 'Error appears only after clicking submit.', validateOn: 'submit' as const },
    { key: 'touched', title: 'onTouched Mode', desc: 'First validation on blur, then real-time.', hint: 'First validation on blur, then every change.', validateOn: 'blur eager' as const },
  ]

  const modeValues = ref<Record<string, string>>(Object.fromEntries(modes.map(m => [m.key, ''])))

  const countries = ['United States', 'United Kingdom', 'Canada', 'Germany', 'Japan']
  const languages = ['English', 'Spanish', 'French', 'German', 'Japanese']

  const fullName = shallowRef('')
  const regEmail = shallowRef('')
  const regPassword = shallowRef('')
  const dob = shallowRef('')
  const age = shallowRef('')
  const country = shallowRef<string>()
  const language = shallowRef<string>()
  const bio = shallowRef('')
  const bioCount = toRef(() => bio.value.length)

  const topics = ref({ product: false, news: false, tips: false })
  const notifications = ref({ email: true, marketing: false, twoFactor: false })
  const accountType = shallowRef<'personal' | 'business' | 'enterprise'>()

  function dobRule (v: unknown): boolean | string {
    return !v || /^\d{4}-\d{2}-\d{2}$/.test(String(v)) || 'Use YYYY-MM-DD'
  }

  function ageRule (v: unknown): boolean | string {
    return !v || (Number(v) >= 18 && Number(v) <= 120) || 'You must be at least 18 years old'
  }

  function bioRule (v: unknown): boolean | string {
    return String(v).length <= 500 || 'Bio must be 500 characters or fewer'
  }

  const lastResult = shallowRef<'idle' | 'valid' | 'invalid'>('idle')

  async function onRegistrationSubmit (submit: () => Promise<boolean>) {
    const valid = await submit()
    lastResult.value = valid ? 'valid' : 'invalid'
  }

  function onRegistrationReset (reset: () => void) {
    reset()
    accountType.value = undefined
    lastResult.value = 'idle'
  }
</script>

<template>
  <AdminShell>
    <div class="adm-forms" data-theme="emerald">
      <header class="adm-forms__head">
        <h1 class="adm-forms__title">Form validation</h1>
        <p class="adm-forms__sub">Real validation via v0's <code>rules</code> + <code>validateOn</code> on <code>EmTextField</code> / <code>EmTextarea</code>, coordinated by v0's <code>Form</code>.</p>
      </header>

      <EmCard variant="simple">
        <EmCardHeader>
          <EmCardTitle>Validation Types</EmCardTitle>
        </EmCardHeader>

        <Form v-slot="{ isValid, submit: submitTypes, reset: resetTypes }">
          <EmCardBody class="adm-forms__grid">
            <EmTextField
              v-for="demo in typeDemos"
              :key="demo.key"
              v-model="typeValues[demo.key]"
              :label="demo.label"
              :placeholder="demo.placeholder"
              :rules="[...demo.rules]"
              :type="demo.type"
              validate-on="input lazy"
            />
          </EmCardBody>

          <div class="adm-forms__actions">
            <EmButton variant="primary" @click="submitTypes()">Submit</EmButton>
            <EmButton variant="tertiary" @click="resetTypes()">Reset</EmButton>

            <span class="adm-forms__status" :data-state="isValid === null ? 'idle' : isValid ? 'valid' : 'invalid'">
              {{ isValid === null ? 'Not yet validated' : isValid ? 'All fields valid' : 'Some fields need attention' }}
            </span>
          </div>
        </Form>
      </EmCard>

      <EmCard variant="simple">
        <EmCardHeader>
          <EmCardTitle>Validation Modes Demo</EmCardTitle>
          <p class="adm-forms__panel-sub">Type in each field to see when validation fires — each card uses a different <code>validate-on</code> value.</p>
        </EmCardHeader>

        <EmCardBody class="adm-forms__modes">
          <Form v-for="mode in modes" :key="mode.key" v-slot="{ submit: submitMode, reset: resetMode }" class="adm-forms__mode">
            <h3 class="adm-forms__mode-title">{{ mode.title }}</h3>
            <p class="adm-forms__mode-desc">{{ mode.desc }}</p>

            <EmTextField
              v-model="modeValues[mode.key]"
              label="Demo Input"
              placeholder="Type here…"
              :rules="[required]"
              :validate-on="mode.validateOn"
            />

            <p class="adm-forms__mode-hint">{{ mode.hint }}</p>

            <div class="adm-forms__actions">
              <EmButton size="sm" variant="primary" @click="submitMode()">Submit</EmButton>
              <EmButton size="sm" variant="tertiary" @click="resetMode()">Reset</EmButton>
            </div>
          </Form>
        </EmCardBody>

        <EmCardBody class="adm-forms__table-wrap">
          <table class="adm-forms__table">
            <thead>
              <tr><th>Mode</th><th>When Validation Occurs</th><th>Best For</th></tr>
            </thead>

            <tbody>
              <tr><td>onChange</td><td>Every keystroke</td><td>Real-time feedback (e.g., password strength)</td></tr>
              <tr><td>onBlur</td><td>When leaving the field</td><td>Less intrusive validation (recommended for most cases)</td></tr>
              <tr><td>onSubmit</td><td>When form is submitted</td><td>Simple forms, minimal interruption</td></tr>
              <tr><td>onTouched</td><td>First blur, then every change</td><td>Balance between UX and feedback</td></tr>
            </tbody>
          </table>
        </EmCardBody>
      </EmCard>

      <EmCard variant="simple">
        <EmCardHeader>
          <EmCardTitle>Registration Form</EmCardTitle>
        </EmCardHeader>

        <Form v-slot="{ isValid, submit: submitRegistration, reset: resetRegistration }">
          <EmCardBody class="adm-forms__sections">
            <section class="adm-forms__section">
              <h3 class="adm-forms__section-title">Personal Information</h3>
              <p class="adm-forms__section-sub">Please provide your basic information</p>

              <div class="adm-forms__row">
                <EmTextField
                  v-model="fullName"
                  description="Your full name as it appears on official documents"
                  label="Full Name"
                  placeholder="John Doe"
                  :rules="[required]"
                  validate-on="blur lazy"
                />

                <EmTextField
                  v-model="regEmail"
                  description="We'll never share your email with anyone else"
                  label="Email Address"
                  placeholder="john.doe@example.com"
                  :rules="[required, email]"
                  validate-on="blur lazy"
                />
              </div>

              <EmTextField
                v-model="regPassword"
                description="Must be at least 8 characters"
                label="Password"
                placeholder="••••••••"
                :rules="[required, password]"
                type="password"
                validate-on="blur lazy"
              />
            </section>

            <EmDivider />

            <section class="adm-forms__section">
              <h3 class="adm-forms__section-title">Profile Details</h3>
              <p class="adm-forms__section-sub">Tell us more about yourself</p>

              <div class="adm-forms__row">
                <EmTextField
                  v-model="dob"
                  description="Select your date of birth"
                  label="Date of Birth"
                  placeholder="YYYY-MM-DD"
                  :rules="[dobRule]"
                  validate-on="blur lazy"
                />

                <EmTextField
                  v-model="age"
                  description="You must be at least 18 years old to register"
                  label="Age"
                  placeholder="25"
                  :rules="[ageRule]"
                  type="number"
                  validate-on="blur lazy"
                />
              </div>

              <div class="adm-forms__row">
                <EmSelect v-model="country" label="Country">
                  <EmSelectActivator>
                    <EmSelectValue />
                    <EmSelectPlaceholder>Select your country</EmSelectPlaceholder>

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
                    <EmSelectItem v-for="c in countries" :key="c" :value="c">{{ c }}</EmSelectItem>
                  </EmSelectContent>
                </EmSelect>

                <EmSelect v-model="language" label="Preferred Language (Optional)">
                  <EmSelectActivator>
                    <EmSelectValue />
                    <EmSelectPlaceholder>Select a language</EmSelectPlaceholder>

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
                    <EmSelectItem v-for="l in languages" :key="l" :value="l">{{ l }}</EmSelectItem>
                  </EmSelectContent>
                </EmSelect>
              </div>

              <EmTextarea
                v-model="bio"
                :description="`Brief description about yourself (${bioCount}/500 characters)`"
                label="Bio"
                placeholder="Tell us about yourself…"
                :rules="[bioRule]"
                validate-on="input lazy"
              />
            </section>

            <EmDivider />

            <section class="adm-forms__section">
              <h3 class="adm-forms__section-title">Preferences</h3>
              <p class="adm-forms__section-sub">Customize your experience</p>

              <div class="adm-forms__row">
                <div class="adm-forms__group">
                  <span class="adm-forms__group-label">Newsletter Topics</span>
                  <p class="adm-forms__group-sub">Choose the topics you want to receive updates about</p>

                  <EmCheckbox v-model="topics.product">Product Updates</EmCheckbox>
                  <EmCheckbox v-model="topics.news">Industry News</EmCheckbox>
                  <EmCheckbox v-model="topics.tips">Tips &amp; Tricks</EmCheckbox>
                </div>

                <div class="adm-forms__group">
                  <span class="adm-forms__group-label">Communication Settings</span>
                  <p class="adm-forms__group-sub">Manage your notification preferences</p>

                  <div class="adm-forms__switch-row">
                    <span>Email Notifications<small>Receive notifications about your account activity</small></span>
                    <EmSwitch v-model="notifications.email" aria-label="Email notifications" size="sm" />
                  </div>

                  <div class="adm-forms__switch-row">
                    <span>Marketing Emails<small>Receive emails about new products and features</small></span>
                    <EmSwitch v-model="notifications.marketing" aria-label="Marketing emails" size="sm" />
                  </div>

                  <div class="adm-forms__switch-row">
                    <span>Two-Factor Authentication<small>Add an extra layer of security to your account</small></span>
                    <EmSwitch v-model="notifications.twoFactor" aria-label="Two-factor authentication" size="sm" />
                  </div>
                </div>
              </div>

              <div class="adm-forms__account-type">
                <span class="adm-forms__group-label">Account Type</span>
                <p class="adm-forms__group-sub">Choose the plan that best fits your needs</p>

                <EmRadioGroup v-model="accountType" class="adm-forms__account-grid" label="Account type">
                  <label class="adm-forms__account-card" :data-selected="accountType === 'personal' || undefined">
                    <EmRadio value="personal" />
                    <span><strong>Personal</strong><small>For individual use with basic features</small></span>
                  </label>

                  <label class="adm-forms__account-card" :data-selected="accountType === 'business' || undefined">
                    <EmRadio value="business" />
                    <span><strong>Business</strong><small>For small to medium-sized teams</small></span>
                  </label>

                  <label class="adm-forms__account-card" :data-selected="accountType === 'enterprise' || undefined">
                    <EmRadio value="enterprise" />
                    <span><strong>Enterprise</strong><small>For large organizations</small></span>
                  </label>
                </EmRadioGroup>
              </div>
            </section>
          </EmCardBody>

          <div class="adm-forms__actions">
            <EmButton variant="primary" @click="onRegistrationSubmit(submitRegistration)">Register</EmButton>
            <EmButton variant="tertiary" @click="onRegistrationReset(resetRegistration)">Reset</EmButton>

            <span v-if="lastResult !== 'idle'" class="adm-forms__status" :data-state="lastResult">
              {{ lastResult === 'valid' ? 'Registration form is valid' : 'Please fix the highlighted fields' }}
            </span>

            <span v-else class="adm-forms__status" :data-state="isValid === null ? 'idle' : isValid ? 'valid' : 'invalid'">
              {{ isValid === null ? 'Not yet validated' : isValid ? 'All fields valid' : 'Some fields need attention' }}
            </span>
          </div>
        </Form>
      </EmCard>
    </div>
  </AdminShell>
</template>

<style>
  .adm-forms {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-l, 20px);
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
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b1-size, 16px);
  }

  .adm-forms__sub code {
    padding: 1px 5px;
    border-radius: var(--emerald-radius-xs, 4px);
    background: var(--emerald-neutral-200, #f6f8fa);
    font-size: 0.9em;
  }

  .adm-forms__panel-sub {
    margin: 4px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-forms__grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-forms__actions {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--emerald-spacing-s, 12px);
    padding: var(--emerald-spacing-m, 16px);
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

  .adm-forms__modes {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-forms__mode {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xs, 8px);
    padding: var(--emerald-spacing-m, 16px);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-m, 8px);
  }

  .adm-forms__mode-title {
    margin: 0;
    font-size: var(--emerald-text-b2-size, 14px);
    font-weight: 700;
  }

  .adm-forms__mode-desc {
    margin: 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-forms__mode-hint {
    margin: 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-style: italic;
  }

  .adm-forms__table-wrap {
    overflow-x: auto;
    border-top: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
  }

  .adm-forms__table {
    width: 100%;
    border-collapse: collapse;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-forms__table th,
  .adm-forms__table td {
    padding: var(--emerald-spacing-xs, 8px) var(--emerald-spacing-s, 12px);
    text-align: left;
    border-bottom: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-forms__table th {
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
    font-weight: 600;
    background: var(--emerald-neutral-200, #f6f8fa);
  }

  .adm-forms__sections {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-l, 20px);
  }

  .adm-forms__section {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-m, 16px);
  }

  .adm-forms__section-title {
    margin: 0;
    font-size: var(--emerald-text-b1-size, 16px);
    font-weight: 700;
  }

  .adm-forms__section-sub {
    margin: -8px 0 0;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  .adm-forms__row {
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

  .adm-forms__account-type {
    display: flex;
    flex-direction: column;
    gap: var(--emerald-spacing-xs, 8px);
  }

  .adm-forms__account-grid {
    display: grid !important;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: var(--emerald-spacing-s, 12px);
    width: 100%;
  }

  .adm-forms__account-card {
    display: flex;
    align-items: flex-start;
    gap: var(--emerald-spacing-xs, 8px);
    padding: var(--emerald-spacing-s, 12px);
    border: var(--emerald-stroke-s, 1px) solid var(--emerald-neutral-300, #ccd6e7);
    border-radius: var(--emerald-radius-m, 8px);
    cursor: pointer;
  }

  .adm-forms__account-card[data-selected] {
    border-color: var(--emerald-primary-600, #1fae60);
    background: var(--emerald-primary-100, #e7fff2);
  }

  .adm-forms__account-card strong {
    display: block;
    font-size: var(--emerald-text-b2-size, 14px);
  }

  .adm-forms__account-card small {
    display: block;
    color: var(--emerald-on-surface-variant, #757e85);
    font-size: var(--emerald-text-b3-size, 12px);
  }

  @media (max-width: 900px) {
    .adm-forms__grid,
    .adm-forms__modes,
    .adm-forms__row,
    .adm-forms__account-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
