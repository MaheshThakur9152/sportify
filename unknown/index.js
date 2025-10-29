const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

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
      subject: 'Verify Your Email - Sportify',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
          <div style="background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
            <div style="margin-bottom: 30px;">
              <h1 style="color: #000; margin: 0; font-size: 28px;">SPORTIFY</h1>
              <p style="color: #666; margin: 5px 0;">Email Verification</p>
            </div>
            
            <div style="background-color: #f0f8ff; border: 1px solid #b3d9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #0066cc; margin: 0 0 15px 0;">Welcome to Sportify!</h2>
              <p style="color: #333; margin: 0 0 15px 0; line-height: 1.6;">
                Thank you for registering with Sportify. To complete your account setup and start shopping, please verify your email address.
              </p>
            </div>

            <div style="margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background-color: #007bff; 
                        color: #fff; 
                        text-decoration: none; 
                        padding: 15px 30px; 
                        border-radius: 25px; 
                        font-size: 16px; 
                        font-weight: bold; 
                        display: inline-block; 
                        box-shadow: 0 4px 8px rgba(0,123,255,0.3);
                        transition: all 0.3s ease;">
                Verify My Email
              </a>
            </div>

            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <p style="color: #666; margin: 0; font-size: 14px;">
                <strong>Didn't create an account?</strong> You can safely ignore this email.
              </p>
            </div>

            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                <strong>Link expires in 1 hour</strong> for security reasons.
              </p>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; margin: 0;">Questions? Contact our support team</p>
              <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Just Do It.</p>
            </div>
          </div>
        </div>
      `,
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

    // Get order items for email
    const emailOrderItems = await new Promise((resolve, reject) => {
      const query = `
        SELECT oi.*, p.name, p.brand
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `;
      db.all(query, [orderId], (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    const itemsHtml = emailOrderItems.map(item => 
      `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.brand} ${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${(item.quantity * item.price).toLocaleString('en-IN')}</td>
      </tr>`
    ).join('');

    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: `Order Confirmation #${orderId} - Sportify`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; padding: 20px;">
          <div style="background-color: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #000; margin: 0; font-size: 28px;">SPORTIFY</h1>
              <p style="color: #666; margin: 5px 0;">Order Confirmation</p>
            </div>
            
            <div style="background-color: #f0f0f0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="margin: 0 0 10px 0; color: #333;">Order #${orderId}</h2>
              <p style="margin: 0; color: #666;">Placed on ${new Date().toLocaleDateString('en-IN', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>

            <h3 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">Order Items</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="background-color: #f5f5f5;">
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #ddd;">Product</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 2px solid #ddd;">Qty</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Price</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #ddd;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
                <tr style="background-color: #f9f9f9; font-weight: bold;">
                  <td colspan="3" style="padding: 15px; text-align: right; border-top: 2px solid #ddd;">Order Total:</td>
                  <td style="padding: 15px; text-align: right; border-top: 2px solid #ddd; font-size: 18px; color: #007bff;">₹${total.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>

            <div style="display: flex; gap: 20px; margin-bottom: 20px;">
              <div style="flex: 1;">
                <h3 style="color: #333; margin-bottom: 10px;">Shipping Address</h3>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
                  <p style="margin: 0 0 5px 0;"><strong>${name}</strong></p>
                  <p style="margin: 0 0 5px 0;">${address1}</p>
                  ${address2 ? `<p style="margin: 0 0 5px 0;">${address2}</p>` : ''}
                  <p style="margin: 0 0 5px 0;">${city}, ${state} ${pin}</p>
                  <p style="margin: 0 0 5px 0;">Phone: ${phone}</p>
                  <p style="margin: 0;">Email: ${email}</p>
                </div>
              </div>
              
              <div style="flex: 1;">
                <h3 style="color: #333; margin-bottom: 10px;">Payment Method</h3>
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
                  <p style="margin: 0; text-transform: uppercase;"><strong>${payment_method}</strong></p>
                </div>
                
                <h3 style="color: #333; margin: 20px 0 10px 0;">Order Status</h3>
                <div style="background-color: #fff3cd; color: #856404; padding: 10px; border-radius: 5px; border: 1px solid #ffeaa7;">
                  <strong>Processing</strong> - Your order is being prepared for shipment.
                </div>
              </div>
            </div>

            <div style="background-color: #e8f5e8; border: 1px solid #c3e6c3; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <h3 style="color: #2d5a2d; margin: 0 0 10px 0;">What's Next?</h3>
              <ul style="color: #2d5a2d; margin: 0; padding-left: 20px;">
                <li>You'll receive a shipping confirmation email with tracking details</li>
                <li>Estimated delivery: 3-5 business days</li>
                <li>Questions? Contact our support team</li>
              </ul>
            </div>

            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; margin: 0;">Thank you for shopping with Sportify!</p>
              <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Just Do It.</p>
            </div>
          </div>
        </div>
      `,
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

app.get('/orders/:id/items', verifyToken, (req, res) => {
  const orderId = req.params.id;
  
  // First check if the order belongs to the user
  db.get('SELECT id FROM orders WHERE id = ? AND user_id = ?', [orderId, req.userId], (err, order) => {
    if (err) return res.status(500).json({ message: 'Error fetching order' });
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Get order items with product details
    const query = `
      SELECT oi.*, p.name, p.brand, p.images
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = ?
    `;
    
    db.all(query, [orderId], (err, items) => {
      if (err) return res.status(500).json({ message: 'Error fetching order items' });
      
      // Parse the images JSON for each item
      const processedItems = items.map(item => ({
        ...item,
        images: JSON.parse(item.images)
      }));
      
      res.json(processedItems);
    });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});