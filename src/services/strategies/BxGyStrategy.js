import DiscountStrategy from './DiscountStrategy.js';
import { calculateCartTotal, roundToTwo, cloneCart } from '../../utils/helpers.js';

class BxGyStrategy extends DiscountStrategy {
  /**
   * Check if BxGy conditions are met
   */
  isApplicable(coupon, cart) {
    const { buy_products, get_products } = coupon.details;

    // Check if we have enough "buy" products
    const buyQuantity = this._countMatchingProducts(cart, buy_products);
    const requiredBuyQuantity = this._getTotalRequiredQuantity(buy_products);

    if (buyQuantity < requiredBuyQuantity) {
      return false;
    }

    // Check if we have "get" products in cart
    const getProductIds = get_products.map(p => p.product_id);
    const hasGetProducts = cart.items.some(item => getProductIds.includes(item.product_id));

    return hasGetProducts;
  }

  /**
   * Calculate BxGy discount (value of free items)
   */
  calculateDiscount(coupon, cart) {
    if (!this.isApplicable(coupon, cart)) {
      return 0;
    }

    const { buy_products, get_products, repetition_limit } = coupon.details;

    // Calculate how many times we can apply the offer
    const buyQuantity = this._countMatchingProducts(cart, buy_products);
    const requiredBuyQuantity = this._getTotalRequiredQuantity(buy_products);
    const timesQualified = Math.floor(buyQuantity / requiredBuyQuantity);
    const timesApplicable = repetition_limit !== null && repetition_limit !== undefined 
      ? Math.min(timesQualified, repetition_limit) 
      : timesQualified;

    // Calculate total free items quantity
    const freeItemsPerApplication = this._getTotalRequiredQuantity(get_products);
    const totalFreeItems = freeItemsPerApplication * timesApplicable;

    // Calculate discount value (sum of free items' prices)
    let discountAmount = 0;
    let remainingFreeItems = totalFreeItems;

    // Allocate free items from cheapest to most expensive
    const getProductIds = get_products.map(p => p.product_id);
    const availableGetItems = cart.items
      .filter(item => getProductIds.includes(item.product_id))
      .sort((a, b) => a.price - b.price); // Sort by price ascending (cheapest first)

    for (const item of availableGetItems) {
      if (remainingFreeItems <= 0) break;

      const freeQuantity = Math.min(item.quantity, remainingFreeItems);
      discountAmount += freeQuantity * item.price;
      remainingFreeItems -= freeQuantity;
    }

    return roundToTwo(discountAmount);
  }

  /**
   * Apply BxGy discount to cart
   */
  applyToCart(coupon, cart) {
    const updatedCart = cloneCart(cart);
    const discountAmount = this.calculateDiscount(coupon, cart);

    if (discountAmount === 0) {
      throw new Error('Coupon not applicable to this cart');
    }

    const { buy_products, get_products, repetition_limit } = coupon.details;

    // Calculate application details
    const buyQuantity = this._countMatchingProducts(cart, buy_products);
    const requiredBuyQuantity = this._getTotalRequiredQuantity(buy_products);
    const timesQualified = Math.floor(buyQuantity / requiredBuyQuantity);
    const timesApplicable = repetition_limit !== null && repetition_limit !== undefined 
      ? Math.min(timesQualified, repetition_limit) 
      : timesQualified;
    const freeItemsPerApplication = this._getTotalRequiredQuantity(get_products);
    const totalFreeItems = freeItemsPerApplication * timesApplicable;

    // Allocate discounts to items
    let remainingFreeItems = totalFreeItems;
    const getProductIds = get_products.map(p => p.product_id);

    updatedCart.items = updatedCart.items.map(item => {
      if (getProductIds.includes(item.product_id) && remainingFreeItems > 0) {
        const freeQuantity = Math.min(item.quantity, remainingFreeItems);
        const itemDiscount = freeQuantity * item.price;
        remainingFreeItems -= freeQuantity;

        return {
          ...item,
          total_discount: roundToTwo(itemDiscount)
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

  /**
   * Count matching products in cart
   * @private
   */
  _countMatchingProducts(cart, productSpecs) {
    const productIds = productSpecs.map(spec => spec.product_id);
    return cart.items
      .filter(item => productIds.includes(item.product_id))
      .reduce((total, item) => total + item.quantity, 0);
  }

  /**
   * Get total required quantity from product specs
   * @private
   */
  _getTotalRequiredQuantity(productSpecs) {
    return productSpecs.reduce((total, spec) => total + spec.quantity, 0);
  }
}

export default new BxGyStrategy();
