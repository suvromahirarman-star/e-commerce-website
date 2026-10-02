# AURA Studio API Specification (v1.0.0)

**Base URL**: `http://localhost:5000/api/v1`  
**Protocol**: REST / JSON  
**Authentication**: JWT in `HttpOnly` secure cookies (`aura_access_token`, `aura_refresh_token`)  

---

## 1. System & Diagnostics

### `GET /health`
Returns system health, uptime, memory utilization, and active persistence state.
* **Access**: Public
* **Response**:
```json
{
  "success": true,
  "message": "AURA Studio API is running smoothly",
  "data": {
    "status": "UP",
    "uptime": 128.45,
    "timestamp": "2026-10-02T12:00:00.000Z",
    "instance": "instance-1",
    "persistence": "PostgreSQL (Supabase)",
    "memory": {
      "rssMB": 52.4,
      "heapUsedMB": 24.1
    }
  }
}
```

---

## 2. Storefront (Public APIs)

### `GET /products`
Catalog discovery with multi-faceted filtering, sorting, and pagination.
* **Query Parameters**:
  * `category` / `categorySlug` (string): Filter by collection (`womens`, `mens`, `objects`, `footwear`)
  * `minPrice` / `maxPrice` (number): Price threshold filtering
  * `rating` (number): Minimum average rating (1-5)
  * `size` (string): e.g. `S`, `M`, `L`, `42`
  * `color` (string): e.g. `Camel Tan`, `Midnight Navy`
  * `search` (string): Search query across product name, brand, SKU, description
  * `sort` (enum): `newest`, `price-asc`, `price-desc`, `rating`, `popular`
  * `page` (number, default: 1)
  * `limit` (number, default: 24)
* **Response `data`**: Array of product objects.

### `GET /products/:id` & `GET /products/slug/:slug`
Fetch full product specification, gallery image URLs, available variants, colors, and stock.

### `GET /categories` & `GET /categories/:slug`
List all active catalog categories with item counts and banner visual assets.

### `POST /coupons/validate`
Validates a promotional coupon code against the current cart subtotal.
* **Body**:
```json
{
  "code": "AURA10",
  "subtotal": 8900
}
```
* **Response**:
```json
{
  "success": true,
  "data": {
    "valid": true,
    "message": "Coupon \"AURA10\" applied successfully!",
    "coupon": {
      "code": "AURA10",
      "type": "percentage",
      "value": 10
    },
    "discountAmount": 890
  }
}
```

### `GET /reviews/product/:productId`
Fetches all approved customer reviews for a given product.

### `POST /reviews`
Submit a customer review.
* **Body**:
```json
{
  "productId": "prod-01",
  "author": "Tahmid Chowdhury",
  "rating": 5,
  "title": "Flawless wool drape",
  "comment": "The weight of the 480gsm wool is extraordinary."
}
```

### `GET /content/homepage`
Retrieves public homepage CMS hero section, promotional announcement, and curated banner configuration.

### `GET /settings`
Public store delivery rates (inside/outside Dhaka, free delivery thresholds) and currency format.

---

## 3. Orders & Frictionless Guest Checkout

> **Core Policy**: Customers DO NOT register, DO NOT log in, and DO NOT create accounts. All orders are placed as guests.

### `POST /orders` (Guest Checkout)
Authoritative order processing engine. Re-validates prices, discounts, and inventory atomically.
* **Body**:
```json
{
  "customer": {
    "fullName": "Tariq Rahman",
    "email": "tariq.rahman@example.com",
    "phone": "+880 1712 345678"
  },
  "shippingAddress": {
    "street": "House 42, Road 11, Block D, Banani",
    "apartment": "Suite 4B",
    "city": "Dhaka",
    "division": "Dhaka",
    "postalCode": "1213",
    "notes": "Leave at concierge"
  },
  "items": [
    {
      "productId": "prod-01",
      "quantity": 1,
      "selectedColor": "Camel Tan",
      "selectedSize": "L"
    }
  ],
  "couponCode": "AURA10",
  "paymentMethod": "Cash on Delivery"
}
```
* **Response (201 Created)**: Returns authoritative order confirmation (`orderNumber`, `subtotal`, `discountAmount`, `deliveryFee`, `totalAmount`, snapshots).

### `GET /orders/:orderNumber`
Public guest order tracking using the generated reference code (e.g., `AUR-2026-9481`).

---

## 4. Admin Authentication

### `POST /admin/auth/login`
Authenticates administrator credentials and sets two secure `HttpOnly` cookies.
* **Body**: `{ "email": "admin@aurastudio.com", "password": "..." }`
* **Cookies Issued**:
  * `aura_access_token` (Short-lived, 15m)
  * `aura_refresh_token` (Long-lived, 7d, hashed & rotated in PostgreSQL)

### `GET /admin/me`
Returns current administrator identity and role (`super_admin` | `admin`).

### `POST /admin/auth/refresh`
Rotates refresh tokens and issues a fresh access token without re-entering credentials.

### `POST /admin/auth/logout`
Revokes refresh token in database and immediately expires client cookies.

---

## 5. Admin Management (Protected)

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/admin/products` | Paginated product catalog management with draft/archived filters |
| `POST` | `/admin/products` | Create a new product with full specifications |
| `PATCH` | `/admin/products/:id` | Update product catalog details |
| `DELETE` | `/admin/products/:id` | Archive or delete a product |
| `POST` | `/admin/products/:id/images`| Multipart file upload directly to Supabase Storage bucket |
| `GET` | `/admin/categories` | Admin category management list |
| `POST` | `/admin/categories` | Create new category |
| `PATCH` | `/admin/categories/:id` | Update category details |
| `DELETE` | `/admin/categories/:id` | Delete category |
| `GET` | `/admin/orders` | Order fulfillment pipeline (Search, status, payment filters) |
| `GET` | `/admin/orders/:id` | Order details with product snapshots |
| `PATCH` | `/admin/orders/:id/status`| Update status (`Pending` $\to$ `Processing` $\to$ `Shipped` $\to$ `Delivered` $\to$ `Cancelled`). Auto-restores stock on cancellation |
| `GET` | `/admin/inventory` | Real-time stock tracker (`critical`, `low`, `normal` filters) |
| `PATCH` | `/admin/inventory/:id`| Adjust inventory replenishment stock |
| `GET` | `/admin/customers` | Aggregated guest patron directory (lifetime spend, order counts) |
| `GET` | `/admin/coupons` | List all promotional vouchers with redemption metrics |
| `POST` | `/admin/coupons` | Create voucher with usage limit and expiry dates |
| `PATCH` | `/admin/coupons/:id` | Edit voucher terms |
| `PATCH` | `/admin/coupons/:id/toggle` | Instant active state toggle |
| `DELETE` | `/admin/coupons/:id` | Delete promotional voucher |
| `GET` | `/admin/reviews` | Review moderation queue (`Pending`, `Approved`, `Rejected`) |
| `PATCH` | `/admin/reviews/:id/status`| Approve or reject review (triggers rating recalculation) |
| `DELETE` | `/admin/reviews/:id` | Permanently delete review |
| `GET` | `/admin/dashboard/stats` | Real-time KPIs, 7-day revenue trend, assortment distribution |
| `GET` | `/admin/content/homepage` | Fetch homepage hero copy and banners |
| `PUT` | `/admin/content/homepage` | Update homepage hero copy and banners |
| `GET` | `/admin/settings` | Store shipping fees and currency configuration |
| `PUT` | `/admin/settings` | Update store operational settings |
