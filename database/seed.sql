INSERT INTO restaurants (id, name, name_local, address, plus_code, phone, instagram_url)
VALUES ('11111111-1111-4111-8111-111111111111', 'Satvik Food Court', 'सात्विक फूड कोर्ट',
  'Vashisht Complex, behind Kapil General Store, Kohta, Hamirpur, Himachal Pradesh 177001',
  'MGQC+78', '080919 52445', 'https://instagram.com')
ON CONFLICT (id) DO NOTHING;

INSERT INTO menu_categories (restaurant_id, slug, name, sort_order) VALUES
('11111111-1111-4111-8111-111111111111','momos','Momos',1),
('11111111-1111-4111-8111-111111111111','soups-mains','Soups & Mains',2),
('11111111-1111-4111-8111-111111111111','sizzlers','Sizzlers',3),
('11111111-1111-4111-8111-111111111111','pizzas','Pizzas',4),
('11111111-1111-4111-8111-111111111111','pasta-breads','Pasta & Breads',5),
('11111111-1111-4111-8111-111111111111','waffles','Waffles',6),
('11111111-1111-4111-8111-111111111111','street-food','Street Food',7),
('11111111-1111-4111-8111-111111111111','chaat-north-indian','Chaat & North Indian',8),
('11111111-1111-4111-8111-111111111111','drinks-bubble-tea','Drinks & Bubble Tea',9)
ON CONFLICT (restaurant_id, slug) DO NOTHING;

