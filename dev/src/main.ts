import { createEmeraldPlugin } from '@paper/emerald'
import { ViteSSG } from 'vite-ssg'

// Framework
// Globals
import { IN_BROWSER } from '@vuetify/v0'

// Context
import AdminAnalytics from './admin/AdminAnalytics.vue'
import AdminCalendar from './admin/AdminCalendar.vue'
import AdminCampaign from './admin/AdminCampaign.vue'
import AdminChat from './admin/AdminChat.vue'
import AdminContact from './admin/AdminContact.vue'
import AdminDatatable from './admin/AdminDatatable.vue'
import AdminEcommerce from './admin/AdminEcommerce.vue'
import AdminFaq from './admin/AdminFaq.vue'
import AdminFinance from './admin/AdminFinance.vue'
import AdminForms from './admin/AdminForms.vue'
import AdminKanban from './admin/AdminKanban.vue'
import AdminLogistics from './admin/AdminLogistics.vue'
import AdminMail from './admin/AdminMail.vue'
import AdminOrders from './admin/AdminOrders.vue'
import AdminPayments from './admin/AdminPayments.vue'
import AdminPricing from './admin/AdminPricing.vue'
import AdminProductivity from './admin/AdminProductivity.vue'
import AdminSales from './admin/AdminSales.vue'
import App from './App.vue'
import CreateOverflowDemo from './CreateOverflowDemo.vue'
import EmeraldAbout from './EmeraldAbout.vue'
import EmeraldContact from './EmeraldContact.vue'
import EmeraldDashboard from './EmeraldDashboard.vue'
import EmeraldFaqs from './EmeraldFaqs.vue'
import EmeraldFeatures from './EmeraldFeatures.vue'
import EmeraldKitchenSink from './EmeraldKitchenSink.vue'
import EmeraldModals from './EmeraldModals.vue'
import EmeraldPricing from './EmeraldPricing.vue'
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
      { path: '/emerald/admin/sales', component: AdminSales },
      { path: '/emerald/admin/finance', component: AdminFinance },
      { path: '/emerald/admin/logistics', component: AdminLogistics },
      { path: '/emerald/admin/productivity', component: AdminProductivity },
      { path: '/emerald/admin/campaign', component: AdminCampaign },
      { path: '/emerald/admin/analytics', component: AdminAnalytics },
      { path: '/emerald/admin/payments', component: AdminPayments },
      { path: '/emerald/admin/ecommerce', component: AdminEcommerce },
      { path: '/emerald/admin/orders', component: AdminOrders },
      { path: '/emerald/admin/mail', component: AdminMail },
      { path: '/emerald/admin/chat', component: AdminChat },
      { path: '/emerald/admin/kanban', component: AdminKanban },
      { path: '/emerald/admin/calendar', component: AdminCalendar },
      { path: '/emerald/admin/contact', component: AdminContact },
      { path: '/emerald/admin/datatable', component: AdminDatatable },
      { path: '/emerald/admin/forms', component: AdminForms },
      { path: '/emerald/admin/faq', component: AdminFaq },
      { path: '/emerald/admin/pricing', component: AdminPricing },
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
