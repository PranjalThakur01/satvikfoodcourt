import "dotenv/config";
import express from "express";
import cors from "cors";
import pg from "pg";

const { Pool } = pg;
const app = express();
const port = Number(process.env.API_PORT ?? 4000);
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

app.use(cors({ origin: process.env.WEB_ORIGIN ?? "http://localhost:3000" }));
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", async (_req, res) => {
  try { await pool.query("SELECT 1"); res.json({ status: "ok", database: "connected" }); }
  catch { res.status(503).json({ status: "degraded", database: "unavailable" }); }
});

app.get("/api/menu/categories", async (_req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.slug, c.name, COUNT(i.id)::int AS item_count
       FROM menu_categories c LEFT JOIN menu_items i ON i.category_id = c.id AND i.available = TRUE
       JOIN restaurants r ON r.id = c.restaurant_id
       WHERE r.name = 'Satvik Food Court' GROUP BY c.id ORDER BY c.sort_order`
    );
    res.json(result.rows);
  } catch { res.status(503).json({ error: "Menu is temporarily unavailable." }); }
});

app.get("/api/menu", async (req, res) => {
  const category = typeof req.query.category === "string" ? req.query.category.trim() : "";
  try {
    const result = await pool.query(
      `SELECT i.id, i.name, c.name AS category, i.description, i.price, i.tags, i.vegetarian
       FROM menu_items i JOIN menu_categories c ON c.id = i.category_id
       JOIN restaurants r ON r.id = i.restaurant_id
       WHERE r.name = 'Satvik Food Court' AND i.available = TRUE
       AND ($1 = '' OR c.slug = $1 OR LOWER(c.name) = LOWER($1))
       ORDER BY c.sort_order, i.name`, [category]
    );
    res.json(result.rows);
  } catch { res.status(503).json({ error: "Menu is temporarily unavailable." }); }
});

type OrderLine = { itemId: string; quantity: number; preparation?: string };
app.post("/api/orders", async (req, res) => {
  const { customerName, phone, fulfillment, notes = "", items } = req.body ?? {};
  if (typeof customerName !== "string" || !customerName.trim() || typeof phone !== "string" || !phone.trim() ||
      !["dine-in", "takeaway", "delivery"].includes(fulfillment) || !Array.isArray(items) || items.length === 0 ||
      items.some((item: OrderLine) => typeof item?.itemId !== "string" || !Number.isInteger(item?.quantity) || item.quantity < 1 || item.quantity > 20 || (item.preparation !== undefined && !["Steam", "Fry", "Pan Fry"].includes(item.preparation)))) {
    return res.status(400).json({ error: "Provide a name, phone, fulfillment option, and valid order items." });
  }

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const restaurant = await client.query("SELECT id FROM restaurants WHERE name = $1 LIMIT 1", ["Satvik Food Court"]);
    if (!restaurant.rowCount) throw new Error("Restaurant is not seeded.");
    const unique = new Map<string, { itemId: string; preparation: string; quantity: number }>();
    for (const item of items as OrderLine[]) {
      const preparation = item.preparation ?? "";
      const key = `${item.itemId}|${preparation}`;
      const current = unique.get(key);
      unique.set(key, { itemId: item.itemId, preparation, quantity: (current?.quantity ?? 0) + item.quantity });
    }
    const ids = [...new Set([...unique.values()].map(line => line.itemId))];
    const menu = await client.query("SELECT i.id, i.price, c.slug AS category_slug FROM menu_items i JOIN menu_categories c ON c.id = i.category_id WHERE i.id = ANY($1) AND i.available = TRUE", [ids]);
    if (menu.rowCount !== ids.length) { await client.query("ROLLBACK"); return res.status(400).json({ error: "One or more menu items are unavailable." }); }
    const prices = new Map(menu.rows.map((row) => [row.id, Number(row.price)]));
    const momoIds = new Set(menu.rows.filter(row => row.category_slug === "momos").map(row => row.id));
    if ([...unique.values()].some(line => line.preparation && !momoIds.has(line.itemId))) {
      await client.query("ROLLBACK"); return res.status(400).json({ error: "Preparation options are only available for momos." });
    }
    const total = [...unique.values()].reduce((sum, line) => sum + (prices.get(line.itemId) ?? 0) * line.quantity, 0);
    const order = await client.query(
      `INSERT INTO orders (restaurant_id, customer_name, phone, fulfillment, notes, total)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING id, status, total, created_at`,
      [restaurant.rows[0].id, customerName.trim(), phone.trim(), fulfillment, String(notes).slice(0, 500), total]
    );
    for (const line of unique.values()) await client.query(
      "INSERT INTO order_items (order_id, menu_item_id, quantity, unit_price, preparation) VALUES ($1,$2,$3,$4,$5)",
      [order.rows[0].id, line.itemId, line.quantity, prices.get(line.itemId), line.preparation]
    );
    await client.query("COMMIT");
    return res.status(201).json(order.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Order placement failed", error);
    return res.status(503).json({ error: "We could not place the order. Please try again." });
  } finally { client.release(); }
});

app.listen(port, () => console.log(`Satvik API listening on :${port}`));
