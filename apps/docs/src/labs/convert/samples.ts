export interface Sample {
  id: string
  label: string
  html: string
}

export const samples: Sample[] = [
  {
    id: 'bulma-modal',
    label: 'Bulma modal',
    html: `<div class="modal is-active">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Modal title</p>
      <button class="delete" aria-label="close"></button>
    </header>
    <section class="modal-card-body">
      <p>Bulma tells you to add <code>is-active</code> yourself. <code>BuModal</code> owns it.</p>
    </section>
    <footer class="modal-card-foot">
      <div class="buttons">
        <button class="button is-success">Save changes</button>
        <button class="button">Cancel</button>
      </div>
    </footer>
  </div>
</div>`,
  },
  {
    id: 'bulma-dropdown',
    label: 'Bulma dropdown',
    html: `<div class="dropdown is-active">
  <div class="dropdown-trigger">
    <button class="button" aria-haspopup="true" aria-controls="dropdown-menu">
      <span>Dropdown button</span>
    </button>
  </div>
  <div class="dropdown-menu" id="dropdown-menu" role="menu">
    <div class="dropdown-content">
      <a href="#" class="dropdown-item">Dropdown item</a>
      <a href="#" class="dropdown-item is-active">Active dropdown item</a>
      <hr class="dropdown-divider">
      <a href="#" class="dropdown-item">With a divider</a>
    </div>
  </div>
</div>`,
  },
  {
    id: 'bulma-notification',
    label: 'Bulma notification',
    html: `<div class="notification is-primary is-light">
  <button class="delete"></button>
  Saved. The delete button is <code>BuNotificationDelete</code>, and the color stays a prop.
</div>`,
  },
  {
    id: 'bootstrap-dialog',
    label: 'Bootstrap dialog',
    html: `<dialog class="dialog dialog-sm">
  <div class="dialog-header">
    <h1 class="dialog-title">Dialog title</h1>
    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
  </div>
  <div class="dialog-body">
    <p>Bootstrap 6 paints this. The data-api does not come along.</p>
  </div>
  <div class="dialog-footer">
    <button type="button" class="btn-solid theme-secondary" data-bs-dismiss="modal">Close</button>
    <button type="button" class="btn-solid theme-primary">Save changes</button>
  </div>
</dialog>`,
  },
  {
    id: 'bootstrap-menu',
    label: 'Bootstrap menu',
    html: `<button type="button" class="btn-solid theme-primary">Toggle menu</button>
<div class="menu" data-bs-placement="bottom-start">
  <h6 class="menu-header">Account</h6>
  <a class="menu-item" href="#">Profile</a>
  <hr class="menu-divider">
  <a class="menu-item" href="#">Sign out</a>
  <div class="submenu">
    <button type="button" class="menu-item">File</button>
    <div class="menu" data-bs-placement="right-start">
      <a class="menu-item" href="#">New</a>
    </div>
  </div>
</div>`,
  },
  {
    id: 'bootstrap-collapse',
    label: 'Bootstrap collapse',
    html: `<button type="button" class="btn-solid theme-primary" data-bs-toggle="collapse" data-bs-target="#panel">
  Toggle
</button>
<div id="panel" class="collapse">
  <p>The panel is <code>BCollapse</code>. The button stays a button.</p>
</div>`,
  },
  {
    id: 'bootstrap-tooltip',
    label: 'Bootstrap tooltip',
    html: `<button type="button" class="btn-solid theme-primary" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Tooltip on top">
  Hover
</button>`,
  },
  {
    id: 'bootstrap-5',
    label: 'Bootstrap 5 (refused)',
    html: `<div class="modal fade" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-body">
        <p>This is Bootstrap 5. It is refused.</p>
      </div>
    </div>
  </div>
</div>`,
  },
]
