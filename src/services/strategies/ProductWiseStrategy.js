import DiscountStrategy from './DiscountStrategy.js';
import { calculateCartTotal, calculatePercentageDiscount, roundToTwo, findCartItem, cloneCart } from '../../utils/helpers.js';

class ProductWiseStrategy extends DiscountStrategy {
  /**
   * Check if product is in cart
   */
  isApplicable(coupon, cart) {
    const item = findCartItem(cart, coupon.details.product_id);
    return item !== null && item.quantity > 0;
  }

  /**
   * Calculate product-wise discount
   */
  calculateDiscount(coupon, cart) {
    if (!this.isApplicable(coupon, cart)) {
      return 0;
    }

    const item = findCartItem(cart, coupon.details.product_id);
    const { discount, discountType } = coupon.details;
    const itemTotal = item.price * item.quantity;

    let discountAmount = 0;

    if (discountType === 'fixed') {
      // Fixed discount (not per unit, just fixed amount)
      discountAmount = discount;
    } else {
      // Percentage discount
      discountAmount = calculatePercentageDiscount(itemTotal, discount);
    }

    // Ensure discount doesn't exceed item total
    return roundToTwo(Math.min(discountAmount, itemTotal));
  }

  /**
   * Apply product-wise discount to cart
   */
  applyToCart(coupon, cart) {
    const updatedCart = cloneCart(cart);
    const discountAmount = this.calculateDiscount(coupon, cart);

    if (discountAmount === 0) {
      throw new Error('Coupon not applicable to this cart');
    }

    // Apply discount to specific product
    updatedCart.items = updatedCart.items.map(item => {
      if (item.product_id === coupon.details.product_id) {
        return {
          ...item,
          total_discount: discountAmount
        };
      }
      return {
        ...item,
        total_discount: 0
      };
    });

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

export default new ProductWiseStrategy();
