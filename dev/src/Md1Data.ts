/**
 * The md1 demo's shared data: one module owns every domain's rows so a change
 * on one page is the truth everywhere (search finds what exists now, a delete
 * is gone everywhere, Undo restores everywhere).
 *
 * Each domain exports `all` (the reactive store) plus its typed mutation
 * helpers. Seeds match the wave-2 page data, so migrating a page onto the
 * store changes nothing visibly.
 */

// Framework
import { createFilter, isArray } from '@vuetify/v0'

// Assets
import avatar from './assets/john.png'

// Utilities
import { computed, ref, shallowRef, toValue } from 'vue'

// Types
import type { StorageContext } from '@vuetify/v0'
import type { ComputedRef, MaybeRefOrGetter } from 'vue'

export type Tab = 'primary' | 'social' | 'updates'

export type Message = {
  id: number
  from: string
  subject: string
  preview: string
  /** The full text the reading pane shows. */
  body: string
  time: string
  day: 'Today' | 'Yesterday' | 'Earlier'
  tab: Tab
  unread?: boolean
  starred?: boolean
  /** Attachment file names; the reading pane renders them as chips. */
  attachments?: string[]
  /** Replies sent from the reading pane, oldest first. */
  replies?: string[]
}

export type Contact = {
  id: number
  name: string
  email: string
  label: string
}

export type Order = {
  id: number
  customer: string
  /** Date placed, ISO, so the column sorts chronologically. */
  placed: string
  /** The date as the cell shows it. */
  shown: string
  items: number
  total: number
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled'
}

export type Kind = 'folder' | 'image' | 'document' | 'sheet'

export type Item = {
  id: number
  name: string
  kind: Kind
  /** The second bar line: size and date, or the folder's count. */
  meta: string
}

export type Entry = {
  id: number
  actor: string
  action: string
  detail: string
  time: string
  day: 'Today' | 'Yesterday' | 'Earlier'
  unread: boolean
  starred: boolean
}

export type Region = {
  id: number
  region: string
  orders: number
  revenue: number
  share: number
}

export type Todo = {
  id: number
  text: string
  done: boolean
  order: number
}

export type Photo = {
  id: number
  title: string
  album: 'Travel' | 'Team' | 'Product'
  taken: string
  /** The flat field colour the gallery draws the CSS/SVG "photo" from. */
  hue: string
}

export type Turn = {
  id: number
  role: 'user' | 'agent'
  text: string
  at: string
}

export type Profile = {
  name: string
  email: string
  role: string
  bio: string
  location: string
  /** The account picture, a local asset URL. */
  avatar: string
}

/** A removed row with the slot it came out of, so Undo puts it back in place. */
export type Slot<Z> = {
  row: Z
  index: number
}

function next (ids: number[]): number {
  return Math.max(...ids) + 1
}

function pull<Z extends { id: number }> (list: Z[], ids: number[]): Slot<Z>[] {
  const slots: Slot<Z>[] = []

  // Record every slot against the intact list first: splicing as we find them
  // shifts the later indexes and adjacent rows would restore transposed.
  for (const id of ids) {
    const index = list.findIndex(row => row.id === id)
    if (index === -1) continue

    slots.push({ row: list[index]!, index })
  }

  // Remove bottom-up so earlier splices cannot shift the remaining indexes.
  for (const slot of [...slots].sort((a, b) => b.index - a.index)) {
    list.splice(slot.index, 1)
  }

  return slots
}

function push<Z> (list: Z[], slots: Slot<Z>[]) {
  for (const slot of [...slots].sort((a, b) => a.index - b.index)) {
    list.splice(Math.min(slot.index, list.length), 0, slot.row)
  }
}

// Messages (inbox)

