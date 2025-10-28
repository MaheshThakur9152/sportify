# Unknown Backend

Express.js backend for the Sportify e-commerce app.

## Setup

1. Install dependencies: `npm install`
2. Configure `.env` with your SMTP settings and JWT secret.
3. Run the seed script: `node seed.js`
4. Start the server: `npm start`

## Endpoints

- POST /register: Register a new user
- POST /login: Login user
- GET /verify: Verify email
- GET /products: Get all products
- POST /checkout: Checkout (requires auth)

## Database

Uses SQLite3 with tables for users, products, orders, order_items.