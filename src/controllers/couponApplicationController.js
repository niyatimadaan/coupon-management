import couponService from '../services/couponService.js';

class CouponApplicationController {
  /**
   * POST /applicable-coupons - Get all applicable coupons for a cart
   */
  async getApplicableCoupons(req, res, next) {
    try {
      const { cart } = req.body;

      if (!cart) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Cart is required in request body'
          }
        });
      }

      const applicableCoupons = await couponService.getApplicableCoupons(cart);

      res.status(200).json({
        applicable_coupons: applicableCoupons
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /apply-coupon/:id - Apply a specific coupon to cart
   */
  async applyCoupon(req, res, next) {
    try {
      const { id } = req.params;
      const { cart } = req.body;

      if (!cart) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Cart is required in request body'
          }
        });
      }

      const result = await couponService.applyCoupon(id, cart);

      res.status(200).json({
        updated_cart: result
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CouponApplicationController();