export const messages = {
  all: ref<Message[]>([
    { id: 11, from: 'Kenji Sato', subject: 'Standup moved to 9:30', preview: 'One-off change for tomorrow only.', body: 'One-off change for tomorrow only. The retro stays where it is. The calendar is already updated.', time: '10:05 AM', day: 'Today', tab: 'primary', unread: true },
    { id: 12, from: 'Lucia Moreau', subject: 'Invoice 221 received', preview: 'Payment landed this morning.', body: 'Payment landed this morning and the receipt is in the portal. Nothing further is needed from you.', time: '9:50 AM', day: 'Today', tab: 'updates' },
    { id: 13, from: 'Mateo Silva', subject: 'Weekend five-a-side', preview: 'We\'re one short for Sunday morning.', body: 'We\'re one short for Sunday morning. Same pitch, same time. First yes gets the spot.', time: '9:21 AM', day: 'Today', tab: 'social', unread: true },
    { id: 1, from: 'Ana Ribeiro', subject: 'Photos from Sintra', preview: 'The light on the coast was unreal, take a look.', body: 'The light on the coast was unreal, take a look. We walked the palace gardens at opening and had them to ourselves. Two favourites attached — the rest land in the shared album tonight.', time: '9:14 AM', day: 'Today', tab: 'social', unread: true, attachments: ['sintra-coast.jpg', 'palace-steps.jpg'] },
    { id: 2, from: 'Ben Okafor', subject: 'Lunch on Thursday?', preview: 'The new place by the park does a weekday menu.', body: 'The new place by the park does a weekday menu. Thursday at noon works for everyone else — does it work for you? I\'ll book for six if you\'re in.', time: '8:47 AM', day: 'Today', tab: 'primary', unread: true },
    { id: 14, from: 'Nadia Petrova', subject: 'Design review notes', preview: 'Annotated frames attached, two small blockers.', body: 'Annotated frames attached. Two blockers, both small: the empty-state copy and the focus order in the dialog. Everything else is ready to build.', time: '8:12 AM', day: 'Today', tab: 'primary', attachments: ['review-notes.doc', 'frames.png'] },
    { id: 3, from: 'Chloe Martin', subject: 'Minutes from the planning call', preview: 'Decisions and owners are at the top, details below.', body: 'Decisions and owners are at the top, details below. Two items moved to next sprint; the capacity question is parked until the numbers land. Full minutes attached.', time: '7:32 AM', day: 'Today', tab: 'primary', attachments: ['planning-minutes.doc'] },
    { id: 4, from: 'Dev Patel', subject: 'Your order has shipped', preview: 'Order 4126 left the warehouse this morning.', body: 'Order 4126 left the warehouse this morning. Tracking says Thursday before noon. Everything in the order shipped together.', time: 'Yesterday', day: 'Yesterday', tab: 'updates' },
    { id: 5, from: 'Elena Rossi', subject: 'Book club: next pick', preview: 'Three candidates this month, vote by Friday.', body: 'Three candidates this month, vote by Friday. The shortlist is in the usual sheet — one long, one short, one translated. Ties break toward the short one.', time: 'Yesterday', day: 'Yesterday', tab: 'social', unread: true },
    { id: 6, from: 'Farid Haddad', subject: 'Quarterly numbers, first pass', preview: 'Revenue is ahead of plan, costs need a look.', body: 'Revenue is ahead of plan, costs need a look. Shipping ate most of the variance; the rest is the currency swing. First pass attached before the Friday review.', time: 'Yesterday', day: 'Yesterday', tab: 'updates', attachments: ['q3-first-pass.xls'] },
    { id: 15, from: 'Omar Haddad', subject: 'Dinner at ours, Saturday', preview: 'Nothing fancy, come at seven.', body: 'Nothing fancy, come at seven. Bring the card game you kept talking about. And remind me about the allergies again?', time: 'Yesterday', day: 'Yesterday', tab: 'social' },
    { id: 16, from: 'Priya Sharma', subject: 'Expense report approved', preview: 'October\'s report cleared review.', body: 'October\'s report cleared review. Reimbursement lands with the next payroll run.', time: 'Yesterday', day: 'Yesterday', tab: 'updates' },
    { id: 17, from: 'Quinn Murphy', subject: 'Offsite agenda, v1', preview: 'Draft agenda for the two days attached.', body: 'Draft agenda for the two days attached. Morning sessions are fixed; the afternoons still have room. Flag anything missing by Wednesday.', time: 'Yesterday', day: 'Yesterday', tab: 'primary', unread: true, attachments: ['offsite-agenda.doc'] },
    { id: 18, from: 'Rosa Alvarez', subject: 'Photos from the launch party', preview: 'Finally went through the camera roll.', body: 'Finally went through the camera roll. The team photo came out great — printing one for the office. More in the shared folder.', time: 'Yesterday', day: 'Yesterday', tab: 'social', attachments: ['launch-party.jpg'] },
    { id: 7, from: 'Greta Lindqvist', subject: 'Hiking on Saturday?', preview: 'Forecast looks clear, thinking the ridge loop.', body: 'Forecast looks clear, thinking the ridge loop. Eight kilometres, one steep bit, coffee after. The train leaves at 8:40 if you want to join.', time: 'Friday', day: 'Earlier', tab: 'primary' },
    { id: 8, from: 'Hugo Alves', subject: 'Draft of the press note', preview: 'Second paragraph still reads stiff, suggestions welcome.', body: 'Second paragraph still reads stiff, suggestions welcome. The quote is approved, the dates are confirmed, the headline is not. Latest draft attached.', time: 'Friday', day: 'Earlier', tab: 'primary', attachments: ['press-note-v2.doc'] },
    { id: 9, from: 'Imani Said', subject: 'New apartment photos', preview: 'Before the furniture arrives, the empty rooms.', body: 'Before the furniture arrives, the empty rooms. The light in the back room is the reason we took it. Housewarming once the boxes are gone — you\'re invited.', time: 'Thursday', day: 'Earlier', tab: 'social' },
    { id: 10, from: 'Jonas Weber', subject: 'The recipe you asked about', preview: 'The trick is resting the dough overnight.', body: 'The trick is resting the dough overnight. Everything else is the standard method, just slower. Written version below so you can\'t blame my handwriting.', time: 'Thursday', day: 'Earlier', tab: 'primary' },
    { id: 19, from: 'Sana Khalid', subject: 'Password expires in 7 days', preview: 'Change it from Settings before it lapses.', body: 'Your workspace password expires next week. Change it from Settings before it lapses to keep your sessions signed in.', time: 'Oct 20', day: 'Earlier', tab: 'updates' },
    { id: 20, from: 'Tomas Novak', subject: 'Coffee next week?', preview: 'Long overdue.', body: 'Long overdue. I\'m near the office Tuesday and Wednesday. Pick a morning and I\'ll be there.', time: 'Oct 20', day: 'Earlier', tab: 'primary' },
    { id: 21, from: 'Uma Patel', subject: 'Book swap, round two', preview: 'The pile on my desk is yours if you want it.', body: 'The pile on my desk is yours if you want it. Mostly the ones you recommended last time, finally finished. Trade you for whatever you are done with.', time: 'Oct 19', day: 'Earlier', tab: 'social' },
    { id: 22, from: 'Viktor Eriksen', subject: 'Storage almost full', preview: 'Your workspace is at 92% of its storage.', body: 'Your workspace is at 92% of its storage. Archive old files or raise the plan before uploads start failing.', time: 'Oct 19', day: 'Earlier', tab: 'updates', unread: true },
    { id: 23, from: 'Wendy Zhao', subject: 'Thanks for the intro', preview: 'We talked for an hour.', body: 'We talked for an hour and it could have gone three. Exactly the person I needed to meet — I owe you one.', time: 'Oct 18', day: 'Earlier', tab: 'primary' },
    { id: 24, from: 'Yara Aziz', subject: 'Sunday picnic album', preview: 'Everyone\'s photos in one place at last.', body: 'Everyone\'s photos in one place at last. Add yours when you get a minute.', time: 'Oct 17', day: 'Earlier', tab: 'social', attachments: ['picnic.jpg'] },
  ]),

  /** Remove messages and hand back their slots for the snackbar's Undo. */
  remove (ids: number[]): Slot<Message>[] {
    return pull(messages.all.value, ids)
  },

  /** Put removed messages back in the slots they came out of. */
  restore (slots: Slot<Message>[]) {
    push(messages.all.value, slots)
  },

  read (id: number) {
    const message = messages.all.value.find(row => row.id === id)
    if (message) message.unread = false
  },

  star (id: number) {
    const message = messages.all.value.find(row => row.id === id)
    if (message) message.starred = !message.starred
  },

  /** Append a sent reply to the message's own thread. */
  reply (id: number, text: string) {
    const message = messages.all.value.find(row => row.id === id)
    if (message) message.replies = [...message.replies ?? [], text]
  },
}

