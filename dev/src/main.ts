import { createEmeraldPlugin } from '@paper/emerald'
import { createMd1Plugin } from '@paper/md1'
import { ViteSSG } from 'vite-ssg'

// Framework
// Globals
import { IN_BROWSER } from '@vuetify/v0'

// Context
import App from './App.vue'
import CreateOverflowDemo from './CreateOverflowDemo.vue'
import EmeraldAbout from './EmeraldAbout.vue'
import EmeraldAnalytics from './EmeraldAnalytics.vue'
import EmeraldCalendar from './EmeraldCalendar.vue'
import EmeraldCampaign from './EmeraldCampaign.vue'
import EmeraldChat from './EmeraldChat.vue'
import EmeraldContact from './EmeraldContact.vue'
import EmeraldContacts from './EmeraldContacts.vue'
import EmeraldDashboard from './EmeraldDashboard.vue'
import EmeraldDatatable from './EmeraldDatatable.vue'
import EmeraldEcommerce from './EmeraldEcommerce.vue'
import EmeraldFaqs from './EmeraldFaqs.vue'
import EmeraldFeatures from './EmeraldFeatures.vue'
import EmeraldFinance from './EmeraldFinance.vue'
import EmeraldForms from './EmeraldForms.vue'
import EmeraldKanban from './EmeraldKanban.vue'
import EmeraldKitchenSink from './EmeraldKitchenSink.vue'
import EmeraldLogistics from './EmeraldLogistics.vue'
import EmeraldMail from './EmeraldMail.vue'
import EmeraldModals from './EmeraldModals.vue'
import EmeraldOrders from './EmeraldOrders.vue'
import EmeraldPayments from './EmeraldPayments.vue'
import EmeraldPricing from './EmeraldPricing.vue'
import EmeraldProductivity from './EmeraldProductivity.vue'
import EmeraldSales from './EmeraldSales.vue'
import EmeraldSettings from './EmeraldSettings.vue'
import EmeraldSignIn from './EmeraldSignIn.vue'
import Playground from './Playground.vue'

import 'virtual:uno.css'

import { registerPlugins } from './plugins'

