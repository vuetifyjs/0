import { createEmeraldPlugin } from '@paper/emerald'
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
    ],
  },
  async ({ app }) => {
    const demo = import.meta.env.BASE_URL.includes('/demo/')

    registerPlugins(app, { playgroundTheme: !demo })

    // Demo deploy is Emerald-only — documented install, html owns the theme.
    // Local `dev` still hosts the playground palettes on `v0:theme`, so Emerald
    // takes a side namespace and leaves `data-theme` to each product root.
    if (demo) {
      app.use(createEmeraldPlugin({
        theme: { devtools: true },
        icons: { devtools: true },
      }))
      return
    }

    // Browser-only: the SSR branch of V0StyleSheetThemeAdapter.setup pushes
    // `htmlAttrs: { data-theme }` unconditionally, which would stamp
    // `data-theme="emerald-light"` onto every prerendered playground page.
    if (IN_BROWSER) {
      app.use(createEmeraldPlugin({
        theme: { namespace: 'emerald:theme', target: null, devtools: true },
        icons: { devtools: true },
      }))
    }
  })