// Contacts

export const contacts = {
  all: ref<Contact[]>([
    { id: 1, name: 'Amara Diallo', email: 'amara.diallo@example.com', label: 'Work' },
    { id: 2, name: 'Ana Ribeiro', email: 'ana.ribeiro@example.com', label: 'Family' },
    { id: 3, name: 'Ben Okafor', email: 'ben.okafor@example.com', label: 'Friends' },
    { id: 4, name: 'Bianca Costa', email: 'bianca.costa@example.com', label: 'Work' },
    { id: 5, name: 'Chloe Martin', email: 'chloe.martin@example.com', label: 'Work' },
    { id: 6, name: 'Dev Patel', email: 'dev.patel@example.com', label: 'Friends' },
    { id: 7, name: 'Diego Fuentes', email: 'diego.fuentes@example.com', label: 'Family' },
    { id: 8, name: 'Elena Rossi', email: 'elena.rossi@example.com', label: 'Friends' },
    { id: 9, name: 'Farid Haddad', email: 'farid.haddad@example.com', label: 'Work' },
    { id: 10, name: 'Greta Lindqvist', email: 'greta.lindqvist@example.com', label: 'Friends' },
    { id: 11, name: 'Hugo Alves', email: 'hugo.alves@example.com', label: 'Work' },
    { id: 12, name: 'Imani Said', email: 'imani.said@example.com', label: 'Family' },
    { id: 13, name: 'Jonas Weber', email: 'jonas.weber@example.com', label: 'Friends' },
    { id: 14, name: 'Kenji Sato', email: 'kenji.sato@example.com', label: 'Work' },
    { id: 15, name: 'Lucia Moreau', email: 'lucia.moreau@example.com', label: 'Family' },
    { id: 16, name: 'Mateo Silva', email: 'mateo.silva@example.com', label: 'Friends' },
    { id: 17, name: 'Nadia Petrova', email: 'nadia.petrova@example.com', label: 'Work' },
    { id: 18, name: 'Omar Haddad', email: 'omar.haddad@example.com', label: 'Family' },
  ]),

  add (contact: Omit<Contact, 'id'>): Contact {
    const made: Contact = { id: next(contacts.all.value.map(c => c.id)), ...contact }

    contacts.all.value.push(made)

    return made
  },
}

