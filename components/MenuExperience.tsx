"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Minus, Plus, Search, ShoppingBag, X } from "lucide-react";
import { categories, menuItems as localMenu, type MenuItem } from "@/data/menu";

const slugs = ["momos", "soups-mains", "sizzlers", "pizzas", "pasta-breads", "waffles", "street-food", "chaat-north-indian", "drinks-bubble-tea"];
const emojiByCategory: Record<string, string> = { "Momos": "🥟", "Soups & Mains": "🍜", "Sizzlers": "🔥", "Pizzas": "🍕", "Pasta & Breads": "🍝", "Waffles": "🧇", "Street Food": "🥪", "Chaat & North Indian": "🥘", "Drinks & Bubble Tea": "🧋" };
const accentByCategory: Record<string, string> = { "Momos": "rose", "Soups & Mains": "sage", "Sizzlers": "orange", "Pizzas": "tomato", "Pasta & Breads": "yellow", "Waffles": "pink", "Street Food": "green", "Chaat & North Indian": "purple", "Drinks & Bubble Tea": "blue" };
type CartLine = { item: MenuItem; quantity: number; preparation: string };
const apiBase = process.env.NEXT_PUBLIC_API_URL ?? (process.env.NODE_ENV === "development" ? "http://localhost:4000/api" : "");

