# MountRoof API (Phase 0)

Node.js + Express + MongoDB backend for the MountRoof admin and public website.

## Setup

```bash
cd server
cp .env.example .env   # if needed — .env already exists for local dev
npm install
```

### MongoDB (Docker)

```bash
docker run -d --name mountroof-mongo -p 27017:27017 mongo:7
```

### Seed admin user

```bash
npm run seed
```

Default credentials (from `.env`):

- Email: `admin@mountroof.com`
- Password: `Admin@12345`

### Run API

```bash
npm run dev
```

API: http://localhost:4000

### Smoke test auth

With the server running:

```bash
npm run test:auth
```

## Env vars

See `.env.example` for `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`, `ADMIN_URL`, etc.

## Phase 0 endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/login` | No | Admin login → JWT |
| GET | `/api/auth/me` | Bearer | Current user |
| POST | `/api/auth/logout` | Bearer | Client-side logout ack |
| GET | `/api/admin/dashboard` | Bearer | Dashboard stats |

## Phase 1 endpoints (Products)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/products` | No | Published products |
| GET | `/api/products/:slug` | No | Published product by slug |
| GET | `/api/admin/products` | Bearer | All products (filter `?status=&q=`) |
| GET | `/api/admin/products/:id` | Bearer | Product by id |
| POST | `/api/admin/products` | Bearer | Create product |
| PUT | `/api/admin/products/:id` | Bearer | Update product |
| DELETE | `/api/admin/products/:id` | Bearer | Delete product |

### Seed products

```bash
npm run seed
npm run test:products
```

## Phase 2 endpoints (Blogs)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/blogs` | No | Published blogs |
| GET | `/api/blogs/:slug` | No | Published blog by slug |
| GET | `/api/admin/blogs` | Bearer | All blogs (`?status=&q=`) |
| GET | `/api/admin/blogs/:id` | Bearer | Blog by id |
| POST | `/api/admin/blogs` | Bearer | Create blog |
| PUT | `/api/admin/blogs/:id` | Bearer | Update blog |
| DELETE | `/api/admin/blogs/:id` | Bearer | Delete blog |

```bash
npm run seed
npm run test:blogs
```
