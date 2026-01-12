import { Router } from 'express';
const router = Router();
import couponApplicationController from '../controllers/couponApplicationController.js';

/**
 * @swagger
 * /applicable-coupons:
 *   post:
 *     summary: Get all applicable coupons for a cart
 *     tags: [Coupon Application]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *           example:
 *             cart:
 *               items:
 *                 - product_id: 1
 *                   quantity: 6
 *                   price: 50
 *                 - product_id: 2
 *                   quantity: 3
 *                   price: 30
 *                 - product_id: 3
 *                   quantity: 2
 *                   price: 25
 *     responses:
 *       200:
 *         description: List of applicable coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 applicable_coupons:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ApplicableCoupon'
 *       400:
 *         description: Invalid cart data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', couponApplicationController.getApplicableCoupons);

/**
 * @swagger
 * /apply-coupon/{id}:
 *   post:
 *     summary: Apply a specific coupon to the cart
 *     tags: [Coupon Application]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Coupon ID to apply
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cart'
 *           example:
 *             cart:
 *               items:
 *                 - product_id: 1
 *                   quantity: 6
 *                   price: 50
 *                 - product_id: 2
 *                   quantity: 3
 *                   price: 30
 *                 - product_id: 3
 *                   quantity: 2
 *                   price: 25
 *     responses:
 *       200:
 *         description: Updated cart after applying coupon
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 updated_cart:
 *                   $ref: '#/components/schemas/UpdatedCart'
 *       400:
 *         description: Invalid cart or coupon not applicable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Coupon not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/:id', couponApplicationController.applyCoupon);

export default router;
