import mongoose from 'mongoose';

const AdSchema = new mongoose.Schema({
  brandName: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  linkUrl: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Ad || mongoose.model('Ad', AdSchema);
