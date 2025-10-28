const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Database setup
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log('Connected to the SQLite database.');
});

// Create tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    verified INTEGER DEFAULT 0
  )`);

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

  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    total REAL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    email TEXT,
    name TEXT,
    address1 TEXT,
    address2 TEXT,
    city TEXT,
    state TEXT,
    pin TEXT,
    phone TEXT,
    payment_method TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER,
    product_id TEXT,
    quantity INTEGER,
    price REAL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS cart (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    product_id TEXT,
    quantity INTEGER,
    size TEXT,
    color TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);
});

// SMTP transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ message: 'No token provided' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
};

// Routes
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function(err) {
    if (err) return res.status(400).json({ message: 'User already exists' });

    const token = jwt.sign({ id: this.lastID }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const verificationUrl = `http://localhost:3000/verify?token=${token}`;

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Verify your email',
      html: `<p>Click the button to verify your email:</p><a href="${verificationUrl}" style="background-color: #4CAF50; border: none; color: white; padding: 15px 32px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; margin: 4px 2px; cursor: pointer;">Verify Email</a>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) return res.status(500).json({ message: 'Error sending email' });
      res.status(201).json({ message: 'User registered, check email for verification' });
    });
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user) return res.status(400).json({ message: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.verified) return res.status(400).json({ message: 'Email not verified' });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  });
});

app.get('/verify', (req, res) => {
  const { token } = req.query;
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(400).json({ message: 'Invalid token' });

    db.run('UPDATE users SET verified = 1 WHERE id = ?', [decoded.id], (err) => {
      if (err) return res.status(500).json({ message: 'Error verifying user' });
      res.json({ message: 'Email verified successfully' });
    });
  });
});

app.get('/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching products' });
    const products = rows.map(row => ({
      ...row,
      images: JSON.parse(row.images),
      colors: JSON.parse(row.colors),
      sizes: JSON.parse(row.sizes),
      availableSizes: JSON.parse(row.availableSizes)
    }));
    res.json(products);
  });
});

app.get('/cart', verifyToken, (req, res) => {
  db.all('SELECT * FROM cart WHERE user_id = ?', [req.userId], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Error fetching cart' });
    res.json(rows);
  });
});

app.post('/cart', verifyToken, (req, res) => {
  const { product_id, quantity, size, color } = req.body;
  db.run('INSERT INTO cart (user_id, product_id, quantity, size, color) VALUES (?, ?, ?, ?, ?)', [req.userId, product_id, quantity, size, color], function(err) {
    if (err) return res.status(500).json({ message: 'Error adding to cart' });
    res.status(201).json({ id: this.lastID });
  });
});

app.delete('/cart/:id', verifyToken, (req, res) => {
  db.run('DELETE FROM cart WHERE id = ? AND user_id = ?', [req.params.id, req.userId], (err) => {
    if (err) return res.status(500).json({ message: 'Error removing from cart' });
    res.json({ message: 'Removed from cart' });
  });
});

app.delete('/cart', verifyToken, (req, res) => {
  db.run('DELETE FROM cart WHERE user_id = ?', [req.userId], (err) => {
    if (err) return res.status(500).json({ message: 'Error clearing cart' });
    res.json({ message: 'Cart cleared' });
  });
});

app.put('/cart/:id', verifyToken, (req, res) => {
  const { quantity } = req.body;
  db.run('UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?', [quantity, req.params.id, req.userId], function(err) {
    if (err) return res.status(500).json({ message: 'Error updating cart' });
    if (this.changes === 0) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Updated' });
  });
});

app.post('/checkout', verifyToken, async (req, res) => {
  try {
    const { email, name, address1, address2, city, state, pin, phone, payment_method } = req.body;

    // Get cart items
    const cartItems = await new Promise((resolve, reject) => {
      db.all('SELECT * FROM cart WHERE user_id = ?', [req.userId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total
    let total = 0;
    const orderItems = [];

    for (const item of cartItems) {
      const product = await new Promise((resolve, reject) => {
        db.get('SELECT price FROM products WHERE id = ?', [item.product_id], (err, row) => {
          if (err) reject(err);
          else if (!row) reject(new Error('Product not found'));
          else resolve(row);
        });
      });
      total += product.price * item.quantity;
      orderItems.push({
        product_id: item.product_id,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Create order with shipping info
    const orderId = await new Promise((resolve, reject) => {
      db.run(`INSERT INTO orders (user_id, total, email, name, address1, address2, city, state, pin, phone, payment_method)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [req.userId, total, email, name, address1, address2, city, state, pin, phone, payment_method],
        function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        });
    });

    // Insert order items
    for (const item of orderItems) {
      await new Promise((resolve, reject) => {
        db.run('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.price], function(err) {
          if (err) reject(err);
          else resolve(this.lastID);
        });
      });
    }

    // Clear cart
    await new Promise((resolve, reject) => {
      db.run('DELETE FROM cart WHERE user_id = ?', [req.userId], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Send success email
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT email FROM users WHERE id = ?', [req.userId], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: 'Checkout Successful',
      html: `<p>Your order has been placed successfully. Total: ₹${total}</p>
             <p>Shipping to: ${name}, ${address1}, ${city}, ${state} ${pin}</p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        // Still return success since order was created
      }
      res.json({ message: 'Checkout successful', orderId });
    });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Error processing checkout' });
  }
});

app.get('/account', verifyToken, (req, res) => {
  db.get('SELECT id, email, verified FROM users WHERE id = ?', [req.userId], (err, user) => {
    if (err) return res.status(500).json({ message: 'Error fetching user' });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  });
});

app.get('/orders', verifyToken, (req, res) => {
  db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.userId], (err, orders) => {
    if (err) return res.status(500).json({ message: 'Error fetching orders' });
    res.json(orders);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});