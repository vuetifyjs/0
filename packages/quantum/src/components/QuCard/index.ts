export type { QuCardContext, QuCardProps } from './QuCard.vue'
export { QU_CARD_COLLAPSIBLE, useQuCard } from './QuCard.vue'
export type { QuCardActionsAlign, QuCardActionsProps } from './QuCardActions.vue'
export { default as QuCardActions } from './QuCardActions.vue'
export { default as QuCardExpanded } from './QuCardExpanded.vue'
export type { QuCardHeaderProps } from './QuCardHeader.vue'
export { default as QuCardHeader } from './QuCardHeader.vue'
export type { QuCardMediaProps, QuCardMediaRatio } from './QuCardMedia.vue'
export { default as QuCardMedia } from './QuCardMedia.vue'
export { default as QuCardSubtitle } from './QuCardSubtitle.vue'
export { default as QuCardSupporting } from './QuCardSupporting.vue'
export type { QuCardTitleLevel, QuCardTitleProps } from './QuCardTitle.vue'
export { default as QuCardTitle } from './QuCardTitle.vue'

// Context
import Root from './QuCard.vue'
import Actions from './QuCardActions.vue'
import Expanded from './QuCardExpanded.vue'
import Header from './QuCardHeader.vue'
import Media from './QuCardMedia.vue'
import Subtitle from './QuCardSubtitle.vue'
import Supporting from './QuCardSupporting.vue'
import Title from './QuCardTitle.vue'

/**
 * The Material Design 1 card: a sheet at 2 dp (8 dp picked up, 0 dp at rest
 * under a mouse) with 2 dp corners, built from the cards page's content
 * blocks. Presentational on v0 `Atom`; the expanded region is a v0
 * `Collapsible` revealed by `v-model:expanded`.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`QuCardTitle`) remain exported and valid.
 *
 * @example
 * ```vue
 * <QuCard v-model:expanded="open">
 *   <QuCard.Header avatar="/me.png" subtitle="Subtitle" title="Title" />
 *
 *   <QuCard.Media src="/photo.jpg" />
 *
 *   <QuCard.Title>Title</QuCard.Title>
 *
 *   <QuCard.Subtitle>Subtitle</QuCard.Subtitle>
 *
 *   <QuCard.Supporting>Supporting text</QuCard.Supporting>
 *
 *   <QuCard.Actions>
 *     <QuButton>Action 1</QuButton>
 *   </QuCard.Actions>
 *
 *   <QuCard.Expanded>Expanded supporting text</QuCard.Expanded>
 * </QuCard>
 * ```
 */
export const QuCard = Object.assign(Root, {
  /** The 72 dp avatar, title and subtitle row; trailing slot content hosts the overflow menu. */
  Header,
  /** Rich media at 16:9 or 1:1, or an inset square on the 80 dp base. */
  Media,
  /** The primary title, Headline 24 sp. */
  Title,
  /** The 14 sp subtitle under the primary title. */
  Subtitle,
  /** Supporting text, Body 1 at the secondary ink. */
  Supporting,
  /** The action row: 8 dp around, 4 dp between. */
  Actions,
  /** Expanded supporting text behind a full-bleed divider seam, revealed by `v-model:expanded`. */
  Expanded,
})
