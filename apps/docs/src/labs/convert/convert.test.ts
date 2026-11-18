import { describe, expect, it } from 'vitest'

import { convert } from './convert'

describe('convert', () => {
  it('should turn a Bulma modal card into BuModal parts', () => {
    const result = convert(`
      <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-card">
          <header class="modal-card-head">
            <p class="modal-card-title">Modal title</p>
            <button class="delete" aria-label="close"></button>
          </header>
          <section class="modal-card-body"><p>Body copy</p></section>
          <footer class="modal-card-foot">
            <button class="button is-success">Save changes</button>
          </footer>
        </div>
      </div>
    `)

    expect(result.refused).toBeNull()
    expect(result.system).toBe('bulma')
    expect(result.vue).toContain('<BuModal v-model="modalOpen">')
    expect(result.vue).toContain('shallowRef(true)')
    expect(result.vue).toContain('<BuModalTitle>Modal title</BuModalTitle>')
    expect(result.vue).toContain('<BuModalDelete />')
    expect(result.vue).toContain('Save changes')
    expect(result.vue).not.toContain('modal-background')
    expect(result.vue).not.toContain('is-active')
  })

  it('should keep a Bulma dropdown item active class and move the root open state', () => {
    const result = convert(`
      <div class="dropdown is-active is-right">
        <div class="dropdown-trigger">
          <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
            <span>Dropdown button</span>
          </button>
        </div>
        <div class="dropdown-menu" id="dropdown-menu" role="menu">
          <div class="dropdown-content">
            <a href="#" class="dropdown-item is-active">Active dropdown item</a>
            <hr class="dropdown-divider">
          </div>
        </div>
      </div>
    `)

    expect(result.system).toBe('bulma')
    expect(result.vue).toContain('<BuDropdown v-model="dropdownOpen" menu right>')
    expect(result.vue).toContain('v-bind="attrs"')
    expect(result.vue).toContain('class="dropdown-item is-active"')
    expect(result.vue).toContain('v-bind="item"')
    expect(result.vue).not.toContain('aria-haspopup')
    expect(result.vue).not.toContain('id="dropdown-menu"')
  })

  it('should turn a Bulma notification into BuNotification', () => {
    const result = convert(`
      <div class="notification is-primary is-light">
        <button class="delete"></button>
        Saved.
      </div>
    `)

    expect(result.vue).toContain('<BuNotification v-model="noticeOpen" color="primary" light>')
    expect(result.vue).toContain('<BuNotificationDelete />')
    expect(result.vue).toContain('Saved.')
    expect(result.vue).not.toContain('class="delete"')
  })

  it('should keep the spaces around an inline element', () => {
    const result = convert('<p>Add <code>is-active</code> yourself.</p>')

    expect(result.refused).toBeNull()
    expect(result.vue).toContain('Add <code>is-active</code> yourself.')
  })

  it('should turn a Bootstrap 6 dialog into BDialog and drop the data-api', () => {
    const result = convert(`
      <dialog class="dialog dialog-sm">
        <div class="dialog-header">
          <h1 class="dialog-title">Dialog title</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="dialog-body"><p>Native dialog.</p></div>
        <div class="dialog-footer">
          <button type="button" class="btn-solid theme-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      </dialog>
    `)

    expect(result.refused).toBeNull()
    expect(result.system).toBe('bootstrap')
    expect(result.vue).toContain('<BDialog v-model="dialogOpen" size="sm">')
    expect(result.vue).toContain('<BDialog.Title>Dialog title</BDialog.Title>')
    expect(result.vue).toContain('<BDialog.Close />')
    expect(result.vue).toContain('class="btn-solid theme-secondary"')
    expect(result.vue).toContain('@click="dialogOpen = false"')
    expect(result.vue).not.toContain('data-bs-')
    expect(result.vue).not.toContain('btn-close')
  })

  it('should turn a Bootstrap 6 menu into BMenu', () => {
    const result = convert(`
      <button type="button" class="btn-solid theme-primary">Toggle menu</button>
      <div class="menu show" data-bs-placement="bottom-start">
        <h6 class="menu-header">Account</h6>
        <a class="menu-item" href="#">Profile</a>
        <hr class="menu-divider">
        <div class="submenu">
          <button type="button" class="menu-item">File</button>
          <div class="menu">
            <a class="menu-item" href="#">New</a>
          </div>
        </div>
      </div>
    `)

    expect(result.refused).toBeNull()
    expect(result.system).toBe('bootstrap')
    expect(result.vue).toContain('<BMenu v-model="menuOpen" label="Toggle menu" placement="bottom-start">')
    expect(result.vue).toContain('<BMenu.Header>Account</BMenu.Header>')
    expect(result.vue).toContain('<BMenu.Item href="#">Profile</BMenu.Item>')
    expect(result.vue).toContain('<BMenu.Divider />')
    expect(result.vue).toContain('<BMenu.Submenu label="File">')
    expect(result.vue).toContain('shallowRef(true)')
    expect(result.vue).not.toContain('data-bs-toggle')
  })

  it('should turn a Bootstrap 6 collapse trigger into a model flip', () => {
    const result = convert(`
      <button type="button" class="btn-solid theme-primary" data-bs-toggle="collapse" data-bs-target="#panel">
        Toggle
      </button>
      <div id="panel" class="collapse">
        Hidden
      </div>
    `)

    expect(result.system).toBe('bootstrap')
    expect(result.vue).toContain('@click="collapseOpen = !collapseOpen"')
    expect(result.vue).toContain('<BCollapse v-model="collapseOpen">')
    expect(result.vue).toContain('Hidden')
    expect(result.vue).not.toContain('data-bs-')
  })

  it('should wrap a Bootstrap 6 tooltip trigger', () => {
    const result = convert(`
      <button type="button" class="btn-solid theme-primary" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Tooltip on top">
        Button
      </button>
    `)

    expect(result.vue).toContain('<BTooltip v-slot="{ attrs }" v-model="tipOpen" text="Tooltip on top" placement="top">')
    expect(result.vue).toContain('Button')
    expect(result.vue).not.toContain('data-bs-')
  })

  it('should pass a utility button through', () => {
    const result = convert('<button class="button is-primary" type="button">Save</button>')

    expect(result.system).toBe('none')
    expect(result.refused).toBeNull()
    expect(result.vue).toContain('class="button is-primary"')
    expect(result.vue).not.toContain('@paper/')
    expect(result.notes.some(note => note.includes('passed through'))).toBe(true)
  })

  it('should refuse Bootstrap 5 markup', () => {
    const modal = convert(`
      <div class="modal fade">
        <div class="modal-dialog">
          <div class="modal-content">Modal</div>
        </div>
      </div>
    `)
    const grid = convert('<div class="col-md-6">Cell</div>')
    const button = convert('<button class="btn btn-primary" type="button">Go</button>')

    expect(modal.refused).toContain('Bootstrap 5')
    expect(modal.vue).toBe('')
    expect(grid.refused).toContain('Bootstrap 5')
    expect(button.refused).toContain('Bootstrap 5')
  })
})