// Orders

export const orders = {
  all: ref<Order[]>([
    { id: 4126, customer: 'Ana Ribeiro', placed: '2026-10-26', shown: 'Oct 26', items: 3, total: 182.4, status: 'Processing' },
    { id: 4125, customer: 'Ben Okafor', placed: '2026-10-25', shown: 'Oct 25', items: 1, total: 42, status: 'Processing' },
    { id: 4124, customer: 'Chen Wei', placed: '2026-10-24', shown: 'Oct 24', items: 6, total: 318.75, status: 'Shipped' },
    { id: 4123, customer: 'Dana Petrov', placed: '2026-10-23', shown: 'Oct 23', items: 2, total: 96.2, status: 'Processing' },
    { id: 4122, customer: 'Elif Demir', placed: '2026-10-22', shown: 'Oct 22', items: 4, total: 221.9, status: 'Shipped' },
    { id: 4121, customer: 'Franco Rossi', placed: '2026-10-21', shown: 'Oct 21', items: 8, total: 540, status: 'Shipped' },
    { id: 4120, customer: 'Grace Mbeki', placed: '2026-10-20', shown: 'Oct 20', items: 1, total: 18.5, status: 'Cancelled' },
    { id: 4119, customer: 'Hana Suzuki', placed: '2026-10-19', shown: 'Oct 19', items: 5, total: 264.3, status: 'Shipped' },
    { id: 4118, customer: 'Igor Volkov', placed: '2026-10-18', shown: 'Oct 18', items: 2, total: 77.6, status: 'Delivered' },
    { id: 4117, customer: 'Jade Nguyen', placed: '2026-10-17', shown: 'Oct 17', items: 3, total: 149, status: 'Delivered' },
    { id: 4116, customer: 'Karl Lindqvist', placed: '2026-10-16', shown: 'Oct 16', items: 7, total: 412.85, status: 'Processing' },
    { id: 4115, customer: 'Lena Vogel', placed: '2026-10-15', shown: 'Oct 15', items: 2, total: 88, status: 'Delivered' },
    { id: 4114, customer: 'Marco Silva', placed: '2026-10-14', shown: 'Oct 14', items: 4, total: 203.4, status: 'Delivered' },
    { id: 4113, customer: 'Nadia Haddad', placed: '2026-10-13', shown: 'Oct 13', items: 1, total: 35.25, status: 'Cancelled' },
    { id: 4112, customer: 'Omar Farouk', placed: '2026-10-12', shown: 'Oct 12', items: 6, total: 329.95, status: 'Delivered' },
    { id: 4111, customer: 'Priya Sharma', placed: '2026-10-11', shown: 'Oct 11', items: 3, total: 158.7, status: 'Delivered' },
    { id: 4110, customer: 'Quinn Murphy', placed: '2026-10-10', shown: 'Oct 10', items: 2, total: 64.8, status: 'Shipped' },
    { id: 4109, customer: 'Rosa Alvarez', placed: '2026-10-09', shown: 'Oct 9', items: 5, total: 287.15, status: 'Delivered' },
    { id: 4108, customer: 'Sana Khalid', placed: '2026-10-08', shown: 'Oct 8', items: 1, total: 24.9, status: 'Delivered' },
    { id: 4107, customer: 'Tomas Novak', placed: '2026-10-07', shown: 'Oct 7', items: 4, total: 196.45, status: 'Processing' },
    { id: 4106, customer: 'Uma Patel', placed: '2026-10-06', shown: 'Oct 6', items: 2, total: 102.3, status: 'Delivered' },
    { id: 4105, customer: 'Viktor Eriksen', placed: '2026-10-05', shown: 'Oct 5', items: 8, total: 611.2, status: 'Delivered' },
    { id: 4104, customer: 'Wendy Zhao', placed: '2026-10-04', shown: 'Oct 4', items: 3, total: 134.55, status: 'Cancelled' },
    { id: 4103, customer: 'Yara Aziz', placed: '2026-10-03', shown: 'Oct 3', items: 2, total: 59.95, status: 'Delivered' },
    { id: 4102, customer: 'Zoe Laurent', placed: '2026-10-02', shown: 'Oct 2', items: 5, total: 248.6, status: 'Delivered' },
  ]),

  /** Remove the rows and hand back their slots for the snackbar's Undo. */
  remove (ids: number[]): Slot<Order>[] {
    return pull(orders.all.value, ids)
  },

  /** Put removed rows back in the slots they came out of. */
  restore (rows: Slot<Order>[]) {
    push(orders.all.value, rows)
  },

  /** A new order from the form: takes the next id and the top of the table. */
  add (order: Omit<Order, 'id'>): Order {
    const made: Order = { id: next(orders.all.value.map(o => o.id)), ...order }

    orders.all.value.unshift(made)

    return made
  },
}

