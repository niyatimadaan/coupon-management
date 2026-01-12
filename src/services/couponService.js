import database from '../config/database.js';
import { validateCoupon, validateCart } from '../models/Coupon.js';
import { ValidationError, NotFoundError, BusinessLogicError } from '../utils/errors.js';
import discountCalculator from './discountCalculator.js';
import { roundToTwo } from '../utils/helpers.js';

class CouponService {
  /**
   * Get all coupons with optional filtering
   * @param {Object} filters - Optional filters (type, isActive)
   * @returns {Promise<Array>} Array of coupons
   */
  async getAllCoupons(filters = {}) {
    return await database.getAll(filters);
  }

  /**
   * Get a coupon by ID
   * @param {string} id - Coupon ID
   * @returns {Promise<Object>} Coupon object
   * @throws {NotFoundError} If coupon not found
   */
  async getCouponById(id) {
    const coupon = await database.getById(id);
    
    if (!coupon) {
      throw new NotFoundError(`Coupon with ID ${id} not found`);
    }
    
    return coupon;
  }

  /**
   * Create a new coupon
   * @param {Object} couponData - Coupon data
   * @returns {Promise<Object>} Created coupon
   * @throws {ValidationError} If validation fails
   */
  async createCoupon(couponData) {
    // Validate coupon data
    const validation = validateCoupon(couponData);
    
    if (!validation.isValid) {
      throw new ValidationError('Invalid coupon data', validation.errors);
    }
    
    // Create coupon
    const newCoupon = await database.create(couponData);
    
    return newCoupon;
  }

  /**
   * Update a coupon
   * @param {string} id - Coupon ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated coupon
   * @throws {NotFoundError} If coupon not found
   * @throws {ValidationError} If validation fails
   */
  async updateCoupon(id, updateData) {
    // Check if coupon exists
    const existingCoupon = await database.getById(id);
    
    if (!existingCoupon) {
      throw new NotFoundError(`Coupon with ID ${id} not found`);
    }
    
    // Merge with existing data for validation
    const mergedData = {
      ...existingCoupon,
      ...updateData
    };
    
    // Validate merged data
    const validation = validateCoupon(mergedData);
    
    if (!validation.isValid) {
      throw new ValidationError('Invalid coupon data', validation.errors);
    }
    
    // Update coupon
    const updatedCoupon = await database.update(id, updateData);
    
    return updatedCoupon;
  }

  /**
   * Delete a coupon
   * @param {string} id - Coupon ID
   * @returns {Promise<Object>} Success message
   * @throws {NotFoundError} If coupon not found
   */
  async deleteCoupon(id) {
    // Check if coupon exists
    const existingCoupon = await database.getById(id);
    
    if (!existingCoupon) {
      throw new NotFoundError(`Coupon with ID ${id} not found`);
    }
    
    // Delete coupon
    await database.delete(id);
    
    return { message: 'Coupon deleted successfully' };
  }

  /**
   * Find all applicable coupons for a cart
   * @param {Object} cart - Cart object
   * @returns {Promise<Array>} Array of applicable coupons with discount amounts
   */
  async getApplicableCoupons(cart) {
    // Validate cart
    const cartValidation = validateCart(cart);
    if (!cartValidation.isValid) {
      throw new ValidationError('Invalid cart data', cartValidation.errors);
    }

    // Get all active coupons
    const allCoupons = await database.getAll({ isActive: true });

    // Find applicable coupons and calculate discounts
    const applicableCoupons = [];

    for (const coupon of allCoupons) {
      try {
        const isApplicable = discountCalculator.isApplicable(coupon, cart);
        
        if (isApplicable) {
          const discount = discountCalculator.calculateDiscount(coupon, cart);
          
          if (discount > 0) {
            applicableCoupons.push({
              coupon_id: coupon.id,
              type: coupon.type,
              discount: roundToTwo(discount)
            });
          }
        }
      } catch (error) {
        // Skip coupons that cause errors (invalid configuration, etc.)
        console.error(`Error checking coupon ${coupon.id}:`, error.message);
      }
    }

    // Sort by discount amount (descending)
    applicableCoupons.sort((a, b) => b.discount - a.discount);

    return applicableCoupons;
  }

  /**
   * Apply a specific coupon to the cart
   * @param {string} couponId - Coupon ID
   * @param {Object} cart - Cart object
   * @returns {Promise<Object>} Updated cart with discounts applied
   */
  async applyCoupon(couponId, cart) {
    // Validate cart
    const cartValidation = validateCart(cart);
    if (!cartValidation.isValid) {
      throw new ValidationError('Invalid cart data', cartValidation.errors);
    }

    // Get coupon
    const coupon = await database.getById(couponId);
    
    if (!coupon) {
      throw new NotFoundError(`Coupon with ID ${couponId} not found`);
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      throw new BusinessLogicError('Coupon is not active');
    }

    // Check if coupon is applicable
    const isApplicable = discountCalculator.isApplicable(coupon, cart);
    
    if (!isApplicable) {
      throw new BusinessLogicError('Coupon is not applicable to this cart');
    }

    // Apply coupon to cart
    try {
      return discountCalculator.applyToCart(coupon, cart);
    } catch (error) {
      throw new BusinessLogicError(error.message);
    }
  }
}

export default new CouponService();
