import CartWiseStrategy from './strategies/CartWiseStrategy.js';
import ProductWiseStrategy from './strategies/ProductWiseStrategy.js';
import BxGyStrategy from './strategies/BxGyStrategy.js';
import { COUPON_TYPES } from '../models/Coupon.js';

class DiscountCalculator {
  constructor() {
    // Strategy mapping
    this.strategies = {
      [COUPON_TYPES.CART_WISE]: CartWiseStrategy,
      [COUPON_TYPES.PRODUCT_WISE]: ProductWiseStrategy,
      [COUPON_TYPES.BXGY]: BxGyStrategy
    };
  }

  /**
   * Get strategy for coupon type
   * @param {string} couponType - Type of coupon
   * @returns {Object} Strategy instance
   */
  getStrategy(couponType) {
    const strategy = this.strategies[couponType];
    if (!strategy) {
      throw new Error(`No strategy found for coupon type: ${couponType}`);
    }
    return strategy;
  }

  /**
   * Check if coupon is applicable to cart
   * @param {Object} coupon - Coupon object
   * @param {Object} cart - Cart object
   * @returns {boolean} True if applicable
   */
  isApplicable(coupon, cart) {
    const strategy = this.getStrategy(coupon.type);
    return strategy.isApplicable(coupon, cart);
  }

  /**
   * Calculate discount for a coupon
   * @param {Object} coupon - Coupon object
   * @param {Object} cart - Cart object
   * @returns {number} Discount amount
   */
  calculateDiscount(coupon, cart) {
    const strategy = this.getStrategy(coupon.type);
    return strategy.calculateDiscount(coupon, cart);
  }

  /**
   * Apply coupon to cart
   * @param {Object} coupon - Coupon object
   * @param {Object} cart - Cart object
   * @returns {Object} Updated cart
   */
  applyToCart(coupon, cart) {
    const strategy = this.getStrategy(coupon.type);
    return strategy.applyToCart(coupon, cart);
  }
}

export default new DiscountCalculator();