export const createApp = ViteSSG(
  App,
  {
    // Vite asset URLs honor `base` from vite.config; Vue Router does not unless
    // we pass it here. Without this, DEMO_BASE=/demo/emerald/ prerenders
    // RouterLink hrefs as /emerald/... and lychee fails offline file checks.
    base: import.meta.env.BASE_URL,
    routes: [
      // Demo deploy (`BASE_URL=/demo/emerald/`) serves the dashboard at `/`.
      { path: '/', component: import.meta.env.BASE_URL.includes('/demo/') ? EmeraldDashboard : Playground },
      { path: '/create-overflow', component: CreateOverflowDemo },
      { path: '/emerald', component: EmeraldDashboard },
      { path: '/emerald/about', component: EmeraldAbout },
      { path: '/emerald/contact', component: EmeraldContact },
      { path: '/emerald/sign-in', component: EmeraldSignIn },
      { path: '/emerald/faqs', component: EmeraldFaqs },
      { path: '/emerald/features', component: EmeraldFeatures },
      { path: '/emerald/settings', component: EmeraldSettings },
      { path: '/emerald/pricing', component: EmeraldPricing },
      { path: '/emerald/modals', component: EmeraldModals },
      { path: '/emerald/sink', component: EmeraldKitchenSink },
      { path: '/emerald/sales', component: EmeraldSales },
      { path: '/emerald/finance', component: EmeraldFinance },
      { path: '/emerald/logistics', component: EmeraldLogistics },
      { path: '/emerald/productivity', component: EmeraldProductivity },
      { path: '/emerald/campaign', component: EmeraldCampaign },
      { path: '/emerald/analytics', component: EmeraldAnalytics },
      { path: '/emerald/payments', component: EmeraldPayments },
      { path: '/emerald/ecommerce', component: EmeraldEcommerce },
      { path: '/emerald/orders', component: EmeraldOrders },
      { path: '/emerald/mail', component: EmeraldMail },
      { path: '/emerald/chat', component: EmeraldChat },
      { path: '/emerald/kanban', component: EmeraldKanban },
      { path: '/emerald/calendar', component: EmeraldCalendar },
      { path: '/emerald/contacts', component: EmeraldContacts },
      { path: '/emerald/datatable', component: EmeraldDatatable },
      { path: '/emerald/forms', component: EmeraldForms },
      // The md1 dashboard exists only outside the Emerald demo deploy: the demo
      // never installs createMd1Plugin, so prerendering these would publish an
      // unthemed dashboard under /demo/emerald/. A compile-time boolean, not a
      // BASE_URL test, so the demo build also drops the chunks.
      ...(!__MD1__
        ? []
        : [
        // Nested so the shell mounts once and only the page swaps on navigation.
        {
          path: '/md1',
          component: () => import('./Md1Shell.vue'),
          children: [
            { path: '', component: () => import('./Md1Dashboard.vue'), meta: { title: 'Overview' } },
            { path: 'activity', component: () => import('./Md1Activity.vue'), meta: { title: 'Activity' } },
            { path: 'assistant', component: () => import('./Md1Assistant.vue'), meta: { title: 'Assistant' } },
            { path: 'contacts', component: () => import('./Md1Contacts.vue'), meta: { title: 'Contacts' } },
            { path: 'files', component: () => import('./Md1Files.vue'), meta: { title: 'Files' } },
            { path: 'gallery', component: () => import('./Md1Gallery.vue'), meta: { title: 'Gallery' } },
            { path: 'help', component: () => import('./Md1Help.vue'), meta: { title: 'Help & feedback' } },
            { path: 'inbox', component: () => import('./Md1Inbox.vue'), meta: { title: 'Inbox' } },
            { path: 'orders', component: () => import('./Md1Orders.vue'), meta: { title: 'Orders' } },
            { path: 'orders/new', component: () => import('./Md1OrderForm.vue'), meta: { title: 'New order' } },
            { path: 'profile', component: () => import('./Md1Profile.vue'), meta: { title: 'Profile' } },
            { path: 'search', component: () => import('./Md1Search.vue'), meta: { title: 'Search' } },
            { path: 'settings', component: () => import('./Md1Settings.vue'), meta: { title: 'Settings' } },
            // Last, after every real child: anything else under /md1 is the 404.
            { path: ':catchall(.*)', component: () => import('./Md1NotFound.vue'), meta: { title: 'Not found' } },
          ],
        },
        // Siblings of the layout record: the auth pages render without the shell.
        { path: '/md1/forgot', component: () => import('./Md1Forgot.vue') },
        { path: '/md1/setup', component: () => import('./Md1Setup.vue') },
        { path: '/md1/sign-in', component: () => import('./Md1SignIn.vue') },
        { path: '/md1/sign-up', component: () => import('./Md1SignUp.vue') },
        ]),
    ],
    // The persistent md1 shell swaps pages in place, so the window offset no
    // longer resets itself; everything else keeps the router's default.
    scrollBehavior (to, _from, saved) {
      if (!to.path.startsWith('/md1')) return
      return saved || { top: 0 }
    },
  },
  async ({ app }) => {
    const demo = import.meta.env.BASE_URL.includes('/demo/')

    registerPlugins(app, { playgroundTheme: !demo })

    // Demo deploy is Emerald-only — documented install, html owns the theme.
    // Local `dev` still hosts the playground palettes on `v0:theme`, so Emerald
    // takes a side namespace and leaves `data-theme` to each product root.
    if (demo) {
      app.use(
        createEmeraldPlugin({
          theme: { devtools: true },
          icons: { devtools: true },
        }),
      )
      return
    }

    // Browser-only: the SSR branch of V0StyleSheetThemeAdapter.setup pushes
    // `htmlAttrs: { data-theme }` unconditionally, which would stamp
    // `data-theme="emerald-light"` onto every prerendered playground page.
    if (IN_BROWSER) {
      app.use(
        createEmeraldPlugin({
          theme: { namespace: 'emerald:theme', target: null, devtools: true },
          icons: { devtools: true },
        }),
      )

      // Same side-namespace arrangement as Emerald above: the playground owns
      // `v0:theme` and `data-theme` stays with the md1 shell's own root.
      app.use(
        createMd1Plugin({
          theme: { namespace: 'md1:theme', target: null, devtools: true },
          icons: {
            devtools: true,
            icons: {
              // Material Icons image/invert_colors, filled, 24px (Apache
              // License 2.0) — the md1 set has no theme-toggle glyph.
              'invert-colors': ['M17.66 7.93L12 2.27 6.34 7.93c-3.12 3.12-3.12 8.19 0 11.31C7.9 20.8 9.95 21.58 12 21.58c2.05 0 4.1-.78 5.66-2.34 3.12-3.12 3.12-8.19 0-11.31zM12 19.59c-1.6 0-3.11-.62-4.24-1.76C6.62 16.69 6 15.19 6 13.59s.62-3.11 1.76-4.24L12 5.1v14.49z'],
            },
          },
        }),
      )
    }
  })
