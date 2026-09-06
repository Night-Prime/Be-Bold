# Be Bold — Cosmetics E-commerce Platforms

Faith-inspired cosmetics (lip glosses, liners, skincare) built with **less code + polymorphism**.

## Stack
- **Backend** `api/` Node.js + Express + Postgres + Redis (cache) + JWT
- **Storefront** `client/` React + Tailwind + Framer Motion (`:3000`)
- **Admin** `admin/` React (`:3001`)

## Polymorphism Idea
`BaseModel(table)` and `BaseController(model, cacheKey)` give CRUD for any table.  
`new BaseModel('products')` + `new BaseController(model,'products')` → products & categories share 100% logic.  
Frontend `Resource(path)` does the same: `new Resource('/products')`.

## Quick Start
```bash
docker compose up -d          # postgres + redis
cd api && npm install && npm run migrate && npm run seed && npm run dev  # :5000
cd client && npm install && npm start       # :3000
cd admin && npm install && npm start        # :3001
```
Or without docker, ensure Postgres+Redis running locally.

## Env
`api/.env` → `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET` (see `.env.example`)
`client/.env` & `admin/.env` → `REACT_APP_API_URL=http://localhost:5000/api`

## Seed Accounts
- admin `admin@bebold.com / admin123`
- user `user@test.com / password123`

## API
```
POST /api/auth/register, /login, GET /me
GET/POST /api/products , GET/:id, PUT/:id, DELETE/:id (admin)
GET/POST /api/categories (same)
GET/POST/PUT/DELETE /api/cart (auth)
POST /api/orders , GET /my, GET /, GET/:id, PUT/:id/status (admin)
GET /api/search?q=
GET /health
```
Redis caches `products:all` & `categories:all` 60s; invalidated on write.

## Flows
Customer: Register → Browse → Add cart (local or server) → Checkout → Order.
Admin: Login → Dashboard → Products/Categories CRUD (price, stock, image) → Orders status.

## Project Structure
```
api/src/{config,models,controllers,routes,middleware}
client/src/{api,context,pages,components}
admin/src/{api,pages}
```
