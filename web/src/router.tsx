import { createRootRoute, createRoute, createRouter, Outlet, Link } from '@tanstack/react-router'
import CostCalculator from './pages/CostCalculator'

const rootRoute = createRootRoute({ component: () => <Outlet /> })

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-950 text-white p-6">
      <h1 className="text-3xl font-bold">VendorLift Shops</h1>
      <Link to="/tools/cost-calculator" className="rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950">
        Try the Cost Calculator
      </Link>
    </div>
  ),
})

const calcRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tools/cost-calculator',
  component: CostCalculator,
})

// Placeholder: we'll build the real register page in Phase 2
const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: () => <div className="p-6">Register page (coming in Phase 2)</div>,
})

// Placeholder: storefront. Static routes rank above this, so reserved paths are safe
const shopRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/$slug',
  component: () => <div className="p-6">Storefront (coming in Phase 3)</div>,
})

const routeTree = rootRoute.addChildren([homeRoute, calcRoute, registerRoute, shopRoute])
export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}