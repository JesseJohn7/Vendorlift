export const RESERVED_SLUGS = [
  'login', 'register', 'setup', 'dashboard', 'tools', 'api', 'assets',
  'admin', 'settings', 'help', 'billing', 'app',
]

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)

export const isValidSlug = (s: string) =>
  /^[a-z0-9][a-z0-9-]{1,38}[a-z0-9]$/.test(s) && !RESERVED_SLUGS.includes(s)