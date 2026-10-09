import mongoose from 'mongoose';

const BusinessSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  whatsappNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  email: {
    type: String,
  },
  website: {
    type: String,
  },
  logo: {
    type: String,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BusinessOwner',
    default: null,
  },
  description: {
    type: String,
  },
  productsAndServices: {
    type: [String],
    default: [],
  },
  ratings: {
    type: [Number],
    default: [],
  },
  averageRating: {
    type: Number,
    default: 0.0,
  },
  totalVotes: {
    type: Number,
    default: 0,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  manualRank: {
    type: Number,
    default: null,
  },
  hasCrown: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Business || mongoose.model('Business', BusinessSchema);
