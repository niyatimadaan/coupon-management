import { Router } from 'express';
const router = Router();
import couponController from '../controllers/couponController.js';

/**
 * @swagger
 * /coupons:
 *   get:
 *     summary: Get all coupons
 *     tags: [Coupons]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [cart-wise, product-wise, bxgy]
 *         description: Filter by coupon type
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *     responses:
 *       200:
 *         description: List of coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Coupon'
 */
router.get('/', couponController.getAllCoupons.bind(couponController));

/**
 * @swagger
 * /coupons/{id}:
 *   get:
 *     summary: Get a coupon by ID
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Coupon'
 *       404:
 *         description: Coupon not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', couponController.getCouponById.bind(couponController));

/**
 * @swagger
 * /coupons:
 *   post:
 *     summary: Create a new coupon
 *     tags: [Coupons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [cart-wise]
 *                   details:
 *                     $ref: '#/components/schemas/CartWiseDetails'
 *               - type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [product-wise]
 *                   details:
 *                     $ref: '#/components/schemas/ProductWiseDetails'
 *               - type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [bxgy]
 *                   details:
 *                     $ref: '#/components/schemas/BxGyDetails'
 *           examples:
 *             cart-wise:
 *               value:
 *                 type: cart-wise
 *                 details:
 *                   threshold: 100
 *                   discount: 10
 *                   discountType: percentage
 *             product-wise:
 *               value:
 *                 type: product-wise
 *                 details:
 *                   product_id: 5
 *                   discount: 20
 *                   discountType: percentage
 *             bxgy:
 *               value:
 *                 type: bxgy
 *                 details:
 *                   buy_products:
 *                     - product_id: 1
 *                       quantity: 2
 *                   get_products:
 *                     - product_id: 3
 *                       quantity: 1
 *                   repetition_limit: 2
 *     responses:
 *       201:
 *         description: Coupon created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Coupon'
 *       400:
 *         description: Invalid coupon data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', couponController.createCoupon.bind(couponController));

/**
 * @swagger
 * /coupons/{id}:
 *   put:
 *     summary: Update a coupon
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Coupon ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             details:
 *               threshold: 150
 *               discount: 15
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Coupon'
 *       404:
 *         description: Coupon not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', couponController.updateCoupon.bind(couponController));

/**
 * @swagger
 * /coupons/{id}:
 *   delete:
 *     summary: Delete a coupon
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Coupon not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', couponController.deleteCoupon.bind(couponController));

export default router;
