/**
 * Swagger Configuration
 * API documentation setup using swagger-jsdoc
 */

import swaggerJsdoc from 'swagger-jsdoc';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Coupons Management API',
      version: '1.0.0',
      description: 'E-commerce coupon management system with support for cart-wise, product-wise, and BxGy coupons',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: process.env.VERCEL_URL 
          ? `https://${process.env.VERCEL_URL}` 
          : 'http://localhost:3000',
        description: process.env.VERCEL_URL ? 'Production server' : 'Development server',
      },
    ],
    tags: [
      {
        name: 'Coupons',
        description: 'CRUD operations for coupons',
      },
      {
        name: 'Coupon Application',
        description: 'Apply coupons to shopping carts',
      },
    ],
    components: {
      schemas: {
        Coupon: {
          type: 'object',
          required: ['type', 'details'],
          properties: {
            id: {
              type: 'integer',
              description: 'Auto-generated coupon ID',
              example: 1,
            },
            type: {
              type: 'string',
              enum: ['cart-wise', 'product-wise', 'bxgy'],
              description: 'Type of coupon',
              example: 'cart-wise',
            },
            details: {
              oneOf: [
                { $ref: '#/components/schemas/CartWiseDetails' },
                { $ref: '#/components/schemas/ProductWiseDetails' },
                { $ref: '#/components/schemas/BxGyDetails' },
              ],
            },
            isActive: {
              type: 'boolean',
              description: 'Whether coupon is active',
              default: true,
              example: true,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
            },
          },
        },
        CartWiseDetails: {
          type: 'object',
          required: ['threshold', 'discount', 'discountType'],
          properties: {
            threshold: {
              type: 'number',
              description: 'Minimum cart value to apply discount',
              example: 100,
            },
            discount: {
              type: 'number',
              description: 'Discount value (percentage or fixed amount)',
              example: 10,
            },
            discountType: {
              type: 'string',
              enum: ['percentage', 'fixed'],
              description: 'Type of discount',
              example: 'percentage',
            },
          },
        },
        ProductWiseDetails: {
          type: 'object',
          required: ['product_id', 'discount', 'discountType'],
          properties: {
            product_id: {
              type: 'integer',
              description: 'ID of the product to discount',
              example: 5,
            },
            discount: {
              type: 'number',
              description: 'Discount value (percentage or fixed amount)',
              example: 20,
            },
            discountType: {
              type: 'string',
              enum: ['percentage', 'fixed'],
              description: 'Type of discount',
              example: 'percentage',
            },
          },
        },
        BxGyDetails: {
          type: 'object',
          required: ['buy_products', 'get_products'],
          properties: {
            buy_products: {
              type: 'array',
              description: 'Products that must be bought',
              items: {
                type: 'object',
                required: ['product_id', 'quantity'],
                properties: {
                  product_id: {
                    type: 'integer',
                    example: 1,
                  },
                  quantity: {
                    type: 'integer',
                    example: 2,
                  },
                },
              },
            },
            get_products: {
              type: 'array',
              description: 'Products that will be free',
              items: {
                type: 'object',
                required: ['product_id', 'quantity'],
                properties: {
                  product_id: {
                    type: 'integer',
                    example: 3,
                  },
                  quantity: {
                    type: 'integer',
                    example: 1,
                  },
                },
              },
            },
            repetition_limit: {
              type: 'integer',
              description: 'Maximum times the offer can be applied',
              example: 2,
              nullable: true,
            },
          },
        },
        Cart: {
          type: 'object',
          required: ['items'],
          properties: {
            items: {
              type: 'array',
              description: 'Items in the shopping cart',
              items: {
                type: 'object',
                required: ['product_id', 'quantity', 'price'],
                properties: {
                  product_id: {
                    type: 'integer',
                    description: 'Product ID',
                    example: 1,
                  },
                  quantity: {
                    type: 'integer',
                    description: 'Quantity of the product',
                    example: 3,
                  },
                  price: {
                    type: 'number',
                    description: 'Price per unit',
                    example: 50,
                  },
                },
              },
            },
          },
        },
        UpdatedCart: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  product_id: { type: 'integer' },
                  quantity: { type: 'integer' },
                  price: { type: 'number' },
                  total_discount: { type: 'number' },
                },
              },
            },
            total_price: {
              type: 'number',
              description: 'Total price before discount',
            },
            total_discount: {
              type: 'number',
              description: 'Total discount applied',
            },
            final_price: {
              type: 'number',
              description: 'Final price after discount',
            },
          },
        },
        ApplicableCoupon: {
          type: 'object',
          properties: {
            coupon_id: {
              type: 'integer',
              description: 'Coupon ID',
            },
            type: {
              type: 'string',
              description: 'Coupon type',
            },
            discount: {
              type: 'number',
              description: 'Discount amount that would be applied',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
            errors: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'Detailed error messages',
            },
          },
        },
      },
    },
  },
  apis: [
    join(__dirname, '../routes/couponRoutes.js'),
    join(__dirname, '../routes/couponApplicationRoutes.js')
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