// Files

export const files = {
  all: ref<Item[]>([
    { id: 1, name: 'Projects', kind: 'folder', meta: '14 items · Oct 21' },
    { id: 2, name: 'Site assets', kind: 'folder', meta: '48 items · Oct 9' },
    { id: 3, name: 'Receipts', kind: 'folder', meta: '26 items · Sep 30' },
    { id: 4, name: 'Harbour at dawn.png', kind: 'image', meta: '4.1 MB · Oct 18' },
    { id: 5, name: 'Pine ridge.jpg', kind: 'image', meta: '6.8 MB · Oct 14' },
    { id: 6, name: 'Team offsite.jpg', kind: 'image', meta: '3.2 MB · Oct 6' },
    { id: 7, name: 'Launch banner.png', kind: 'image', meta: '2.7 MB · Sep 28' },
    { id: 8, name: 'Quarterly review.doc', kind: 'document', meta: '318 KB · Oct 20' },
    { id: 9, name: 'Release notes.doc', kind: 'document', meta: '96 KB · Oct 11' },
    { id: 10, name: 'Onboarding guide.pdf', kind: 'document', meta: '1.4 MB · Sep 24' },
    { id: 11, name: 'Budget 2027.xls', kind: 'sheet', meta: '242 KB · Oct 17' },
    { id: 12, name: 'Inventory.xls', kind: 'sheet', meta: '187 KB · Oct 3' },
  ]),

  /** Remove the entries and hand back their slots for the snackbar's Undo. */
  remove (ids: number[]): Slot<Item>[] {
    return pull(files.all.value, ids)
  },

  /** Put removed entries back in the slots they came out of. */
  restore (entries: Slot<Item>[]) {
    push(files.all.value, entries)
  },

  /** An uploaded file lands after the folders, where the grid shows newest first. */
  add (file: Omit<Item, 'id'>): Item {
    const made: Item = { id: next(files.all.value.map(f => f.id)), ...file }
    const folders = files.all.value.filter(entry => entry.kind === 'folder').length

    files.all.value.splice(folders, 0, made)

    return made
  },

  rename (id: number, name: string) {
    const entry = files.all.value.find(row => row.id === id)
    if (entry) entry.name = name
  },
}

// Activity

