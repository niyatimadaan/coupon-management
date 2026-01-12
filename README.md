# Coupons Management API

A production-ready RESTful API to manage and apply different types of discount coupons (cart-wise, product-wise, and BxGy) for an e-commerce platform.

## Table of Contents
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [API Endpoints](#api-endpoints)
- [Coupon Cases Analysis](#coupon-cases-analysis)
- [Architecture & Design](#architecture--design)
- [Assumptions](#assumptions)
- [Limitations](#limitations)
- [How to Extend](#how-to-extend)

---

## Tech Stack

- **Runtime**: Node.js (v20+)
- **Framework**: Express.js (v5.2.1)
- **Database**: MongoDB Atlas (Cloud NoSQL Database)
- **ODM**: Mongoose (v9.1.3)
- **Testing**: Jest (v30.2.0) + Supertest (v7.2.2)
- **API Documentation**: Swagger UI + OpenAPI 3.0
- **Development**: Nodemon, dotenv
- **Module System**: ES6 Modules (import/export)

---

## Features

✅ **Complete CRUD Operations** for coupons  
✅ **3 Coupon Types**: Cart-wise, Product-wise, BxGy (Buy X Get Y)  
✅ **MongoDB Integration** with cloud storage (MongoDB Atlas)  
✅ **Flexible Schema** using Mongoose Mixed type for varying coupon structures  
✅ **Strategy Pattern** for extensible discount calculations  
✅ **Comprehensive Testing** - 61 tests with 90.45% code coverage  
✅ **Interactive API Documentation** - Swagger UI at `/api-docs`  
✅ **Automatic Timestamps** - createdAt and updatedAt tracking  
✅ **Query Optimization** - Indexed fields for better performance  
✅ **Production-Ready** - Async/await, error handling, validation  

---

## Installation & Setup

### Prerequisites
- Node.js (v20 or higher)
- npm
- MongoDB Atlas account (or local MongoDB instance)

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/niyatimadaan/coupon-management.git
cd coupons-management
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/coupons-management?retryWrites=true&w=majority
```

4. Run the application:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3000`

5. Access API Documentation:
   - Open browser: `http://localhost:3000/api-docs`
   - Interactive Swagger UI with all endpoints documented
   - Test APIs directly from the browser

---

## API Documentation

**Swagger UI**: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

The API documentation is auto-generated using Swagger/OpenAPI 3.0 specification and includes:
- Complete request/response schemas
- Example payloads for all coupon types
- Interactive testing interface
- Error response documentation
- Data model definitions

---

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Coupon Management (CRUD)

#### 1. Create a Coupon
**POST** `/coupons`

**Request Body Examples:**

Cart-wise coupon (percentage):
```json
{
  "type": "cart-wise",
  "details": {
    "threshold": 100,
    "discount": 10,
    "discountType": "percentage"
  }
}
```

Cart-wise coupon (fixed amount):
```json
{
  "type": "cart-wise",
  "details": {
    "threshold": 200,
    "discount": 50,
    "discountType": "fixed"
  }
}
```

Product-wise coupon:
```json
{
  "type": "product-wise",
  "details": {
    "product_id": 1,
    "discount": 20,
    "discountType": "percentage"
  }
}
```

BxGy coupon:
```json
{
  "type": "bxgy",
  "details": {
    "buy_products": [
      {"product_id": 1, "quantity": 3},
      {"product_id": 2, "quantity": 3}
    ],
    "get_products": [
      {"product_id": 3, "quantity": 1}
    ],
    "repetition_limit": 2
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Coupon created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "type": "cart-wise",
    "details": { ... },
    "isActive": true,
    "createdAt": "2026-01-12T10:30:00.000Z",
    "updatedAt": "2026-01-12T10:30:00.000Z"
  }
}
```

#### 2. Get All Coupons
**GET** `/coupons`

**Query Parameters:**
- `type` (optional): Filter by coupon type (cart-wise, product-wise, bxgy)
- `isActive` (optional): Filter by active status (true/false)

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "type": "cart-wise",
      "details": { ... },
      "isActive": true,
      "createdAt": "2026-01-12T10:30:00.000Z",
      "updatedAt": "2026-01-12T10:30:00.000Z"
    }
  ]
}
```

#### 3. Get Coupon by ID
**GET** `/coupons/:id`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "type": "cart-wise",
    "details": { ... },
    "isActive": true,
    "createdAt": "2026-01-12T10:30:00.000Z",
    "updatedAt": "2026-01-12T10:30:00.000Z"
  }
}
```

#### 4. Update Coupon
**PUT** `/coupons/:id`

**Request Body:**
```json
{
  "details": {
    "threshold": 150,
    "discount": 15
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Coupon updated successfully",
  "data": { ... }
}
```

#### 5. Delete Coupon
**DELETE** `/coupons/:id`

**Response:**
```json
{
  "success": true,
  "message": "Coupon deleted successfully"
}
```

### Coupon Application

#### 6. Get Applicable Coupons
**POST** `/applicable-coupons`

**Request Body:**
```json
{
  "cart": {
    "items": [
      {"product_id": 1, "quantity": 6, "price": 50},
      {"product_id": 2, "quantity": 3, "price": 30},
      {"product_id": 3, "quantity": 2, "price": 25}
    ]
  }
}
```

**Response:**
```json
{
  "applicable_coupons": [
    {
      "coupon_id": 1,
      "type": "cart-wise",
      "discount": 40
    },
    {
      "coupon_id": 3,
      "type": "bxgy",
      "discount": 50
    }
  ]
}
```

#### 7. Apply Specific Coupon
**POST** `/apply-coupon/:id`

**Request Body:**
```json
{
  "cart": {
    "items": [
      {"product_id": 1, "quantity": 6, "price": 50},
      {"product_id": 2, "quantity": 3, "price": 30},
      {"product_id": 3, "quantity": 2, "price": 25}
    ]
  }
}
```

**Response:**
```json
{
  "updated_cart": {
    "items": [
      {"product_id": 1, "quantity": 6, "price": 50, "total_discount": 0},
      {"product_id": 2, "quantity": 3, "price": 30, "total_discount": 0},
      {"product_id": 3, "quantity": 2, "price": 25, "total_discount": 50}
    ],
    "total_price": 490,
    "total_discount": 50,
    "final_price": 440
  }
}
```

---

## Coupon Cases Analysis

### Cart-wise Coupon Cases

#### ✅ Implemented Cases
1. **Basic Percentage Discount with Threshold**
   - Condition: Cart total exceeds a minimum threshold (e.g., Rs. 100)
   - Discount: Percentage off entire cart (e.g., 10%)
   - Example: Cart of Rs. 400 → 10% discount = Rs. 40 off

2. **Fixed Amount Discount with Threshold**
   - Condition: Cart total exceeds threshold
   - Discount: Fixed amount off (e.g., Rs. 50 off)
   - Example: Cart of Rs. 500 with Rs. 50 off → Final Rs. 450

#### ⏳ Not Implemented (Future Enhancements)
3. **Maximum Discount Cap**
   - Condition: Cart meets threshold
   - Discount: Percentage with max cap (e.g., 10% off, max Rs. 100)
   - Reason: Requires additional validation logic; basic implementation prioritized

4. **Minimum Items Requirement**
   - Condition: Cart must have minimum number of items (e.g., 5 items)
   - Discount: Percentage or fixed
   - Reason: Time constraint; focus on core functionality

5. **Tiered Cart Discounts**
   - Condition: Different thresholds for different discount levels
   - Example: Rs. 100-299 → 5% off, Rs. 300-499 → 10% off, Rs. 500+ → 15% off
   - Reason: Complex logic requiring threshold array and sorting

6. **Free Shipping as Cart Discount**
   - Condition: Cart total exceeds threshold
   - Discount: Free shipping (fixed amount)
   - Reason: Requires shipping cost integration; out of scope

7. **Category-based Cart Discount**
   - Condition: Cart contains items from specific category
   - Discount: Percentage off category items only
   - Reason: Requires product category metadata not in current schema

8. **Time-based Cart Discounts**
   - Condition: Happy hour/flash sale timings
   - Discount: Higher discount during specific times
   - Reason: Requires time validation and scheduling logic

#### 🔍 Edge Cases to Consider
- Cart total exactly equals threshold (should it qualify?)
- Empty cart (no coupons applicable)
- Cart total less than discount amount (cart can't be negative)
- Multiple cart-wise coupons conflict (which to apply?)
- Discount applied to pre-tax or post-tax amount?
- Rounding issues with percentage calculations

---

### Product-wise Coupon Cases

#### ✅ Implemented Cases
1. **Basic Percentage Discount on Specific Product**
   - Condition: Product is in cart
   - Discount: Percentage off that product (e.g., 20% off Product A)
   - Example: Product A at Rs. 100 → 20% off = Rs. 20 discount

2. **Fixed Amount Discount on Specific Product**
   - Condition: Product is in cart
   - Discount: Fixed amount per unit (e.g., Rs. 10 off per unit)
   - Example: 3 units of Product A → Rs. 30 total discount

#### ⏳ Not Implemented (Future Enhancements)
3. **Minimum Quantity Requirement**
   - Condition: Must buy minimum quantity (e.g., buy 3+ to get discount)
   - Discount: Applied only if quantity threshold met
   - Reason: Requires quantity validation logic; prioritized core cases

4. **Maximum Quantity Limit**
   - Condition: Discount applies to maximum N units only
   - Discount: First 5 units get discount, rest at regular price
   - Reason: Complex per-unit price calculation

5. **Bundle Discounts**
   - Condition: Buy Product A + Product B together
   - Discount: Discount on the bundle
   - Reason: Requires multi-product condition checking

6. **Incremental Quantity Discounts**
   - Condition: Buy 1-5 units → 5% off, 6-10 units → 10% off, etc.
   - Discount: Tiered based on quantity
   - Reason: Complex tiering logic with time constraints

7. **Product Category Discounts**
   - Condition: All products in category X
   - Discount: Percentage off all category items
   - Reason: Requires product category metadata

8. **Brand-specific Discounts**
   - Condition: All products from brand Y
   - Discount: Percentage off brand items
   - Reason: Requires product brand metadata

9. **Second Item Half Price**
   - Condition: Buy 2+ of same product
   - Discount: 50% off on second (and subsequent) items
   - Reason: Requires per-item discount calculation

10. **Clearance/Seasonal Discounts**
    - Condition: Products marked as clearance
    - Discount: Higher percentage off
    - Reason: Requires product status metadata

#### 🔍 Edge Cases to Consider
- Product not in cart (coupon not applicable)
- Product in cart with quantity 0 (validation needed)
- Multiple coupons for same product (conflict resolution)
- Discount per unit exceeds unit price (can't be negative)
- Product price changes during checkout
- Same product with different variants (how to identify?)

---

### BxGy (Buy X Get Y) Coupon Cases

#### ✅ Implemented Cases
1. **Basic B2G1 - Same Product**
   - Condition: Buy 2 of Product X
   - Get: 1 of Product X free
   - Example: Buy 2, get 1 free → Effective price of 3 for the price of 2
   - Repetition: Can apply multiple times based on limit

2. **B2G1 - Different Products**
   - Condition: Buy 2 from [Product X, Product Y]
   - Get: 1 from [Product A, Product B] free
   - Example: Buy X + Y, get A free
   - Repetition: Limited by repetition_limit

3. **Mix and Match from Buy Array**
   - Condition: Buy any 3 products from [X, Y, Z]
   - Get: 1 from [A, B, C] free
   - Example: Buy X + X + Y → Get A free (any combination works)

4. **Multiple Free Items**
   - Condition: Buy 6 from [X, Y, Z]
   - Get: 2 from [A, B, C] free
   - Example: With repetition_limit = 3, can get up to 6 free items

5. **Repetition Limit Enforcement**
   - Condition: Buy condition met multiple times
   - Get: Free items up to repetition limit
   - Example: Buy 10 items, but repetition_limit = 3, only 3 free items

#### ⏳ Not Implemented (Future Enhancements)
6. **Get Products Not in Cart Handling**
   - Condition: Buy products present, get products absent
   - Behavior: Add free products to cart OR mark coupon as not applicable
   - Reason: Business logic decision needed; currently assumes get products must be in cart

7. **Cheapest Item Free Strategy**
   - Condition: Buy 3 from [X, Y, Z]
   - Get: Cheapest of [A, B, C] free
   - Reason: Requires price comparison logic

8. **Most Expensive Item Free Strategy**
   - Condition: Buy high-value items
   - Get: Most expensive qualifying item free
   - Reason: Requires price sorting and selection

9. **Progressive BxGy (Tiered)**
   - Condition: Buy 2 get 1 free, Buy 4 get 2 free, Buy 6 get 3 free
   - Get: Increasing free items with more purchases
   - Reason: Complex tiering calculation

10. **BxGy with Minimum Purchase Value**
    - Condition: Buy products must total Rs. X or more
    - Get: Free items only if value threshold met
    - Reason: Additional validation layer

11. **BxGy with Product Variants**
    - Condition: Buy Product X (any size/color)
    - Get: Same product variant free
    - Reason: Requires variant matching logic

12. **Cross-category BxGy**
    - Condition: Buy from Category A
    - Get: Item from Category B free
    - Reason: Requires category metadata

13. **BxGy with Exclusions**
    - Condition: Buy from [X, Y, Z] except specific products
    - Get: Free item
    - Reason: Requires exclusion list handling

14. **Stackable BxGy**
    - Condition: Multiple BxGy coupons on same cart
    - Behavior: Apply all or pick best?
    - Reason: Complex conflict resolution

#### 🔍 Edge Cases to Consider
- Buy products in cart but insufficient quantity
- Get products not in cart at all
- Get products in cart but insufficient quantity for repetition
- Repetition limit = 0 (invalid coupon)
- Buy and get arrays contain same product
- Partial qualification (have 5, need 6 to qualify)
- Fractional repetitions (buy 7 items, need 3, can apply 2.33 times)
- Which free item to choose when multiple qualify?
- Free item quantity exceeds available cart quantity
- Applying discount to already discounted items

---

### Cross-cutting Cases (All Coupon Types)

#### ✅ Implemented
1. **Basic Validation**
   - Valid coupon type
   - Required fields present
   - Proper data types

2. **Coupon CRUD Operations**
   - Create, Read, Update, Delete
   - Unique ID generation
   - Basic error handling

#### ⏳ Not Implemented (Future Enhancements)
3. **Coupon Expiration**
   - Field: expiresAt (Date)
   - Validation: Check if current date < expiry
   - Reason: Bonus feature; can be added easily

4. **Coupon Usage Limits**
   - Field: usageLimit (total uses allowed)
   - Field: usageCount (current uses)
   - Reason: Requires usage tracking system

5. **User-specific Coupons**
   - Field: userId or userEmail
   - Validation: Check user eligibility
   - Reason: Requires user authentication system

6. **Coupon Codes**
   - Field: code (e.g., "SAVE20")
   - Usage: Users enter code at checkout
   - Reason: Requires code validation and uniqueness checks

7. **Coupon Stacking Rules**
   - Allow/Disallow multiple coupons on same cart
   - Priority system for coupon application
   - Reason: Complex business logic and conflict resolution

8. **Coupon Combination Rules**
   - Which coupons can be combined?
   - Percentage + fixed amount combinations
   - Reason: Requires rule engine

9. **Geographic Restrictions**
   - Field: regions/countries where valid
   - Validation: Check user location
   - Reason: Requires location data

10. **Payment Method Restrictions**
    - Field: validPaymentMethods
    - Condition: Discount only for credit card, etc.
    - Reason: Requires payment integration

11. **First-time User Coupons**
    - Condition: User's first purchase
    - Reason: Requires user history tracking

12. **Loyalty Program Integration**
    - Condition: User's loyalty tier
    - Discount: Varies by tier
    - Reason: Requires loyalty system

13. **Referral Coupons**
    - Condition: User referred by another
    - Discount: Both referrer and referee get discount
    - Reason: Requires referral tracking

14. **Cart Composition Rules**
    - Condition: Cart must/must not contain certain products
    - Example: Discount excludes sale items
    - Reason: Complex cart analysis

15. **Seasonal/Event-based Coupons**
    - Condition: Valid only during specific events
    - Example: Black Friday, Diwali sales
    - Reason: Requires event calendar integration

---

## Architecture & Design

### Project Structure
```
coupons-management/
├── src/
│   ├── config/
│   │   ├── database.js         # MongoDB operations layer
│   │   ├── mongodb.js          # MongoDB connection setup
│   │   └── swagger.js          # Swagger/OpenAPI configuration
│   ├── controllers/
│   │   ├── couponController.js              # CRUD endpoints
│   │   └── couponApplicationController.js   # Apply/applicable endpoints
│   ├── middleware/
│   │   └── errorHandler.js     # Centralized error handling
│   ├── models/
│   │   ├── Coupon.js           # Validation logic
│   │   └── CouponSchema.js     # Mongoose schema
│   ├── routes/
│   │   ├── couponRoutes.js                 # CRUD routes + Swagger docs
│   │   └── couponApplicationRoutes.js      # Application routes + Swagger docs
│   ├── services/
│   │   ├── couponService.js    # Business logic
│   │   ├── discountCalculator.js
│   │   └── strategies/
│   │       ├── DiscountStrategy.js      # Abstract base class
│   │       ├── CartWiseStrategy.js      # Cart-wise implementation
│   │       ├── ProductWiseStrategy.js   # Product-wise implementation
│   │       └── BxGyStrategy.js          # BxGy implementation
│   └── utils/
│       ├── errors.js           # Custom error classes
│       └── helpers.js          # Utility functions
├── tests/
│   └── strategies/
│       ├── CartWiseStrategy.test.js     # 11 unit tests
│       ├── ProductWiseStrategy.test.js  # 12 unit tests
│       └── BxGyStrategy.test.js         # 14 unit tests
├── .env                        # Environment variables (MongoDB URI)
├── .gitignore
├── index.js                    # Entry point
├── package.json
└── README.md
```

### Design Patterns

#### 1. **Strategy Pattern** (Discount Strategies)
- **Why**: Different coupon types require different discount calculations
- **Implementation**: 
  - Abstract `DiscountStrategy` base class
  - Concrete strategies: `CartWiseStrategy`, `ProductWiseStrategy`, `BxGyStrategy`
  - `DiscountCalculator` selects appropriate strategy based on coupon type
- **Benefits**: 
  - Easy to add new coupon types
  - Each strategy is independently testable
  - Single Responsibility Principle

#### 2. **Repository Pattern** (Database Layer)
- **Why**: Separate data access from business logic
- **Implementation**:
  - `database.js` provides CRUD interface
  - MongoDB operations abstracted behind async methods
  - Services don't know about database implementation details
- **Benefits**:
  - Can switch database (MongoDB → PostgreSQL) without changing business logic
  - Easy to mock for testing
  - Centralized data access

#### 3. **Service Layer** (Business Logic)
- **Why**: Keep controllers thin, business logic reusable
- **Implementation**:
  - `couponService.js` contains all business rules
  - Controllers only handle HTTP concerns
  - Validation and discount calculations in service layer
- **Benefits**:
  - Reusable business logic
  - Easier to test
  - Clear separation of concerns

### Database Schema

#### MongoDB Collection: `coupons`
```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),  // MongoDB auto-generated
  type: String,                                // "cart-wise" | "product-wise" | "bxgy"
  details: Mixed,                              // Flexible schema for different types
  isActive: Boolean,                           // Default: true
  createdAt: Date,                             // Auto-generated
  updatedAt: Date                              // Auto-updated
}
```

**Indexes:**
- `{ type: 1 }` - Fast filtering by coupon type
- `{ isActive: 1 }` - Fast filtering by active status
- `{ type: 1, isActive: 1 }` - Compound index for common queries

**Why MongoDB?**
- Flexible schema for varying coupon details (cart-wise, product-wise, bxgy have different structures)
- No need for separate tables/joins for each coupon type
- Easy to add new coupon types without migrations
- Native JSON support for nested arrays (buy_products, get_products)

### Data Flow

```
Request → Routes → Controller → Service → Database
                                   ↓
                            DiscountCalculator
                                   ↓
                            Strategy (Cart/Product/BxGy)
                                   ↓
                                Helpers
```

### Error Handling
- **Custom Error Classes**: `ValidationError`, `NotFoundError`, `BusinessLogicError`
- **Centralized Middleware**: `errorHandler.js` catches all errors
- **Consistent Format**: All errors return `{ success: false, error: { message, details } }`
- **HTTP Status Codes**: 400 (validation), 404 (not found), 500 (server error)

---

## Implemented Features

### ✅ Core Functionality
- ✅ CRUD operations for all coupon types
- ✅ Cart-wise coupon: Percentage and fixed discounts with threshold
- ✅ Product-wise coupon: Percentage and fixed discounts on specific products
- ✅ BxGy coupon: Buy X Get Y with repetition limits
- ✅ Find applicable coupons for a cart (sorted by discount amount)
- ✅ Apply specific coupon to cart with full discount breakdown
- ✅ Discount calculation for all types
- ✅ **MongoDB Atlas** cloud database integration
- ✅ **Comprehensive Testing**: 61 tests, 90.45% coverage
- ✅ **Swagger UI** interactive API documentation
- ✅ **Input validation** with detailed error messages
- ✅ **Error handling** with custom error classes
- ✅ **RESTful API design** following best practices
- ✅ **ES6 Modules** (import/export syntax)
- ✅ **Async/await** throughout codebase
- ✅ **Automatic timestamps** (createdAt, updatedAt)
- ✅ **Query optimization** with MongoDB indexes

### ⏳ Partially Implemented / Simplified
- ⏳ BxGy assumes "get" products are in cart (can be enhanced to add products)
- ⏳ Single coupon application per request (no stacking)
- ⏳ No conflict resolution for overlapping coupons (returns all applicable)

### ❌ Not Implemented (Future Enhancements)
- ❌ Coupon expiration dates (can add `expiresAt` field)
- ❌ Usage limits and tracking (requires transaction history)
- ❌ User authentication and user-specific coupons
- ❌ Coupon codes (alphanumeric redemption codes)
- ❌ Coupon stacking and combination rules
- ❌ Advanced BxGy strategies (cheapest free, most expensive free)
- ❌ Product categories and metadata
- ❌ Advanced validation (max discount cap, minimum items)
- ❌ Rate limiting for API endpoints
- ❌ Logging and monitoring

---

## Assumptions

### General Assumptions
1. **Cart Structure**: All cart items have valid `product_id`, `quantity`, and `price` fields
2. **Positive Values**: All prices and quantities are positive numbers
3. **Same Currency**: All prices are in the same currency (no conversion needed)
4. **No Tax Calculation**: Discounts applied to pre-tax amounts
5. **Integer Quantities**: Product quantities are whole numbers (though decimals work)
6. **Valid Product IDs**: Product IDs in coupons exist in the system
7. **Async Operations**: All database operations are asynchronous (async/await)
8. **Single User Context**: No multi-user or session management (for MVP)

### Cart-wise Assumptions
9. **Threshold Comparison**: If cart total equals threshold, coupon is applicable (>= logic)
10. **Discount Type**: Default is percentage unless specified as fixed
11. **Whole Cart Discount**: Discount applies to entire cart value, not individual items
12. **No Maximum Discount**: No cap on maximum discount amount (in basic implementation)

### Product-wise Assumptions
13. **Product Presence**: Coupon only applies if product is in cart
14. **All Quantities Discounted**: Discount applies to all units of the product
15. **Single Product Per Coupon**: Each product-wise coupon targets one product only

### BxGy Assumptions
16. **Get Products in Cart**: "Get" products must already be in cart to apply discount
17. **Exact Matching**: Product IDs must match exactly (no variant matching)
18. **First-in-first-out**: Free items allocated to products in order they appear
19. **Cheapest Free by Default**: When multiple get products qualify, cheapest made free
20. **Integer Repetition**: Fractional repetitions rounded down (7 items, need 3 each = 2 repetitions)
21. **Free Item Discount**: Free items have their full price as discount (100% off)

### System Assumptions
22. **MongoDB Storage**: Data persists in cloud database
23. **Network Dependency**: Requires internet connection for MongoDB Atlas
24. **ObjectId Format**: Coupon IDs are MongoDB ObjectId strings (not integers)
25. **Automatic Seeding**: Development mode seeds 3 sample coupons on startup
26. **Trusted Input**: Basic validation only, assumes inputs are mostly well-formed
27. **No Rate Limiting**: API can be called unlimited times
28. **No Authentication**: All endpoints are publicly accessible (for demo)
29. **English Language**: All text and errors in English only

---

## Limitations

### Technical Limitations
1. **MongoDB Atlas Dependency**
   - Requires internet connection for cloud database
   - Free tier has storage limits (512MB)
   - Network latency affects performance
   - Need MongoDB Atlas account

2. **No Caching**
   - Every request hits database
   - No Redis/in-memory caching layer
   - Could be optimized for frequently accessed coupons

3. **Single Instance**
   - Cannot scale horizontally without session management
   - No load balancing built-in
   - All requests handled by single Node.js process

4. **No Authentication/Authorization**
   - No user management
   - No role-based access control
   - No API key validation
   - All endpoints publicly accessible (suitable for demo/MVP)

### Business Logic Limitations
5. **Single Coupon Application**
   - Can apply only one coupon at a time
   - No coupon stacking
   - No automatic "best discount" selection

6. **No Coupon Codes**
   - Coupons referenced by ObjectId only
   - No human-readable codes (e.g., "SAVE20")
   - No code redemption flow

7. **No Usage Tracking**
   - No limit on how many times a coupon is used
   - No per-user usage limits
   - No total usage statistics

8. **No Expiration Handling**
   - Coupons don't expire (in basic implementation)
   - No time-based validation
   - No scheduling of coupon availability

9. **BxGy Constraints**
   - Assumes "get" products are in cart
   - No automatic addition of free items
   - Simple allocation strategy only
   - No handling of product variants

10. **No Product Metadata**
    - No category information
    - No brand information
    - No product attributes (size, color, etc.)
    - Limits advanced discount scenarios

11. **No Minimum/Maximum Constraints**
    - No minimum items for cart-wise discounts
    - No maximum discount caps
    - No per-product quantity limits

12. **No Conflict Resolution**
    - When multiple coupons apply to same product
    - No priority system
    - No rules for which discount takes precedence

### Data & Validation Limitations
13. **Limited Validation**
    - Basic type checking only
    - No business rule validation
    - No complex constraint checking

14. **No Data Sanitization**
    - Assumes trusted input
    - Limited SQL injection protection (not applicable with in-memory)
    - No XSS protection

15. **Rounding Issues**
    - Percentage calculations may have precision issues
    - No specified rounding strategy
    - Could lead to penny discrepancies

16. **No Currency Support**
    - Assumes single currency
    - No currency conversion
    - No currency formatting

### Performance Limitations
17. **Linear Search**
    - Finding applicable coupons is O(n)
    - No indexing on coupon properties
    - Slow with large number of coupons

18. **No Caching**
    - Recalculates discounts every time
    - No memoization of results
    - No query result caching

19. **No Pagination**
    - GET /coupons returns all coupons
    - Could be slow with many coupons
    - No limit on response size

20. **Synchronous Processing**
    - All operations block the event loop
    - No background job processing
    - No async optimization

### Error Handling Limitations
21. **Basic Error Messages**
    - Generic error responses
    - No detailed error codes
    - Limited debugging information

22. **No Retry Mechanism**
    - Failed operations not retried
    - No circuit breaker pattern
    - No graceful degradation

### Testing & Monitoring Limitations
23. **No Tests**
    - No unit tests
    - No integration tests
    - No test coverage metrics

24. **No Logging**
    - Minimal logging
    - No structured logs
    - No log aggregation

25. **No Monitoring**
    - No performance metrics
    - No health checks
    - No alerting

### Suggestions for Improvement
- Implement persistent database (MongoDB, PostgreSQL)
- Add user authentication and authorization
- Implement coupon codes and redemption flow
- Add expiration dates and usage limits
- Implement coupon stacking rules and priority system
- Add comprehensive testing suite
- Implement caching for frequently accessed coupons
- Add API rate limiting and security measures
- Implement advanced BxGy strategies
- Add logging and monitoring
- Implement pagination and filtering
- Add product metadata support
- Implement conflict resolution strategies
- Add currency support
- Implement background job processing for analytics

---

## Architecture & Design

### Project Structure
```
coupons-management/
├── src/
│   ├── controllers/      # Request handlers
│   ├── models/          # Data models and schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Helper functions
│   └── config/          # Configuration files
├── index.js            # Entry point
├── package.json
└── README.md
```

### Design Patterns

#### 1. Strategy Pattern (for Extensibility)
Different coupon types use different discount calculation strategies:
- `CartWiseStrategy`
- `ProductWiseStrategy`
- `BxGyStrategy`

This allows easy addition of new coupon types without modifying existing code.

#### 2. Service Layer Pattern
Business logic separated from controllers:
- `CouponService`: CRUD operations
- `DiscountCalculator`: Discount calculations
- `ValidationService`: Input validation

#### 3. MVC Pattern
- **Models**: Data structure definitions
- **Controllers**: Handle HTTP requests/responses
- **Services**: Business logic (View layer not applicable for API)

### Data Flow

1. **Creating a Coupon**
   ```
   Request → Route → Controller → Validation → Service → Model → Response
   ```

2. **Finding Applicable Coupons**
   ```
   Request → Route → Controller → Cart Validation → 
   Service → Strategy Selection → Discount Calculation → Response
   ```

3. **Applying a Coupon**
   ```
   Request → Route → Controller → Validation → 
   Service → Strategy → Cart Update → Response
   ```

---