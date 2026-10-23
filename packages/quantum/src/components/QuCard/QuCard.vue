<script lang="ts">
  // Framework
  import { Atom, Collapsible, createContext, isNull, useLocale, useLogger } from '@vuetify/v0'

  // Utilities
  import { shallowRef, toRef } from 'vue'

  // Types
  import type { Ref, ShallowRef } from 'vue'

  // Components
  import QuIcon from '../QuIcon/QuIcon.vue'

  /** What the parts read from the card: the two states and the registrations that name and decorate it. */
  export interface QuCardContext {
    /** The expansion model; `undefined` when the card has no expansion. */
    expanded: Readonly<Ref<boolean | undefined>>
    /** The selection pattern's selected state. */
    selected: Readonly<Ref<boolean>>
    /** The id of the mounted `QuCardTitle`, which names the card and its expanded region. */
    labelId: Readonly<ShallowRef<string | undefined>>
    /** `true` while a `QuCardHeader` draws an avatar, the slot the selected check mark takes over. */
    hasAvatar: Readonly<Ref<boolean>>
    /** `QuCardTitle` registers its id; the first title names the card. Returns the release. */
    title: (id: string) => () => void
    /** `QuCardHeader` registers its avatar so the root leaves the check mark to the header. Returns the release. */
    avatar: () => () => void
  }

  export interface QuCardProps {
    /**
     * The expansion model, bound with `v-model:expanded`. Left unset, the card
     * has no expansion and `QuCardExpanded` stays hidden.
     */
    expanded?: boolean
    /**
     * The selection pattern's selected state: a scrim over the card and a check
     * mark, in place of the header avatar when there is one and compact at the
     * top end corner otherwise.
     */
    selected?: boolean
  }

  /**
   * The Collapsible behind `QuCardExpanded` lives under its own key, so a card
   * never captures the parts of a consumer's own Collapsible. A renderless v0
   * `Collapsible.Activator` with this namespace is the escape hatch for a toggle
   * carrying `aria-expanded` and `aria-controls`.
   */
  export const QU_CARD_COLLAPSIBLE = 'quantum:card:collapsible'

  export const [useQuCard, provideQuCard] = createContext<QuCardContext | null>('quantum:card', null)

  /** Dev-time guard for the parts whose card context is optional: an orphan renders, but its card state is inert. */
  export function orphan (part: string, context: QuCardContext | null): void {
    if (__DEV__ && isNull(context)) useLogger().warn(`[${part}] rendered outside <QuCard>; its state is inert`)
  }
</script>

<script setup lang="ts">
  defineOptions({ name: 'QuCard' })

  defineSlots<{
    /** The parts, in anatomy order: Header, Media, Title, Subtitle, Supporting, Actions, Expanded. */
    default?: () => any
  }>()

  // `expanded` defaults to `undefined` explicitly: Vue casts an absent Boolean
  // prop to `false`, which would erase the "no expansion" state.
  const { expanded = undefined, selected = false } = defineProps<QuCardProps>()

  const emit = defineEmits<{
    'update:expanded': [value: boolean]
  }>()

  const locale = useLocale()

  const labelId = shallowRef<string | undefined>()
  const avatars = shallowRef(0)

  const hasAvatar = toRef(() => avatars.value > 0)

  // The parts register rather than push into a ref: the release keeps a
  // replaced or unmounted title from leaving a stale id on the article.
  function title (id: string) {
    labelId.value ??= id

    return () => {
      if (labelId.value === id) labelId.value = undefined
    }
  }

  function avatar () {
    avatars.value++

    return () => {
      avatars.value--
    }
  }

  provideQuCard({
    expanded: toRef(() => expanded),
    selected: toRef(() => selected),
    labelId,
    hasAvatar,
    title,
    avatar,
  })

  // Only a consumer-placed Collapsible.Activator writes through here; the
  // model is otherwise driven by `v-model:expanded`. The card holds no local
  // copy: an unbound card stays collapsed whatever the activator asks.
  function onExpanded (value: boolean) {
    emit('update:expanded', value)
  }
</script>

<template>
  <Atom
    :aria-labelledby="labelId"
    as="article"
    class="quantum-card"
    :data-expanded="expanded || undefined"
    :data-selected="selected || undefined"
  >
    <span
      v-if="selected && !hasAvatar"
      class="quantum-card__check"
    >
      <QuIcon
        :label="locale.ti('Quantum.selected') ?? 'Selected'"
        name="check"
        size="s"
      />
    </span>

    <Collapsible.Root
      :model-value="expanded ?? false"
      :namespace="QU_CARD_COLLAPSIBLE"
      renderless
      @update:model-value="onExpanded"
    >
      <slot />
    </Collapsible.Root>
  </Atom>
