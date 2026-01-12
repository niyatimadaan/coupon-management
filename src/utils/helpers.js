/**
 * Utility functions for discount calculations
 */

/**
 * Calculate cart total
 * @param {Object} cart - Cart object
 * @returns {number} Total cart value
 */
function calculateCartTotal(cart) {
  return cart.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
}

/**
 * Calculate percentage discount
 * @param {number} amount - Amount to discount
 * @param {number} percentage - Percentage (e.g., 10 for 10%)
 * @returns {number} Discount amount
 */
function calculatePercentageDiscount(amount, percentage) {
  return (amount * percentage) / 100;
}

/**
 * Round to 2 decimal places
 * @param {number} value - Value to round
 * @returns {number} Rounded value
 */
function roundToTwo(value) {
  return Math.round(value * 100) / 100;
}

/**
 * Find item in cart by product_id
 * @param {Object} cart - Cart object
 * @param {number} productId - Product ID
 * @returns {Object|null} Cart item or null
 */
function findCartItem(cart, productId) {
  return cart.items.find(item => item.product_id === productId) || null;
}

/**
 * Count total quantity of specific products in cart
 * @param {Object} cart - Cart object
 * @param {Array} productIds - Array of product IDs
 * @returns {number} Total quantity
 */
function countProductQuantity(cart, productIds) {
  return cart.items
    .filter(item => productIds.includes(item.product_id))
    .reduce((total, item) => total + item.quantity, 0);
}

/**
 * Get total value of specific products in cart
 * @param {Object} cart - Cart object
 * @param {Array} productIds - Array of product IDs
 * @returns {number} Total value
 */
function getProductsValue(cart, productIds) {
  return cart.items
    .filter(item => productIds.includes(item.product_id))
    .reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Clone cart object (deep copy)
 * @param {Object} cart - Cart object
 * @returns {Object} Cloned cart
 */
function cloneCart(cart) {
  return JSON.parse(JSON.stringify(cart));
}

export {
  calculateCartTotal,
  calculatePercentageDiscount,
  roundToTwo,
  findCartItem,
  countProductQuantity,
  getProductsValue,
  cloneCart
};
