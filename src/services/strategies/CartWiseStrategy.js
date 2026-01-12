import DiscountStrategy from './DiscountStrategy.js';
import { calculateCartTotal, calculatePercentageDiscount, roundToTwo, cloneCart } from '../../utils/helpers.js';

class CartWiseStrategy extends DiscountStrategy {
  /**
   * Check if cart meets threshold requirement
   */
  isApplicable(coupon, cart) {
    const cartTotal = calculateCartTotal(cart);
    return cartTotal >= coupon.details.threshold;
  }

  /**
   * Calculate cart-wise discount
   */
  calculateDiscount(coupon, cart) {
    if (!this.isApplicable(coupon, cart)) {
      return 0;
    }

    const cartTotal = calculateCartTotal(cart);
    const { discount, discountType } = coupon.details;

    let discountAmount = 0;

    if (discountType === 'fixed') {
      discountAmount = discount;
    } else {
      // Default to percentage
      discountAmount = calculatePercentageDiscount(cartTotal, discount);
    }

    // Ensure discount doesn't exceed cart total
    return roundToTwo(Math.min(discountAmount, cartTotal));
  }

  /**
   * Apply cart-wise discount to cart
   */
  applyToCart(coupon, cart) {
    const updatedCart = cloneCart(cart);
    const discountAmount = this.calculateDiscount(coupon, cart);

    if (discountAmount === 0) {
      throw new Error('Coupon not applicable to this cart');
    }

    // Initialize all items with 0 discount
    updatedCart.items = updatedCart.items.map(item => ({
      ...item,
      total_discount: 0
    }));

    // Calculate totals
    const total_price = calculateCartTotal(updatedCart);
    const total_discount = discountAmount;
    const final_price = roundToTwo(total_price - total_discount);

    return {
      items: updatedCart.items,
      total_price: roundToTwo(total_price),
      total_discount: roundToTwo(total_discount),
      final_price: roundToTwo(final_price)
    };
  }
}

export default new CartWiseStrategy();
