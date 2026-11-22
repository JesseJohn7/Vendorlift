import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import Landing from './pages/Landing'
import CostCalculator from './pages/CostCalculator'
import { Login, Register, Setup } from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Storefront from './pages/Storefront'
import Checkout from './pages/Checkout'

const rootRoute = createRootRoute({ component: () => <Outlet /> })
const r = <TPath extends string>(path: TPath, component: () => React.JSX.Element) =>
  createRoute({ getParentRoute: () => rootRoute, path, component })

const routeTree = rootRoute.addChildren([
  r('/', Landing),
  r('/tools/cost-calculator', CostCalculator),
  r('/login', Login),
  r('/register', Register),
  r('/setup', Setup),
  r('/dashboard', Dashboard),
  r('/$slug', Storefront),
  r('/$slug/checkout', Checkout),
])

export const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register { router: typeof router }
}