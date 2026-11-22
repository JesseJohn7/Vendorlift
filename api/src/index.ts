import { Hono } from 'hono'

type Env = { Bindings: { DB: D1Database; BUCKET: R2Bucket; JWT_SECRET: string } }

const app = new Hono<Env>()

app.get('/api/health', (c) => c.json({ ok: true, app: 'vendorlift-api' }))

export default app