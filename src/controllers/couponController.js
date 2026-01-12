import couponService from '../services/couponService.js';

class CouponController {
  /**
   * GET /coupons - Get all coupons
   */
  async getAllCoupons(req, res, next) {
    try {
      const filters = {};
      
      // Optional query parameters for filtering
      if (req.query.type) {
        filters.type = req.query.type;
      }
      
      if (req.query.isActive !== undefined) {
        filters.isActive = req.query.isActive === 'true';
      }
      
      const coupons = await couponService.getAllCoupons(filters);
      
      res.status(200).json({
        success: true,
        count: coupons.length,
        data: coupons
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /coupons/:id - Get coupon by ID
   */
  async getCouponById(req, res, next) {
    try {
      const coupon = await couponService.getCouponById(req.params.id);
      
      res.status(200).json({
        success: true,
        data: coupon
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /coupons - Create a new coupon
   */
  async createCoupon(req, res, next) {
    try {
      const coupon = await couponService.createCoupon(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Coupon created successfully',
        data: coupon
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /coupons/:id - Update a coupon
   */
  async updateCoupon(req, res, next) {
    try {
      const coupon = await couponService.updateCoupon(req.params.id, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Coupon updated successfully',
        data: coupon
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /coupons/:id - Delete a coupon
   */
  async deleteCoupon(req, res, next) {
    try {
      const result = await couponService.deleteCoupon(req.params.id);
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CouponController();
