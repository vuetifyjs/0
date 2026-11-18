<script setup lang="ts">
  import { BCollapse, BDialog, BMenu, BTooltip } from '@paper/bootstrap'
  import {
    BuDropdown,
    BuDropdownMenu,
    BuDropdownTrigger,
    BuModal,
    BuModalBody,
    BuModalCard,
    BuModalClose,
    BuModalContent,
    BuModalDelete,
    BuModalFoot,
    BuModalHead,
    BuModalTitle,
    BuNotification,
    BuNotificationDelete,
  } from '@paper/bulma'

  import { collectModels, cssFor } from './convert'

  // Utilities
  import { isNull, isObject } from '#v0/utilities'
  import { createApp, h, onBeforeUnmount, onMounted, reactive, useTemplateRef, watch } from 'vue'

  // Types
  import type {
    BootstrapCollapseNode,
    BootstrapDialogNode,
    BootstrapMenuNode,
    BootstrapTooltipNode,
    BulmaDropdownNode,
    BulmaModalNode,
    BulmaNotificationNode,
    ElementNode,
    IrNode,
    MenuEntry,
    System,
  } from './convert'
  import type { App, VNode } from 'vue'

  const { tree, system } = defineProps<{
    tree: IrNode[]
    system: System
  }>()

  const frame = useTemplateRef<HTMLIFrameElement>('frame')
  const models = reactive<Models>({})
  let app: App | null = null

  interface Extra {
    bind?: Record<string, unknown>
    onClick?: () => void
    expanded?: boolean
    /** Model id a `data-bs-dismiss` control should set false. Not copied onto the DOM. */
    closes?: string
  }

  type Models = Record<string, boolean>
  type Piece = VNode | string

  const BLOCKED_TAG = new Set(['script', 'iframe', 'object', 'embed', 'link', 'meta'])

  function unmountApp () {
    app?.unmount()
    app = null
  }

  function signature (): string {
    return `${system}:${topPad(tree)}`
  }

  function syncModels () {
    for (const key of Object.keys(models)) delete models[key]
    for (const model of collectModels(tree)) models[model.id] = model.open
  }

  function mountApp () {
    unmountApp()
    const root = frame.value?.contentDocument?.getElementById('app')
    if (isNull(root)) return
    const nodes = tree
    const state = models
    app = createApp({
      name: 'ConvertPreview',
      render: () => h('div', renderNodes(nodes, state)),
    })
    app.mount(root)
  }

  function ensureFrame () {
    const el = frame.value
    if (!el) return
    const css = cssFor(system)
    if (isNull(css)) {
      unmountApp()
      el.srcdoc = ''
      return
    }
    const next = signature()
    const current = el.contentDocument?.documentElement.dataset.preview
    if (current === next && !isNull(el.contentDocument?.getElementById('app'))) {
      mountApp()
      return
    }
    el.srcdoc = `<!doctype html><html data-preview="${next}"><head><link rel="stylesheet" href="${css}"><style>html, body { margin: 0; height: 100%; } body { box-sizing: border-box; padding: ${topPad(tree)} 1.5rem 1.5rem; }</style></head><body><div id="app"></div></body></html>`
  }

  function onTree () {
    syncModels()
    ensureFrame()
  }

  function onLoad () {
    const current = frame.value?.contentDocument?.documentElement.dataset.preview
    if (current !== signature()) return
    mountApp()
  }

  syncModels()
  onMounted(onTree)
  watch(() => [system, tree], onTree)
  onBeforeUnmount(unmountApp)

  function topPad (nodes: IrNode[]): string {
    return nodes.some(node => node.kind === 'bootstrap-tooltip') ? '8rem' : '1.5rem'
  }

  function renderNodes (nodes: IrNode[], models: Models, closes?: string): Piece[] {
    const extra = closes === undefined ? undefined : { closes }
    return nodes.flatMap(node => renderNode(node, models, extra))
  }

  function renderNode (node: IrNode, models: Models, extra?: Extra): Piece[] {
    switch (node.kind) {
      case 'text': {
        return renderText(node.text)
      }
      case 'element': {
        return renderElement(node, models, extra)
      }
      case 'bulma-modal': {
        return renderModal(node, models)
      }
      case 'bulma-dropdown': {
        return [renderDropdown(node, models)]
      }
      case 'bulma-notification': {
        return renderNotification(node, models)
      }
      case 'bootstrap-dialog': {
        return renderDialog(node, models)
      }
      case 'bootstrap-menu': {
        return [renderMenu(node, models)]
      }
      case 'bootstrap-collapse': {
        return renderCollapse(node, models)
      }
      case 'bootstrap-tooltip': {
        return [renderTooltip(node, models)]
      }
    }
  }

  function renderModal (node: BulmaModalNode, models: Models): Piece[] {
    const panel = node.variant === 'content'
      ? [
        h(BuModalContent, () => renderNodes(node.content, models)),
        node.close ? h(BuModalClose, node.closeSize ? { size: node.closeSize } : {}) : null,
      ]
      : [
        h(BuModalCard, () => [
          h(BuModalHead, () => [
            node.title === '' ? null : h(BuModalTitle, () => node.title),
            node.dismiss ? h(BuModalDelete) : null,
          ]),
          h(BuModalBody, () => renderNodes(node.body, models)),
          node.foot.length === 0 ? null : h(BuModalFoot, () => renderNodes(node.foot, models)),
        ]),
      ]
    return [
      h(BuModal, modelProps(node.id, models), () => panel),
    ]
  }

  function renderDropdown (node: BulmaDropdownNode, models: Models): VNode {
    return h(BuDropdown, {
      ...modelProps(node.id, models),
      ...(node.menu ? { menu: true } : {}),
      ...(node.hoverable ? { hoverable: true } : {}),
      ...(node.right ? { right: true } : {}),
      ...(node.up ? { up: true } : {}),
    }, {
      default: () => [
        h(BuDropdownTrigger, {}, {
          default: (slot: unknown) => node.trigger.flatMap(child => renderNode(child, models, { bind: record(slot, 'attrs') })),
        }),
        h(BuDropdownMenu, {}, {
          default: (slot: unknown) => node.items.flatMap(child => renderNode(child, models, itemBind(child, node.menu, slot))),
        }),
      ],
    })
  }

  function renderNotification (node: BulmaNotificationNode, models: Models): Piece[] {
    return [h(BuNotification, {
      ...modelProps(node.id, models),
      ...(node.color ? { color: node.color } : {}),
      ...(node.light ? { light: true } : {}),
    }, () => [
      node.dismiss ? h(BuNotificationDelete) : null,
      ...renderNodes(node.children, models),
    ])]
  }

  function renderDialog (node: BootstrapDialogNode, models: Models): Piece[] {
    return [
      h(BDialog, {
        ...modelProps(node.id, models),
        ...(node.size === 'sm' || node.size === 'lg' || node.size === 'xl' ? { size: node.size } : {}),
        ...(node.blocking ? { blocking: true } : {}),
      }, () => [
        h(BDialog.Header, () => [
          h(BDialog.Title, () => node.title),
          h(BDialog.Close),
        ]),
        h(BDialog.Body, () => renderNodes(node.body, models, node.id)),
        node.footer.length === 0 ? null : h(BDialog.Footer, () => renderNodes(node.footer, models, node.id)),
      ]),
    ]
  }

  function renderMenu (node: BootstrapMenuNode, models: Models): VNode {
    return h(BMenu, {
      ...modelProps(node.id, models),
      label: node.label,
      ...(node.placement ? { placement: node.placement } : {}),
    }, () => renderEntries(node.entries))
  }

  function renderEntries (entries: MenuEntry[]): Piece[] {
    return entries.map(entry => {
      if (entry.kind === 'divider') return h(BMenu.Divider)
      if (entry.kind === 'header') return h(BMenu.Header, () => entry.text ?? '')
      if (entry.kind === 'submenu') {
        return h(BMenu.Submenu, { label: entry.text ?? '' }, () => renderEntries(entry.entries ?? []))
      }
      return h(BMenu.Item, entry.href === undefined ? {} : { href: entry.href }, () => entry.text ?? '')
    })
  }

  function renderCollapse (node: BootstrapCollapseNode, models: Models): Piece[] {
    const trigger = node.trigger.flatMap(child => renderNode(child, models, {
      onClick: () => {
        models[node.id] = !models[node.id]
      },
      expanded: models[node.id],
    }))
    const panel = h(BCollapse, {
      ...modelProps(node.id, models),
      ...(node.horizontal ? { horizontal: true } : {}),
    }, () => renderNodes(node.children, models))
    return [...trigger, panel]
  }

  function renderTooltip (node: BootstrapTooltipNode, models: Models): VNode {
    return h(BTooltip, {
      ...modelProps(node.id, models),
      text: node.text,
      ...(node.placement ? { placement: node.placement } : {}),
    }, {
      default: (slot: unknown) => renderNode(node.trigger, models, { bind: record(slot, 'attrs') }),
    })
  }

  function renderElement (node: ElementNode, models: Models, extra?: Extra): Piece[] {
    if (BLOCKED_TAG.has(node.tag)) return []
    const closes = extra?.closes
    const onClick = extra?.onClick ?? (node.dismiss === true && closes !== undefined
      ? () => {
        models[closes] = false
      }
      : undefined)
    const props = elementProps(node, onClick === undefined ? extra : { ...extra, onClick })
    if (VOID.has(node.tag)) return [h(node.tag, props)]
    return [h(node.tag, props, renderNodes(node.children, models, closes))]
  }

  function elementProps (node: ElementNode, extra?: Extra): Record<string, unknown> {
    const props: Record<string, unknown> = {}
    for (const attr of node.attrs) {
      if (/^on/i.test(attr.name)) continue
      if (attr.name === 'href' && attr.value.trim().toLowerCase().startsWith('javascript:')) continue
      props[attr.name] = attr.value
    }
    if (extra?.bind) Object.assign(props, extra.bind)
    if (extra?.onClick) props.onClick = extra.onClick
    if (extra?.expanded !== undefined) props['aria-expanded'] = extra.expanded ? 'true' : 'false'
    return props
  }

  function itemBind (node: IrNode, menu: boolean, slot: unknown): Extra | undefined {
    if (!menu || node.kind !== 'element') return undefined
    const found = node.attrs.find(attr => attr.name === 'class')
    if (found === undefined || !found.value.split(/\s+/).includes('dropdown-item')) return undefined
    return { bind: record(slot, 'item') }
  }

  function record (slot: unknown, key: string): Record<string, unknown> {
    if (!isObject(slot)) return {}
    const value = slot[key]
    if (!isObject(value)) return {}
    return value
  }

  function modelProps (id: string, models: Models): { 'modelValue': boolean, 'onUpdate:modelValue': (value: boolean) => void } {
    return {
      'modelValue': models[id] ?? false,
      'onUpdate:modelValue': (value: boolean) => {
        models[id] = value
      },
    }
  }

  function renderText (text: string): string[] {
    if (text.trim() === '') return []
    const lead = /^\s/.test(text) ? ' ' : ''
    const tail = /\s$/.test(text) ? ' ' : ''
    return [lead + text.replace(/\s+/g, ' ').trim() + tail]
  }

  function harnessLabel (id: string): string | null {
    if (id.startsWith('modalOpen')) return 'modal'
    if (id.startsWith('dialogOpen')) return 'dialog'
    if (id.startsWith('noticeOpen')) return 'notification'
    return null
  }

  function harnessText (id: string): string {
    const name = harnessLabel(id) ?? ''
    const open = models[id] === true
    if (name === 'notification') return open ? 'Hide notification' : 'Show notification'
    return open ? `Close ${name}` : `Open ${name}`
  }

  function onHarness (id: string) {
    models[id] = models[id] !== true
  }

  const VOID = new Set(['area', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr'])
</script>

<template>
  <div class="flex h-full min-h-0 flex-col overflow-hidden rounded border border-divider bg-surface">
    <div class="flex shrink-0 flex-wrap items-center gap-2 border-b border-divider px-3 py-2">
      <span class="text-xs text-on-surface-variant">Preview</span>

      <button
        v-for="model in collectModels(tree)"
        v-show="harnessLabel(model.id) !== null"
        :key="model.id"
        class="rounded border border-divider px-2 py-1 text-xs text-on-surface"
        type="button"
        @click="onHarness(model.id)"
      >
        {{ harnessText(model.id) }}
      </button>
    </div>

    <iframe
      ref="frame"
      class="min-h-0 w-full flex-1 bg-white"
      title="Converted component preview"
      @load="onLoad"
    />
  </div>
</template>
