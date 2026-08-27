# MountRoof Admin (Phase 0)

React + Vite admin panel for MountRoof.

## Setup

```bash
cd admin
npm install
npm run dev
```

Admin UI: http://localhost:5174

Vite proxies `/api` → `http://localhost:4000` (API must be running).

## Login

After seeding the API (`cd server && npm run seed`):

- Email: `admin@mountroof.com`
- Password: `Admin@12345`

## Phase 0

- Login page
- JWT session in `localStorage`
- Auth guard (redirect to `/login`)
- Dashboard shell with placeholder stats
- Sidebar links for Products / Blogs / Enquiries / Settings (coming soon)
