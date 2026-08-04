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
    routes: [
      { path: '/', component: Playground },
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
    registerPlugins(app)

    // Emerald's documented install, browser-only. Three deviations from a plain
    // `createEmeraldPlugin()`, all forced by dev hosting more than one design
    // system:
    // - `IN_BROWSER` — `target` is honoured only on the client. The SSR branch
    //   of V0StyleSheetThemeAdapter.setup pushes `htmlAttrs: { data-theme }`
    //   unconditionally, which stamped `data-theme="emerald"` onto every
    //   prerendered page, non-Emerald routes included. Skipping install during
    //   prerender is the only dev-side fix. Cost: Emerald routes ship no theme
    //   CSS in their static HTML and paint on hydration — which is exactly what
    //   the hand-rolled installer this replaced did.
    // - `namespace` — registerPlugins already claims the default `v0:theme`
    //   for the palette demos, and createPlugin silently skips a duplicate
    //   namespace. Without this, whichever ran second would vanish. The
    //   `namespace:key` shape is required; a bare key trips createContext's
    //   separator warning.
    // - `target: null` — every Emerald route already carries
    //   `data-theme="emerald"` on its own root, so the attribute stays
    //   markup-owned and non-Emerald routes keep the app theme.
    if (IN_BROWSER) {
      app.use(createEmeraldPlugin({ theme: { namespace: 'emerald:theme', target: null } }))
    }
  })
