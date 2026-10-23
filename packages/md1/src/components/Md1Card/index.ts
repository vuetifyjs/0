export type { Md1CardContext, Md1CardProps } from './Md1Card.vue'
export { MD1_CARD_COLLAPSIBLE, useMd1Card } from './Md1Card.vue'
export type { Md1CardActionsAlign, Md1CardActionsProps } from './Md1CardActions.vue'
export { default as Md1CardActions } from './Md1CardActions.vue'
export { default as Md1CardExpanded } from './Md1CardExpanded.vue'
export type { Md1CardHeaderProps } from './Md1CardHeader.vue'
export { default as Md1CardHeader } from './Md1CardHeader.vue'
export type { Md1CardMediaProps, Md1CardMediaRatio } from './Md1CardMedia.vue'
export { default as Md1CardMedia } from './Md1CardMedia.vue'
export { default as Md1CardSubtitle } from './Md1CardSubtitle.vue'
export { default as Md1CardSupporting } from './Md1CardSupporting.vue'
export type { Md1CardTitleLevel, Md1CardTitleProps } from './Md1CardTitle.vue'
export { default as Md1CardTitle } from './Md1CardTitle.vue'

// Context
import Root from './Md1Card.vue'
import Actions from './Md1CardActions.vue'
import Expanded from './Md1CardExpanded.vue'
import Header from './Md1CardHeader.vue'
import Media from './Md1CardMedia.vue'
import Subtitle from './Md1CardSubtitle.vue'
import Supporting from './Md1CardSupporting.vue'
import Title from './Md1CardTitle.vue'

/**
 * The Material Design 1 card: a sheet at 2 dp (8 dp picked up, 0 dp at rest
 * under a mouse) with 2 dp corners, built from the cards page's content
 * blocks. Presentational on v0 `Atom`; the expanded region is a v0
 * `Collapsible` revealed by `v-model:expanded`.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`Md1CardTitle`) remain exported and valid.
 *
 * @example
 * ```vue
 * <Md1Card v-model:expanded="open">
 *   <Md1Card.Header avatar="/me.png" subtitle="Subtitle" title="Title" />
 *
 *   <Md1Card.Media src="/photo.jpg" />
 *
 *   <Md1Card.Title>Title</Md1Card.Title>
 *
 *   <Md1Card.Subtitle>Subtitle</Md1Card.Subtitle>
 *
 *   <Md1Card.Supporting>Supporting text</Md1Card.Supporting>
 *
 *   <Md1Card.Actions>
 *     <Md1Button>Action 1</Md1Button>
 *   </Md1Card.Actions>
 *
 *   <Md1Card.Expanded>Expanded supporting text</Md1Card.Expanded>
 * </Md1Card>
 * ```
 */
export const Md1Card = Object.assign(Root, {
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
