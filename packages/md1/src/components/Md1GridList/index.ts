export type { Md1GridListContext, Md1GridListGutter, Md1GridListProps, Md1GridListRatio } from './Md1GridList.vue'
export type { Md1GridListBarPosition, Md1GridListBarProps, Md1GridListBarSide } from './Md1GridListBar.vue'
export { default as Md1GridListBar } from './Md1GridListBar.vue'
export type { Md1GridListTileContext, Md1GridListTileProps } from './Md1GridListTile.vue'
export { default as Md1GridListTile } from './Md1GridListTile.vue'

// Context
import Root from './Md1GridList.vue'
import Bar from './Md1GridListBar.vue'
import Tile from './Md1GridListTile.vue'

/**
 * The Material Design 1 grid list: a repeated pattern of cells, each holding a
 * tile whose primary content is an image and whose secondary content is a
 * header or footer bar with text and an action icon. Presentational on v0
 * `Atom`; the tile's primary action and the bar's icon are `Button.Root`s
 * hosting `Md1Ripple`.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`Md1GridListTile`, `Md1GridListBar`) remain exported
 * and valid.
 *
 * @example
 * ```vue
 * <Md1GridList :columns="3" ratio="4:3">
 *   <Md1GridList.Tile v-for="photo in photos" :key="photo.id" :alt="photo.alt" :src="photo.src" @click="open(photo)">
 *     <Md1GridList.Bar icon="info" icon-label="Details" :title="photo.title" @action="details(photo)" />
 *   </Md1GridList.Tile>
 * </Md1GridList>
 * ```
 */
export const Md1GridList = Object.assign(Root, {
  /** One cell's content: the image, the primary action and the selected state; it hosts the bar. */
  Tile,
  /** The header or footer band: one or two lines of text and an action icon flush with the tile edge. */
  Bar,
})
