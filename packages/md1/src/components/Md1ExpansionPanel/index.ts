export type { Md1ExpansionPanelContext, Md1ExpansionPanelProps } from './Md1ExpansionPanel.vue'
export { default as Md1ExpansionPanelActions } from './Md1ExpansionPanelActions.vue'
export type { Md1ExpansionPanelContentProps } from './Md1ExpansionPanelContent.vue'
export { default as Md1ExpansionPanelContent } from './Md1ExpansionPanelContent.vue'
export type { Md1ExpansionPanelHeaderProps } from './Md1ExpansionPanelHeader.vue'
export { default as Md1ExpansionPanelHeader } from './Md1ExpansionPanelHeader.vue'
export type { Md1ExpansionPanelItemProps } from './Md1ExpansionPanelItem.vue'
export { default as Md1ExpansionPanelItem } from './Md1ExpansionPanelItem.vue'

// Context
import Root from './Md1ExpansionPanel.vue'
import Actions from './Md1ExpansionPanelActions.vue'
import Content from './Md1ExpansionPanelContent.vue'
import Header from './Md1ExpansionPanelHeader.vue'
import Item from './Md1ExpansionPanelItem.vue'

/**
 * The Material Design 1 expansion panel: 48 dp rows stacked on one card, each
 * opening into a 64 dp header and an editing body that detaches 16 dp from
 * its neighbours and lifts to 8 dp. Composes v0 `ExpansionPanel.Group`,
 * `Root`, `Header`, `Activator`, `Cue` and `Content`; single-open by default,
 * `multiple` otherwise.
 *
 * Sub-components are attached to the root, so one import reaches the whole
 * compound. The flat names (`Md1ExpansionPanelHeader`) remain exported and valid.
 *
 * @example
 * ```vue
 * <Md1ExpansionPanel v-model="panel">
 *   <Md1ExpansionPanel.Item value="trip">
 *     <Md1ExpansionPanel.Header label="Trip name" summary="Caribbean cruise" />
 *
 *     <Md1ExpansionPanel.Content>
 *       Where are you going?
 *
 *       <Md1ExpansionPanel.Actions>
 *         <Md1Button>Cancel</Md1Button>
 *         <Md1Button>Save</Md1Button>
 *       </Md1ExpansionPanel.Actions>
 *     </Md1ExpansionPanel.Content>
 *   </Md1ExpansionPanel.Item>
 * </Md1ExpansionPanel>
 * ```
 */
export const Md1ExpansionPanel = Object.assign(Root, {
  /** One panel: registers its `value` with the root and hosts a header and a content region. */
  Item,
  /** The 48 dp row (64 dp expanded): label, secondary line, value column and the expand icon, inside an `h3`. */
  Header,
  /** The region the header expands: the editing body. */
  Content,
  /** The CANCEL / SAVE row below a divider, placed last inside `Content`; the buttons are yours. */
  Actions,
})