const older: Entry[] = [
  { id: 9, actor: 'Igor Volkov', action: 'Igor Volkov placed order 4118', detail: '2 items · 77.60', time: 'Oct 18', day: 'Earlier', unread: false, starred: false },
  { id: 10, actor: 'Dana Petrov', action: 'Dana Petrov updated their phone number', detail: 'Account details changed', time: 'Oct 16', day: 'Earlier', unread: false, starred: false },
  { id: 11, actor: 'Uma Patel', action: 'Uma Patel placed order 4106', detail: '2 items · 102.30', time: 'Oct 6', day: 'Earlier', unread: false, starred: false },
]

export const activity = {
  all: ref<Entry[]>([
    { id: 1, actor: 'Ana Ribeiro', action: 'Ana Ribeiro placed order 4126', detail: '3 items · 182.40', time: '9:41 AM', day: 'Today', unread: true, starred: false },
    { id: 2, actor: 'Ben Okafor', action: 'Ben Okafor commented on order 4121', detail: '"Can this ship a day earlier?"', time: '8:15 AM', day: 'Today', unread: true, starred: true },
    { id: 3, actor: 'Grace Mbeki', action: 'Grace Mbeki cancelled order 4120', detail: 'Refund issued to the original card', time: '7:02 AM', day: 'Today', unread: true, starred: false },
    { id: 4, actor: 'Chen Wei', action: 'Chen Wei updated the delivery address', detail: 'Order 4124 · now 4 Harbour Lane', time: '4:38 PM', day: 'Yesterday', unread: false, starred: false },
    { id: 5, actor: 'Elif Demir', action: 'Elif Demir paid invoice 221', detail: '221.90 · bank transfer', time: '1:20 PM', day: 'Yesterday', unread: false, starred: true },
    { id: 6, actor: 'Hana Suzuki', action: 'Hana Suzuki asked about gift wrap', detail: '"Is ribbon an option for order 4119?"', time: '10:04 AM', day: 'Yesterday', unread: false, starred: false },
    { id: 7, actor: 'Franco Rossi', action: 'Franco Rossi placed order 4121', detail: '8 items · 540.00', time: 'Oct 21', day: 'Earlier', unread: false, starred: false },
    { id: 8, actor: 'Jade Nguyen', action: 'Jade Nguyen left a 5-star review', detail: '"Fast shipping, beautiful packaging."', time: 'Oct 17', day: 'Earlier', unread: false, starred: false },
  ]),

  /** True once `more()` has pulled the only older page the demo has. */
  exhausted: shallowRef(false),

  star (id: number) {
    const entry = activity.all.value.find(row => row.id === id)
    if (entry) entry.starred = !entry.starred
  },

  read (id: number) {
    const entry = activity.all.value.find(row => row.id === id)
    if (entry) entry.unread = false
  },

  allRead () {
    for (const entry of activity.all.value) entry.unread = false
  },

  /** Append the next (and only) page of the feed. */
  more () {
    if (activity.exhausted.value) return

    activity.all.value.push(...older)
    activity.exhausted.value = true
  },
}

// Todos (overview widgets band)

export const todos = {
  all: ref<Todo[]>([
    { id: 1, text: 'Confirm the venue for the spring offsite', done: false, order: 0 },
    { id: 2, text: 'Reply to Ben about Thursday lunch', done: false, order: 1 },
    { id: 3, text: 'Review the quarterly numbers draft', done: true, order: 2 },
    { id: 4, text: 'Rotate the API keys for staging', done: false, order: 3 },
    { id: 5, text: 'File the October receipts', done: true, order: 4 },
    { id: 6, text: 'Draft the release note outline', done: false, order: 5 },
  ]),

  toggle (id: number) {
    const todo = todos.all.value.find(row => row.id === id)
    if (todo) todo.done = !todo.done
  },

  add (text: string): Todo {
    const made: Todo = { id: next(todos.all.value.map(t => t.id)), text, done: false, order: todos.all.value.length }

    todos.all.value.push(made)

    return made
  },

  remove (id: number): Slot<Todo> | undefined {
    return pull(todos.all.value, [id])[0]
  },

  restore (slot: Slot<Todo>) {
    push(todos.all.value, [slot])
  },

  /** Rewrite the list to the given id order; ids it misses keep their place at the end. */
  reorder (ids: number[]) {
    const rest = todos.all.value.filter(row => !ids.includes(row.id))
    const moved = ids
      .map(id => todos.all.value.find(row => row.id === id))
      .filter((row): row is Todo => !isUndefined(row))

    todos.all.value = [...moved, ...rest]

    for (const [index, row] of todos.all.value.entries()) row.order = index
  },
}

