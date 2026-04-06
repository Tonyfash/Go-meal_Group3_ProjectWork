# Go-Meal API

Go-Meal is a food ordering backend built with Node.js, Express, and MongoDB. It powers user authentication, kitchen and category browsing, product listing, cart management, OTP email verification, image uploads, and payment initialization.

## What Makes This Version Stand Out

This project now includes real commerce features so it feels more advanced than a basic CRUD food API:

- Smart meal planner that builds the best product combination for a user's budget
- Smart product discovery with search, kitchen filtering, category filtering, budget filtering, sorting, and pagination
- Personalized meal recommendations based on what a signed-in user already has in their cart
- Cart intelligence that returns item totals, quantity summary, kitchen/category breakdowns, and suggested add-ons
- Promo codes that can be created, listed, seeded, and applied to the current cart
- Loyalty rewards that grow when payments are verified successfully

These upgrades make the API much more useful for a real frontend experience, especially for building a modern food marketplace with recommendation-driven browsing.

## Core Features

- JWT-based authentication
- Email OTP verification and resend flow
- Password reset and password change endpoints
- Kitchen, category, and product seed endpoints
- Product browsing by category and by advanced filters
- Budget-aware smart meal planning
- Cart add, update, clear, and smart cart summary
- Promo code and loyalty rewards system
- Cloudinary image upload support
- Payment initialization and verification flow

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Joi
- Multer
- Cloudinary
- Nodemailer / Mailgun
- Axios
- Nano ID

## Project Structure

```text
config/       configuration files
controller/   route logic and business rules
images/       image assets
middleware/   auth, validation, uploads, and email helpers
model/        mongoose schemas
router/       api route definitions
server.js     app entry point
```

## Setup

1. Install dependencies

```bash
npm install
```

2. Create a `.env` file and add your environment variables

```env
PORT=1234
MONGO_DB=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
MAILGUN_API_KEY=your_mailgun_api_key
MAILGUN_DOMAIN=your_mailgun_domain
KORA_SECRET_KEY=your_kora_secret_key
```

3. Start the server

```bash
npm run dev
```

For production:

```bash
npm start
```

The API runs on `http://localhost:1234` unless `PORT` is changed.

## Main Endpoints

### User

- `POST /api/v1/register`
- `POST /api/v1/login`
- `POST /api/v1/send-code`
- `POST /api/v1/verify-code`
- `GET /api/v1/`
- `POST /api/v1/password`
- `POST /api/v1/reset/:id/:token`
- `PUT /api/v1/password`
- `PUT /api/v1/update/:id`
- `DELETE /api/v1/delete/:id`

### Kitchen and Category

- `POST /api/v1/seed`
- `GET /api/v1/kitchen`
- `GET /api/v1/:id`
- `POST /api/v1/seedCategories`
- `GET /api/v1/categories/:kitchenId`
- `GET /api/v1/category/:id`

### Product

- `POST /api/v1/seedProducts`
- `GET /api/v1/products`
- `GET /api/v1/products/meal-plan`
- `GET /api/v1/products/recommendations`
- `GET /api/v1/product/:id`
- `GET /api/v1/products/category/:categoryId`

## Signature Feature: Smart Meal Planner

`GET /api/v1/products/meal-plan` is the standout feature for this project.

It takes a user's budget and returns the best meal combinations it can build from available products, instead of making the user manually compare dozens of items.

Supported query params:

- `budget` required
- `maxItems`
- `kitchenId`
- `categoryId`
- `search`

Example:

```bash
GET /api/v1/products/meal-plan?budget=5000&maxItems=3
```

The response returns up to 3 ranked meal plans with:

- selected items
- total price
- remaining budget
- meal plan score
- recommendation reasons

This makes the project stand out because it behaves more like a decision-making food platform than a normal listing API.

### Cart

- `POST /api/v1/cart/add`
- `GET /api/v1/cart`
- `PUT /api/v1/cart/update`
- `DELETE /api/v1/cart/clear`

### Promo and Loyalty

- `POST /api/v1/promos/seed`
- `POST /api/v1/promos`
- `GET /api/v1/promos`
- `POST /api/v1/promos/apply`
- `GET /api/v1/loyalty`

### Payment

- `GET /api/v1/make-payment/:userId/:productId`
- `GET /api/v1/verify-payment`

## Smart Discovery Usage

`GET /api/v1/products` now supports:

- `search`
- `kitchenId`
- `categoryId`
- `minPrice`
- `maxPrice`
- `budget`
- `sortBy=latest|oldest|price_asc|price_desc|name`
- `page`
- `limit`

Example:

```bash
GET /api/v1/products?search=coffee&budget=3000&sortBy=price_asc&page=1&limit=8
```

The response includes:

- matched products
- pagination metadata
- applied filters
- pricing insights
- kitchen/category highlights

## Personalized Recommendations

`GET /api/v1/products/recommendations` requires authentication.

Optional query params:

- `budget`
- `limit`

The API uses the signed-in user's cart to recommend products they are likely to enjoy, based on:

- preferred kitchens
- preferred categories
- usual spend range
- items not already in the cart

## Smart Cart Response

`GET /api/v1/cart` now returns more than raw cart items. It also includes:

- total cart value
- discounted total when a promo is active
- applied promo details
- unique item count
- total quantity count
- average item price
- estimated reward points
- kitchen breakdown
- category breakdown
- suggested add-ons

## Promo Codes and Loyalty Rewards

This project now includes a full promo and rewards flow that is common on modern food and commerce platforms.

Promo features:

- seed ready-made promo campaigns
- create new promo codes with generated coupon strings
- list active promos
- apply a promo to the signed-in user's cart
- persist the applied promo on the cart until the cart changes

Loyalty features:

- users earn points when payment verification succeeds
- cart responses show estimated reward points before checkout
- loyalty endpoint returns current tier and next-tier progress

Example promo flow:

```bash
POST /api/v1/promos/apply
Authorization: Bearer <token>
Content-Type: application/json

{
  "code": "WELCOME10"
}
```

## Notes

- Most cart and recommendation endpoints require a valid Bearer token.
- Seed kitchens, then categories, then products for the best initial setup.
- The current auth flow in code signs login tokens and uses MongoDB-backed user sessions.

## Team

Group 3 Project Work, The Curve Africa
