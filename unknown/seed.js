const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.db');

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT,
    brand TEXT,
    category TEXT,
    type TEXT,
    price REAL,
    currency TEXT,
    description TEXT,
    images TEXT,
    colors TEXT,
    sizes TEXT,
    availableSizes TEXT,
    sku TEXT,
    origin TEXT
  )`);

  const products = [
    {
      "id": "nike-air-max-270",
      "brand": "Nike",
      "name": "Nike Air Max 270",
      "category": "Men's Shoes",
      "type": "shoes",
      "price": 14995,
      "currency": "INR",
      "description": "The Nike Air Max 270 delivers visible Air cushioning under every step. With its sleek design and incredible comfort, it's built for all-day wear.",
      "images": JSON.stringify(["/nike-imgaes/imgi_16_AIR+JORDAN+40+PF.png", "/nike-imgaes/imgi_17_ZM+GP+CHALLENGE+PRO+HC+PRM+USO.png", "/nike-imgaes/imgi_18_W+ZOOM+VAPOR+PRO+3+HC+PRM.png", "/nike-imgaes/imgi_19_AS+W+NKCT+DF+SLAM+DRESS+USO+2.png"]),
      "colors": JSON.stringify([{ "name": "White/Black", "hex": "#FFFFFF" }]),
      "sizes": JSON.stringify(["UK 6", "UK 7", "UK 8", "UK 9", "UK 10", "UK 11", "UK 12"]),
      "availableSizes": JSON.stringify(["UK 7", "UK 8", "UK 9", "UK 10"]),
      "sku": "AH8050-100",
      "origin": "Vietnam"
    },
    // Add other products similarly, but for brevity, I'll add a few
    {
      "id": "nike-pegasus-premium",
      "brand": "Nike",
      "name": "Nike Pegasus Premium",
      "category": "Women's Shoes",
      "type": "shoes",
      "price": 12995,
      "currency": "INR",
      "description": "Engineered for performance, the Nike Pegasus Premium combines responsive cushioning with a lightweight design for runners who demand the best.",
      "images": JSON.stringify(["/nike-imgaes/imgi_10_W+NIKE+PEGASUS+PREMIUM.png", "/nike-imgaes/imgi_56_W+NIKE+PEGASUS+PREMIUM.png", "/nike-imgaes/imgi_57_W+NIKE+PEGASUS+PREMIUM.png", "/nike-imgaes/imgi_60_W+NIKE+STRUCTURE+26.png"]),
      "colors": JSON.stringify([{ "name": "Pink", "hex": "#FFC0CB" }]),
      "sizes": JSON.stringify(["UK 4", "UK 5", "UK 6", "UK 7", "UK 8", "UK 9"]),
      "availableSizes": JSON.stringify(["UK 5", "UK 6", "UK 7", "UK 8"]),
      "sku": "BV7256-600",
      "origin": "Vietnam"
    },
    // Add more as needed
  ];

  const stmt = db.prepare('INSERT OR REPLACE INTO products (id, name, brand, category, type, price, currency, description, images, colors, sizes, availableSizes, sku, origin) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
  products.forEach(product => {
    stmt.run(product.id, product.name, product.brand, product.category, product.type, product.price, product.currency, product.description, product.images, product.colors, product.sizes, product.availableSizes, product.sku, product.origin);
  });
  stmt.finalize();
  console.log('Products inserted');
});

db.close();