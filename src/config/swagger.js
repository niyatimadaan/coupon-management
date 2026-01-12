/**
 * Swagger Configuration
 * API documentation with inline definitions for Vercel compatibility
 */

const swaggerSpec = {
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
            type: 'string',
            description: 'Auto-generated MongoDB ObjectId',
            example: '507f1f77bcf86cd799439011',
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
            type: 'string',
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
  paths: {
    '/coupons': {
      get: {
        summary: 'Get all coupons',
        tags: ['Coupons'],
        parameters: [
          {
            in: 'query',
            name: 'type',
            schema: {
              type: 'string',
              enum: ['cart-wise', 'product-wise', 'bxgy'],
            },
            description: 'Filter by coupon type',
          },
          {
            in: 'query',
            name: 'isActive',
            schema: {
              type: 'boolean',
            },
            description: 'Filter by active status',
          },
        ],
        responses: {
          '200': {
            description: 'List of coupons',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    count: { type: 'integer' },
                    data: {
                      type: 'array',
                      items: { $ref: '#/components/schemas/Coupon' },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: 'Create a new coupon',
        tags: ['Coupons'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Coupon' },
              examples: {
                'cart-wise': {
                  value: {
                    type: 'cart-wise',
                    details: {
                      threshold: 100,
                      discount: 10,
                      discountType: 'percentage',
                    },
                  },
                },
                'product-wise': {
                  value: {
                    type: 'product-wise',
                    details: {
                      product_id: 5,
                      discount: 20,
                      discountType: 'fixed',
                    },
                  },
                },
                'bxgy': {
                  value: {
                    type: 'bxgy',
                    details: {
                      buy_products: [{ product_id: 1, quantity: 2 }],
                      get_products: [{ product_id: 3, quantity: 1 }],
                      repetition_limit: 2,
                    },
                  },
                },
              },
            },
          },
        },
        responses: {
          '201': {
            description: 'Coupon created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Coupon' },
                  },
                },
              },
            },
          },
          '400': {
            description: 'Invalid coupon data',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/coupons/{id}': {
      get: {
        summary: 'Get a coupon by ID',
        tags: ['Coupons'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Coupon ID',
          },
        ],
        responses: {
          '200': {
            description: 'Coupon details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Coupon' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Coupon not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      put: {
        summary: 'Update a coupon',
        tags: ['Coupons'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Coupon ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Coupon' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Coupon updated successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: { $ref: '#/components/schemas/Coupon' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Coupon not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
      delete: {
        summary: 'Delete a coupon',
        tags: ['Coupons'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Coupon ID',
          },
        ],
        responses: {
          '200': {
            description: 'Coupon deleted successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    message: { type: 'string' },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Coupon not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
    '/applicable-coupons': {
      post: {
        summary: 'Get all applicable coupons for a cart',
        tags: ['Coupon Application'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Cart' },
              example: {
                items: [
                  { product_id: 1, quantity: 6, price: 50 },
                  { product_id: 2, quantity: 3, price: 30 },
                  { product_id: 3, quantity: 2, price: 25 },
                ],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'List of applicable coupons',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        applicable_coupons: {
                          type: 'array',
                          items: { $ref: '#/components/schemas/ApplicableCoupon' },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/apply-coupon/{id}': {
      post: {
        summary: 'Apply a specific coupon to a cart',
        tags: ['Coupon Application'],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            schema: { type: 'string' },
            description: 'Coupon ID',
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Cart' },
              example: {
                items: [
                  { product_id: 1, quantity: 6, price: 50 },
                  { product_id: 2, quantity: 3, price: 30 },
                ],
              },
            },
          },
        },
        responses: {
          '200': {
            description: 'Updated cart with discount applied',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean' },
                    data: {
                      type: 'object',
                      properties: {
                        updated_cart: { $ref: '#/components/schemas/UpdatedCart' },
                      },
                    },
                  },
                },
              },
            },
          },
          '404': {
            description: 'Coupon not found',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/Error' },
              },
            },
          },
        },
      },
    },
  },
};

export default swaggerSpec;