import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['cart-wise', 'product-wise', 'bxgy']
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt
});

// Indexes for better query performance
couponSchema.index({ type: 1 });
couponSchema.index({ isActive: 1 });
couponSchema.index({ type: 1, isActive: 1 });

const CouponModel = mongoose.model('Coupon', couponSchema);

export default CouponModel;
