const COUPON_TYPES = {
  CART_WISE: 'cart-wise',
  PRODUCT_WISE: 'product-wise',
  BXGY: 'bxgy'
};

const DISCOUNT_TYPES = {
  PERCENTAGE: 'percentage',
  FIXED: 'fixed'
};

/**
 * Validates cart-wise coupon details
 * @param {Object} details - Coupon details
 * @returns {Object} Validation result {isValid, errors}
 */
function validateCartWiseDetails(details) {
  const errors = [];

  if (!details.threshold || typeof details.threshold !== 'number' || details.threshold <= 0) {
    errors.push('threshold must be a positive number');
  }

  if (!details.discount || typeof details.discount !== 'number' || details.discount <= 0) {
    errors.push('discount must be a positive number');
  }

  if (details.discountType && !Object.values(DISCOUNT_TYPES).includes(details.discountType)) {
    errors.push('discountType must be "percentage" or "fixed"');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates product-wise coupon details
 * @param {Object} details - Coupon details
 * @returns {Object} Validation result {isValid, errors}
 */
function validateProductWiseDetails(details) {
  const errors = [];

  if (!details.product_id || typeof details.product_id !== 'number' || details.product_id <= 0) {
    errors.push('product_id must be a positive number');
  }

  if (!details.discount || typeof details.discount !== 'number' || details.discount <= 0) {
    errors.push('discount must be a positive number');
  }

  if (details.discountType && !Object.values(DISCOUNT_TYPES).includes(details.discountType)) {
    errors.push('discountType must be "percentage" or "fixed"');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates BxGy coupon details
 * @param {Object} details - Coupon details
 * @returns {Object} Validation result {isValid, errors}
 */
function validateBxGyDetails(details) {
  const errors = [];

  if (!details.buy_products || !Array.isArray(details.buy_products) || details.buy_products.length === 0) {
    errors.push('buy_products must be a non-empty array');
  } else {
    details.buy_products.forEach((item, index) => {
      if (!item.product_id || typeof item.product_id !== 'number' || item.product_id <= 0) {
        errors.push(`buy_products[${index}].product_id must be a positive number`);
      }
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        errors.push(`buy_products[${index}].quantity must be a positive number`);
      }
    });
  }

  if (!details.get_products || !Array.isArray(details.get_products) || details.get_products.length === 0) {
    errors.push('get_products must be a non-empty array');
  } else {
    details.get_products.forEach((item, index) => {
      if (!item.product_id || typeof item.product_id !== 'number' || item.product_id <= 0) {
        errors.push(`get_products[${index}].product_id must be a positive number`);
      }
      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        errors.push(`get_products[${index}].quantity must be a positive number`);
      }
    });
  }

  if (!details.repetition_limit || typeof details.repetition_limit !== 'number' || details.repetition_limit <= 0) {
    errors.push('repetition_limit must be a positive number');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates coupon data
 * @param {Object} couponData - Coupon data to validate
 * @returns {Object} Validation result {isValid, errors}
 */
function validateCoupon(couponData) {
  const errors = [];

  // Validate type
  if (!couponData.type || !Object.values(COUPON_TYPES).includes(couponData.type)) {
    errors.push('type must be one of: cart-wise, product-wise, bxgy');
    return { isValid: false, errors };
  }

  // Validate details exist
  if (!couponData.details || typeof couponData.details !== 'object') {
    errors.push('details must be an object');
    return { isValid: false, errors };
  }

  // Type-specific validation
  let typeValidation;
  switch (couponData.type) {
    case COUPON_TYPES.CART_WISE:
      typeValidation = validateCartWiseDetails(couponData.details);
      break;
    case COUPON_TYPES.PRODUCT_WISE:
      typeValidation = validateProductWiseDetails(couponData.details);
      break;
    case COUPON_TYPES.BXGY:
      typeValidation = validateBxGyDetails(couponData.details);
      break;
  }

  if (!typeValidation.isValid) {
    errors.push(...typeValidation.errors);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates cart structure
 * @param {Object} cart - Cart object
 * @returns {Object} Validation result {isValid, errors}
 */
function validateCart(cart) {
  const errors = [];

  if (!cart || typeof cart !== 'object') {
    errors.push('cart must be an object');
    return { isValid: false, errors };
  }

  if (!cart.items || !Array.isArray(cart.items)) {
    errors.push('cart.items must be an array');
    return { isValid: false, errors };
  }

  if (cart.items.length === 0) {
    errors.push('cart.items cannot be empty');
    return { isValid: false, errors };
  }

  cart.items.forEach((item, index) => {
    if (!item.product_id || typeof item.product_id !== 'number' || item.product_id <= 0) {
      errors.push(`cart.items[${index}].product_id must be a positive number`);
    }
    if (item.quantity === undefined || typeof item.quantity !== 'number' || item.quantity <= 0) {
      errors.push(`cart.items[${index}].quantity must be a positive number`);
    }
    if (item.price === undefined || typeof item.price !== 'number' || item.price < 0) {
      errors.push(`cart.items[${index}].price must be a non-negative number`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

export {
  COUPON_TYPES,
  DISCOUNT_TYPES,
  validateCoupon,
  validateCart,
  validateCartWiseDetails,
  validateProductWiseDetails,
  validateBxGyDetails
};
