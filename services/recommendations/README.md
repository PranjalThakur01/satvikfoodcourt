# Menu recommendations

Run from this directory with `uvicorn main:app --reload --port 8001`. Set `DATABASE_URL` to use the PostgreSQL menu; the service returns a small curated list if the database is unavailable. `POST /recommendations` accepts `{"preferences":["spicy","sweet"]}` and returns up to three items.