</template>

<!--
  Unscoped, like every Quantum stylesheet. One sheet for the compound: the
  parts are plain elements whose spacing depends on their neighbours (a title
  closes with 24 dp unless text or actions follow), which only one sheet can
  express.
-->
<style>
  /* The sheet: the surface colour at 2 dp with 2 dp corners (cards page; the radius is a decision, Vuetify 1.5's value). */
  .quantum-card {
    position: relative;
    display: flow-root;
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    overflow: clip;
    border-radius: var(--quantum-radius, 2px);
    background: var(--quantum-surface, #FFFFFF);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    font-family: var(--quantum-font-family, Roboto, Noto, sans-serif);
    box-shadow: var(--quantum-elevation-2, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
    transition: box-shadow 280ms var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* Desktop (mouse and keyboard): the card rests seamed at 0 dp and lifts to the picked-up 8 dp on hover (cards page). */
  @media (pointer: fine) {
    .quantum-card {
      box-shadow: var(--quantum-elevation-0, none);
    }

    .quantum-card:hover {
      box-shadow: var(--quantum-elevation-8, 0px 5px 5px -3px rgba(0, 0, 0, 0.2), 0px 8px 10px 1px rgba(0, 0, 0, 0.14), 0px 3px 14px 2px rgba(0, 0, 0, 0.12));
    }
  }

  /*
   * Selected (selection pattern): a scrim over the item and a check mark. The
   * scrim is the selection token, the accent at 30% (SPEC.md: the alpha is a
   * decision); it never swallows the pointer.
   */
  .quantum-card[data-selected]::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--quantum-selection, rgba(255, 64, 129, 0.3));
    pointer-events: none;
  }

  /* The compact check mark the page asks for when no avatar can be replaced: a 24 dp disc at the top end corner. */
  .quantum-card__check {
    position: absolute;
    z-index: 1;
    inset-block-start: var(--quantum-spacing-1, 8px);
    inset-inline-end: var(--quantum-spacing-1, 8px);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--quantum-accent, #FF4081);
    color: var(--quantum-on-accent, #FFFFFF);
  }

  /* Header: a 72 dp row with 16 dp all around; the 40 dp avatar puts the text at the 72 dp keyline. */
  .quantum-card__header {
    display: flex;
    align-items: center;
    gap: var(--quantum-spacing-2, 16px);
    box-sizing: border-box;
    min-height: 72px;
    padding: var(--quantum-spacing-2, 16px) var(--quantum-keyline-margin, 16px);
  }

  .quantum-card__avatar {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--quantum-avatar-size, 40px);
    height: var(--quantum-avatar-size, 40px);
    overflow: clip;
    border-radius: 50%;
    object-fit: cover;
  }

  /* Selected: the check mark replaces the avatar when there is space and sits over the scrim (selection page). */
  .quantum-card__avatar[data-check] {
    position: relative;
    z-index: 1;
    background: var(--quantum-accent, #FF4081);
    color: var(--quantum-on-accent, #FFFFFF);
  }

  .quantum-card__header-text {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
  }

  /* One line each, so a narrow card keeps the 72 dp row instead of growing it. */
  .quantum-card__header-title,
  .quantum-card__header-subtitle {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /*
   * The 14 sp header title and subtitle: Body 2 and Body 1 (the weight is a
   * decision; the page states the sizes only). Both lines take the 20 sp Body 1
   * leading so the pair fits the 40 dp avatar height and the row stays 72 dp.
   */
  .quantum-card__header-title {
    font-size: var(--quantum-type-body-2-size, 14px);
    font-weight: var(--quantum-type-body-2-weight, 500);
    line-height: var(--quantum-type-body-1-leading, 20px);
    letter-spacing: var(--quantum-type-body-2-tracking, 0.01em);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
  }

  .quantum-card__header-subtitle {
    font-size: var(--quantum-type-body-1-size, 14px);
    font-weight: var(--quantum-type-body-1-weight, 400);
    line-height: var(--quantum-type-body-1-leading, 20px);
    letter-spacing: var(--quantum-type-body-1-tracking, 0.01em);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
  }

  /*
   * A trailing action (the overflow menu) pulls its 48 dp target out so the
   * 24 dp glyph lands at the keyline, and overhangs the 40 dp content height
   * by 4 dp above and below so the row stays 72 dp.
   */
  .quantum-card__header > :last-child:not(.quantum-card__header-text, .quantum-card__avatar) {
    margin-block: calc((var(--quantum-avatar-size, 40px) - var(--quantum-touch-target, 48px)) / 2);
    margin-inline-end: calc((var(--quantum-icon-size, 24px) - var(--quantum-touch-target, 48px)) / 2);
  }

  /* Media: the rich media block. Slot content paints over the image from the bottom edge. */
  .quantum-card__media {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    box-sizing: border-box;
    overflow: clip;
  }

  /* While an image loads or fails, the area reads as a 12% tone rather than a hole in the sheet. */
  .quantum-card__media[data-state='loading'],
  .quantum-card__media[data-state='error'] {
    background: var(--quantum-divider, rgba(0, 0, 0, 0.12));
  }

  .quantum-card__media[data-ratio='16:9'] {
    aspect-ratio: 16 / 9;
  }

  .quantum-card__media[data-ratio='1:1'] {
    aspect-ratio: 1;
  }

  /* Inset media: squares on the 80 dp base at the top end corner with 16 dp above, the text flowing beside them. */
  .quantum-card__media[data-inset] {
    float: inline-end;
    margin-block: var(--quantum-spacing-2, 16px);
    margin-inline: var(--quantum-spacing-2, 16px) var(--quantum-keyline-margin, 16px);
  }

  .quantum-card__media[data-ratio='1x'] {
    width: 80px;
    height: 80px;
  }

  .quantum-card__media[data-ratio='1.5x'] {
    width: 120px;
    height: 120px;
  }

  .quantum-card__media[data-ratio='2x'] {
    width: 160px;
    height: 160px;
  }

  .quantum-card__media[data-ratio='3x'] {
    width: 240px;
    height: 240px;
  }

  .quantum-card__image {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition:
      opacity var(--quantum-duration-complex, 375ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      filter var(--quantum-duration-complex, 375ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* The loading-images recipe: opacity from 0%, saturation from 20% and lifted exposure, over a longer duration than a transition. */
  .quantum-card__media[data-state='loading'] .quantum-card__image {
    opacity: 0;
    filter: saturate(0.2) brightness(1.2);
  }

  .quantum-card__media[data-state='error'] .quantum-card__image {
    visibility: hidden;
  }

  /* Overlaid content sits above the image and the protection gradient, in white ink at the keyline. */
  .quantum-card__media > :not(.quantum-card__image) {
    position: relative;
    z-index: 1;
  }

  .quantum-card__media .quantum-card__title,
  .quantum-card__media .quantum-card__subtitle,
  .quantum-card__media .quantum-card__supporting {
    color: var(--quantum-white, #FFFFFF);
  }

  /*
   * Text protection (imagery page): a dark scrim under overlaid text only,
   * 40% at the bottom edge fading out over 168 dp (three app bar heights) with
   * its centre three tenths of the way toward the dark end.
   */
  .quantum-card__media:has(> :not(.quantum-card__image))::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, color-mix(in srgb, var(--quantum-black, #000000) 40%, transparent), 50px, transparent 168px);
    pointer-events: none;
  }

  /* Primary title: Headline 24 sp, 24 dp above, 24 dp below when it closes the card. */
  .quantum-card__title {
    clear: none;
    margin: 0;
    padding: var(--quantum-spacing-3, 24px) var(--quantum-keyline-margin, 16px);
    font-size: var(--quantum-type-headline-size, 24px);
    font-weight: var(--quantum-type-headline-weight, 400);
    line-height: var(--quantum-type-headline-leading, 32px);
    letter-spacing: var(--quantum-type-headline-tracking, 0);
    color: var(--quantum-text-primary, rgba(0, 0, 0, 0.87));
    transition: padding-bottom var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* Subtitle: Body 1 at the secondary ink, 12 dp under the title, 24 dp below when it closes the card. */
  .quantum-card__subtitle {
    margin: 0;
    padding: 12px var(--quantum-keyline-margin, 16px) var(--quantum-spacing-3, 24px);
    font-size: var(--quantum-type-body-1-size, 14px);
    font-weight: var(--quantum-type-body-1-weight, 400);
    line-height: var(--quantum-type-body-1-leading, 20px);
    letter-spacing: var(--quantum-type-body-1-tracking, 0.01em);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
    transition: padding-bottom var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* Supporting text: Body 1 at the secondary ink, 16 dp above, 24 dp below when it closes the card. */
  .quantum-card__supporting {
    margin: 0;
    padding: var(--quantum-spacing-2, 16px) var(--quantum-keyline-margin, 16px) var(--quantum-spacing-3, 24px);
    font-size: var(--quantum-type-body-1-size, 14px);
    font-weight: var(--quantum-type-body-1-weight, 400);
    line-height: var(--quantum-type-body-1-leading, 20px);
    letter-spacing: var(--quantum-type-body-1-tracking, 0.01em);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
    transition: padding-bottom var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1));
  }

  /* Text blocks close with 16 dp when text or actions follow (a collapsed expansion does not count). */
  .quantum-card__title:has(~ :not([hidden])),
  .quantum-card__subtitle:has(~ :not([hidden])),
  .quantum-card__supporting:has(~ :not([hidden])) {
    padding-bottom: var(--quantum-spacing-2, 16px);
  }

  /* The subtitle's own 12 dp replaces the title's bottom padding. */
  .quantum-card__title:has(+ .quantum-card__subtitle) {
    padding-bottom: 0;
  }

  /* Actions: 8 dp around, 4 dp between; cleared under any inset media. */
  .quantum-card__actions {
    clear: both;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
    box-sizing: border-box;
    padding: var(--quantum-spacing-1, 8px);
  }

  .quantum-card__actions[data-align='end'] {
    justify-content: flex-end;
  }

  /*
   * Expanded supporting text behind a full-bleed divider seam (dividers page).
   * Expansion is a height change on the standard curve (motion page), drawn
   * from the hidden region: `display` transitions discretely so the closing
   * region stays laid out while it shrinks, and `@starting-style` gives the
   * opening one its collapsed values. Browsers that cannot interpolate `auto`
   * still fade and toggle.
   */
  .quantum-card__expanded {
    clear: both;
    box-sizing: border-box;
    height: auto;
    margin: 0;
    padding: var(--quantum-spacing-2, 16px) var(--quantum-keyline-margin, 16px) var(--quantum-spacing-3, 24px);
    overflow: clip;
    border-top: 1px solid var(--quantum-divider, rgba(0, 0, 0, 0.12));
    font-size: var(--quantum-type-body-1-size, 14px);
    font-weight: var(--quantum-type-body-1-weight, 400);
    line-height: var(--quantum-type-body-1-leading, 20px);
    letter-spacing: var(--quantum-type-body-1-tracking, 0.01em);
    color: var(--quantum-text-secondary, rgba(0, 0, 0, 0.54));
    interpolate-size: allow-keywords;
    transition:
      height var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      padding var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      opacity var(--quantum-duration-standard, 300ms) var(--quantum-easing-standard, cubic-bezier(0.4, 0, 0.2, 1)),
      display var(--quantum-duration-standard, 300ms);
    transition-behavior: allow-discrete;
  }

  .quantum-card__expanded[hidden] {
    display: none;
    height: 0;
    padding-block: 0;
    opacity: 0;
  }

  @starting-style {
    .quantum-card__expanded:not([hidden]) {
      height: 0;
      padding-block: 0;
      opacity: 0;
    }
  }

  /* Tablet and desktop (from 600 px): the content keyline moves out to 24 dp (cards page). */
  @media (min-width: 600px) {
    .quantum-card__header,
    .quantum-card__title,
    .quantum-card__subtitle,
    .quantum-card__supporting,
    .quantum-card__expanded {
      padding-inline: var(--quantum-keyline-margin, 24px);
    }

    .quantum-card__media[data-inset] {
      margin-inline-end: var(--quantum-keyline-margin, 24px);
    }
  }

  /* Reduced motion: expansion and padding changes land at once; the plugin's body attribute wins over the OS query. */
  body[data-reduced-motion='reduce'] .quantum-card__expanded,
  body[data-reduced-motion='reduce'] .quantum-card__title,
  body[data-reduced-motion='reduce'] .quantum-card__subtitle,
  body[data-reduced-motion='reduce'] .quantum-card__supporting,
  body[data-reduced-motion='reduce'] .quantum-card__image {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    body:not([data-reduced-motion='no-preference']) .quantum-card__expanded,
    body:not([data-reduced-motion='no-preference']) .quantum-card__title,
    body:not([data-reduced-motion='no-preference']) .quantum-card__subtitle,
    body:not([data-reduced-motion='no-preference']) .quantum-card__supporting,
    body:not([data-reduced-motion='no-preference']) .quantum-card__image {
      transition: none;
    }
  }
</style>