-- Indicative prices in INR. Update these values when the restaurant confirms its printed menu.
INSERT INTO menu_items (id, restaurant_id, category_id, name, description, price, tags, vegetarian)
SELECT v.id, r.id, c.id, v.name, v.description, v.price, v.tags, TRUE
FROM (VALUES
('momo-veggie','momos','Veggie Momos','Garden vegetables, ginger and house dipping sauce. Steam, fry or pan fry.',119,ARRAY['popular','savory']),
('momo-paneer','momos','Paneer Momos','Soft paneer filling with a gentle chilli kick. Steam, fry or pan fry.',149,ARRAY['spicy','savory']),
('momo-corn','momos','Corn & Cheese Momos','Sweet corn, melty cheese and pepper. Steam, fry or pan fry.',159,ARRAY['cheesy','savory']),
('momo-combo-rice','momos','Momo + Fried Rice Combo','Momos served with wok-tossed fried rice.',229,ARRAY['combo','filling']),
('momo-combo-noodles','momos','Momo + Noodles Combo','Momos served with Hakka noodles.',229,ARRAY['combo','filling']),
('soup-manchow','soups-mains','Veg Manchow Soup','A warming Indo-Chinese classic with crisp noodles.',119,ARRAY['spicy','soup']),
('soup-lemon','soups-mains','Lemon Coriander Soup','Citrus, fresh coriander and garden vegetables.',119,ARRAY['fresh','soup']),
('spring-rolls','soups-mains','Spring Rolls','Crisp rolls filled with seasoned vegetables.',159,ARRAY['crunchy','starter']),
('chilli-paneer','soups-mains','Chilli Paneer','Paneer, peppers and spring onion in a lively sauce.',229,ARRAY['spicy','paneer']),
('hakka-noodles','soups-mains','Hakka Noodles','Wok-tossed noodles with seasonal vegetables.',189,ARRAY['savory','noodles']),
('gravy-manchurian','soups-mains','Gravy Manchurian','Vegetable dumplings in a rich, tangy gravy.',219,ARRAY['spicy','gravy']),
('sizzler-veg','sizzlers','Veg Manchurian Sizzler','A sizzling platter with veg Manchurian and sides.',329,ARRAY['spicy','signature']),
('sizzler-paneer','sizzlers','Paneer Manchurian Sizzler','Paneer Manchurian served hot with hearty sides.',359,ARRAY['spicy','paneer']),
('sizzler-peri','sizzlers','Peri Peri Paneer Sizzler','Smoky peri peri paneer on a hot plate.',379,ARRAY['spicy','paneer']),
('pizza-margherita','pizzas','Margherita','Tomato, mozzarella and fragrant basil.',229,ARRAY['pizza','classic']),
('pizza-tomatina','pizzas','La Tomatina','Tomato-forward favourite with herbs and cheese.',259,ARRAY['pizza','tangy']),
('pizza-corny','pizzas','Corny Treat','Sweet corn, mozzarella and a buttery finish.',279,ARRAY['pizza','cheesy']),
('pizza-paradise','pizzas','Veggie Paradise','A garden of colourful vegetables.',299,ARRAY['pizza','fresh']),
('pizza-paneer','pizzas','Paneer Picasso','Paneer tikka, peppers and cheese.',329,ARRAY['pizza','paneer']),
('pizza-farmhouse','pizzas','Farm House','Mushroom, capsicum, onion and tomato.',329,ARRAY['pizza','fresh']),
('pasta-white','pasta-breads','White Sauce Pasta','Silky, creamy sauce with herbs and vegetables.',239,ARRAY['creamy','comfort']),
('pasta-red','pasta-breads','Red Sauce Pasta','Tomato sauce with a hint of chilli.',229,ARRAY['spicy','tomato']),
('pasta-mixed','pasta-breads','Mixed Sauce Pasta','Creamy white and tangy red sauce.',249,ARRAY['creamy','comfort']),
('mac-cheese','pasta-breads','Mac & Cheese','Pasta in a comforting cheese sauce.',249,ARRAY['cheesy','comfort']),
('garlic-sticks','pasta-breads','Garlic Bread Sticks','Golden baked bread with garlic butter and herbs.',139,ARRAY['garlic','side']),
('garlic-stuffed','pasta-breads','Stuffed Garlic Bread','Garlic bread stuffed with cheese and corn.',189,ARRAY['cheesy','side']),
('waffle-nutella','waffles','Naked Nutella','Warm waffle with hazelnut chocolate spread.',189,ARRAY['sweet','chocolate']),
('waffle-walnut','waffles','Wacky Walnut','Toasted walnut, chocolate and warm waffle.',219,ARRAY['sweet','nutty']),
('waffle-banana','waffles','Banana Caramel','Fresh banana and buttery caramel.',219,ARRAY['sweet','fruit']),
('waffle-ferraro','waffles','Ferraro Bomb','Chocolate-hazelnut waffle treat.',249,ARRAY['sweet','chocolate']),
('waffle-oreo','waffles','Old School Oreo','Cookies, cream and chocolate crunch.',229,ARRAY['sweet','chocolate']),
('street-pav','street-food','Pav Bhaji','Spiced vegetable bhaji with buttered pav.',169,ARRAY['spicy','street food']),
('street-vada','street-food','Vada Pav','Mumbai potato fritter in a soft pav.',69,ARRAY['spicy','street food']),
('street-sandwich','street-food','Grill Bombay Sandwich','Grilled potato, vegetables and chutney.',149,ARRAY['street food','crunchy']),
('street-dabeli','street-food','Dabeli','Kutch potato filling with peanuts and sev.',89,ARRAY['sweet','spicy']),
('chaat-golgappe','chaat-north-indian','Golgappe','Crisp puris with spiced water and fillings.',79,ARRAY['tangy','street food']),
('chaat-raj','chaat-north-indian','Raj Kachori','Kachori with chutneys, curd and crunch.',149,ARRAY['tangy','crunchy']),
('chaat-tikki','chaat-north-indian','Aloo Tikki','Golden potato patties with chutney and curd.',119,ARRAY['crunchy','street food']),
('north-choley-bhature','chaat-north-indian','Choley Bhature','Punjabi choley with fluffy bhature.',189,ARRAY['spicy','filling']),
('north-choley-kulcha','chaat-north-indian','Choley Kulcha','Slow-spiced choley with soft kulcha.',169,ARRAY['spicy','filling']),
('north-samosa','chaat-north-indian','Samosa','Flaky pastry with spiced potato and peas.',35,ARRAY['crunchy','snack']),
('drink-mango-tea','drinks-bubble-tea','Mango Fruit Tea','Chilled fruit tea with a tropical mango finish.',149,ARRAY['beverage','sweet','fruit tea']),
('drink-peach-tea','drinks-bubble-tea','Peach Fruit Tea','Light, fragrant peach tea, served chilled.',149,ARRAY['beverage','sweet','fruit tea']),
('drink-passion-tea','drinks-bubble-tea','Passion Fruit Tea','Tangy tropical fruit tea.',159,ARRAY['beverage','fruit tea']),
('drink-strawberry-tea','drinks-bubble-tea','Strawberry Milk Tea','Creamy milk tea with strawberry.',169,ARRAY['beverage','sweet','milk tea']),
('drink-oreo-tea','drinks-bubble-tea','Oreo Cocoa Milk Tea','Cocoa, creamy tea and cookie crumble.',189,ARRAY['beverage','sweet','milk tea']),
('drink-vietnamese','drinks-bubble-tea','Vietnamese Coffee Milk Tea','Bold coffee meets smooth milk tea.',189,ARRAY['beverage','coffee','milk tea']),
('drink-boba','drinks-bubble-tea','Popping Bobas','Add a burst of fruity popping boba.',169,ARRAY['beverage','sweet','boba']),
('drink-shake','drinks-bubble-tea','Classic Shake','Thick, chilled shake; ask for today's flavours.',159,ARRAY['beverage','sweet','shake']),
('drink-lassi','drinks-bubble-tea','Lassi','Cool, creamy yoghurt drink, sweet or salted.',119,ARRAY['beverage','lassi']),
('drink-cold-coffee','drinks-bubble-tea','Cold Coffee','Chilled coffee blended smooth.',149,ARRAY['beverage','coffee']),
('drink-soft','drinks-bubble-tea','Soft Drinks','A selection of standard chilled soft drinks.',49,ARRAY['beverage','refreshing'])
) AS v(id, category_slug, name, description, price, tags)
CROSS JOIN restaurants r
JOIN menu_categories c ON c.restaurant_id = r.id AND c.slug = v.category_slug
WHERE r.id = '11111111-1111-4111-8111-111111111111'
ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, description=EXCLUDED.description,
  price=EXCLUDED.price, tags=EXCLUDED.tags, category_id=EXCLUDED.category_id;
