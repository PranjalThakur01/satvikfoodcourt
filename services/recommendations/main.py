"""Preference-based menu recommendations for Satvik Food Court."""
import os
import re
from typing import List

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Satvik Menu Recommendations", version="1.0.0")


class PreferenceRequest(BaseModel):
    preferences: List[str] = Field(min_length=1, max_length=8, examples=[["spicy", "beverage"]])


FALLBACK = [
    {"id": "sizzler-peri", "name": "Peri Peri Paneer Sizzler", "category": "Sizzlers", "price": 379, "tags": ["spicy", "paneer", "signature"]},
    {"id": "waffle-ferraro", "name": "Ferraro Bomb", "category": "Waffles", "price": 249, "tags": ["sweet", "chocolate"]},
    {"id": "drink-mango-tea", "name": "Mango Fruit Tea", "category": "Drinks & Bubble Tea", "price": 149, "tags": ["beverage", "sweet", "fruit tea"]},
    {"id": "chilli-paneer", "name": "Chilli Paneer", "category": "Soups & Mains", "price": 229, "tags": ["spicy", "paneer"]},
    {"id": "drink-cold-coffee", "name": "Cold Coffee", "category": "Drinks & Bubble Tea", "price": 149, "tags": ["beverage", "coffee"]},
]


@app.get("/health")
def health():
    return {"status": "ok", "service": "recommendations"}


@app.post("/recommendations")
def recommend(request: PreferenceRequest):
    preferences = [re.sub(r"[^a-z0-9 -]", "", p.lower()).strip() for p in request.preferences]
    if any(not p for p in preferences):
        raise HTTPException(status_code=400, detail="Preferences must contain words.")

    rows = []
    database_url = os.getenv("DATABASE_URL")
    if database_url:
        try:
            import psycopg
            from psycopg.rows import dict_row
            with psycopg.connect(database_url, row_factory=dict_row, connect_timeout=3) as conn:
                rows = conn.execute(
                    """SELECT i.id, i.name, c.name AS category, i.price, i.tags
                       FROM menu_items i JOIN menu_categories c ON c.id = i.category_id
                       JOIN restaurants r ON r.id = i.restaurant_id
                       WHERE r.name = 'Satvik Food Court' AND i.available = TRUE"""
                ).fetchall()
        except Exception:
            # Keep recommendations available during a database outage.
            rows = []
    if not rows:
        rows = FALLBACK

    def score(item):
        haystack = " ".join([item["name"], item["category"], *item["tags"]]).lower()
        return sum(2 if pref in item["tags"] else 1 if pref in haystack else 0 for pref in preferences)

    ranked = sorted(rows, key=lambda item: (score(item), item["name"]), reverse=True)
    return {"recommendations": [{**item, "price": int(item["price"])} for item in ranked[:3]]}