export function MenuExperience() {
  const [active, setActive] = useState(categories[0]);
  const [items, setItems] = useState(localMenu);
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [preparations, setPreparations] = useState<Record<string, string>>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [orderState, setOrderState] = useState<"idle" | "sending" | "done">("idle");

  useEffect(() => {
    if (apiBase) {
      fetch(`${apiBase}/menu`).then(r => r.ok ? r.json() : null).then((rows: MenuItem[] | null) => {
        if (Array.isArray(rows) && rows.length) setItems(rows);
      }).catch(() => undefined);
    }
    const hash = window.location.hash.replace("#", "");
    const idx = slugs.indexOf(hash);
    if (idx >= 0) { setActive(categories[idx]); window.setTimeout(() => document.getElementById(hash)?.scrollIntoView({ block: "nearest", inline: "center" }), 0); }
  }, []);

  const shown = useMemo(() => items.filter(item => item.category === active && (!query || `${item.name} ${item.description} ${item.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()))), [items, active, query]);
  const quantity = cart.reduce((sum, line) => sum + line.quantity, 0);
  const total = cart.reduce((sum, line) => sum + line.item.price * line.quantity, 0);
  const add = (item: MenuItem) => setCart(existing => {
    const preparation = item.category === "Momos" && ["momo-veggie", "momo-paneer", "momo-corn"].includes(item.id) ? (preparations[item.id] ?? "Steam") : "";
    const found = existing.find(line => line.item.id === item.id && line.preparation === preparation);
    return found ? existing.map(line => line.item.id === item.id && line.preparation === preparation ? { ...line, quantity: line.quantity + 1 } : line) : [...existing, { item, quantity: 1, preparation }];
  });
  const updateQty = (id: string, preparation: string, delta: number) => setCart(existing => existing.map(line => line.item.id === id && line.preparation === preparation ? { ...line, quantity: line.quantity + delta } : line).filter(line => line.quantity > 0));
  const money = (price: number) => `₹${price.toLocaleString("en-IN")}`;

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!apiBase) { setMessage("Online ordering is not available on this site yet. Please call us at 080919 52445."); return; }
    setOrderState("sending"); setMessage("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch(`${apiBase}/orders`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customerName: form.get("name"), phone: form.get("phone"), fulfillment: form.get("fulfillment"), notes: form.get("notes"), items: cart.map(({ item, quantity, preparation }) => ({ itemId: item.id, quantity, preparation })) }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Please try again.");
      setOrderState("done"); setCart([]); setMessage(`Order placed. Your reference is ${String(data.id).slice(0, 8)}.`);
    } catch (error) {
      setOrderState("idle"); setMessage(error instanceof Error ? error.message : "Order service is not available right now. Please call us at 080919 52445.");
    }
  }

  return <div className="menu-experience">
    <div className="menu-toolbar"><div className="menu-tabs" role="tablist" aria-label="Menu categories">{categories.map((category, i)=><button key={category} id={slugs[i]} role="tab" aria-selected={active === category} className={active === category ? "menu-tab active" : "menu-tab"} onClick={()=>{setActive(category); history.replaceState(null,"",`#${slugs[i]}`);}}>{category === "Drinks & Bubble Tea" ? "Bubble tea" : category === "Chaat & North Indian" ? "Chaat" : category}</button>)}</div><label className="menu-search"><Search size={16} /><input aria-label="Search the menu" value={query} onChange={event=>setQuery(event.target.value)} placeholder="Find your favourite" /></label></div>
    <div className="menu-section-heading"><div><span className="eyebrow"><i /> A menu with something for everyone</span><h2>{active}<em>.</em></h2>{active === "Pizzas" && <p className="menu-option-note">Choose your style: Simple Veg · Veg Treat · Veg Special · Chhotu · Neapolitan</p>}{active === "Momos" && <p className="menu-option-note">Choose steamed, fried or pan-fried momos. Combos come with fried rice or noodles.</p>}</div><span className="menu-count">{shown.length} delicious things</span></div>
    {shown.length ? <motion.div className="menu-grid" layout>{shown.map((item,index)=><motion.article key={item.id} className={`menu-card ${accentByCategory[item.category] ?? "sage"}`} layout initial={{ opacity: 0, y: 16, rotateX: -3 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: .35, delay: Math.min(index * .035, .28) }} whileHover={{ y: -5, rotateX: 2, scale: 1.012 }}>
      <div className="menu-card-art"><span className="food-emoji" aria-hidden="true">{emojiByCategory[item.category] ?? "🍽️"}</span><span className="veg-mark" title="Vegetarian"><i /></span>{item.badge && <span className="food-badge">{item.badge}</span>}<span className="dish-orbit">✳</span></div>
      <div className="menu-card-body"><div className="menu-card-title"><h3>{item.name}</h3><span>{money(item.price)}</span></div><p>{item.description}</p>{item.category === "Momos" && ["momo-veggie", "momo-paneer", "momo-corn"].includes(item.id) && <label className="prep-choice">Preparation<select value={preparations[item.id] ?? "Steam"} onChange={event=>setPreparations(current=>({...current,[item.id]:event.target.value}))}><option>Steam</option><option>Fry</option><option>Pan Fry</option></select></label>}<div className="menu-card-bottom"><span className="item-note">{item.tags[0] ?? "made fresh"}</span><button className="add-button" onClick={()=>{add(item); setMessage(`${item.name} added to your bag`); window.setTimeout(()=>setMessage(""),1800);}} aria-label={`Add ${item.name} to cart`}><Plus size={16} /> Add</button></div></div>
    </motion.article>)}</motion.div> : <div className="empty-menu">Nothing found just yet. Try another search.</div>}
    <div className="menu-service-note"><span>All good things, made fresh.</span><span>Dine in <i>·</i> Take away <i>·</i> Online orders</span></div><p className="menu-price-note">Prices shown are indicative and may be updated by the restaurant.</p>
    <button className="floating-cart" onClick={()=>setCartOpen(true)} aria-label={`Open shopping bag, ${quantity} items`}><ShoppingBag size={19} /><span>Your bag</span><b>{quantity}</b></button>
    <AnimatePresence>{cartOpen && <><motion.div className="drawer-scrim" initial={{opacity:0}} animate={{opacity:.45}} exit={{opacity:0}} onClick={()=>{setCartOpen(false);setOrderOpen(false);}} /><motion.aside className="cart-drawer" initial={{x:"100%"}} animate={{x:0}} exit={{x:"100%"}} transition={{type:"spring",damping:28,stiffness:240}} aria-label="Your order"><div className="drawer-heading"><div><span className="eyebrow"><i /> SATVIK FOOD COURT</span><h2>{orderOpen ? "Almost yours" : "Your bag"}</h2></div><button className="icon-button" onClick={()=>{setCartOpen(false);setOrderOpen(false);}} aria-label="Close bag"><X /></button></div>
      {orderOpen ? <form className="order-form" onSubmit={submitOrder}><p>Leave the details with us and we’ll get your order started.</p><label>Your name<input name="name" required placeholder="Name" /></label><label>Phone number<input name="phone" required inputMode="tel" placeholder="10-digit phone number" /></label><label>How would you like it?<select name="fulfillment"><option value="takeaway">Takeaway</option><option value="delivery">Delivery</option><option value="dine-in">Dine-in</option></select></label><label>Anything we should know?<textarea name="notes" rows={2} placeholder="Optional notes" /></label>{message && <div className={orderState === "done" ? "order-message success" : "order-message"}>{message}</div>}<button className="button button-dark order-submit" disabled={orderState === "sending" || orderState === "done"}>{orderState === "done" ? "Order received" : orderState === "sending" ? "Sending…" : <>Place order · {money(total)} <ArrowRight size={16}/></>}</button></form> : <><div className="cart-lines">{cart.length ? cart.map(({item,quantity,preparation})=><div className="cart-line" key={`${item.id}-${preparation}`}><span className="cart-emoji">{emojiByCategory[item.category]}</span><div className="cart-line-info"><strong>{item.name}</strong><small>{preparation ? `${preparation} · ` : ""}{money(item.price)} each</small></div><div className="quantity-control"><button onClick={()=>updateQty(item.id,preparation,-1)} aria-label={`Remove one ${item.name}`}><Minus size={13}/></button><span>{quantity}</span><button onClick={()=>updateQty(item.id,preparation,1)} aria-label={`Add one ${item.name}`}><Plus size={13}/></button></div><b>{money(item.price*quantity)}</b></div>) : <div className="cart-empty"><span>🥡</span><h3>Your bag is taking a little break.</h3><p>Add something delicious to get started.</p></div>}</div><div className="cart-footer"><div className="cart-subtotal"><span>Subtotal</span><b>{money(total)}</b></div><small>Final total may vary by delivery distance.</small><button className="button button-dark order-submit" disabled={!cart.length} onClick={()=>setOrderOpen(true)}>Continue to order <ArrowRight size={16}/></button></div></>}
    </motion.aside></>}</AnimatePresence>
    <AnimatePresence>{message && !cartOpen && <motion.div className="toast" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:8}}><Check size={15}/>{message}</motion.div>}</AnimatePresence>
  </div>;
}