// Photos (gallery)

export type Album = 'Travel' | 'Team' | 'Product'

export const photos = {
  all: ref<Photo[]>([
    { id: 1, title: 'Harbour at dawn', album: 'Travel', taken: 'Oct 18', hue: '#00695C' },
    { id: 2, title: 'Pine ridge', album: 'Travel', taken: 'Oct 14', hue: '#33691E' },
    { id: 3, title: 'Old town stairs', album: 'Travel', taken: 'Oct 9', hue: '#4E342E' },
    { id: 4, title: 'Night market', album: 'Travel', taken: 'Sep 30', hue: '#283593' },
    { id: 5, title: 'Sprint planning', album: 'Team', taken: 'Oct 21', hue: '#00838F' },
    { id: 6, title: 'Offsite hike', album: 'Team', taken: 'Oct 6', hue: '#558B2F' },
    { id: 7, title: 'Launch day', album: 'Team', taken: 'Sep 28', hue: '#6A1B9A' },
    { id: 8, title: 'New badge wall', album: 'Team', taken: 'Sep 24', hue: '#4527A0' },
    { id: 9, title: 'Carton redesign', album: 'Product', taken: 'Oct 17', hue: '#EF6C00' },
    { id: 10, title: 'Label press check', album: 'Product', taken: 'Oct 11', hue: '#C62828' },
    { id: 11, title: 'Shelf mockup', album: 'Product', taken: 'Oct 3', hue: '#AD1457' },
    { id: 12, title: 'Studio lighting test', album: 'Product', taken: 'Sep 22', hue: '#37474F' },
  ]),

  remove (ids: number[]): Slot<Photo>[] {
    return pull(photos.all.value, ids)
  },

  restore (slots: Slot<Photo>[]) {
    push(photos.all.value, slots)
  },

  add (photo: Omit<Photo, 'id'>): Photo {
    const made: Photo = { id: next(photos.all.value.map(p => p.id)), ...photo }

    photos.all.value.unshift(made)

    return made
  },
}

// Assistant (the prompt page's thread; the canned-reply logic lives in the page)

const clock = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' })

function stamp (): string {
  return clock.format(new Date())
}

export const assistant = {
  thread: ref<Turn[]>([
    { id: 1, role: 'user', text: 'Which region grew fastest this month?', at: '9:02 AM' },
    { id: 2, role: 'agent', text: 'Europe: 980 orders, up 12% on September. North America is still the largest at 1,240.', at: '9:02 AM' },
  ]),

  /** The page flips this while the fake agent is typing. */
  busy: shallowRef(false),

  send (text: string): Turn {
    const made: Turn = { id: next(assistant.thread.value.map(t => t.id)), role: 'user', text, at: stamp() }

    assistant.thread.value.push(made)

    return made
  },

  reply (text: string): Turn {
    const made: Turn = { id: next(assistant.thread.value.map(t => t.id)), role: 'agent', text, at: stamp() }

    assistant.thread.value.push(made)

    return made
  },
}

// Profile (the signed-in account; the drawer header and the profile page share
// it). Seed data, not storage: Clear local data never touches the identity.

export const profile = {
  me: ref<Profile>({
    name: 'John Leider',
    email: 'john@vuetifyjs.com',
    role: 'Founder, Vuetify',
    bio: 'Keeps the orders moving and the dashboards honest.',
    location: 'Remote',
    avatar,
  }),

  update (patch: Partial<Profile>) {
    Object.assign(profile.me.value, patch)
  },
}

// Sales (overview table, read-only)

export const sales = {
  all: ref<Region[]>([
    { id: 1, region: 'North America', orders: 1240, revenue: 48_200, share: 38 },
    { id: 2, region: 'Europe', orders: 980, revenue: 39_400, share: 31 },
    { id: 3, region: 'Asia Pacific', orders: 640, revenue: 22_100, share: 17 },
    { id: 4, region: 'South America', orders: 310, revenue: 11_900, share: 9 },
    { id: 5, region: 'Africa', orders: 150, revenue: 6300, share: 5 },
  ]),
}

// Search

export type Hit = {
  /** Unique across every group, for list keys. */
  id: string
  title: string
  detail: string
  /** The page the hit opens. */
  to: string
}

export type Group = {
  label: string
  /** The md1 glyph role the results list draws beside the group. */
  icon: string
  hits: Hit[]
}

