
class DiscountStrategy {
  /**
   * Check if coupon is applicable to the cart
   * @param {Object} coupon - Coupon object
   * @param {Object} cart - Cart object
   * @returns {boolean} True if applicable
   */
  isApplicable(coupon, cart) {
    throw new Error('isApplicable must be implemented');
  }

  /**
   * Calculate discount amount
   * @param {Object} coupon - Coupon object
   * @param {Object} cart - Cart object
   * @returns {number} Discount amount
   */
  calculateDiscount(coupon, cart) {
    throw new Error('calculateDiscount must be implemented');
  }

  /**
   * Apply coupon to cart and return updated cart
   * @param {Object} coupon - Coupon object
   * @param {Object} cart - Cart object
   * @returns {Object} Updated cart with discounts
   */
  applyToCart(coupon, cart) {
    throw new Error('applyToCart must be implemented');
  }
}

export default DiscountStrategy;
