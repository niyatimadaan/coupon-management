import CouponModel from '../models/CouponSchema.js';
import mongoose from 'mongoose';

const database = {
  /**
   * Get all coupons
   * @param {Object} filters - Optional filters (type, isActive)
   * @returns {Promise<Array>} Array of coupons
   */
  async getAll(filters = {}) {
    const query = {};

    // Filter by type
    if (filters.type) {
      query.type = filters.type;
    }

    // Filter by active status
    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    const coupons = await CouponModel.find(query).lean();
    
    // Convert MongoDB _id to id for backward compatibility
    return coupons.map(coupon => ({
      id: coupon._id.toString(),
      ...coupon,
      _id: undefined
    }));
  },

  /**
   * Get coupon by ID
   * @param {string} id - Coupon ID (MongoDB ObjectId or string)
   * @returns {Promise<Object|null>} Coupon object or null if not found
   */
  async getById(id) {
    // Handle both numeric IDs (legacy) and MongoDB ObjectIds
    let query;
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      // For backward compatibility with numeric IDs from tests
      return null;
    }

    const coupon = await CouponModel.findOne(query).lean();
    
    if (!coupon) return null;

    // Convert MongoDB _id to id for backward compatibility
    return {
      id: coupon._id.toString(),
      ...coupon,
      _id: undefined
    };
  },

  /**
   * Create a new coupon
   * @param {Object} couponData - Coupon data
   * @returns {Promise<Object>} Created coupon
   */
  async create(couponData) {
    const newCoupon = await CouponModel.create({
      type: couponData.type,
      details: couponData.details,
      isActive: couponData.isActive !== undefined ? couponData.isActive : true
    });

    // Convert to plain object and transform _id to id
    const couponObj = newCoupon.toObject();
    return {
      id: couponObj._id.toString(),
      ...couponObj,
      _id: undefined
    };
  },

  /**
   * Update a coupon
   * @param {string} id - Coupon ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object|null>} Updated coupon or null if not found
   */
  async update(id, updateData) {
    // Handle both numeric IDs (legacy) and MongoDB ObjectIds
    let query;
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      return null;
    }

    const updatedCoupon = await CouponModel.findOneAndUpdate(
      query,
      { $set: updateData },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedCoupon) return null;

    // Convert MongoDB _id to id for backward compatibility
    return {
      id: updatedCoupon._id.toString(),
      ...updatedCoupon,
      _id: undefined
    };
  },

  /**
   * Delete a coupon
   * @param {string} id - Coupon ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async delete(id) {
    // Handle both numeric IDs (legacy) and MongoDB ObjectIds
    let query;
    if (mongoose.Types.ObjectId.isValid(id)) {
      query = { _id: id };
    } else {
      return false;
    }

    const result = await CouponModel.deleteOne(query);
    return result.deletedCount > 0;
  },

  /**
   * Clear all coupons (useful for testing)
   */
  async clear() {
    await CouponModel.deleteMany({});
  },

  /**
   * Seed database with sample coupons (only if empty)
   */
  async seed() {
    // Check if database already has coupons
    const existingCoupons = await this.getAll();
    
    if (existingCoupons.length > 0) {
      console.log(`Database already has ${existingCoupons.length} coupon(s), skipping seed`);
      return;
    }

    // Cart-wise coupon: 10% off on carts over 100
    await this.create({
      type: 'cart-wise',
      details: {
        threshold: 100,
        discount: 10,
        discountType: 'percentage'
      }
    });

    // Product-wise coupon: 20% off on Product 1
    await this.create({
      type: 'product-wise',
      details: {
        product_id: 1,
        discount: 20,
        discountType: 'percentage'
      }
    });

    // BxGy coupon: Buy 2 get 1 free
    await this.create({
      type: 'bxgy',
      details: {
        buy_products: [
          { product_id: 1, quantity: 3 },
          { product_id: 2, quantity: 3 }
        ],
        get_products: [
          { product_id: 3, quantity: 1 }
        ],
        repetition_limit: 2
      }
    });

    console.log('Database seeded with 3 sample coupons');
  },

  /**
   * Reset database (useful for testing)
   */
  async reset() {
    await CouponModel.deleteMany({});
  }
};

export default database;