const engines = {
  contacts: createFilter<Contact>({ keys: ['name', 'email', 'label'] }),
  orders: createFilter<Order>({ keys: ['id', 'customer', 'status', 'shown'] }),
  files: createFilter<Item>({ keys: ['name', 'kind', 'meta'] }),
  messages: createFilter<Message>({ keys: ['from', 'subject', 'preview'] }),
  activity: createFilter<Entry>({ keys: ['actor', 'action', 'detail'] }),
  todos: createFilter<Todo>({ keys: ['text'] }),
  photos: createFilter<Photo>({ keys: ['title', 'album', 'taken'] }),
}

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

/**
 * Live, grouped search across every domain, on v0's `createFilter`. The result
 * tracks the stores, so a hit always exists on the page its route opens.
 */
export function search (query: MaybeRefOrGetter<string>): ComputedRef<Group[]> {
  const found = {
    contacts: engines.contacts.apply(query, () => contacts.all.value).items,
    orders: engines.orders.apply(query, () => orders.all.value).items,
    files: engines.files.apply(query, () => files.all.value).items,
    messages: engines.messages.apply(query, () => messages.all.value).items,
    activity: engines.activity.apply(query, () => activity.all.value).items,
    todos: engines.todos.apply(query, () => todos.all.value).items,
    photos: engines.photos.apply(query, () => photos.all.value).items,
  }

  return computed(() => {
    if (!String(toValue(query)).trim()) return []

    const groups: Group[] = [
      {
        label: 'Contacts',
        icon: 'person',
        hits: found.contacts.value.map(contact => ({
          id: `contact-${contact.id}`,
          title: contact.name,
          detail: `${contact.email} · ${contact.label}`,
          to: '/md1/contacts',
        })),
      },
      {
        label: 'Orders',
        icon: 'reorder',
        hits: found.orders.value.map(order => ({
          id: `order-${order.id}`,
          title: `Order ${order.id} · ${order.customer}`,
          detail: `${order.shown} · ${money.format(order.total)} · ${order.status}`,
          to: '/md1/orders',
        })),
      },
      {
        label: 'Files',
        icon: 'folder',
        hits: found.files.value.map(file => ({
          id: `file-${file.id}`,
          title: file.name,
          detail: file.meta,
          to: '/md1/files',
        })),
      },
      {
        label: 'Messages',
        icon: 'inbox',
        hits: found.messages.value.map(message => ({
          id: `message-${message.id}`,
          title: message.subject,
          detail: `${message.from} — ${message.preview}`,
          to: '/md1/inbox',
        })),
      },
      {
        label: 'Todos',
        icon: 'check',
        hits: found.todos.value.map(todo => ({
          id: `todo-${todo.id}`,
          title: todo.text,
          detail: todo.done ? 'Done' : 'To do',
          to: '/md1',
        })),
      },
      {
        label: 'Photos',
        icon: 'photo',
        hits: found.photos.value.map(photo => ({
          id: `photo-${photo.id}`,
          title: photo.title,
          detail: `${photo.album} · ${photo.taken}`,
          to: '/md1/gallery',
        })),
      },
      {
        label: 'Activity',
        icon: 'history',
        hits: found.activity.value.map(entry => ({
          id: `entry-${entry.id}`,
          title: entry.action,
          detail: `${entry.time} · ${entry.detail}`,
          to: '/md1/activity',
        })),
      },
    ]

    return groups.filter(group => group.hits.length > 0)
  })
}

// Persisted demo state

/** Every persisted md1-demo:* key with its default, so Clear local data can reset them all. */
const stored: Record<string, unknown> = {
  'md1-demo:dark': false,
  'md1-demo:notifications': true,
  'md1-demo:previews': true,
  'md1-demo:reports': false,
  'md1-demo:searches': [],
  'md1-demo:sound': true,
  'md1-demo:sync': 'Every hour',
  'md1-demo:updates': true,
  'md1-demo:wifi': true,
  'md1-demo:workspace': true,
}

/**
 * Reset every persisted md1-demo:* key to its default through the storage
 * context: its per-key ref cache means the live refs the shell and pages hold
 * (theme, drawer group, search history, the discovery tip) flip with it.
 */
export function resetAll (storage: StorageContext) {
  for (const [key, value] of Object.entries(stored)) {
    storage.get(key, value).value = isArray(value) ? [...value] : value
  }
}
