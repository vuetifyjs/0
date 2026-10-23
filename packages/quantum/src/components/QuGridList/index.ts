export type { QuGridListContext, QuGridListGutter, QuGridListProps, QuGridListRatio } from './QuGridList.vue'
export type { QuGridListBarPosition, QuGridListBarProps, QuGridListBarSide } from './QuGridListBar.vue'
export { default as QuGridListBar } from './QuGridListBar.vue'
export type { QuGridListTileContext, QuGridListTileProps } from './QuGridListTile.vue'
export { default as QuGridListTile } from './QuGridListTile.vue'

// Context
import Root from './QuGridList.vue'
import Bar from './QuGridListBar.vue'
import Tile from './QuGridListTile.vue'

/**
 * The Material Design 1 grid list: a repeated pattern of cells, each holding a
 * tile whose primary content is an image and whose secondary content is a
 * header or footer bar with text and an action icon. Presentational on v0
 * `Atom`; the tile's primary action and the bar's icon are `Button.Root`s
 * hosting `QuRipple`.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`QuGridListTile`, `QuGridListBar`) remain exported
 * and valid.
 *
 * @example
 * ```vue
 * <QuGridList :columns="3" ratio="4:3">
 *   <QuGridList.Tile v-for="photo in photos" :key="photo.id" :alt="photo.alt" :src="photo.src" @click="open(photo)">
 *     <QuGridList.Bar icon="info" icon-label="Details" :title="photo.title" @action="details(photo)" />
 *   </QuGridList.Tile>
 * </QuGridList>
 * ```
 */
export const QuGridList = Object.assign(Root, {
  /** One cell's content: the image, the primary action and the selected state; it hosts the bar. */
  Tile,
  /** The header or footer band: one or two lines of text and an action icon flush with the tile edge. */
  Bar,
})
