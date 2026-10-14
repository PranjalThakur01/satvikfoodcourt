# Satvik Food Court

A responsive Next.js App Router website for Satvik Food Court, with an interactive Three.js hero, animated page transitions, a categorized menu and order bag, an Express/PostgreSQL API, and a FastAPI recommendation service.

## Run locally

Requirements: Node.js 18+, PostgreSQL 14+, and Python 3.10+ for the recommendation service.

1. Install Node dependencies with `npm install`.
2. Create a PostgreSQL database, then apply `database/schema.sql` followed by `database/seed.sql`.
3. Copy `.env.example` to `.env` and set `DATABASE_URL` to your database connection string.
4. In separate terminals run `npm run api` and `npm run dev`.
5. Optional recommendations: `cd services/recommendations`, install `requirements.txt`, then run `uvicorn main:app --reload --port 8001` with the same `DATABASE_URL`.

The menu page starts with the bundled menu data and replaces it with live API data when the API is available. Order placement requires the API and seeded database. The recommendation service keeps a small fallback menu available during database outages.

## Deploy to GitHub Pages

The `main` branch is configured to publish a static export to GitHub Pages using `.github/workflows/deploy.yml`. In the repository, open **Settings → Pages** and set the build source to **GitHub Actions**. After the workflow completes, the site will be available at `https://pranjalthakur01.github.io/satvikfoodcourt/`.

GitHub Pages only hosts static files. The menu is bundled with the site, but online order submission and live database-backed menu updates require deploying the Express/PostgreSQL API separately. Once hosted, add a repository Actions variable named `NEXT_PUBLIC_API_URL` with the public API URL; the Pages workflow will use it during builds.

## Endpoints

- `GET /api/health`
- `GET /api/menu` and `GET /api/menu?category=pizzas`
- `GET /api/menu/categories`
- `POST /api/orders` with customer details, fulfillment choice, and menu item IDs/quantities
- `POST http://localhost:8001/recommendations` with `{"preferences":["spicy","beverage"]}`

Menu prices are sample INR values and are marked as indicative in the UI. Confirm restaurant pricing before accepting real orders.
